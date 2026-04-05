"use client";

import { useState, useCallback, useEffect } from "react";
import { affiliateServices } from "@/lib/affiliates";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

type Choice = { label: string; value: string; icon: string };
type Question = { id: string; question: string; sub: string; choices: Choice[] };

const questions: Question[] = [
  {
    id: "company",
    question: "今の会社はどんなタイプ？",
    sub: "現在の勤務先に近いものを選んでください",
    choices: [
      { label: "ベンチャー・スタートアップ（〜100人）", value: "venture", icon: "🚀" },
      { label: "中小企業（100〜1,000人）", value: "mid", icon: "🏢" },
      { label: "大手企業・JTC（1,000人以上）", value: "large", icon: "🏛️" },
      { label: "フリーランス・個人事業主", value: "freelance", icon: "💻" },
    ],
  },
  {
    id: "salary",
    question: "今の年収はどのくらい？",
    sub: "おおよその範囲で構いません",
    choices: [
      { label: "〜400万円", value: "under400", icon: "📊" },
      { label: "400〜600万円", value: "400to600", icon: "📈" },
      { label: "600〜800万円", value: "600to800", icon: "💰" },
      { label: "800万円以上", value: "over800", icon: "💎" },
    ],
  },
  {
    id: "pain",
    question: "一番つらいのはどれ？",
    sub: "今の環境で最もストレスに感じること",
    choices: [
      { label: "給料が低い・上がらない", value: "salary", icon: "😤" },
      { label: "スキルが身につかない・成長できない", value: "growth", icon: "😰" },
      { label: "激務・ワークライフバランスが崩壊", value: "worklife", icon: "😵" },
      { label: "上司・人間関係がつらい", value: "relation", icon: "😞" },
    ],
  },
  {
    id: "goal",
    question: "転職で一番叶えたいことは？",
    sub: "優先順位が一番高いもの",
    choices: [
      { label: "年収を上げたい", value: "money", icon: "💴" },
      { label: "スキルアップしたい", value: "skill", icon: "⚡" },
      { label: "ワークライフバランスを改善したい", value: "balance", icon: "🌿" },
      { label: "自分の市場価値を知りたい", value: "value", icon: "🔍" },
    ],
  },
  {
    id: "action",
    question: "転職活動の状況は？",
    sub: "今のあなたに一番近いもの",
    choices: [
      { label: "まだ何もしていない", value: "nothing", icon: "🤔" },
      { label: "情報収集を始めたところ", value: "research", icon: "📖" },
      { label: "職務経歴書を書いている", value: "writing", icon: "✍️" },
      { label: "すでに応募・面接中", value: "active", icon: "🏃" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Result logic                                                       */
/* ------------------------------------------------------------------ */

type ServiceRef = { id: string; reason: string };
type ResultType = {
  type: string;
  title: string;
  emoji: string;
  color: string;
  gradient: string;
  message: string;
  advice: string[];
  serviceRefs: ServiceRef[];
  nextAction: string;
};

function getResult(answers: Record<string, string>): ResultType {
  const { company, salary, pain, goal, action } = answers;

  if (
    (company === "venture" || company === "mid") &&
    (salary === "under400" || salary === "400to600")
  ) {
    return {
      type: "environment-change",
      title: "環境チェンジで\n年収ジャンプ型",
      emoji: "🚀",
      color: "text-orange-400",
      gradient: "from-orange-500 to-red-500",
      message:
        "あなたのスキルは、今の会社では「普通」かもしれません。でも大手企業に持っていけば「希少」になります。同じスキルでも、居場所を変えるだけで年収は大きく跳ねる可能性があります。",
      advice: [
        "まず転職エージェントに登録して、自分の市場価値を客観的に知る",
        "職務経歴書は「やったこと」ではなく「動かしたこと」を書く",
        "大企業のDX部門・新規事業部門を狙い撃ちする",
        "年収交渉はエージェントに任せる",
      ],
      serviceRefs: [
        { id: "doda", reason: "大企業の案件が豊富。ベンチャー経験を大企業向けに「翻訳」してくれるエージェントが見つかりやすい" },
        { id: "bizreach", reason: "スカウト型なので、自分の市場価値を知るだけでも価値がある。登録しておくだけでOK" },
      ],
      nextAction: "まずはdodaに登録して、エージェントに「自分のスキルは大手でいくらになるか？」を聞いてみよう。",
    };
  }

  if (company === "large" && pain === "growth") {
    return {
      type: "skill-up",
      title: "スキルアップ\n環境シフト型",
      emoji: "📈",
      color: "text-emerald-400",
      gradient: "from-emerald-500 to-teal-500",
      message:
        "給料は悪くないけど、スキルが身につかない。「この会社でしか通用しない人間」になる恐怖。あなたの悩みは正しいです。DXに力を入れている企業や、裁量が大きいポジションへの転職で、年収を維持しながら成長環境を手に入れられます。",
      advice: [
        "年収を下げずに環境を変えられる案件を探す（ハイクラスエージェント推奨）",
        "DX推進・新規事業など「手触り感のある仕事」ができるポジションを狙う",
        "副業も検討する——本業の安定を維持しつつ、副業で成長機会を得る",
      ],
      serviceRefs: [
        { id: "jac", reason: "ハイクラス特化。年収を維持しつつ環境を変えたい人に最適。企業の内情に詳しい" },
        { id: "bizreach", reason: "スカウトで自分の市場価値を確認。副業案件も掲載されている" },
      ],
      nextAction: "JACリクルートメントに登録して、「年収維持で成長できる環境」を条件に相談してみよう。",
    };
  }

  if (pain === "worklife" || goal === "balance") {
    return {
      type: "work-life-balance",
      title: "ワークライフバランス\n改善型",
      emoji: "⚖️",
      color: "text-sky-400",
      gradient: "from-sky-500 to-blue-500",
      message:
        "年収も大事。でも心身が壊れたら元も子もないですよね。大手企業やリモートワーク可能な企業に移ることで、年収を維持しながら生活の質を劇的に改善できます。",
      advice: [
        "「残業時間」「リモート可否」「副業可否」を重視して求人を探す",
        "口コミサイト（OpenWork等）で実際の働き方を確認する",
        "面接では正直に「ワークライフバランスを重視している」と伝えてOK",
        "エージェントに「残業月20時間以内」など具体的な条件を伝える",
      ],
      serviceRefs: [
        { id: "doda", reason: "求人数が多く、条件で絞り込みやすい。エージェントに細かい希望を伝えやすい" },
        { id: "recruit", reason: "業界最大の求人数。幅広い選択肢の中から条件に合う企業を見つけやすい" },
      ],
      nextAction: "dodaに登録して、「残業月20時間以内・リモート可」の条件で求人を探してみよう。",
    };
  }

  if (goal === "value" || action === "nothing") {
    return {
      type: "market-value",
      title: "まず市場価値を\n知ろう型",
      emoji: "🔍",
      color: "text-violet-400",
      gradient: "from-violet-500 to-purple-500",
      message:
        "転職するかどうかはまだ決めなくていい。でも、自分が市場でいくらの価値があるか知っておくことは、キャリアの「健康診断」です。知るだけで、今の会社への見方が変わります。",
      advice: [
        "ビズリーチに登録してスカウトを待つ（登録5分、無料）",
        "スポットコンサル（ビザスク等）に登録して、自分の経験に値段がつくか試す",
        "転職エージェントに「まだ転職は決めていないが、市場価値を知りたい」と正直に伝える",
      ],
      serviceRefs: [
        { id: "bizreach", reason: "登録するだけで企業からスカウトが来る。自分の市場価値が数字でわかる" },
        { id: "doda", reason: "エージェントとの面談だけでも市場価値の相場観がつかめる。無料" },
      ],
      nextAction: "ビズリーチに登録してみよう。5分で終わる。スカウトが来たら、それがあなたの市場価値だ。",
    };
  }

  if (
    (salary === "600to800" || salary === "over800") &&
    goal === "money"
  ) {
    return {
      type: "high-class",
      title: "ハイクラス\n年収ジャンプ型",
      emoji: "💎",
      color: "text-amber-400",
      gradient: "from-amber-500 to-yellow-500",
      message:
        "年収600万以上からの年収アップは、求人の数が一気に減ります。だからこそ、ハイクラス特化のエージェントを使うことが重要です。非公開求人にアクセスできるかどうかで結果が変わります。",
      advice: [
        "ハイクラス特化のエージェント（JAC等）を使う",
        "エージェントとの接触頻度を上げる（毎週10分の電話が理想）",
        "年収交渉は必ずエージェントに任せる",
        "同時に副業も検討し、収入源を分散させる",
      ],
      serviceRefs: [
        { id: "jac", reason: "ハイクラス・ミドルクラス特化。企業担当と求職者担当が同一人物なので、企業の内情に詳しい" },
        { id: "bizreach", reason: "ハイクラス向けスカウトが中心。年収800万以上の求人が豊富" },
      ],
      nextAction: "JACリクルートメントに登録して、毎週10分の電話を始めよう。地味だけど、これが一番効く。",
    };
  }

  return {
    type: "general",
    title: "キャリア\n見直し型",
    emoji: "🧭",
    color: "text-blue-400",
    gradient: "from-blue-500 to-indigo-500",
    message:
      "今の環境に違和感を感じているなら、それは正しいサインです。まずは市場を見てみましょう。転職するかどうかは、情報を集めてから決めればいい。",
    advice: [
      "転職エージェントに登録して、自分の市場価値を知る",
      "職務経歴書を書いてみる（書くだけで自分の経験が整理される）",
      "口コミサイトで気になる企業の実態を調べる",
    ],
    serviceRefs: [
      { id: "doda", reason: "求人数が多く、初めての転職活動でもサポートが手厚い" },
      { id: "bizreach", reason: "登録するだけでスカウトが来る。市場価値の確認に最適" },
    ],
    nextAction: "dodaに登録して、まずはエージェントと話してみよう。「転職するかわからないけど相談したい」でOK。",
  };
}

/* ------------------------------------------------------------------ */
/*  Particles                                                          */
/* ------------------------------------------------------------------ */

function Particles({ gradient }: { gradient: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className={`absolute w-2 h-2 rounded-full bg-gradient-to-r ${gradient} opacity-20`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `particle ${3 + Math.random() * 4}s ease-in-out ${Math.random() * 2}s infinite alternate`,
            transform: `scale(${0.5 + Math.random() * 1.5})`,
          }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Loading counter                                                    */
/* ------------------------------------------------------------------ */

function LoadingScreen() {
  const [count, setCount] = useState(0);
  const messages = [
    "あなたの回答を分析しています...",
    "最適なキャリア戦略を検索中...",
    "おすすめのサービスを選定中...",
  ];

  useEffect(() => {
    const t1 = setTimeout(() => setCount(1), 700);
    const t2 = setTimeout(() => setCount(2), 1400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-zinc-900">
      <div className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-zinc-700" />
          <div
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-blue-400"
            style={{ animation: "spin .8s linear infinite" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl" style={{ animation: "pulse 1s ease-in-out infinite" }}>
              🔮
            </span>
          </div>
        </div>
        <div className="h-12">
          <p
            key={count}
            className="text-white text-lg font-bold"
            style={{ animation: "fadeUp .3s ease-out both" }}
          >
            {messages[count]}
          </p>
        </div>
        <div className="flex gap-1.5 justify-center mt-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                i <= count ? "bg-blue-500" : "bg-zinc-700"
              }`}
            />
          ))}
        </div>
      </div>
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.15)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function DiagnosisPage() {
  const [phase, setPhase] = useState<"start" | "questions" | "loading" | "result">("start");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ResultType | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const totalSteps = questions.length;

  const handleSelect = useCallback(
    (value: string) => {
      setSelected(value);
      const q = questions[step];
      const next = { ...answers, [q.id]: value };
      setAnswers(next);

      setTimeout(() => {
        setSelected(null);
        if (step < totalSteps - 1) {
          setStep(step + 1);
        } else {
          setPhase("loading");
          setTimeout(() => {
            setResult(getResult(next));
            setPhase("result");
          }, 2200);
        }
      }, 400);
    },
    [step, answers, totalSteps]
  );

  const restart = () => {
    setPhase("start");
    setStep(0);
    setAnswers({});
    setResult(null);
    setSelected(null);
  };

  // ===== START =====
  if (phase === "start") {
    return (
      <div className="min-h-[80vh] bg-zinc-900 text-white flex items-center relative overflow-hidden">
        <Particles gradient="from-blue-500 to-purple-500" />
        <div className="relative max-w-2xl mx-auto px-4 py-20 text-center">
          <div
            className="text-6xl mb-8"
            style={{ animation: "float 3s ease-in-out infinite" }}
          >
            🧭
          </div>
          <p
            className="text-sm font-semibold text-blue-400 tracking-wider uppercase mb-4"
            style={{ animation: "fadeUp .6s ease-out .1s both" }}
          >
            Career Diagnosis
          </p>
          <h1
            className="text-3xl md:text-5xl font-bold mb-6 leading-tight"
            style={{ animation: "fadeUp .6s ease-out .2s both" }}
          >
            ならなら式<br />転職診断
          </h1>
          <p
            className="text-zinc-400 mb-4 leading-relaxed"
            style={{ animation: "fadeUp .6s ease-out .3s both" }}
          >
            5つの質問に答えるだけ。<br />
            あなたに合ったキャリア戦略と、<br className="md:hidden" />
            最適な転職サービスがわかります。
          </p>
          <p
            className="text-zinc-600 text-xs mb-10"
            style={{ animation: "fadeUp .6s ease-out .35s both" }}
          >
            所要時間：約30秒 / 完全無料
          </p>
          <button
            onClick={() => setPhase("questions")}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold px-10 py-4 rounded-xl text-lg hover:from-blue-600 hover:to-blue-700 transition-all hover:scale-105 active:scale-100 shadow-lg shadow-blue-500/25"
            style={{ animation: "fadeUp .6s ease-out .4s both" }}
          >
            診断をはじめる
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
        <style>{`
          @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
          @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
          @keyframes particle{from{transform:translateY(0) scale(1)}to{transform:translateY(-30px) scale(1.5)}}
        `}</style>
      </div>
    );
  }

  // ===== LOADING =====
  if (phase === "loading") {
    return <LoadingScreen />;
  }

  // ===== RESULT =====
  if (phase === "result" && result) {
    return (
      <>
        <section className="bg-zinc-900 text-white relative overflow-hidden">
          <Particles gradient={result.gradient} />
          <div className="relative max-w-3xl mx-auto px-4 pt-16 pb-14 text-center">
            <p className="text-sm font-semibold text-blue-400 tracking-wider uppercase mb-6"
               style={{ animation: "fadeUp .5s ease-out both" }}>
              あなたのタイプは...
            </p>
            <div
              className="text-7xl mb-6"
              style={{ animation: "pop .6s ease-out .2s both" }}
            >
              {result.emoji}
            </div>
            <h1
              className={`text-3xl md:text-5xl font-bold mb-6 leading-tight whitespace-pre-line ${result.color}`}
              style={{ animation: "fadeUp .6s ease-out .4s both" }}
            >
              {result.title}
            </h1>
            <div
              className={`inline-block bg-gradient-to-r ${result.gradient} rounded-full px-6 py-1.5 text-sm font-semibold`}
              style={{ animation: "fadeUp .6s ease-out .5s both" }}
            >
              ならなら式転職診断
            </div>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 py-12 space-y-10">
          <div
            className={`border-l-4 border-l-blue-500 bg-blue-50 rounded-r-2xl p-6 md:p-8`}
            style={{ animation: "fadeUp .6s ease-out .6s both" }}
          >
            <p className="text-zinc-700 leading-[1.9] text-base">{result.message}</p>
          </div>

          <section style={{ animation: "fadeUp .6s ease-out .7s both" }}>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
              <span className={`w-9 h-9 bg-gradient-to-r ${result.gradient} rounded-lg flex items-center justify-center text-white text-sm font-bold`}>1</span>
              あなたへのアドバイス
            </h2>
            <div className="space-y-3">
              {result.advice.map((a, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 bg-white border border-border/60 rounded-xl p-4 hover:shadow-sm transition-shadow"
                  style={{ animation: `fadeUp .4s ease-out ${0.8 + i * 0.1}s both` }}
                >
                  <span className={`w-7 h-7 bg-gradient-to-r ${result.gradient} text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5`}>
                    {i + 1}
                  </span>
                  <p className="text-zinc-700 text-sm leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </section>

          <section style={{ animation: "fadeUp .6s ease-out 1.2s both" }}>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
              <span className={`w-9 h-9 bg-gradient-to-r ${result.gradient} rounded-lg flex items-center justify-center text-white text-sm font-bold`}>2</span>
              おすすめの転職サービス
            </h2>
            <div className="space-y-4">
              {result.serviceRefs.map((ref, i) => {
                const svc = affiliateServices[ref.id];
                if (!svc) return null;
                return (
                  <div
                    key={i}
                    className="bg-white border border-border/60 rounded-2xl p-6 hover:shadow-md transition-all hover:-translate-y-0.5"
                    style={{ animation: `fadeUp .4s ease-out ${1.3 + i * 0.15}s both` }}
                  >
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold mb-2">{svc.name}</h3>
                        <p className="text-sm text-zinc-500 leading-relaxed">{ref.reason}</p>
                      </div>
                      <a
                        href={svc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`shrink-0 inline-flex items-center gap-1.5 bg-gradient-to-r ${result.gradient} text-white text-sm font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity`}
                      >
                        無料で登録する
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* next action */}
          <div
            className={`bg-gradient-to-r ${result.gradient} rounded-2xl p-8 text-white text-center`}
            style={{ animation: "fadeUp .6s ease-out 1.6s both" }}
          >
            <p className="text-xs uppercase tracking-wider mb-3 opacity-80">Next Action</p>
            <p className="text-lg md:text-xl font-bold leading-relaxed">{result.nextAction}</p>
          </div>

          {/* CTA */}
          <div
            className="bg-zinc-900 text-white rounded-2xl p-8 text-center"
            style={{ animation: "fadeUp .6s ease-out 1.8s both" }}
          >
            <p className="text-lg font-bold mb-2">キャリアの気づきを発信中</p>
            <p className="text-zinc-400 text-sm mb-6">
              転職やキャリアのリアルな話をXで日々ポストしています
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={`https://x.com/intent/tweet?text=${encodeURIComponent(`ならなら式転職診断の結果は「${result.title.replace("\n", "")}」でした！\n\n`)}&url=${encodeURIComponent("https://ibasho-senryaku.com/diagnosis")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-zinc-900 font-semibold px-6 py-3 rounded-lg hover:bg-zinc-100 transition-colors text-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                結果をXでシェアする
              </a>
              <button
                onClick={restart}
                className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/10 transition-colors text-sm"
              >
                もう一度診断する
              </button>
            </div>
          </div>
        </div>
        <style>{`
          @keyframes pop{0%{transform:scale(0) rotate(-10deg);opacity:0}60%{transform:scale(1.15) rotate(5deg)}100%{transform:scale(1) rotate(0);opacity:1}}
          @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
          @keyframes particle{from{transform:translateY(0) scale(1)}to{transform:translateY(-30px) scale(1.5)}}
        `}</style>
      </>
    );
  }

  // ===== QUESTIONS =====
  const q = questions[step];
  const progress = ((step + 1) / totalSteps) * 100;

  return (
    <div className="min-h-[80vh] bg-zinc-900 text-white">
      <div className="max-w-2xl mx-auto px-4 pt-12 pb-20">
        {/* progress */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-zinc-500 font-semibold tracking-wider uppercase">
              Question {step + 1} / {totalSteps}
            </p>
            <p className="text-xs text-zinc-500">{Math.round(progress)}%</p>
          </div>
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-blue-400 to-purple-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* question */}
        <div key={step} style={{ animation: "fadeUp .4s ease-out both" }}>
          <h2 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">
            {q.question}
          </h2>
          <p className="text-zinc-500 text-sm mb-10">{q.sub}</p>

          <div className="space-y-3">
            {q.choices.map((c, i) => (
              <button
                key={c.value}
                onClick={() => handleSelect(c.value)}
                disabled={selected !== null}
                className={`w-full text-left p-5 rounded-xl border transition-all duration-300 flex items-center gap-4 ${
                  selected === c.value
                    ? "border-blue-500 bg-blue-500/20 scale-[1.02]"
                    : selected !== null
                    ? "border-zinc-800 bg-zinc-800/50 opacity-40"
                    : "border-zinc-700 bg-zinc-800/50 hover:border-blue-500/50 hover:bg-zinc-800 cursor-pointer"
                }`}
                style={{ animation: `fadeUp .3s ease-out ${i * 0.06}s both` }}
              >
                <span className="text-2xl">{c.icon}</span>
                <span className="text-sm md:text-base font-medium">{c.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}
