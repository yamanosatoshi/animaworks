import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export const metadata = {
  title: "プロフィール編集 | HiCrew",
  description: "プロフィール情報を編集します",
};

export default function MyPageEditPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <Link
          href="/mypage"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
          aria-label="マイページに戻る"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">プロフィール編集</h1>
          <p className="mt-0.5 text-sm text-gray-500">プロフィール情報を更新してください</p>
        </div>
      </div>

      <form action="/api/user/profile" method="POST" className="flex flex-col gap-6">
        {/* Avatar section */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-gray-900">プロフィール画像</h2>
          <div className="flex items-center gap-6">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-violet-300 to-indigo-400">
              <div className="flex h-full w-full items-center justify-center">
                <span className="text-2xl font-bold text-white">山</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="secondary" size="sm" type="button">
                <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                画像をアップロード
              </Button>
              <button
                type="button"
                className="text-xs text-red-500 hover:text-red-600 transition-colors cursor-pointer"
              >
                画像を削除
              </button>
            </div>
          </div>
        </div>

        {/* Basic info */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-gray-900">基本情報</h2>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="姓"
                name="lastName"
                defaultValue="山田"
                required
                autoComplete="family-name"
              />
              <Input
                label="名"
                name="firstName"
                defaultValue="太郎"
                required
                autoComplete="given-name"
              />
            </div>
            <Input
              label="表示名（ニックネーム）"
              name="displayName"
              defaultValue="taro"
              hint="他のユーザーに表示される名前"
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700" htmlFor="bio">
                自己紹介
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={4}
                defaultValue="UI/UXデザインとフロントエンド開発が好きです。HiCrewを使ってもっと快適な作業環境を作りたいと思っています。"
                className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-colors duration-150 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                placeholder="自己紹介を入力..."
              />
              <p className="text-right text-xs text-gray-400">0 / 200字</p>
            </div>
          </div>
        </div>

        {/* Contact info */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-gray-900">連絡先情報</h2>
          <div className="flex flex-col gap-4">
            <Input
              label="メールアドレス"
              type="email"
              name="email"
              defaultValue="taro@example.com"
              required
              autoComplete="email"
              hint="変更するには確認メールが送信されます"
            />
            <Input
              label="電話番号"
              type="tel"
              name="phone"
              placeholder="090-0000-0000"
              autoComplete="tel"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link href="/mypage" className="flex-1">
            <Button variant="secondary" size="lg" fullWidth>
              キャンセル
            </Button>
          </Link>
          <Button variant="primary" size="lg" className="flex-1" type="submit">
            変更を保存
          </Button>
        </div>
      </form>
    </div>
  );
}
