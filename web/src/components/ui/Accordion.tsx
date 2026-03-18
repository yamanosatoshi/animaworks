"use client";

import React, { useState } from "react";

export interface AccordionItem {
  id: string;
  title: string;
  content: string;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

function AccordionRow({ item }: { item: AccordionItem }) {
  const [open, setOpen] = useState(false);
  const contentId = `accordion-content-${item.id}`;

  return (
    <div
      className="border-b last:border-b-0"
      style={{ borderColor: "#1e1e2e" }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => setOpen(!open)}
        className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left transition-colors duration-150 cursor-pointer hover:bg-white/[0.03]"
      >
        <span className="text-sm font-medium text-gray-100">
          {item.title}
        </span>
        <svg
          className={[
            "mt-0.5 h-4 w-4 shrink-0 transition-transform duration-200",
            open ? "rotate-180" : "",
          ].join(" ")}
          style={{ color: "#4a9eff" }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>
      <div
        id={contentId}
        role="region"
        hidden={!open}
        className="overflow-hidden"
      >
        {open && (
          <div className="px-5 pb-4">
            <p className="text-sm leading-relaxed text-gray-400">
              {item.content}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  className = "",
}) => {
  return (
    <div
      className={["rounded-2xl overflow-hidden", className]
        .filter(Boolean)
        .join(" ")}
      style={{ backgroundColor: "#12121e", border: "1px solid #1e1e2e" }}
    >
      {items.map((item) => (
        <AccordionRow key={item.id} item={item} />
      ))}
    </div>
  );
};
