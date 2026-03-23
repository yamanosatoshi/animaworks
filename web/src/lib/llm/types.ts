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
// Tool / Function-calling types
// ---------------------------------------------------------------------------

/** Schema property for tool parameters */
export interface ToolParameterProperty {
  type: "string" | "number" | "boolean" | "array" | "object";
  description: string;
  enum?: string[];
}

/** Definition of a tool the LLM can call */
export interface ToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: "object";
    properties: Record<string, ToolParameterProperty>;
    required: string[];
  };
}

/** A tool call requested by the LLM */
export interface ToolCall {
  name: string;
  args: Record<string, unknown>;
}

/** Result of executing a tool call */
export interface ToolResult {
  name: string;
  result: unknown;
}

/**
 * Events yielded during a streamChatWithTools session.
 * - "text"       : streamed text chunk from the LLM
 * - "tool_call"  : LLM wants to call a tool (caller should execute & feed back)
 * - "tool_result": tool result has been fed back to the LLM
 */
export type ToolStreamEvent =
  | { type: "text"; content: string }
  | { type: "tool_call"; call: ToolCall }
  | { type: "tool_result"; result: ToolResult };

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

  /**
   * Stream a chat completion with function-calling (tool use).
   * Handles the tool-call loop internally:
   *   1. Send messages to LLM
   *   2. If LLM returns a function call → execute via toolExecutor → feed result back
   *   3. Repeat until LLM returns final text
   * Yields ToolStreamEvents so the caller can track progress.
   */
  streamChatWithTools?(
    messages: ChatMessage[],
    systemPrompt: string,
    tools: ToolDefinition[],
    toolExecutor: (call: ToolCall) => Promise<unknown>,
  ): AsyncGenerator<ToolStreamEvent, void, unknown>;
}
