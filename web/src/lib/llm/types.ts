// ---------------------------------------------------------------------------
// LLMProvider — Abstract interface for multi-LLM chat completion
// ---------------------------------------------------------------------------
//
// Each provider wraps a different LLM SDK (Anthropic, Google, OpenAI) behind
// a unified interface so the rest of the app stays provider-agnostic.
// ---------------------------------------------------------------------------

/** Chat message role understood by all providers */
export type ChatRole = "user" | "assistant" | "system";

/** A single message in the conversation history */
export interface ChatMessage {
  role: ChatRole;
  content: string;
}

/** Metadata returned alongside a completion */
export interface CompletionMeta {
  /** Provider that generated the response */
  provider: string;
  /** Model identifier actually used */
  model: string;
  /** Token usage (best-effort; not every provider returns this) */
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
}

/** Result from a non-streaming completion */
export interface CompletionResult {
  content: string;
  meta: CompletionMeta;
}

// ---------------------------------------------------------------------------
// Abstract interface
// ---------------------------------------------------------------------------

export interface LLMProvider {
  /** Human-readable provider name (e.g. "claude", "gemini", "openai") */
  readonly name: string;

  /**
   * Stream a chat completion.
   * Yields content chunks as they arrive from the upstream API.
   */
  streamChat(
    messages: ChatMessage[],
    systemPrompt: string,
  ): AsyncGenerator<string, void, unknown>;

  /**
   * Non-streaming chat completion.
   * Returns the full response once it's ready.
   */
  completeChat(
    messages: ChatMessage[],
    systemPrompt: string,
  ): Promise<CompletionResult>;
}
