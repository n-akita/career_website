"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b border-border/60 bg-white/80 backdrop-blur-lg sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl">🏢</span>
          <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent group-hover:from-blue-500 group-hover:to-blue-700 transition-all">
            ビジネスマンの居場所戦略
          </span>
        </Link>

        {/* デスクトップメニュー */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          <NavLink href="/career">キャリアの考え方</NavLink>
          <NavLink href="/tenshoku">転職ノウハウ</NavLink>
          <NavLink href="/sidejob">副業の始め方</NavLink>
          <NavLink href="/about">ならならについて</NavLink>
          <Link
            href="/diagnosis"
            className="ml-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors"
          >
            ならなら式転職診断
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
        <nav className="md:hidden border-t border-border/60 bg-white/95 backdrop-blur-lg px-4 py-3 flex flex-col gap-1 text-sm font-medium">
          <MobileNavLink href="/career" onClick={() => setMenuOpen(false)}>キャリアの考え方</MobileNavLink>
          <MobileNavLink href="/tenshoku" onClick={() => setMenuOpen(false)}>転職ノウハウ</MobileNavLink>
          <MobileNavLink href="/sidejob" onClick={() => setMenuOpen(false)}>副業の始め方</MobileNavLink>
          <MobileNavLink href="/about" onClick={() => setMenuOpen(false)}>ならならについて</MobileNavLink>
          <Link
            href="/diagnosis"
            onClick={() => setMenuOpen(false)}
            className="mx-3 mt-1 px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold text-center hover:bg-primary-dark transition-colors"
          >
            ならなら式転職診断
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
      className="px-3 py-2 rounded-lg text-zinc-600 hover:text-primary hover:bg-blue-50 transition-all"
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
