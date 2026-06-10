import type { Metadata } from "next";
import { getArticlesByCategory } from "@/lib/articles";
import CategoryPage from "@/components/CategoryPage";
import type { ArticleSection } from "@/components/CategoryPage";

export const metadata: Metadata = {
  title: "退職のリアル｜安全な退職代行の選び方",
  description:
    "「会社を辞めたいのに言えない」を解決するための実践情報。退職代行の安全な選び方・労働組合と弁護士の違い・料金比較・使われた側の管理職が見た実情まで、一次情報で解説します。",
  alternates: {
    canonical: "https://nara-career.com/taishoku",
  },
};

const sections: ArticleSection[] = [
  {
    label: "安全に選ぶ",
    emoji: "🛡️",
    slugs: ["union-lawyer-difference", "taishoku-daiko-legality", "momuri-arrest-aftermath"],
  },
  {
    label: "料金で比べる",
    emoji: "💰",
    slugs: ["cheap-postpay-comparison"],
  },
  {
    label: "不安を解消する",
    emoji: "💭",
    slugs: ["guilt-feeling", "hr-manager-perspective"],
  },
  {
    label: "辞めた後を考える",
    emoji: "🚀",
    slugs: ["after-taishoku-tenshoku"],
  },
];

export default function TaishokuPage() {
  const articles = getArticlesByCategory("taishoku");

  return (
    <CategoryPage
      enLabel="Resignation"
      title="退職のリアル"
      description="安全な退職代行の選び方と、会社を辞める前後のすべて"
      image="/images/tenshoku.png"
      articles={articles}
      category="taishoku"
      sections={sections}
      featured="taishoku-daiko-guide"
      parent={null}
    />
  );
}
