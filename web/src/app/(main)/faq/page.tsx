"use client";

import React, { useState } from "react";
import Link from "next/link";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface FaqCategory {
  id: string;
  label: string;
  items: FaqItem[];
}

const faqCategories: FaqCategory[] = [
  {
    id: "account",
    label: "アカウント・ログイン",
    items: [
      {
        id: "a1",
        question: "アカウントの作成方法を教えてください",
        answer:
          "HiCrewのトップページから「無料で始める」をクリックし、メールアドレスまたはGoogleアカウントで登録できます。登録後、確認メールが届きますのでリンクをクリックして有効化してください。",
      },
      {
        id: "a2",
        question: "パスワードを忘れてしまいました",
        answer:
          "ログインページの「パスワードを忘れた場合」をクリックし、登録メールアドレスを入力してください。リセット用のメールを送信します。メールが届かない場合は迷惑メールフォルダをご確認ください。",
      },
      {
        id: "a3",
        question: "メールアドレスを変更したい",
        answer:
          "設定 → プロフィール設定からメールアドレスを変更できます。変更後、新しいメールアドレスへ確認メールが送信されます。確認メール内のリンクをクリックすると変更が反映されます。",
      },
    ],
  },
  {
    id: "billing",
    label: "プラン・料金",
    items: [
      {
        id: "b1",
        question: "無料プランでどこまで使えますか？",
        answer:
          "フリープランでは月5回までの利用、基本機能の利用、1GBのストレージが含まれています。より多く使いたい場合はスタンダードプラン（¥2,980/月）へのアップグレードをご検討ください。",
      },
      {
        id: "b2",
        question: "プランはいつでも変更できますか？",
        answer:
          "はい、いつでもアップグレード・ダウングレードが可能です。アップグレードは即時反映されます。ダウングレードは現在の請求サイクルの終了時に反映されます。",
      },
      {
        id: "b3",
        question: "解約はどうすればできますか？",
        answer:
          "設定 → プラン管理から解約手続きを行えます。解約後も現在の請求期間が終了するまでは引き続きご利用いただけます。",
      },
    ],
  },
  {
    id: "usage",
    label: "使い方・機能",
    items: [
      {
        id: "u1",
        question: "データはどのように保存されますか？",
        answer:
          "すべてのデータはSSL/TLS暗号化された状態でHiCrewのサーバーに安全に保存されます。データはいつでも設定 → プライバシー設定からエクスポートできます。",
      },
      {
        id: "u2",
        question: "スマートフォンからも使えますか？",
        answer:
          "HiCrewはモバイルブラウザに対応したレスポンシブデザインを採用しています。iOS/Androidのブラウザから快適にご利用いただけます。専用アプリは現在開発中です。",
      },
      {
        id: "u3",
        question: "複数のデバイスで使用できますか？",
        answer:
          "はい、同一アカウントで複数のデバイスから同時にログインできます。設定 → セキュリティ設定でログイン中のセッションを確認・管理できます。",
      },
    ],
  },
  {
    id: "security",
    label: "セキュリティ",
    items: [
      {
        id: "s1",
        question: "2段階認証は設定できますか？",
        answer:
          "設定 → セキュリティ設定から2段階認証を設定できます。Google AuthenticatorなどのTOTPアプリに対応しています。セキュリティ強化のため、設定を推奨しています。",
      },
      {
        id: "s2",
        question: "不審なログインがあった場合は？",
        answer:
          "不審なアクセスがあった場合、登録メールアドレスへ通知します。設定 → セキュリティ設定でログイン中のセッションを確認し、心当たりのないセッションは削除してください。",
      },
    ],
  },
];

function AccordionItem({ item }: { item: FaqItem }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
      >
        <span className="text-sm font-medium text-gray-900">{item.question}</span>
        <svg
          className={[
            "mt-0.5 h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200",
            open ? "rotate-180" : "",
          ].join(" ")}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {open && (
        <div className="px-5 pb-4">
          <p className="text-sm leading-relaxed text-gray-600">{item.answer}</p>
        </div>
      )}
    </div>
  );
}

export default function FaqPage() {
  const [activeCategory, setActiveCategory] = useState("account");

  const activeItems = faqCategories.find((c) => c.id === activeCategory)?.items ?? [];

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Link href="/help" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
            ヘルプ
          </Link>
          <svg className="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
          <span className="text-sm text-gray-900 font-medium">よくある質問</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">よくある質問（FAQ）</h1>
        <p className="mt-1 text-sm text-gray-500">お困りのことを検索して解決策を見つけてください</p>
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
          aria-label="FAQを検索"
        />
      </div>

      {/* Category tabs */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-1" role="tablist">
        {faqCategories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            role="tab"
            aria-selected={activeCategory === cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={[
              "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-150 cursor-pointer",
              activeCategory === cat.id
                ? "bg-violet-600 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50",
            ].join(" ")}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* FAQ accordion */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {activeItems.map((item) => (
          <AccordionItem key={item.id} item={item} />
        ))}
      </div>

      {/* Contact CTA */}
      <div className="mt-8 rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-600 p-6 text-white">
        <h2 className="text-base font-semibold">お探しの答えが見つかりませんでしたか？</h2>
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
