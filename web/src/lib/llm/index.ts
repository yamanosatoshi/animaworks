// ---------------------------------------------------------------------------
// LLM Provider — Factory & re-exports
// ---------------------------------------------------------------------------

export type { LLMProvider, ChatMessage, ChatRole, CompletionResult, CompletionMeta } from "./types";

import type { LLMProvider } from "./types";
import { ClaudeProvider } from "./claude-provider";
import { GeminiProvider } from "./gemini-provider";
import { OpenAIProvider } from "./openai-provider";

export { ClaudeProvider } from "./claude-provider";
export { GeminiProvider } from "./gemini-provider";
export { OpenAIProvider } from "./openai-provider";

/** Provider name as stored in the character / anima DB record */
export type ProviderName = "claude" | "gemini" | "openai";

/**
 * Factory — returns the appropriate LLMProvider for a given provider name.
 *
 * Usage:
 * ```ts
 * const provider = getProvider("claude");
 * for await (const chunk of provider.streamChat(messages, systemPrompt)) {
 *   // send chunk over SSE
 * }
 * ```
 */
export function getProvider(name: ProviderName): LLMProvider {
  switch (name) {
    case "claude":
      return new ClaudeProvider();
    case "gemini":
      return new GeminiProvider();
    case "openai":
      return new OpenAIProvider();
    default: {
      const _exhaustive: never = name;
      throw new Error(`Unknown LLM provider: ${_exhaustive}`);
    }
  }
}
