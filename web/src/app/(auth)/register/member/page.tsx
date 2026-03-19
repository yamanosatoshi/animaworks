"use client";

import React, { useState } from "react";
import Link from "next/link";
import { RegistrationStepper } from "@/components/register/RegistrationStepper";
import { useRegistration } from "@/context/RegistrationContext";

export default function RegisterMemberPage() {
  const { state, set } = useRegistration();
  const [emailInput, setEmailInput] = useState("");

  return (
    <div className="w-full max-w-lg">
      {/* Stepper */}
      <div className="mb-8">
        <RegistrationStepper currentStep={3} />
      </div>

      {/* Card */}
      <div className="rounded-xl border border-white/[0.06] bg-[#12121e] p-6 sm:p-8">
        <h1 className="mb-1 text-xl font-bold text-white">チーム設定</h1>
        <p className="mb-6 text-sm text-[#8a8aa0]">
          チームの基本情報を設定してください。後から変更できます。
        </p>

        <form className="flex flex-col gap-5">
          {/* Team name */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="teamName" className="text-sm font-medium text-[#8a8aa0]">
              チーム名 <span className="text-[#4a9eff]" aria-label="必須">*</span>
            </label>
            <input
              id="teamName"
              name="teamName"
              type="text"
              placeholder="株式会社○○ / マイチーム"
              required
              value={state.teamName}
              onChange={(e) => set("teamName", e.target.value)}
              className="w-full rounded-lg border border-white/[0.06] bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder:text-[#8a8aa0]/50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#4a9eff] focus:border-transparent hover:border-white/[0.12]"
            />
          </div>

          {/* Team URL */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="teamSlug" className="text-sm font-medium text-[#8a8aa0]">
              チームURL <span className="text-[#4a9eff]" aria-label="必須">*</span>
            </label>
            <div className="flex items-center rounded-lg border border-white/[0.06] bg-white/[0.04] transition-colors duration-150 focus-within:ring-2 focus-within:ring-[#4a9eff] focus-within:border-transparent hover:border-white/[0.12]">
              <span className="shrink-0 pl-3.5 text-sm text-[#8a8aa0]">hicrew.app/</span>
              <input
                id="teamSlug"
                name="teamSlug"
                type="text"
                placeholder="my-team"
                required
                value={state.teamSlug}
                onChange={(e) => set("teamSlug", e.target.value)}
                className="w-full bg-transparent px-1 py-2.5 text-sm text-white placeholder:text-[#8a8aa0]/50 focus:outline-none"
              />
            </div>
            <p className="text-xs text-[#8a8aa0]">英小文字・数字・ハイフンが使えます</p>
          </div>

          {/* Team size */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="teamSize" className="text-sm font-medium text-[#8a8aa0]">
              チーム規模
            </label>
            <select
              id="teamSize"
              name="teamSize"
              value={state.teamSize}
              onChange={(e) => set("teamSize", e.target.value)}
              className="w-full cursor-pointer rounded-lg border border-white/[0.06] bg-white/[0.04] px-3.5 py-2.5 text-sm text-white transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#4a9eff] focus:border-transparent hover:border-white/[0.12] [&>option]:bg-[#12121e]"
            >
              <option value="1-5">1〜5名</option>
              <option value="6-20">6〜20名</option>
              <option value="21-50">21〜50名</option>
              <option value="51-100">51〜100名</option>
              <option value="100+">100名以上</option>
            </select>
          </div>

          {/* Invite members */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#8a8aa0]">
              メンバーを招待（任意）
            </label>
            <p className="text-xs text-[#8a8aa0]">メールアドレスを入力して招待できます</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="member@example.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="min-w-0 flex-1 rounded-lg border border-white/[0.06] bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder:text-[#8a8aa0]/50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#4a9eff] focus:border-transparent hover:border-white/[0.12]"
              />
              <button
                type="button"
                onClick={() => {
                  if (emailInput.trim()) {
                    set("invitedEmails", [...state.invitedEmails, emailInput.trim()]);
                    setEmailInput("");
                  }
                }}
                className="shrink-0 cursor-pointer rounded-lg border border-[#4a9eff]/30 bg-[#4a9eff]/10 px-4 py-2.5 text-sm font-medium text-[#4a9eff] transition-all duration-200 hover:bg-[#4a9eff]/20"
              >
                追加
              </button>
            </div>

            {/* Invited members list */}
            <div className="mt-1 flex flex-col gap-2">
              {state.invitedEmails.map((email, index) => (
                <div key={index} className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5">
                  <span className="text-sm text-white">{email}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = state.invitedEmails.filter((_, i) => i !== index);
                      set("invitedEmails", updated);
                    }}
                    className="cursor-pointer text-xs text-[#8a8aa0] hover:text-white transition-colors"
                  >
                    削除
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-2 flex flex-col gap-3">
            <Link href="/register/confirm">
              <button
                type="button"
                className="w-full cursor-pointer rounded-lg bg-gradient-to-r from-[#4a9eff] to-[#7c5cfc] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#4a9eff]/20 transition-all duration-200 hover:shadow-[#4a9eff]/30 hover:brightness-110"
              >
                次へ
              </button>
            </Link>
            <Link href="/register/plan">
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
