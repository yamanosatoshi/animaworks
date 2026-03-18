"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/* ─── Icons ─── */

const UserIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const CogIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);

const CreditCardIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
  </svg>
);

/* ─── Nav items ─── */

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { href: "/mypage/profile", label: "プロフィール", icon: <UserIcon /> },
  { href: "/mypage/settings", label: "サービス設定", icon: <CogIcon /> },
  { href: "/mypage/privacy", label: "プライバシー", icon: <ShieldIcon /> },
  { href: "/mypage/billing", label: "支払い管理", icon: <CreditCardIcon /> },
];

/* ─── Shell ─── */

interface MypageSettingsShellProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

export function MypageSettingsShell({
  children,
  title,
  description,
}: MypageSettingsShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-full bg-[#0a0a14]">
      <div className="mx-auto flex max-w-5xl gap-8 px-6 py-8">
        {/* ── Desktop sidebar ── */}
        <aside className="hidden w-56 shrink-0 lg:block" aria-label="マイページナビゲーション">
          <nav className="sticky top-8 flex flex-col gap-1">
            <h2 className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-[#8a8aa0]">
              マイページ設定
            </h2>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={[
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-150",
                    isActive
                      ? "bg-[#4a9eff]/10 text-[#4a9eff]"
                      : "text-[#8a8aa0] hover:bg-white/5 hover:text-white",
                  ].join(" ")}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* ── Content area ── */}
        <div className="min-w-0 flex-1">
          {/* Mobile tab nav */}
          <div className="mb-6 flex gap-2 overflow-x-auto pb-1 lg:hidden" role="tablist" aria-label="マイページナビゲーション">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  role="tab"
                  aria-selected={isActive}
                  className={[
                    "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-150",
                    isActive
                      ? "bg-[#4a9eff] text-white"
                      : "bg-[#12121e] text-[#8a8aa0] hover:text-white",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            <p className="mt-1 text-sm text-[#8a8aa0]">{description}</p>
          </div>

          {/* Page body */}
          {children}
        </div>
      </div>
    </div>
  );
}
