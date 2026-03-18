import React from "react";
import Link from "next/link";
import { RegistrationStepper } from "@/components/register/RegistrationStepper";

export const metadata = {
  title: "登録確認 | HiCrew",
  description: "入力内容を確認してください",
};

export default function RegisterConfirmPage() {
  return (
    <div className="w-full max-w-lg">
      {/* Stepper */}
      <div className="mb-8">
        <RegistrationStepper currentStep={5} />
      </div>

      {/* Card */}
      <div className="rounded-xl border border-white/[0.06] bg-[#12121e] p-6 sm:p-8">
        <h1 className="mb-1 text-xl font-bold text-white">入力内容を確認</h1>
        <p className="mb-6 text-sm text-[#8a8aa0]">
          以下の内容で登録します。よろしければ「次へ」をクリックしてください。
        </p>

        {/* Summary sections */}
        <div className="flex flex-col gap-4">
          {/* Profile section */}
          <div className="overflow-hidden rounded-lg border border-white/[0.06]">
            <div className="flex items-center justify-between border-b border-white/[0.06] bg-white/[0.02] px-4 py-2.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-[#8a8aa0]">
                基本情報
              </span>
              <Link
                href="/register/basic"
                className="text-xs font-medium text-[#4a9eff] hover:text-[#4a9eff]/80 transition-colors"
              >
                変更
              </Link>
            </div>
            <div className="flex flex-col divide-y divide-white/[0.06]">
              {[
                { label: "お名前", value: "山田 太郎" },
                { label: "表示名", value: "taro" },
                { label: "メールアドレス", value: "taro@example.com" },
                { label: "パスワード", value: "••••••••" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-xs text-[#8a8aa0]">{row.label}</span>
                  <span className="text-sm font-medium text-white">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Plan section */}
          <div className="overflow-hidden rounded-lg border border-white/[0.06]">
            <div className="flex items-center justify-between border-b border-white/[0.06] bg-white/[0.02] px-4 py-2.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-[#8a8aa0]">
                選択プラン
              </span>
              <Link
                href="/register/plan"
                className="text-xs font-medium text-[#4a9eff] hover:text-[#4a9eff]/80 transition-colors"
              >
                変更
              </Link>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-white">Pro プラン</p>
                <p className="text-xs text-[#8a8aa0]">¥2,980 / 月（税込）</p>
              </div>
              <span className="rounded-full bg-[#4a9eff]/10 px-2.5 py-0.5 text-xs font-medium text-[#4a9eff]">
                おすすめ
              </span>
            </div>
          </div>

          {/* Team section */}
          <div className="overflow-hidden rounded-lg border border-white/[0.06]">
            <div className="flex items-center justify-between border-b border-white/[0.06] bg-white/[0.02] px-4 py-2.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-[#8a8aa0]">
                チーム情報
              </span>
              <Link
                href="/register/member"
                className="text-xs font-medium text-[#4a9eff] hover:text-[#4a9eff]/80 transition-colors"
              >
                変更
              </Link>
            </div>
            <div className="flex flex-col divide-y divide-white/[0.06]">
              {[
                { label: "チーム名", value: "マイチーム" },
                { label: "チームURL", value: "hicrew.app/my-team" },
                { label: "招待メンバー", value: "2名" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between px-4 py-2.5">
                  <span className="text-xs text-[#8a8aa0]">{row.label}</span>
                  <span className="text-sm font-medium text-white">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Terms consent */}
        <label className="mt-5 flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            required
            className="mt-0.5 h-4 w-4 rounded border-white/[0.12] bg-white/[0.04] text-[#4a9eff] focus:ring-[#4a9eff] cursor-pointer accent-[#4a9eff]"
          />
          <span className="text-sm text-[#8a8aa0]">
            <Link href="/terms" className="text-[#4a9eff] hover:text-[#4a9eff]/80 underline">
              利用規約
            </Link>
            {" "}および{" "}
            <Link href="/privacy" className="text-[#4a9eff] hover:text-[#4a9eff]/80 underline">
              プライバシーポリシー
            </Link>
            {" "}に同意します
          </span>
        </label>

        {/* Navigation */}
        <div className="mt-6 flex flex-col gap-3">
          <Link href="/register/robot">
            <button
              type="button"
              className="w-full cursor-pointer rounded-lg bg-gradient-to-r from-[#4a9eff] to-[#7c5cfc] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#4a9eff]/20 transition-all duration-200 hover:shadow-[#4a9eff]/30 hover:brightness-110"
            >
              次へ
            </button>
          </Link>
          <Link href="/register/member">
            <button
              type="button"
              className="w-full cursor-pointer rounded-lg border border-white/[0.06] bg-transparent px-6 py-2.5 text-sm font-medium text-[#8a8aa0] transition-all duration-200 hover:border-white/[0.12] hover:text-white"
            >
              戻る
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
