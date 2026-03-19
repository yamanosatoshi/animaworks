"use client";

import React from "react";
import Link from "next/link";
import { RegistrationStepper } from "@/components/register/RegistrationStepper";
import { useRegistration, PLAN_META } from "@/context/RegistrationContext";

export default function RegisterPaymentPage() {
  const { state } = useRegistration();

  return (
    <div className="w-full max-w-lg">
      {/* Stepper */}
      <div className="mb-8">
        <RegistrationStepper currentStep={4} />
      </div>

      {/* Card */}
      <div className="rounded-xl border border-white/[0.06] bg-[#12121e] p-6 sm:p-8">
        <h1 className="mb-1 text-xl font-bold text-white">お支払い情報</h1>
        <p className="mb-6 text-sm text-[#8a8aa0]">
          クレジットカード情報を入力してください。SSL暗号化で安全に保護されます。
        </p>

        {/* Selected plan reminder */}
        <div className="mb-6 flex items-center justify-between rounded-lg border border-[#4a9eff]/20 bg-[#4a9eff]/[0.04] px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-white">
              {PLAN_META[state.selectedPlan]?.name ?? "Team"} プラン
            </p>
            <p className="text-xs text-[#8a8aa0]">
              {PLAN_META[state.selectedPlan]?.price ?? "¥29,800"} /月（税込）
            </p>
          </div>
          <Link
            href="/register/plan"
            className="text-xs font-medium text-[#4a9eff] hover:text-[#4a9eff]/80 transition-colors"
          >
            変更
          </Link>
        </div>

        <form className="flex flex-col gap-5">
          {/* Card number */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="cardNumber" className="text-sm font-medium text-[#8a8aa0]">
              カード番号 <span className="text-[#4a9eff]" aria-label="必須">*</span>
            </label>
            <div className="relative">
              <input
                id="cardNumber"
                name="cardNumber"
                type="text"
                placeholder="1234 5678 9012 3456"
                required
                autoComplete="cc-number"
                inputMode="numeric"
                maxLength={19}
                className="w-full rounded-lg border border-white/[0.06] bg-white/[0.04] px-3.5 py-2.5 pr-20 text-sm text-white placeholder:text-[#8a8aa0]/50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#4a9eff] focus:border-transparent hover:border-white/[0.12]"
              />
              {/* Card brand icons */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1.5">
                <div className="flex h-5 w-8 items-center justify-center rounded bg-white/[0.08] text-[8px] font-bold text-[#8a8aa0]">
                  VISA
                </div>
                <div className="flex h-5 w-8 items-center justify-center rounded bg-white/[0.08] text-[8px] font-bold text-[#8a8aa0]">
                  MC
                </div>
              </div>
            </div>
          </div>

          {/* Cardholder name */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="cardName" className="text-sm font-medium text-[#8a8aa0]">
              カード名義 <span className="text-[#4a9eff]" aria-label="必須">*</span>
            </label>
            <input
              id="cardName"
              name="cardName"
              type="text"
              placeholder="TARO YAMADA"
              required
              autoComplete="cc-name"
              className="w-full rounded-lg border border-white/[0.06] bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder:text-[#8a8aa0]/50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#4a9eff] focus:border-transparent hover:border-white/[0.12]"
            />
          </div>

          {/* Expiry + CVC */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="expiry" className="text-sm font-medium text-[#8a8aa0]">
                有効期限 <span className="text-[#4a9eff]" aria-label="必須">*</span>
              </label>
              <input
                id="expiry"
                name="expiry"
                type="text"
                placeholder="MM / YY"
                required
                autoComplete="cc-exp"
                inputMode="numeric"
                maxLength={7}
                className="w-full rounded-lg border border-white/[0.06] bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder:text-[#8a8aa0]/50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#4a9eff] focus:border-transparent hover:border-white/[0.12]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="cvc" className="text-sm font-medium text-[#8a8aa0]">
                セキュリティコード <span className="text-[#4a9eff]" aria-label="必須">*</span>
              </label>
              <input
                id="cvc"
                name="cvc"
                type="text"
                placeholder="123"
                required
                autoComplete="cc-csc"
                inputMode="numeric"
                maxLength={4}
                className="w-full rounded-lg border border-white/[0.06] bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder:text-[#8a8aa0]/50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#4a9eff] focus:border-transparent hover:border-white/[0.12]"
              />
            </div>
          </div>

          {/* Security note */}
          <div className="flex items-center gap-2 rounded-lg bg-white/[0.02] px-3 py-2.5">
            <svg className="h-4 w-4 shrink-0 text-[#8a8aa0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            <p className="text-xs text-[#8a8aa0]">
              カード情報はSSL暗号化通信で保護され、安全に処理されます。
              カード情報はサーバーに保存されません。
            </p>
          </div>

          {/* Coupon */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="coupon" className="text-sm font-medium text-[#8a8aa0]">
              クーポンコード（任意）
            </label>
            <div className="flex gap-2">
              <input
                id="coupon"
                name="coupon"
                type="text"
                placeholder="クーポンコードを入力"
                className="min-w-0 flex-1 rounded-lg border border-white/[0.06] bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder:text-[#8a8aa0]/50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#4a9eff] focus:border-transparent hover:border-white/[0.12]"
              />
              <button
                type="button"
                className="shrink-0 cursor-pointer rounded-lg border border-[#4a9eff]/30 bg-[#4a9eff]/10 px-4 py-2.5 text-sm font-medium text-[#4a9eff] transition-all duration-200 hover:bg-[#4a9eff]/20"
              >
                適用
              </button>
            </div>
          </div>

          {/* Order summary */}
          <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#8a8aa0]">
              お支払い内容
            </h3>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <span className="text-sm text-[#8a8aa0]">
                  {PLAN_META[state.selectedPlan]?.name ?? "Team"} プラン（月額）
                </span>
                <span className="text-sm text-white">
                  {PLAN_META[state.selectedPlan]?.price ?? "¥29,800"}
                </span>
              </div>
              <div className="my-1 border-t border-white/[0.06]" />
              <div className="flex justify-between">
                <span className="text-sm font-semibold text-white">合計（税込）</span>
                <span className="text-sm font-bold text-[#4a9eff]">
                  {PLAN_META[state.selectedPlan]?.price ?? "¥29,800"}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-2 flex flex-col gap-3">
            <Link href="/register/complete">
              <button
                type="button"
                className="w-full cursor-pointer rounded-lg bg-gradient-to-r from-[#4a9eff] to-[#7c5cfc] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#4a9eff]/20 transition-all duration-200 hover:shadow-[#4a9eff]/30 hover:brightness-110"
              >
                お支払いを確定する
              </button>
            </Link>
            <Link href="/register/robot">
              <button
                type="button"
                className="w-full cursor-pointer rounded-lg border border-white/[0.06] bg-transparent px-6 py-2.5 text-sm font-medium text-[#8a8aa0] transition-all duration-200 hover:border-white/[0.12] hover:text-white"
              >
                戻る
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
