"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

const initialEmailSettings: NotificationSetting[] = [
  { id: "email-login", label: "ログイン通知", description: "新しいデバイスからログインした際に通知", enabled: true },
  { id: "email-updates", label: "アップデート情報", description: "新機能やサービスのお知らせ", enabled: true },
  { id: "email-weekly", label: "週次サマリー", description: "週ごとの利用状況レポート", enabled: false },
  { id: "email-billing", label: "請求・支払い通知", description: "プランの更新や請求に関する通知", enabled: true },
];

const initialPushSettings: NotificationSetting[] = [
  { id: "push-chat", label: "チャット通知", description: "新しいメッセージが届いた際に通知", enabled: true },
  { id: "push-mentions", label: "メンション", description: "自分がメンションされた際に通知", enabled: true },
  { id: "push-exports", label: "エクスポート完了", description: "データのエクスポートが完了した際に通知", enabled: false },
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

export default function NotificationsSettingsPage() {
  const [emailSettings, setEmailSettings] = useState(initialEmailSettings);
  const [pushSettings, setPushSettings] = useState(initialPushSettings);

  const toggleEmail = (id: string) => {
    setEmailSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const togglePush = (id: string) => {
    setPushSettings((prev) =>
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
          <h1 className="text-2xl font-bold text-gray-900">通知設定</h1>
          <p className="mt-0.5 text-sm text-gray-500">メールとプッシュ通知を管理</p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Email notifications */}
        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm" aria-labelledby="email-heading">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 id="email-heading" className="text-sm font-semibold text-gray-900">
              メール通知
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {emailSettings.map((setting) => (
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
                  onToggle={() => toggleEmail(setting.id)}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Push notifications */}
        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm" aria-labelledby="push-heading">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 id="push-heading" className="text-sm font-semibold text-gray-900">
              プッシュ通知
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {pushSettings.map((setting) => (
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
                  onToggle={() => togglePush(setting.id)}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Save button */}
        <div className="flex justify-end">
          <Button variant="primary" size="md" type="button">
            変更を保存
          </Button>
        </div>
      </div>
    </div>
  );
}
