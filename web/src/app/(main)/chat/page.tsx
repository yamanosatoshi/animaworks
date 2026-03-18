"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CrewMember {
  id: string;
  name: string;
  initial: string;
  color: string;
}

interface Channel {
  id: string;
  name: string;
  members: string[]; // crew member ids
  lastMessage: string;
}

interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
}

interface Suggestion {
  id: string;
  title: string;
  description: string;
}

// ---------------------------------------------------------------------------
// Dummy data
// ---------------------------------------------------------------------------

const crewMembers: CrewMember[] = [
  { id: "taro", name: "太郎", initial: "太", color: "bg-violet-400" },
  { id: "sakura", name: "さくら", initial: "さ", color: "bg-pink-400" },
  { id: "kenshiro", name: "ケンシロウ", initial: "ケ", color: "bg-blue-400" },
  { id: "aoi", name: "葵", initial: "葵", color: "bg-emerald-400" },
  { id: "umeda", name: "吉田梅", initial: "梅", color: "bg-amber-400" },
  { id: "kuura", name: "くうら", initial: "く", color: "bg-rose-400" },
];

const crewMap = Object.fromEntries(crewMembers.map((m) => [m.id, m]));

const channels: Channel[] = [
  {
    id: "general",
    name: "#全体チャット",
    members: ["taro", "sakura", "kenshiro", "aoi", "umeda"],
    lastMessage: "今日のミーティングは15時からです",
  },
  {
    id: "web-renewal",
    name: "#Webリニューアル",
    members: ["taro", "kenshiro", "aoi"],
    lastMessage: "カラースキーム、少し調整したほうがいいかもしれません。",
  },
  {
    id: "sns-marketing",
    name: "#SNSマーケ",
    members: ["sakura", "umeda"],
    lastMessage: "来週のキャンペーン企画を共有しました",
  },
  {
    id: "design-consult",
    name: "#デザイン相談",
    members: ["aoi", "kenshiro", "kuura"],
    lastMessage: "ワイヤーフレームのフィードバックお願いします",
  },
];

const messagesData: Record<string, ChatMessage[]> = {
  "web-renewal": [
    {
      id: "1",
      senderId: "taro",
      content: "トップページのデザイン、レビューお願いします",
      timestamp: "10:30",
    },
    {
      id: "2",
      senderId: "kenshiro",
      content:
        "レスポンシブ対応のブレークポイント確認しました。問題なさそうです。",
      timestamp: "10:35",
    },
    {
      id: "3",
      senderId: "aoi",
      content:
        "カラースキーム、少し調整したほうがいいかもしれません。提案書を共有しますね。",
      timestamp: "10:42",
    },
    {
      id: "4",
      senderId: "kuura",
      content: "クライアントからのフィードバックも共有しておきます。",
      timestamp: "11:00",
    },
  ],
  general: [
    {
      id: "1",
      senderId: "taro",
      content: "おはようございます！今日もよろしくお願いします。",
      timestamp: "9:00",
    },
    {
      id: "2",
      senderId: "sakura",
      content: "おはようございます！今日のミーティングは15時からです。",
      timestamp: "9:05",
    },
  ],
  "sns-marketing": [
    {
      id: "1",
      senderId: "sakura",
      content: "来週のキャンペーン企画を共有しました。確認お願いします！",
      timestamp: "14:00",
    },
    {
      id: "2",
      senderId: "umeda",
      content: "確認しました。いくつか修正案を出しますね。",
      timestamp: "14:20",
    },
  ],
  "design-consult": [
    {
      id: "1",
      senderId: "aoi",
      content: "新しいワイヤーフレームをアップしました。フィードバックお願いします。",
      timestamp: "11:30",
    },
    {
      id: "2",
      senderId: "kenshiro",
      content: "技術的な制約を考慮して、いくつかコメントしました。",
      timestamp: "11:45",
    },
    {
      id: "3",
      senderId: "kuura",
      content: "ワイヤーフレームのフィードバックお願いします",
      timestamp: "12:00",
    },
  ],
};

const suggestions: Suggestion[] = [
  {
    id: "1",
    title: "デザインガイドラインの統一",
    description:
      "現在のプロジェクトで使用しているカラーパレットとタイポグラフィを統一ガイドラインとしてまとめることを提案します。",
  },
  {
    id: "2",
    title: "パフォーマンス最適化の提案",
    description:
      "画像の遅延読み込みとコード分割により、ページロード時間を40%削減できる見込みです。",
  },
  {
    id: "3",
    title: "ユーザーテスト計画",
    description:
      "リニューアル後のUXを検証するため、5名のユーザーによるテストセッションの実施を推奨します。",
  },
];

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

const ClipIcon = () => (
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
      d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
    />
  </svg>
);

const ArrowUpIcon = () => (
  <svg
    width="20"
    height="20"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18"
    />
  </svg>
);

const ArrowRightIcon = () => (
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
      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
    />
  </svg>
);

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Top crew member bar */
function CrewBar({ members }: { members: CrewMember[] }) {
  return (
    <div className="flex h-16 shrink-0 items-center gap-5 overflow-x-auto border-b border-gray-200 bg-white px-6">
      {members.map((m) => (
        <div key={m.id} className="flex flex-col items-center gap-1 shrink-0">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full ${m.color} text-sm font-bold text-white`}
          >
            {m.initial}
          </div>
          <span className="text-xs text-gray-600">{m.name}</span>
        </div>
      ))}
    </div>
  );
}

/** Stacked avatar group for channel members */
function AvatarStack({ memberIds }: { memberIds: string[] }) {
  const shown = memberIds.slice(0, 4);
  return (
    <div className="flex -space-x-2">
      {shown.map((id) => {
        const m = crewMap[id];
        if (!m) return null;
        return (
          <div
            key={id}
            className={`flex h-6 w-6 items-center justify-center rounded-full border-2 border-white ${m.color} text-[10px] font-bold text-white`}
          >
            {m.initial}
          </div>
        );
      })}
      {memberIds.length > 4 && (
        <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-gray-300 text-[10px] font-bold text-gray-600">
          +{memberIds.length - 4}
        </div>
      )}
    </div>
  );
}

/** Left column — Board/Channel list */
function ChannelList({
  channels: chs,
  activeId,
  onSelect,
}: {
  channels: Channel[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-gray-200 bg-white">
      <div className="px-4 py-4">
        <h2 className="text-sm font-bold text-gray-900">チャット会議体</h2>
      </div>
      <nav className="flex-1 overflow-y-auto" aria-label="チャンネルリスト">
        <ul className="flex flex-col gap-0.5 px-2">
          {chs.map((ch) => {
            const isActive = ch.id === activeId;
            return (
              <li key={ch.id}>
                <button
                  type="button"
                  onClick={() => onSelect(ch.id)}
                  className={[
                    "flex w-full flex-col gap-1.5 rounded-lg px-3 py-2.5 text-left transition-colors",
                    isActive
                      ? "border-l-2 border-[#7C3AED] bg-purple-50"
                      : "hover:bg-gray-50",
                  ].join(" ")}
                  aria-current={isActive ? "true" : undefined}
                >
                  <span className="text-sm font-medium text-gray-900">
                    {ch.name}
                  </span>
                  <AvatarStack memberIds={ch.members} />
                  <p className="truncate text-xs text-gray-400">
                    {ch.lastMessage}
                  </p>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

/** Single chat message */
function MessageRow({ message }: { message: ChatMessage }) {
  const sender = crewMap[message.senderId];
  if (!sender) return null;

  return (
    <div className="flex items-start gap-3">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${sender.color} text-xs font-bold text-white`}
      >
        {sender.initial}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-bold text-gray-900">{sender.name}</span>
          <span className="text-xs text-gray-400">{message.timestamp}</span>
        </div>
        <p className="mt-0.5 text-sm text-gray-700">{message.content}</p>
      </div>
    </div>
  );
}

/** Center column — Chat body */
function ChatBody({
  channel,
  messages,
  onSend,
}: {
  channel: Channel;
  messages: ChatMessage[];
  onSend: (text: string) => void;
}) {
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    onSend(text);
    setInput("");
  }, [input, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-gray-200 bg-white px-6 py-3">
        <h1 className="text-lg font-bold text-gray-900">{channel.name}</h1>
        <span className="text-sm text-gray-400">
          {channel.members.length}人のメンバー
        </span>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-50 px-6 py-6">
        <div className="flex flex-col gap-5">
          {messages.map((msg) => (
            <MessageRow key={msg.id} message={msg} />
          ))}
          <div ref={endRef} />
        </div>
      </div>

      {/* Input bar */}
      <div className="border-t border-gray-200 bg-white px-6 py-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            aria-label="ファイル添付"
          >
            <ClipIcon />
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="メッセージを入力..."
            className="h-10 min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20"
            aria-label="メッセージ入力"
          />

          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim()}
            className={[
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors",
              input.trim()
                ? "cursor-pointer bg-[#7C3AED] text-white hover:bg-[#6D28D9]"
                : "cursor-not-allowed bg-gray-200 text-gray-400",
            ].join(" ")}
            aria-label="送信"
          >
            <ArrowUpIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

/** Right column — Suggestions panel */
function SuggestionsPanel({ items }: { items: Suggestion[] }) {
  return (
    <aside className="flex h-full w-72 shrink-0 flex-col overflow-y-auto border-l border-gray-200 bg-white">
      <div className="px-4 py-4">
        <h2 className="text-sm font-bold text-gray-900">提案事項</h2>
      </div>
      <div className="flex flex-col gap-3 px-4 pb-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-lg border border-gray-200 bg-white p-3"
          >
            <h3 className="text-sm font-medium text-gray-900">{item.title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-gray-500">
              {item.description}
            </p>
            <button
              type="button"
              className="mt-2 flex items-center gap-1 text-xs font-medium text-[#7C3AED] transition-colors hover:text-[#6D28D9]"
            >
              タスクに変換
              <ArrowRightIcon />
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ChatPage() {
  const [activeChannelId, setActiveChannelId] = useState("web-renewal");
  const [allMessages, setAllMessages] = useState(messagesData);

  const activeChannel =
    channels.find((c) => c.id === activeChannelId) ?? channels[0];
  const activeMessages = allMessages[activeChannelId] ?? [];

  const handleSend = useCallback(
    (text: string) => {
      const now = new Date();
      const ts = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;

      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        senderId: "taro",
        content: text,
        timestamp: ts,
      };

      setAllMessages((prev) => ({
        ...prev,
        [activeChannelId]: [...(prev[activeChannelId] ?? []), newMsg],
      }));
    },
    [activeChannelId]
  );

  return (
    <div className="flex h-full flex-col">
      {/* Top crew bar */}
      <CrewBar members={crewMembers} />

      {/* 3-column layout */}
      <div className="flex min-h-0 flex-1">
        {/* Left — Channel list */}
        <ChannelList
          channels={channels}
          activeId={activeChannelId}
          onSelect={setActiveChannelId}
        />

        {/* Center — Chat body */}
        <ChatBody
          channel={activeChannel}
          messages={activeMessages}
          onSend={handleSend}
        />

        {/* Right — Suggestions */}
        <SuggestionsPanel items={suggestions} />
      </div>
    </div>
  );
}
