"use client";

import { useEffect, useRef, useCallback } from "react";
import type { ChatMessage, LLMProvider } from "@/types/chat";

// ---------------------------------------------------------------------------
// Polling hook — checks for new messages from other users / AI guests
// ---------------------------------------------------------------------------
// Polls GET /api/rooms/[roomId]/messages every `intervalMs` (default 3 000 ms).
// The response contains all messages in the room. The hook filters messages
// newer than the last poll and deduplicates against existing local messages.
// ---------------------------------------------------------------------------

/** Backend stored message shape (matches StoredMessage from storage/types) */
interface StoredMessageResponse {
  id: string;
  roomId: string;
  senderType: "user" | "ai_host" | "ai_guest";
  senderName: string;
  senderAvatar?: string;
  content: string;
  llmProvider?: string;
  createdAt: string;
}

/** Convert backend message to frontend ChatMessage */
function toFrontendMessage(msg: StoredMessageResponse): ChatMessage {
  return {
    id: msg.id,
    boardId: msg.roomId,
    senderType: msg.senderType,
    senderName: msg.senderName,
    senderAvatar: msg.senderAvatar,
    content: msg.content,
    timestamp: msg.createdAt,
    llmProvider: msg.llmProvider as LLMProvider | undefined,
  };
}

export interface UseChatPollingOptions {
  /** Room ID to poll (used as /api/rooms/[id]/messages) */
  boardId: string;
  /** Polling interval in ms (default: 3000) */
  intervalMs?: number;
  /** Whether polling is enabled */
  enabled?: boolean;
  /** Callback when new messages arrive */
  onNewMessages?: (messages: ChatMessage[]) => void;
}

export interface UseChatPollingReturn {
  /** Manually trigger a poll */
  pollNow: () => Promise<void>;
}

/**
 * Fetch messages from the backend for the given room.
 * Filters by sinceTimestamp to only return new messages.
 */
async function fetchNewMessages(
  boardId: string,
  sinceTimestamp: string,
): Promise<ChatMessage[]> {
  try {
    const res = await fetch(`/api/rooms/${boardId}/messages`);
    if (!res.ok) return [];

    const data: { messages: StoredMessageResponse[] } = await res.json();
    const messages = data.messages ?? [];

    // Filter to only messages created after sinceTimestamp
    return messages
      .filter((m) => m.createdAt > sinceTimestamp)
      .map(toFrontendMessage);
  } catch {
    return [];
  }
}

export function useChatPolling(
  options: UseChatPollingOptions,
): UseChatPollingReturn {
  const { boardId, intervalMs = 3000, enabled = true, onNewMessages } = options;
  const lastPollRef = useRef<string>(new Date().toISOString());
  const callbackRef = useRef(onNewMessages);
  callbackRef.current = onNewMessages;

  const pollNow = useCallback(async () => {
    const msgs = await fetchNewMessages(boardId, lastPollRef.current);
    lastPollRef.current = new Date().toISOString();
    if (msgs.length > 0) {
      callbackRef.current?.(msgs);
    }
  }, [boardId]);

  useEffect(() => {
    if (!enabled) return;

    const id = setInterval(() => {
      pollNow();
    }, intervalMs);

    return () => clearInterval(id);
  }, [enabled, intervalMs, pollNow]);

  return { pollNow };
}
