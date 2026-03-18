import React from "react";
import Link from "next/link";

export const metadata = {
  title: "プライバシーポリシー | HiCrew",
  description: "HiCrewのプライバシーポリシー",
};

interface PolicySection {
  id: string;
  title: string;
  content: (string | { subtitle: string; items: string[] })[];
}

const policySections: PolicySection[] = [
  {
    id: "policy-1",
    title: "1. 収集する情報",
    content: [
      "当社は、本サービスの提供にあたり、以下の情報を収集します：",
      {
        subtitle: "アカウント情報",
        items: [
          "氏名・表示名",
          "メールアドレス",
          "パスワード（ハッシュ化して保存）",
          "プロフィール画像",
        ],
      },
      {
        subtitle: "利用情報",
        items: [
          "サービスの利用履歴",
          "アクセスログ（IPアドレス・ブラウザ情報）",
          "利用端末の情報",
        ],
      },
    ],
  },
  {
    id: "policy-2",
    title: "2. 情報の利用目的",
    content: [
      "収集した情報は、以下の目的で利用します：",
      {
        subtitle: "",
        items: [
          "本サービスの提供・運営・改善",
          "利用者へのサポート対応",
          "サービスに関する重要なお知らせの送信",
          "不正利用の検知・防止",
          "統計情報の作成（個人を特定できない形式）",
        ],
      },
    ],
  },
  {
    id: "policy-3",
    title: "3. 情報の第三者提供",
    content: [
      "当社は、以下の場合を除き、収集した個人情報を第三者に提供しません：",
      {
        subtitle: "",
        items: [
          "利用者の同意がある場合",
          "法令に基づく場合",
          "人の生命・身体・財産の保護のために必要な場合",
          "公衆衛生の向上または児童の健全な育成の推進のために必要な場合",
        ],
      },
    ],
  },
  {
    id: "policy-4",
    title: "4. Cookie・トラッキング",
    content: [
      "当社は、本サービスの機能向上のためCookieを使用しています。Cookieはブラウザの設定から無効にできますが、一部機能が制限される場合があります。",
      "また、サービス改善のために匿名化された利用状況データを収集する場合があります。このデータ収集は設定ページからオフにすることができます。",
    ],
  },
  {
    id: "policy-5",
    title: "5. 情報の管理・セキュリティ",
    content: [
      "当社は、収集した個人情報の漏洩・滅失・毀損を防止するため、適切なセキュリティ対策を実施しています。",
      {
        subtitle: "実施している主なセキュリティ対策",
        items: [
          "通信の暗号化（SSL/TLS）",
          "パスワードのハッシュ化保存",
          "定期的なセキュリティ監査",
          "アクセス権限の最小化",
        ],
      },
    ],
  },
  {
    id: "policy-6",
    title: "6. 利用者の権利",
    content: [
      "利用者は、以下の権利を有します：",
      {
        subtitle: "",
        items: [
          "保存されている個人情報の開示請求",
          "個人情報の訂正・削除の請求",
          "個人情報の利用停止の請求",
          "データのエクスポート（ポータビリティ）",
        ],
      },
      "これらの権利を行使する場合は、設定ページまたはお問い合わせよりご連絡ください。",
    ],
  },
  {
    id: "policy-7",
    title: "7. プライバシーポリシーの変更",
    content: [
      "当社は、必要に応じてプライバシーポリシーを変更することがあります。重要な変更がある場合は、本サービス内またはメールにてお知らせします。",
      "変更後も本サービスを利用し続けることで、変更後のポリシーに同意したものとみなされます。",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">プライバシーポリシー</h1>
        <p className="mt-1 text-sm text-gray-500">最終更新日: 2024年3月1日</p>
      </div>

      {/* Intro */}
      <div className="mb-8 rounded-2xl bg-violet-50 border border-violet-100 p-5">
        <p className="text-sm leading-relaxed text-violet-800">
          HiCrew（以下「当社」）は、利用者の個人情報の保護を重要視しています。本プライバシーポリシーは、当社が収集・利用・管理する個人情報の取り扱いについて説明します。
        </p>
      </div>

      {/* Table of contents */}
      <nav
        className="mb-8 overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
        aria-label="目次"
      >
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">目次</p>
        <ol className="flex flex-col gap-1.5">
          {policySections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="text-sm text-violet-600 hover:text-violet-700 hover:underline transition-colors"
              >
                {section.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* Content */}
      <div className="flex flex-col gap-8">
        {policySections.map((section) => (
          <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`}>
            <h2
              id={`${section.id}-title`}
              className="mb-3 text-base font-bold text-gray-900 scroll-mt-6"
            >
              {section.title}
            </h2>
            <div className="flex flex-col gap-3">
              {section.content.map((block, index) => {
                if (typeof block === "string") {
                  return (
                    <p key={index} className="text-sm leading-relaxed text-gray-600">
                      {block}
                    </p>
                  );
                }
                return (
                  <div key={index}>
                    {block.subtitle && (
                      <p className="mb-2 text-sm font-medium text-gray-700">{block.subtitle}</p>
                    )}
                    <ul className="flex flex-col gap-1.5 pl-1">
                      {block.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-12 border-t border-gray-200 pt-6">
        <div className="flex flex-col gap-2 text-center">
          <p className="text-xs text-gray-500">
            個人情報の取り扱いに関するお問い合わせ先
          </p>
          <p className="text-xs text-gray-400">HiCrew 個人情報取扱窓口</p>
          <Link
            href="/contact"
            className="mx-auto mt-2 text-sm text-violet-600 hover:text-violet-700 underline"
          >
            お問い合わせフォームはこちら
          </Link>
        </div>
      </div>
    </div>
  );
}
