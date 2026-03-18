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
  initialMessages: ChatMessage[];
  onBack?: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ChatBoard({
  character,
  initialMessages,
  onBack,
}: ChatBoardProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ---- SSE streaming hook ----
  const { startStream } = useChatStream({
    character,
    onComplete: (_full, _id) => {
      // Could persist the completed message to backend here
    },
  });

  // ---- Polling hook — detect messages from other users / AI guests ----
  useChatPolling({
    boardId: character.id,
    intervalMs: 2000,
    enabled: true,
    onNewMessages: (newMsgs) => {
      setMessages((prev) => {
        const existingIds = new Set(prev.map((m) => m.id));
        const fresh = newMsgs.filter((m) => !existingIds.has(m.id));
        return fresh.length > 0 ? [...prev, ...fresh] : prev;
      });
    },
  });

  // ---- Auto-scroll on new messages ----
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ---- Send handler ----
  const handleSend = useCallback(
    (text: string) => {
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        boardId: character.id,
        senderType: "user",
        senderName: "あなた",
        content: text,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);

      // Trigger SSE streaming after a short delay (simulate network latency)
      setTimeout(() => startStream(text, setMessages), 600);
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

      {/* Input */}
      <InputBar onSend={handleSend} />
    </div>
  );
}
