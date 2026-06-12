import Link from "next/link";
import { GENRE_SUBNAV } from "@/lib/nav";

// ヘッダー直下に出すジャンル内コンテキストナビ。
// 検索流入ユーザーの関心はそのジャンルに閉じていることが多いため、
// グローバルナビとは別に「ジャンルトップ + ピラー記事 + ジャンル別CTA」を常設する。
// サーバーコンポーネント（現在地は currentPath で受け取り、SSR HTMLに全リンクが載る）。
export default function GenreSubNav({
  category,
  currentPath,
}: {
  category: string;
  currentPath: string;
}) {
  const nav = GENRE_SUBNAV[category];
  if (!nav) return null;

  const isCurrent = (href: string) => currentPath === href;

  return (
    <div className="border-b border-border/60 bg-zinc-50/80">
      <nav
        aria-label={`${nav.genre}の主要ページ`}
        className="max-w-5xl mx-auto px-4 h-12 flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden text-[13px] font-medium"
      >
        <Link
          href={nav.href}
          aria-current={isCurrent(nav.href) ? "page" : undefined}
          className={`flex items-center gap-1.5 shrink-0 px-2.5 py-1.5 rounded-full font-bold whitespace-nowrap transition-colors ${
            isCurrent(nav.href)
              ? "text-primary bg-blue-50"
              : "text-zinc-700 hover:text-primary hover:bg-blue-50"
          }`}
        >
          <span className="text-sm">{nav.emoji}</span>
          {nav.genre}
        </Link>

        <span className="w-px h-4 bg-border shrink-0 mx-0.5" aria-hidden />

        {nav.links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isCurrent(link.href) ? "page" : undefined}
            className={`shrink-0 px-2.5 py-1.5 rounded-full whitespace-nowrap transition-colors ${
              isCurrent(link.href)
                ? "text-primary bg-blue-50 font-semibold"
                : "text-zinc-500 hover:text-primary hover:bg-blue-50"
            }`}
          >
            {link.label}
          </Link>
        ))}

        {!isCurrent(nav.cta.href) && (
          <Link
            href={nav.cta.href}
            className="ml-auto shrink-0 flex items-center gap-1 pl-3 pr-2.5 py-1.5 rounded-full bg-primary text-white font-semibold whitespace-nowrap hover:bg-primary-dark transition-colors shadow-sm"
          >
            {nav.cta.label}
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </nav>
    </div>
  );
}
