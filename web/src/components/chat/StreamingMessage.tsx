"use client";

import React from "react";
import type { ChatMessage } from "@/types/chat";

// ---------------------------------------------------------------------------
// Component — renders a message that is currently being streamed
// Shows content so far + blinking cursor
// ---------------------------------------------------------------------------

interface StreamingMessageProps {
  message: ChatMessage;
}

export function StreamingMessage({ message }: StreamingMessageProps) {
  const avatarSize =
    message.senderType === "ai_host" ? "h-9 w-9 text-sm" : "h-7 w-7 text-xs";

  return (
    <div className="flex flex-row gap-3">
      {/* Avatar */}
      <div className="relative shrink-0 self-end">
        <div
          className={`flex ${avatarSize} items-center justify-center rounded-full bg-gradient-to-br from-gray-600 to-gray-800 font-bold text-white`}
        >
          {message.senderAvatar ?? "AI"}
        </div>
      </div>

      {/* Bubble */}
      <div className="flex flex-col items-start">
        <span className="mb-1 text-[11px] font-medium text-gray-400">
          {message.senderName}
        </span>

        <div className="max-w-[75%] rounded-2xl rounded-bl-md bg-gray-800 px-4 py-2.5 text-sm leading-relaxed text-gray-100">
          {message.content}
          {/* Blinking cursor */}
          <span className="streaming-cursor ml-0.5 inline-block h-4 w-[2px] translate-y-[2px] bg-gray-300" />
        </div>
      </div>
    </div>
  );
}
