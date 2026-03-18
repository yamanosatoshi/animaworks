"use client";

import React, { useState } from "react";
import { MypageSettingsShell } from "@/components/mypage/MypageSettingsShell";
import { ToggleSwitch } from "@/components/mypage/ToggleSwitch";

/* ─── Types ─── */

interface ToggleSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "member";
}

/* ─── Data ─── */

const initialNotificationSettings: ToggleSetting[] = [
  { id: "notif-email-login", label: "ログイン通知", description: "新しいデバイスからログインした際にメール通知", enabled: true },
  { id: "notif-email-updates", label: "アップデート情報", description: "新機能やサービスのお知らせをメールで受信", enabled: true },
  { id: "notif-push-chat", label: "チャットプッシュ通知", description: "新しいメッセージのプッシュ通知", enabled: true },
  { id: "notif-weekly", label: "週次レポート", description: "毎週の利用状況サマリーを受信", enabled: false },
];

const initialApiSettings = {
  apiKey: "hicrew_sk_xxxxxxxxxxxx...xxxx",
  webhookUrl: "",
};

const teamMembers: TeamMember[] = [
  { id: "1", name: "山田 太郎", email: "taro@example.com", role: "owner" },
  { id: "2", name: "鈴木 花子", email: "hanako@example.com", role: "admin" },
  { id: "3", name: "佐藤 次郎", email: "jiro@example.com", role: "member" },
];

const roleLabels: Record<TeamMember["role"], string> = {
  owner: "オーナー",
  admin: "管理者",
  member: "メンバー",
};

const roleColors: Record<TeamMember["role"], string> = {
  owner: "bg-[#4a9eff]/20 text-[#4a9eff]",
  admin: "bg-emerald-500/20 text-emerald-400",
  member: "bg-white/10 text-[#8a8aa0]",
};

/* ─── Page ─── */

export default function ServiceSettingsPage() {
  const [notifications, setNotifications] = useState(initialNotificationSettings);
  const [apiSettings, setApiSettings] = useState(initialApiSettings);
  const [showApiKey, setShowApiKey] = useState(false);

  const toggleNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  return (
    <MypageSettingsShell
      title="サービス設定"
      description="通知・API連携・チームの設定を管理します"
    >
      <div className="flex flex-col gap-6">
        {/* ── Notification settings ── */}
        <section
          className="overflow-hidden rounded-2xl border border-white/10 bg-[#12121e]"
          aria-labelledby="notif-heading"
        >
          <div className="border-b border-white/10 px-6 py-4">
            <h2 id="notif-heading" className="text-sm font-semibold text-white">
              通知設定
            </h2>
          </div>
          <div className="divide-y divide-white/5">
            {notifications.map((setting) => (
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
                  onToggle={() => toggleNotification(setting.id)}
                />
              </div>
            ))}
          </div>
        </section>

        {/* ── API settings ── */}
        <section
          className="overflow-hidden rounded-2xl border border-white/10 bg-[#12121e]"
          aria-labelledby="api-heading"
        >
          <div className="border-b border-white/10 px-6 py-4">
            <h2 id="api-heading" className="text-sm font-semibold text-white">
              API設定
            </h2>
          </div>
          <div className="p-6">
            <div className="flex flex-col gap-4">
              {/* API key */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="api-key" className="text-sm font-medium text-white">
                  APIキー
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      id="api-key"
                      type={showApiKey ? "text" : "password"}
                      value={apiSettings.apiKey}
                      readOnly
                      className="w-full rounded-lg border border-white/10 bg-[#1a1a2e] px-3.5 py-2.5 pr-10 text-sm font-mono text-white transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#4a9eff] focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a8aa0] hover:text-white transition-colors cursor-pointer"
                      aria-label={showApiKey ? "APIキーを非表示" : "APIキーを表示"}
                    >
                      {showApiKey ? (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <button
                    type="button"
                    className="shrink-0 rounded-lg border border-white/10 bg-[#1a1a2e] px-3 py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-white/10 cursor-pointer"
                  >
                    再生成
                  </button>
                </div>
                <p className="text-xs text-[#8a8aa0]">
                  外部サービスとの連携に使用します。キーは安全に管理してください。
                </p>
              </div>

              {/* Webhook URL */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="webhook-url" className="text-sm font-medium text-white">
                  Webhook URL
                </label>
                <input
                  id="webhook-url"
                  type="url"
                  value={apiSettings.webhookUrl}
                  onChange={(e) => setApiSettings((prev) => ({ ...prev, webhookUrl: e.target.value }))}
                  placeholder="https://example.com/webhook"
                  className="w-full rounded-lg border border-white/10 bg-[#1a1a2e] px-3.5 py-2.5 text-sm text-white placeholder:text-[#8a8aa0] transition-colors duration-150 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-[#4a9eff] focus:border-transparent"
                />
                <p className="text-xs text-[#8a8aa0]">
                  イベント発生時に通知を送信するURLを設定します
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Team settings ── */}
        <section
          className="overflow-hidden rounded-2xl border border-white/10 bg-[#12121e]"
          aria-labelledby="team-heading"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
            <h2 id="team-heading" className="text-sm font-semibold text-white">
              チーム設定
            </h2>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#4a9eff] px-3 py-1.5 text-xs font-medium text-white transition-colors duration-150 hover:bg-[#3a8eef] cursor-pointer"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              メンバーを招待
            </button>
          </div>
          <div className="divide-y divide-white/5">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex items-center gap-4 px-6 py-4">
                {/* Avatar */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#4a9eff]/40 to-indigo-500/40">
                  <span className="text-xs font-bold text-white">
                    {member.name.charAt(0)}
                  </span>
                </div>
                {/* Info */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">{member.name}</p>
                  <p className="truncate text-xs text-[#8a8aa0]">{member.email}</p>
                </div>
                {/* Role badge */}
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${roleColors[member.role]}`}>
                  {roleLabels[member.role]}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Save ── */}
        <div className="flex justify-end">
          <button
            type="button"
            className="rounded-xl bg-[#4a9eff] px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors duration-150 hover:bg-[#3a8eef] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4a9eff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a14] cursor-pointer"
          >
            変更を保存
          </button>
        </div>
      </div>
    </MypageSettingsShell>
  );
}
