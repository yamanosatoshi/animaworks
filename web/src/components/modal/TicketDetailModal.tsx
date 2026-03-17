"use client";

import React, { useEffect, useCallback } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type TicketStatus = "open" | "in_progress" | "resolved" | "closed";

export interface Ticket {
  id: string;
  title: string;
  status: TicketStatus;
  createdAt: string;
  description: string;
}

interface TicketDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket | null;
}

// ---------------------------------------------------------------------------
// Status config
// ---------------------------------------------------------------------------

const statusConfig: Record<
  TicketStatus,
  { label: string; dotColor: string; bgColor: string; textColor: string }
> = {
  open: {
    label: "未対応",
    dotColor: "bg-amber-400",
    bgColor: "bg-amber-400/10",
    textColor: "text-amber-400",
  },
  in_progress: {
    label: "対応中",
    dotColor: "bg-blue-400",
    bgColor: "bg-blue-400/10",
    textColor: "text-blue-400",
  },
  resolved: {
    label: "解決済み",
    dotColor: "bg-emerald-400",
    bgColor: "bg-emerald-400/10",
    textColor: "text-emerald-400",
  },
  closed: {
    label: "クローズ",
    dotColor: "bg-[#8a8aa0]",
    bgColor: "bg-white/[0.06]",
    textColor: "text-[#8a8aa0]",
  },
};

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

const TicketIcon: React.FC = () => (
  <svg
    width="16"
    height="16"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
    />
  </svg>
);

const CalendarIcon: React.FC = () => (
  <svg
    width="14"
    height="14"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const TicketDetailModal: React.FC<TicketDetailModalProps> = ({
  isOpen,
  onClose,
  ticket,
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
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !ticket) return null;

  const status = statusConfig[ticket.status];

  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="チケット詳細"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-white/[0.08] bg-[#12121e] p-6 shadow-2xl sm:p-8">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#7c5cfc]/10 text-[#7c5cfc]">
              <TicketIcon />
            </div>
            <div>
              <p className="text-xs font-medium text-[#8a8aa0]">
                {ticket.id}
              </p>
              <h2 className="text-lg font-bold leading-tight text-white">
                {ticket.title}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#8a8aa0] transition-colors hover:bg-white/10 hover:text-white"
            aria-label="閉じる"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Meta row */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          {/* Status badge */}
          <span
            className={[
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
              status.bgColor,
              status.textColor,
            ].join(" ")}
          >
            <span
              className={["inline-block h-1.5 w-1.5 rounded-full", status.dotColor].join(
                " ",
              )}
            />
            {status.label}
          </span>

          {/* Created date */}
          <span className="inline-flex items-center gap-1.5 text-xs text-[#8a8aa0]">
            <CalendarIcon />
            {formatDate(ticket.createdAt)}
          </span>
        </div>

        {/* Divider */}
        <div className="mb-5 border-t border-white/[0.06]" />

        {/* Description */}
        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#8a8aa0]">
            詳細
          </h3>
          <div className="rounded-lg bg-white/[0.03] p-4">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#c8c8d8]">
              {ticket.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
