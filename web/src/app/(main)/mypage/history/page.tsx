import React from "react";
import Link from "next/link";

export const metadata = {
  title: "利用履歴 | KON",
  description: "サービスの利用履歴を確認します",
};

interface HistoryItem {
  id: string;
  type: "chat" | "export" | "setting" | "login";
  title: string;
  description: string;
  date: string;
  time: string;
  status?: "success" | "failed" | "pending";
}

const historyData: HistoryItem[] = [
  {
    id: "1",
    type: "chat",
    title: "チャット利用",
    description: "マインチャット / デザインレビュー",
    date: "2024年3月18日",
    time: "14:32",
    status: "success",
  },
  {
    id: "2",
    type: "export",
    title: "データエクスポート",
    description: "プロジェクトデータ / CSV形式",
    date: "2024年3月17日",
    time: "10:15",
    status: "success",
  },
  {
    id: "3",
    type: "setting",
    title: "設定変更",
    description: "通知設定を更新",
    date: "2024年3月15日",
    time: "09:00",
    status: "success",
  },
  {
    id: "4",
    type: "login",
    title: "ログイン",
    description: "Chrome / macOS",
    date: "2024年3月14日",
    time: "08:45",
    status: "success",
  },
  {
    id: "5",
    type: "chat",
    title: "チャット利用",
    description: "マインチャット / コード生成",
    date: "2024年3月13日",
    time: "16:20",
    status: "success",
  },
  {
    id: "6",
    type: "login",
    title: "ログイン失敗",
    description: "不明なデバイスからのアクセス試行",
    date: "2024年3月12日",
    time: "23:55",
    status: "failed",
  },
];

const typeConfig = {
  chat: {
    label: "チャット",
    color: "bg-violet-100 text-violet-700",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
      </svg>
    ),
  },
  export: {
    label: "エクスポート",
    color: "bg-blue-100 text-blue-700",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
    ),
  },
  setting: {
    label: "設定",
    color: "bg-gray-100 text-gray-700",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  login: {
    label: "ログイン",
    color: "bg-green-100 text-green-700",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
      </svg>
    ),
  },
};

const statusConfig = {
  success: { label: "成功", className: "bg-green-100 text-green-700" },
  failed: { label: "失敗", className: "bg-red-100 text-red-700" },
  pending: { label: "処理中", className: "bg-yellow-100 text-yellow-700" },
};

export default function HistoryPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <Link
          href="/mypage"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
          aria-label="マイページに戻る"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">利用履歴</h1>
          <p className="mt-0.5 text-sm text-gray-500">直近の利用状況</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-1" role="tablist">
        {["すべて", "チャット", "設定変更", "ログイン"].map((tab, index) => (
          <button
            key={tab}
            role="tab"
            aria-selected={index === 0}
            className={[
              "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-150 cursor-pointer",
              index === 0
                ? "bg-violet-600 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50",
            ].join(" ")}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* History list */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {historyData.map((item, index) => {
          const config = typeConfig[item.type];
          const statusInfo = item.status ? statusConfig[item.status] : null;
          return (
            <div
              key={item.id}
              className={[
                "flex items-start gap-4 px-5 py-4",
                index > 0 ? "border-t border-gray-100" : "",
              ].join(" ")}
            >
              {/* Icon */}
              <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${config.color}`}>
                {config.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-gray-900">{item.title}</span>
                  {statusInfo && (
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusInfo.className}`}>
                      {statusInfo.label}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-gray-500">{item.description}</p>
              </div>

              {/* Date */}
              <div className="shrink-0 text-right">
                <p className="text-xs text-gray-500">{item.date}</p>
                <p className="text-xs text-gray-400">{item.time}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-gray-500">1〜6件 / 全24件</p>
        <div className="flex gap-2">
          <button
            type="button"
            disabled
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 disabled:opacity-40 cursor-pointer"
            aria-label="前のページ"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
            aria-label="次のページ"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
