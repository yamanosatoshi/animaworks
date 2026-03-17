"use client";

import React, { useState } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface UsageCategory {
  label: string;
  used: number;
  color: string; // Tailwind bg class
  colorHex: string; // SVG stroke color
}

interface Plan {
  id: string;
  name: string;
  credits: number;
  price: string;
  features: string[];
  recommended?: boolean;
}

// ---------------------------------------------------------------------------
// Dummy data
// ---------------------------------------------------------------------------

const TOTAL_CREDITS = 10000;
const USED_CREDITS = 6420;
const REMAINING_CREDITS = TOTAL_CREDITS - USED_CREDITS;

const currentPlan: Plan = {
  id: "standard",
  name: "スタンダード",
  credits: 10000,
  price: "¥2,980",
  features: [
    "月間 10,000 クレジット",
    "全キャラクター利用可能",
    "優先レスポンス",
    "チャット履歴保存 90日",
  ],
};

const categories: UsageCategory[] = [
  { label: "チャット", used: 3200, color: "bg-violet-500", colorHex: "#8b5cf6" },
  { label: "画像生成", used: 1800, color: "bg-blue-500", colorHex: "#3b82f6" },
  { label: "音声合成", used: 920, color: "bg-emerald-500", colorHex: "#10b981" },
  { label: "翻訳", used: 500, color: "bg-amber-500", colorHex: "#f59e0b" },
];

const plans: Plan[] = [
  {
    id: "free",
    name: "フリー",
    credits: 1000,
    price: "¥0",
    features: [
      "月間 1,000 クレジット",
      "基本キャラクター3体",
      "チャット履歴保存 7日",
    ],
  },
  {
    id: "standard",
    name: "スタンダード",
    credits: 10000,
    price: "¥2,980",
    features: [
      "月間 10,000 クレジット",
      "全キャラクター利用可能",
      "優先レスポンス",
      "チャット履歴保存 90日",
    ],
    recommended: true,
  },
  {
    id: "premium",
    name: "プレミアム",
    credits: 50000,
    price: "¥9,800",
    features: [
      "月間 50,000 クレジット",
      "全キャラクター利用可能",
      "最速レスポンス",
      "チャット履歴 無制限保存",
      "API アクセス",
    ],
  },
];

// ---------------------------------------------------------------------------
// Donut Chart (SVG)
// ---------------------------------------------------------------------------

const DONUT_SIZE = 180;
const DONUT_STROKE = 22;
const DONUT_RADIUS = (DONUT_SIZE - DONUT_STROKE) / 2;
const DONUT_CIRCUMFERENCE = 2 * Math.PI * DONUT_RADIUS;

function DonutChart({
  used,
  total,
  categories: cats,
}: {
  used: number;
  total: number;
  categories: UsageCategory[];
}) {
  // Build segments
  const segments: { offset: number; length: number; color: string }[] = [];
  let accumulated = 0;
  for (const cat of cats) {
    const fraction = cat.used / total;
    segments.push({
      offset: accumulated,
      length: fraction * DONUT_CIRCUMFERENCE,
      color: cat.colorHex,
    });
    accumulated += fraction * DONUT_CIRCUMFERENCE;
  }

  const pct = Math.round((used / total) * 100);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={DONUT_SIZE}
        height={DONUT_SIZE}
        viewBox={`0 0 ${DONUT_SIZE} ${DONUT_SIZE}`}
        className="-rotate-90"
      >
        {/* Background track */}
        <circle
          cx={DONUT_SIZE / 2}
          cy={DONUT_SIZE / 2}
          r={DONUT_RADIUS}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={DONUT_STROKE}
        />
        {/* Category segments */}
        {segments.map((seg, i) => (
          <circle
            key={i}
            cx={DONUT_SIZE / 2}
            cy={DONUT_SIZE / 2}
            r={DONUT_RADIUS}
            fill="none"
            stroke={seg.color}
            strokeWidth={DONUT_STROKE}
            strokeDasharray={`${seg.length} ${DONUT_CIRCUMFERENCE - seg.length}`}
            strokeDashoffset={-seg.offset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        ))}
      </svg>
      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-gray-900">{pct}%</span>
        <span className="text-xs text-gray-500">使用済み</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Usage Bar
// ---------------------------------------------------------------------------

function UsageBar({ category }: { category: UsageCategory }) {
  const pct = Math.round((category.used / TOTAL_CREDITS) * 100);
  return (
    <div className="flex items-center gap-4">
      <div className="w-20 shrink-0">
        <span className="text-sm font-medium text-gray-700">
          {category.label}
        </span>
      </div>
      <div className="flex-1">
        <div className="h-2.5 w-full rounded-full bg-gray-100">
          <div
            className={`h-2.5 rounded-full ${category.color} transition-all duration-700 ease-out`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <div className="w-24 shrink-0 text-right">
        <span className="text-sm font-semibold text-gray-900">
          {category.used.toLocaleString()}
        </span>
        <span className="ml-1 text-xs text-gray-400">cr</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Plan Change Modal
// ---------------------------------------------------------------------------

function PlanChangeModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="プラン変更"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal body */}
      <div className="relative mx-4 w-full max-w-3xl rounded-2xl bg-white p-8 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          aria-label="閉じる"
        >
          <svg
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-xl font-bold text-gray-900">プラン変更</h2>
        <p className="mt-1 text-sm text-gray-500">
          ご利用状況に合わせてプランをお選びください
        </p>

        {/* Plan cards */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {plans.map((plan) => {
            const isCurrent = plan.id === currentPlan.id;
            return (
              <div
                key={plan.id}
                className={[
                  "relative flex flex-col rounded-xl border-2 p-5 transition-all",
                  isCurrent
                    ? "border-violet-500 bg-violet-50/50 shadow-sm"
                    : "border-gray-200 hover:border-violet-300 hover:shadow-sm",
                ].join(" ")}
              >
                {plan.recommended && (
                  <span className="absolute -top-2.5 left-4 rounded-full bg-violet-600 px-2.5 py-0.5 text-[10px] font-bold text-white">
                    おすすめ
                  </span>
                )}

                <h3 className="text-base font-bold text-gray-900">
                  {plan.name}
                </h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-xs text-gray-500">/ 月</span>
                </div>

                <ul className="mt-4 flex-1 space-y-2">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm text-gray-600"
                    >
                      <svg
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        className="mt-0.5 shrink-0 text-violet-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  disabled={isCurrent}
                  className={[
                    "mt-5 w-full rounded-lg py-2.5 text-sm font-semibold transition-colors",
                    isCurrent
                      ? "cursor-default bg-violet-100 text-violet-600"
                      : "bg-violet-600 text-white hover:bg-violet-700 cursor-pointer",
                  ].join(" ")}
                >
                  {isCurrent ? "現在のプラン" : "このプランに変更"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

const CreditCardIcon = () => (
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
      d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
    />
  </svg>
);

const CalendarIcon = () => (
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
      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
    />
  </svg>
);

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function CreditPage() {
  const [showPlanModal, setShowPlanModal] = useState(false);

  const renewalDate = "2026年4月1日";
  const usedPct = Math.round((USED_CREDITS / TOTAL_CREDITS) * 100);

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* ---- Header ---- */}
        <div className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-4xl px-6 py-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                <CreditCardIcon />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  クレジット使用量
                </h1>
                <p className="text-sm text-gray-500">
                  今月のクレジット利用状況を確認できます
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ---- Content ---- */}
        <div className="mx-auto max-w-4xl px-6 py-8 space-y-6">
          {/* Row: Donut + Summary */}
          <div className="grid gap-6 lg:grid-cols-5">
            {/* Donut card */}
            <div className="lg:col-span-3 rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <DonutChart
                  used={USED_CREDITS}
                  total={TOTAL_CREDITS}
                  categories={categories}
                />

                <div className="flex-1 space-y-4">
                  {/* Used / Total */}
                  <div>
                    <p className="text-sm text-gray-500">使用量</p>
                    <p className="mt-0.5">
                      <span className="text-2xl font-bold text-gray-900">
                        {USED_CREDITS.toLocaleString()}
                      </span>
                      <span className="ml-1 text-sm text-gray-400">
                        / {TOTAL_CREDITS.toLocaleString()} cr
                      </span>
                    </p>
                  </div>

                  {/* Remaining */}
                  <div>
                    <p className="text-sm text-gray-500">残りクレジット</p>
                    <p className="mt-0.5 text-xl font-bold text-emerald-600">
                      {REMAINING_CREDITS.toLocaleString()}
                      <span className="ml-1 text-sm font-normal text-gray-400">
                        cr
                      </span>
                    </p>
                  </div>

                  {/* Renewal */}
                  <div className="flex items-center gap-1.5 text-sm text-gray-500">
                    <CalendarIcon />
                    <span>
                      次回更新: <span className="font-medium text-gray-700">{renewalDate}</span>
                    </span>
                  </div>

                  {/* Usage bar (overall) */}
                  <div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>全体使用率</span>
                      <span className="font-semibold text-gray-700">{usedPct}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-100">
                      <div
                        className={[
                          "h-2 rounded-full transition-all duration-700 ease-out",
                          usedPct > 80
                            ? "bg-red-500"
                            : usedPct > 50
                              ? "bg-amber-500"
                              : "bg-violet-500",
                        ].join(" ")}
                        style={{ width: `${usedPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Current plan card */}
            <div className="lg:col-span-2 rounded-2xl bg-white border border-gray-100 shadow-sm p-6 flex flex-col">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  現在のプラン
                </h2>
                <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-bold text-violet-700">
                  契約中
                </span>
              </div>

              <div className="mt-4 flex-1">
                <p className="text-xl font-bold text-gray-900">
                  {currentPlan.name}
                </p>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-violet-600">
                    {currentPlan.price}
                  </span>
                  <span className="text-sm text-gray-400">/ 月</span>
                </div>

                <ul className="mt-4 space-y-2">
                  {currentPlan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm text-gray-600"
                    >
                      <svg
                        width="14"
                        height="14"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        className="mt-0.5 shrink-0 text-violet-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => setShowPlanModal(true)}
                className="mt-5 w-full rounded-xl bg-violet-600 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-violet-700 cursor-pointer"
              >
                プランを変更する
              </button>
            </div>
          </div>

          {/* Category breakdown */}
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-bold text-gray-900 mb-5">
              カテゴリ別使用量
            </h2>
            <div className="space-y-4">
              {categories.map((cat) => (
                <UsageBar key={cat.label} category={cat} />
              ))}
            </div>

            {/* Legend */}
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-gray-100 pt-4">
              {categories.map((cat) => (
                <div key={cat.label} className="flex items-center gap-2">
                  <span
                    className={`inline-block h-2.5 w-2.5 rounded-full ${cat.color}`}
                  />
                  <span className="text-xs text-gray-500">{cat.label}</span>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-gray-200" />
                <span className="text-xs text-gray-500">未使用</span>
              </div>
            </div>
          </div>

          {/* Tips / notice */}
          <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-900">
                  クレジットについて
                </p>
                <p className="mt-1 text-sm leading-relaxed text-blue-700">
                  クレジットは毎月1日にリセットされます。未使用分の繰り越しはありません。
                  使用量が上限に達した場合、追加クレジットの購入またはプランのアップグレードが可能です。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Plan change modal */}
      {showPlanModal && (
        <PlanChangeModal onClose={() => setShowPlanModal(false)} />
      )}
    </>
  );
}
