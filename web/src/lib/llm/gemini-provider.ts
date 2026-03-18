// ---------------------------------------------------------------------------
// GeminiProvider — Google Generative AI SDK wrapper
// ---------------------------------------------------------------------------

import type {
  ChatMessage,
  CompletionResult,
  LLMProvider,
} from "./types";

/**
 * GeminiProvider wraps `@google/generative-ai`.
 *
 * SDK is lazy-loaded so the provider can be referenced even when the
 * package isn't installed (useful during development / testing).
 */
export class GeminiProvider implements LLMProvider {
  readonly name = "gemini" as const;
  private model: string;
  private apiKey: string;

  constructor(opts?: { model?: string; apiKey?: string }) {
    this.model = opts?.model ?? "gemini-2.5-flash";
    this.apiKey = opts?.apiKey ?? process.env.GOOGLE_AI_API_KEY ?? "";
  }

  // -------------------------------------------------------------------------
  // streamChat
  // -------------------------------------------------------------------------
  async *streamChat(
    messages: ChatMessage[],
    systemPrompt: string,
  ): AsyncGenerator<string, void, unknown> {
    const { GoogleGenerativeAI } = await this.loadSdk();
    const genAI = new GoogleGenerativeAI(this.apiKey);
    const model = genAI.getGenerativeModel({
      model: this.model,
      systemInstruction: systemPrompt,
    });

    const history = messages.slice(0, -1).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const lastMessage = messages[messages.length - 1];
    const chat = model.startChat({ history });

    const result = await chat.sendMessageStream(lastMessage.content);

    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) yield text;
    }
  }

  // -------------------------------------------------------------------------
  // completeChat
  // -------------------------------------------------------------------------
  async completeChat(
    messages: ChatMessage[],
    systemPrompt: string,
  ): Promise<CompletionResult> {
    const { GoogleGenerativeAI } = await this.loadSdk();
    const genAI = new GoogleGenerativeAI(this.apiKey);
    const model = genAI.getGenerativeModel({
      model: this.model,
      systemInstruction: systemPrompt,
    });

    const history = messages.slice(0, -1).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const lastMessage = messages[messages.length - 1];
    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastMessage.content);
    const text = result.response.text();

    return {
      content: text,
      meta: {
        provider: this.name,
        model: this.model,
        usage: {
          promptTokens: result.response.usageMetadata?.promptTokenCount,
          completionTokens: result.response.usageMetadata?.candidatesTokenCount,
          totalTokens: result.response.usageMetadata?.totalTokenCount,
        },
      },
    };
  }

  // -------------------------------------------------------------------------
  // SDK loader (lazy)
  // -------------------------------------------------------------------------
  private async loadSdk() {
    try {
      return await import("@google/generative-ai");
    } catch {
      throw new Error(
        "GeminiProvider requires @google/generative-ai. Run: npm install @google/generative-ai",
      );
    }
  }
}
