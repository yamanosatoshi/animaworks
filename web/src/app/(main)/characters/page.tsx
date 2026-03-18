"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import type { LLMProvider } from "@/types/chat";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Character {
  id: string;
  name: string;
  description: string;
  avatar: string;
  avatarColor: string;
  llmProvider: LLMProvider;
  status: "online" | "offline" | "busy";
  tags: string[];
  messageCount: number;
  followerCount: number;
}

// ---------------------------------------------------------------------------
// LLM badge config
// ---------------------------------------------------------------------------

const llmBadgeConfig: Record<LLMProvider, { label: string; bg: string; text: string }> = {
  claude: { label: "Claude", bg: "bg-purple-100", text: "text-purple-700" },
  gemini: { label: "Gemini", bg: "bg-blue-100", text: "text-blue-700" },
  openai: { label: "OpenAI", bg: "bg-emerald-100", text: "text-emerald-700" },
};

// ---------------------------------------------------------------------------
// Dummy data
// ---------------------------------------------------------------------------

const characters: Character[] = [
  {
    id: "aoi",
    name: "葵（あおい）",
    description:
      "心に寄り添うカウンセラー。悩みごとや不安を穏やかに聴いて、一緒に解決策を見つけます。",
    avatar: "葵",
    avatarColor: "from-violet-400 to-indigo-500",
    llmProvider: "claude",
    status: "online",
    tags: ["メンタルヘルス", "相談"],
    messageCount: 1240,
    followerCount: 892,
  },
  {
    id: "ren",
    name: "蓮（れん）",
    description:
      "ビジネス戦略のプロフェッショナル。事業計画、マーケティング、経営課題の相談にお応えします。",
    avatar: "蓮",
    avatarColor: "from-emerald-400 to-teal-500",
    llmProvider: "gemini",
    status: "online",
    tags: ["経営", "戦略"],
    messageCount: 980,
    followerCount: 654,
  },
  {
    id: "hina",
    name: "陽菜（ひな）",
    description:
      "デザインとクリエイティブの専門家。UIデザイン、ブランディング、コンテンツ制作をサポート。",
    avatar: "陽",
    avatarColor: "from-pink-400 to-rose-500",
    llmProvider: "openai",
    status: "busy",
    tags: ["デザイン", "UI/UX"],
    messageCount: 756,
    followerCount: 521,
  },
  {
    id: "sora",
    name: "空（そら）",
    description:
      "フルスタックエンジニア。コードレビュー、アーキテクチャ設計、技術的な質問に対応します。",
    avatar: "空",
    avatarColor: "from-blue-400 to-cyan-500",
    llmProvider: "claude",
    status: "online",
    tags: ["開発", "技術相談"],
    messageCount: 2100,
    followerCount: 1340,
  },
  {
    id: "mio",
    name: "美桜（みお）",
    description:
      "暮らしと健康のアドバイザー。食事、運動、睡眠など日常生活をより豊かにするヒントを提案。",
    avatar: "美",
    avatarColor: "from-amber-400 to-orange-500",
    llmProvider: "gemini",
    status: "offline",
    tags: ["健康", "生活"],
    messageCount: 430,
    followerCount: 312,
  },
  {
    id: "kai",
    name: "海（かい）",
    description:
      "エンタメ通のコンパニオン。映画、音楽、ゲーム、トレンド情報まで幅広く楽しい会話をお届け。",
    avatar: "海",
    avatarColor: "from-purple-400 to-fuchsia-500",
    llmProvider: "openai",
    status: "online",
    tags: ["趣味", "雑談"],
    messageCount: 1560,
    followerCount: 1100,
  },
];

// ---------------------------------------------------------------------------
// Status helpers
// ---------------------------------------------------------------------------

type StatusFilter = "すべて" | "オンライン" | "オフライン";
const statusFilters: StatusFilter[] = ["すべて", "オンライン", "オフライン"];

function matchesStatusFilter(
  status: Character["status"],
  filter: StatusFilter,
): boolean {
  if (filter === "すべて") return true;
  if (filter === "オンライン") return status === "online" || status === "busy";
  return status === "offline";
}

function statusLabel(s: Character["status"]): string {
  switch (s) {
    case "online":
      return "オンライン";
    case "busy":
      return "取り込み中";
    case "offline":
      return "オフライン";
  }
}

function statusDot(s: Character["status"]): string {
  switch (s) {
    case "online":
      return "bg-emerald-500";
    case "busy":
      return "bg-amber-500";
    case "offline":
      return "bg-gray-400";
  }
}

function statusClasses(s: Character["status"]): string {
  switch (s) {
    case "online":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "busy":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "offline":
      return "bg-gray-100 text-gray-500 border-gray-200";
  }
}

function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

const SearchIcon = () => (
  <svg
    width="18"
    height="18"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
    />
  </svg>
);

const MessageIcon = () => (
  <svg
    width="14"
    height="14"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
    />
  </svg>
);

const UsersIcon = () => (
  <svg
    width="14"
    height="14"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
    />
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    width="16"
    height="16"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
    />
  </svg>
);

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function CharactersPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("すべて");

  const filtered = useMemo(() => {
    return characters.filter((ch) => {
      const matchStatus = matchesStatusFilter(ch.status, activeFilter);
      const matchSearch =
        search === "" ||
        ch.name.toLowerCase().includes(search.toLowerCase()) ||
        ch.description.toLowerCase().includes(search.toLowerCase()) ||
        ch.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      return matchStatus && matchSearch;
    });
  }, [search, activeFilter]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header area */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 pt-8 pb-0">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              キャラクター一覧
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              AIキャラクターを選んでボードに参加しましょう
            </p>
          </div>

          {/* Search */}
          <div className="relative mb-5">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="キャラクター名やカテゴリで検索…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            />
          </div>

          {/* Filter tabs */}
          <div className="-mb-px flex gap-1 overflow-x-auto">
            {statusFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={[
                  "whitespace-nowrap rounded-t-lg px-4 py-2.5 text-sm font-medium transition-colors",
                  activeFilter === filter
                    ? "border-b-2 border-violet-600 text-violet-700 bg-violet-50/50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50",
                ].join(" ")}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Card grid */}
      <div className="mx-auto max-w-5xl px-6 py-8">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <SearchIcon />
            </div>
            <p className="text-sm font-medium text-gray-700">
              該当するキャラクターが見つかりません
            </p>
            <p className="mt-1 text-xs text-gray-500">
              検索条件やフィルターを変更してみてください
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((ch) => {
              const badge = llmBadgeConfig[ch.llmProvider];
              return (
                <Link
                  key={ch.id}
                  href={`/board/${ch.id}`}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:border-violet-200 hover:-translate-y-0.5"
                >
                  {/* Card top */}
                  <div className="flex items-start gap-4 p-5 pb-3">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${ch.avatarColor} shadow-sm`}
                    >
                      <span className="text-lg font-bold text-white">
                        {ch.avatar}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate text-base font-semibold text-gray-900 group-hover:text-violet-700 transition-colors">
                          {ch.name}
                        </h3>
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        {/* LLM badge */}
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${badge.bg} ${badge.text}`}
                        >
                          {badge.label}
                        </span>
                        {/* Status badge */}
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${statusClasses(ch.status)}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${statusDot(ch.status)}`}
                            aria-hidden="true"
                          />
                          {statusLabel(ch.status)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="px-5 text-sm leading-relaxed text-gray-600 line-clamp-2">
                    {ch.description}
                  </p>

                  {/* Tags */}
                  <div className="mt-3 flex gap-1.5 px-5">
                    {ch.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Stats footer */}
                  <div className="mt-auto flex items-center justify-between border-t border-gray-100 px-5 py-3 mt-4">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <MessageIcon />
                        {formatNumber(ch.messageCount)}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <UsersIcon />
                        {formatNumber(ch.followerCount)}
                      </span>
                    </div>
                    <span className="flex items-center gap-1 text-xs font-medium text-violet-600 opacity-0 transition-opacity group-hover:opacity-100">
                      ボードを開く
                      <ArrowRightIcon />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
