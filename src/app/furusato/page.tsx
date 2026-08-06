import type { Metadata } from "next";
import { getArticlesByCategory } from "@/lib/articles";
import CategoryPage from "@/components/CategoryPage";
import type { ArticleSection } from "@/components/CategoryPage";

export const metadata: Metadata = {
  title: "ふるさと納税の歩き方｜仕組み・限度額・サイト選びを一次情報で",
  description:
    "「ふるさと納税、やったほうがいいのは分かってるけど面倒」を解決する実践情報。仕組みと限度額の確認方法、ポイント還元禁止後のサイトの選び方、ワンストップ特例の手続き、年末駆け込みの注意点まで、毎年実践している会社員が解説します。",
  alternates: {
    canonical: "https://nara-career.com/furusato",
  },
};

const sections: ArticleSection[] = [
  {
    label: "まず仕組みを知る",
    emoji: "📖",
    slugs: ["furusato-gendogaku", "furusato-point-haishi"],
  },
  {
    label: "お得に選ぶ",
    emoji: "🎁",
    slugs: [
      "furusato-site-hikaku",
      "furusato-kangenritsu",
      "furusato-shine-muscat",
      "furusato-niku-osusume",
    ],
  },
  {
    label: "手続きで失敗しない",
    emoji: "📝",
    slugs: ["furusato-onestop", "furusato-itsumade"],
  },
];

export default function FurusatoPage() {
  const articles = getArticlesByCategory("furusato");

  return (
    <CategoryPage
      enLabel="Furusato Tax"
      title="ふるさと納税の歩き方"
      description="仕組み・限度額・サイト選びから手続きまで、会社員のふるさと納税のすべて"
      image="/images/tenshoku.png"
      articles={articles}
      category="furusato"
      sections={sections}
      featured="furusato-nouzei-guide"
      parent={null}
    />
  );
}
