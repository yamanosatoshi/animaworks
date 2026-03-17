import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export const metadata = {
  title: "プロフィール入力 | KON",
  description: "あなたのプロフィールを入力してください",
};

export default function RegisterProfilePage() {
  return (
    <div className="w-full max-w-lg">
      {/* Progress */}
      <div className="mb-6 flex items-center gap-2">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center gap-2">
            <div
              className={[
                "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold",
                step === 1
                  ? "bg-violet-600 text-white"
                  : step === 2
                  ? "bg-violet-100 text-violet-600"
                  : "bg-gray-100 text-gray-400",
              ].join(" ")}
            >
              {step}
            </div>
            {step < 3 && (
              <div
                className={[
                  "h-0.5 w-10 rounded-full",
                  step === 1 ? "bg-violet-300" : "bg-gray-200",
                ].join(" ")}
              />
            )}
          </div>
        ))}
        <span className="ml-2 text-xs text-gray-500">基本情報入力</span>
      </div>

      <Card padding="lg" className="shadow-xl">
        <h1 className="mb-1 text-xl font-bold text-gray-900">
          プロフィールを設定
        </h1>
        <p className="mb-6 text-sm text-gray-500">
          アカウント情報を入力してください
        </p>

        <form action="/api/auth/register" method="POST" className="flex flex-col gap-5">
          {/* Avatar upload */}
          <div className="flex items-center gap-4">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-violet-200 to-indigo-200 text-violet-600 cursor-pointer hover:opacity-80 transition-opacity"
              role="button"
              tabIndex={0}
              aria-label="プロフィール画像をアップロード"
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">プロフィール画像</p>
              <p className="text-xs text-gray-400">JPG, PNG (最大 5MB)</p>
              <button
                type="button"
                className="mt-1 text-xs font-medium text-violet-600 hover:text-violet-700 transition-colors cursor-pointer"
              >
                画像をアップロード
              </button>
            </div>
          </div>

          {/* Name fields */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="姓"
              name="lastName"
              placeholder="山田"
              required
              autoComplete="family-name"
            />
            <Input
              label="名"
              name="firstName"
              placeholder="太郎"
              required
              autoComplete="given-name"
            />
          </div>

          <Input
            label="表示名（ニックネーム）"
            name="displayName"
            placeholder="taro"
            hint="他のユーザーに表示される名前です"
            required
          />

          <Input
            label="メールアドレス"
            type="email"
            name="email"
            placeholder="taro@example.com"
            required
            autoComplete="email"
          />

          <Input
            label="パスワード"
            type="password"
            name="password"
            placeholder="8文字以上"
            required
            autoComplete="new-password"
            hint="英字・数字・記号を含む8文字以上"
          />

          <Input
            label="パスワード（確認）"
            type="password"
            name="passwordConfirm"
            placeholder="パスワードを再入力"
            required
            autoComplete="new-password"
          />

          <div className="mt-2 flex flex-col gap-3">
            <Link href="/register/plan">
              <Button variant="primary" size="lg" fullWidth>
                次へ（プラン選択）
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="ghost" size="md" fullWidth>
                戻る
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
