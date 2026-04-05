import type { Metadata } from "next";
import { getArticlesByCategory } from "@/lib/articles";
import CategoryPage from "@/components/CategoryPage";

export const metadata: Metadata = {
  title: "転職ノウハウ",
  description: "職務経歴書の書き方、面接戦略、年収の上げ方など、転職を成功させるためのノウハウを発信しています。",
};

export default function TenshokuPage() {
  const articles = getArticlesByCategory("tenshoku");

  return (
    <CategoryPage
      enLabel="Job Change"
      title="転職ノウハウ"
      description="職務経歴書の書き方、面接戦略、年収の上げ方"
      image="/images/tenshoku.png"
      articles={articles}
      category="tenshoku"
    />
  );
}
