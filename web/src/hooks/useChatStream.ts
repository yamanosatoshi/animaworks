"use client";

import { useRef, useCallback, useState } from "react";
import type { ChatMessage, BoardCharacter } from "@/types/chat";

// ---------------------------------------------------------------------------
// SSE stream hook — connects to POST /api/rooms/[roomId]/messages
// ---------------------------------------------------------------------------
// Sends the user message to the backend and reads the SSE response stream.
// The backend saves the user message, invokes the LLM, and streams chunks
// back as SSE events: { type: "chunk" | "done" | "error", ... }
// ---------------------------------------------------------------------------

export interface UseChatStreamOptions {
  character: BoardCharacter;
  /** Room ID used as the URL parameter for /api/rooms/[id]/messages */
  roomId: string;
  onMessage?: (partial: string, messageId: string) => void;
  onError?: (error: Error) => void;
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
  /** Whether a stream is currently active (reactive state) */
  isStreaming: boolean;
}

export function useChatStream(
  options: UseChatStreamOptions,
): UseChatStreamReturn {
  const { character, roomId, onMessage, onError, onComplete } = options;
  const [isStreaming, setIsStreaming] = useState(false);
  const streamingRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

  const cancelStream = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    streamingRef.current = false;
    setIsStreaming(false);
  }, []);

  const startStream = useCallback(
    (
      userText: string,
      setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
    ) => {
      if (streamingRef.current) return;
      streamingRef.current = true;
      setIsStreaming(true);

      const streamId = `stream-${Date.now()}`;

      // Add a placeholder streaming message
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

      const abortController = new AbortController();
      abortRef.current = abortController;

      (async () => {
        try {
          const res = await fetch(`/api/rooms/${roomId}/messages`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              content: userText,
              animaId: character.id,
            }),
            signal: abortController.signal,
          });

          if (!res.ok || !res.body) {
            throw new Error(`HTTP ${res.status}`);
          }

          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          let buffer = "";
          let fullContent = "";

          // eslint-disable-next-line no-constant-condition
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            // Parse SSE: events are separated by double newlines
            const parts = buffer.split("\n\n");
            buffer = parts.pop() ?? "";

            for (const part of parts) {
              const trimmed = part.trim();
              if (!trimmed.startsWith("data: ")) continue;

              const jsonStr = trimmed.slice(6);
              let event: { type: string; content?: string; messageId?: string; error?: string };
              try {
                event = JSON.parse(jsonStr);
              } catch {
                continue; // skip non-JSON lines
              }

              if (event.type === "chunk" && event.content) {
                fullContent += event.content;
                onMessage?.(fullContent, streamId);
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === streamId
                      ? { ...m, content: fullContent }
                      : m,
                  ),
                );
              } else if (event.type === "done") {
                const finalContent = event.content ?? fullContent;
                const finalId = event.messageId ?? streamId;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === streamId
                      ? {
                          ...m,
                          id: finalId,
                          content: finalContent,
                          isStreaming: false,
                        }
                      : m,
                  ),
                );
                streamingRef.current = false;
                setIsStreaming(false);
                abortRef.current = null;
                onComplete?.(finalContent, finalId);
              } else if (event.type === "error") {
                throw new Error(event.error ?? "Stream error");
              }
            }
          }

          // If the stream ended without a "done" event, finalise
          if (streamingRef.current) {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === streamId
                  ? { ...m, content: fullContent, isStreaming: false }
                  : m,
              ),
            );
            streamingRef.current = false;
            setIsStreaming(false);
            abortRef.current = null;
            if (fullContent) {
              onComplete?.(fullContent, streamId);
            }
          }
        } catch (err) {
          if (err instanceof DOMException && err.name === "AbortError") {
            // User cancelled — finalise partial message
          } else {
            onError?.(err instanceof Error ? err : new Error(String(err)));
          }

          setMessages((prev) =>
            prev.map((m) =>
              m.id === streamId ? { ...m, isStreaming: false } : m,
            ),
          );
          streamingRef.current = false;
          setIsStreaming(false);
          abortRef.current = null;
        }
      })();
    },
    [character, roomId, onMessage, onError, onComplete],
  );

  return {
    startStream,
    cancelStream,
    isStreaming,
  };
}
