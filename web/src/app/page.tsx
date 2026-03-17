import Link from "next/link";

export const metadata = {
  title: "KON — AIコミュニケーション支援サービス",
  description: "KONは、AIがあなたのコミュニケーションをサポートするサービスです。",
};

const features = [
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    ),
    title: "AIチャット支援",
    description: "自然な会話でAIがあなたの疑問に答え、業務効率を高めます。",
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: "高速レスポンス",
    description: "最新のAIモデルにより、リアルタイムで質の高い回答を提供します。",
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    title: "セキュアな環境",
    description: "会話データは安全に管理され、プライバシーを守ります。",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600">
              <span className="text-xs font-bold text-white">KON</span>
            </div>
            <span className="text-base font-semibold text-gray-900">KON</span>
          </div>
          <nav className="flex items-center gap-3" aria-label="ヘッダーナビゲーション">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              ログイン
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-gradient-to-r from-violet-500 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-90 transition-opacity"
            >
              無料で始める
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pb-24 pt-32">
          {/* Background gradient */}
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            aria-hidden="true"
          >
            <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-violet-100 via-indigo-50 to-blue-100 opacity-60 blur-3xl" />
          </div>

          <div className="mx-auto max-w-2xl text-center">
            {/* Badge */}
            <span className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-500" aria-hidden="true" />
              AI搭載の次世代コミュニケーションツール
            </span>

            {/* Headline */}
            <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl">
              AIがあなたの
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                コミュニケーション
              </span>
              をサポート
            </h1>

            <p className="mb-10 text-lg leading-relaxed text-gray-600">
              KONは、AIの力でビジネスコミュニケーションを効率化するサービスです。
              質問への回答、文章作成、情報整理をスマートにサポートします。
            </p>

            {/* CTAs */}
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/register"
                className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 px-8 text-sm font-semibold text-white shadow-lg shadow-violet-200 hover:opacity-90 transition-opacity sm:w-auto"
              >
                無料で始める
                <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                href="/login"
                className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-gray-300 px-8 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors sm:w-auto"
              >
                ログインして続ける
              </Link>
            </div>

            {/* Social proof */}
            <p className="mt-6 text-xs text-gray-400">
              クレジットカード不要 · 登録は1分 · いつでもキャンセル可
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="bg-gray-50 px-6 py-20" aria-labelledby="features-heading">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 id="features-heading" className="text-2xl font-bold text-gray-900 sm:text-3xl">
                KONでできること
              </h2>
              <p className="mt-3 text-gray-600">
                シンプルなUIで、すぐに使い始めることができます。
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                    {feature.icon}
                  </div>
                  <h3 className="mb-2 text-base font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section className="px-6 py-20" aria-labelledby="cta-heading">
          <div className="mx-auto max-w-2xl text-center">
            <h2 id="cta-heading" className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl">
              今すぐ無料で試してみる
            </h2>
            <p className="mb-8 text-gray-600">
              登録は1分で完了。クレジットカードは不要です。
            </p>
            <Link
              href="/register"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 px-10 text-sm font-semibold text-white shadow-lg shadow-violet-200 hover:opacity-90 transition-opacity"
            >
              無料アカウントを作成
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white px-6 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-indigo-600">
              <span className="text-[10px] font-bold text-white">K</span>
            </div>
            <span className="text-sm font-medium text-gray-700">KON</span>
          </div>
          <nav className="flex gap-6" aria-label="フッターナビゲーション">
            <Link href="/terms" className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
              利用規約
            </Link>
            <Link href="/privacy" className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
              プライバシーポリシー
            </Link>
            <Link href="/help" className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
              ヘルプ
            </Link>
            <Link href="/contact" className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
              お問い合わせ
            </Link>
          </nav>
          <p className="text-xs text-gray-400">© 2026 KON. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
