"use client";

import { useRef, useCallback } from "react";
import type { ChatMessage, BoardCharacter } from "@/types/chat";

// ---------------------------------------------------------------------------
// SSE stream hook
// ---------------------------------------------------------------------------
// Connects to an SSE endpoint to receive streaming AI responses.
// Currently uses a stub simulation — replace `SSE_ENDPOINT` and remove
// the simulation block once the real backend (Chloe) is ready.
// ---------------------------------------------------------------------------

/** Endpoint that will serve SSE events (stub for now) */
const SSE_ENDPOINT = "/api/chat/stream";

export interface UseChatStreamOptions {
  character: BoardCharacter;
  onMessage?: (partial: string, messageId: string) => void;
  onError?: (error: Event | Error) => void;
  onComplete?: (full: string, messageId: string) => void;
}

export interface UseChatStreamReturn {
  /** Start a streaming response for the given user text */
  startStream: (
    userText: string,
    setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  ) => void;
  /** Cancel the current stream */
  cancelStream: () => void;
  /** Whether a stream is currently active */
  isStreaming: boolean;
}

export function useChatStream(
  options: UseChatStreamOptions,
): UseChatStreamReturn {
  const { character, onMessage, onError, onComplete } = options;
  const streamingRef = useRef(false);
  const abortRef = useRef<(() => void) | null>(null);

  const cancelStream = useCallback(() => {
    abortRef.current?.();
    abortRef.current = null;
    streamingRef.current = false;
  }, []);

  const startStream = useCallback(
    (
      userText: string,
      setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
    ) => {
      if (streamingRef.current) return;
      streamingRef.current = true;

      const streamId = `stream-${Date.now()}`;

      // -- Stub: simulated reply (remove when backend is ready) -----------
      const replyText =
        `なるほど、「${userText.slice(0, 20)}${userText.length > 20 ? "..." : ""}」についてですね。\n\n` +
        "承知しました。少し整理してお伝えしますね。\n\n" +
        "**ポイント1**: まずは現状を整理することが大切です。\n" +
        "**ポイント2**: 次に、優先度を付けてステップバイステップで進めましょう。\n\n" +
        "詳しく掘り下げたい部分はありますか？";

      const streamMsg: ChatMessage = {
        id: streamId,
        boardId: character.id,
        senderType: "ai_host",
        senderName: character.name,
        senderAvatar: character.avatar,
        content: "",
        timestamp: new Date().toISOString(),
        llmProvider: character.llmProvider,
        isStreaming: true,
      };

      setMessages((prev) => [...prev, streamMsg]);

      let charIdx = 0;
      const interval = setInterval(() => {
        charIdx += 1 + Math.floor(Math.random() * 2);
        const done = charIdx >= replyText.length;
        const partial = done ? replyText : replyText.slice(0, charIdx);

        if (!done) {
          onMessage?.(partial, streamId);
        }

        setMessages((prev) =>
          prev.map((m) =>
            m.id === streamId
              ? { ...m, content: partial, isStreaming: !done }
              : m,
          ),
        );

        if (done) {
          clearInterval(interval);
          streamingRef.current = false;
          abortRef.current = null;
          onComplete?.(replyText, streamId);
        }
      }, 30);

      abortRef.current = () => {
        clearInterval(interval);
        streamingRef.current = false;
        // Finalise partial message
        setMessages((prev) =>
          prev.map((m) =>
            m.id === streamId ? { ...m, isStreaming: false } : m,
          ),
        );
      };
      // -- End stub -------------------------------------------------------

      // -- Real SSE (uncomment when backend is ready) ---------------------
      // const es = new EventSource(
      //   `${SSE_ENDPOINT}?boardId=${character.id}&text=${encodeURIComponent(userText)}`,
      // );
      // es.onmessage = (ev) => {
      //   const data = JSON.parse(ev.data);
      //   onMessage?.(data.content, streamId);
      //   setMessages((prev) =>
      //     prev.map((m) =>
      //       m.id === streamId ? { ...m, content: data.content } : m,
      //     ),
      //   );
      // };
      // es.addEventListener("done", (ev) => {
      //   es.close();
      //   streamingRef.current = false;
      //   const data = JSON.parse((ev as MessageEvent).data);
      //   setMessages((prev) =>
      //     prev.map((m) =>
      //       m.id === streamId
      //         ? { ...m, content: data.content, isStreaming: false }
      //         : m,
      //     ),
      //   );
      //   onComplete?.(data.content, streamId);
      // });
      // es.onerror = (err) => {
      //   es.close();
      //   streamingRef.current = false;
      //   onError?.(err);
      // };
      // abortRef.current = () => es.close();
      // -------------------------------------------------------------------
    },
    [character, onMessage, onError, onComplete],
  );

  return {
    startStream,
    cancelStream,
    isStreaming: streamingRef.current,
  };
}
