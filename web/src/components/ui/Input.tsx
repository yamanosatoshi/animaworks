import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  id,
  className = "",
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-gray-700"
        >
          {label}
          {props.required && (
            <span className="ml-1 text-violet-600" aria-label="必須">
              *
            </span>
          )}
        </label>
      )}
      <input
        id={inputId}
        className={[
          "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-colors duration-150",
          "focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent",
          error
            ? "border-red-400 focus:ring-red-400"
            : "border-gray-300 hover:border-gray-400",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        aria-invalid={!!error}
        aria-describedby={
          error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
        }
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={`${inputId}-hint`} className="text-xs text-gray-500">
          {hint}
        </p>
      )}
    </div>
  );
};
