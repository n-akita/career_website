"use client";

import Link from "next/link";
import type { ResultType } from "../types";

type Props = {
  result: ResultType;
};

type ArticleRec = {
  href: string;
  title: string;
  reason: string;
  level: "light" | "medium" | "strong";
};

// 診断タイプ別のおすすめ記事マッピング
const typeToArticles: Record<string, ArticleRec[]> = {
  "silent-monster": [
    {
      level: "light",
      href: "/career/mindset/environment-decides-salary",
      title: "年収は「居場所」で決まる",
      reason: "能力があるのに動かないのが一番もったいない。まずこの考え方から",
    },
    {
      level: "medium",
      href: "/career/tenshoku/agent-guide",
      title: "転職エージェントの選び方と使い方",
      reason: "動き出すなら、最初の一歩はエージェント選びから",
    },
    {
      level: "strong",
      href: "/career/mindset/career-story",
      title: "年収400万→3.5倍。5回転職した僕の全記録",
      reason: "「場所を変えるだけ」の再現性を、実例で確かめてほしい",
    },
  ],
  "lightning-mover": [
    {
      level: "light",
      href: "/career/tenshoku/jtc-complete-guide",
      title: "ベンチャーから大手への転職 完全ガイド",
      reason: "行動力に「設計」を足せば無敵。全体像をまず押さえよう",
    },
    {
      level: "medium",
      href: "/career/tenshoku/resume-writing-guide",
      title: "職務経歴書の書き方ガイド",
      reason: "勢いで出す前に、書類の質を一段上げておく",
    },
    {
      level: "strong",
      href: "/career/tenshoku/jtc-regret-checklist",
      title: "転職で後悔しないためのチェックリスト",
      reason: "スピードが武器だからこそ、見落としをここで潰す",
    },
  ],
  "iron-wall": [
    {
      level: "light",
      href: "/career/tenshoku/jtc-yurui-reality",
      title: "大手の「ゆるさ」のリアル",
      reason: "守りを固めたいあなたに、まず実態を知ってほしい",
    },
    {
      level: "medium",
      href: "/career/mindset/environment-decides-salary",
      title: "年収は「居場所」で決まる",
      reason: "安定の中でも、環境次第で年収は変わるという事実",
    },
    {
      level: "strong",
      href: "/career/story/agent-review-8services",
      title: "8社使った僕の転職エージェント格付け",
      reason: "情報収集から始めたい堅実派にこそ読んでほしい本音レビュー",
    },
  ],
  "wild-card": [
    {
      level: "light",
      href: "/career/mindset/venture-vs-enterprise-reality",
      title: "ベンチャー vs 大手のリアル比較",
      reason: "挑戦の前に、両方の世界の実態を知っておこう",
    },
    {
      level: "medium",
      href: "/career/tenshoku/high-salary-job-change",
      title: "年収を大きく上げる転職の考え方",
      reason: "その勢いを「結果」に変える具体論",
    },
    {
      level: "strong",
      href: "/career/story/from-zero-to-hero",
      title: "「何もできない」と言われた僕がやり直した話",
      reason: "挑戦には失敗もある。それでも何度でもやり直せる",
    },
  ],
  chameleon: [
    {
      level: "light",
      href: "/career/mindset/environment-decides-salary",
      title: "年収は「居場所」で決まる",
      reason: "適応力がある人ほど、環境を「選ぶ力」で差がつく",
    },
    {
      level: "medium",
      href: "/career/mindset/venture-vs-enterprise-reality",
      title: "ベンチャー vs 大手のリアル比較",
      reason: "どの環境が自分に合うか、比較の軸を持とう",
    },
    {
      level: "strong",
      href: "/career/tenshoku/jtc-complete-guide",
      title: "ベンチャーから大手への転職 完全ガイド",
      reason: "環境を変える実行フェーズの完全ロードマップ",
    },
  ],
  "sleeping-dragon": [
    {
      level: "light",
      href: "/career/mindset/career-story",
      title: "年収400万→3.5倍。5回転職した僕の全記録",
      reason: "眠っているポテンシャルが目覚めたら何が起きるか、実例で",
    },
    {
      level: "medium",
      href: "/career/story/from-zero-to-hero",
      title: "「何もできない」と言われた僕がやり直した話",
      reason: "くすぶっていた時期から抜け出した転機の話",
    },
    {
      level: "strong",
      href: "/career/tenshoku/agent-guide",
      title: "転職エージェントの選び方と使い方",
      reason: "目覚めたら、最初の実務はここから",
    },
  ],
  "grand-strategist": [
    {
      level: "light",
      href: "/career/tenshoku/jtc-complete-guide",
      title: "ベンチャーから大手への転職 完全ガイド",
      reason: "計画派のあなたに、転職活動の全体設計図を",
    },
    {
      level: "medium",
      href: "/career/tenshoku/resume-for-agents",
      title: "エージェントが動く職務経歴書の書き方",
      reason: "戦略を書類に落とし込む技術",
    },
    {
      level: "strong",
      href: "/career/tenshoku/jtc-salary-30s",
      title: "30代・大手の年収のリアル",
      reason: "計画の精度を上げるための相場観",
    },
  ],
  phoenix: [
    {
      level: "light",
      href: "/career/story/from-zero-to-hero",
      title: "「何もできない」と言われた僕がやり直した話",
      reason: "どん底からのリスタートは、僕も経験した",
    },
    {
      level: "medium",
      href: "/career/tenshoku/embarrassing-first-month",
      title: "転職直後の「恥ずかしい」時期の乗り越え方",
      reason: "新しい環境の最初の壁は、誰にでもある",
    },
    {
      level: "strong",
      href: "/career/tenshoku/over-35-career-change",
      title: "35歳からの転職戦略",
      reason: "何度目かの再起でも遅くない、という話",
    },
  ],
};

const fallbackArticles: ArticleRec[] = [
  {
    level: "light",
    href: "/career/mindset/environment-decides-salary",
    title: "年収は「居場所」で決まる",
    reason: "このサイトの核になる考え方から",
  },
  {
    level: "medium",
    href: "/career/mindset/career-story",
    title: "年収400万→3.5倍。5回転職した僕の全記録",
    reason: "「場所を変えるだけ」の再現性を実例で",
  },
  {
    level: "strong",
    href: "/career/tenshoku/jtc-complete-guide",
    title: "ベンチャーから大手への転職 完全ガイド",
    reason: "動くと決めたら、全体像をここで掴む",
  },
];

function TierBadge({ level }: { level: "light" | "medium" | "strong" }) {
  const config = {
    light: { label: "まずはここから", bg: "bg-emerald-100 text-emerald-700" },
    medium: { label: "おすすめ", bg: "bg-blue-100 text-blue-700" },
    strong: { label: "本気の方へ", bg: "bg-orange-100 text-orange-700" },
  };
  const c = config[level];
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${c.bg}`}>
      {c.label}
    </span>
  );
}

function ArticleCard({ rec }: { rec: ArticleRec }) {
  const isRecommended = rec.level === "medium";

  return (
    <Link
      href={rec.href}
      className={`block bg-white border rounded-2xl p-6 transition-all hover:shadow-md hover:-translate-y-0.5 ${
        isRecommended ? "border-blue-300 ring-2 ring-blue-100" : "border-border/60"
      }`}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <TierBadge level={rec.level} />
        </div>
        <div>
          <h3 className="text-lg font-bold mb-1">{rec.title}</h3>
          <p className="text-sm text-zinc-500 leading-relaxed">{rec.reason}</p>
        </div>
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
          記事を読む
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

export default function ActionPlan({ result }: Props) {
  const articles = typeToArticles[result.type] ?? fallbackArticles;

  return (
    <>
      {/* タイプ別おすすめ記事 */}
      <section>
        <h2 className="text-xl font-bold mb-2 flex items-center gap-3">
          <span className={`w-9 h-9 bg-gradient-to-r ${result.gradient} rounded-lg flex items-center justify-center text-white text-sm font-bold`}>&#x1F4D6;</span>
          あなたのタイプに合わせた次の一歩
        </h2>
        <p className="text-sm text-zinc-500 mb-6 ml-12">
          診断結果をふまえて、まず読んでほしい記事を選びました。
        </p>
        <div className="space-y-4">
          {articles.map((rec, i) => (
            <ArticleCard key={i} rec={rec} />
          ))}
        </div>
      </section>

      {/* 職務経歴書ガイド */}
      <div className="bg-amber-50 border border-amber-200/60 rounded-2xl p-6 md:p-8">
        <div className="flex items-start gap-3">
          <span className="text-2xl shrink-0">&#x1F4DD;</span>
          <div>
            <p className="font-bold text-amber-900 mb-2">動き出す前に、職務経歴書を</p>
            <p className="text-sm text-amber-800 leading-relaxed mb-3">
              転職活動を始めるなら、まず職務経歴書を書いておこう。完璧じゃなくていい。60%の完成度でいいから先に作る——それだけでスタートの速さが変わる。
            </p>
            <Link
              href="/career/tenshoku/resume-for-agents"
              className="inline-flex items-center gap-1 text-sm text-amber-700 font-semibold hover:underline"
            >
              エージェントが動く職務経歴書の書き方 →
            </Link>
          </div>
        </div>
      </div>

      {/* Next Action */}
      <div className={`bg-gradient-to-r ${result.gradient} rounded-2xl p-8 text-white text-center`}>
        <p className="text-xs uppercase tracking-wider mb-3 opacity-80">Next Action</p>
        <p className="text-lg md:text-xl font-bold leading-relaxed">{result.nextAction}</p>
      </div>
    </>
  );
}
