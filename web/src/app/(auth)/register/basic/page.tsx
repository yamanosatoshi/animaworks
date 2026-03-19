"use client";

import React from "react";
import Link from "next/link";
import { RegistrationStepper } from "@/components/register/RegistrationStepper";
import { useRegistration } from "@/context/RegistrationContext";

export default function RegisterBasicPage() {
  const { state, set } = useRegistration();

  return (
    <div className="flex w-full max-w-4xl overflow-hidden rounded-2xl bg-white/95 backdrop-blur-sm shadow-lg">
      {/* Left Panel */}
      <div className="flex w-[280px] shrink-0 flex-col bg-gray-900 p-8">
        {/* HiCrew Logo */}
        <div className="mb-12 flex flex-col items-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 border border-white/20">
            <span className="text-sm font-bold text-white">H</span>
          </div>
          <span className="mt-2 text-sm font-bold text-white">HiCrew</span>
        </div>

        {/* Stepper */}
        <RegistrationStepper currentStep={1} />
      </div>

      {/* Right Panel */}
      <div className="flex flex-1 flex-col p-8">
        <h1 className="text-2xl font-bold text-text-primary">基本情報登録</h1>
        <p className="mt-1 text-sm text-text-muted">
          アカウントの表示名やメールアドレスを管理します。
        </p>

        <form className="mt-6 flex flex-1 flex-col gap-5">
          {/* ユーザー名 */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="username"
              className="text-sm font-medium text-text-secondary"
            >
              ユーザー名
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Taro Yamada"
              value={state.username}
              onChange={(e) => set("username", e.target.value)}
              className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3.5 text-sm text-text-primary placeholder:text-gray-400 transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          {/* 組織名・チーム名 */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="orgName"
              className="text-sm font-medium text-text-secondary"
            >
              組織名・チーム名
            </label>
            <input
              id="orgName"
              name="orgName"
              type="text"
              placeholder="例）株式会社〇〇〇〇マーケティング部"
              value={state.orgName}
              onChange={(e) => set("orgName", e.target.value)}
              className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3.5 text-sm text-text-primary placeholder:text-gray-400 transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          {/* メール接続 */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-secondary">
              メール接続
            </label>
            <p className="text-xs text-gray-400">
              AIがメールの下書きや返信を行うための連携設定です。
            </p>

            {/* Google Workspace */}
            <div className="flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3">
              <svg
                className="h-5 w-5 shrink-0"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <div className="flex flex-1 flex-col">
                <span className="text-sm font-medium text-text-primary">
                  Google Workspace (Gmail)
                </span>
                {state.googleConnected ? (
                  <span className="text-xs font-medium text-green-600">
                    接続済み
                  </span>
                ) : (
                  <span className="text-xs text-gray-400">未接続</span>
                )}
              </div>
              {state.googleConnected ? (
                <button
                  type="button"
                  onClick={() => set("googleConnected", false)}
                  className="cursor-pointer text-xs text-gray-400 hover:text-gray-600"
                >
                  解除
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => set("googleConnected", true)}
                  className="cursor-pointer rounded-md border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  接続する
                </button>
              )}
            </div>

            {/* Microsoft 365 */}
            <div className="flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3">
              <svg
                className="h-5 w-5 shrink-0"
                viewBox="0 0 23 23"
                aria-hidden="true"
              >
                <path fill="#f35325" d="M1 1h10v10H1z" />
                <path fill="#81bc06" d="M12 1h10v10H12z" />
                <path fill="#05a6f0" d="M1 12h10v10H1z" />
                <path fill="#ffba08" d="M12 12h10v10H12z" />
              </svg>
              <div className="flex flex-1 flex-col">
                <span className="text-sm font-medium text-text-primary">
                  Microsoft 365 (Outlook)
                </span>
                {state.microsoftConnected ? (
                  <span className="text-xs font-medium text-green-600">
                    接続済み
                  </span>
                ) : (
                  <span className="text-xs text-gray-400">未接続</span>
                )}
              </div>
              {state.microsoftConnected ? (
                <button
                  type="button"
                  onClick={() => set("microsoftConnected", false)}
                  className="cursor-pointer text-xs text-gray-400 hover:text-gray-600"
                >
                  解除
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => set("microsoftConnected", true)}
                  className="cursor-pointer rounded-md border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  接続する
                </button>
              )}
            </div>
          </div>

          {/* 次へボタン */}
          <div className="mt-auto flex justify-end pt-4">
            <Link href="/register/plan">
              <button
                type="button"
                className="cursor-pointer rounded-lg bg-black px-8 h-11 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
              >
                次へ
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
