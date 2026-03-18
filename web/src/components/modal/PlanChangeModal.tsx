"use client";

import React, { useState, useEffect, useCallback } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Plan {
  id: string;
  name: string;
  price: number;
  priceLabel?: string;
  description?: string;
  badge?: string;
  features: string[];
}

interface PlanChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (plan: Plan) => void;
  plans: Plan[];
  currentPlanId: string;
}

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

const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatPrice(price: number): string {
  if (price === 0) return "¥0";
  return `¥${price.toLocaleString("ja-JP")}`;
}

// ---------------------------------------------------------------------------
// Inner content (mounts/unmounts with modal — state resets naturally)
// ---------------------------------------------------------------------------

const PlanChangeModalContent: React.FC<
  Omit<PlanChangeModalProps, "isOpen">
> = ({ onClose, onConfirm, plans, currentPlanId }) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>(currentPlanId);

  // ESC key handler
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose],
  );

  // Keyboard listener + body scroll lock
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  const isUnchanged = selectedPlanId === currentPlanId;
  const selectedPlan = plans.find((p) => p.id === selectedPlanId);

  const handleConfirm = () => {
    if (selectedPlan && !isUnchanged) {
      onConfirm(selectedPlan);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-[fadeIn_200ms_ease-out]"
      role="dialog"
      aria-modal="true"
      aria-label="プラン変更"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div className="relative z-10 w-full max-w-3xl rounded-2xl border border-gray-200 bg-white p-6 shadow-xl sm:p-8 animate-[slideUp_250ms_ease-out]">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">プランを変更</h2>
            <p className="mt-1 text-sm text-gray-500">
              いつでもアップグレード・ダウングレードできます
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 cursor-pointer"
            aria-label="閉じる"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {plans.map((plan) => {
            const isCurrent = plan.id === currentPlanId;
            const isSelected = plan.id === selectedPlanId;

            return (
              <button
                key={plan.id}
                type="button"
                onClick={() => setSelectedPlanId(plan.id)}
                className={[
                  "relative flex flex-col rounded-xl border-2 p-5 text-left transition-all duration-200 cursor-pointer",
                  isSelected
                    ? "border-violet-600 bg-violet-50 shadow-md shadow-violet-100"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm",
                ].join(" ")}
              >
                {/* Selected check icon */}
                {isSelected && (
                  <CheckCircleIcon className="absolute top-3 right-3 h-5 w-5 text-violet-600" />
                )}

                {/* Badge: current plan or custom */}
                {isCurrent && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-violet-600 px-3 py-0.5 text-xs font-semibold text-white">
                    現在のプラン
                  </span>
                )}
                {!isCurrent && plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-violet-500 to-purple-500 px-3 py-0.5 text-xs font-semibold text-white">
                    {plan.badge}
                  </span>
                )}

                {/* Plan name & description */}
                <div className="mb-3">
                  <p
                    className={[
                      "text-base font-bold",
                      isSelected ? "text-violet-700" : "text-gray-900",
                    ].join(" ")}
                  >
                    {plan.name}
                  </p>
                  {plan.description && (
                    <p className="mt-0.5 text-xs text-gray-500">
                      {plan.description}
                    </p>
                  )}
                </div>

                {/* Price */}
                <div className="mb-4">
                  <span
                    className={[
                      "text-2xl font-bold",
                      isSelected ? "text-violet-700" : "text-gray-900",
                    ].join(" ")}
                  >
                    {plan.priceLabel ?? formatPrice(plan.price)}
                  </span>
                  <span className="text-xs text-gray-400"> / 月</span>
                </div>

                {/* Feature list */}
                <ul className="flex flex-1 flex-col gap-1.5 text-xs text-gray-600">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-1.5">
                      <CheckIcon
                        className={[
                          "mt-0.5 h-3.5 w-3.5 shrink-0",
                          isSelected ? "text-violet-600" : "text-gray-400",
                        ].join(" ")}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 cursor-pointer"
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isUnchanged}
            className={[
              "rounded-lg px-6 py-2.5 text-sm font-semibold transition-all duration-200",
              isUnchanged
                ? "cursor-not-allowed bg-gray-100 text-gray-400"
                : "cursor-pointer bg-violet-600 text-white shadow-sm hover:bg-violet-700 hover:shadow-md focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2",
            ].join(" ")}
          >
            プランを変更する
          </button>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Wrapper (controls mount/unmount)
// ---------------------------------------------------------------------------

export const PlanChangeModal: React.FC<PlanChangeModalProps> = ({
  isOpen,
  ...rest
}) => {
  if (!isOpen) return null;
  return <PlanChangeModalContent {...rest} />;
};
