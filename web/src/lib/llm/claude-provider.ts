// ---------------------------------------------------------------------------
// ClaudeProvider — Anthropic Claude SDK wrapper
// ---------------------------------------------------------------------------

import type {
  ChatMessage,
  CompletionResult,
  LLMProvider,
} from "./types";

/**
 * ClaudeProvider uses the `@anthropic-ai/sdk` package.
 *
 * NOTE: The actual SDK import is lazy-loaded to avoid hard crashes when
 * the package isn't installed yet (stub / development mode).
 */
export class ClaudeProvider implements LLMProvider {
  readonly name = "claude" as const;
  private model: string;
  private apiKey: string;

  constructor(opts?: { model?: string; apiKey?: string }) {
    this.model = opts?.model ?? "claude-sonnet-4-20250514";
    this.apiKey = opts?.apiKey ?? process.env.ANTHROPIC_API_KEY ?? "";
  }

  // -------------------------------------------------------------------------
  // streamChat
  // -------------------------------------------------------------------------
  async *streamChat(
    messages: ChatMessage[],
    systemPrompt: string,
  ): AsyncGenerator<string, void, unknown> {
    const Anthropic = await this.loadSdk();
    const client = new Anthropic({ apiKey: this.apiKey });

    const anthropicMessages = messages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

    const stream = client.messages.stream({
      model: this.model,
      max_tokens: 4096,
      system: systemPrompt,
      messages: anthropicMessages,
    });

    for await (const event of stream) {
      if (
        event.type === "content_block_delta" &&
        event.delta.type === "text_delta"
      ) {
        yield event.delta.text;
      }
    }
  }

  // -------------------------------------------------------------------------
  // completeChat
  // -------------------------------------------------------------------------
  async completeChat(
    messages: ChatMessage[],
    systemPrompt: string,
  ): Promise<CompletionResult> {
    const Anthropic = await this.loadSdk();
    const client = new Anthropic({ apiKey: this.apiKey });

    const anthropicMessages = messages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

    const response = await client.messages.create({
      model: this.model,
      max_tokens: 4096,
      system: systemPrompt,
      messages: anthropicMessages,
    });

    const text = response.content
      .filter((block: { type: string }) => block.type === "text")
      .map((block: { type: string; text: string }) => block.text)
      .join("");

    return {
      content: text,
      meta: {
        provider: this.name,
        model: response.model,
        usage: {
          promptTokens: response.usage.input_tokens,
          completionTokens: response.usage.output_tokens,
          totalTokens:
            response.usage.input_tokens + response.usage.output_tokens,
        },
      },
    };
  }

  // -------------------------------------------------------------------------
  // SDK loader (lazy)
  // -------------------------------------------------------------------------
  private async loadSdk() {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const mod = await import("@anthropic-ai/sdk");
      return mod.default;
    } catch {
      throw new Error(
        "ClaudeProvider requires @anthropic-ai/sdk. Run: npm install @anthropic-ai/sdk",
      );
    }
  }
}
