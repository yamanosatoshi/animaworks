import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export const metadata = {
  title: "登録完了 | KON",
  description: "アカウントの登録が完了しました",
};

export default function RegisterCompletePage() {
  return (
    <div className="w-full max-w-md text-center">
      <Card padding="lg" className="shadow-xl">
        {/* Success illustration */}
        <div className="mb-6 flex flex-col items-center">
          <div className="relative mb-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-10 w-10 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            </div>
            <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-violet-500 flex items-center justify-center">
              <span className="text-xs text-white font-bold">✓</span>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            登録が完了しました！
          </h1>
          <p className="mt-3 text-sm text-gray-500 leading-relaxed">
            KONへようこそ。
            <br />
            ご登録いただいたメールアドレスに確認メールを送信しました。
            <br />
            メールを確認して、アカウントを有効化してください。
          </p>
        </div>

        {/* Member info summary */}
        <div className="mb-6 rounded-xl bg-gray-50 p-4 text-left">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
            登録情報
          </h2>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">お名前</span>
              <span className="text-sm font-medium text-gray-900">山田 太郎</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">メールアドレス</span>
              <span className="text-sm font-medium text-gray-900">taro@example.com</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">プラン</span>
              <span className="text-sm font-medium text-violet-600">フリープラン</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Link href="/mypage">
            <Button variant="primary" size="lg" fullWidth>
              ダッシュボードへ進む
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="secondary" size="md" fullWidth>
              ログイン画面へ
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
