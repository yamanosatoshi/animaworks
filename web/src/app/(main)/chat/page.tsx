"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CrewMember {
  name: string;
  tag: string;
  stars: number;
  color: string;
  initial: string;
}

interface BoardMember {
  initial: string;
  color: string;
}

interface Board {
  id: string;
  name: string;
  members: BoardMember[];
  lastMessage: string;
  lastTime: string;
}

interface ChatMessage {
  id: string;
  sender: string;
  senderInitial: string;
  senderColor: string;
  content: string;
  timestamp: string;
}

interface Suggestion {
  id: string;
  text: string;
}

interface TaskItem {
  id: string;
  text: string;
  done: boolean;
}

// ---------------------------------------------------------------------------
// Dummy data
// ---------------------------------------------------------------------------

const crewMembers: CrewMember[] = [
  { name: "太郎", tag: "リーダー", stars: 5, color: "bg-violet-400", initial: "太" },
  { name: "くうら", tag: "営業", stars: 4, color: "bg-pink-400", initial: "く" },
  { name: "ケンシロウ", tag: "エンジニア", stars: 5, color: "bg-blue-400", initial: "ケ" },
  { name: "葵", tag: "デザイナー", stars: 4, color: "bg-emerald-400", initial: "葵" },
  { name: "吉田梅", tag: "マーケ", stars: 3, color: "bg-amber-400", initial: "梅" },
];

const boards: Board[] = [
  {
    id: "board-1",
    name: "プロジェクトA組",
    members: [
      { initial: "太", color: "bg-violet-400" },
      { initial: "く", color: "bg-pink-400" },
      { initial: "ケ", color: "bg-blue-400" },
      { initial: "葵", color: "bg-emerald-400" },
    ],
    lastMessage: "今日もよろしくお願いします。スケジュールについて確認です。",
    lastTime: "10:30",
  },
  {
    id: "board-2",
    name: "デザインチーム",
    members: [
      { initial: "葵", color: "bg-emerald-400" },
      { initial: "太", color: "bg-violet-400" },
      { initial: "梅", color: "bg-amber-400" },
    ],
    lastMessage: "新しいUIモックアップをアップしました。",
    lastTime: "9:45",
  },
  {
    id: "board-3",
    name: "営業ミーティング",
    members: [
      { initial: "く", color: "bg-pink-400" },
      { initial: "太", color: "bg-violet-400" },
    ],
    lastMessage: "来週の提案資料を確認してください。",
    lastTime: "昨日",
  },
  {
    id: "board-4",
    name: "マーケティング企画",
    members: [
      { initial: "梅", color: "bg-amber-400" },
      { initial: "く", color: "bg-pink-400" },
      { initial: "葵", color: "bg-emerald-400" },
    ],
    lastMessage: "投稿スケジュール作成に取りかかっています。",
    lastTime: "昨日",
  },
  {
    id: "board-5",
    name: "開発タスク管理",
    members: [
      { initial: "ケ", color: "bg-blue-400" },
      { initial: "太", color: "bg-violet-400" },
      { initial: "葵", color: "bg-emerald-400" },
    ],
    lastMessage: "フロントエンド実装のPRレビューお願いします。",
    lastTime: "月曜",
  },
];

const boardMessages: Record<string, ChatMessage[]> = {
  "board-1": [
    {
      id: "1",
      sender: "太郎",
      senderInitial: "太",
      senderColor: "bg-violet-400",
      content: "今日もよろしくお願いします。本日のタスク確認をしましょう。",
      timestamp: "9:00",
    },
    {
      id: "2",
      sender: "くうら",
      senderInitial: "く",
      senderColor: "bg-pink-400",
      content: "おはようございます！見積書の件、先方に確認中です。",
      timestamp: "9:15",
    },
    {
      id: "3",
      sender: "ケンシロウ",
      senderInitial: "ケ",
      senderColor: "bg-blue-400",
      content: "昨日のビルドですが、テストも全部通りました。デプロイの準備はOKです。",
      timestamp: "9:30",
    },
    {
      id: "4",
      sender: "葵",
      senderInitial: "葵",
      senderColor: "bg-emerald-400",
      content: "デザイン修正も完了しました。ケンシロウさんに連携済みです。",
      timestamp: "9:45",
    },
    {
      id: "5",
      sender: "太郎",
      senderInitial: "太",
      senderColor: "bg-violet-400",
      content: "順調ですね。午後にはレビューを入れましょう。くうらさん、見積書の回答が来たら共有お願いします。",
      timestamp: "10:00",
    },
    {
      id: "6",
      sender: "くうら",
      senderInitial: "く",
      senderColor: "bg-pink-400",
      content: "承知しました。午前中には回答が届く予定です。",
      timestamp: "10:15",
    },
  ],
  "board-2": [
    {
      id: "1",
      sender: "葵",
      senderInitial: "葵",
      senderColor: "bg-emerald-400",
      content: "新しいUIモックアップをアップしました。フィードバックお願いします。",
      timestamp: "9:30",
    },
    {
      id: "2",
      sender: "太郎",
      senderInitial: "太",
      senderColor: "bg-violet-400",
      content: "確認しました。全体的にいい感じです！CTAボタンの色をもう少し目立たせてもいいかも。",
      timestamp: "9:45",
    },
  ],
  "board-3": [
    {
      id: "1",
      sender: "くうら",
      senderInitial: "く",
      senderColor: "bg-pink-400",
      content: "来週の提案資料を確認してください。修正箇所があれば教えてください。",
      timestamp: "昨日",
    },
  ],
  "board-4": [
    {
      id: "1",
      sender: "吉田梅",
      senderInitial: "梅",
      senderColor: "bg-amber-400",
      content: "投稿スケジュール作成に取りかかっています。来週中に完成予定です。",
      timestamp: "昨日",
    },
  ],
  "board-5": [
    {
      id: "1",
      sender: "ケンシロウ",
      senderInitial: "ケ",
      senderColor: "bg-blue-400",
      content: "フロントエンド実装のPRレビューお願いします。",
      timestamp: "月曜",
    },
  ],
};

const boardSuggestions: Record<string, Suggestion[]> = {
  "board-1": [
    { id: "s1", text: "タスク管理ボードに未完了タスクが3件あります" },
    { id: "s2", text: "見積書の承認フローを開始してください" },
    { id: "s3", text: "午後のレビュー会議のアジェンダを準備しましょう" },
  ],
  "board-2": [
    { id: "s1", text: "モックアップのフィードバック期限は明日です" },
  ],
  "board-3": [
    { id: "s1", text: "提案資料のレビュー期限が近づいています" },
  ],
  "board-4": [
    { id: "s1", text: "投稿スケジュールのテンプレートを活用しましょう" },
  ],
  "board-5": [
    { id: "s1", text: "PRレビューの優先度を設定してください" },
  ],
};

const boardTasks: Record<string, TaskItem[]> = {
  "board-1": [
    { id: "t1", text: "タスク管理ボードへ入力する事を確認する", done: false },
    { id: "t2", text: "見積書をNoteにアップする", done: false },
    { id: "t3", text: "午後のレビュー会議の招集", done: true },
  ],
  "board-2": [
    { id: "t1", text: "UIモックアップのフィードバック回収", done: false },
  ],
  "board-3": [
    { id: "t1", text: "提案資料の最終確認", done: false },
  ],
  "board-4": [
    { id: "t1", text: "投稿スケジュール作成", done: false },
  ],
  "board-5": [
    { id: "t1", text: "PRレビュー完了", done: false },
  ],
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function Stars({ count }: { count: number }) {
  return (
    <div className="flex items-center justify-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`h-3.5 w-3.5 ${i < count ? "text-yellow-400" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function CrewCard({ member }: { member: CrewMember }) {
  return (
    <div className="flex min-w-[140px] flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-4 text-center">
      <div
        className={`flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white ${member.color}`}
      >
        {member.initial}
      </div>
      <p className="text-sm font-medium text-gray-900">{member.name}</p>
      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
        {member.tag}
      </span>
      <Stars count={member.stars} />
    </div>
  );
}

function OverlappingAvatars({ members }: { members: BoardMember[] }) {
  return (
    <div className="flex -space-x-2">
      {members.map((m, i) => (
        <div
          key={i}
          className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold text-white ${m.color}`}
          style={{ zIndex: members.length - i }}
        >
          {m.initial}
        </div>
      ))}
    </div>
  );
}

/** Left panel — Board list */
function BoardList({
  activeId,
  onSelect,
}: {
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <aside className="flex h-full w-[280px] shrink-0 flex-col border-r border-gray-200 bg-white">
      <div className="border-b border-gray-100 px-4 py-3">
        <h2 className="text-sm font-bold text-gray-900">掲示板</h2>
      </div>
      <nav className="flex-1 overflow-y-auto" aria-label="ボード一覧">
        <ul className="flex flex-col">
          {boards.map((board) => (
            <li key={board.id}>
              <button
                type="button"
                onClick={() => onSelect(board.id)}
                className={[
                  "flex w-full flex-col gap-2 px-4 py-3 text-left transition-colors",
                  activeId === board.id
                    ? "bg-violet-50 border-r-2 border-violet-500"
                    : "hover:bg-gray-50",
                ].join(" ")}
                aria-current={activeId === board.id ? "true" : undefined}
              >
                <div className="flex items-center justify-between">
                  <span className="truncate text-sm font-semibold text-gray-900">
                    {board.name}
                  </span>
                  <span className="shrink-0 text-[11px] text-gray-400">
                    {board.lastTime}
                  </span>
                </div>
                <OverlappingAvatars members={board.members} />
                <p className="truncate text-xs text-gray-500">
                  {board.lastMessage}
                </p>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

/** Center panel — Chat area */
function ChatArea({
  board,
  messages,
  onSend,
}: {
  board: Board;
  messages: ChatMessage[];
  onSend: (text: string) => void;
}) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
    }
  }, [input]);

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    onSend(text);
    setInput("");
  }, [input, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-bold text-gray-900">{board.name}</h1>
          <OverlappingAvatars members={board.members} />
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            aria-label="検索"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </button>
          <button
            type="button"
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            aria-label="その他"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-50 px-6 py-6">
        <div className="flex flex-col gap-4">
          {messages.map((msg) => (
            <div key={msg.id} className="flex gap-3">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${msg.senderColor}`}
              >
                {msg.senderInitial}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">
                    {msg.sender}
                  </span>
                  <span className="text-[11px] text-gray-400">
                    {msg.timestamp}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-gray-700">
                  {msg.content}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 bg-white px-6 py-3">
        <div className="flex items-end gap-3">
          <button
            type="button"
            className="mb-0.5 rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            aria-label="ファイル添付"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
            </svg>
          </button>

          <div className="min-w-0 flex-1">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="メッセージを入力..."
              rows={1}
              className="w-full resize-none rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              aria-label="メッセージ入力"
            />
          </div>

          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim()}
            className={[
              "mb-0.5 flex h-9 w-9 items-center justify-center rounded-xl transition-colors",
              input.trim()
                ? "cursor-pointer bg-violet-600 text-white hover:bg-violet-700"
                : "cursor-not-allowed bg-gray-200 text-gray-400",
            ].join(" ")}
            aria-label="送信"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

/** Right panel — Suggestions & Tasks */
function SidePanel({
  suggestions,
  tasks,
}: {
  suggestions: Suggestion[];
  tasks: TaskItem[];
}) {
  return (
    <aside className="flex h-full w-[280px] shrink-0 flex-col overflow-y-auto border-l border-gray-200 bg-white">
      {/* Suggestions */}
      <div className="border-b border-gray-100 px-4 py-4">
        <h3 className="mb-3 text-sm font-bold text-gray-900">
          提案事項 / 承認待ち
        </h3>
        <ul className="space-y-2">
          {suggestions.map((s) => (
            <li
              key={s.id}
              className="rounded-lg bg-violet-50 px-3 py-2 text-xs leading-relaxed text-violet-800"
            >
              {s.text}
            </li>
          ))}
        </ul>
      </div>

      {/* Tasks */}
      <div className="px-4 py-4">
        <h3 className="mb-3 text-sm font-bold text-gray-900">タスク</h3>
        <ul className="space-y-2">
          {tasks.map((t) => (
            <li key={t.id} className="flex items-start gap-2">
              <span
                className={[
                  "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                  t.done
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : "border-gray-300",
                ].join(" ")}
              >
                {t.done && (
                  <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </span>
              <span
                className={[
                  "text-xs leading-relaxed",
                  t.done ? "text-gray-400 line-through" : "text-gray-700",
                ].join(" ")}
              >
                {t.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ChatPage() {
  const [activeBoardId, setActiveBoardId] = useState("board-1");
  const [messagesMap, setMessagesMap] = useState(boardMessages);

  const activeBoard = boards.find((b) => b.id === activeBoardId) ?? boards[0];
  const activeMessages = messagesMap[activeBoardId] ?? [];
  const activeSuggestions = boardSuggestions[activeBoardId] ?? [];
  const activeTasks = boardTasks[activeBoardId] ?? [];

  const handleSend = useCallback(
    (text: string) => {
      const now = new Date();
      const ts = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;

      const newMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        sender: "あなた",
        senderInitial: "あ",
        senderColor: "bg-gray-600",
        content: text,
        timestamp: ts,
      };

      setMessagesMap((prev) => ({
        ...prev,
        [activeBoardId]: [...(prev[activeBoardId] ?? []), newMsg],
      }));
    },
    [activeBoardId]
  );

  return (
    <div className="flex h-full flex-col">
      {/* Top section: Header + Crew cards */}
      <div className="border-b border-gray-200 bg-white px-6 pt-4 pb-4">
        <h1 className="mb-4 text-lg font-bold text-gray-900">ホーム</h1>

        {/* Crew member cards — horizontal scroll */}
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-4">
            {crewMembers.map((member) => (
              <CrewCard key={member.name} member={member} />
            ))}
          </div>
        </div>

        {/* New chat button */}
        <button
          type="button"
          className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
        >
          チャットを新規作成
        </button>
      </div>

      {/* 3-column layout */}
      <div className="flex min-h-0 flex-1">
        {/* Left — Board list */}
        <BoardList activeId={activeBoardId} onSelect={setActiveBoardId} />

        {/* Center — Chat area */}
        <ChatArea
          board={activeBoard}
          messages={activeMessages}
          onSend={handleSend}
        />

        {/* Right — Suggestions & Tasks */}
        <SidePanel suggestions={activeSuggestions} tasks={activeTasks} />
      </div>
    </div>
  );
}
