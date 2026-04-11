"use client";

import { useState } from "react";

type TocItem = { id: string; text: string; level: number };

export default function TableOfContents({ content }: { content: string }) {
  const [open, setOpen] = useState(false);

  // Markdownからh2, h3を抽出
  const headings: TocItem[] = [];
  const lines = content.split("\n");
  for (const line of lines) {
    if (line.startsWith("### ")) {
      const text = line.slice(4).trim();
      headings.push({ id: toId(text), text, level: 3 });
    } else if (line.startsWith("## ")) {
      const text = line.slice(3).trim();
      headings.push({ id: toId(text), text, level: 2 });
    }
  }

  if (headings.length < 3) return null;

  return (
    <nav className="my-8 bg-zinc-50 border border-border/60 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-zinc-100 transition-colors"
      >
        <span className="font-bold text-sm flex items-center gap-2">
          <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
          </svg>
          目次
          <span className="text-xs text-zinc-400 font-normal">（{headings.length}セクション）</span>
        </span>
        <svg
          className={`w-4 h-4 text-zinc-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-6 pb-5 space-y-1">
          {headings.map((h, i) => (
            <a
              key={i}
              href={`#${h.id}`}
              className={`block text-sm hover:text-primary transition-colors ${
                h.level === 3 ? "pl-4 text-zinc-500" : "text-zinc-700 font-medium"
              } py-1`}
            >
              {h.text}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}

function toId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\u3000-\u9fff\uff00-\uffef]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
