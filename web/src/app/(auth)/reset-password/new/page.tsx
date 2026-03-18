import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export const metadata = {
  title: "新パスワード設定 | HiCrew",
  description: "新しいパスワードを設定してください",
};

export default function ResetPasswordNewPage() {
  return (
    <div className="w-full max-w-md">
      <Card padding="lg" className="shadow-xl">
        {/* Icon */}
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100">
            <svg
              className="h-7 w-7 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900">新しいパスワードを設定</h1>
          <p className="mt-2 text-sm text-gray-500">
            安全な新しいパスワードを入力してください
          </p>
        </div>

        <form action="/api/auth/reset-password/confirm" method="POST" className="flex flex-col gap-5">
          <Input
            label="新しいパスワード"
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

          {/* Password requirements */}
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="mb-2 text-xs font-medium text-gray-600">パスワードの要件</p>
            <ul className="space-y-1">
              {[
                "8文字以上",
                "英大文字を含む",
                "英小文字を含む",
                "数字を含む",
                "記号を含む（推奨）",
              ].map((req) => (
                <li key={req} className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-gray-300" />
                  </div>
                  <span className="text-xs text-gray-500">{req}</span>
                </li>
              ))}
            </ul>
          </div>

          <Link href="/login">
            <Button variant="primary" size="lg" fullWidth>
              パスワードを更新
            </Button>
          </Link>
        </form>
      </Card>
    </div>
  );
}
