import type { Metadata } from "next";
import { getArticlesByCategory } from "@/lib/articles";
import CategoryPage from "@/components/CategoryPage";
import type { ArticleSection } from "@/components/CategoryPage";

export const metadata: Metadata = {
  title: "失業保険と退職後の手続き｜いつ・いくら・何をするかを一次情報で",
  description:
    "「退職したあと、何をすればいいのか分からない」を解決する実践情報。失業保険がいつからいくらもらえるか（2025年4月の給付制限短縮に対応）、健康保険・年金・住民税の手続きの順番と期限、給付金サポートの実態まで、公式情報ベースで解説します。",
  alternates: {
    canonical: "https://nara-career.com/shitsugyo",
  },
};

const sections: ArticleSection[] = [
  {
    label: "まずもらえるお金を知る",
    emoji: "💰",
    slugs: ["jikotsugou-itsukara", "ikura-keisan"],
  },
  {
    label: "手続きを進める",
    emoji: "📋",
    slugs: ["moraikata-nagare", "taishokudaiko-shitsugyohoken", "hokensho-kirikae", "baito-fukugyo"],
  },
  {
    label: "サポートを検討する",
    emoji: "🤝",
    slugs: ["kyufukin-support-hikaku"],
  },
];

export default function ShitsugyoPage() {
  const articles = getArticlesByCategory("shitsugyo");

  return (
    <CategoryPage
      enLabel="After Resignation"
      title="失業保険と退職後の手続き"
      description="いつ・いくらもらえるかから、健康保険・年金・住民税まで。退職後にやることのすべて"
      image="/images/tenshoku.png"
      articles={articles}
      category="shitsugyo"
      sections={sections}
      featured="taishokugo-tetsuduki-list"
      parent={null}
    />
  );
}
