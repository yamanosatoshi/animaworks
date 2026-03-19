"use client";

import React, { useState } from "react";
import type { LLMProvider } from "@/types/chat";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Asset {
  label: string;
  src: string;
}

interface Character {
  id: string;
  name: string;
  role: string;
  description: string;
  avatar: string;
  avatarColor: string;
  llmProvider: LLMProvider;
  status: "online" | "offline" | "busy";
  tags: string[];
  /** Capabilities / competencies */
  abilities: string;
  preferredTasks: string;
  tools: string;
  suggestedInstructions: string;
  pastAchievements: string;
  /** Recent activity log */
  activityLog: { date: string; text: string }[];
  /** Asset images (placeholder) */
  assets: Asset[];
}

// ---------------------------------------------------------------------------
// Dummy data
// ---------------------------------------------------------------------------

const characters: Character[] = [
  {
    id: "taro",
    name: "太郎",
    role: "プロジェクト全般管理・業務支援全般",
    avatar: "太",
    avatarColor: "from-violet-400 to-indigo-500",
    llmProvider: "claude",
    status: "online",
    tags: ["リーダー"],
    description: "チーム全体の進捗管理とメンバー間の調整を担当。信頼性が高く、判断が速い。",
    abilities: "プロジェクト管理、スケジュール調整、タスク分配",
    preferredTasks: "進捗管理、レビュー、意思決定サポート",
    tools: "Slack, Notion, Google Calendar",
    suggestedInstructions: "定期的にメンバーの進捗を確認し、リスクを早期に検出する",
    pastAchievements: "前四半期でプロジェクト完遂率98%を達成",
    activityLog: [
      { date: "6/18(火)", text: "朝の進捗報告書を基に、市場動向サマリーを作成しました。" },
      { date: "6/18(火)", text: "新規プロジェクト「ProjectA」のキックオフ準備を完了しました。" },
      { date: "6/17(月)", text: "今日の活動報告を基に、翌日作業サマリーを作成しました。" },
      { date: "6/17(月)", text: "週次プロジェクト「ProjectA」のキックオフ準備を完了しました。" },
      { date: "6/16(日)", text: "前週の活動報告を基に、市場動向サマリーを作成しました。" },
    ],
    assets: [
      { label: "正面", src: "" },
      { label: "上半身", src: "" },
      { label: "SD", src: "" },
    ],
  },
  {
    id: "sakura",
    name: "さくら",
    role: "マーケティング・コピーライティング",
    avatar: "さ",
    avatarColor: "from-pink-400 to-rose-500",
    llmProvider: "gemini",
    status: "online",
    tags: ["営業"],
    description: "提案書やセールスコピーの作成が得意。顧客理解に優れている。",
    abilities: "コピーライティング、提案書作成、リサーチ",
    preferredTasks: "資料作成、見積書チェック、スケジュール管理",
    tools: "Google Docs, Canva, HubSpot",
    suggestedInstructions: "顧客のペインポイントに合わせた提案を心がける",
    pastAchievements: "営業資料の品質改善でコンバージョン率15%向上",
    activityLog: [
      { date: "6/18(火)", text: "営業提案書のドラフトを3件作成しました。" },
      { date: "6/17(月)", text: "見積書のレビューを完了しました。" },
    ],
    assets: [
      { label: "正面", src: "" },
      { label: "上半身", src: "" },
    ],
  },
  {
    id: "kenshiro",
    name: "ケンシロウ",
    role: "システム開発・技術調査",
    avatar: "ケ",
    avatarColor: "from-blue-400 to-cyan-500",
    llmProvider: "claude",
    status: "online",
    tags: ["エンジニア"],
    description: "フルスタック開発対応。コードレビューとアーキテクチャ設計が強み。",
    abilities: "フルスタック開発、コードレビュー、CI/CD設計",
    preferredTasks: "実装、PR作成、技術調査",
    tools: "VS Code, GitHub, Docker",
    suggestedInstructions: "コード品質を重視し、テストカバレッジ80%以上を維持する",
    pastAchievements: "フロントエンド実装のPRレビュー工数を40%削減",
    activityLog: [
      { date: "6/18(火)", text: "フロントエンド実装のPRレビューを完了しました。" },
    ],
    assets: [
      { label: "正面", src: "" },
      { label: "上半身", src: "" },
      { label: "SD", src: "" },
    ],
  },
  {
    id: "aoi",
    name: "葵",
    role: "UI/UXデザイン・アセット制作",
    avatar: "葵",
    avatarColor: "from-emerald-400 to-teal-500",
    llmProvider: "openai",
    status: "busy",
    tags: ["デザイナー"],
    description: "デザインシステムの構築と各種アセット制作を担当。美意識が高い。",
    abilities: "UIデザイン、プロトタイピング、デザインシステム管理",
    preferredTasks: "モックアップ作成、フィードバック回収",
    tools: "Figma, Illustrator, Storybook",
    suggestedInstructions: "ブランドガイドラインに沿ったデザインを維持する",
    pastAchievements: "UIコンポーネントライブラリを刷新し開発速度を向上",
    activityLog: [
      { date: "6/18(火)", text: "UIモックアップの最新版をアップロードしました。" },
    ],
    assets: [
      { label: "正面", src: "" },
    ],
  },
  {
    id: "ume",
    name: "吉田梅",
    role: "経理・請求書管理・スケジュール調整",
    avatar: "梅",
    avatarColor: "from-amber-400 to-orange-500",
    llmProvider: "gemini",
    status: "offline",
    tags: ["事務"],
    description: "経理処理や請求書管理を正確に遂行。スケジュール調整も担当。",
    abilities: "経理処理、請求書管理、スケジュール調整",
    preferredTasks: "投稿スケジュール作成、SNS管理",
    tools: "Excel, freee, Google Calendar",
    suggestedInstructions: "締め日を厳守し、ダブルチェックを徹底する",
    pastAchievements: "経費精算処理の平均時間を50%短縮",
    activityLog: [
      { date: "6/18(火)", text: "投稿スケジュールの作成に取りかかっています。" },
    ],
    assets: [],
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function statusDot(s: Character["status"]): string {
  switch (s) {
    case "online": return "bg-emerald-500";
    case "busy": return "bg-amber-500";
    case "offline": return "bg-gray-400";
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function CharactersPage() {
  const [selectedId, setSelectedId] = useState<string>(characters[0].id);
  const selected = characters.find((c) => c.id === selectedId) ?? characters[0];

  return (
    <div className="flex h-full">
      {/* Left: Character list */}
      <aside className="flex w-[260px] shrink-0 flex-col border-r border-border-default bg-card-bg">
        <div className="border-b border-border-default px-4 py-3">
          <h1 className="text-sm font-bold text-text-primary">キャラクター</h1>
        </div>

        <nav className="flex-1 overflow-y-auto" aria-label="キャラクター一覧">
          <ul className="flex flex-col">
            {characters.map((ch) => {
              const isActive = selectedId === ch.id;
              return (
                <li key={ch.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(ch.id)}
                    className={[
                      "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors border-l-[3px]",
                      isActive
                        ? "bg-violet-50 border-accent"
                        : "border-transparent hover:bg-gray-50",
                    ].join(" ")}
                    aria-current={isActive ? "true" : undefined}
                  >
                    {/* Avatar */}
                    <div className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${ch.avatarColor}`}>
                      <span className="text-sm font-bold text-white">{ch.avatar}</span>
                      <span className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white ${statusDot(ch.status)}`} />
                    </div>
                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-semibold text-text-primary truncate">{ch.name}</p>
                      <p className="text-[11px] text-text-muted truncate">{ch.role}</p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Right: Character detail */}
      <main className="flex-1 overflow-y-auto bg-page-bg p-6">
        {/* Header */}
        <div className="flex items-start gap-5 mb-6">
          <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${selected.avatarColor}`}>
            <span className="text-2xl font-bold text-white">{selected.avatar}</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-primary">{selected.name}</h2>
            <p className="text-sm text-text-muted">{selected.role}</p>
          </div>
        </div>

        {/* Assets */}
        {selected.assets.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-bold text-text-primary mb-3">アセット</h3>
            <div className="flex gap-3">
              {selected.assets.map((asset) => (
                <div
                  key={asset.label}
                  className="relative flex h-24 w-20 flex-col items-center justify-center overflow-hidden rounded-lg border border-border-default bg-gray-50"
                >
                  {/* Character silhouette placeholder */}
                  <div className={`flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${selected.avatarColor} opacity-80`}>
                    <svg className="h-8 w-8 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                  <span className="mt-1 text-[10px] font-medium text-text-muted">{asset.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Capability grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="rounded-lg border border-border-default bg-card-bg p-4">
            <h4 className="text-xs font-semibold text-text-muted mb-2">能力概要</h4>
            <p className="text-sm text-text-secondary">{selected.abilities}</p>
          </div>
          <div className="rounded-lg border border-border-default bg-card-bg p-4">
            <h4 className="text-xs font-semibold text-text-muted mb-2">得意とする業務</h4>
            <p className="text-sm text-text-secondary">{selected.preferredTasks}</p>
          </div>
          <div className="rounded-lg border border-border-default bg-card-bg p-4">
            <h4 className="text-xs font-semibold text-text-muted mb-2">活用可能なツール</h4>
            <p className="text-sm text-text-secondary">{selected.tools}</p>
          </div>
          <div className="rounded-lg border border-border-default bg-card-bg p-4">
            <h4 className="text-xs font-semibold text-text-muted mb-2">推奨される指示</h4>
            <p className="text-sm text-text-secondary">{selected.suggestedInstructions}</p>
          </div>
          <div className="col-span-2 rounded-lg border border-border-default bg-card-bg p-4">
            <h4 className="text-xs font-semibold text-text-muted mb-2">過去の主な業績</h4>
            <p className="text-sm text-text-secondary">{selected.pastAchievements}</p>
          </div>
        </div>

        {/* Activity log */}
        <div className="rounded-lg border border-border-default bg-card-bg p-4">
          <h3 className="text-sm font-bold text-text-primary mb-3">最近の活動ログ</h3>
          <div className="space-y-3">
            {selected.activityLog.map((log, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="mt-0.5 text-[11px] font-medium text-text-disabled whitespace-nowrap">{log.date}</span>
                <p className="text-sm text-text-secondary">{log.text}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
