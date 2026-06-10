import type { Metadata } from "next";
import { getArticlesByCategory } from "@/lib/articles";
import CategoryPage from "@/components/CategoryPage";
import type { ArticleSection } from "@/components/CategoryPage";

export const metadata: Metadata = {
  title: "キャリア相談とコーチング｜迷いを整理する実践情報",
  description:
    "「このままでいいのか」と迷ったときの相談先選びと思考整理の実践情報。キャリアの棚卸しのやり方、無料相談と有料コーチングの違い、ポジウィル・マジキャリ等の比較まで、転職5社・面接官経験者が本音で解説します。",
  alternates: {
    canonical: "https://nara-career.com/coaching",
  },
};

const sections: ArticleSection[] = [
  {
    label: "迷いを整理する",
    emoji: "🧩",
    slugs: [
      "career-meiko-30dai",
      "yametai-yaritaikoto-nai",
      "tenshoku-subekika",
      "career-tanaoroshi",
      "jiko-bunseki-shakaijin",
    ],
  },
  {
    label: "相談先を知る",
    emoji: "🗺️",
    slugs: [
      "career-soudan-dareni",
      "muryou-career-soudan",
      "coaching-agent-chigai",
      "career-soudan-20dai",
      "career-soudan-40dai",
      "nensyu-agetai-soudan",
    ],
  },
  {
    label: "不安に答える",
    emoji: "💭",
    slugs: ["coaching-ayashii", "coaching-ryoukin-souba"],
  },
  {
    label: "サービスで選ぶ",
    emoji: "⚖️",
    slugs: [
      "coaching-hikaku",
      "posiwill-hyouban",
      "majicari-hyouban",
      "kizuku-hyouban",
      "careet-hyouban",
      "lifeshiftlab-hyouban",
    ],
  },
];

export default function CoachingPage() {
  const articles = getArticlesByCategory("coaching");

  return (
    <CategoryPage
      enLabel="Coaching"
      title="キャリア相談とコーチング"
      description="「このままでいいのか」に答えを出す。相談先の選び方と思考整理のすべて"
      image="/images/sidejob.png"
      articles={articles}
      category="coaching"
      sections={sections}
      featured="coaching-erabikata-guide"
      parent={null}
    />
  );
}
