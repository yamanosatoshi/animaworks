"use client";

import React from "react";

interface ToggleSwitchProps {
  enabled: boolean;
  onToggle: () => void;
  id: string;
}

export function ToggleSwitch({ enabled, onToggle, id }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      id={id}
      onClick={onToggle}
      className={[
        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4a9eff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a14]",
        enabled ? "bg-[#4a9eff]" : "bg-white/20",
      ].join(" ")}
    >
      <span
        aria-hidden="true"
        className={[
          "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
          enabled ? "translate-x-4" : "translate-x-0",
        ].join(" ")}
      />
    </button>
  );
}
