import type { Metadata } from "next";
import { getArticlesByCategory } from "@/lib/articles";
import CategoryPage from "@/components/CategoryPage";
import type { ArticleSection } from "@/components/CategoryPage";

export const metadata: Metadata = {
  title: "体験談ストーリー",
  description:
    "ならならが歩んだキャリアのリアル。転職現場の手触り、前職での失敗、エージェントとの面談で起きたこと。建前を外した一次情報だけをまとめています。",
  alternates: {
    canonical: "https://nara-career.com/story",
  },
};

const sections: ArticleSection[] = [
  {
    label: "転職サービスのリアル",
    emoji: "🗣️",
    slugs: ["agent-review-8services"],
  },
  {
    label: "キャリアの転機",
    emoji: "🔥",
    slugs: ["from-zero-to-hero"],
  },
];

export default function StoryPage() {
  const articles = getArticlesByCategory("story");

  return (
    <CategoryPage
      enLabel="Story"
      title="体験談ストーリー"
      description="建前を外した、ならならのキャリア一次情報"
      image="/images/career_story_hero.png"
      articles={articles}
      category="story"
      sections={sections}
    />
  );
}
