import type { Metadata } from "next";
import { getAllArticles } from "@/lib/articles";
import SearchClient from "@/components/SearchClient";

export const metadata: Metadata = {
  title: "記事を検索",
  description: "会社員の居場所戦略の全記事からキーワードで検索できます。",
};

export default function SearchPage() {
  const articles = getAllArticles().map((a) => ({
    slug: a.slug,
    category: a.category,
    title: a.title,
    description: a.description,
    tags: a.tags,
    date: a.date,
    readingTime: a.readingTime,
  }));

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">記事を検索</h1>
      <SearchClient articles={articles} />
    </div>
  );
}
