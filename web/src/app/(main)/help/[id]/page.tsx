import React from "react";
import Link from "next/link";

interface HelpArticlePageProps {
  params: Promise<{ id: string }>;
}

// ダミー記事データ
const articleData: Record<string, {
  title: string;
  category: string;
  updatedAt: string;
  readTime: string;
  content: { type: "heading" | "paragraph" | "list" | "note"; text?: string; items?: string[] }[];
  related: { id: string; title: string }[];
}> = {
  "1": {
    title: "アカウントの作成方法",
    category: "はじめ方",
    updatedAt: "2024年3月1日",
    readTime: "3分",
    content: [
      {
        type: "paragraph",
        text: "HiCrewへの登録は簡単な3ステップで完了します。以下の手順に従って、アカウントを作成してください。",
      },
      { type: "heading", text: "ステップ1: 登録フォームにアクセス" },
      {
        type: "paragraph",
        text: "トップページの「無料で始める」ボタンをクリックするか、登録ページに直接アクセスしてください。",
      },
      { type: "heading", text: "ステップ2: 基本情報を入力" },
      {
        type: "list",
        items: [
          "メールアドレスまたはGoogleアカウントで登録",
          "お名前（姓名）を入力",
          "表示名（ニックネーム）を設定",
          "パスワードを設定（8文字以上）",
        ],
      },
      { type: "heading", text: "ステップ3: メールを確認" },
      {
        type: "paragraph",
        text: "登録後、ご入力いただいたメールアドレスに確認メールが届きます。メール内のリンクをクリックしてアカウントを有効化してください。",
      },
      {
        type: "note",
        text: "確認メールが届かない場合は、迷惑メールフォルダをご確認ください。",
      },
    ],
    related: [
      { id: "2", title: "パスワードを忘れた場合の対処法" },
      { id: "4", title: "2段階認証の設定方法" },
    ],
  },
};

export async function generateMetadata({ params }: HelpArticlePageProps) {
  const { id } = await params;
  const article = articleData[id];
  return {
    title: article ? `${article.title} | HiCrew ヘルプ` : "ヘルプ記事 | HiCrew",
    description: article?.content[0]?.text ?? "ヘルプ記事",
  };
}

export default async function HelpArticlePage({ params }: HelpArticlePageProps) {
  const { id } = await params;
  const article = articleData[id] ?? {
    title: "ヘルプ記事",
    category: "一般",
    updatedAt: "2024年3月18日",
    readTime: "2分",
    content: [
      {
        type: "paragraph" as const,
        text: "この記事の内容は現在準備中です。ご不明な点はお問い合わせください。",
      },
    ],
    related: [],
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-sm" aria-label="パンくずリスト">
        <Link href="/help" className="text-gray-500 hover:text-gray-700 transition-colors">
          ヘルプ
        </Link>
        <svg className="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
        <span className="text-gray-500">{article.category}</span>
        <svg className="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
        <span className="truncate text-gray-900 font-medium">{article.title}</span>
      </nav>

      {/* Article */}
      <article className="overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        {/* Meta */}
        <div className="mb-2 flex items-center gap-2 flex-wrap">
          <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-700">
            {article.category}
          </span>
        </div>

        <h1 className="mb-4 text-xl font-bold text-gray-900">{article.title}</h1>

        <div className="mb-6 flex items-center gap-4 text-xs text-gray-400 border-b border-gray-100 pb-4">
          <span>更新日: {article.updatedAt}</span>
          <span className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            約{article.readTime}で読めます
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-4">
          {article.content.map((block, index) => {
            if (block.type === "heading") {
              return (
                <h2 key={index} className="mt-2 text-base font-semibold text-gray-900">
                  {block.text}
                </h2>
              );
            }
            if (block.type === "paragraph") {
              return (
                <p key={index} className="text-sm leading-relaxed text-gray-600">
                  {block.text}
                </p>
              );
            }
            if (block.type === "list" && block.items) {
              return (
                <ul key={index} className="space-y-2 pl-1">
                  {block.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              );
            }
            if (block.type === "note") {
              return (
                <div key={index} className="flex gap-3 rounded-xl bg-amber-50 border border-amber-100 p-4">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                  <p className="text-sm text-amber-700">{block.text}</p>
                </div>
              );
            }
            return null;
          })}
        </div>
      </article>

      {/* Feedback */}
      <div className="mt-6 flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
        <p className="text-sm font-medium text-gray-900">この記事は役に立ちましたか？</p>
        <div className="mt-3 flex gap-3">
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <span aria-hidden="true">👍</span>
            役に立った
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <span aria-hidden="true">👎</span>
            役に立たなかった
          </button>
        </div>
      </div>

      {/* Related articles */}
      {article.related.length > 0 && (
        <div className="mt-6">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            関連記事
          </h2>
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            {article.related.map((rel, index) => (
              <Link
                key={rel.id}
                href={`/help/${rel.id}`}
                className={[
                  "flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors duration-150",
                  index > 0 ? "border-t border-gray-100" : "",
                ].join(" ")}
              >
                <svg className="h-4 w-4 text-violet-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                </svg>
                <span className="flex-1 text-sm text-gray-700">{rel.title}</span>
                <svg className="h-4 w-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Contact CTA */}
      <p className="mt-6 text-center text-sm text-gray-500">
        解決しませんでしたか？{" "}
        <Link href="/contact" className="font-medium text-violet-600 hover:text-violet-700 transition-colors">
          お問い合わせ
        </Link>
      </p>
    </div>
  );
}
