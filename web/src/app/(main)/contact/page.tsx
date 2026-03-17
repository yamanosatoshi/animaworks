import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export const metadata = {
  title: "お問い合わせ | KON",
  description: "サポートチームへのお問い合わせ",
};

const contactCategories = [
  "アカウント・ログインについて",
  "プラン・支払いについて",
  "機能・操作方法について",
  "バグ・不具合の報告",
  "その他",
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <Link
          href="/help"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
          aria-label="ヘルプに戻る"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">お問い合わせ</h1>
          <p className="mt-0.5 text-sm text-gray-500">サポートチームにご連絡ください</p>
        </div>
      </div>

      {/* Info banner */}
      <div className="mb-6 flex items-start gap-3 rounded-2xl bg-blue-50 border border-blue-100 p-4">
        <svg className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
        <div>
          <p className="text-sm font-medium text-blue-800">ヘルプセンターもご確認ください</p>
          <p className="mt-0.5 text-xs text-blue-600">
            よくある質問に記載されているかもしれません。{" "}
            <Link href="/help" className="underline hover:text-blue-800">
              ヘルプを見る
            </Link>
          </p>
        </div>
      </div>

      {/* Form */}
      <form action="/api/contact" method="POST" className="flex flex-col gap-6">
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-sm font-semibold text-gray-900">基本情報</h2>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="お名前"
                name="name"
                defaultValue="山田 太郎"
                required
                autoComplete="name"
              />
              <Input
                label="メールアドレス"
                type="email"
                name="email"
                defaultValue="taro@example.com"
                required
                autoComplete="email"
              />
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-sm font-semibold text-gray-900">お問い合わせ内容</h2>
          <div className="flex flex-col gap-4">
            {/* Category */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="category" className="text-sm font-medium text-gray-700">
                カテゴリー
                <span className="ml-1 text-violet-600" aria-label="必須">*</span>
              </label>
              <select
                id="category"
                name="category"
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 transition-colors duration-150 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              >
                <option value="">カテゴリーを選択してください</option>
                {contactCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="件名"
              name="subject"
              placeholder="例: ログインできない"
              required
            />

            {/* Message */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="message" className="text-sm font-medium text-gray-700">
                お問い合わせ内容
                <span className="ml-1 text-violet-600" aria-label="必須">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                required
                placeholder="できるだけ詳しくお書きください（発生した操作の手順・エラーメッセージなど）"
                className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-colors duration-150 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
              />
              <p className="text-right text-xs text-gray-400">0 / 2000字</p>
            </div>

            {/* File attachment */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                添付ファイル（任意）
              </label>
              <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 px-6 py-8 transition-colors hover:border-violet-300 hover:bg-violet-50 cursor-pointer">
                <div className="text-center">
                  <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-500">
                    クリックしてファイルを選択、またはドラッグ＆ドロップ
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    PNG, JPG, PDF（最大 10MB）
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy */}
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="privacy"
            required
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500 cursor-pointer"
          />
          <span className="text-sm text-gray-600">
            <Link href="/privacy" className="text-violet-600 hover:text-violet-700 underline">
              プライバシーポリシー
            </Link>
            に同意して送信します
          </span>
        </label>

        <Button variant="primary" size="lg" fullWidth type="submit">
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
          送信する
        </Button>
      </form>

      {/* Response time */}
      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        通常 1〜2営業日以内にご返答します
      </div>
    </div>
  );
}
