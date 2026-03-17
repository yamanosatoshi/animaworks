import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "プラン管理 | KON",
  description: "現在のプランを確認・変更します",
};

const planFeatures = [
  "月5回までの利用",
  "基本機能すべて利用可",
  "1GBストレージ",
  "メールサポート",
];

const upgradeFeatures = [
  { label: "無制限の利用", available: true },
  { label: "全機能利用可", available: true },
  { label: "20GBストレージ", available: true },
  { label: "優先メールサポート", available: true },
  { label: "データエクスポート", available: true },
  { label: "チームメンバー管理", available: false },
  { label: "SSO対応", available: false },
];

const billingHistory = [
  { date: "2024年3月1日", amount: "¥0", status: "フリープラン", invoice: "#" },
  { date: "2024年2月1日", amount: "¥0", status: "フリープラン", invoice: "#" },
];

export default function PlanSettingsPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <Link
          href="/settings"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
          aria-label="設定に戻る"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">プラン管理</h1>
          <p className="mt-0.5 text-sm text-gray-500">現在のプランを確認・変更</p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Current plan */}
        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm" aria-labelledby="current-plan-heading">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 id="current-plan-heading" className="text-sm font-semibold text-gray-900">
              現在のプラン
            </h2>
          </div>
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-gray-900">フリープラン</span>
                  <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                    現在のプラン
                  </span>
                </div>
                <p className="mt-1 text-2xl font-bold text-gray-700">
                  ¥0<span className="text-sm font-normal text-gray-500"> / 月</span>
                </p>
                <p className="mt-3 text-xs text-gray-500">次回更新日: なし（無料プラン）</p>
              </div>
            </div>

            <ul className="mt-4 flex flex-col gap-2">
              {planFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="h-4 w-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Upgrade CTA */}
        <section className="overflow-hidden rounded-2xl border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-indigo-50 shadow-sm" aria-labelledby="upgrade-heading">
          <div className="p-6">
            <div className="mb-1 flex items-center gap-2">
              <h2 id="upgrade-heading" className="text-base font-bold text-violet-900">
                スタンダードにアップグレード
              </h2>
              <span className="rounded-full bg-violet-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                人気
              </span>
            </div>
            <p className="mb-4 text-2xl font-bold text-violet-800">
              ¥2,980<span className="text-sm font-normal text-violet-600"> / 月（税込）</span>
            </p>

            <div className="mb-5 grid grid-cols-2 gap-2">
              {upgradeFeatures.map((feature) => (
                <div key={feature.label} className="flex items-center gap-1.5 text-sm">
                  {feature.available ? (
                    <svg className="h-4 w-4 text-violet-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  <span className={feature.available ? "text-violet-800" : "text-gray-400"}>
                    {feature.label}
                  </span>
                </div>
              ))}
            </div>

            <Button variant="primary" size="md" fullWidth>
              スタンダードにアップグレード
            </Button>
          </div>
        </section>

        {/* Billing history */}
        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm" aria-labelledby="billing-heading">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 id="billing-heading" className="text-sm font-semibold text-gray-900">
              請求履歴
            </h2>
          </div>
          {billingHistory.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {billingHistory.map((record, index) => (
                <div key={index} className="flex items-center justify-between px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{record.date}</p>
                    <p className="text-xs text-gray-500">{record.status}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-gray-900">{record.amount}</span>
                    <a
                      href={record.invoice}
                      className="text-xs font-medium text-violet-600 hover:text-violet-700 transition-colors"
                    >
                      領収書
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="px-6 py-8 text-center text-sm text-gray-500">請求履歴はありません</p>
          )}
        </section>
      </div>
    </div>
  );
}
