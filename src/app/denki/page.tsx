import type { Metadata } from "next";
import { getArticlesByCategory } from "@/lib/articles";
import CategoryPage from "@/components/CategoryPage";
import type { ArticleSection } from "@/components/CategoryPage";

export const metadata: Metadata = {
  title: "電気・ガスと固定費｜補助金と乗り換えの現実的な判断",
  description:
    "電気代の補助はいつまで、いくらなのか。電力会社を乗り換えると本当に何が変わるのか。市場連動型プランのリスクや賃貸での可否、退職・転職の空白期間に固定費をどの順番で削るかまで、公式情報をもとに整理しています。",
  alternates: {
    canonical: "https://nara-career.com/denki",
  },
};

const sections: ArticleSection[] = [
  {
    label: "制度を把握する",
    emoji: "📄",
    slugs: ["denkidai-hojokin"],
  },
  {
    label: "乗り換えを検討する",
    emoji: "🔌",
    slugs: ["denryoku-norikae-demerit"],
  },
  {
    label: "人生イベントで見直す",
    emoji: "📉",
    slugs: ["taishoku-koteihi-minaoshi"],
  },
];

export default function DenkiPage() {
  const articles = getArticlesByCategory("denki");

  return (
    <CategoryPage
      enLabel="Utilities"
      title="電気・ガスと固定費"
      description="補助金の実態と、乗り換えの本当のデメリット。数字で判断するための材料をまとめます"
      image="/images/tenshoku.png"
      articles={articles}
      category="denki"
      sections={sections}
      featured="denryoku-norikae-demerit"
      parent={null}
    />
  );
}
