import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticle, getArticlesByCategory } from "@/lib/articles";
import ArticlePage from "@/components/ArticlePage";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const articles = getArticlesByCategory("career");
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle("career", slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const article = getArticle("career", slug);
  if (!article) notFound();
  return <ArticlePage article={article} />;
}
