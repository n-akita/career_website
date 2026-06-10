import type { MetadataRoute } from "next";
import {
  getAllArticles,
  getArticlesByCategory,
  articlePath,
  categoryPath,
  CAREER_CATEGORIES,
  GENRE_CATEGORIES,
} from "@/lib/articles";

const BASE_URL = "https://nara-career.com";

/** カテゴリ配下の記事の最新更新日（記事がなければ固定日付） */
function latestDate(articles: { date: string; updated: string }[], fallback: string): Date {
  const dates = articles.map((a) => a.updated || a.date).filter(Boolean);
  if (dates.length === 0) return new Date(fallback);
  return new Date(dates.reduce((max, d) => (d > max ? d : max)));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles();

  const articleEntries = articles.map((a) => ({
    url: `${BASE_URL}${articlePath(a)}`,
    lastModified: new Date(a.updated || a.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // キャリア配下のカテゴリは常時掲載、独立ジャンルは記事が公開されてから掲載する
  const listedCategories = [
    ...CAREER_CATEGORIES,
    ...GENRE_CATEGORIES.filter((cat) => getArticlesByCategory(cat).length > 0),
  ];

  const categoryEntries = listedCategories.map((cat) => ({
    url: `${BASE_URL}${categoryPath(cat)}`,
    lastModified: latestDate(getArticlesByCategory(cat), "2026-04-01"),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: latestDate(articles, "2026-04-01"),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/career`,
      lastModified: latestDate(articles, "2026-04-01"),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    ...categoryEntries,
    {
      url: `${BASE_URL}/career/diagnosis`,
      lastModified: new Date("2026-06-10"),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date("2026-06-10"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date("2026-06-10"),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date("2026-04-01"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/disclaimer`,
      lastModified: new Date("2026-06-10"),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    ...articleEntries,
  ];
}
