import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticle, getArticlesByCategory } from "@/lib/articles";
import ArticlePage from "@/components/ArticlePage";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const articles = getArticlesByCategory("story");
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle("story", slug);
  if (!article) return {};
  const ogParams = new URLSearchParams({ title: article.title, category: "story" });
  const imageUrl = `https://nara-career.com/api/og/article?${ogParams}`;
  return {
    title: article.title,
    description: article.description,
    alternates: {
      canonical: `https://nara-career.com/story/${slug}`,
    },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.description,
      images: [{ url: imageUrl, width: 1200, height: 630 }],
      publishedTime: article.date,
      modifiedTime: article.updated || article.date,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: [imageUrl],
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const article = getArticle("story", slug);
  if (!article) notFound();
  return <ArticlePage article={article} />;
}
