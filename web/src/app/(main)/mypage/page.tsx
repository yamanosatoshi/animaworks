import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "マイページ | HiCrew",
  description: "プロフィールと利用状況を確認します",
};

interface StatCard {
  label: string;
  value: string;
  unit?: string;
  color: string;
}

const stats: StatCard[] = [
  { label: "今月の利用回数", value: "24", unit: "回", color: "violet" },
  { label: "累計利用時間", value: "12.5", unit: "時間", color: "indigo" },
  { label: "保存済みデータ", value: "3", unit: "件", color: "blue" },
];

export default function MyPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">マイページ</h1>
          <p className="mt-1 text-sm text-gray-500">プロフィールと利用状況</p>
        </div>
        <Link href="/mypage/edit">
          <Button variant="secondary" size="sm">
            <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
            編集
          </Button>
        </Link>
      </div>

      {/* Profile card */}
      <div className="mb-6 overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100">
        {/* Cover */}
        <div className="h-24 bg-gradient-to-r from-violet-500 to-indigo-600" />

        {/* Profile info */}
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between">
            <div className="-mt-10 h-20 w-20 overflow-hidden rounded-2xl border-4 border-white bg-gradient-to-br from-violet-300 to-indigo-400 shadow-md">
              <div className="flex h-full w-full items-center justify-center">
                <span className="text-2xl font-bold text-white">山</span>
              </div>
            </div>
            <div className="mb-2">
              <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700">
                フリープラン
              </span>
            </div>
          </div>

          <div className="mt-4">
            <h2 className="text-lg font-bold text-gray-900">山田 太郎</h2>
            <p className="text-sm text-gray-500">@taro</p>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
              UI/UXデザインとフロントエンド開発が好きです。HiCrewを使ってもっと快適な作業環境を作りたいと思っています。
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-4">
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              taro@example.com
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              2024年1月より利用
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-2xl p-4 text-center ${
              stat.color === "violet"
                ? "bg-violet-50 border border-violet-100"
                : stat.color === "indigo"
                ? "bg-indigo-50 border border-indigo-100"
                : "bg-blue-50 border border-blue-100"
            }`}
          >
            <p className={`text-2xl font-bold ${
              stat.color === "violet"
                ? "text-violet-700"
                : stat.color === "indigo"
                ? "text-indigo-700"
                : "text-blue-700"
            }`}>
              {stat.value}
              <span className="text-sm font-normal ml-0.5">{stat.unit}</span>
            </p>
            <p className="mt-1 text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <h3 className="border-b border-gray-100 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
          クイックリンク
        </h3>
        {[
          { label: "利用履歴を見る", href: "/mypage/history", icon: "⏱" },
          { label: "ヘルプ・よくある質問", href: "/help", icon: "❓" },
          { label: "お問い合わせ", href: "/contact", icon: "✉️" },
          { label: "設定", href: "/settings", icon: "⚙️" },
        ].map((item, index) => (
          <Link
            key={item.href}
            href={item.href}
            className={[
              "flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors duration-150",
              index > 0 ? "border-t border-gray-100" : "",
            ].join(" ")}
          >
            <span className="text-base" aria-hidden="true">{item.icon}</span>
            <span className="flex-1 text-sm text-gray-700">{item.label}</span>
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
}
