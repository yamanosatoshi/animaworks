"use client";

import React from "react";
import type { BoardCharacter, LLMProvider } from "@/types/chat";

// ---------------------------------------------------------------------------
// LLM badge config
// ---------------------------------------------------------------------------

const llmBadgeConfig: Record<LLMProvider, { label: string; bg: string; text: string }> = {
  claude: { label: "Claude", bg: "bg-purple-100", text: "text-purple-700" },
  gemini: { label: "Gemini", bg: "bg-blue-100", text: "text-blue-700" },
  openai: { label: "OpenAI", bg: "bg-emerald-100", text: "text-emerald-700" },
};

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

const ArrowLeftIcon = () => (
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
      d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
    />
  </svg>
);

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface CharacterHeaderProps {
  character: BoardCharacter;
  onBack?: () => void;
}

export function CharacterHeader({ character, onBack }: CharacterHeaderProps) {
  const badge = llmBadgeConfig[character.llmProvider];

  return (
    <header className="flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3 sm:px-6">
      {/* Back button (mobile-friendly) */}
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 sm:hidden"
          aria-label="戻る"
        >
          <ArrowLeftIcon />
        </button>
      )}

      {/* Avatar */}
      <div className="relative">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${character.avatarColor} text-sm font-bold text-white shadow-sm`}
        >
          {character.avatar}
        </div>
        {/* Online indicator */}
        {character.status === "online" && (
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-400" />
        )}
      </div>

      {/* Name + LLM badge */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h1 className="truncate text-sm font-semibold text-gray-900">
            {character.name}
          </h1>
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${badge.bg} ${badge.text}`}
          >
            {badge.label}
          </span>
        </div>
        <p className="truncate text-xs text-gray-500">{character.description}</p>
      </div>
    </header>
  );
}
