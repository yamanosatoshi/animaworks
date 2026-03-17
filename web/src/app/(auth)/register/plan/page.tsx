import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export const metadata = {
  title: "プラン選択 | KON",
  description: "ご利用プランをお選びください",
};

interface Plan {
  id: string;
  name: string;
  price: string;
  priceNote: string;
  description: string;
  features: string[];
  highlighted: boolean;
  badge?: string;
}

const plans: Plan[] = [
  {
    id: "free",
    name: "フリー",
    price: "¥0",
    priceNote: "/ 月（無料）",
    description: "個人での試用に最適",
    features: [
      "月5回までの利用",
      "基本機能すべて利用可",
      "1GBストレージ",
      "メールサポート",
    ],
    highlighted: false,
  },
  {
    id: "standard",
    name: "スタンダード",
    price: "¥2,980",
    priceNote: "/ 月（税込）",
    description: "個人・小チームの本格利用に",
    features: [
      "無制限の利用",
      "全機能利用可",
      "20GBストレージ",
      "優先メールサポート",
      "データエクスポート",
    ],
    highlighted: true,
    badge: "人気",
  },
  {
    id: "pro",
    name: "プロ",
    price: "¥9,800",
    priceNote: "/ 月（税込）",
    description: "チーム・企業向けの高機能プラン",
    features: [
      "無制限の利用",
      "全機能 + 優先新機能",
      "無制限ストレージ",
      "電話・チャットサポート",
      "データエクスポート",
      "チームメンバー管理",
      "SSO対応",
    ],
    highlighted: false,
  },
];

export default function RegisterPlanPage() {
  return (
    <div className="w-full max-w-2xl">
      {/* Progress */}
      <div className="mb-6 flex items-center gap-2">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center gap-2">
            <div
              className={[
                "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold",
                step === 1
                  ? "bg-violet-300 text-white"
                  : step === 2
                  ? "bg-violet-600 text-white"
                  : "bg-gray-100 text-gray-400",
              ].join(" ")}
            >
              {step === 1 ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              ) : (
                step
              )}
            </div>
            {step < 3 && (
              <div
                className={[
                  "h-0.5 w-10 rounded-full",
                  step === 1 ? "bg-violet-400" : "bg-gray-200",
                ].join(" ")}
              />
            )}
          </div>
        ))}
        <span className="ml-2 text-xs text-gray-500">プラン選択</span>
      </div>

      <Card padding="lg" className="shadow-xl">
        <h1 className="mb-1 text-xl font-bold text-gray-900">プランを選択</h1>
        <p className="mb-6 text-sm text-gray-500">
          いつでもアップグレード・ダウングレードできます
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {plans.map((plan) => (
            <label
              key={plan.id}
              className={[
                "relative flex cursor-pointer flex-col rounded-2xl border-2 p-5 transition-all duration-150",
                plan.highlighted
                  ? "border-violet-500 bg-violet-50 shadow-md"
                  : "border-gray-200 bg-white hover:border-violet-300",
              ].join(" ")}
            >
              {/* Recommended badge */}
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-violet-600 px-3 py-0.5 text-xs font-semibold text-white">
                  {plan.badge}
                </span>
              )}

              {/* Radio */}
              <input
                type="radio"
                name="plan"
                value={plan.id}
                defaultChecked={plan.highlighted}
                className="sr-only"
              />

              <div className="mb-3">
                <p className={[
                  "text-base font-bold",
                  plan.highlighted ? "text-violet-700" : "text-gray-900",
                ].join(" ")}>
                  {plan.name}
                </p>
                <p className="mt-0.5 text-xs text-gray-500">{plan.description}</p>
              </div>

              <div className="mb-4">
                <span className={[
                  "text-2xl font-bold",
                  plan.highlighted ? "text-violet-700" : "text-gray-900",
                ].join(" ")}>
                  {plan.price}
                </span>
                <span className="text-xs text-gray-500"> {plan.priceNote}</span>
              </div>

              <ul className="flex flex-col gap-1.5 text-xs text-gray-600">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-1.5">
                    <svg
                      className={[
                        "mt-0.5 h-3.5 w-3.5 shrink-0",
                        plan.highlighted ? "text-violet-500" : "text-green-500",
                      ].join(" ")}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Selection indicator */}
              {plan.highlighted && (
                <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-violet-600">
                  <div className="h-3 w-3 rounded-full bg-violet-600" />
                  選択中
                </div>
              )}
            </label>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <Link href="/register/confirm">
            <Button variant="primary" size="lg" fullWidth>
              このプランで続ける
            </Button>
          </Link>
          <Link href="/register/profile">
            <Button variant="ghost" size="md" fullWidth>
              戻る
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
