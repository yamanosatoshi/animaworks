import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export const metadata = {
  title: "セキュリティ設定 | KON",
  description: "パスワードと2段階認証を管理します",
};

export default function SecuritySettingsPage() {
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
          <h1 className="text-2xl font-bold text-gray-900">セキュリティ設定</h1>
          <p className="mt-0.5 text-sm text-gray-500">パスワードと2段階認証を管理</p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Password change */}
        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm" aria-labelledby="password-heading">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 id="password-heading" className="text-sm font-semibold text-gray-900">
              パスワードの変更
            </h2>
          </div>
          <form action="/api/auth/change-password" method="POST" className="flex flex-col gap-4 p-6">
            <Input
              label="現在のパスワード"
              type="password"
              name="currentPassword"
              placeholder="現在のパスワードを入力"
              required
              autoComplete="current-password"
            />
            <Input
              label="新しいパスワード"
              type="password"
              name="newPassword"
              placeholder="8文字以上（英字・数字・記号を含む）"
              required
              autoComplete="new-password"
              hint="英字・数字・記号を含む8文字以上"
            />
            <Input
              label="新しいパスワード（確認）"
              type="password"
              name="confirmPassword"
              placeholder="新しいパスワードを再入力"
              required
              autoComplete="new-password"
            />
            <div className="flex justify-end">
              <Button variant="primary" size="md" type="submit">
                パスワードを変更
              </Button>
            </div>
          </form>
        </section>

        {/* 2FA */}
        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm" aria-labelledby="2fa-heading">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 id="2fa-heading" className="text-sm font-semibold text-gray-900">
              2段階認証
            </h2>
          </div>
          <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-gray-900 font-medium">認証アプリを使った2段階認証</p>
                <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                  Google Authenticator などの認証アプリを使って、
                  ログイン時に追加の本人確認を行います。
                </p>
                <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                  未設定
                </span>
              </div>
              <Button variant="secondary" size="sm" type="button">
                設定する
              </Button>
            </div>
          </div>
        </section>

        {/* Login sessions */}
        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm" aria-labelledby="sessions-heading">
          <div className="border-b border-gray-100 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 id="sessions-heading" className="text-sm font-semibold text-gray-900">
                ログイン中のセッション
              </h2>
              <button
                type="button"
                className="text-xs text-red-500 hover:text-red-600 transition-colors cursor-pointer font-medium"
              >
                すべてログアウト
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {[
              { device: "Chrome / macOS", location: "東京, 日本", current: true, lastSeen: "現在" },
              { device: "Safari / iPhone", location: "東京, 日本", current: false, lastSeen: "2日前" },
            ].map((session, index) => (
              <div key={index} className="flex items-center gap-4 px-6 py-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900">{session.device}</p>
                    {session.current && (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                        現在
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    {session.location} · {session.lastSeen}にアクセス
                  </p>
                </div>
                {!session.current && (
                  <button
                    type="button"
                    className="text-xs text-red-500 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    削除
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
