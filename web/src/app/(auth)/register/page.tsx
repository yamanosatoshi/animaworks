import React from "react";
import Link from "next/link";
import { RegistrationStepper } from "@/components/register/RegistrationStepper";

export const metadata = {
  title: "会員登録 | KON",
  description: "KONへの会員登録シナリオを選択してください",
};

const scenarios = [
  {
    id: "personal",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    title: "個人で利用する",
    description: "個人でKONの機能を試したい方向け。後からチームに招待することもできます。",
    href: "/register/basic",
  },
  {
    id: "team",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    title: "チームで利用する",
    description: "チームメンバーを招待して共同作業。管理者機能やチーム設定が利用できます。",
    href: "/register/basic",
  },
  {
    id: "enterprise",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
    title: "企業として導入する",
    description: "SSO連携・請求書払い・専任サポート付き。大規模導入に最適です。",
    href: "/register/basic",
  },
];

export default function RegisterPage() {
  return (
    <div className="w-full max-w-xl">
      {/* Stepper */}
      <div className="mb-8">
        <RegistrationStepper currentStep={1} />
      </div>

      {/* Card */}
      <div className="rounded-xl border border-white/[0.06] bg-[#12121e] p-6 sm:p-8">
        {/* Hero */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4a9eff] to-[#7c5cfc] shadow-lg shadow-[#4a9eff]/20">
            <span className="text-lg font-bold text-white">KON</span>
          </div>
          <h1 className="text-2xl font-bold text-white">KONへようこそ</h1>
          <p className="mt-2 text-sm text-[#8a8aa0]">
            利用シナリオを選択して、登録を始めましょう
          </p>
        </div>

        {/* Scenario cards */}
        <div className="flex flex-col gap-3">
          {scenarios.map((scenario) => (
            <Link
              key={scenario.id}
              href={scenario.href}
              className="group flex items-start gap-4 rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 transition-all duration-200 hover:border-[#4a9eff]/30 hover:bg-white/[0.04]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#4a9eff]/10 text-[#4a9eff] transition-colors duration-200 group-hover:bg-[#4a9eff]/20">
                {scenario.icon}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-semibold text-white group-hover:text-[#4a9eff] transition-colors duration-200">
                  {scenario.title}
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-[#8a8aa0]">
                  {scenario.description}
                </p>
              </div>
              <svg
                className="mt-1 h-4 w-4 shrink-0 text-[#8a8aa0] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[#4a9eff]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          ))}
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/[0.06]" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#12121e] px-3 text-[#8a8aa0]">または</span>
          </div>
        </div>

        {/* Google sign in */}
        <button
          type="button"
          className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] py-2.5 px-4 text-sm font-medium text-[#8a8aa0] transition-all duration-200 hover:border-white/[0.12] hover:text-white"
          aria-label="Googleアカウントで登録"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Googleで続ける
        </button>

        {/* Login link */}
        <p className="mt-6 text-center text-sm text-[#8a8aa0]">
          すでにアカウントをお持ちですか？{" "}
          <Link
            href="/login"
            className="font-medium text-[#4a9eff] hover:text-[#4a9eff]/80 transition-colors"
          >
            ログイン
          </Link>
        </p>
      </div>
    </div>
  );
}
