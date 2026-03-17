"use client";

import React from "react";
import Link from "next/link";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface StatCard {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  color: string; // accent color class
  progress?: number; // 0-100
}

interface Character {
  id: string;
  name: string;
  role: string;
  description: string;
  avatar: string;
  avatarColor: string;
  status: "online" | "offline" | "busy";
  lastMessage?: string;
}

interface Activity {
  id: string;
  type: "chat" | "system" | "credit";
  message: string;
  time: string;
}

// ---------------------------------------------------------------------------
// Icons (Heroicons outline, inline SVG)
// ---------------------------------------------------------------------------

const CreditCardIcon = () => (
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
  </svg>
);

const ChatBubbleIcon = () => (
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
  </svg>
);

const ChartBarIcon = () => (
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
);

const UsersIcon = () => (
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);

const BellIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
  </svg>
);

// ---------------------------------------------------------------------------
// Circular progress ring
// ---------------------------------------------------------------------------

function ProgressRing({
  progress,
  size = 44,
  strokeWidth = 3.5,
  color,
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="shrink-0 -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-gray-100"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className={color}
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Dummy data
// ---------------------------------------------------------------------------

const stats: StatCard[] = [
  {
    label: "クレジット残高",
    value: "4,250",
    sub: "/ 5,000",
    icon: <CreditCardIcon />,
    color: "text-violet-500",
    progress: 85,
  },
  {
    label: "今月の会話数",
    value: "128",
    sub: "回",
    icon: <ChatBubbleIcon />,
    color: "text-emerald-500",
    progress: 64,
  },
  {
    label: "利用キャラクター",
    value: "4",
    sub: "/ 6",
    icon: <UsersIcon />,
    color: "text-blue-500",
    progress: 67,
  },
  {
    label: "月間利用時間",
    value: "12.5",
    sub: "時間",
    icon: <ChartBarIcon />,
    color: "text-amber-500",
    progress: 42,
  },
];

const characters: Character[] = [
  {
    id: "aoi",
    name: "葵（あおい）",
    role: "カウンセラー",
    description: "心に寄り添うカウンセラー。悩みごとや不安を穏やかに聴いて、一緒に解決策を見つけます。",
    avatar: "葵",
    avatarColor: "from-violet-400 to-indigo-500",
    status: "online",
    lastMessage: "お話しできるのを楽しみにしています！",
  },
  {
    id: "ren",
    name: "蓮（れん）",
    role: "ビジネスアドバイザー",
    description: "ビジネス戦略のプロフェッショナル。事業計画やマーケティングの相談にお応えします。",
    avatar: "蓮",
    avatarColor: "from-emerald-400 to-teal-500",
    status: "online",
    lastMessage: "新しい提案がありますよ。",
  },
  {
    id: "hina",
    name: "陽菜（ひな）",
    role: "クリエイティブディレクター",
    description: "デザインとクリエイティブの専門家。UI/UXやブランディングをサポートします。",
    avatar: "陽",
    avatarColor: "from-pink-400 to-rose-500",
    status: "busy",
    lastMessage: "デザインレビューの準備ができました。",
  },
  {
    id: "sora",
    name: "空（そら）",
    role: "エンジニア",
    description: "フルスタックエンジニア。コードレビューやアーキテクチャ設計の相談に対応します。",
    avatar: "空",
    avatarColor: "from-blue-400 to-cyan-500",
    status: "online",
    lastMessage: "コードの改善点を見つけました。",
  },
  {
    id: "mio",
    name: "美桜（みお）",
    role: "ライフコーチ",
    description: "暮らしと健康のアドバイザー。食事や運動など日常を豊かにするヒントを提案します。",
    avatar: "美",
    avatarColor: "from-amber-400 to-orange-500",
    status: "offline",
  },
  {
    id: "kai",
    name: "海（かい）",
    role: "エンタメコンパニオン",
    description: "映画、音楽、ゲーム、トレンド情報まで幅広く楽しい会話をお届けします。",
    avatar: "海",
    avatarColor: "from-purple-400 to-fuchsia-500",
    status: "online",
    lastMessage: "おすすめの映画リスト更新しました！",
  },
];

const activities: Activity[] = [
  { id: "1", type: "chat",   message: "葵と15分間会話しました",          time: "10分前" },
  { id: "2", type: "system", message: "新機能: グループチャットが追加",   time: "1時間前" },
  { id: "3", type: "credit", message: "クレジット 200 を追加購入しました", time: "3時間前" },
  { id: "4", type: "chat",   message: "蓮にビジネスプランを相談しました", time: "昨日" },
  { id: "5", type: "system", message: "プロフィール情報を更新しました",   time: "昨日" },
  { id: "6", type: "chat",   message: "空とコードレビューを行いました",   time: "2日前" },
];

// ---------------------------------------------------------------------------
// Status helpers
// ---------------------------------------------------------------------------

function statusDotClass(s: Character["status"]): string {
  switch (s) {
    case "online":  return "bg-emerald-500";
    case "busy":    return "bg-amber-500";
    case "offline": return "bg-gray-400";
  }
}

function statusLabel(s: Character["status"]): string {
  switch (s) {
    case "online":  return "オンライン";
    case "busy":    return "取り込み中";
    case "offline": return "オフライン";
  }
}

function activityIcon(type: Activity["type"]) {
  switch (type) {
    case "chat":
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-50 text-violet-500">
          <ChatBubbleIcon />
        </div>
      );
    case "credit":
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
          <CreditCardIcon />
        </div>
      );
    case "system":
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-500">
          <BellIcon />
        </div>
      );
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* ---- Greeting ---- */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            こんにちは、ユーザーさん 👋
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            今日も素敵な会話をお楽しみください
          </p>
        </div>

        {/* ---- Stat cards ---- */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              {/* Progress ring */}
              {stat.progress !== undefined && (
                <ProgressRing progress={stat.progress} color={stat.color} />
              )}

              {/* Text */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-gray-500">
                  {stat.label}
                </p>
                <p className="mt-0.5 flex items-baseline gap-1">
                  <span className="text-xl font-bold text-gray-900">
                    {stat.value}
                  </span>
                  {stat.sub && (
                    <span className="text-sm text-gray-400">{stat.sub}</span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ---- Main content: Characters + Activity ---- */}
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Characters grid */}
          <div className="flex-1">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                キャラクター
              </h2>
              <Link
                href="/channels"
                className="flex items-center gap-1 text-sm font-medium text-violet-600 hover:text-violet-700 transition-colors"
              >
                すべて見る
                <ArrowRightIcon />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {characters.map((ch) => (
                <Link
                  key={ch.id}
                  href={`/chat?channel=${ch.id}`}
                  className="group flex flex-col rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:border-violet-200 hover:-translate-y-0.5"
                >
                  {/* Card header */}
                  <div className="flex items-start gap-3.5 p-5 pb-3">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${ch.avatarColor} shadow-sm`}
                      >
                        <span className="text-lg font-bold text-white">
                          {ch.avatar}
                        </span>
                      </div>
                      {/* Status dot */}
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white ${statusDotClass(ch.status)}`}
                        title={statusLabel(ch.status)}
                        aria-label={statusLabel(ch.status)}
                      />
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-semibold text-gray-900 group-hover:text-violet-700 transition-colors">
                        {ch.name}
                      </h3>
                      <p className="mt-0.5 text-xs text-gray-500">{ch.role}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="px-5 text-sm leading-relaxed text-gray-600 line-clamp-2">
                    {ch.description}
                  </p>

                  {/* Footer */}
                  <div className="mt-auto flex items-center justify-between border-t border-gray-50 px-5 py-3 mt-3">
                    {ch.lastMessage ? (
                      <p className="truncate text-xs text-gray-400 mr-2">
                        &ldquo;{ch.lastMessage}&rdquo;
                      </p>
                    ) : (
                      <p className="text-xs text-gray-300">まだ会話がありません</p>
                    )}
                    <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-violet-600 opacity-0 transition-opacity group-hover:opacity-100">
                      話す
                      <ArrowRightIcon />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Activity feed */}
          <aside className="w-full lg:w-80 shrink-0">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                アクティビティ
              </h2>
              <button
                type="button"
                className="text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors"
              >
                すべて見る
              </button>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
              <ul className="divide-y divide-gray-50">
                {activities.map((act) => (
                  <li key={act.id} className="flex items-start gap-3 px-5 py-4">
                    {activityIcon(act.type)}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-700 leading-snug">
                        {act.message}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">{act.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick announcement card */}
            <div className="mt-4 rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-indigo-50 p-5">
              <h3 className="text-sm font-semibold text-violet-900">
                🎉 新機能リリース
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-violet-700/80">
                グループチャット機能が使えるようになりました。複数のキャラクターと同時に会話できます。
              </p>
              <button
                type="button"
                className="mt-3 inline-flex items-center gap-1 rounded-lg bg-violet-600 px-3.5 py-2 text-xs font-medium text-white shadow-sm hover:bg-violet-700 transition-colors"
              >
                詳しく見る
                <ArrowRightIcon />
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
