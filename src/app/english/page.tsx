import type { Metadata } from "next";
import { getArticlesByCategory } from "@/lib/articles";
import CategoryPage from "@/components/CategoryPage";
import type { ArticleSection } from "@/components/CategoryPage";

export const metadata: Metadata = {
  title: "ビジネス英語とTOEIC｜キャリアに効く英語の実践情報",
  description:
    "英語はキャリアの武器になるのか。転職で評価されるTOEICスコアの目安、忙しい社会人の学習設計、オンライン英会話・TOEIC対策アプリの比較まで、転職5社・面接官経験者がキャリア目線で解説します。",
  alternates: {
    canonical: "https://nara-career.com/english",
  },
};

const sections: ArticleSection[] = [
  {
    label: "キャリアと英語",
    emoji: "💼",
    slugs: [
      "toeic-tenshoku-nanten",
      "toeic-rirekisho",
      "eigo-dekinai-tenshoku",
      "toeic-nensyu",
      "gaishikei-eigoryoku",
      "toeic-shoukaku",
    ],
  },
  {
    label: "学習を設計する",
    emoji: "📐",
    slugs: [
      "toeic-benkyou-shakaijin",
      "toeic-600ten",
      "toeic-700ten",
      "business-eigo-junban",
      "eikaiwa-dokugaku-app",
      "online-eikaiwa-kouka",
    ],
  },
  {
    label: "サービスで選ぶ",
    emoji: "⚖️",
    slugs: [
      "online-eikaiwa-hikaku",
      "eigo-coaching-hikaku",
      "progrit-hyouban",
      "nativecamp-hyouban",
      "dmm-eikaiwa-hyouban",
      "rarejob-hyouban",
      "bizmates-hyouban",
      "sutasapu-toeic-hyouban",
      "sutasapu-vs-app",
    ],
  },
];

export default function EnglishPage() {
  const articles = getArticlesByCategory("english");

  return (
    <CategoryPage
      enLabel="English"
      title="ビジネス英語とTOEIC"
      description="キャリアに効く英語だけを考える。スコアの目安と学習設計のすべて"
      image="/images/tenshoku.png"
      articles={articles}
      category="english"
      sections={sections}
      featured="eigo-career-guide"
      parent={null}
    />
  );
}
