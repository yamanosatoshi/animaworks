"use client";

import React, { useState } from "react";
import { MypageSettingsShell } from "@/components/mypage/MypageSettingsShell";

/* ─── Types ─── */

interface ProfileForm {
  lastName: string;
  firstName: string;
  displayName: string;
  bio: string;
  email: string;
  phone: string;
}

/* ─── Styled input for dark theme ─── */

function DarkInput({
  label,
  id,
  hint,
  required,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
}) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-white">
        {label}
        {required && (
          <span className="ml-1 text-[#4a9eff]" aria-label="必須">*</span>
        )}
      </label>
      <input
        id={inputId}
        required={required}
        className="w-full rounded-lg border border-white/10 bg-[#1a1a2e] px-3.5 py-2.5 text-sm text-white placeholder:text-[#8a8aa0] transition-colors duration-150 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-[#4a9eff] focus:border-transparent"
        aria-describedby={hint ? `${inputId}-hint` : undefined}
        {...props}
      />
      {hint && (
        <p id={`${inputId}-hint`} className="text-xs text-[#8a8aa0]">{hint}</p>
      )}
    </div>
  );
}

/* ─── Page ─── */

export default function ProfileSettingsPage() {
  const [form, setForm] = useState<ProfileForm>({
    lastName: "山田",
    firstName: "太郎",
    displayName: "taro",
    bio: "UI/UXデザインとフロントエンド開発が好きです。HiCrewを使ってもっと快適な作業環境を作りたいと思っています。",
    email: "taro@example.com",
    phone: "",
  });

  const update = (key: keyof ProfileForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <MypageSettingsShell
      title="プロフィール設定"
      description="アバター・名前・メールアドレスを変更します"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          // TODO: API integration
        }}
        className="flex flex-col gap-6"
      >
        {/* ── Avatar section ── */}
        <section
          className="rounded-2xl border border-white/10 bg-[#12121e] p-6"
          aria-labelledby="avatar-heading"
        >
          <h2 id="avatar-heading" className="mb-4 text-sm font-semibold text-white">
            プロフィール画像
          </h2>
          <div className="flex items-center gap-6">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-[#4a9eff] to-indigo-500">
              <div className="flex h-full w-full items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {form.lastName.charAt(0) || "U"}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#1a1a2e] px-3 py-1.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-white/10 cursor-pointer"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                画像をアップロード
              </button>
              <button
                type="button"
                className="text-left text-xs text-red-400 hover:text-red-300 transition-colors cursor-pointer"
              >
                画像を削除
              </button>
            </div>
          </div>
        </section>

        {/* ── Basic info ── */}
        <section
          className="rounded-2xl border border-white/10 bg-[#12121e] p-6"
          aria-labelledby="basic-heading"
        >
          <h2 id="basic-heading" className="mb-4 text-sm font-semibold text-white">
            基本情報
          </h2>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DarkInput
                label="姓"
                name="lastName"
                value={form.lastName}
                onChange={(e) => update("lastName", e.target.value)}
                required
                autoComplete="family-name"
              />
              <DarkInput
                label="名"
                name="firstName"
                value={form.firstName}
                onChange={(e) => update("firstName", e.target.value)}
                required
                autoComplete="given-name"
              />
            </div>
            <DarkInput
              label="表示名（ニックネーム）"
              name="displayName"
              value={form.displayName}
              onChange={(e) => update("displayName", e.target.value)}
              hint="他のユーザーに表示される名前です"
            />
            <div className="flex flex-col gap-1.5">
              <label htmlFor="bio" className="text-sm font-medium text-white">
                自己紹介
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={4}
                value={form.bio}
                onChange={(e) => update("bio", e.target.value)}
                maxLength={200}
                className="w-full rounded-lg border border-white/10 bg-[#1a1a2e] px-3.5 py-2.5 text-sm text-white placeholder:text-[#8a8aa0] transition-colors duration-150 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-[#4a9eff] focus:border-transparent resize-none"
                placeholder="自己紹介を入力..."
              />
              <p className="text-right text-xs text-[#8a8aa0]">
                {form.bio.length} / 200字
              </p>
            </div>
          </div>
        </section>

        {/* ── Contact info ── */}
        <section
          className="rounded-2xl border border-white/10 bg-[#12121e] p-6"
          aria-labelledby="contact-heading"
        >
          <h2 id="contact-heading" className="mb-4 text-sm font-semibold text-white">
            連絡先情報
          </h2>
          <div className="flex flex-col gap-4">
            <DarkInput
              label="メールアドレス"
              type="email"
              name="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              required
              autoComplete="email"
              hint="変更するには確認メールが送信されます"
            />
            <DarkInput
              label="電話番号"
              type="tel"
              name="phone"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="090-0000-0000"
              autoComplete="tel"
            />
          </div>
        </section>

        {/* ── Actions ── */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            className="rounded-xl border border-white/10 bg-transparent px-6 py-2.5 text-sm font-medium text-[#8a8aa0] transition-colors duration-150 hover:bg-white/5 hover:text-white cursor-pointer"
          >
            キャンセル
          </button>
          <button
            type="submit"
            className="rounded-xl bg-[#4a9eff] px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors duration-150 hover:bg-[#3a8eef] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4a9eff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a14] cursor-pointer"
          >
            変更を保存
          </button>
        </div>
      </form>
    </MypageSettingsShell>
  );
}
