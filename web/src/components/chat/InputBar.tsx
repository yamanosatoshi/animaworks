"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

const SendIcon = () => (
  <svg
    width="20"
    height="20"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
    />
  </svg>
);

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface InputBarProps {
  onSend: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function InputBar({
  onSend,
  disabled = false,
  placeholder = "メッセージを入力...",
}: InputBarProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
    }
  }, [input]);

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text || disabled) return;
    onSend(text);
    setInput("");
  }, [input, disabled, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = input.trim().length > 0 && !disabled;

  return (
    <div className="border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="mx-auto flex max-w-3xl items-end gap-3">
        <div className="relative min-w-0 flex-1">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            disabled={disabled}
            className="w-full resize-none rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 pr-12 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 disabled:opacity-50"
            aria-label="メッセージ入力"
          />
        </div>

        <button
          type="button"
          onClick={handleSend}
          disabled={!canSend}
          className={[
            "mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors",
            canSend
              ? "cursor-pointer bg-violet-600 text-white hover:bg-violet-700"
              : "cursor-not-allowed bg-gray-200 text-gray-400",
          ].join(" ")}
          aria-label="送信"
        >
          <SendIcon />
        </button>
      </div>

      <p className="mx-auto mt-2 max-w-3xl text-center text-[11px] text-gray-400">
        Shift + Enter で改行 ・ Enter で送信
      </p>
    </div>
  );
}
