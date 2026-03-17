import React from "react";
import Link from "next/link";

export const metadata = {
  title: "設定 | KON",
  description: "アカウント設定を管理します",
};

interface SettingSection {
  title: string;
  items: SettingItem[];
}

interface SettingItem {
  label: string;
  description: string;
  href: string;
  badge?: string;
  icon: React.ReactNode;
}

const AccountIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const LockIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

const BellIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
  </svg>
);

const CreditCardIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);

const LanguageIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
  </svg>
);

const settingSections: SettingSection[] = [
  {
    title: "アカウント",
    items: [
      {
        label: "プロフィール設定",
        description: "名前・アバター・自己紹介を編集",
        href: "/mypage/edit",
        icon: <AccountIcon />,
      },
      {
        label: "セキュリティ",
        description: "パスワード・2段階認証を管理",
        href: "/settings/security",
        icon: <LockIcon />,
      },
    ],
  },
  {
    title: "通知・プライバシー",
    items: [
      {
        label: "通知設定",
        description: "メール・プッシュ通知の管理",
        href: "/settings/notifications",
        badge: "3",
        icon: <BellIcon />,
      },
      {
        label: "プライバシー設定",
        description: "データの取り扱いとプライバシー",
        href: "/settings/privacy",
        icon: <ShieldIcon />,
      },
    ],
  },
  {
    title: "プランと支払い",
    items: [
      {
        label: "プラン管理",
        description: "現在のプランを確認・変更",
        href: "/settings/plan",
        badge: "フリー",
        icon: <CreditCardIcon />,
      },
    ],
  },
  {
    title: "表示・言語",
    items: [
      {
        label: "言語設定",
        description: "表示言語を変更",
        href: "/settings/language",
        icon: <LanguageIcon />,
      },
    ],
  },
];

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">設定</h1>
        <p className="mt-1 text-sm text-gray-500">
          アカウントの設定を管理してください
        </p>
      </div>

      <div className="flex flex-col gap-8">
        {settingSections.map((section) => (
          <section key={section.title} aria-labelledby={`section-${section.title}`}>
            <h2
              id={`section-${section.title}`}
              className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500"
            >
              {section.title}
            </h2>
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              {section.items.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors duration-150",
                    index > 0 ? "border-t border-gray-100" : "",
                  ].join(" ")}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{item.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{item.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700">
                        {item.badge}
                      </span>
                    )}
                    <svg
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}

        {/* Danger zone */}
        <section aria-labelledby="danger-zone">
          <h2
            id="danger-zone"
            className="mb-3 text-xs font-semibold uppercase tracking-wider text-red-500"
          >
            危険な操作
          </h2>
          <div className="overflow-hidden rounded-2xl border border-red-100 bg-white shadow-sm">
            <button
              type="button"
              className="flex w-full items-center gap-4 px-5 py-4 hover:bg-red-50 transition-colors duration-150 text-left cursor-pointer"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-red-600">アカウントを削除</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  すべてのデータが削除されます（取り消し不可）
                </p>
              </div>
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </section>

        {/* Version */}
        <p className="text-center text-xs text-gray-400">KON v1.0.0</p>
      </div>
    </div>
  );
}
