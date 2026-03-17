"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const languages = [
  { code: "ja", label: "日本語", nativeLabel: "日本語" },
  { code: "en", label: "英語", nativeLabel: "English" },
  { code: "zh", label: "中国語（簡体字）", nativeLabel: "中文（简体）" },
  { code: "ko", label: "韓国語", nativeLabel: "한국어" },
];

const timezones = [
  { value: "Asia/Tokyo", label: "東京 (JST, UTC+9)" },
  { value: "Asia/Seoul", label: "ソウル (KST, UTC+9)" },
  { value: "Asia/Shanghai", label: "上海 (CST, UTC+8)" },
  { value: "America/New_York", label: "ニューヨーク (EST, UTC-5)" },
  { value: "Europe/London", label: "ロンドン (GMT, UTC+0)" },
];

export default function LanguageSettingsPage() {
  const [selectedLang, setSelectedLang] = useState("ja");
  const [selectedTimezone, setSelectedTimezone] = useState("Asia/Tokyo");
  const [dateFormat, setDateFormat] = useState("YYYY/MM/DD");

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <Link
          href="/settings"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
          aria-label="設定に戻る"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">言語設定</h1>
          <p className="mt-0.5 text-sm text-gray-500">表示言語とタイムゾーンを変更</p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Language selection */}
        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm" aria-labelledby="lang-heading">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 id="lang-heading" className="text-sm font-semibold text-gray-900">
              表示言語
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {languages.map((lang) => (
              <label
                key={lang.code}
                className="flex cursor-pointer items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors duration-150"
              >
                <input
                  type="radio"
                  name="language"
                  value={lang.code}
                  checked={selectedLang === lang.code}
                  onChange={() => setSelectedLang(lang.code)}
                  className="h-4 w-4 border-gray-300 text-violet-600 focus:ring-violet-500 cursor-pointer"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{lang.nativeLabel}</p>
                  <p className="text-xs text-gray-500">{lang.label}</p>
                </div>
                {selectedLang === lang.code && (
                  <svg className="h-4 w-4 text-violet-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
              </label>
            ))}
          </div>
        </section>

        {/* Timezone */}
        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm" aria-labelledby="tz-heading">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 id="tz-heading" className="text-sm font-semibold text-gray-900">
              タイムゾーン
            </h2>
          </div>
          <div className="p-6">
            <label htmlFor="timezone" className="mb-1.5 block text-sm font-medium text-gray-700">
              タイムゾーンを選択
            </label>
            <select
              id="timezone"
              value={selectedTimezone}
              onChange={(e) => setSelectedTimezone(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 transition-colors duration-150 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            >
              {timezones.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Date format */}
        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm" aria-labelledby="date-heading">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 id="date-heading" className="text-sm font-semibold text-gray-900">
              日付形式
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {[
              { value: "YYYY/MM/DD", example: "2024/03/18" },
              { value: "YYYY-MM-DD", example: "2024-03-18" },
              { value: "MM/DD/YYYY", example: "03/18/2024" },
              { value: "DD/MM/YYYY", example: "18/03/2024" },
            ].map((format) => (
              <label
                key={format.value}
                className="flex cursor-pointer items-center gap-4 px-6 py-3.5 hover:bg-gray-50 transition-colors duration-150"
              >
                <input
                  type="radio"
                  name="dateFormat"
                  value={format.value}
                  checked={dateFormat === format.value}
                  onChange={() => setDateFormat(format.value)}
                  className="h-4 w-4 border-gray-300 text-violet-600 focus:ring-violet-500 cursor-pointer"
                />
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-sm text-gray-900">{format.value}</span>
                  <span className="text-xs text-gray-400 font-mono">{format.example}</span>
                </div>
              </label>
            ))}
          </div>
        </section>

        {/* Save */}
        <div className="flex justify-end">
          <Button variant="primary" size="md" type="button">
            変更を保存
          </Button>
        </div>
      </div>
    </div>
  );
}
