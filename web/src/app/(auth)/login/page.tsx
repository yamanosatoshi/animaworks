"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "ログインに失敗しました");
        return;
      }

      // Store token
      if (data.token) {
        localStorage.setItem("hicrew_token", data.token);
      }

      // Redirect to chat
      router.push("/chat");
    } catch {
      setError("ネットワークエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl bg-white/90 backdrop-blur-sm px-10 py-12 shadow-lg">
      {/* Logo */}
      <div className="flex flex-col items-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black">
          <span className="text-xl font-bold text-white">H</span>
        </div>
        <span className="mt-2 text-sm font-bold text-text-primary tracking-wide">
          HiCrew
        </span>
      </div>

      {/* Heading */}
      <h1 className="mt-8 text-center text-xl font-bold text-text-primary">
        Hi! はじめましょう！
      </h1>
      <p className="mt-2 text-center text-sm text-text-muted">
        AIチームがあなたの業務を効率化しています。
      </p>

      {/* SSO Buttons */}
      <div className="mt-8 flex flex-col gap-3">
        {/* Google */}
        <button
          type="button"
          className="flex h-12 w-full items-center justify-center gap-3 rounded-lg border border-border-default bg-white text-sm font-medium text-text-primary transition-colors duration-150 hover:bg-gray-50 cursor-pointer"
          aria-label="Googleでログイン"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
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
          Googleでログイン
        </button>

        {/* Microsoft 365 */}
        <button
          type="button"
          className="flex h-12 w-full items-center justify-center gap-3 rounded-lg border border-border-default bg-white text-sm font-medium text-text-primary transition-colors duration-150 hover:bg-gray-50 cursor-pointer"
          aria-label="Microsoft 365でログイン"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
            <rect x="1" y="1" width="10" height="10" fill="#F25022" />
            <rect x="13" y="1" width="10" height="10" fill="#7FBA00" />
            <rect x="1" y="13" width="10" height="10" fill="#00A4EF" />
            <rect x="13" y="13" width="10" height="10" fill="#FFB900" />
          </svg>
          Microsoft 365でログイン
        </button>
      </div>

      {/* Divider */}
      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-xs text-text-muted">または</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      {/* Email/Password form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-text-secondary">
            メールアドレス
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3.5 text-sm text-text-primary placeholder:text-gray-400 transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium text-text-secondary">
              パスワード
            </label>
            <Link
              href="/reset-password"
              className="text-xs text-accent hover:text-accent/80 transition-colors"
            >
              パスワードを忘れた方
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="パスワードを入力"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3.5 text-sm text-text-primary placeholder:text-gray-400 transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex h-12 w-full items-center justify-center rounded-lg bg-black text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? "ログイン中..." : "ログイン"}
        </button>
      </form>

      {/* Sign up link */}
      <p className="mt-6 text-center text-sm text-text-muted">
        アカウントをお持ちでない方は{" "}
        <Link href="/register" className="font-medium text-accent hover:text-accent/80 transition-colors">
          新規登録
        </Link>
      </p>
    </div>
  );
}
