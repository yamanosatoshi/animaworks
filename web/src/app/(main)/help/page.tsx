import React from "react";
import Link from "next/link";

export const metadata = {
  title: "ヘルプ | KON",
  description: "よくある質問とサポート情報",
};

interface HelpCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  count: number;
}

interface HelpArticle {
  id: string;
  title: string;
  category: string;
  views: number;
}

const ChartIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
);

const UserGroupIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
  </svg>
);

const CreditIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
  </svg>
);

const ShieldCheckIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);

const categories: HelpCategory[] = [
  {
    id: "getting-started",
    title: "はじめ方",
    description: "初期設定・基本的な使い方",
    icon: <ChartIcon />,
    count: 8,
  },
  {
    id: "account",
    title: "アカウント管理",
    description: "登録・ログイン・設定変更",
    icon: <UserGroupIcon />,
    count: 12,
  },
  {
    id: "billing",
    title: "プランと支払い",
    description: "料金・アップグレード・解約",
    icon: <CreditIcon />,
    count: 6,
  },
  {
    id: "security",
    title: "セキュリティ",
    description: "2段階認証・パスワード管理",
    icon: <ShieldCheckIcon />,
    count: 5,
  },
];

const popularArticles: HelpArticle[] = [
  { id: "1", title: "アカウントの作成方法", category: "はじめ方", views: 1240 },
  { id: "2", title: "パスワードを忘れた場合の対処法", category: "アカウント管理", views: 980 },
  { id: "3", title: "プランをアップグレードするには", category: "プランと支払い", views: 756 },
  { id: "4", title: "2段階認証の設定方法", category: "セキュリティ", views: 643 },
  { id: "5", title: "データのエクスポート方法", category: "はじめ方", views: 521 },
];

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">ヘルプセンター</h1>
        <p className="mt-1 text-sm text-gray-500">お困りのことをお知らせください</p>
      </div>

      {/* Search */}
      <div className="mb-8 relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
        <input
          type="search"
          placeholder="質問を検索..."
          className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          aria-label="ヘルプを検索"
        />
      </div>

      {/* Categories */}
      <section className="mb-8" aria-labelledby="categories-heading">
        <h2 id="categories-heading" className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
          カテゴリー
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/help?category=${cat.id}`}
              className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm hover:border-violet-200 hover:bg-violet-50 transition-colors duration-150"
            >
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                {cat.icon}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900">{cat.title}</p>
                <p className="mt-0.5 text-xs text-gray-500 truncate">{cat.description}</p>
                <p className="mt-1 text-xs text-violet-600">{cat.count}件</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular articles */}
      <section className="mb-8" aria-labelledby="popular-heading">
        <h2 id="popular-heading" className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
          よく見られている記事
        </h2>
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          {popularArticles.map((article, index) => (
            <Link
              key={article.id}
              href={`/help/${article.id}`}
              className={[
                "flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors duration-150",
                index > 0 ? "border-t border-gray-100" : "",
              ].join(" ")}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-500">
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 truncate">{article.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{article.category}</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400 shrink-0">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {article.views.toLocaleString()}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ link */}
      <div className="mb-6 flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">よくある質問（FAQ）</p>
            <p className="text-xs text-gray-500">よく寄せられる質問をまとめています</p>
          </div>
        </div>
        <Link
          href="/faq"
          className="flex items-center gap-1 text-sm font-medium text-violet-600 hover:text-violet-700 transition-colors"
        >
          見る
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </Link>
      </div>

      {/* Contact CTA */}
      <div className="rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-600 p-6 text-white">
        <h2 className="text-base font-semibold">解決しませんでしたか？</h2>
        <p className="mt-1 text-sm text-violet-100">
          サポートチームが丁寧にお答えします
        </p>
        <Link
          href="/contact"
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-violet-700 shadow-sm hover:bg-violet-50 transition-colors duration-150"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
          お問い合わせ
        </Link>
      </div>
    </div>
  );
}
