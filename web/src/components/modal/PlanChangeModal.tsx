"use client";

import React, { useEffect, useCallback } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type PlanId = "basic" | "pro" | "enterprise";

interface PlanChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: PlanId;
}

interface Plan {
  id: PlanId;
  name: string;
  price: string;
  priceNote: string;
  description: string;
  features: string[];
  recommended: boolean;
  badge?: string;
}

// ---------------------------------------------------------------------------
// Plan data
// ---------------------------------------------------------------------------

const plans: Plan[] = [
  {
    id: "basic",
    name: "Basic",
    price: "¥0",
    priceNote: "/ 月（無料）",
    description: "個人での試用に最適",
    features: [
      "月5回までの利用",
      "基本機能すべて利用可",
      "1GBストレージ",
      "メールサポート",
    ],
    recommended: false,
  },
  {
    id: "pro",
    name: "Pro",
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
    recommended: true,
    badge: "おすすめ",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "¥9,800",
    priceNote: "/ 月（税込）",
    description: "チーム・企業向けの高機能プラン",
    features: [
      "無制限の利用",
      "全機能 + 優先新機能",
      "無制限ストレージ",
      "電話・チャットサポート",
      "チームメンバー管理",
      "SSO対応",
    ],
    recommended: false,
  },
];

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

const CloseIcon: React.FC = () => (
  <svg
    width="20"
    height="20"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.5 12.75l6 6 9-13.5"
    />
  </svg>
);

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const PlanChangeModal: React.FC<PlanChangeModalProps> = ({
  isOpen,
  onClose,
  currentPlan,
}) => {
  // Esc key handler
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // Prevent body scroll while modal is open
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="プラン変更"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div className="relative z-10 w-full max-w-3xl rounded-2xl border border-white/[0.08] bg-[#12121e] p-6 shadow-2xl sm:p-8">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">プランを変更</h2>
            <p className="mt-1 text-sm text-[#8a8aa0]">
              いつでもアップグレード・ダウングレードできます
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8a8aa0] transition-colors hover:bg-white/10 hover:text-white"
            aria-label="閉じる"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {plans.map((plan) => {
            const isCurrent = plan.id === currentPlan;
            const isRecommended = plan.recommended;

            return (
              <div
                key={plan.id}
                className={[
                  "relative flex flex-col rounded-xl border-2 p-5 transition-all duration-200",
                  isCurrent
                    ? "border-[#4a9eff] bg-[#4a9eff]/[0.06] shadow-[0_0_20px_rgba(74,158,255,0.1)]"
                    : isRecommended
                      ? "border-[#7c5cfc]/40 bg-[#7c5cfc]/[0.04] hover:border-[#7c5cfc]/60"
                      : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]",
                ].join(" ")}
              >
                {/* Badge: current plan or recommended */}
                {isCurrent && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#4a9eff] px-3 py-0.5 text-xs font-semibold text-white">
                    現在のプラン
                  </span>
                )}
                {!isCurrent && isRecommended && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-[#4a9eff] to-[#7c5cfc] px-3 py-0.5 text-xs font-semibold text-white">
                    {plan.badge}
                  </span>
                )}

                {/* Plan name & description */}
                <div className="mb-3">
                  <p
                    className={[
                      "text-base font-bold",
                      isCurrent ? "text-[#4a9eff]" : "text-white",
                    ].join(" ")}
                  >
                    {plan.name}
                  </p>
                  <p className="mt-0.5 text-xs text-[#8a8aa0]">
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <span
                    className={[
                      "text-2xl font-bold",
                      isCurrent ? "text-[#4a9eff]" : "text-white",
                    ].join(" ")}
                  >
                    {plan.price}
                  </span>
                  <span className="text-xs text-[#8a8aa0]">
                    {" "}
                    {plan.priceNote}
                  </span>
                </div>

                {/* Feature list */}
                <ul className="mb-5 flex flex-1 flex-col gap-1.5 text-xs text-[#8a8aa0]">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-1.5">
                      <CheckIcon
                        className={[
                          "mt-0.5 h-3.5 w-3.5 shrink-0",
                          isCurrent ? "text-[#4a9eff]" : "text-[#7c5cfc]",
                        ].join(" ")}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Action button */}
                {isCurrent ? (
                  <button
                    type="button"
                    disabled
                    className="w-full cursor-default rounded-lg border border-[#4a9eff]/30 bg-[#4a9eff]/10 px-4 py-2.5 text-sm font-medium text-[#4a9eff]"
                  >
                    利用中
                  </button>
                ) : (
                  <button
                    type="button"
                    className={[
                      "w-full cursor-pointer rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200",
                      isRecommended
                        ? "bg-gradient-to-r from-[#4a9eff] to-[#7c5cfc] text-white shadow-lg shadow-[#4a9eff]/20 hover:shadow-[#4a9eff]/30 hover:brightness-110"
                        : "border border-white/[0.1] bg-white/[0.04] text-white hover:bg-white/[0.08]",
                    ].join(" ")}
                  >
                    このプランに変更
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
