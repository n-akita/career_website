import type { Metadata } from "next";
import { getArticlesByCategory } from "@/lib/articles";
import CategoryPage from "@/components/CategoryPage";
import type { ArticleSection } from "@/components/CategoryPage";

export const metadata: Metadata = {
  title: "転職ノウハウ",
  description:
    "5回の転職経験をもとに、職務経歴書の書き方・面接突破のコツ・転職エージェントの選び方・年収交渉の方法など、転職を成功させるための実践的なノウハウを体系的にまとめています。",
  alternates: {
    canonical: "https://nara-career.com/tenshoku",
  },
};

const sections: ArticleSection[] = [
  {
    label: "準備する",
    emoji: "📝",
    slugs: [
      "venture-to-enterprise",
      "resume-writing-guide",
      "resume-for-agents",
    ],
  },
  {
    label: "エージェントを使う",
    emoji: "🤝",
    slugs: ["agent-guide", "agent-review-8services"],
  },
  {
    label: "面接・選考を突破する",
    emoji: "🎯",
    slugs: ["job-change-count", "over-35-career-change", "high-salary-job-change"],
  },
  {
    label: "入社前に確認する",
    emoji: "✅",
    slugs: ["jtc-regret-checklist"],
  },
  {
    label: "入社後を乗り切る",
    emoji: "🏢",
    slugs: ["embarrassing-first-month"],
  },
  {
    label: "JTCのリアルを知る",
    emoji: "🔍",
    slugs: ["jtc-yurui-reality", "jtc-salary-30s"],
  },
];

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
      sections={sections}
      featured="jtc-complete-guide"
    />
  );
}
