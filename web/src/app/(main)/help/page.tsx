import React from "react";
import Link from "next/link";

export const metadata = {
  title: "ヘルプセンター | KON",
  description: "KONのヘルプセンター。よくある質問・使い方ガイド・お問い合わせ",
};

/* ---------- icon components ---------- */

const SearchIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
    />
  </svg>
);

const RocketIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.8}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.58-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
    />
  </svg>
);

const UserGroupIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.8}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
    />
  </svg>
);

const CreditCardIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.8}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
    />
  </svg>
);

const ShieldCheckIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.8}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
    />
  </svg>
);

const QuestionMarkIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.8}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
    />
  </svg>
);

const DocumentIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.8}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
    />
  </svg>
);

const ChevronRightIcon = () => (
  <svg
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.25 4.5l7.5 7.5-7.5 7.5"
    />
  </svg>
);

const MailIcon = () => (
  <svg
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
    />
  </svg>
);

/* ---------- data ---------- */

interface HelpCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  articleCount: number;
}

interface PopularArticle {
  id: string;
  title: string;
  category: string;
  views: number;
}

const categories: HelpCategory[] = [
  {
    id: "getting-started",
    title: "はじめ方",
    description: "初期設定・基本的な使い方",
    icon: <RocketIcon />,
    articleCount: 8,
  },
  {
    id: "account",
    title: "アカウント管理",
    description: "登録・ログイン・設定変更",
    icon: <UserGroupIcon />,
    articleCount: 12,
  },
  {
    id: "billing",
    title: "プランと支払い",
    description: "料金・アップグレード・解約",
    icon: <CreditCardIcon />,
    articleCount: 6,
  },
  {
    id: "security",
    title: "セキュリティ",
    description: "2段階認証・パスワード管理",
    icon: <ShieldCheckIcon />,
    articleCount: 5,
  },
];

const popularArticles: PopularArticle[] = [
  {
    id: "1",
    title: "アカウントの作成方法",
    category: "はじめ方",
    views: 1240,
  },
  {
    id: "2",
    title: "パスワードを忘れた場合の対処法",
    category: "アカウント管理",
    views: 980,
  },
  {
    id: "3",
    title: "プランをアップグレードするには",
    category: "プランと支払い",
    views: 756,
  },
  {
    id: "4",
    title: "2段階認証の設定方法",
    category: "セキュリティ",
    views: 643,
  },
  {
    id: "5",
    title: "データのエクスポート方法",
    category: "はじめ方",
    views: 521,
  },
];

/* ---------- page ---------- */

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">ヘルプセンター</h1>
        <p className="mt-1 text-sm text-gray-400">
          お困りのことをお知らせください
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">
          <SearchIcon />
        </div>
        <input
          type="search"
          placeholder="質問を検索..."
          className="w-full rounded-xl py-3 pl-11 pr-4 text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2"
          style={{
            backgroundColor: "#12121e",
            border: "1px solid #1e1e2e",
            boxShadow: "none",
          }}
          aria-label="ヘルプを検索"
        />
      </div>

      {/* Categories */}
      <section className="mb-8" aria-labelledby="categories-heading">
        <h2
          id="categories-heading"
          className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500"
        >
          カテゴリー
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/help?category=${cat.id}`}
              className="flex items-start gap-3 rounded-2xl p-4 transition-colors duration-150 hover:brightness-110"
              style={{
                backgroundColor: "#12121e",
                border: "1px solid #1e1e2e",
              }}
            >
              <div
                className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                style={{
                  backgroundColor: "rgba(74, 158, 255, 0.12)",
                  color: "#4a9eff",
                }}
              >
                {cat.icon}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-100">
                  {cat.title}
                </p>
                <p className="mt-0.5 truncate text-xs text-gray-500">
                  {cat.description}
                </p>
                <p
                  className="mt-1 text-xs font-medium"
                  style={{ color: "#4a9eff" }}
                >
                  {cat.articleCount}件
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular articles */}
      <section className="mb-8" aria-labelledby="popular-heading">
        <h2
          id="popular-heading"
          className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500"
        >
          よく見られている記事
        </h2>
        <div
          className="overflow-hidden rounded-2xl"
          style={{
            backgroundColor: "#12121e",
            border: "1px solid #1e1e2e",
          }}
        >
          {popularArticles.map((article, index) => (
            <Link
              key={article.id}
              href={`/help/${article.id}`}
              className="flex items-center gap-3 px-5 py-4 transition-colors duration-150 hover:bg-white/[0.03]"
              style={
                index > 0 ? { borderTop: "1px solid #1e1e2e" } : undefined
              }
            >
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: "rgba(74, 158, 255, 0.12)",
                  color: "#4a9eff",
                }}
              >
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-gray-100">
                  {article.title}
                </p>
                <p className="mt-0.5 text-xs text-gray-500">
                  {article.category}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1 text-xs text-gray-500">
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {article.views.toLocaleString()}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick links: FAQ & Terms */}
      <div className="mb-6 flex flex-col gap-3">
        {/* FAQ link */}
        <div
          className="flex items-center justify-between rounded-2xl p-4"
          style={{
            backgroundColor: "#12121e",
            border: "1px solid #1e1e2e",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
              style={{
                backgroundColor: "rgba(251, 191, 36, 0.12)",
                color: "#fbbf24",
              }}
            >
              <QuestionMarkIcon />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-100">
                よくある質問（FAQ）
              </p>
              <p className="text-xs text-gray-500">
                よく寄せられる質問をまとめています
              </p>
            </div>
          </div>
          <Link
            href="/help/faq"
            className="flex items-center gap-1 text-sm font-medium transition-colors"
            style={{ color: "#4a9eff" }}
          >
            見る
            <ChevronRightIcon />
          </Link>
        </div>

        {/* Terms link */}
        <div
          className="flex items-center justify-between rounded-2xl p-4"
          style={{
            backgroundColor: "#12121e",
            border: "1px solid #1e1e2e",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
              style={{
                backgroundColor: "rgba(139, 92, 246, 0.12)",
                color: "#8b5cf6",
              }}
            >
              <DocumentIcon />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-100">利用規約</p>
              <p className="text-xs text-gray-500">
                サービスの利用条件について
              </p>
            </div>
          </div>
          <Link
            href="/help/terms"
            className="flex items-center gap-1 text-sm font-medium transition-colors"
            style={{ color: "#4a9eff" }}
          >
            見る
            <ChevronRightIcon />
          </Link>
        </div>
      </div>

      {/* Contact CTA */}
      <div
        className="rounded-2xl p-6"
        style={{
          background: "linear-gradient(135deg, #4a9eff 0%, #6366f1 100%)",
        }}
      >
        <h2 className="text-base font-semibold text-white">
          解決しませんでしたか？
        </h2>
        <p className="mt-1 text-sm text-blue-100">
          サポートチームが丁寧にお答えします
        </p>
        <Link
          href="/contact"
          className="mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium shadow-sm transition-colors duration-150 hover:opacity-90"
          style={{ backgroundColor: "#0a0a14", color: "#4a9eff" }}
        >
          <MailIcon />
          お問い合わせ
        </Link>
      </div>
    </div>
  );
}
