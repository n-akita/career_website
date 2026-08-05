import type { Metadata } from "next";
import { getArticlesByCategory } from "@/lib/articles";
import CategoryPage from "@/components/CategoryPage";
import type { ArticleSection } from "@/components/CategoryPage";

export const metadata: Metadata = {
  title: "光回線とネット環境｜卸構造から見た選び方",
  description:
    "光回線はどこを選んでも同じ回線を借りている——光コラボの卸構造から料金差の理由を解説します。高額キャッシュバックの原資、受け取れない典型パターン、マンションの配線方式と速度の上限まで、通信業界にいた視点で整理しました。",
  alternates: {
    canonical: "https://nara-career.com/hikari",
  },
};

const sections: ArticleSection[] = [
  {
    label: "仕組みを知ってから選ぶ",
    emoji: "🔍",
    slugs: ["hikari-collabo-shikumi"],
  },
  {
    label: "自分に合う回線を選ぶ",
    emoji: "🌐",
    slugs: ["hikari-hikaku", "mansion-hikari"],
  },
];

export default function HikariPage() {
  const articles = getArticlesByCategory("hikari");

  return (
    <CategoryPage
      enLabel="Fiber"
      title="光回線とネット環境"
      description="同じ回線を借りているのに、なぜ料金が違うのか。構造から選び方を考えます"
      image="/images/tenshoku.png"
      articles={articles}
      category="hikari"
      sections={sections}
      featured="hikari-hikaku"
      parent={null}
    />
  );
}
