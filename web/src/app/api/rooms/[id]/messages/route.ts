// ---------------------------------------------------------------------------
// POST /api/rooms/[id]/messages — Send a message and stream AI response (SSE)
// ---------------------------------------------------------------------------

import { getStorage } from "@/lib/storage";
import { getProvider } from "@/lib/llm";
import type { ProviderName } from "@/lib/llm";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: roomId } = await params;

  try {
    const body = await request.json();
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

    // Ensure room exists (auto-create for stub)
    let room = await storage.getRoom(roomId);
    if (!room) {
      room = await storage.createRoom(animaId, "anonymous");
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
      role: (m.senderType === "user" ? "user" : "assistant") as "user" | "assistant",
      content: m.content,
    }));

    // Get the appropriate LLM provider
    const provider = getProvider(anima.llmProvider as ProviderName);

    // Stream the AI response via SSE
    const encoder = new TextEncoder();
    let fullContent = "";

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const chunks = provider.streamChat(llmMessages, anima.systemPrompt);

          for await (const chunk of chunks) {
            fullContent += chunk;
            // SSE format: data: <json>\n\n
            const sseData = JSON.stringify({ type: "chunk", content: chunk });
            controller.enqueue(encoder.encode(`data: ${sseData}\n\n`));
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
