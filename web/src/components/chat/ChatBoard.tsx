"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import type { ChatMessage, BoardCharacter } from "@/types/chat";
import { CharacterHeader } from "@/components/chat/CharacterHeader";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { StreamingMessage } from "@/components/chat/StreamingMessage";
import { InputBar } from "@/components/chat/InputBar";
import { useChatStream } from "@/hooks/useChatStream";
import { useChatPolling } from "@/hooks/useChatPolling";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ChatBoardProps {
  character: BoardCharacter;
  /** Room ID for API calls (e.g. characterId) */
  roomId: string;
  initialMessages: ChatMessage[];
  onBack?: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ChatBoard({
  character,
  roomId,
  initialMessages,
  onBack,
}: ChatBoardProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ---- SSE streaming hook — connects to POST /api/rooms/[roomId]/messages ----
  const { startStream, isStreaming } = useChatStream({
    character,
    roomId,
    onComplete: (_full, _id) => {
      // Stream finished — message is already saved by the backend
    },
  });

  // ---- Polling hook — detect messages from other users / AI guests ----
  // Disabled while streaming to avoid duplicates with the active SSE stream
  useChatPolling({
    boardId: roomId,
    intervalMs: 3000,
    enabled: !isStreaming,
    onNewMessages: (newMsgs) => {
      setMessages((prev) => {
        const existingIds = new Set(prev.map((m) => m.id));
        // Track user message contents so we can deduplicate optimistic messages
        // (optimistic IDs like "user-xxx" differ from server-generated IDs)
        const existingUserContents = new Set(
          prev.filter((m) => m.senderType === "user").map((m) => m.content),
        );
        const fresh = newMsgs.filter((m) => {
          if (existingIds.has(m.id)) return false;
          // Deduplicate user messages by content to handle optimistic ID mismatch
          if (m.senderType === "user" && existingUserContents.has(m.content)) return false;
          return true;
        });
        return fresh.length > 0 ? [...prev, ...fresh] : prev;
      });
    },
  });

  // ---- Auto-scroll on new messages ----
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ---- Reset messages when character changes ----
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  // ---- Send handler ----
  const handleSend = useCallback(
    (text: string) => {
      // Add the user message to local state immediately (optimistic UI)
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        boardId: character.id,
        senderType: "user",
        senderName: "あなた",
        content: text,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);

      // Start the SSE stream — the backend POST saves the user message
      // and streams back the AI response
      startStream(text, setMessages);
    },
    [character.id, startStream],
  );

  return (
    <div className="flex h-full flex-col bg-gray-50">
      {/* Header */}
      <CharacterHeader character={character} onBack={onBack} />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-4">
          {/* Date divider */}
          <div className="flex items-center gap-3 py-2">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs font-medium text-gray-400">今日</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {messages.map((msg) =>
            msg.isStreaming ? (
              <StreamingMessage key={msg.id} message={msg} />
            ) : (
              <MessageBubble key={msg.id} message={msg} />
            ),
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input — form wrapper prevents Enter-key form submission */}
      <form onSubmit={(e) => e.preventDefault()}>
        <InputBar onSend={handleSend} disabled={isStreaming} />
      </form>
    </div>
  );
}
