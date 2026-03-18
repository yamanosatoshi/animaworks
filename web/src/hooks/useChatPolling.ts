"use client";

import { useEffect, useRef, useCallback } from "react";
import type { ChatMessage } from "@/types/chat";

// ---------------------------------------------------------------------------
// Polling hook — checks for new messages from other users / AI guests
// ---------------------------------------------------------------------------
// Polls a REST endpoint every `intervalMs` (default 2 000 ms).
// Currently returns an empty array (stub). Replace `fetchNewMessages`
// body once the real backend (Chloe) is ready.
// ---------------------------------------------------------------------------

/** Endpoint to poll for new messages */
const POLL_ENDPOINT = "/api/chat/messages";

export interface UseChatPollingOptions {
  /** Board / room ID to poll */
  boardId: string;
  /** Polling interval in ms (default: 2000) */
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
 * Stub: fetch new messages since the given timestamp.
 * Replace this body with a real fetch call when the backend is ready.
 */
async function fetchNewMessages(
  _boardId: string,
  _sinceTimestamp: string,
): Promise<ChatMessage[]> {
  // -- Real implementation (uncomment when backend is ready) --------------
  // const res = await fetch(
  //   `${POLL_ENDPOINT}?boardId=${boardId}&since=${encodeURIComponent(sinceTimestamp)}`,
  // );
  // if (!res.ok) return [];
  // return res.json();
  // -----------------------------------------------------------------------

  return []; // Stub: no new messages
}

export function useChatPolling(
  options: UseChatPollingOptions,
): UseChatPollingReturn {
  const { boardId, intervalMs = 2000, enabled = true, onNewMessages } = options;
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
