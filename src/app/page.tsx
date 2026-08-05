import type { Metadata } from "next";
import Link from "next/link";
import { CAREER_CATEGORIES, getAllArticles, articlePath } from "@/lib/articles";
import { CATEGORY_LABELS } from "@/lib/nav";

export const metadata: Metadata = {
  // layout 側の title.template（%s | ならならの実験場）を効かせないよう absolute で指定する
  title: { absolute: "ならならの実験場｜作ったものと使ったものの記録" },
  description:
    "現役の会社員エンジニアが、自分で作ったサービスと自分で使ったサービスを試して記録している個人サイト。作りかけのものも、使ってみて微妙だったものも、そのまま置いています。",
  alternates: {
    canonical: "https://nara-career.com",
  },
};

/**
 * トップは「読み物型サイトマップ」。
 * 何を作って何を試している場所なのかを本文で説明し、
 * 配下への導線は本文中のテキストリンクと末尾の一覧に寄せて主張を抑える。
 */

/** 末尾の索引。label は nav.ts の正本を参照し、note はそのカテゴリに何が置いてあるかの事実のみ書く。 */
const INDEX_SECTIONS: {
  label: string;
  href: string;
  note: string;
  /** 記事数の集計対象カテゴリ（複数指定でまとめて数える） */
  categories: readonly string[];
  children?: { label: string; href: string; category: string }[];
}[] = [
  {
    label: "キャリア・転職",
    href: "/career",
    note: "転職活動の進め方、エージェントの使い分け、実際に移ったときの記録。",
    categories: CAREER_CATEGORIES,
    children: [
      { label: CATEGORY_LABELS.mindset, href: "/career/mindset", category: "mindset" },
      { label: CATEGORY_LABELS.tenshoku, href: "/career/tenshoku", category: "tenshoku" },
      { label: CATEGORY_LABELS.sidejob, href: "/career/sidejob", category: "sidejob" },
      { label: CATEGORY_LABELS.story, href: "/career/story", category: "story" },
    ],
  },
  {
    label: CATEGORY_LABELS.taishoku,
    href: "/taishoku",
    note: "運営形態による違い、料金の相場、辞めたあとの動き方。",
    categories: ["taishoku"],
  },
  {
    label: CATEGORY_LABELS.shitsugyo,
    href: "/shitsugyo",
    note: "失業保険がいつ・いくらもらえるか、退職後の手続きの順番と期限。",
    categories: ["shitsugyo"],
  },
  {
    label: CATEGORY_LABELS.shikaku,
    href: "/shikaku",
    note: "通信講座の比較、教育訓練給付金、勉強の進め方。",
    categories: ["shikaku"],
  },
  {
    label: CATEGORY_LABELS.coaching,
    href: "/coaching",
    note: "コーチングの料金相場とサービス比較、無料で使える相談窓口。",
    categories: ["coaching"],
  },
  {
    label: CATEGORY_LABELS.english,
    href: "/english",
    note: "TOEICの学習設計、オンライン英会話の比較、続け方の工夫。",
    categories: ["english"],
  },
  {
    label: CATEGORY_LABELS.furusato,
    href: "/furusato",
    note: "限度額の計算、サイトの選び方、ワンストップ特例の手続き。",
    categories: ["furusato"],
  },
  {
    label: CATEGORY_LABELS.kaikei,
    href: "/kaikei",
    note: "会計ソフトの比較、インボイス対応、副業分の確定申告。",
    categories: ["kaikei"],
  },
];

export default function Home() {
  const all = getAllArticles();
  const recent = all
    .slice()
    .sort((a, b) => ((a.updated || a.date) > (b.updated || b.date) ? -1 : 1))
    .slice(0, 10);

  // 記事数はカテゴリごとに一度だけ集計する（getArticlesByCategory は都度 fs を読むため）
  const countByCategory = all.reduce<Record<string, number>>((acc, a) => {
    acc[a.category] = (acc[a.category] ?? 0) + 1;
    return acc;
  }, {});
  const countOf = (categories: readonly string[]) =>
    categories.reduce((n, c) => n + (countByCategory[c] ?? 0), 0);

  return (
    <div className="max-w-2xl mx-auto px-5 py-14 md:py-20">
      {/* 名乗り */}
      <header className="mb-14">
        <p className="text-[11px] tracking-[0.2em] text-zinc-400 mb-3">NARA-CAREER.COM</p>
        <h1 className="text-2xl md:text-[28px] font-bold tracking-tight mb-4">
          ならならの実験場
        </h1>
        <p className="text-[15px] text-zinc-600 leading-[1.9]">
          現役の会社員エンジニアが、自分で作ったサービスと、自分で使ってみたサービスを
          記録している個人サイトです。
        </p>
      </header>

      <Section title="この実験場について">
        <p>
          「実験場」と名前をつけたのは、完成品を並べる場所ではないからです。
          動くところまで持っていけたものも、途中で放り出したものも、
          使ってみて期待外れだったものも、判断した理由ごとそのまま残しています。
        </p>
        <p>
          扱う範囲はだいぶ散らかっていて、下の索引を見てもらうとわかるとおり
          テーマに一貫性はありません。共通しているのは
          <strong className="font-semibold text-zinc-800">
            「自分で作ったもの」か「自分で金を払って使ったもの」しか書いていない
          </strong>
          という一点だけです。カタログを写して並べただけのページは置いていません。
        </p>
      </Section>

      <Section title="作っているもの">
        <p>
          このサイト自体が実験のひとつです。Next.js で一から組んで Vercel に載せ、
          記事はすべて Markdown で管理しています。
          全文検索（<TextLink href="/search">検索</TextLink>）も、
          いくつかの質問に答えると結果が出る
          <TextLink href="/career/diagnosis">診断ツール</TextLink>も、
          自前で書いたものです。
        </p>
        <p>
          表に出ていない部分のほうが実験としては本番で、更新をSNSへ流す自動投稿の仕組み、
          アクセス解析のデータを取ってきて手を入れるべきページを洗い出す仕組みあたりを組んで動かしています。
          このへんは今も壊しては直しているところ。
          更新は{" "}
          {/* feed.xml は Route Handler なのでクライアント遷移させず素の <a> で出す */}
          <a
            href="/feed.xml"
            className="text-zinc-700 underline decoration-zinc-300 underline-offset-[3px] hover:text-primary hover:decoration-primary transition-colors"
          >
            RSS
          </a>{" "}
          でも配信しています。
        </p>
      </Section>

      <Section title="使ってみたもの">
        <p>
          もうひとつの実験が、世の中のサービスを実際に申し込んで最後まで使ってみることです。
          申し込みの画面で詰まったところ、解約するときにどうだったか、
          料金に見合ったかどうか——使った人にしか書けない部分だけを残すようにしています。
        </p>
        <p>
          結果として、良かったものと同じくらい「合わなかった」記録も溜まりました。
          どちらも同じ扱いで置いてあります。
        </p>
      </Section>

      {/* 最近の更新 */}
      <Section title="最近の更新">
        <ul className="space-y-2.5 mt-1">
          {recent.map((a) => (
            <li key={`${a.category}/${a.slug}`} className="flex gap-3 text-[14px] leading-relaxed">
              <time
                dateTime={a.updated || a.date}
                className="shrink-0 text-zinc-400 tabular-nums text-[13px] pt-px"
              >
                {(a.updated || a.date).replace(/-/g, ".")}
              </time>
              <Link
                href={articlePath(a)}
                className="text-zinc-600 underline decoration-zinc-300 underline-offset-[3px] hover:text-primary hover:decoration-primary transition-colors"
              >
                {a.title}
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* 索引 */}
      <Section title="索引">
        <p className="mb-6">全{all.length}本を、テーマごとに分けて置いています。</p>
        <div className="space-y-6">
          {INDEX_SECTIONS.map((s) => (
            <section key={s.href}>
              <p className="flex items-baseline gap-2">
                <Link
                  href={s.href}
                  className="text-[15px] font-semibold text-zinc-700 underline decoration-zinc-300 underline-offset-4 hover:text-primary hover:decoration-primary transition-colors"
                >
                  {s.label}
                </Link>
                <span className="text-[12px] text-zinc-400 tabular-nums">
                  {countOf(s.categories)}本
                </span>
              </p>
              <p className="text-[13.5px] text-zinc-500 leading-relaxed mt-1">{s.note}</p>
              {s.children && (
                <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[13px]">
                  {s.children.map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      className="text-zinc-500 underline decoration-zinc-200 underline-offset-[3px] hover:text-primary hover:decoration-primary transition-colors"
                    >
                      {c.label}
                      <span className="text-zinc-400 tabular-nums ml-1">
                        {countByCategory[c.category] ?? 0}
                      </span>
                    </Link>
                  ))}
                </p>
              )}
            </section>
          ))}
        </div>
      </Section>

      {/* サイト情報 */}
      <Section title="このサイトについて">
        <p className="flex flex-wrap gap-x-5 gap-y-2 text-[14px]">
          {[
            { label: "運営者", href: "/about" },
            { label: "お問い合わせ", href: "/contact" },
            { label: "プライバシーポリシー", href: "/privacy" },
            { label: "免責事項", href: "/disclaimer" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-zinc-500 underline decoration-zinc-300 underline-offset-[3px] hover:text-primary hover:decoration-primary transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </p>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12 md:mb-14">
      <h2 className="text-[13px] font-bold tracking-[0.14em] text-zinc-400 mb-4 pb-2 border-b border-border/70">
        {title}
      </h2>
      <div className="space-y-4 text-[15px] text-zinc-600 leading-[1.95]">{children}</div>
    </section>
  );
}

function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-zinc-700 underline decoration-zinc-300 underline-offset-[3px] hover:text-primary hover:decoration-primary transition-colors"
    >
      {children}
    </Link>
  );
}
