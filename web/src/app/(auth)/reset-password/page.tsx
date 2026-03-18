import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export const metadata = {
  title: "パスワードリセット | HiCrew",
  description: "パスワードのリセットを行います",
};

export default function ResetPasswordPage() {
  return (
    <div className="w-full max-w-md">
      <Card padding="lg" className="shadow-xl">
        {/* Icon */}
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100">
            <svg
              className="h-7 w-7 text-violet-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900">パスワードをリセット</h1>
          <p className="mt-2 text-sm text-gray-500 leading-relaxed">
            登録済みのメールアドレスを入力してください。
            <br />
            パスワードリセット用のリンクをお送りします。
          </p>
        </div>

        <form action="/api/auth/reset-password" method="POST" className="flex flex-col gap-5">
          <Input
            label="メールアドレス"
            type="email"
            name="email"
            placeholder="taro@example.com"
            required
            autoComplete="email"
          />

          <Link href="/reset-password/sent">
            <Button variant="primary" size="lg" fullWidth>
              リセットメールを送信
            </Button>
          </Link>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          <Link
            href="/login"
            className="flex items-center justify-center gap-1.5 font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            ログインに戻る
          </Link>
        </p>
      </Card>
    </div>
  );
}
