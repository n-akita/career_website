import type { Metadata } from "next";
import { getArticlesByCategory } from "@/lib/articles";
import CategoryPage from "@/components/CategoryPage";

export const metadata: Metadata = {
  title: "キャリアの考え方",
  description: "生涯賃金の話、環境を変える選択肢、社内で評価される方法について発信しています。",
};

export default function CareerPage() {
  const articles = getArticlesByCategory("career");

  return (
    <CategoryPage
      enLabel="Career"
      title="キャリアの考え方"
      description="生涯賃金の話、環境を変える選択肢、社内で評価される方法"
      image="/images/career.png"
      articles={articles}
      category="career"
    />
  );
}
