// ---------------------------------------------------------------------------
// StorageProvider — Abstract interface for chat persistence
// ---------------------------------------------------------------------------
//
// Abstracts away the underlying data store (Supabase, Postgres, etc.)
// so the API layer stays storage-agnostic.
// ---------------------------------------------------------------------------

/** Stored message record */
export interface StoredMessage {
  id: string;
  roomId: string;
  senderType: "user" | "ai_host" | "ai_guest";
  senderName: string;
  senderAvatar?: string;
  content: string;
  llmProvider?: string;
  createdAt: string; // ISO 8601
}

/** Room / conversation record */
export interface Room {
  id: string;
  animaId: string;
  userId: string;
  title?: string;
  createdAt: string;
  updatedAt: string;
}

/** Anima (character) record stored in DB */
export interface StoredAnima {
  id: string;
  name: string;
  description: string;
  avatar: string;
  avatarColor: string;
  llmProvider: "claude" | "gemini" | "openai";
  systemPrompt: string;
  status: "online" | "offline" | "busy";
  tags: string[];
  messageCount: number;
  followerCount: number;
}

/** Pagination options */
export interface PaginationOptions {
  limit?: number;
  offset?: number;
  /** Cursor-based pagination (message ID) */
  before?: string;
}

// ---------------------------------------------------------------------------
// Abstract interface
// ---------------------------------------------------------------------------

export interface StorageProvider {
  // -- Messages -------------------------------------------------------------
  /** Fetch messages for a room, newest first */
  getMessages(roomId: string, opts?: PaginationOptions): Promise<StoredMessage[]>;

  /** Persist a new message and return the stored record */
  saveMessage(roomId: string, message: Omit<StoredMessage, "id" | "createdAt">): Promise<StoredMessage>;

  // -- Rooms ----------------------------------------------------------------
  /** Get room by ID */
  getRoom(roomId: string): Promise<Room | null>;

  /** Create a new room */
  createRoom(animaId: string, userId: string): Promise<Room>;

  // -- Animas (characters) --------------------------------------------------
  /** List all animas */
  listAnimas(): Promise<StoredAnima[]>;

  /** Get a single anima by ID */
  getAnima(animaId: string): Promise<StoredAnima | null>;
}
