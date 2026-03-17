import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export const metadata = {
  title: "登録確認 | KON",
  description: "入力内容を確認してください",
};

export default function RegisterConfirmPage() {
  return (
    <div className="w-full max-w-md">
      {/* Progress */}
      <div className="mb-6 flex items-center gap-2">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center gap-2">
            <div
              className={[
                "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold",
                step < 3
                  ? "bg-violet-300 text-white"
                  : "bg-violet-600 text-white",
              ].join(" ")}
            >
              {step < 3 ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              ) : (
                step
              )}
            </div>
            {step < 3 && (
              <div className="h-0.5 w-10 rounded-full bg-violet-400" />
            )}
          </div>
        ))}
        <span className="ml-2 text-xs text-gray-500">登録確認</span>
      </div>

      <Card padding="lg" className="shadow-xl">
        <h1 className="mb-1 text-xl font-bold text-gray-900">入力内容を確認</h1>
        <p className="mb-6 text-sm text-gray-500">
          以下の内容で登録します。よろしければ「登録する」をクリックしてください。
        </p>

        {/* Summary */}
        <div className="flex flex-col gap-4">
          {/* Profile section */}
          <div className="overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between border-b border-gray-100 bg-white px-4 py-2.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                基本情報
              </span>
              <Link
                href="/register/profile"
                className="text-xs font-medium text-violet-600 hover:text-violet-700 transition-colors"
              >
                変更
              </Link>
            </div>
            <div className="flex flex-col divide-y divide-gray-100">
              {[
                { label: "お名前", value: "山田 太郎" },
                { label: "表示名", value: "taro" },
                { label: "メールアドレス", value: "taro@example.com" },
                { label: "パスワード", value: "••••••••" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-xs text-gray-500">{row.label}</span>
                  <span className="text-sm font-medium text-gray-900">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Plan section */}
          <div className="overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between border-b border-gray-100 bg-white px-4 py-2.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                選択プラン
              </span>
              <Link
                href="/register/plan"
                className="text-xs font-medium text-violet-600 hover:text-violet-700 transition-colors"
              >
                変更
              </Link>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-gray-900">スタンダードプラン</p>
                <p className="text-xs text-gray-500">¥2,980 / 月（税込）</p>
              </div>
              <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-700">
                人気
              </span>
            </div>
          </div>
        </div>

        {/* Terms consent */}
        <label className="mt-5 flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            required
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500 cursor-pointer"
          />
          <span className="text-sm text-gray-600">
            <Link href="/terms" className="text-violet-600 hover:text-violet-700 underline">
              利用規約
            </Link>
            {" "}および{" "}
            <Link href="/privacy" className="text-violet-600 hover:text-violet-700 underline">
              プライバシーポリシー
            </Link>
            {" "}に同意します
          </span>
        </label>

        <div className="mt-6 flex flex-col gap-3">
          <Link href="/register/complete">
            <Button variant="primary" size="lg" fullWidth>
              登録する
            </Button>
          </Link>
          <Link href="/register/plan">
            <Button variant="ghost" size="md" fullWidth>
              戻る
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
