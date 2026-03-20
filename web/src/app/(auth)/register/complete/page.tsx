"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { RegistrationStepper } from "@/components/register/RegistrationStepper";
import { useRegistration, PLAN_META } from "@/context/RegistrationContext";

export default function RegisterCompletePage() {
  const { state, reset } = useRegistration();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const calledRef = useRef(false);

  // Call register API once on mount
  useEffect(() => {
    if (calledRef.current) return;
    if (!state.email || !state.password) {
      // No credentials — skip API call (user may have navigated here directly)
      setStatus("success");
      return;
    }
    calledRef.current = true;
    setStatus("loading");

    fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: state.email,
        password: state.password,
        name: state.username || "User",
        plan: state.selectedPlan,
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error ?? "Registration failed");
        }
        // Store token for subsequent authenticated requests
        if (data.token) {
          localStorage.setItem("hicrew_token", data.token);
        }
        setStatus("success");
      })
      .catch((err: Error) => {
        setErrorMsg(err.message);
        setStatus("error");
      });
  }, [state.email, state.password, state.username, state.selectedPlan]);

  return (
    <div className="w-full max-w-md">
      {/* Stepper */}
      <div className="mb-8">
        <RegistrationStepper currentStep={5} />
      </div>

      {/* Card */}
      <div className="rounded-xl border border-white/[0.06] bg-[#12121e] p-6 sm:p-8 text-center">
        {status === "loading" && (
          <div className="flex flex-col items-center py-8">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#4a9eff]/30 border-t-[#4a9eff]" />
            <p className="mt-4 text-sm text-[#8a8aa0]">アカウントを作成しています...</p>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center py-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 mb-4">
              <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-white">登録に失敗しました</h1>
            <p className="mt-2 text-sm text-red-400">{errorMsg}</p>
            <Link href="/register/basic">
              <button
                type="button"
                className="mt-6 cursor-pointer rounded-lg border border-white/[0.06] bg-transparent px-6 py-2.5 text-sm font-medium text-[#8a8aa0] transition-all duration-200 hover:border-white/[0.12] hover:text-white"
              >
                入力画面に戻る
              </button>
            </Link>
          </div>
        )}

        {status === "success" && (
          <>
            {/* Success illustration */}
            <div className="mb-6 flex flex-col items-center">
              <div className="relative mb-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#4a9eff]/10">
                  <svg
                    className="h-10 w-10 text-[#4a9eff]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-r from-[#4a9eff] to-[#7c5cfc]">
                  <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>
              </div>

              <h1 className="text-2xl font-bold text-white">設定が完了しました！</h1>
              <p className="mt-3 text-sm text-[#8a8aa0] leading-relaxed">
                HiCrewへようこそ。
                <br />
                すべての設定が完了しました。
                <br />
                ダッシュボードからサービスをご利用いただけます。
              </p>
            </div>

            {/* Summary */}
            <div className="mb-6 rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 text-left">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#8a8aa0]">
                登録情報
              </h2>
              <div className="flex flex-col gap-2">
                {[
                  { label: "お名前", value: state.username || "—", highlight: false },
                  { label: "プラン", value: `${PLAN_META[state.selectedPlan]?.name ?? "Team"} プラン`, highlight: true },
                  { label: "チーム", value: state.teamName || "—", highlight: false },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between">
                    <span className="text-sm text-[#8a8aa0]">{item.label}</span>
                    <span className={[
                      "text-sm font-medium",
                      item.highlight ? "text-[#4a9eff]" : "text-white",
                    ].join(" ")}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-3">
              <Link href="/chat">
                <button
                  type="button"
                  onClick={reset}
                  className="w-full cursor-pointer rounded-lg bg-gradient-to-r from-[#4a9eff] to-[#7c5cfc] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#4a9eff]/20 transition-all duration-200 hover:shadow-[#4a9eff]/30 hover:brightness-110"
                >
                  チャットへ進む
                </button>
              </Link>
              <Link href="/login">
                <button
                  type="button"
                  className="w-full cursor-pointer rounded-lg border border-white/[0.06] bg-transparent px-6 py-2.5 text-sm font-medium text-[#8a8aa0] transition-all duration-200 hover:border-white/[0.12] hover:text-white"
                >
                  ログイン画面へ
                </button>
              </Link>
            </div>
          </>
        )}

        {status === "idle" && null}
      </div>
    </div>
  );
}
