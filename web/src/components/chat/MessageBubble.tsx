"use client";

import React from "react";
import type { ChatMessage, LLMProvider } from "@/types/chat";

// ---------------------------------------------------------------------------
// LLM dot colour
// ---------------------------------------------------------------------------

const llmDotColor: Record<LLMProvider, string> = {
  claude: "bg-purple-500",
  gemini: "bg-blue-500",
  openai: "bg-emerald-500",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatTime(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}

/** Minimal markdown: bold (**text**) and line breaks */
function renderContent(text: string) {
  return text.split("\n").map((line, i) => (
    <React.Fragment key={i}>
      {i > 0 && <br />}
      {line.split(/(\*\*[^*]+\*\*)/).map((seg, j) =>
        seg.startsWith("**") && seg.endsWith("**") ? (
          <strong key={j} className="font-semibold">
            {seg.slice(2, -2)}
          </strong>
        ) : (
          <span key={j}>{seg}</span>
        ),
      )}
    </React.Fragment>
  ));
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.senderType === "user";
  const isHost = message.senderType === "ai_host";
  // ai_guest gets a smaller avatar
  const avatarSize = isHost ? "h-9 w-9 text-sm" : "h-7 w-7 text-xs";

  return (
    <div
      className={[
        "flex gap-3",
        isUser ? "flex-row-reverse" : "flex-row",
      ].join(" ")}
    >
      {/* Avatar (AI only) */}
      {!isUser && (
        <div className="relative shrink-0 self-end">
          <div
            className={`flex ${avatarSize} items-center justify-center rounded-full bg-gradient-to-br from-gray-600 to-gray-800 font-bold text-white`}
          >
            {message.senderAvatar ?? "AI"}
          </div>
          {/* LLM provider dot */}
          {message.llmProvider && (
            <span
              className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-gray-50 ${llmDotColor[message.llmProvider]}`}
              title={message.llmProvider}
            />
          )}
        </div>
      )}

      {/* Bubble */}
      <div className={isUser ? "flex flex-col items-end" : "flex flex-col items-start"}>
        {/* Sender name (AI only) */}
        {!isUser && (
          <span className="mb-1 text-[11px] font-medium text-gray-400">
            {message.senderName}
          </span>
        )}

        <div
          className={[
            "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
            isUser
              ? "rounded-br-md bg-blue-600 text-white"
              : "rounded-bl-md bg-gray-800 text-gray-100",
          ].join(" ")}
        >
          {renderContent(message.content)}
        </div>

        {/* Timestamp */}
        <span className="mt-1 text-[10px] text-gray-400">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}
