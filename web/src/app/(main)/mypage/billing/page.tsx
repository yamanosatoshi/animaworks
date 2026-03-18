"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type InvoiceStatus = "paid" | "pending" | "processing";
type PeriodFilter = "3m" | "6m" | "1y" | "all";

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  displayDate: string;
  description: string;
  amount: number;
  status: InvoiceStatus;
  plan: string;
  paymentMethod: string;
  items: InvoiceItem[];
}

// ---------------------------------------------------------------------------
// Dummy data
// ---------------------------------------------------------------------------

const invoices: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-2026-0003",
    date: "2026-03-01",
    displayDate: "2026/03/01",
    description: "スタンダードプラン + 追加クレジット",
    amount: 9800,
    status: "pending",
    plan: "スタンダードプラン",
    paymentMethod: "VISA •••• 4242",
    items: [
      { description: "スタンダードプラン 月額利用料", quantity: 1, unitPrice: 8000, amount: 8000 },
      { description: "追加クレジット 100回分", quantity: 1, unitPrice: 1800, amount: 1800 },
    ],
  },
  {
    id: "2",
    invoiceNumber: "INV-2026-0002",
    date: "2026-02-01",
    displayDate: "2026/02/01",
    description: "スタンダードプラン 月額利用料",
    amount: 8000,
    status: "paid",
    plan: "スタンダードプラン",
    paymentMethod: "VISA •••• 4242",
    items: [
      { description: "スタンダードプラン 月額利用料", quantity: 1, unitPrice: 8000, amount: 8000 },
    ],
  },
  {
    id: "3",
    invoiceNumber: "INV-2026-0001",
    date: "2026-01-01",
    displayDate: "2026/01/01",
    description: "スタンダードプラン 月額利用料",
    amount: 8000,
    status: "paid",
    plan: "スタンダードプラン",
    paymentMethod: "VISA •••• 4242",
    items: [
      { description: "スタンダードプラン 月額利用料", quantity: 1, unitPrice: 8000, amount: 8000 },
    ],
  },
  {
    id: "4",
    invoiceNumber: "INV-2025-0012",
    date: "2025-12-01",
    displayDate: "2025/12/01",
    description: "スタンダードプラン 月額利用料",
    amount: 8000,
    status: "paid",
    plan: "スタンダードプラン",
    paymentMethod: "VISA •••• 4242",
    items: [
      { description: "スタンダードプラン 月額利用料", quantity: 1, unitPrice: 8000, amount: 8000 },
    ],
  },
  {
    id: "5",
    invoiceNumber: "INV-2025-0011",
    date: "2025-11-01",
    displayDate: "2025/11/01",
    description: "スタンダードプラン 月額利用料",
    amount: 8000,
    status: "processing",
    plan: "スタンダードプラン",
    paymentMethod: "VISA •••• 4242",
    items: [
      { description: "スタンダードプラン 月額利用料", quantity: 1, unitPrice: 8000, amount: 8000 },
    ],
  },
  {
    id: "6",
    invoiceNumber: "INV-2025-0010",
    date: "2025-10-01",
    displayDate: "2025/10/01",
    description: "ライトプラン 月額利用料",
    amount: 5000,
    status: "paid",
    plan: "ライトプラン",
    paymentMethod: "VISA •••• 4242",
    items: [
      { description: "ライトプラン 月額利用料", quantity: 1, unitPrice: 5000, amount: 5000 },
    ],
  },
  {
    id: "7",
    invoiceNumber: "INV-2025-0009",
    date: "2025-09-01",
    displayDate: "2025/09/01",
    description: "ライトプラン 月額利用料",
    amount: 5000,
    status: "paid",
    plan: "ライトプラン",
    paymentMethod: "VISA •••• 4242",
    items: [
      { description: "ライトプラン 月額利用料", quantity: 1, unitPrice: 5000, amount: 5000 },
    ],
  },
  {
    id: "8",
    invoiceNumber: "INV-2025-0008",
    date: "2025-08-01",
    displayDate: "2025/08/01",
    description: "ライトプラン 月額利用料",
    amount: 5000,
    status: "paid",
    plan: "ライトプラン",
    paymentMethod: "VISA •••• 4242",
    items: [
      { description: "ライトプラン 月額利用料", quantity: 1, unitPrice: 5000, amount: 5000 },
    ],
  },
];

// ---------------------------------------------------------------------------
// Status config
// ---------------------------------------------------------------------------

const statusConfig: Record<InvoiceStatus, { label: string; className: string }> = {
  paid: { label: "支払済", className: "bg-green-100 text-green-700" },
  pending: { label: "未払い", className: "bg-yellow-100 text-yellow-700" },
  processing: { label: "処理中", className: "bg-blue-100 text-blue-700" },
};

// ---------------------------------------------------------------------------
// Period filter config
// ---------------------------------------------------------------------------

const periodFilters: { key: PeriodFilter; label: string }[] = [
  { key: "3m", label: "3ヶ月" },
  { key: "6m", label: "6ヶ月" },
  { key: "1y", label: "1年" },
  { key: "all", label: "すべて" },
];

function getFilterCutoff(filter: PeriodFilter): Date | null {
  if (filter === "all") return null;
  const now = new Date();
  switch (filter) {
    case "3m":
      return new Date(now.getFullYear(), now.getMonth() - 3, 1);
    case "6m":
      return new Date(now.getFullYear(), now.getMonth() - 6, 1);
    case "1y":
      return new Date(now.getFullYear() - 1, now.getMonth(), 1);
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatCurrency(amount: number): string {
  return `¥${amount.toLocaleString()}`;
}

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

const CreditCardIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
  </svg>
);

const DownloadIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

const CloseIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
  </svg>
);

const CurrencyIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// ---------------------------------------------------------------------------
// Detail Modal
// ---------------------------------------------------------------------------

function InvoiceDetailModal({
  invoice,
  onClose,
}: {
  invoice: Invoice;
  onClose: () => void;
}) {
  // ESC key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Body scroll lock
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`請求書 ${invoice.invoiceNumber} の詳細`}
    >
      {/* Dark overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal content */}
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">請求書詳細</h2>
            <p className="text-sm text-gray-500">{invoice.invoiceNumber}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
            aria-label="閉じる"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Summary grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">請求書番号</p>
              <p className="mt-0.5 text-sm font-medium text-gray-900">{invoice.invoiceNumber}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">発行日</p>
              <p className="mt-0.5 text-sm font-medium text-gray-900">{invoice.displayDate}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">内容</p>
              <p className="mt-0.5 text-sm font-medium text-gray-900">{invoice.description}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">ステータス</p>
              <span className={`mt-0.5 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConfig[invoice.status].className}`}>
                {statusConfig[invoice.status].label}
              </span>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-gray-500">支払い方法</p>
              <p className="mt-0.5 text-sm font-medium text-gray-900">{invoice.paymentMethod}</p>
            </div>
          </div>

          {/* Items table */}
          <div className="overflow-hidden rounded-xl border border-gray-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80">
                  <th className="px-4 py-2.5 text-left font-medium text-gray-500">項目</th>
                  <th className="px-4 py-2.5 text-right font-medium text-gray-500">数量</th>
                  <th className="px-4 py-2.5 text-right font-medium text-gray-500">単価</th>
                  <th className="px-4 py-2.5 text-right font-medium text-gray-500">金額</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, idx) => (
                  <tr key={idx} className={idx > 0 ? "border-t border-gray-50" : ""}>
                    <td className="px-4 py-2.5 text-gray-700">{item.description}</td>
                    <td className="px-4 py-2.5 text-right text-gray-600">{item.quantity}</td>
                    <td className="px-4 py-2.5 text-right text-gray-600">{formatCurrency(item.unitPrice)}</td>
                    <td className="px-4 py-2.5 text-right font-medium text-gray-900">{formatCurrency(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
            <span className="text-sm font-medium text-gray-600">合計（税込）</span>
            <span className="text-lg font-bold text-gray-900">{formatCurrency(invoice.amount)}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
          <Button variant="secondary" size="sm" onClick={onClose}>
            閉じる
          </Button>
          <Button variant="primary" size="sm">
            <DownloadIcon />
            <span className="ml-1.5">PDFダウンロード</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function BillingPage() {
  const [period, setPeriod] = useState<PeriodFilter>("3m");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const handleCloseModal = useCallback(() => {
    setSelectedInvoice(null);
  }, []);

  const filteredInvoices = useMemo(() => {
    const cutoff = getFilterCutoff(period);
    if (!cutoff) return invoices;
    return invoices.filter((inv) => new Date(inv.date) >= cutoff);
  }, [period]);

  // Current month billing (latest pending or first invoice)
  const currentMonthBilling = invoices[0];

  return (
    <>
      <div className="mx-auto max-w-3xl px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <Link
            href="/mypage"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
            aria-label="マイページに戻る"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">支払い・請求</h1>
            <p className="mt-0.5 text-sm text-gray-500">支払い方法と請求履歴の管理</p>
          </div>
        </div>

        {/* ================================================================ */}
        {/* Billing Summary Cards */}
        {/* ================================================================ */}
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
            請求サマリー
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {/* Current month billing */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                  <CurrencyIcon />
                </div>
                <p className="text-xs font-medium text-gray-500">今月の請求額</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(currentMonthBilling.amount)}
              </p>
              <span className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConfig[currentMonthBilling.status].className}`}>
                {statusConfig[currentMonthBilling.status].label}
              </span>
            </div>

            {/* Payment method */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                  <CreditCardIcon />
                </div>
                <p className="text-xs font-medium text-gray-500">支払い方法</p>
              </div>
              <p className="text-sm font-bold text-gray-900">VISA</p>
              <p className="mt-1 text-xs text-gray-500">•••• •••• •••• 4242</p>
            </div>

            {/* Next billing date */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <CalendarIcon />
                </div>
                <p className="text-xs font-medium text-gray-500">次回請求日</p>
              </div>
              <p className="text-lg font-bold text-gray-900">2026/04/01</p>
              <p className="mt-1 text-xs text-gray-500">スタンダードプラン</p>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* Payment Method */}
        {/* ================================================================ */}
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
            支払い方法
          </h2>
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center gap-4 px-5 py-4">
              {/* Card icon */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                <CreditCardIcon />
              </div>

              {/* Card info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">VISA</span>
                  <span className="text-xs text-gray-400">•••• •••• •••• 4242</span>
                </div>
                <p className="mt-0.5 text-xs text-gray-500">有効期限: 12/2028</p>
              </div>

              {/* Change button */}
              <Button variant="secondary" size="sm">
                変更
              </Button>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* Billing History */}
        {/* ================================================================ */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              請求履歴
            </h2>

            {/* Period filter */}
            <div className="flex gap-1.5" role="tablist" aria-label="期間フィルター">
              {periodFilters.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  role="tab"
                  aria-selected={period === f.key}
                  onClick={() => setPeriod(f.key)}
                  className={[
                    "rounded-full px-3 py-1 text-xs font-medium transition-colors duration-150 cursor-pointer",
                    period === f.key
                      ? "bg-violet-600 text-white"
                      : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50",
                  ].join(" ")}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            {/* Table header */}
            <div className="grid grid-cols-[0.8fr_1fr_1.2fr_0.7fr_0.7fr_auto] gap-2 border-b border-gray-100 bg-gray-50/80 px-5 py-2.5 text-xs font-medium text-gray-500">
              <span>請求書番号</span>
              <span>日付</span>
              <span>内容</span>
              <span className="text-right">金額</span>
              <span className="text-center">ステータス</span>
              <span className="w-8" />
            </div>

            {/* Rows */}
            {filteredInvoices.length === 0 ? (
              <div className="px-5 py-10 text-center text-sm text-gray-400">
                該当する請求データがありません
              </div>
            ) : (
              filteredInvoices.map((inv, index) => (
                <div
                  key={inv.id}
                  className={[
                    "grid grid-cols-[0.8fr_1fr_1.2fr_0.7fr_0.7fr_auto] gap-2 items-center px-5 py-3 transition-colors hover:bg-gray-50/50",
                    index > 0 ? "border-t border-gray-100" : "",
                  ].join(" ")}
                >
                  {/* Invoice number (clickable) */}
                  <button
                    type="button"
                    onClick={() => setSelectedInvoice(inv)}
                    className="text-left text-sm font-medium text-violet-600 hover:text-violet-800 hover:underline transition-colors cursor-pointer truncate"
                  >
                    {inv.invoiceNumber}
                  </button>

                  {/* Date */}
                  <span className="text-sm text-gray-700">{inv.displayDate}</span>

                  {/* Description */}
                  <span className="text-sm text-gray-600 truncate">{inv.description}</span>

                  {/* Amount */}
                  <span className="text-right text-sm font-medium text-gray-900">
                    {formatCurrency(inv.amount)}
                  </span>

                  {/* Status */}
                  <div className="flex justify-center">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConfig[inv.status].className}`}>
                      {statusConfig[inv.status].label}
                    </span>
                  </div>

                  {/* PDF download */}
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
                    aria-label={`${inv.invoiceNumber} の PDF をダウンロード`}
                  >
                    <DownloadIcon />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Summary */}
          {filteredInvoices.length > 0 && (
            <p className="mt-3 text-right text-xs text-gray-400">
              {filteredInvoices.length}件の請求
            </p>
          )}
        </section>
      </div>

      {/* Detail modal */}
      {selectedInvoice && (
        <InvoiceDetailModal
          invoice={selectedInvoice}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
