"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MypageSettingsShell } from "@/components/mypage/MypageSettingsShell";
import { ToggleSwitch } from "@/components/mypage/ToggleSwitch";

/* ─── Types ─── */

interface PrivacySetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

/* ─── Data ─── */

const initialPrivacySettings: PrivacySetting[] = [
  {
    id: "priv-analytics",
    label: "利用データの収集",
    description: "サービス改善のため、匿名化された利用状況データの収集を許可します",
    enabled: true,
  },
  {
    id: "priv-personalization",
    label: "パーソナライゼーション",
    description: "利用履歴を元にコンテンツをパーソナライズします",
    enabled: true,
  },
  {
    id: "priv-third-party",
    label: "サードパーティ共有",
    description: "サービス向上のため、提携企業とデータを共有します",
    enabled: false,
  },
  {
    id: "priv-cookies",
    label: "マーケティングCookie",
    description: "広告やマーケティング目的のCookieの使用を許可します",
    enabled: false,
  },
];

/* ─── Page ─── */

export default function PrivacySettingsPage() {
  const [settings, setSettings] = useState(initialPrivacySettings);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const toggle = (id: string) => {
    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  return (
    <MypageSettingsShell
      title="プライバシー設定"
      description="データ管理とプライバシーに関する設定"
    >
      <div className="flex flex-col gap-6">
        {/* ── Data usage consents ── */}
        <section
          className="overflow-hidden rounded-2xl border border-white/10 bg-[#12121e]"
          aria-labelledby="data-heading"
        >
          <div className="border-b border-white/10 px-6 py-4">
            <h2 id="data-heading" className="text-sm font-semibold text-white">
              データ利用の同意
            </h2>
          </div>
          <div className="divide-y divide-white/5">
            {settings.map((setting) => (
              <div key={setting.id} className="flex items-center justify-between px-6 py-4">
                <div className="flex-1 pr-4">
                  <label htmlFor={setting.id} className="text-sm font-medium text-white cursor-pointer">
                    {setting.label}
                  </label>
                  <p className="mt-0.5 text-xs text-[#8a8aa0]">{setting.description}</p>
                </div>
                <ToggleSwitch
                  id={setting.id}
                  enabled={setting.enabled}
                  onToggle={() => toggle(setting.id)}
                />
              </div>
            ))}
          </div>
        </section>

        {/* ── Data management ── */}
        <section
          className="overflow-hidden rounded-2xl border border-white/10 bg-[#12121e]"
          aria-labelledby="manage-heading"
        >
          <div className="border-b border-white/10 px-6 py-4">
            <h2 id="manage-heading" className="text-sm font-semibold text-white">
              データ管理
            </h2>
          </div>
          <div className="p-6">
            <div className="flex flex-col gap-5">
              {/* Export */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-white">データのエクスポート</h3>
                  <p className="mt-0.5 text-xs text-[#8a8aa0]">
                    KONに保存されているあなたのデータをJSON形式またはCSV形式でダウンロードできます。
                  </p>
                </div>
                <button
                  type="button"
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 bg-[#1a1a2e] px-3 py-1.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-white/10 cursor-pointer"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  エクスポート
                </button>
              </div>

              <div className="border-t border-white/5" />

              {/* Clear history */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-white">利用履歴の消去</h3>
                  <p className="mt-0.5 text-xs text-[#8a8aa0]">
                    チャット履歴や操作ログなど、すべての利用履歴を削除します。アカウントは維持されます。
                  </p>
                </div>
                <button
                  type="button"
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-sm font-medium text-red-400 transition-colors duration-150 hover:bg-red-500/20 cursor-pointer"
                >
                  履歴を消去
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Privacy policy link ── */}
        <div className="flex items-center gap-2 text-sm text-[#8a8aa0]">
          <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
          <span>
            詳細は{" "}
            <Link href="/privacy" className="text-[#4a9eff] hover:underline">
              プライバシーポリシー
            </Link>
            {" "}をご覧ください
          </span>
        </div>

        {/* ── Save ── */}
        <div className="flex justify-end">
          <button
            type="button"
            className="rounded-xl bg-[#4a9eff] px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors duration-150 hover:bg-[#3a8eef] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4a9eff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a14] cursor-pointer"
          >
            変更を保存
          </button>
        </div>

        {/* ── Danger zone: Account deletion ── */}
        <section
          className="overflow-hidden rounded-2xl border border-red-500/20 bg-[#12121e]"
          aria-labelledby="delete-heading"
        >
          <div className="border-b border-red-500/20 px-6 py-4">
            <h2 id="delete-heading" className="text-sm font-semibold text-red-400">
              アカウントの削除
            </h2>
          </div>
          <div className="p-6">
            <p className="mb-4 text-sm text-[#8a8aa0]">
              アカウントを削除すると、すべてのデータが完全に削除されます。この操作は取り消せません。
            </p>
            <button
              type="button"
              onClick={() => setShowDeleteDialog(true)}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a14] cursor-pointer"
            >
              アカウントを削除
            </button>
          </div>
        </section>
      </div>

      {/* ── Delete confirmation dialog ── */}
      {showDeleteDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
        >
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#12121e] p-6 shadow-2xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
              <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h3 id="delete-dialog-title" className="text-base font-bold text-white">
              本当に削除しますか？
            </h3>
            <p className="mt-2 text-sm text-[#8a8aa0]">
              アカウントとすべてのデータが完全に削除されます。この操作は取り消せません。
            </p>
            <p className="mt-3 text-sm text-[#8a8aa0]">
              確認のため <span className="font-mono text-red-400">DELETE</span> と入力してください。
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="DELETE"
              className="mt-2 w-full rounded-lg border border-white/10 bg-[#1a1a2e] px-3.5 py-2.5 text-sm text-white placeholder:text-[#8a8aa0] focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              autoComplete="off"
            />
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteDialog(false);
                  setDeleteConfirmText("");
                }}
                className="flex-1 rounded-xl border border-white/10 bg-transparent py-2.5 text-sm font-medium text-[#8a8aa0] transition-colors duration-150 hover:bg-white/5 hover:text-white cursor-pointer"
              >
                キャンセル
              </button>
              <button
                type="button"
                disabled={deleteConfirmText !== "DELETE"}
                className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}
    </MypageSettingsShell>
  );
}
