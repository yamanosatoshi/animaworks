"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import type { ChatMessage, BoardCharacter } from "@/types/chat";
import { CharacterHeader } from "@/components/chat/CharacterHeader";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { StreamingMessage } from "@/components/chat/StreamingMessage";
import { InputBar } from "@/components/chat/InputBar";

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
      content: "ありがとう。実はプロジェクトの進め方で悩んでいて、アドバイスがほしいんだ。",
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
// SSE streaming simulation hook
// ---------------------------------------------------------------------------

function useStreamingSimulation(
  messages: ChatMessage[],
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  character: BoardCharacter,
) {
  const streamingRef = useRef(false);

  const simulateStream = useCallback(
    (userText: string) => {
      if (streamingRef.current) return;
      streamingRef.current = true;

      const replyText =
        `なるほど、「${userText.slice(0, 20)}${userText.length > 20 ? "..." : ""}」についてですね。\n\n` +
        "承知しました。少し整理してお伝えしますね。\n\n" +
        "**ポイント1**: まずは現状を整理することが大切です。\n" +
        "**ポイント2**: 次に、優先度を付けてステップバイステップで進めましょう。\n\n" +
        "詳しく掘り下げたい部分はありますか？";

      const streamId = `stream-${Date.now()}`;
      const streamMsg: ChatMessage = {
        id: streamId,
        boardId: character.id,
        senderType: "ai_host",
        senderName: character.name,
        senderAvatar: character.avatar,
        content: "",
        timestamp: new Date().toISOString(),
        llmProvider: character.llmProvider,
        isStreaming: true,
      };

      setMessages((prev) => [...prev, streamMsg]);

      let charIdx = 0;
      const interval = setInterval(() => {
        charIdx += 1 + Math.floor(Math.random() * 2);
        if (charIdx >= replyText.length) {
          charIdx = replyText.length;
          clearInterval(interval);
          streamingRef.current = false;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === streamId
                ? { ...m, content: replyText, isStreaming: false }
                : m,
            ),
          );
        } else {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === streamId
                ? { ...m, content: replyText.slice(0, charIdx) }
                : m,
            ),
          );
        }
      }, 30);
    },
    [character, setMessages],
  );

  return { simulateStream, isStreaming: streamingRef.current };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function BoardPage() {
  const params = useParams();
  const router = useRouter();
  const characterId = params.characterId as string;

  const character = characters.find((c) => c.id === characterId) ?? characters[0];
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    makeDummyMessages(character),
  );

  const { simulateStream } = useStreamingSimulation(
    messages,
    setMessages,
    character,
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(
    (text: string) => {
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        boardId: character.id,
        senderType: "user",
        senderName: "あなた",
        content: text,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);

      // Simulate SSE streaming response after a short delay
      setTimeout(() => simulateStream(text), 600);
    },
    [character.id, simulateStream],
  );

  return (
    <div className="flex h-full flex-col bg-gray-50">
      {/* Header */}
      <CharacterHeader
        character={character}
        onBack={() => router.push("/characters")}
      />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-4">
          {/* Date divider */}
          <div className="flex items-center gap-3 py-2">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs font-medium text-gray-400">今日</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {messages.map((msg) =>
            msg.isStreaming ? (
              <StreamingMessage key={msg.id} message={msg} />
            ) : (
              <MessageBubble key={msg.id} message={msg} />
            ),
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <InputBar onSend={handleSend} />
    </div>
  );
}
