"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { StoredAnima, StoredMessage } from "@/lib/storage/types";
import { BrainstormModal } from "@/components/brainstorm/BrainstormModal";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Anima without systemPrompt (as returned by public API) */
type PublicAnima = Omit<StoredAnima, "systemPrompt">;

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
  isStreaming?: boolean;
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
// Static data (approval docs — kept as placeholder)
// ---------------------------------------------------------------------------

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
// Helpers
// ---------------------------------------------------------------------------

const stateBadgeStyle: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700 border-emerald-300",
  analysis: "bg-amber-100 text-amber-700 border-amber-300",
  waiting: "bg-gray-100 text-gray-500 border-gray-300",
};

function animaStatusToTone(status: StoredAnima["status"]): string {
  if (status === "online") return "active";
  if (status === "busy") return "analysis";
  return "waiting";
}

function animaStatusLabel(status: StoredAnima["status"]): string {
  if (status === "online") return "稼働中";
  if (status === "busy") return "処理中";
  return "待機中";
}

function storedMessageToChat(m: StoredMessage, anima?: PublicAnima | null): ChatMessage {
  const isUser = m.senderType === "user";
  return {
    id: m.id,
    sender: m.senderName,
    senderInitial: isUser ? "あ" : (anima?.avatar ?? m.senderName.charAt(0)),
    senderColor: isUser ? "bg-gray-600" : (anima ? `bg-gradient-to-br ${anima.avatarColor}` : "bg-accent"),
    content: m.content,
    timestamp: new Date(m.createdAt).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" }),
    isAI: !isUser,
  };
}

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
  boards,
  activeId,
  onSelect,
  onBrainstorm,
}: {
  boards: Board[];
  activeId: string;
  onSelect: (id: string) => void;
  onBrainstorm: () => void;
}) {
  return (
    <aside className="flex h-full w-[260px] shrink-0 flex-col border-r border-border-default bg-card-bg">
      <div className="border-b border-border-default px-4 py-3 space-y-2">
        <h2 className="text-sm font-bold text-text-primary">掲示板</h2>
        <button
          type="button"
          onClick={onBrainstorm}
          className="flex w-full items-center gap-2 rounded-lg bg-accent/10 border border-accent/20 px-3 py-2 text-xs font-semibold text-accent transition-colors hover:bg-accent/20 cursor-pointer"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          ブレインストーミング
        </button>
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
  const isComposing = useRef(false);

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
    // Cmd+Enter (Mac) または Ctrl+Enter (Windows/Linux) で送信
    // IME変換中（日本語入力の確定Enter）では送信しない
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && !isComposing.current) {
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
            {board.name}
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
                  {msg.isStreaming && (
                    <span className="text-[10px] text-accent animate-pulse">入力中...</span>
                  )}
                </div>
                {msg.isAI ? (
                  <div className="chat-markdown chat-markdown--light mt-1 text-sm leading-relaxed text-accent-dark rounded-lg bg-violet-50 px-3 py-2">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content || (msg.isStreaming ? "..." : "")}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                    {msg.content}
                  </p>
                )}
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

      {/* Input bar — form wrapper prevents Enter-key form submission */}
      <form onSubmit={(e) => e.preventDefault()}>
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
                onCompositionStart={() => { isComposing.current = true; }}
                onCompositionEnd={() => { isComposing.current = false; }}
                placeholder="メッセージを入力..."
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
          <p className="mt-1.5 text-center text-[11px] text-text-disabled">
            Shift + Enter で改行 ・ ⌘ + Enter で送信
          </p>
        </div>
      </form>
    </div>
  );
}

/** Right panel — Approval / Suggestions panel */
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
    // Detail view — right fixed split panel
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
  const [animas, setAnimas] = useState<PublicAnima[]>([]);
  const [activeBoardId, setActiveBoardId] = useState<string>("");
  const [messagesMap, setMessagesMap] = useState<Record<string, ChatMessage[]>>({});
  const [selectedDoc, setSelectedDoc] = useState<ApprovalDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [brainstormModalOpen, setBrainstormModalOpen] = useState(false);
  // Track which rooms already had their history fetched
  const fetchedRooms = useRef<Set<string>>(new Set());

  // ---- 1. Fetch animas on mount ----
  useEffect(() => {
    let cancelled = false;
    fetch("/api/animas")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const list: PublicAnima[] = data.animas ?? [];
        setAnimas(list);
        if (list.length > 0) setActiveBoardId(list[0].id);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  // ---- 2. Derive boards from animas + brainstorm boards ----
  const animaBoards: Board[] = animas.map((a) => ({
    id: a.id,
    name: a.name,
    members: [{ initial: a.avatar, color: `bg-gradient-to-br ${a.avatarColor}` }],
    lastMessage: a.description,
    lastTime: a.status === "online" ? "オンライン" : "オフライン",
  }));

  // Add any brainstorm boards (keys starting with "brainstorm-")
  const brainstormBoards: Board[] = Object.keys(messagesMap)
    .filter((k) => k.startsWith("brainstorm-"))
    .map((k) => ({
      id: k,
      name: `BS: ${k.replace("brainstorm-", "").slice(0, 20)}`,
      members: [{ initial: "B", color: "bg-accent" }],
      lastMessage: "ブレインストーミング",
      lastTime: "今",
    }));

  const boards = [...brainstormBoards, ...animaBoards];

  const activeBoard = boards.find((b) => b.id === activeBoardId) ?? boards[0];
  const activeMessages = messagesMap[activeBoardId] ?? [];

  // ---- 3. Load message history when board changes ----
  useEffect(() => {
    if (!activeBoardId || fetchedRooms.current.has(activeBoardId)) return;
    fetchedRooms.current.add(activeBoardId);

    const anima = animas.find((a) => a.id === activeBoardId) ?? null;

    fetch(`/api/rooms/anima-${activeBoardId}/messages`)
      .then((r) => r.json())
      .then((data) => {
        const stored: StoredMessage[] = data.messages ?? [];
        const chatMsgs = stored.map((m) => storedMessageToChat(m, anima));
        setMessagesMap((prev) => ({ ...prev, [activeBoardId]: chatMsgs }));
      })
      .catch(() => {
        setMessagesMap((prev) => ({ ...prev, [activeBoardId]: [] }));
      });
  }, [activeBoardId, animas]);

  // ---- 3b. Start brainstorm session ----
  const handleBrainstormStart = useCallback(
    async (config: {
      theme: string;
      constraints: string;
      expectedOutput: string;
      characterIds: string[];
    }) => {
      setBrainstormModalOpen(false);

      // Create a virtual brainstorm board
      const bsId = `brainstorm-${Date.now()}`;
      const bsBoard: Board = {
        id: bsId,
        name: `BS: ${config.theme.slice(0, 30)}`,
        members: config.characterIds
          .map((id) => animas.find((a) => a.id === id))
          .filter(Boolean)
          .map((a) => ({
            initial: a!.avatar,
            color: `bg-gradient-to-br ${a!.avatarColor}`,
          })),
        lastMessage: "ブレインストーミング中...",
        lastTime: "今",
      };

      // Add brainstorm board to the boards list by updating animas state won't work,
      // so we add the messages directly under the bsId key
      setMessagesMap((prev) => ({ ...prev, [bsId]: [] }));
      setActiveBoardId(bsId);

      // Start SSE stream
      try {
        const res = await fetch("/api/brainstorm/stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            theme: config.theme,
            constraints: config.constraints,
            expected_output: config.expectedOutput,
            character_ids: config.characterIds,
          }),
        });

        if (!res.body) throw new Error("No response body");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        // Track current character message
        let currentCharMsgId = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            let evt: Record<string, string>;
            try {
              evt = JSON.parse(line.slice(6));
            } catch {
              continue;
            }

            switch (evt.type) {
              case "char_start": {
                const anima = animas.find((a) => a.id === evt.char_id);
                currentCharMsgId = `bs-char-${evt.char_id}-${Date.now()}`;
                const msg: ChatMessage = {
                  id: currentCharMsgId,
                  sender: evt.char_name,
                  senderInitial: anima?.avatar ?? evt.char_name.charAt(0),
                  senderColor: anima ? `bg-gradient-to-br ${anima.avatarColor}` : "bg-accent",
                  content: "",
                  timestamp: new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" }),
                  isAI: true,
                  isStreaming: true,
                };
                setMessagesMap((prev) => ({
                  ...prev,
                  [bsId]: [...(prev[bsId] ?? []), msg],
                }));
                break;
              }
              case "char_chunk": {
                setMessagesMap((prev) => {
                  const msgs = prev[bsId] ?? [];
                  return {
                    ...prev,
                    [bsId]: msgs.map((m) =>
                      m.id === currentCharMsgId
                        ? { ...m, content: m.content + evt.text }
                        : m,
                    ),
                  };
                });
                break;
              }
              case "char_done": {
                setMessagesMap((prev) => {
                  const msgs = prev[bsId] ?? [];
                  return {
                    ...prev,
                    [bsId]: msgs.map((m) =>
                      m.id === currentCharMsgId
                        ? { ...m, isStreaming: false }
                        : m,
                    ),
                  };
                });
                break;
              }
              case "synth_start": {
                currentCharMsgId = `bs-synth-${Date.now()}`;
                const synthMsg: ChatMessage = {
                  id: currentCharMsgId,
                  sender: `${evt.char_name} - まとめ`,
                  senderInitial: "S",
                  senderColor: "bg-gray-700",
                  content: "",
                  timestamp: new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" }),
                  isAI: true,
                  isStreaming: true,
                };
                setMessagesMap((prev) => ({
                  ...prev,
                  [bsId]: [...(prev[bsId] ?? []), synthMsg],
                }));
                break;
              }
              case "synth_chunk": {
                setMessagesMap((prev) => {
                  const msgs = prev[bsId] ?? [];
                  return {
                    ...prev,
                    [bsId]: msgs.map((m) =>
                      m.id === currentCharMsgId
                        ? { ...m, content: m.content + evt.text }
                        : m,
                    ),
                  };
                });
                break;
              }
              case "synth_done": {
                setMessagesMap((prev) => {
                  const msgs = prev[bsId] ?? [];
                  return {
                    ...prev,
                    [bsId]: msgs.map((m) =>
                      m.id === currentCharMsgId
                        ? { ...m, isStreaming: false }
                        : m,
                    ),
                  };
                });
                break;
              }
              case "done":
                break;
            }
          }
        }
      } catch (error) {
        const errMsg = error instanceof Error ? error.message : "Unknown error";
        setMessagesMap((prev) => ({
          ...prev,
          [bsId]: [
            ...(prev[bsId] ?? []),
            {
              id: `bs-error-${Date.now()}`,
              sender: "システム",
              senderInitial: "!",
              senderColor: "bg-red-500",
              content: `ブレインストーミングの実行中にエラーが発生しました: ${errMsg}`,
              timestamp: new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" }),
              isAI: true,
            },
          ],
        }));
      }
    },
    [animas],
  );

  // ---- 4. Send message with SSE streaming ----
  const handleSend = useCallback(
    async (text: string) => {
      const now = new Date();
      const ts = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;

      // User message — add immediately
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        sender: "あなた",
        senderInitial: "あ",
        senderColor: "bg-gray-600",
        content: text,
        timestamp: ts,
      };

      const boardId = activeBoardId; // capture for closures

      setMessagesMap((prev) => ({
        ...prev,
        [boardId]: [...(prev[boardId] ?? []), userMsg],
      }));

      // AI placeholder
      const aiMsgId = `ai-${Date.now()}`;
      const anima = animas.find((a) => a.id === boardId) ?? null;
      const aiMsg: ChatMessage = {
        id: aiMsgId,
        sender: anima?.name ?? "AI",
        senderInitial: anima?.avatar ?? "A",
        senderColor: anima ? `bg-gradient-to-br ${anima.avatarColor}` : "bg-accent",
        content: "",
        timestamp: ts,
        isAI: true,
        isStreaming: true,
      };

      setMessagesMap((prev) => ({
        ...prev,
        [boardId]: [...(prev[boardId] ?? []), aiMsg],
      }));

      try {
        const res = await fetch(`/api/rooms/anima-${boardId}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: text, animaId: boardId }),
        });

        if (!res.body) throw new Error("No response body");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split("\n\n");
          buffer = parts.pop() ?? "";

          for (const part of parts) {
            if (!part.startsWith("data: ")) continue;
            try {
              const event = JSON.parse(part.slice(6));
              if (event.type === "chunk") {
                setMessagesMap((prev) => {
                  const msgs = prev[boardId] ?? [];
                  return {
                    ...prev,
                    [boardId]: msgs.map((m) =>
                      m.id === aiMsgId
                        ? { ...m, content: m.content + event.content }
                        : m,
                    ),
                  };
                });
              } else if (event.type === "done") {
                setMessagesMap((prev) => {
                  const msgs = prev[boardId] ?? [];
                  return {
                    ...prev,
                    [boardId]: msgs.map((m) =>
                      m.id === aiMsgId
                        ? { ...m, content: event.content, isStreaming: false }
                        : m,
                    ),
                  };
                });
              } else if (event.type === "error") {
                setMessagesMap((prev) => {
                  const msgs = prev[boardId] ?? [];
                  return {
                    ...prev,
                    [boardId]: msgs.map((m) =>
                      m.id === aiMsgId
                        ? { ...m, content: `エラー: ${event.error}`, isStreaming: false }
                        : m,
                    ),
                  };
                });
              }
            } catch {
              /* skip unparseable SSE lines */
            }
          }
        }

        // Ensure streaming flag is cleared even if "done" event wasn't received
        setMessagesMap((prev) => {
          const msgs = prev[boardId] ?? [];
          return {
            ...prev,
            [boardId]: msgs.map((m) =>
              m.id === aiMsgId && m.isStreaming ? { ...m, isStreaming: false } : m,
            ),
          };
        });
      } catch {
        setMessagesMap((prev) => {
          const msgs = prev[boardId] ?? [];
          return {
            ...prev,
            [boardId]: msgs.map((m) =>
              m.id === aiMsgId
                ? { ...m, content: "通信エラーが発生しました", isStreaming: false }
                : m,
            ),
          };
        });
      }
    },
    [activeBoardId, animas],
  );

  // ---- Loading state ----
  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-text-muted">読み込み中...</p>
      </div>
    );
  }

  if (animas.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-text-muted">アニマが登録されていません。</p>
      </div>
    );
  }

  // ---- 5. Crew cards from anima data ----
  const crewCards = animas.map((a) => {
    const tone = animaStatusToTone(a.status);
    return (
      <div key={a.id} className="min-w-[220px] rounded-xl border border-border-default bg-white p-2.5 shadow-sm">
        <div className="flex items-start gap-2">
          <div className="relative shrink-0">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white bg-gradient-to-br ${a.avatarColor}`}
            >
              {a.avatar}
            </div>
            {a.status === "online" && (
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-400" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1.5">
              <p className="truncate text-[11px] font-semibold text-text-primary">{a.name}</p>
              <span className={`shrink-0 rounded-full border px-1.5 py-0.5 text-[10px] ${stateBadgeStyle[tone] ?? stateBadgeStyle.waiting}`}>
                {animaStatusLabel(a.status)}
              </span>
            </div>
            <p className="mt-0.5 text-[10px] text-text-muted">{a.description}</p>
          </div>
        </div>

        {a.tags.length > 0 && (
          <ul className="mt-2 space-y-0.5">
            {a.tags.slice(0, 3).map((tag, idx) => (
              <li key={`${a.id}-tag-${idx}`} className="truncate text-[11px] text-text-secondary">
                ● {tag}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  });

  return (
    <div className="flex h-full flex-col">
      {/* Top section: Header + Crew cards */}
      <div className="border-b border-border-default bg-card-bg px-5 pt-4 pb-3">
        <h1 className="mb-3 text-lg font-bold text-text-primary">ホーム</h1>

        {/* Crew member cards — horizontal scroll */}
        <div className="overflow-x-auto pb-1">
          <div className="flex gap-3">{crewCards}</div>
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
        <BoardList boards={boards} activeId={activeBoardId} onSelect={setActiveBoardId} onBrainstorm={() => setBrainstormModalOpen(true)} />

        {/* Center — Chat area */}
        {activeBoard && (
          <ChatArea
            board={activeBoard}
            messages={activeMessages}
            tasks={[]}
            onSend={handleSend}
          />
        )}

        {/* Right — Approval + Suggestions panel */}
        <ApprovalPanel
          docs={approvalDocs}
          suggestions={[]}
          selectedDoc={selectedDoc}
          onDocClick={setSelectedDoc}
          onClose={() => setSelectedDoc(null)}
        />
      </div>

      {/* Brainstorm Modal */}
      <BrainstormModal
        open={brainstormModalOpen}
        onClose={() => setBrainstormModalOpen(false)}
        onStart={handleBrainstormStart}
      />
    </div>
  );
}
