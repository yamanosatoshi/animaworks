import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg" | "none";
}

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  padding = "md",
}) => {
  return (
    <div
      className={[
        "rounded-2xl bg-white shadow-sm border border-gray-100",
        paddingClasses[padding],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
};
