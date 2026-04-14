import type { Metadata } from "next";
import { getArticlesByCategory } from "@/lib/articles";
import CategoryPage from "@/components/CategoryPage";

export const metadata: Metadata = {
  title: "副業の始め方",
  description:
    "本業の経験を活かした副業の始め方を解説。地方自治体のDX推進・スポットコンサルなど、会社員が無理なく始められる副業の方法と、本業との両立のコツを実体験ベースで紹介します。",
  alternates: {
    canonical: "https://nara-career.com/sidejob",
  },
};

export default function SidejobPage() {
  const articles = getArticlesByCategory("sidejob");

  return (
    <CategoryPage
      enLabel="Side Job"
      title="副業の始め方"
      description="副業の方法、地方DX、本業との両立"
      image="/images/sidejob.png"
      articles={articles}
      category="sidejob"
    />
  );
}
