"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CrewMember {
  name: string;
  tag: string;
  color: string;
  initial: string;
  stateLabel: string;
  stateTone: "active" | "analysis" | "waiting";
  bullets: string[];
  warningText?: string;
  progress?: number;
  waitingText?: string;
  role: string;
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
  isAI?: boolean;
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

interface ApprovalDoc {
  id: string;
  title: string;
  type: string;
  amount: string;
  date: string;
  status: "pending" | "approved" | "rejected";
  aiComment: string;
}

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------

const crewMembers: CrewMember[] = [
  {
    name: "太郎",
    tag: "リーダー",
    color: "bg-violet-400",
    initial: "太",
    stateLabel: "稼働中",
    stateTone: "active",
    bullets: [
      "音声データのテキスト解析",
      "納期変更・予算追加を重要事項として抽出",
      "★ Notion「2024年プロジェクト管理」に書き出し",
    ],
    progress: 80,
    role: "プロジェクト全般管理・業務支援",
  },
  {
    name: "さくら",
    tag: "プロジェクトマネージャー",
    color: "bg-pink-400",
    initial: "さ",
    stateLabel: "稼働中",
    stateTone: "active",
    bullets: [
      "返信メール下書き作成中・・・",
      "タスクリストをSlack #general に投稿",
    ],
    warningText: "送信前に承認が必要です",
    progress: 80,
    role: "マーケティング・コピーライティング",
  },
  {
    name: "ケンシロウ",
    tag: "カスタマーサクセス",
    color: "bg-blue-400",
    initial: "ケ",
    stateLabel: "稼働中",
    stateTone: "active",
    bullets: [
      "返信メール下書き作成中・・・",
      "★ Notion「2024年プロジェクト管理」に書き出し",
    ],
    warningText: "送信前に承認が必要です",
    progress: 80,
    role: "システム開発・技術調査",
  },
  {
    name: "葵",
    tag: "マーケター / リサーチ",
    color: "bg-emerald-400",
    initial: "葵",
    stateLabel: "分析中",
    stateTone: "analysis",
    bullets: [
      "競合B社・C社の情報を収集中",
      "競合A社の料金ページを取得",
    ],
    progress: 80,
    role: "UI/UXデザイン・アセット制作",
  },
  {
    name: "吉田梅",
    tag: "営業アシスタント",
    color: "bg-amber-400",
    initial: "梅",
    stateLabel: "待機中",
    stateTone: "waiting",
    bullets: ["リード5件のフォローメール下書き完了"],
    waitingText: "次のタスクが割り当てられるのを待機中",
    role: "経理・請求書管理・スケジュール調整",
  },
];

const stateBadgeStyle: Record<CrewMember["stateTone"], string> = {
  active: "bg-emerald-100 text-emerald-700 border-emerald-300",
  analysis: "bg-amber-100 text-amber-700 border-amber-300",
  waiting: "bg-gray-100 text-gray-500 border-gray-300",
};

const boards: Board[] = [
  {
    id: "board-1",
    name: "プロジェクトA組",
    members: [
      { initial: "太", color: "bg-violet-400" },
      { initial: "さ", color: "bg-pink-400" },
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
      { initial: "さ", color: "bg-pink-400" },
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
      { initial: "さ", color: "bg-pink-400" },
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
      sender: "さくら",
      senderInitial: "さ",
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
      id: "ai-1",
      sender: "HiCrew AI",
      senderInitial: "H",
      senderColor: "bg-accent",
      content: "進捗としてよく、タスクの残りもスムーズに進められるかと思います。スケジュールに沿っていることを確認しつつ下記ご覧ください。",
      timestamp: "10:00",
      isAI: true,
    },
    {
      id: "5",
      sender: "太郎",
      senderInitial: "太",
      senderColor: "bg-violet-400",
      content: "順調ですね。午後にはレビューを入れましょう。さくらさん、見積書の回答が来たら共有お願いします。",
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
      sender: "さくら",
      senderInitial: "さ",
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
    { id: "s1", text: "タスクの確認とスムーズな情報共有を心がけましょう" },
    { id: "s2", text: "タスク管理ボードへ入力する事を確認する" },
    { id: "s3", text: "問題がなければ次のNoteにアップロードしてください" },
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

const approvalDocs: ApprovalDoc[] = [
  {
    id: "e1",
    title: "quotation_legal_240824.pdf",
    type: "見積書",
    amount: "¥2,000,000",
    date: "2024年4月30日",
    status: "pending",
    aiComment: "この見積書はWebリニューアルプロジェクトの法務確認用です。金額は予算範囲内で、過去の類似案件と比較して妥当な水準です。承認をお勧めします。",
  },
  {
    id: "e2",
    title: "expense_report_march.pdf",
    type: "経費精算",
    amount: "¥85,400",
    date: "2024年3月15日",
    status: "approved",
    aiComment: "経費精算書の内容は規定に沿っています。",
  },
  {
    id: "e3",
    title: "invoice_design_02.pdf",
    type: "請求書",
    amount: "¥350,000",
    date: "2024年3月20日",
    status: "pending",
    aiComment: "デザイン制作の請求書です。契約金額と一致しており、問題ありません。",
  },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function OverlappingAvatars({ members }: { members: BoardMember[] }) {
  return (
    <div className="flex -space-x-1.5">
      {members.map((m, i) => (
        <div
          key={i}
          className={`flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-[9px] font-bold text-white ${m.color}`}
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
    <aside className="flex h-full w-[260px] shrink-0 flex-col border-r border-border-default bg-card-bg">
      <div className="border-b border-border-default px-4 py-3">
        <h2 className="text-sm font-bold text-text-primary">掲示板</h2>
      </div>
      <nav className="flex-1 overflow-y-auto" aria-label="ボード一覧">
        <ul className="flex flex-col">
          {boards.map((board) => {
            const isActive = activeId === board.id;
            return (
              <li key={board.id}>
                <button
                  type="button"
                  onClick={() => onSelect(board.id)}
                  className={[
                    "flex w-full flex-col gap-1.5 px-4 py-3 text-left transition-colors border-l-[3px]",
                    isActive
                      ? "bg-violet-50 border-accent"
                      : "border-transparent hover:bg-gray-50",
                  ].join(" ")}
                  aria-current={isActive ? "true" : undefined}
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate text-[13px] font-semibold text-text-primary">
                      {board.name}
                    </span>
                    <span className="shrink-0 text-[11px] text-text-disabled">
                      {board.lastTime}
                    </span>
                  </div>
                  <OverlappingAvatars members={board.members} />
                  <p className="truncate text-[11px] text-text-muted">
                    {board.lastMessage}
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

/** Center panel — Chat area */
function ChatArea({
  board,
  messages,
  tasks,
  onSend,
}: {
  board: Board;
  messages: ChatMessage[];
  tasks: TaskItem[];
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
      <header className="flex items-center justify-between border-b border-border-default bg-card-bg px-5 py-3">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-bold text-text-primary">
            プロジェクト名：{board.name}
          </h2>
          <OverlappingAvatars members={board.members} />
        </div>
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <span>経費書等：承認待ち</span>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-page-bg px-5 py-5">
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
                  <span className={`text-[13px] font-semibold ${msg.isAI ? "text-accent" : "text-text-primary"}`}>
                    {msg.sender}
                  </span>
                  <span className="text-[11px] text-text-disabled">
                    {msg.timestamp}
                  </span>
                </div>
                <p className={`mt-1 text-sm leading-relaxed ${msg.isAI ? "text-accent-dark rounded-lg bg-violet-50 px-3 py-2" : "text-text-secondary"}`}>
                  {msg.content}
                </p>
              </div>
            </div>
          ))}

          {/* Task items in chat */}
          {tasks.length > 0 && (
            <div className="mt-2 rounded-lg border border-border-default bg-card-bg p-3">
              <p className="mb-2 text-xs font-semibold text-text-muted">タスク</p>
              <div className="space-y-1.5">
                {tasks.map((t) => (
                  <label key={t.id} className="flex items-center gap-2 cursor-pointer">
                    <span
                      className={[
                        "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                        t.done
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : "border-gray-300 bg-white",
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
                        "text-xs",
                        t.done ? "text-text-disabled line-through" : "text-text-primary",
                      ].join(" ")}
                    >
                      {t.text}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input bar */}
      <div className="border-t border-border-default bg-card-bg px-5 py-3">
        <div className="flex items-end gap-3">
          <button
            type="button"
            className="mb-0.5 rounded-lg p-2 text-text-muted transition-colors hover:bg-gray-100 hover:text-text-secondary"
            aria-label="ファイル添付"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
            </svg>
          </button>

          <div className="min-w-0 flex-1">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="意見してください..."
              rows={1}
              className="w-full resize-none rounded-xl border border-border-default bg-page-bg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-disabled transition-colors focus:border-accent focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/20"
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
                ? "cursor-pointer bg-accent text-white hover:bg-accent-hover"
                : "cursor-not-allowed bg-gray-200 text-text-disabled",
            ].join(" ")}
            aria-label="送信"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

/** Right panel — Approval / Suggestions panel (per design: hicrew_chat_subwindow.png) */
function ApprovalPanel({
  docs,
  suggestions,
  selectedDoc,
  onDocClick,
  onClose,
}: {
  docs: ApprovalDoc[];
  suggestions: Suggestion[];
  selectedDoc: ApprovalDoc | null;
  onDocClick: (doc: ApprovalDoc) => void;
  onClose: () => void;
}) {
  if (selectedDoc) {
    // Detail view — right fixed split panel (not a centered modal)
    return (
      <aside className="flex h-full w-[340px] shrink-0 flex-col border-l border-border-default bg-card-bg">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-default px-5 py-3">
          <h3 className="text-sm font-bold text-text-primary">承認書の詳しい詳細</h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-text-muted hover:bg-gray-100 transition-colors"
            aria-label="閉じる"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* File info */}
          <div className="flex items-center gap-3 rounded-lg bg-page-bg p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">{selectedDoc.title}</p>
              <p className="text-xs text-text-muted">{selectedDoc.type}</p>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-page-bg p-3">
              <p className="text-[11px] text-text-muted mb-1">金額</p>
              <p className="text-lg font-bold text-text-primary">{selectedDoc.amount}</p>
            </div>
            <div className="rounded-lg bg-page-bg p-3">
              <p className="text-[11px] text-text-muted mb-1">期日</p>
              <p className="text-sm font-medium text-text-primary">{selectedDoc.date}</p>
            </div>
          </div>

          {/* AI Analysis */}
          <div className="rounded-lg bg-violet-50 border border-violet-100 p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent">
                <span className="text-[8px] font-bold text-white">H</span>
              </div>
              <span className="text-xs font-semibold text-accent">AI分析結果</span>
            </div>
            <p className="text-xs leading-relaxed text-text-secondary">
              {selectedDoc.aiComment}
            </p>
          </div>

          {/* Email body preview */}
          <div className="rounded-lg border border-border-default bg-white p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-text-muted">メール本文</span>
              <button
                type="button"
                className="text-[11px] font-medium text-accent hover:underline"
              >
                全文を表示
              </button>
            </div>
            <div className="rounded-md bg-page-bg p-2.5 text-[11px] leading-relaxed text-text-secondary">
              <p>お世話になっております。</p>
              <p className="mt-1">添付の{selectedDoc.type}（{selectedDoc.title}）をご確認の上、ご承認をお願いいたします。</p>
              <p className="mt-1 text-text-disabled">…</p>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex flex-col gap-2 border-t border-border-default px-5 py-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-border-default px-3 py-2 text-sm font-medium text-text-secondary hover:bg-gray-50 transition-colors"
            >
              却下する
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-accent/30 bg-accent/5 px-3 py-2 text-sm font-medium text-accent hover:bg-accent/10 transition-colors"
            >
              条件をつけて承認
            </button>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover transition-colors"
          >
            承認する
          </button>
        </div>
      </aside>
    );
  }

  // List view — pending approvals
  return (
    <aside className="flex h-full w-[280px] shrink-0 flex-col border-l border-border-default bg-card-bg">
      <div className="flex-1 overflow-y-auto">
        {/* Approval section header */}
        <div className="border-b border-border-default px-4 py-3">
          <h3 className="text-sm font-bold text-text-primary">
            経費書等：承認待ち <span className="ml-1 text-text-muted font-normal">{docs.filter(d => d.status === "pending").length}件</span>
          </h3>
        </div>

        <div className="p-3 space-y-2">
        {docs.map((doc) => (
          <button
            key={doc.id}
            type="button"
            onClick={() => onDocClick(doc)}
            className="w-full rounded-lg border border-border-default bg-white p-3 text-left transition-colors hover:bg-gray-50 hover:border-accent/30"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <svg className="h-4 w-4 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <span className="text-[11px] text-text-primary truncate">{doc.title}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted">{doc.type}</span>
              <span className="text-xs font-semibold text-text-primary">{doc.amount}</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[10px] text-text-disabled">{doc.date}</span>
              <span
                className={[
                  "text-[10px] font-medium px-1.5 py-0.5 rounded-full",
                  doc.status === "pending"
                    ? "bg-amber-50 text-amber-600 border border-amber-200"
                    : doc.status === "approved"
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                      : "bg-red-50 text-red-600 border border-red-200",
                ].join(" ")}
              >
                {doc.status === "pending" ? "承認待ち" : doc.status === "approved" ? "承認済" : "却下"}
              </span>
            </div>
          </button>
        ))}

      </div>

      {/* Suggestions section */}
      {suggestions.length > 0 && (
        <div>
          <div className="border-t border-border-default px-4 py-3">
            <h3 className="text-sm font-bold text-text-primary">提案</h3>
          </div>
          <div className="px-3 pb-3 space-y-1.5">
            {suggestions.map((s) => (
              <div
                key={s.id}
                className="flex items-center gap-2 rounded-lg bg-violet-50/80 border border-violet-100 px-3 py-2 text-[12px] text-violet-700"
              >
                <svg className="h-4 w-4 shrink-0 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5.002 5.002 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span className="flex-1 min-w-0">{s.text}</span>
                <button
                  type="button"
                  className="shrink-0 rounded-md bg-accent px-2.5 py-1 text-[11px] font-semibold text-white transition-colors hover:bg-accent-hover"
                >
                  実行
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
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
  const [selectedDoc, setSelectedDoc] = useState<ApprovalDoc | null>(null);

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
    [activeBoardId],
  );

  return (
    <div className="flex h-full flex-col">
      {/* Top section: Header + Crew cards with speech bubbles */}
      <div className="border-b border-border-default bg-card-bg px-5 pt-4 pb-3">
        <h1 className="mb-3 text-lg font-bold text-text-primary">ホーム</h1>

        {/* Crew member cards — horizontal scroll with structured status */}
        <div className="overflow-x-auto pb-1">
          <div className="flex gap-3">
            {crewMembers.map((member) => (
              <div key={member.name} className="min-w-[220px] rounded-xl border border-border-default bg-white p-2.5 shadow-sm">
                <div className="flex items-start gap-2">
                  <div className="relative shrink-0">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white ${member.color}`}
                    >
                      {member.initial}
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1.5">
                      <p className="truncate text-[11px] font-semibold text-text-primary">{member.name}</p>
                      <span className={`shrink-0 rounded-full border px-1.5 py-0.5 text-[10px] ${stateBadgeStyle[member.stateTone]}`}>
                        {member.stateLabel}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[10px] text-text-muted">{member.tag}</p>
                  </div>
                </div>

                <ul className="mt-2 space-y-0.5">
                  {member.warningText && (
                    <li className="text-[11px] text-pink-500">● {member.warningText}</li>
                  )}
                  {member.bullets.slice(0, 2).map((line, idx) => (
                    <li key={`${member.name}-line-${idx}`} className="truncate text-[11px] text-text-secondary">
                      ● {line}
                    </li>
                  ))}
                </ul>

                {typeof member.progress === "number" ? (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                      <div className="h-full rounded-full bg-lime-400" style={{ width: `${member.progress}%` }} />
                    </div>
                    <span className="text-[10px] text-text-muted">{member.progress}%</span>
                  </div>
                ) : (
                  <p className="mt-2 text-[10px] text-gray-400">◌ {member.waitingText}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* New chat button */}
        <button
          type="button"
          className="mt-3 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
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
          tasks={activeTasks}
          onSend={handleSend}
        />

        {/* Right — Approval + Suggestions panel */}
        <ApprovalPanel
          docs={approvalDocs}
          suggestions={activeSuggestions}
          selectedDoc={selectedDoc}
          onDocClick={setSelectedDoc}
          onClose={() => setSelectedDoc(null)}
        />
      </div>
    </div>
  );
}
