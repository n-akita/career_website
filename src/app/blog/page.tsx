import type { Metadata } from "next";
import { getArticlesByCategory } from "@/lib/articles";
import CategoryPage from "@/components/CategoryPage";
import type { ArticleSection } from "@/components/CategoryPage";

export const metadata: Metadata = {
  title: "副業ブログの実験室｜会社員が始めるときの費用・住民税・続けた結果",
  description:
    "会社員が副業でブログを始めるための実践情報。レンタルサーバーの選び方と実質月額、会社にばれない住民税の扱い、1年続けた収益の現実、確定申告のライン。このサイト自体を実験台にして記録しています。",
  alternates: {
    canonical: "https://nara-career.com/blog",
  },
};

const sections: ArticleSection[] = [
  {
    label: "始める前に知っておく",
    emoji: "🧭",
    slugs: ["fukugyou-blog-bareru"],
  },
  {
    label: "道具を選ぶ",
    emoji: "🛠️",
    slugs: ["rental-server-hikaku", "xserver-conoha-dochira"],
  },
  {
    label: "続けた先の話",
    emoji: "📈",
    slugs: ["blog-1nenme-genjitsu", "blog-kakuteishinkoku"],
  },
];

export default function BlogPage() {
  const articles = getArticlesByCategory("blog");

  return (
    <CategoryPage
      enLabel="Side Blog"
      title="副業ブログの実験室"
      description="このサイト自体が実験台。費用・住民税・続けた結果を、包み隠さず記録しています"
      image="/images/tenshoku.png"
      articles={articles}
      category="blog"
      sections={sections}
      featured="fukugyou-blog-hajimekata"
      parent={null}
    />
  );
}
