"use client";

import React, { Suspense, useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: string;
}

interface Channel {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "offline";
  description: string;
}

// ---------------------------------------------------------------------------
// Dummy data
// ---------------------------------------------------------------------------

const channels: Record<string, Channel> = {
  aoi: {
    id: "aoi",
    name: "葵（Aoi）",
    avatar: "A",
    status: "online",
    description: "フレンドリーなAIアシスタント",
  },
  ren: {
    id: "ren",
    name: "蓮（Ren）",
    avatar: "R",
    status: "online",
    description: "ビジネス特化AIアドバイザー",
  },
  hina: {
    id: "hina",
    name: "陽菜（Hina）",
    avatar: "H",
    status: "offline",
    description: "クリエイティブ・コンサルタント",
  },
};

const defaultChannel: Channel = channels.aoi;

const dummyMessages: Message[] = [
  {
    id: "1",
    role: "ai",
    content:
      "こんにちは！葵です。今日はどんなことをお手伝いしましょうか？何でも気軽に聞いてくださいね。",
    timestamp: "10:00",
  },
  {
    id: "2",
    role: "user",
    content: "こんにちは！来週のプレゼン資料の構成について相談したいんだけど。",
    timestamp: "10:01",
  },
  {
    id: "3",
    role: "ai",
    content:
      "もちろんです！プレゼン資料の構成ですね。まず、いくつか教えてください。\n\n1. プレゼンのテーマ・目的は何ですか？\n2. 対象のオーディエンスは誰ですか？\n3. 持ち時間はどのくらいですか？\n\nこれらが分かると、より具体的なアドバイスができます！",
    timestamp: "10:01",
  },
  {
    id: "4",
    role: "user",
    content:
      "新規プロジェクトの提案で、経営層向け。持ち時間は15分くらいかな。",
    timestamp: "10:02",
  },
  {
    id: "5",
    role: "ai",
    content:
      "15分の経営層向けプレゼンですね。以下の構成をおすすめします：\n\n**1. エグゼクティブサマリー（2分）**\n結論とインパクトを最初に提示\n\n**2. 課題の提示（3分）**\n現状の課題とビジネスインパクト\n\n**3. 提案内容（5分）**\nソリューションの概要・差別化ポイント\n\n**4. 実行計画とROI（3分）**\nタイムライン・コスト・期待効果\n\n**5. まとめとNext Steps（2分）**\n\n経営層は「結論ファースト」が好まれるので、最初にインパクトを出すのがポイントです。各セクションについて詳しく掘り下げましょうか？",
    timestamp: "10:03",
  },
];

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

const InfoIcon = () => (
  <svg
    width="20"
    height="20"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.8}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
    />
  </svg>
);

const PhoneIcon = () => (
  <svg
    width="20"
    height="20"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.8}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
    />
  </svg>
);

const EllipsisIcon = () => (
  <svg
    width="20"
    height="20"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.8}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
    />
  </svg>
);

const PlusIcon = () => (
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
      d="M12 4.5v15m7.5-7.5h-15"
    />
  </svg>
);

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Top bar showing character info */
function ChatHeader({ channel }: { channel: Channel }) {
  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="relative">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 text-sm font-bold text-white">
            {channel.avatar}
          </div>
          {/* Online indicator */}
          <span
            className={[
              "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white",
              channel.status === "online" ? "bg-emerald-400" : "bg-gray-300",
            ].join(" ")}
            aria-label={
              channel.status === "online" ? "オンライン" : "オフライン"
            }
          />
        </div>
        {/* Name & description */}
        <div>
          <h1 className="text-sm font-semibold text-gray-900">
            {channel.name}
          </h1>
          <p className="text-xs text-gray-500">{channel.description}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          aria-label="音声通話"
        >
          <PhoneIcon />
        </button>
        <button
          type="button"
          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          aria-label="情報"
        >
          <InfoIcon />
        </button>
        <button
          type="button"
          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          aria-label="その他"
        >
          <EllipsisIcon />
        </button>
      </div>
    </header>
  );
}

/** Single message bubble */
function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div
      className={[
        "flex gap-3",
        isUser ? "flex-row-reverse" : "flex-row",
      ].join(" ")}
    >
      {/* Avatar (AI only) */}
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 text-xs font-bold text-white">
          AI
        </div>
      )}

      {/* Bubble */}
      <div
        className={[
          "max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "rounded-br-md bg-violet-600 text-white"
            : "rounded-bl-md bg-white text-gray-800 shadow-sm border border-gray-100",
        ].join(" ")}
      >
        {/* Render newlines + simple bold */}
        {message.content.split("\n").map((line, i) => (
          <React.Fragment key={i}>
            {i > 0 && <br />}
            {line.split(/(\*\*[^*]+\*\*)/).map((seg, j) =>
              seg.startsWith("**") && seg.endsWith("**") ? (
                <strong key={j} className="font-semibold">
                  {seg.slice(2, -2)}
                </strong>
              ) : (
                <span key={j}>{seg}</span>
              )
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Timestamp */}
      <span
        className={[
          "mt-auto mb-1 shrink-0 text-[11px] text-gray-400",
          isUser ? "text-right" : "text-left",
        ].join(" ")}
      >
        {message.timestamp}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------

function ChatContent() {
  const searchParams = useSearchParams();
  const channelId = searchParams.get("channel") ?? "aoi";
  const channel = channels[channelId] ?? defaultChannel;

  const [messages, setMessages] = useState<Message[]>(dummyMessages);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
    }
  }, [input]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    const now = new Date();
    const ts = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;

    // Add user message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: ts,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Simulate AI reply after short delay
    setTimeout(() => {
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        role: "ai",
        content:
          "承知しました！少々お待ちください。現在、内容を確認しています...",
        timestamp: ts,
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-full flex-col bg-gray-50">
      {/* Header */}
      <ChatHeader channel={channel} />

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-4">
          {/* Date divider */}
          <div className="flex items-center gap-3 py-2">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs font-medium text-gray-400">今日</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* Messages */}
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="border-t border-gray-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-end gap-3">
          {/* Attachment button */}
          <button
            type="button"
            className="mb-0.5 rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            aria-label="ファイル添付"
          >
            <PlusIcon />
          </button>

          {/* Text input */}
          <div className="relative flex-1">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="メッセージを入力..."
              rows={1}
              className="w-full resize-none rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 pr-12 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              aria-label="メッセージ入力"
            />
          </div>

          {/* Send button */}
          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim()}
            className={[
              "mb-0.5 flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
              input.trim()
                ? "bg-violet-600 text-white hover:bg-violet-700 cursor-pointer"
                : "bg-gray-200 text-gray-400 cursor-not-allowed",
            ].join(" ")}
            aria-label="送信"
          >
            <SendIcon />
          </button>
        </div>

        {/* Hint */}
        <p className="mx-auto mt-2 max-w-3xl text-center text-[11px] text-gray-400">
          Shift + Enter で改行 ・ Enter で送信
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page export (Suspense boundary for useSearchParams)
// ---------------------------------------------------------------------------

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center bg-gray-50">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-600 border-t-transparent" />
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  );
}
