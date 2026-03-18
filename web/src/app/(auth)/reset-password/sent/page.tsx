import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export const metadata = {
  title: "メール送信完了 | HiCrew",
  description: "パスワードリセットメールを送信しました",
};

export default function ResetPasswordSentPage() {
  return (
    <div className="w-full max-w-md text-center">
      <Card padding="lg" className="shadow-xl">
        {/* Mail icon */}
        <div className="mb-6 flex flex-col items-center">
          <div className="relative mb-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-violet-100">
              <svg
                className="h-10 w-10 text-violet-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
            </div>
            <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
              <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
          </div>

          <h1 className="text-xl font-bold text-gray-900">メールを送信しました</h1>
          <p className="mt-3 text-sm text-gray-500 leading-relaxed">
            <span className="font-medium text-gray-700">taro@example.com</span>{" "}
            宛にパスワードリセット用のリンクを送信しました。
            <br />
            メールをご確認ください。
          </p>
        </div>

        {/* Info box */}
        <div className="mb-6 rounded-xl bg-amber-50 border border-amber-200 p-4 text-left">
          <div className="flex gap-3">
            <svg className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-amber-800">ご注意</p>
              <p className="mt-1 text-xs text-amber-700 leading-relaxed">
                メールが届かない場合は、迷惑メールフォルダをご確認ください。
                リンクの有効期限は 24時間 です。
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            className="text-sm font-medium text-violet-600 hover:text-violet-700 transition-colors cursor-pointer"
          >
            メールを再送信する
          </button>
          <Link href="/login">
            <Button variant="secondary" size="md" fullWidth>
              ログイン画面に戻る
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
