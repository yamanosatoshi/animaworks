"use client";

import React, { useEffect, useCallback } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";

export interface TicketDetail {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt?: string;
  assignee?: string;
}

/** @deprecated Use TicketDetail instead */
export type Ticket = TicketDetail;

interface TicketDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: TicketDetail | null;
}

// ---------------------------------------------------------------------------
// Status config
// ---------------------------------------------------------------------------

const statusConfig: Record<
  TicketStatus,
  { label: string; dot: string; bg: string; text: string }
> = {
  open: {
    label: "未対応",
    dot: "bg-amber-500",
    bg: "bg-amber-50",
    text: "text-amber-700",
  },
  in_progress: {
    label: "対応中",
    dot: "bg-blue-500",
    bg: "bg-blue-50",
    text: "text-blue-700",
  },
  resolved: {
    label: "解決済み",
    dot: "bg-emerald-500",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
  },
  closed: {
    label: "完了",
    dot: "bg-gray-400",
    bg: "bg-gray-50",
    text: "text-gray-500",
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

const UserIcon: React.FC = () => (
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
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-[fadeIn_200ms_ease-out]"
      role="dialog"
      aria-modal="true"
      aria-label="チケット詳細"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-xl sm:p-8 animate-[slideUp_250ms_ease-out]">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
              <TicketIcon />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400">
                {ticket.id}
              </p>
              <h2 className="text-lg font-bold leading-tight text-gray-900">
                {ticket.title}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 cursor-pointer"
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
              status.bg,
              status.text,
            ].join(" ")}
          >
            <span
              className={[
                "inline-block h-1.5 w-1.5 rounded-full",
                status.dot,
              ].join(" ")}
            />
            {status.label}
          </span>

          {/* Created date */}
          <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
            <CalendarIcon />
            {formatDate(ticket.createdAt)}
          </span>

          {/* Updated date */}
          {ticket.updatedAt && (
            <span className="inline-flex items-center gap-1.5 text-xs text-gray-400">
              更新: {formatDate(ticket.updatedAt)}
            </span>
          )}

          {/* Assignee */}
          {ticket.assignee && (
            <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
              <UserIcon />
              {ticket.assignee}
            </span>
          )}
        </div>

        {/* Divider */}
        <div className="mb-5 border-t border-gray-100" />

        {/* Description */}
        <div className="mb-6">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
            詳細
          </h3>
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
              {ticket.description}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 cursor-pointer"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
