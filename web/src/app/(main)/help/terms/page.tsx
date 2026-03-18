import React from "react";
import Link from "next/link";

export const metadata = {
  title: "利用規約 | HiCrew",
  description: "HiCrewサービス利用規約",
};

/* ---------- data ---------- */

interface TermsSection {
  id: string;
  title: string;
  content: string[];
}

const termsSections: TermsSection[] = [
  {
    id: "section-1",
    title: "第1条（適用）",
    content: [
      "本規約は、HiCrew（以下「当社」）が提供するサービス（以下「本サービス」）の利用に関し、当社と利用者の間に適用されます。",
      "利用者は、本サービスに登録・利用することにより、本規約に同意したものとみなされます。",
    ],
  },
  {
    id: "section-2",
    title: "第2条（利用登録）",
    content: [
      "本サービスの利用を希望する者は、当社の定める方法により利用登録を行うものとします。",
      "当社は、以下の場合には登録を拒否することがあります：（1）虚偽の情報を提供した場合、（2）過去に本規約に違反した場合、（3）その他当社が不適切と判断した場合。",
    ],
  },
  {
    id: "section-3",
    title: "第3条（ユーザーIDおよびパスワードの管理）",
    content: [
      "利用者は、自己の責任においてユーザーIDとパスワードを管理するものとします。",
      "利用者は、いかなる場合にも第三者にユーザーIDおよびパスワードを譲渡・貸与・開示することはできません。",
      "ユーザーIDとパスワードの組み合わせが一致した場合、当社は利用者本人による利用とみなします。",
    ],
  },
  {
    id: "section-4",
    title: "第4条（禁止事項）",
    content: [
      "利用者は、本サービスの利用にあたり、以下の行為をしてはなりません：",
      "（1）法令または公序良俗に違反する行為",
      "（2）犯罪行為に関連する行為",
      "（3）当社のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為",
      "（4）本サービスの運営を妨害するおそれのある行為",
      "（5）他の利用者の個人情報等を収集または蓄積する行為",
      "（6）不正アクセスをし、またはこれを試みる行為",
      "（7）その他、当社が不適切と判断する行為",
    ],
  },
  {
    id: "section-5",
    title: "第5条（本サービスの提供の停止等）",
    content: [
      "当社は、以下のいずれかの事由があると判断した場合、利用者に事前に通知することなく本サービスの全部または一部の提供を停止または中断することができます：",
      "（1）本サービスにかかるコンピュータシステムの保守点検または更新を行う場合",
      "（2）地震、落雷、火災、停電または天災などの不可抗力により、本サービスの提供が困難となった場合",
      "（3）その他、当社が本サービスの提供が困難と判断した場合",
    ],
  },
  {
    id: "section-6",
    title: "第6条（利用制限および登録抹消）",
    content: [
      "当社は、利用者が本規約のいずれかの条項に違反した場合、事前の通知なく利用者に対して本サービスの全部もしくは一部の利用を制限し、または利用者としての登録を抹消することができます。",
      "当社は、本条に基づき当社が行った行為により利用者に生じた損害について、一切の責任を負いません。",
    ],
  },
  {
    id: "section-7",
    title: "第7条（免責事項）",
    content: [
      "当社の債務不履行責任は、当社の故意または重過失によらない場合には免責されるものとします。",
      "当社は、本サービスに関して、利用者と他の利用者または第三者との間において生じた取引、連絡または紛争等について一切責任を負いません。",
    ],
  },
  {
    id: "section-8",
    title: "第8条（規約の変更）",
    content: [
      "当社は必要と判断した場合には、利用者に通知することなくいつでも本規約を変更することができます。",
      "変更後の本規約は、当社ウェブサイトに掲示した時点から効力を生じるものとします。",
      "本規約の変更後、本サービスの利用を続けた場合には、利用者は変更後の規約に同意したものとみなされます。",
    ],
  },
];

/* ---------- page ---------- */

export default function HelpTermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      {/* Breadcrumb */}
      <nav
        className="mb-6 flex items-center gap-1.5 text-sm"
        aria-label="パンくずリスト"
      >
        <Link
          href="/help"
          className="text-gray-500 transition-colors hover:text-gray-300"
        >
          ヘルプ
        </Link>
        <svg
          className="h-3.5 w-3.5 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
        <span className="font-medium text-gray-100">利用規約</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">利用規約</h1>
        <p className="mt-1 text-sm text-gray-400">
          最終更新日: 2024年3月1日
        </p>
      </div>

      {/* Table of contents */}
      <nav
        className="mb-8 overflow-hidden rounded-2xl p-5"
        style={{
          backgroundColor: "#12121e",
          border: "1px solid #1e1e2e",
        }}
        aria-label="目次"
      >
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
          目次
        </p>
        <ol className="flex flex-col gap-1.5">
          {termsSections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="text-sm transition-colors hover:underline"
                style={{ color: "#4a9eff" }}
              >
                {section.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* Content */}
      <div className="flex flex-col gap-8">
        {termsSections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            aria-labelledby={`${section.id}-title`}
          >
            <h2
              id={`${section.id}-title`}
              className="mb-3 scroll-mt-6 text-base font-bold text-gray-100"
            >
              {section.title}
            </h2>
            <div className="flex flex-col gap-2">
              {section.content.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-sm leading-relaxed text-gray-400"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Footer */}
      <div
        className="mt-12 border-t pt-6 text-center"
        style={{ borderColor: "#1e1e2e" }}
      >
        <p className="text-xs text-gray-500">
          ご不明な点は{" "}
          <Link
            href="/contact"
            className="underline transition-colors"
            style={{ color: "#4a9eff" }}
          >
            お問い合わせ
          </Link>{" "}
          よりご連絡ください
        </p>
      </div>
    </div>
  );
}
