"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { ChatMessage, BoardCharacter, LLMProvider } from "@/types/chat";
import { ChatBoard } from "@/components/chat/ChatBoard";

// ---------------------------------------------------------------------------
// API response types
// ---------------------------------------------------------------------------

/** Shape returned by GET /api/animas */
interface AnimaResponse {
  id: string;
  name: string;
  description: string;
  avatar: string;
  avatarColor: string;
  llmProvider: string;
  status: "online" | "offline" | "busy";
  tags: string[];
  messageCount: number;
  followerCount: number;
}

/** Shape returned by GET /api/rooms/[id]/messages */
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

// ---------------------------------------------------------------------------
// Converters
// ---------------------------------------------------------------------------

function toCharacter(a: AnimaResponse): BoardCharacter {
  return {
    id: a.id,
    name: a.name,
    description: a.description,
    avatar: a.avatar,
    avatarColor: a.avatarColor,
    llmProvider: a.llmProvider as LLMProvider,
    status: a.status,
    tags: a.tags,
    messageCount: a.messageCount,
    followerCount: a.followerCount,
  };
}

function toChatMessage(m: StoredMessageResponse): ChatMessage {
  return {
    id: m.id,
    boardId: m.roomId,
    senderType: m.senderType,
    senderName: m.senderName,
    senderAvatar: m.senderAvatar,
    content: m.content,
    timestamp: m.createdAt,
    llmProvider: m.llmProvider as LLMProvider | undefined,
  };
}

// ---------------------------------------------------------------------------
// LLM badge config (for sidebar)
// ---------------------------------------------------------------------------

const llmBadgeConfig: Record<
  LLMProvider,
  { label: string; bg: string; text: string }
> = {
  claude: { label: "Claude", bg: "bg-purple-100", text: "text-purple-700" },
  gemini: { label: "Gemini", bg: "bg-blue-100", text: "text-blue-700" },
  openai: { label: "OpenAI", bg: "bg-emerald-100", text: "text-emerald-700" },
};

// ---------------------------------------------------------------------------
// Status helpers
// ---------------------------------------------------------------------------

function statusDot(s: BoardCharacter["status"]): string {
  switch (s) {
    case "online":
      return "bg-emerald-500";
    case "busy":
      return "bg-amber-500";
    case "offline":
      return "bg-gray-400";
  }
}

// ---------------------------------------------------------------------------
// Character sidebar — shows all characters, highlights active one
// ---------------------------------------------------------------------------

function CharacterSidebar({
  characters: chars,
  activeId,
}: {
  characters: BoardCharacter[];
  activeId: string;
}) {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-gray-200 bg-white lg:flex">
      {/* Sidebar header */}
      <div className="border-b border-gray-100 px-4 py-4">
        <h2 className="text-sm font-semibold text-gray-900">キャラクター</h2>
        <p className="mt-0.5 text-xs text-gray-500">ボードを切り替える</p>
      </div>

      {/* Character list */}
      <nav className="flex-1 overflow-y-auto py-2">
        {chars.map((ch) => {
          const isActive = ch.id === activeId;
          const badge = llmBadgeConfig[ch.llmProvider];
          return (
            <Link
              key={ch.id}
              href={`/board/${ch.id}`}
              className={[
                "flex items-center gap-3 px-4 py-3 transition-colors",
                isActive
                  ? "bg-violet-50 border-r-2 border-violet-600"
                  : "hover:bg-gray-50",
              ].join(" ")}
            >
              {/* Avatar */}
              <div className="relative">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${ch.avatarColor} text-sm font-bold text-white`}
                >
                  {ch.avatar}
                </div>
                {/* Status dot */}
                <span
                  className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white ${statusDot(ch.status)}`}
                />
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span
                    className={[
                      "truncate text-sm font-medium",
                      isActive ? "text-violet-900" : "text-gray-900",
                    ].join(" ")}
                  >
                    {ch.name.split("（")[0]}
                  </span>
                  <span
                    className={`shrink-0 rounded-full px-1.5 py-px text-[9px] font-semibold ${badge.bg} ${badge.text}`}
                  >
                    {badge.label}
                  </span>
                </div>
                <p className="truncate text-xs text-gray-500">
                  {ch.description}
                </p>
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function BoardPage() {
  const params = useParams();
  const router = useRouter();
  const characterId = params.characterId as string;

  // ---- Fetch characters from API ----
  const [characters, setCharacters] = useState<BoardCharacter[]>([]);
  const [loadingChars, setLoadingChars] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/animas");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: { animas: AnimaResponse[] } = await res.json();
        if (!cancelled) {
          setCharacters(data.animas.map(toCharacter));
        }
      } catch (err) {
        console.error("Failed to fetch animas:", err);
      } finally {
        if (!cancelled) setLoadingChars(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // ---- Fetch initial messages from API ----
  const [initialMessages, setInitialMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/rooms/${characterId}/messages`);
        if (!res.ok) return; // Room may not exist yet — that's OK
        const data: { messages: StoredMessageResponse[] } = await res.json();
        if (!cancelled) {
          setInitialMessages(data.messages.map(toChatMessage));
        }
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    })();
    return () => { cancelled = true; };
  }, [characterId]);

  // ---- Resolve current character ----
  const character = useMemo(
    () => characters.find((c) => c.id === characterId) ?? characters[0],
    [characters, characterId],
  );

  // ---- Loading state ----
  if (loadingChars || !character) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-violet-600 border-t-transparent" />
          <p className="mt-3 text-sm text-gray-500">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Character sidebar (desktop) */}
      <CharacterSidebar characters={characters} activeId={character.id} />

      {/* Main chat area */}
      <div className="flex-1">
        <ChatBoard
          character={character}
          roomId={characterId}
          initialMessages={initialMessages}
          onBack={() => router.push("/characters")}
        />
      </div>
    </div>
  );
}
