"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { GLOBAL_NAV, isNavItemActive, type NavItem } from "@/lib/nav";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // ページ遷移したらモバイルメニューを閉じる
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // メニュー表示中は背面のスクロールを止める
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Escキーでメニューを閉じる
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  // スクロール時にヘッダーへ影を付けて浮かせる
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-white/85 backdrop-blur-lg transition-shadow duration-300 ${
        scrolled ? "border-transparent shadow-[0_1px_12px_rgba(24,39,75,0.08)]" : "border-border/60"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <span className="text-2xl">🧪</span>
          <span className="flex flex-col leading-none">
            <span className="text-[17px] font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent group-hover:from-blue-500 group-hover:to-blue-700 transition-all whitespace-nowrap">
              ならならの実験場
            </span>
            <span className="text-[10px] text-zinc-400 mt-0.5 hidden xl:block whitespace-nowrap">
              作ったものと使ったものの記録
            </span>
          </span>
        </Link>

        {/* デスクトップメニュー（タブレット帯は窮屈なので lg から表示） */}
        <nav className="hidden lg:flex items-center gap-0.5 text-sm font-medium" aria-label="グローバルナビ">
          {GLOBAL_NAV.map((item) =>
            item.children ? (
              <DesktopDropdown key={item.label} item={item} active={isNavItemActive(pathname, item)} />
            ) : (
              <DesktopNavLink key={item.label} href={item.href} active={isNavItemActive(pathname, item)}>
                {item.label}
              </DesktopNavLink>
            )
          )}
          <Link
            href="/search"
            className="p-2 ml-1 rounded-lg text-zinc-500 hover:text-primary hover:bg-blue-50 transition-all"
            aria-label="記事を検索"
          >
            <SearchIcon />
          </Link>
          <Link
            href="/career/diagnosis"
            className="ml-1 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark shadow-sm hover:shadow transition-all whitespace-nowrap"
          >
            キャリア診断
          </Link>
        </nav>

        {/* モバイル: 検索 + メニューボタン */}
        <div className="flex items-center gap-1 lg:hidden">
          <Link
            href="/search"
            className="p-2 rounded-lg text-zinc-500 hover:text-primary hover:bg-blue-50 transition-colors"
            aria-label="記事を検索"
          >
            <SearchIcon />
          </Link>
          <button
            className="p-2 rounded-lg hover:bg-zinc-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "メニューを閉じる" : "メニューを開く"}
            aria-expanded={menuOpen}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* モバイルメニュー（全カテゴリを開いた状態で一覧表示） */}
      {menuOpen && (
        <nav
          className="lg:hidden border-t border-border/60 bg-white h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain animate-[slideDown_0.2s_ease-out]"
          aria-label="モバイルナビ"
        >
          <div className="px-4 py-5 flex flex-col gap-6 max-w-lg mx-auto">
            <Link
              href="/career/diagnosis"
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-white text-sm font-bold shadow-sm hover:bg-primary-dark transition-colors"
            >
              🎯 3分でわかるキャリア診断
            </Link>

            {GLOBAL_NAV.map((item) =>
              item.children ? (
                <MobileNavGroup key={item.label} item={item} pathname={pathname} />
              ) : (
                <MobileNavRow
                  key={item.label}
                  href={item.href}
                  emoji={item.emoji}
                  active={isNavItemActive(pathname, item)}
                >
                  {item.label}
                </MobileNavRow>
              )
            )}

            <div className="border-t border-border/60 pt-4 flex flex-col gap-1 text-sm">
              <Link href="/about" className="px-3 py-2.5 rounded-lg text-zinc-500 hover:text-primary hover:bg-blue-50 transition-colors">
                運営者情報
              </Link>
              <Link href="/contact" className="px-3 py-2.5 rounded-lg text-zinc-500 hover:text-primary hover:bg-blue-50 transition-colors">
                お問い合わせ
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}

function SearchIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  );
}

function DesktopNavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`px-2.5 py-2 rounded-lg whitespace-nowrap transition-all ${
        active ? "text-primary bg-blue-50 font-semibold" : "text-zinc-600 hover:text-primary hover:bg-blue-50"
      }`}
    >
      {children}
    </Link>
  );
}

// CSSホバーで開くドロップダウン。子リンクを常にDOMへ描画するため、
// SSR時のHTMLに含まれ（内部リンクとしてクロール可能）、Tabキーでも開ける。
function DesktopDropdown({ item, active }: { item: NavItem; active: boolean }) {
  // 親hrefが子と同じ場合（例: お金と税金 → /kaikei）は「すべて見る」を出さない
  const hasOwnHub = !item.children!.some((c) => c.href === item.href);
  return (
    <div className="relative group">
      <Link
        href={item.href}
        aria-haspopup="true"
        aria-current={active ? "page" : undefined}
        className={`flex items-center gap-0.5 px-2.5 py-2 rounded-lg whitespace-nowrap transition-all ${
          active ? "text-primary bg-blue-50 font-semibold" : "text-zinc-600 hover:text-primary hover:bg-blue-50"
        }`}
      >
        {item.label}
        <svg
          className="w-3.5 h-3.5 mt-0.5 transition-transform duration-200 group-hover:rotate-180"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </Link>
      <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 w-60 invisible opacity-0 translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-0 transition-all duration-150">
        <div className="rounded-xl border border-border/60 bg-white shadow-xl shadow-zinc-900/5 p-2">
          {item.children!.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-zinc-600 hover:text-primary hover:bg-blue-50 transition-colors"
            >
              <span className="text-base">{child.emoji}</span>
              {child.label}
            </Link>
          ))}
          {hasOwnHub && (
            <div className="border-t border-border/60 mt-1.5 pt-1.5">
              <Link
                href={item.href}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-semibold text-primary hover:bg-blue-50 transition-colors"
              >
                {item.label}をすべて見る
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MobileNavRow({
  href,
  emoji,
  active,
  children,
}: {
  href: string;
  emoji: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`flex items-center gap-3 px-3 py-3 rounded-xl border text-sm font-semibold transition-colors ${
        active
          ? "border-primary/30 bg-blue-50 text-primary"
          : "border-border/60 text-zinc-700 hover:border-primary/30 hover:bg-blue-50/50"
      }`}
    >
      <span className="text-lg">{emoji}</span>
      {children}
      <svg className="w-4 h-4 ml-auto text-zinc-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

// 子持ちカテゴリはアコーディオンにせず、最初から全部見せる。
// タップ数を減らし「どんなジャンルがあるか」を一目で伝えるため。
function MobileNavGroup({ item, pathname }: { item: NavItem; pathname: string }) {
  const hasOwnHub = !item.children!.some((c) => c.href === item.href);
  return (
    <section>
      <div className="flex items-center justify-between mb-2 px-1">
        <p className="text-xs font-bold text-zinc-400 tracking-wider flex items-center gap-1.5">
          <span className="text-sm">{item.emoji}</span>
          {item.label}
        </p>
        {hasOwnHub && (
          <Link href={item.href} className="text-xs font-semibold text-primary flex items-center gap-0.5">
            すべて見る
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {item.children!.map((child) => {
          const active = pathname === child.href || pathname.startsWith(`${child.href}/`);
          return (
            <Link
              key={child.href}
              href={child.href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-2 px-3 py-3 rounded-xl border text-[13px] font-semibold transition-colors ${
                active
                  ? "border-primary/30 bg-blue-50 text-primary"
                  : "border-border/60 text-zinc-700 hover:border-primary/30 hover:bg-blue-50/50"
              }`}
            >
              <span className="text-base">{child.emoji}</span>
              <span className="leading-tight">{child.label}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
