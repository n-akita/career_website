import type { Metadata } from "next";
import { getArticlesByCategory } from "@/lib/articles";
import CategoryPage from "@/components/CategoryPage";
import type { ArticleSection } from "@/components/CategoryPage";

export const metadata: Metadata = {
  title: "会計ソフトと確定申告のリアル｜個人事業主・副業会社員のお金の手続き",
  description:
    "「確定申告、何から手をつければいいか分からない」を解決する実践情報。freee・マネーフォワード・弥生の選び方、インボイスや電子帳簿保存法への対応、副業会社員の確定申告まで、毎年自分で申告している運営者が解説します。",
  alternates: {
    canonical: "https://nara-career.com/kaikei",
  },
};

const sections: ArticleSection[] = [
  {
    label: "会計ソフトを選ぶ",
    emoji: "🧾",
    slugs: ["freee-mf-hikaku",
      "kaikei-soft-yasui", "freee-hyouban", "moneyforward-hyouban"],
  },
  {
    label: "制度に対応する",
    emoji: "🏛️",
    slugs: ["invoice-kojin-taiou", "denchoho-kojin"],
  },
  {
    label: "確定申告をやり切る",
    emoji: "💴",
    slugs: ["fukugyou-kakuteishinkoku"],
  },
];

export default function KaikeiPage() {
  const articles = getArticlesByCategory("kaikei");

  return (
    <CategoryPage
      enLabel="Accounting"
      title="会計ソフトと確定申告のリアル"
      description="個人事業主・フリーランス・副業会社員のための、会計ソフト選びと税の手続き"
      image="/images/sidejob.png"
      articles={articles}
      category="kaikei"
      sections={sections}
      featured="kaikei-soft-erabikata"
      parent={null}
    />
  );
}
