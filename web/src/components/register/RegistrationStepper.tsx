import React from "react";

const steps = [
  { number: 1, label: "基本情報登録" },
  { number: 2, label: "プラン選択" },
  { number: 3, label: "メンバー作成" },
  { number: 4, label: "お支払い情報登録" },
];

interface RegistrationStepperProps {
  currentStep: number;
}

export const RegistrationStepper: React.FC<RegistrationStepperProps> = ({
  currentStep,
}) => {
  return (
    <div className="flex flex-col items-start gap-0">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          {/* Step row */}
          <div className="flex items-center gap-3">
            <div
              className={[
                "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold shrink-0",
                step.number < currentStep
                  ? "bg-accent text-white"
                  : step.number === currentStep
                  ? "bg-accent text-white"
                  : "bg-[#333] text-gray-400",
              ].join(" ")}
              aria-current={step.number === currentStep ? "step" : undefined}
            >
              {step.number < currentStep ? (
                <svg
                  className="h-4 w-4"
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
              ) : (
                step.number
              )}
            </div>
            <span
              className={[
                "text-sm whitespace-nowrap",
                step.number <= currentStep
                  ? "text-white font-medium"
                  : "text-gray-500",
              ].join(" ")}
            >
              {step.label}
            </span>
          </div>

          {/* Connector line */}
          {index < steps.length - 1 && (
            <div
              className={[
                "ml-[15px] w-[2px] h-8",
                step.number < currentStep ? "bg-accent" : "bg-[#333]",
              ].join(" ")}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
