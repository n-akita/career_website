"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { GLOBAL_NAV, type NavItem } from "@/lib/nav";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  // デスクトップのドロップダウン（子を持つ項目）の開閉。labelをキーにする。
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  // モバイルアコーディオンの開閉。
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMobile = () => {
    setMenuOpen(false);
    setExpanded(null);
  };

  return (
    <header className="border-b border-border/60 bg-white/80 backdrop-blur-lg sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <span className="text-2xl">🏢</span>
          <span className="flex flex-col leading-none">
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent group-hover:from-blue-500 group-hover:to-blue-700 transition-all">
              ならなら
            </span>
            <span className="text-[10px] text-zinc-400 mt-0.5 hidden sm:block">
              働く人の「選び方」を変えるメディア
            </span>
          </span>
        </Link>

        {/* デスクトップメニュー */}
        <nav className="hidden md:flex items-center gap-0.5 text-sm font-medium">
          {GLOBAL_NAV.map((item) =>
            item.children ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-0.5 px-2.5 py-2 rounded-lg text-zinc-600 hover:text-primary hover:bg-blue-50 transition-all"
                  aria-haspopup="true"
                  aria-expanded={openDropdown === item.label}
                >
                  {item.label}
                  <svg className="w-3.5 h-3.5 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </Link>
                {openDropdown === item.label && (
                  <div className="absolute left-0 top-full pt-1 w-52">
                    <div className="rounded-xl border border-border/60 bg-white shadow-lg py-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2 text-zinc-600 hover:text-primary hover:bg-blue-50 transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <NavLink key={item.label} href={item.href}>
                {item.label}
              </NavLink>
            )
          )}
          <Link
            href="/search"
            className="p-2 ml-1 rounded-lg text-zinc-500 hover:text-primary hover:bg-blue-50 transition-all"
            aria-label="記事を検索"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </Link>
          <Link
            href="/career/diagnosis"
            className="ml-1 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors whitespace-nowrap"
          >
            キャリア診断
          </Link>
        </nav>

        {/* モバイルメニューボタン */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-zinc-100 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="メニュー"
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

      {/* モバイルメニュー */}
      {menuOpen && (
        <nav className="md:hidden border-t border-border/60 bg-white/95 backdrop-blur-lg px-4 py-3 flex flex-col gap-1 text-sm font-medium animate-[slideDown_0.2s_ease-out] max-h-[calc(100vh-4rem)] overflow-y-auto">
          {GLOBAL_NAV.map((item) =>
            item.children ? (
              <MobileAccordion
                key={item.label}
                item={item}
                open={expanded === item.label}
                onToggle={() => setExpanded(expanded === item.label ? null : item.label)}
                onNavigate={closeMobile}
              />
            ) : (
              <MobileNavLink key={item.label} href={item.href} onClick={closeMobile}>
                {item.label}
              </MobileNavLink>
            )
          )}
          <MobileNavLink href="/search" onClick={closeMobile}>記事を検索</MobileNavLink>
          <Link
            href="/career/diagnosis"
            onClick={closeMobile}
            className="mx-3 mt-1 px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold text-center hover:bg-primary-dark transition-colors"
          >
            キャリア診断
          </Link>
        </nav>
      )}
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-2.5 py-2 rounded-lg text-zinc-600 hover:text-primary hover:bg-blue-50 transition-all"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="px-3 py-2.5 rounded-lg text-zinc-600 hover:text-primary hover:bg-blue-50 transition-all"
    >
      {children}
    </Link>
  );
}

function MobileAccordion({
  item,
  open,
  onToggle,
  onNavigate,
}: {
  item: NavItem;
  open: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  return (
    <div>
      <div className="flex items-center">
        <Link
          href={item.href}
          onClick={onNavigate}
          className="flex-1 px-3 py-2.5 rounded-lg text-zinc-600 hover:text-primary hover:bg-blue-50 transition-all"
        >
          {item.label}
        </Link>
        <button
          onClick={onToggle}
          className="p-2.5 rounded-lg text-zinc-400 hover:text-primary hover:bg-blue-50 transition-all"
          aria-label={`${item.label}のサブメニュー`}
          aria-expanded={open}
        >
          <svg
            className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      {open && item.children && (
        <div className="ml-4 pl-2 border-l border-border/60 flex flex-col">
          {item.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              onClick={onNavigate}
              className="px-3 py-2 rounded-lg text-zinc-500 hover:text-primary hover:bg-blue-50 transition-all text-[13px]"
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
