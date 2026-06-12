import type { Metadata } from "next";
import { getArticlesByCategory } from "@/lib/articles";
import CategoryPage from "@/components/CategoryPage";
import type { ArticleSection } from "@/components/CategoryPage";

export const metadata: Metadata = {
  title: "資格とリスキリング｜転職に効く学び直しの実践情報",
  description:
    "転職・年収アップに本当に効く資格はどれか。宅建・簿記・FPの難易度と勉強法、独学と通信講座の使い分け、教育訓練給付金の活用まで、採用側も経験したマーケターが実務目線で解説します。",
  alternates: {
    canonical: "https://nara-career.com/shikaku",
  },
};

const sections: ArticleSection[] = [
  {
    label: "宅建を取る",
    emoji: "🏠",
    slugs: [
      "takken-nanido-benkyou-jikan",
      "takken-dokugaku-vs-tsushin",
      "takken-benkyou-schedule",
      "takken-kyufukin",
    ],
  },
  {
    label: "簿記を取る",
    emoji: "🧾",
    slugs: [
      "boki-nanido-benkyou-jikan",
      "boki-dokugaku-vs-tsushin",
      "boki-benkyou-houhou",
      "boki-tenshoku-katsuyou",
    ],
  },
  {
    label: "FPを取る",
    emoji: "💴",
    slugs: [
      "fp-nanido-benkyou-jikan",
      "fp-dokugaku-vs-tsushin",
      "fp-benkyou-houhou",
      "fp-shigoto-katsuyou",
    ],
  },
  {
    label: "講座を比べる",
    emoji: "⚖️",
    slugs: [
      "takken-tsushin-kouza-hikaku",
      "boki-tsushin-kouza-hikaku",
      "fp-tsushin-kouza-hikaku",
      "studying-hyouban",
      "agaroot-hyouban",
      "foresight-hyouban",
    ],
  },
  {
    label: "IT・AIスキルを学ぶ",
    emoji: "🤖",
    slugs: [
      "kyufukin-programming-school",
      "seisei-ai-school",
      "techacademy-hyouban",
    ],
  },
  {
    label: "制度を使い倒す",
    emoji: "🏛️",
    slugs: ["kyouiku-kunren-kyufukin-guide", "reskilling-hojokin-school"],
  },
];

export default function ShikakuPage() {
  const articles = getArticlesByCategory("shikaku");

  return (
    <CategoryPage
      enLabel="Reskilling"
      title="資格とリスキリング"
      description="転職・年収アップに効く資格の選び方と、社会人の学び直しのすべて"
      image="/images/career.png"
      articles={articles}
      category="shikaku"
      sections={sections}
      featured="tenshoku-shikaku-guide"
      parent={null}
    />
  );
}
