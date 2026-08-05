import type { Metadata } from "next";
import { getArticlesByCategory } from "@/lib/articles";
import CategoryPage from "@/components/CategoryPage";
import type { ArticleSection } from "@/components/CategoryPage";

export const metadata: Metadata = {
  title: "スマホ代と通信費｜料金の仕組みから見直す固定費",
  description:
    "携帯料金がなぜ高いのか、その設計の理由から解説します。ショップで付いた不要オプションの外し方、実質○円のカラクリ、親のスマホ代の下げ方まで。通信業界にいた経験をもとに、比較表だけでは見えない構造を整理しました。",
  alternates: {
    canonical: "https://nara-career.com/sim",
  },
};

const sections: ArticleSection[] = [
  {
    label: "まず仕組みを知る",
    emoji: "🔍",
    slugs: ["why-phone-bill-high", "shop-option-trap"],
  },
  {
    label: "実際に下げる",
    emoji: "📉",
    slugs: ["senior-sim"],
  },
];

export default function SimPage() {
  const articles = getArticlesByCategory("sim");

  return (
    <CategoryPage
      enLabel="Mobile"
      title="スマホ代と通信費"
      description="比較表の前に、料金がなぜその値段なのかを知る。通信業界にいた視点で整理しています"
      image="/images/tenshoku.png"
      articles={articles}
      category="sim"
      sections={sections}
      featured="why-phone-bill-high"
      parent={null}
    />
  );
}
