"use client";

import React from "react";
import Link from "next/link";
import { RegistrationStepper } from "@/components/register/RegistrationStepper";
import { useRegistration } from "@/context/RegistrationContext";

export default function RegisterRobotPage() {
  const { state, set } = useRegistration();

  return (
    <div className="w-full max-w-lg">
      {/* Stepper */}
      <div className="mb-8">
        <RegistrationStepper currentStep={4} />
      </div>

      {/* Card */}
      <div className="rounded-xl border border-white/[0.06] bg-[#12121e] p-6 sm:p-8">
        {/* AI icon */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#7c5cfc]/20 to-[#4a9eff]/20">
            <svg className="h-6 w-6 text-[#7c5cfc]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">コピーロボット作成</h1>
            <p className="text-sm text-[#8a8aa0]">あなた専用のAIアシスタントを設定します</p>
          </div>
        </div>

        <form className="flex flex-col gap-5">
          {/* Robot name */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="robotName" className="text-sm font-medium text-[#8a8aa0]">
              ロボット名 <span className="text-[#4a9eff]" aria-label="必須">*</span>
            </label>
            <input
              id="robotName"
              name="robotName"
              type="text"
              placeholder="マイアシスタント"
              required
              value={state.robotName}
              onChange={(e) => set("robotName", e.target.value)}
              className="w-full rounded-lg border border-white/[0.06] bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder:text-[#8a8aa0]/50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#4a9eff] focus:border-transparent hover:border-white/[0.12]"
            />
          </div>

          {/* Personality */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="personality" className="text-sm font-medium text-[#8a8aa0]">
              性格・トーン
            </label>
            <select
              id="personality"
              name="personality"
              value={state.personality}
              onChange={(e) => set("personality", e.target.value)}
              className="w-full cursor-pointer rounded-lg border border-white/[0.06] bg-white/[0.04] px-3.5 py-2.5 text-sm text-white transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#4a9eff] focus:border-transparent hover:border-white/[0.12] [&>option]:bg-[#12121e]"
            >
              <option value="professional">プロフェッショナル（丁寧・ビジネス向け）</option>
              <option value="friendly">フレンドリー（カジュアル・親しみやすい）</option>
              <option value="creative">クリエイティブ（自由・発想豊か）</option>
              <option value="concise">簡潔（短く的確に）</option>
            </select>
          </div>

          {/* Specialization */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#8a8aa0]">
              得意分野（複数選択可）
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "writing", label: "文章作成", icon: "✍️" },
                { id: "coding", label: "コーディング", icon: "💻" },
                { id: "analysis", label: "データ分析", icon: "📊" },
                { id: "design", label: "デザイン", icon: "🎨" },
                { id: "marketing", label: "マーケティング", icon: "📣" },
                { id: "support", label: "カスタマーサポート", icon: "🤝" },
              ].map((skill) => (
                <label
                  key={skill.id}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 transition-all duration-200 hover:border-[#7c5cfc]/30 hover:bg-white/[0.04]"
                >
                  <input
                    type="checkbox"
                    name="specialization"
                    value={skill.id}
                    checked={state.specializations.includes(skill.id)}
                    onChange={() => {
                      const current = state.specializations;
                      if (current.includes(skill.id)) {
                        set("specializations", current.filter((s) => s !== skill.id));
                      } else {
                        set("specializations", [...current, skill.id]);
                      }
                    }}
                    className="sr-only peer"
                  />
                  <span className="text-base" aria-hidden="true">{skill.icon}</span>
                  <span className="text-xs text-[#8a8aa0] peer-checked:text-white transition-colors">
                    {skill.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Custom instructions */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="instructions" className="text-sm font-medium text-[#8a8aa0]">
              カスタム指示（任意）
            </label>
            <textarea
              id="instructions"
              name="instructions"
              rows={3}
              placeholder="例: 日本語で回答してください。回答は簡潔にまとめてください。"
              value={state.instructions}
              onChange={(e) => set("instructions", e.target.value)}
              className="w-full resize-none rounded-lg border border-white/[0.06] bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder:text-[#8a8aa0]/50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#4a9eff] focus:border-transparent hover:border-white/[0.12]"
            />
            <p className="text-xs text-[#8a8aa0]">ロボットに覚えてほしいルールや好みを入力できます</p>
          </div>

          {/* Preview card */}
          <div className="rounded-lg border border-[#7c5cfc]/20 bg-[#7c5cfc]/[0.04] p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#7c5cfc] to-[#4a9eff]">
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{state.robotName || "マイアシスタント"}</p>
                <p className="text-xs text-[#8a8aa0]">プレビュー</p>
              </div>
            </div>
            <p className="text-xs text-[#8a8aa0] italic">
              「こんにちは！何かお手伝いできることはありますか？」
            </p>
          </div>

          {/* Navigation */}
          <div className="mt-2 flex flex-col gap-3">
            <Link href="/register/payment">
              <button
                type="button"
                className="w-full cursor-pointer rounded-lg bg-gradient-to-r from-[#4a9eff] to-[#7c5cfc] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#4a9eff]/20 transition-all duration-200 hover:shadow-[#4a9eff]/30 hover:brightness-110"
              >
                次へ
              </button>
            </Link>
            <Link href="/register/confirm">
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
