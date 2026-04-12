"use client";

import { useState } from "react";
import Link from "next/link";

type Article = {
  slug: string;
  category: string;
  title: string;
  description: string;
  tags: string[];
  date: string;
  readingTime: number;
};

const categoryLabels: Record<string, { label: string; color: string }> = {
  career: { label: "キャリア", color: "bg-blue-100 text-blue-700" },
  tenshoku: { label: "転職ノウハウ", color: "bg-indigo-100 text-indigo-700" },
  sidejob: { label: "副業", color: "bg-emerald-100 text-emerald-700" },
};

export default function SearchClient({ articles }: { articles: Article[] }) {
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? articles.filter((a) => {
        const q = query.toLowerCase();
        return (
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q))
        );
      })
    : articles;

  return (
    <>
      <div className="relative mb-8">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="キーワードで検索..."
          autoFocus
          className="w-full pl-12 pr-4 py-3.5 border border-border/60 rounded-xl bg-white text-base focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
        />
      </div>

      <p className="text-sm text-zinc-400 mb-6">
        {query.trim()
          ? `${filtered.length}件の記事が見つかりました`
          : `全${articles.length}件の記事`}
      </p>

      <div className="space-y-4">
        {filtered.map((a) => {
          const cat = categoryLabels[a.category] || {
            label: a.category,
            color: "bg-zinc-100 text-zinc-600",
          };
          return (
            <Link
              key={`${a.category}/${a.slug}`}
              href={`/${a.category}/${a.slug}`}
              className="block p-5 border border-border/60 rounded-xl bg-white hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cat.color}`}
                >
                  {cat.label}
                </span>
                <span className="text-xs text-zinc-400">{a.date}</span>
                <span className="text-xs text-zinc-400">
                  約{a.readingTime}分
                </span>
              </div>
              <h3 className="font-bold mb-1">{a.title}</h3>
              <p className="text-sm text-zinc-500 line-clamp-2">
                {a.description}
              </p>
            </Link>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-center text-zinc-400 py-12">
            該当する記事が見つかりませんでした
          </p>
        )}
      </div>
    </>
  );
}
