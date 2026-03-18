"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface PrivacySetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

const initialPrivacySettings: PrivacySetting[] = [
  {
    id: "analytics",
    label: "利用データの収集",
    description: "サービス改善のため、匿名化された利用状況データの収集を許可します",
    enabled: true,
  },
  {
    id: "personalization",
    label: "パーソナライゼーション",
    description: "利用履歴を元にコンテンツをパーソナライズします",
    enabled: true,
  },
  {
    id: "third-party",
    label: "サードパーティ共有",
    description: "サービス向上のため、提携企業とデータを共有します",
    enabled: false,
  },
];

function ToggleSwitch({
  enabled,
  onToggle,
  id,
}: {
  enabled: boolean;
  onToggle: () => void;
  id: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      id={id}
      onClick={onToggle}
      className={[
        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2",
        enabled ? "bg-violet-600" : "bg-gray-200",
      ].join(" ")}
    >
      <span
        aria-hidden="true"
        className={[
          "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
          enabled ? "translate-x-4" : "translate-x-0",
        ].join(" ")}
      />
    </button>
  );
}

export default function PrivacySettingsPage() {
  const [settings, setSettings] = useState(initialPrivacySettings);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const toggle = (id: string) => {
    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

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
          <h1 className="text-2xl font-bold text-gray-900">プライバシー設定</h1>
          <p className="mt-0.5 text-sm text-gray-500">データの取り扱いを管理</p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Data usage consents */}
        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm" aria-labelledby="data-heading">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 id="data-heading" className="text-sm font-semibold text-gray-900">
              データ利用の同意
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {settings.map((setting) => (
              <div key={setting.id} className="flex items-center justify-between px-6 py-4">
                <div className="flex-1 pr-4">
                  <label htmlFor={setting.id} className="text-sm font-medium text-gray-900 cursor-pointer">
                    {setting.label}
                  </label>
                  <p className="mt-0.5 text-xs text-gray-500">{setting.description}</p>
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

        {/* Data export */}
        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm" aria-labelledby="export-heading">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 id="export-heading" className="text-sm font-semibold text-gray-900">
              データのエクスポート
            </h2>
          </div>
          <div className="p-6">
            <p className="mb-4 text-sm text-gray-600">
              HiCrewに保存されているあなたのデータをダウンロードできます。エクスポートにはJSON形式とCSV形式が選択できます。
            </p>
            <Button variant="secondary" size="sm" type="button">
              <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              データをエクスポート
            </Button>
          </div>
        </section>

        {/* Privacy policy link */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
          <span>
            詳細は{" "}
            <Link href="/privacy" className="text-violet-600 hover:text-violet-700 underline">
              プライバシーポリシー
            </Link>
            {" "}をご覧ください
          </span>
        </div>

        {/* Save */}
        <div className="flex justify-end">
          <Button variant="primary" size="md" type="button">
            変更を保存
          </Button>
        </div>

        {/* Account deletion */}
        <section className="overflow-hidden rounded-2xl border border-red-100 bg-white shadow-sm" aria-labelledby="delete-heading">
          <div className="border-b border-red-100 px-6 py-4">
            <h2 id="delete-heading" className="text-sm font-semibold text-red-600">
              アカウントの削除
            </h2>
          </div>
          <div className="p-6">
            <p className="mb-4 text-sm text-gray-600">
              アカウントを削除すると、すべてのデータが完全に削除されます。この操作は取り消せません。
            </p>
            <Button
              variant="danger"
              size="sm"
              type="button"
              onClick={() => setShowDeleteDialog(true)}
            >
              アカウントを削除
            </Button>
          </div>
        </section>
      </div>

      {/* Delete confirmation dialog */}
      {showDeleteDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h3 id="delete-dialog-title" className="text-base font-bold text-gray-900">
              本当に削除しますか？
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              アカウントとすべてのデータが完全に削除されます。この操作は取り消せません。
            </p>
            <div className="mt-6 flex gap-3">
              <Button
                variant="secondary"
                size="md"
                fullWidth
                onClick={() => setShowDeleteDialog(false)}
              >
                キャンセル
              </Button>
              <Button variant="danger" size="md" fullWidth>
                削除する
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
