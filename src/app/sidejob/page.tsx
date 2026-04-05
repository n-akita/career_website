import type { Metadata } from "next";
import { getArticlesByCategory } from "@/lib/articles";
import CategoryPage from "@/components/CategoryPage";

export const metadata: Metadata = {
  title: "副業の始め方",
  description: "副業の方法、地方DX、本業との両立について発信しています。",
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
