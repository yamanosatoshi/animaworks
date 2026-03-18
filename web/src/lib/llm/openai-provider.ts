// ---------------------------------------------------------------------------
// OpenAIProvider — OpenAI SDK wrapper
// ---------------------------------------------------------------------------

import type {
  ChatMessage,
  CompletionResult,
  LLMProvider,
} from "./types";

/**
 * OpenAIProvider wraps the `openai` npm package.
 *
 * SDK is lazy-loaded to avoid hard crashes when the package isn't installed.
 */
export class OpenAIProvider implements LLMProvider {
  readonly name = "openai" as const;
  private model: string;
  private apiKey: string;

  constructor(opts?: { model?: string; apiKey?: string }) {
    this.model = opts?.model ?? "gpt-4o";
    this.apiKey = opts?.apiKey ?? process.env.OPENAI_API_KEY ?? "";
  }

  // -------------------------------------------------------------------------
  // streamChat
  // -------------------------------------------------------------------------
  async *streamChat(
    messages: ChatMessage[],
    systemPrompt: string,
  ): AsyncGenerator<string, void, unknown> {
    const OpenAI = await this.loadSdk();
    const client = new OpenAI({ apiKey: this.apiKey });

    const openaiMessages = [
      { role: "system" as const, content: systemPrompt },
      ...messages.map((m) => ({
        role: m.role as "user" | "assistant" | "system",
        content: m.content,
      })),
    ];

    const stream = await client.chat.completions.create({
      model: this.model,
      messages: openaiMessages,
      stream: true,
    });

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) yield delta;
    }
  }

  // -------------------------------------------------------------------------
  // completeChat
  // -------------------------------------------------------------------------
  async completeChat(
    messages: ChatMessage[],
    systemPrompt: string,
  ): Promise<CompletionResult> {
    const OpenAI = await this.loadSdk();
    const client = new OpenAI({ apiKey: this.apiKey });

    const openaiMessages = [
      { role: "system" as const, content: systemPrompt },
      ...messages.map((m) => ({
        role: m.role as "user" | "assistant" | "system",
        content: m.content,
      })),
    ];

    const response = await client.chat.completions.create({
      model: this.model,
      messages: openaiMessages,
    });

    const text = response.choices[0]?.message?.content ?? "";

    return {
      content: text,
      meta: {
        provider: this.name,
        model: response.model,
        usage: {
          promptTokens: response.usage?.prompt_tokens,
          completionTokens: response.usage?.completion_tokens,
          totalTokens: response.usage?.total_tokens,
        },
      },
    };
  }

  // -------------------------------------------------------------------------
  // SDK loader (lazy)
  // -------------------------------------------------------------------------
  private async loadSdk() {
    try {
      const mod = await import("openai");
      return mod.default;
    } catch {
      throw new Error(
        "OpenAIProvider requires openai. Run: npm install openai",
      );
    }
  }
}
