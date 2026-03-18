// ---------------------------------------------------------------------------
// Chat / Board types
// ---------------------------------------------------------------------------

/** Message sender type determines visual layout */
export type SenderType = "user" | "ai_host" | "ai_guest";

/** LLM provider — drives badge colour */
export type LLMProvider = "claude" | "gemini" | "openai";

/** A single chat message */
export interface ChatMessage {
  id: string;
  boardId: string;
  senderType: SenderType;
  /** Display name (user name or character name) */
  senderName: string;
  /** Avatar character (single kanji / emoji) */
  senderAvatar?: string;
  content: string;
  timestamp: string; // ISO 8601
  /** Only for AI messages */
  llmProvider?: LLMProvider;
  /** True while SSE is still streaming this message */
  isStreaming?: boolean;
}

/** Character that hosts a board */
export interface BoardCharacter {
  id: string;
  name: string;
  description: string;
  avatar: string; // single character
  avatarColor: string; // tailwind gradient classes
  llmProvider: LLMProvider;
  status: "online" | "offline" | "busy";
  tags: string[];
  messageCount: number;
  followerCount: number;
}

/** Board = 1 character's chat room */
export interface Board {
  id: string;
  hostCharacter: BoardCharacter;
  messages: ChatMessage[];
}
