import type { Metadata } from "next";
import { getArticlesByCategory } from "@/lib/articles";
import CategoryPage from "@/components/CategoryPage";
import type { ArticleSection } from "@/components/CategoryPage";

export const metadata: Metadata = {
  title: "キャリアの考え方",
  description:
    "年収を上げるのは「能力」ではなく「環境」。5回の転職で年収3.5倍を実現した運営者が、生涯賃金の考え方・環境を変える選択肢・社内で評価される方法をリアルな体験談とともに解説します。",
  alternates: {
    canonical: "https://nara-career.com/career",
  },
};

const sections: ArticleSection[] = [
  {
    label: "居場所戦略の考え方",
    emoji: "💡",
    slugs: ["environment-decides-salary", "venture-vs-enterprise-reality"],
  },
  {
    label: "僕のキャリア体験談",
    emoji: "📖",
    slugs: [
      "keio-to-venture",
      "two-billion-yen-night",
      "from-zero-to-hero",
    ],
  },
  {
    label: "年収を上げる知識",
    emoji: "📊",
    slugs: ["dx-talent-salary"],
  },
];

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
      sections={sections}
      featured="career-story"
    />
  );
}
