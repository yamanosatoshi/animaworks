"use client";

import React, { useState } from "react";
import Link from "next/link";
import { RegistrationStepper } from "@/components/register/RegistrationStepper";

interface Plan {
  id: string;
  name: string;
  price: string;
  credit: string;
  crewCount: string;
  crewIcon: React.ReactNode;
  description: string;
  popular?: boolean;
}

const PersonIcon = () => (
  <svg
    className="h-4 w-4 text-text-disabled"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
    />
  </svg>
);

const PeopleIcon = () => (
  <svg
    className="h-4 w-4 text-text-disabled"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
    />
  </svg>
);

const BuildingIcon = () => (
  <svg
    className="h-4 w-4 text-text-disabled"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
    />
  </svg>
);

const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: "¥9,800",
    credit: "5,000",
    crewCount: "1名",
    crewIcon: <PersonIcon />,
    description: "優秀なリーダーが1人いればいい。",
  },
  {
    id: "team",
    name: "Team",
    price: "¥29,800",
    credit: "20,000",
    crewCount: "3名",
    crewIcon: <PeopleIcon />,
    description: "複数人のAIによる連携プレイを実現。",
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "¥98,000",
    credit: "50,000",
    crewCount: "5名",
    crewIcon: <BuildingIcon />,
    description: "部門まるごとAI化。専用モデル提供。",
  },
];

export default function RegisterPlanPage() {
  const [selectedPlan, setSelectedPlan] = useState("team");

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
        <RegistrationStepper currentStep={2} />
      </div>

      {/* Right Panel */}
      <div className="flex flex-1 flex-col p-8">
        <h1 className="text-2xl font-bold text-text-primary">プラン選択</h1>
        <p className="mt-1 text-sm text-text-muted">
          チーム規模や必要なクレジットに合わせてプランを選びましょう。
        </p>

        {/* Plan Cards */}
        <div className="mt-6 flex flex-col gap-3">
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            return (
              <label
                key={plan.id}
                className={[
                  "relative flex cursor-pointer items-center gap-4 rounded-xl border-2 px-5 py-4 transition-all",
                  isSelected
                    ? "border-accent bg-white"
                    : "border-border-default bg-white hover:border-border-strong",
                ].join(" ")}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <span className="absolute -top-3 left-4 rounded-full bg-accent px-3 py-0.5 text-xs font-semibold text-white">
                    人気！
                  </span>
                )}

                {/* Radio */}
                <input
                  type="radio"
                  name="plan"
                  value={plan.id}
                  checked={isSelected}
                  onChange={() => setSelectedPlan(plan.id)}
                  className="h-4 w-4 shrink-0 accent-accent"
                />

                {/* Plan name */}
                <span className="w-24 shrink-0 text-base font-bold text-text-primary">
                  {plan.name}
                </span>

                {/* Price & description */}
                <div className="flex flex-1 flex-col">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-bold text-text-primary">
                      {plan.price}
                    </span>
                    <span className="text-sm text-text-disabled">
                      {plan.credit} クレジット
                    </span>
                  </div>
                  <span className="text-xs text-text-disabled">
                    {plan.description}
                  </span>
                </div>

                {/* Crew count */}
                <div className="flex shrink-0 flex-col items-end gap-0.5">
                  <span className="text-xs text-text-disabled">クルー数</span>
                  <div className="flex items-center gap-1">
                    {plan.crewIcon}
                    <span className="text-sm font-bold text-text-primary">
                      {plan.crewCount}
                    </span>
                  </div>
                </div>
              </label>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="mt-auto flex justify-end gap-3 pt-6">
          <Link href="/register/basic">
            <button
              type="button"
              className="cursor-pointer rounded-lg border border-border-strong bg-white px-6 h-11 text-sm font-medium text-text-secondary transition-colors hover:bg-gray-50"
            >
              戻る
            </button>
          </Link>
          <Link href="/register/member">
            <button
              type="button"
              className="cursor-pointer rounded-lg bg-black px-8 h-11 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
            >
              次へ
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
