"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { ChatMessage, BoardCharacter, LLMProvider } from "@/types/chat";
import { ChatBoard } from "@/components/chat/ChatBoard";

// ---------------------------------------------------------------------------
// Dummy characters (shared data — later extract to a data layer)
// ---------------------------------------------------------------------------

const characters: BoardCharacter[] = [
  {
    id: "aoi",
    name: "葵（あおい）",
    description: "心に寄り添うカウンセラー。悩みや不安を穏やかに聴きます。",
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
    description: "ビジネス戦略のプロ。事業計画からマーケティングまで。",
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
    description: "デザインとクリエイティブの専門家。UIからブランディングまで。",
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
    description: "フルスタックエンジニア。コードレビューからアーキテクチャ設計まで。",
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
    description: "暮らしと健康のアドバイザー。毎日をより豊かに。",
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
    description: "エンタメ通。映画・音楽・ゲーム・トレンドまで幅広く。",
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
// Dummy messages per board
// ---------------------------------------------------------------------------

function makeDummyMessages(char: BoardCharacter): ChatMessage[] {
  const now = new Date();
  const t = (minAgo: number) =>
    new Date(now.getTime() - minAgo * 60_000).toISOString();

  const base: ChatMessage[] = [
    {
      id: "m1",
      boardId: char.id,
      senderType: "ai_host",
      senderName: char.name,
      senderAvatar: char.avatar,
      content: `こんにちは！${char.name.split("（")[0]}です。今日はどんなことをお手伝いしましょうか？何でも気軽に聞いてくださいね。`,
      timestamp: t(10),
      llmProvider: char.llmProvider,
    },
    {
      id: "m2",
      boardId: char.id,
      senderType: "user",
      senderName: "あなた",
      content: "こんにちは！最近ちょっと相談したいことがあって。",
      timestamp: t(9),
    },
    {
      id: "m3",
      boardId: char.id,
      senderType: "ai_host",
      senderName: char.name,
      senderAvatar: char.avatar,
      content:
        "もちろんです！どんなことでもお話しください。じっくり一緒に考えましょう。",
      timestamp: t(8),
      llmProvider: char.llmProvider,
    },
    {
      id: "m4",
      boardId: char.id,
      senderType: "user",
      senderName: "あなた",
      content:
        "ありがとう。実はプロジェクトの進め方で悩んでいて、アドバイスがほしいんだ。",
      timestamp: t(5),
    },
    {
      id: "m5",
      boardId: char.id,
      senderType: "ai_host",
      senderName: char.name,
      senderAvatar: char.avatar,
      content:
        "プロジェクトの進め方ですね。具体的にはどの部分で悩んでいますか？\n\n**例えば：**\n- スケジュールの管理\n- チーム内のコミュニケーション\n- 技術選定や設計\n\nもう少し詳しく教えていただけると、的確なアドバイスができます！",
      timestamp: t(4),
      llmProvider: char.llmProvider,
    },
  ];

  // Add a guest AI message for variety
  if (char.id === "aoi" || char.id === "sora") {
    base.push({
      id: "m6",
      boardId: char.id,
      senderType: "ai_guest",
      senderName: char.id === "aoi" ? "空（そら）" : "蓮（れん）",
      senderAvatar: char.id === "aoi" ? "空" : "蓮",
      content:
        char.id === "aoi"
          ? "横から失礼します！技術的な観点からだと、まずはタスクの分解と優先度付けがおすすめです。"
          : "ビジネス面からの視点を追加しますね。ROIを考えると、MVP優先が良さそうです。",
      timestamp: t(2),
      llmProvider: char.id === "aoi" ? "claude" : "gemini",
    });
  }

  return base;
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

  const character =
    characters.find((c) => c.id === characterId) ?? characters[0];
  const initialMessages = makeDummyMessages(character);

  return (
    <div className="flex h-full">
      {/* Character sidebar (desktop) */}
      <CharacterSidebar characters={characters} activeId={character.id} />

      {/* Main chat area */}
      <div className="flex-1">
        <ChatBoard
          character={character}
          initialMessages={initialMessages}
          onBack={() => router.push("/characters")}
        />
      </div>
    </div>
  );
}
