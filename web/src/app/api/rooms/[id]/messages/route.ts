// ---------------------------------------------------------------------------
// POST /api/rooms/[id]/messages — Send a message and stream AI response (SSE)
// ---------------------------------------------------------------------------

import { getStorage } from "@/lib/storage";
import { GeminiProvider } from "@/lib/llm";
import type { ToolDefinition, ToolCall } from "@/lib/llm";
import * as fs from "fs";
import * as path from "path";

// ---------------------------------------------------------------------------
// Tool definitions — what the LLM can call
// ---------------------------------------------------------------------------

const TOOL_DEFINITIONS: ToolDefinition[] = [
  {
    name: "list_tasks",
    description:
      "ユーザーのタスク一覧を取得する。未対応・進行中・完了などのステータスごとに確認できる。",
    parameters: {
      type: "object",
      properties: {
        status: {
          type: "string",
          description:
            "フィルタするステータス（not_started, in_progress, done）。省略時は全件取得。",
          enum: ["not_started", "in_progress", "done"],
        },
      },
      required: [],
    },
  },
  {
    name: "search_codebase",
    description:
      "プロジェクトのソースコード（src/以下）をキーワード検索し、関連するコードの箇所を返す。APIの仕様や実装方法について質問されたときに使う。",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "検索キーワード（正規表現ではなく単純な文字列マッチ）",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "get_team_members",
    description:
      "チームメンバー（Anima）の一覧を取得する。名前・説明・タグ・ステータスを確認できる。",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
  },
];

// ---------------------------------------------------------------------------
// Tool executor — dispatches tool calls to actual implementations
// ---------------------------------------------------------------------------

async function executeToolCall(
  call: ToolCall,
): Promise<unknown> {
  switch (call.name) {
    case "list_tasks":
      return executeListTasks(call.args);
    case "search_codebase":
      return executeSearchCodebase(call.args);
    case "get_team_members":
      return executeGetTeamMembers();
    default:
      return { error: `Unknown tool: ${call.name}` };
  }
}

// -- list_tasks ---------------------------------------------------------------

async function executeListTasks(
  args: Record<string, unknown>,
): Promise<unknown> {
  try {
    const supabase = getSupabaseClient();
    let query = supabase
      .from("tasks")
      .select("text, status, assignee_name")
      .order("created_at", { ascending: false })
      .limit(20);

    if (args.status && typeof args.status === "string") {
      query = query.eq("status", args.status);
    }

    const { data, error } = await query;
    if (error) throw error;

    return { tasks: data ?? [] };
  } catch {
    // Fallback: try storage (in-memory)
    return { tasks: [], note: "タスクストレージに接続できませんでした" };
  }
}

function getSupabaseClient() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getSupabaseClient } = require("@/lib/supabase");
  return getSupabaseClient();
}

// -- search_codebase ----------------------------------------------------------

function executeSearchCodebase(
  args: Record<string, unknown>,
): { results: Array<{ file: string; matches: string[] }> } {
  const query = String(args.query ?? "").toLowerCase();
  if (!query) return { results: [] };

  const srcDir = path.resolve(process.cwd(), "src");
  const results: Array<{ file: string; matches: string[] }> = [];

  // Recursively walk src/ and grep for the query
  const walk = (dir: string) => {
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Skip node_modules, .next, etc.
        if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
        walk(fullPath);
      } else if (
        entry.isFile() &&
        /\.(ts|tsx|js|jsx|json|css|md)$/.test(entry.name)
      ) {
        try {
          const content = fs.readFileSync(fullPath, "utf-8");
          const lines = content.split("\n");
          const matchingLines: string[] = [];

          for (let i = 0; i < lines.length; i++) {
            if (lines[i].toLowerCase().includes(query)) {
              // Include line number and surrounding context
              matchingLines.push(`L${i + 1}: ${lines[i].trimEnd()}`);
              if (matchingLines.length >= 5) break; // Max 5 matches per file
            }
          }

          if (matchingLines.length > 0) {
            const relativePath = path.relative(srcDir, fullPath);
            results.push({
              file: `src/${relativePath}`,
              matches: matchingLines,
            });
          }
        } catch {
          // Skip unreadable files
        }
      }
    }
  };

  walk(srcDir);

  // Return top 5 files with most matches
  results.sort((a, b) => b.matches.length - a.matches.length);
  return { results: results.slice(0, 5) };
}

// -- get_team_members ---------------------------------------------------------

async function executeGetTeamMembers(): Promise<unknown> {
  const storage = getStorage();
  const animas = await storage.listAnimas();

  return {
    members: animas.map(({ systemPrompt: _, ...rest }) => ({
      name: rest.name,
      description: rest.description,
      tags: rest.tags,
      status: rest.status,
    })),
  };
}

// ---------------------------------------------------------------------------
// POST handler
// ---------------------------------------------------------------------------

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: roomId } = await params;

  try {
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid or empty JSON body" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }
    const { content, animaId } = body as {
      content: string;
      animaId: string;
    };

    if (!content || !animaId) {
      return new Response(
        JSON.stringify({ error: "content and animaId are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const storage = getStorage();

    // Ensure room exists (auto-create if first message)
    let room = await storage.getRoom(roomId);
    if (!room) {
      room = await storage.createRoom(animaId, "anonymous", roomId);
    }

    // Fetch anima for system prompt & LLM provider
    const anima = await storage.getAnima(animaId);
    if (!anima) {
      return new Response(
        JSON.stringify({ error: "Anima not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    // Save user message
    await storage.saveMessage(roomId, {
      roomId,
      senderType: "user",
      senderName: "ユーザー",
      content,
    });

    // Build conversation history for the LLM
    const storedMessages = await storage.getMessages(roomId);
    const llmMessages = storedMessages.map((m) => ({
      role: (m.senderType === "user" ? "user" : "assistant") as
        | "user"
        | "assistant",
      content: m.content,
    }));

    // LLM provider — Gemini 固定（1プロバイダー・1モデル）
    const provider = new GeminiProvider();

    // Stream the AI response via SSE (with function-calling support)
    const encoder = new TextEncoder();
    let fullContent = "";

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Use streamChatWithTools if available (function calling)
          if (provider.streamChatWithTools) {
            const events = provider.streamChatWithTools(
              llmMessages,
              anima.systemPrompt,
              TOOL_DEFINITIONS,
              executeToolCall,
            );

            for await (const event of events) {
              switch (event.type) {
                case "tool_call": {
                  // Send a progress hint to the user while tool executes
                  const toolHints: Record<string, string> = {
                    list_tasks: "📋 タスクを確認しています...",
                    search_codebase: "🔍 コードを検索しています...",
                    get_team_members: "👥 メンバー情報を取得しています...",
                  };
                  const hint =
                    toolHints[event.call.name] ?? "🔧 ツールを実行しています...";
                  const hintData = JSON.stringify({
                    type: "chunk",
                    content: hint + "\n\n",
                  });
                  controller.enqueue(encoder.encode(`data: ${hintData}\n\n`));
                  break;
                }
                case "tool_result":
                  // Tool result is fed back to LLM internally — no SSE needed
                  break;
                case "text":
                  fullContent += event.content;
                  const chunkData = JSON.stringify({
                    type: "chunk",
                    content: event.content,
                  });
                  controller.enqueue(encoder.encode(`data: ${chunkData}\n\n`));
                  break;
              }
            }
          } else {
            // Fallback: plain streaming without tools
            const chunks = provider.streamChat(llmMessages, anima.systemPrompt);
            for await (const chunk of chunks) {
              fullContent += chunk;
              const sseData = JSON.stringify({
                type: "chunk",
                content: chunk,
              });
              controller.enqueue(encoder.encode(`data: ${sseData}\n\n`));
            }
          }

          // Save the complete AI message
          const savedAiMessage = await storage.saveMessage(roomId, {
            roomId,
            senderType: "ai_host",
            senderName: anima.name,
            senderAvatar: anima.avatar,
            content: fullContent,
            llmProvider: anima.llmProvider,
          });

          // Send completion event
          const doneData = JSON.stringify({
            type: "done",
            messageId: savedAiMessage.id,
            content: fullContent,
          });
          controller.enqueue(encoder.encode(`data: ${doneData}\n\n`));
          controller.close();
        } catch (err) {
          const errorData = JSON.stringify({
            type: "error",
            error: err instanceof Error ? err.message : "Stream failed",
          });
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    console.error("[POST /api/rooms/[id]/messages]", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}

// Also support GET to fetch message history
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: roomId } = await params;

  try {
    const storage = getStorage();
    const messages = await storage.getMessages(roomId);
    return new Response(JSON.stringify({ messages }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[GET /api/rooms/[id]/messages]", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch messages" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
