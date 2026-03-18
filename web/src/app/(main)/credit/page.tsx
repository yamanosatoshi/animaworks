"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Period = "day" | "week" | "month";

interface UsageCategory {
  label: string;
  used: number;
  limit: number;
  color: string;       // Tailwind bg class
  colorHex: string;    // SVG stroke color
  textColor: string;   // Tailwind text class
}

interface PlanFeature {
  label: string;
}

interface UsageData {
  total: number;
  used: number;
  categories: UsageCategory[];
}

// ---------------------------------------------------------------------------
// Dummy data per period
// ---------------------------------------------------------------------------

const usageByPeriod: Record<Period, UsageData> = {
  day: {
    total: 500,
    used: 187,
    categories: [
      { label: "チャット", used: 82,  limit: 200, color: "bg-violet-500", colorHex: "#8b5cf6", textColor: "text-violet-600" },
      { label: "API",      used: 54,  limit: 150, color: "bg-blue-500",   colorHex: "#3b82f6", textColor: "text-blue-600" },
      { label: "分析",     used: 31,  limit: 100, color: "bg-emerald-500", colorHex: "#10b981", textColor: "text-emerald-600" },
      { label: "ストレージ", used: 20, limit: 50,  color: "bg-amber-500",  colorHex: "#f59e0b", textColor: "text-amber-600" },
    ],
  },
  week: {
    total: 3500,
    used: 1840,
    categories: [
      { label: "チャット", used: 780,  limit: 1400, color: "bg-violet-500", colorHex: "#8b5cf6", textColor: "text-violet-600" },
      { label: "API",      used: 520,  limit: 1050, color: "bg-blue-500",   colorHex: "#3b82f6", textColor: "text-blue-600" },
      { label: "分析",     used: 340,  limit: 700,  color: "bg-emerald-500", colorHex: "#10b981", textColor: "text-emerald-600" },
      { label: "ストレージ", used: 200, limit: 350,  color: "bg-amber-500",  colorHex: "#f59e0b", textColor: "text-amber-600" },
    ],
  },
  month: {
    total: 15000,
    used: 8420,
    categories: [
      { label: "チャット", used: 3200,  limit: 6000,  color: "bg-violet-500", colorHex: "#8b5cf6", textColor: "text-violet-600" },
      { label: "API",      used: 2800,  limit: 4500,  color: "bg-blue-500",   colorHex: "#3b82f6", textColor: "text-blue-600" },
      { label: "分析",     used: 1520,  limit: 3000,  color: "bg-emerald-500", colorHex: "#10b981", textColor: "text-emerald-600" },
      { label: "ストレージ", used: 900,  limit: 1500,  color: "bg-amber-500",  colorHex: "#f59e0b", textColor: "text-amber-600" },
    ],
  },
};

const periodLabels: Record<Period, string> = {
  day: "日",
  week: "週",
  month: "月",
};

const planFeatures: PlanFeature[] = [
  { label: "月間 15,000 クレジット" },
  { label: "全キャラクター利用可能" },
  { label: "優先レスポンス" },
  { label: "API アクセス" },
  { label: "チャット履歴 無制限保存" },
  { label: "分析ダッシュボード" },
];

// ---------------------------------------------------------------------------
// Donut Chart (SVG)
// ---------------------------------------------------------------------------

const DONUT_SIZE = 200;
const DONUT_STROKE = 24;
const DONUT_RADIUS = (DONUT_SIZE - DONUT_STROKE) / 2;
const DONUT_CIRCUMFERENCE = 2 * Math.PI * DONUT_RADIUS;

function DonutChart({ data }: { data: UsageData }) {
  const { used, total, categories } = data;

  // Build segments
  const segments: { offset: number; length: number; color: string }[] = [];
  let accumulated = 0;
  for (const cat of categories) {
    const fraction = cat.used / total;
    segments.push({
      offset: accumulated,
      length: fraction * DONUT_CIRCUMFERENCE,
      color: cat.colorHex,
    });
    accumulated += fraction * DONUT_CIRCUMFERENCE;
  }

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={DONUT_SIZE}
        height={DONUT_SIZE}
        viewBox={`0 0 ${DONUT_SIZE} ${DONUT_SIZE}`}
        className="-rotate-90"
        role="img"
        aria-label={`クレジット使用量: ${used.toLocaleString()} / ${total.toLocaleString()}`}
      >
        {/* Background track */}
        <circle
          cx={DONUT_SIZE / 2}
          cy={DONUT_SIZE / 2}
          r={DONUT_RADIUS}
          fill="none"
          stroke="#f3f4f6"
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
        <span className="text-3xl font-bold text-gray-900">
          {used.toLocaleString()}
        </span>
        <span className="text-sm text-gray-400">
          / {total.toLocaleString()} cr
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Usage Bar
// ---------------------------------------------------------------------------

function UsageBar({ category }: { category: UsageCategory }) {
  const pct = Math.min(Math.round((category.used / category.limit) * 100), 100);
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`inline-block h-2.5 w-2.5 rounded-full ${category.color}`} />
          <span className="text-sm font-medium text-gray-700">{category.label}</span>
        </div>
        <div className="text-right">
          <span className="text-sm font-semibold text-gray-900">
            {category.used.toLocaleString()}
          </span>
          <span className="ml-1 text-xs text-gray-400">
            / {category.limit.toLocaleString()} cr
          </span>
        </div>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-100">
        <div
          className={`h-2 rounded-full ${category.color} transition-all duration-700 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Period Tabs
// ---------------------------------------------------------------------------

function PeriodTabs({
  current,
  onChange,
}: {
  current: Period;
  onChange: (p: Period) => void;
}) {
  const periods: Period[] = ["day", "week", "month"];
  return (
    <div className="inline-flex rounded-lg bg-gray-100 p-1">
      {periods.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          className={[
            "rounded-md px-4 py-1.5 text-sm font-medium transition-all duration-200 cursor-pointer",
            current === p
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700",
          ].join(" ")}
        >
          {periodLabels[p]}
        </button>
      ))}
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

const CheckIcon = () => (
  <svg
    width="14"
    height="14"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}
    className="mt-0.5 shrink-0 text-violet-500"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.5 12.75l6 6 9-13.5"
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

const InfoIcon = () => (
  <svg
    width="18"
    height="18"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
    />
  </svg>
);

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function CreditPage() {
  const [period, setPeriod] = useState<Period>("month");
  const data = usageByPeriod[period];
  const remaining = data.total - data.used;
  const usedPct = Math.round((data.used / data.total) * 100);
  const renewalDate = "2026年4月1日";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ---- Header ---- */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                <CreditCardIcon />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  クレジット使用量
                </h1>
                <p className="text-sm text-gray-500">
                  クレジットの利用状況を確認できます
                </p>
              </div>
            </div>
            <PeriodTabs current={period} onChange={setPeriod} />
          </div>
        </div>
      </div>

      {/* ---- Content ---- */}
      <div className="mx-auto max-w-5xl px-6 py-8 space-y-6">
        {/* Row: Donut + Summary + Plan */}
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Donut card */}
          <Card className="lg:col-span-3">
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <DonutChart data={data} />

              <div className="flex-1 space-y-4">
                {/* Used / Total */}
                <div>
                  <p className="text-sm text-gray-500">使用量</p>
                  <p className="mt-0.5">
                    <span className="text-2xl font-bold text-gray-900">
                      {data.used.toLocaleString()}
                    </span>
                    <span className="ml-1 text-sm text-gray-400">
                      / {data.total.toLocaleString()} cr
                    </span>
                  </p>
                </div>

                {/* Remaining */}
                <div>
                  <p className="text-sm text-gray-500">残りクレジット</p>
                  <p className="mt-0.5 text-xl font-bold text-emerald-600">
                    {remaining.toLocaleString()}
                    <span className="ml-1 text-sm font-normal text-gray-400">
                      cr
                    </span>
                  </p>
                </div>

                {/* Renewal */}
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <CalendarIcon />
                  <span>
                    次回更新:{" "}
                    <span className="font-medium text-gray-700">
                      {renewalDate}
                    </span>
                  </span>
                </div>

                {/* Usage bar (overall) */}
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>全体使用率</span>
                    <span className="font-semibold text-gray-700">
                      {usedPct}%
                    </span>
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

                {/* Legend */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
                  {data.categories.map((cat) => (
                    <div key={cat.label} className="flex items-center gap-1.5">
                      <span
                        className={`inline-block h-2 w-2 rounded-full ${cat.color}`}
                      />
                      <span className="text-xs text-gray-500">{cat.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Current plan card */}
          <Card className="lg:col-span-2 flex flex-col">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                現在のプラン
              </h2>
              <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-bold text-violet-700">
                契約中
              </span>
            </div>

            <div className="mt-4 flex-1">
              <p className="text-xl font-bold text-gray-900">Pro</p>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-bold text-violet-600">
                  ¥4,980
                </span>
                <span className="text-sm text-gray-400">/ 月</span>
              </div>

              <ul className="mt-4 space-y-2">
                {planFeatures.map((f) => (
                  <li
                    key={f.label}
                    className="flex items-start gap-2 text-sm text-gray-600"
                  >
                    <CheckIcon />
                    {f.label}
                  </li>
                ))}
              </ul>
            </div>

            <Button
              variant="primary"
              fullWidth
              className="mt-5"
            >
              プランを変更する
            </Button>
          </Card>
        </div>

        {/* Category breakdown */}
        <Card>
          <h2 className="text-base font-bold text-gray-900 mb-5">
            カテゴリ別使用量
          </h2>
          <div className="space-y-5">
            {data.categories.map((cat) => (
              <UsageBar key={cat.label} category={cat} />
            ))}
          </div>
        </Card>

        {/* Tips / notice */}
        <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <InfoIcon />
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
  );
}
