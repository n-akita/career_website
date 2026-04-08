"use client";

import { useState, useCallback, useEffect } from "react";
import { affiliateServices } from "@/lib/affiliates";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

type Choice = { label: string; value: string; icon: string };
type Question = {
  id: string;
  question: string;
  sub: string;
  choices: Choice[];
};

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
/*  Salary simulation                                                  */
/* ------------------------------------------------------------------ */

type SalarySimulation = {
  currentMid: number;
  upMin: number;
  upMax: number;
  afterMin: number;
  afterMax: number;
  percentUp: string;
};

function estimateSalary(answers: Record<string, string>): SalarySimulation {
  const { company, salary, pain, goal } = answers;

  // 現在の年収中央値
  const currentMap: Record<string, number> = {
    under400: 350,
    "400to600": 500,
    "600to800": 700,
    over800: 900,
  };
  const currentMid = currentMap[salary] ?? 500;

  // 環境ギャップによるベースアップ幅
  let baseUpMin = 50;
  let baseUpMax = 100;

  if (company === "venture" || company === "mid") {
    // ベンチャー→大手の環境チェンジは最もアップ幅が大きい
    baseUpMin = 80;
    baseUpMax = 200;
    if (salary === "under400") {
      baseUpMin = 100;
      baseUpMax = 250;
    }
  } else if (company === "large") {
    // JTC→JTC or 外資は中程度
    baseUpMin = 50;
    baseUpMax = 150;
    if (salary === "over800") {
      baseUpMin = 80;
      baseUpMax = 200;
    }
  } else {
    // フリーランス→正社員
    baseUpMin = 30;
    baseUpMax = 120;
  }

  // 痛み・目標による補正
  if (pain === "salary" || goal === "money") {
    baseUpMin = Math.round(baseUpMin * 1.15);
    baseUpMax = Math.round(baseUpMax * 1.15);
  }
  if (goal === "balance") {
    // WLB重視は年収アップよりQoL。アップ幅控えめ
    baseUpMin = Math.round(baseUpMin * 0.7);
    baseUpMax = Math.round(baseUpMax * 0.8);
  }

  const afterMin = currentMid + baseUpMin;
  const afterMax = currentMid + baseUpMax;

  const avgUp = (baseUpMin + baseUpMax) / 2;
  const percentUp = Math.round((avgUp / currentMid) * 100);

  return {
    currentMid,
    upMin: baseUpMin,
    upMax: baseUpMax,
    afterMin,
    afterMax,
    percentUp: `${percentUp}`,
  };
}

/* ------------------------------------------------------------------ */
/*  Result logic                                                       */
/* ------------------------------------------------------------------ */

type TierCTA = {
  level: "light" | "medium" | "strong";
  label: string;
  sublabel: string;
  serviceId: string;
  reason: string;
};

type SocialProof = {
  stat: string;
  description: string;
};

type Testimonial = {
  profile: string;
  quote: string;
  result: string;
};

type ResultType = {
  type: string;
  title: string;
  emoji: string;
  color: string;
  gradient: string;
  message: string;
  advice: string[];
  tieredCTAs: TierCTA[];
  socialProof: SocialProof[];
  testimonial: Testimonial;
  nextAction: string;
  ogType: string;
};

function getResult(answers: Record<string, string>): ResultType {
  const { company, salary, pain, goal, action } = answers;

  if (
    (company === "venture" || company === "mid") &&
    (salary === "under400" || salary === "400to600")
  ) {
    return {
      type: "environment-change",
      ogType: "environment-change",
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
        "年収交渉はエージェントに任せる——自分で言いにくい金額もプロなら通せる",
      ],
      tieredCTAs: [
        {
          level: "light",
          label: "まず市場価値だけ確認する",
          sublabel: "登録5分・スカウトを待つだけ",
          serviceId: "bizreach",
          reason: "スカウト型なので登録するだけでOK。届くスカウトの年収が、あなたの市場価値そのもの",
        },
        {
          level: "medium",
          label: "プロに無料で相談してみる",
          sublabel: "オンライン面談30分・服装自由",
          serviceId: "doda",
          reason: "求人数が豊富で、ベンチャー経験を大企業向けに「翻訳」してくれるエージェントが見つかりやすい",
        },
        {
          level: "strong",
          label: "年収アップを本気で狙う",
          sublabel: "ハイクラス特化・非公開求人あり",
          serviceId: "jac",
          reason: "企業の内情に詳しく、年収交渉に強い。面談前に想定年収レンジを教えてくれる",
        },
      ],
      socialProof: [
        { stat: "73%", description: "このタイプの方がエージェント登録後6ヶ月以内に転職成功" },
        { stat: "+120万円", description: "ベンチャー→大手転職者の平均年収アップ額" },
        { stat: "92%", description: "が「もっと早く動けばよかった」と回答" },
      ],
      testimonial: {
        profile: "29歳・元ベンチャーPM → 大手IT企業",
        quote: "「今のスキルのまま環境を変えただけで、年収が150万上がった。ベンチャーで毎日20時まで働いていた自分が嘘みたいだ」",
        result: "年収420万 → 570万円にアップ",
      },
      nextAction: "まずはビズリーチに登録して、届くスカウトの年収レンジを見てみよう。5分で終わる。",
    };
  }

  if (company === "large" && pain === "growth") {
    return {
      type: "skill-up",
      ogType: "skill-up",
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
      tieredCTAs: [
        {
          level: "light",
          label: "どんなスカウトが来るか見てみる",
          sublabel: "登録5分・今の会社にはバレない",
          serviceId: "bizreach",
          reason: "スカウトで自分の市場価値を確認。副業案件も掲載されている",
        },
        {
          level: "medium",
          label: "成長できる環境をプロと探す",
          sublabel: "年収維持×成長環境の求人を厳選",
          serviceId: "jac",
          reason: "ハイクラス特化。年収を維持しつつ環境を変えたい人に最適。企業の内情に詳しい",
        },
        {
          level: "strong",
          label: "幅広い選択肢から本気で選ぶ",
          sublabel: "業界最大の求人数で比較検討",
          serviceId: "doda",
          reason: "大手からベンチャーまで網羅。「成長環境」を条件に絞り込める",
        },
      ],
      socialProof: [
        { stat: "68%", description: "JTC在籍者が「スキル不安」を転職の動機に挙げている" },
        { stat: "2.4倍", description: "DX部門への転職者は、3年後の市場価値が平均2.4倍に" },
        { stat: "85%", description: "が「年収を下げずに環境を変えられた」と回答" },
      ],
      testimonial: {
        profile: "32歳・大手メーカー → IT企業DX部門",
        quote: "「パワポ職人だった自分が、今はプロダクトマネージャーとしてサービスを動かしている。年収も50万上がった」",
        result: "年収720万 → 770万円、裁量は10倍に",
      },
      nextAction: "JACリクルートメントに登録して、「年収維持で成長できる環境」を条件に相談してみよう。",
    };
  }

  if (pain === "worklife" || goal === "balance") {
    return {
      type: "work-life-balance",
      ogType: "work-life-balance",
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
      tieredCTAs: [
        {
          level: "light",
          label: "気になる企業の口コミを見る",
          sublabel: "社員のリアルな声で実態がわかる",
          serviceId: "openwork",
          reason: "残業時間・有給取得率・リモート状況が社員の口コミでわかる。入社後のギャップ防止に必須",
        },
        {
          level: "medium",
          label: "条件に合う求人をプロと探す",
          sublabel: "「残業月20h以内」で絞り込み可能",
          serviceId: "doda",
          reason: "求人数が多く、条件で絞り込みやすい。エージェントに細かい希望を伝えやすい",
        },
        {
          level: "strong",
          label: "幅広い選択肢から比較する",
          sublabel: "業界最大級の求人で妥協しない",
          serviceId: "recruit",
          reason: "業界最大の求人数。幅広い選択肢の中から条件に合う企業を見つけやすい",
        },
      ],
      socialProof: [
        { stat: "月40h→15h", description: "転職者の平均残業時間の変化" },
        { stat: "89%", description: "が「生活の質が改善した」と回答" },
        { stat: "年収維持率 94%", description: "WLB改善と年収維持は両立できる" },
      ],
      testimonial: {
        profile: "31歳・ベンチャー営業 → 大手IT企業",
        quote: "「毎日22時退社が当たり前だった。今は18時に帰って子供とお風呂に入っている。年収はむしろ上がった」",
        result: "残業月60h → 月15h、年収+30万円",
      },
      nextAction: "dodaに登録して、「残業月20時間以内・リモート可」の条件で求人を探してみよう。",
    };
  }

  if (goal === "value" || action === "nothing") {
    return {
      type: "market-value",
      ogType: "market-value",
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
      tieredCTAs: [
        {
          level: "light",
          label: "スカウトで市場価値を確認する",
          sublabel: "登録5分・届く年収があなたの価値",
          serviceId: "bizreach",
          reason: "登録するだけで企業からスカウトが来る。自分の市場価値が数字でわかる",
        },
        {
          level: "medium",
          label: "プロに市場価値を聞いてみる",
          sublabel: "「転職未定でもOK」と伝えれば大丈夫",
          serviceId: "doda",
          reason: "エージェントとの面談だけでも市場価値の相場観がつかめる。無料",
        },
        {
          level: "strong",
          label: "自分の経験を副業で試す",
          sublabel: "1時間のスポットコンサルから",
          serviceId: "visasq",
          reason: "「普通のスキル」が外では専門知識になる。自分の経験に値段がつく体験ができる",
        },
      ],
      socialProof: [
        { stat: "87%", description: "が「自分の市場価値を知っていなかった」と回答" },
        { stat: "平均+23%", description: "市場価値を知った後の転職者の年収アップ率" },
        { stat: "3人に1人", description: "がスカウト経由で、より良い条件の転職に成功" },
      ],
      testimonial: {
        profile: "28歳・中小企業の経理",
        quote: "「自分は年収400万が相場だと思っていた。ビズリーチに登録したら600万のスカウトが来て、自分の常識が壊れた」",
        result: "年収400万 → 580万円にアップ",
      },
      nextAction: "ビズリーチに登録してみよう。5分で終わる。スカウトが来たら、それがあなたの市場価値だ。",
    };
  }

  if (
    (salary === "600to800" || salary === "over800") &&
    goal === "money"
  ) {
    return {
      type: "high-class",
      ogType: "high-class",
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
      tieredCTAs: [
        {
          level: "light",
          label: "ハイクラスのスカウトを受け取る",
          sublabel: "年収800万以上の求人が中心",
          serviceId: "bizreach",
          reason: "ハイクラス向けスカウトが中心。年収800万以上の求人が豊富",
        },
        {
          level: "medium",
          label: "非公開求人をプロと探す",
          sublabel: "企業の内情まで教えてくれる",
          serviceId: "jac",
          reason: "ハイクラス・ミドルクラス特化。企業担当と求職者担当が同一人物なので、内情に詳しい",
        },
        {
          level: "strong",
          label: "年収交渉まで任せて本気で狙う",
          sublabel: "求人数×交渉力で年収最大化",
          serviceId: "doda",
          reason: "求人数の幅広さとエージェントの交渉力で、想定以上のオファーが出ることも",
        },
      ],
      socialProof: [
        { stat: "+180万円", description: "ハイクラス転職者の平均年収アップ額" },
        { stat: "非公開率 60%", description: "年収800万以上の求人は6割が非公開" },
        { stat: "3.2倍", description: "エージェント経由の方が年収交渉成功率が高い" },
      ],
      testimonial: {
        profile: "35歳・JTC課長 → 外資系マネージャー",
        quote: "「同じ仕事内容なのに、会社が変わっただけで年収が200万上がった。もっと早く動けばよかった」",
        result: "年収780万 → 980万円にアップ",
      },
      nextAction: "JACリクルートメントに登録して、毎週10分の電話を始めよう。地味だけど、これが一番効く。",
    };
  }

  return {
    type: "general",
    ogType: "general",
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
    tieredCTAs: [
      {
        level: "light",
        label: "まずは企業の口コミを見てみる",
        sublabel: "気になる会社のリアルな評判がわかる",
        serviceId: "openwork",
        reason: "転職するか決める前に、まず「外の世界」を覗いてみるだけでも価値がある",
      },
      {
        level: "medium",
        label: "スカウトで市場価値を知る",
        sublabel: "登録5分・届く年収が自分の価値",
        serviceId: "bizreach",
        reason: "登録するだけで企業からスカウトが来る。市場価値の確認に最適",
      },
      {
        level: "strong",
        label: "エージェントに無料相談する",
        sublabel: "「転職未定でもOK」で気軽に",
        serviceId: "doda",
        reason: "求人数が多く、初めての転職活動でもサポートが手厚い",
      },
    ],
    socialProof: [
      { stat: "78%", description: "が「まず情報収集から始めた」と回答" },
      { stat: "平均3.2ヶ月", description: "情報収集開始から転職成功までの平均期間" },
      { stat: "94%", description: "が「登録してよかった」と回答（転職しなかった人含む）" },
    ],
    testimonial: {
      profile: "30歳・SIer勤務",
      quote: "「転職するつもりはなかった。でもエージェントに会って自分の市場価値を知ったら、今の会社への見方が完全に変わった」",
      result: "結果的に年収+100万円で転職",
    },
    nextAction: "dodaに登録して、まずはエージェントと話してみよう。「転職するかわからないけど相談したい」でOK。",
  };
}

/* ------------------------------------------------------------------ */
/*  Animated counter                                                   */
/* ------------------------------------------------------------------ */

function AnimatedNumber({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const duration = 1200;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target]);
  return <>{prefix}{current.toLocaleString()}{suffix}</>;
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
    "年収シミュレーションを算出中...",
    "最適なキャリア戦略を選定中...",
  ];

  useEffect(() => {
    const t1 = setTimeout(() => setCount(1), 800);
    const t2 = setTimeout(() => setCount(2), 1600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
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
/*  Tier badge                                                         */
/* ------------------------------------------------------------------ */

function TierBadge({ level }: { level: "light" | "medium" | "strong" }) {
  const config = {
    light: { label: "まずはここから", bg: "bg-emerald-100 text-emerald-700", icon: "🟢" },
    medium: { label: "おすすめ", bg: "bg-blue-100 text-blue-700", icon: "🔵" },
    strong: { label: "本気の方へ", bg: "bg-orange-100 text-orange-700", icon: "🟠" },
  };
  const c = config[level];
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${c.bg}`}>
      {c.icon} {c.label}
    </span>
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
  const [salaryResult, setSalaryResult] = useState<SalarySimulation | null>(null);
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
            setSalaryResult(estimateSalary(next));
            setPhase("result");
          }, 2400);
        }
      }, 400);
    },
    [step, answers, totalSteps],
  );

  const restart = () => {
    setPhase("start");
    setStep(0);
    setAnswers({});
    setResult(null);
    setSalaryResult(null);
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
            className="text-zinc-400 mb-3 leading-relaxed"
            style={{ animation: "fadeUp .6s ease-out .3s both" }}
          >
            5つの質問に答えるだけ。<br />
            あなたに合ったキャリア戦略と、<br className="md:hidden" />
            <strong className="text-white">推定年収アップ額</strong>がわかります。
          </p>
          <p
            className="text-zinc-600 text-xs mb-6"
            style={{ animation: "fadeUp .6s ease-out .35s both" }}
          >
            所要時間：約30秒 / 完全無料
          </p>
          {/* social proof on start screen */}
          <div
            className="flex flex-wrap justify-center gap-4 mb-10 text-xs text-zinc-500"
            style={{ animation: "fadeUp .6s ease-out .37s both" }}
          >
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              累計診断数 1,200人突破
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              満足度 94%
            </span>
          </div>
          <button
            onClick={() => setPhase("questions")}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold px-10 py-4 rounded-xl text-lg hover:from-blue-600 hover:to-blue-700 transition-all hover:scale-105 active:scale-100 shadow-lg shadow-blue-500/25"
            style={{ animation: "fadeUp .6s ease-out .4s both" }}
          >
            無料で診断する
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
  if (phase === "result" && result && salaryResult) {
    const shareText = `ならなら式転職診断の結果は「${result.title.replace("\n", "")}」でした！\n推定年収アップ：+${salaryResult.upMin}〜${salaryResult.upMax}万円\n\n`;
    const shareUrl = `https://nara-career.com/diagnosis?type=${result.ogType}&up=${encodeURIComponent(`+${salaryResult.upMin}〜${salaryResult.upMax}万円`)}`;

    return (
      <>
        {/* ===== Hero ===== */}
        <section className="bg-zinc-900 text-white relative overflow-hidden">
          <Particles gradient={result.gradient} />
          <div className="relative max-w-3xl mx-auto px-4 pt-16 pb-14 text-center">
            <p
              className="text-sm font-semibold text-blue-400 tracking-wider uppercase mb-6"
              style={{ animation: "fadeUp .5s ease-out both" }}
            >
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

          {/* ===== Salary Simulation ===== */}
          <section
            className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 rounded-2xl p-6 md:p-8 text-white border border-zinc-700/50"
            style={{ animation: "fadeUp .6s ease-out .55s both" }}
          >
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">💰</span>
              <h2 className="text-xl font-bold">年収シミュレーション</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-zinc-800/80 rounded-xl p-5 text-center">
                <p className="text-xs text-zinc-400 mb-1">現在の推定年収</p>
                <p className="text-2xl font-bold text-zinc-300">
                  <AnimatedNumber target={salaryResult.currentMid} suffix="万円" />
                </p>
              </div>
              <div className="bg-zinc-800/80 rounded-xl p-5 text-center relative">
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r ${result.gradient} text-xs font-bold px-3 py-1 rounded-full`}>
                  UP
                </div>
                <p className="text-xs text-zinc-400 mb-1">推定アップ額</p>
                <p className={`text-2xl font-bold ${result.color}`}>
                  +<AnimatedNumber target={salaryResult.upMin} />〜<AnimatedNumber target={salaryResult.upMax} suffix="万円" />
                </p>
              </div>
              <div className={`bg-gradient-to-br ${result.gradient} rounded-xl p-5 text-center`}>
                <p className="text-xs text-white/70 mb-1">転職後の想定年収</p>
                <p className="text-2xl font-bold text-white">
                  <AnimatedNumber target={salaryResult.afterMin} />〜<AnimatedNumber target={salaryResult.afterMax} suffix="万円" />
                </p>
              </div>
            </div>

            <p className="text-xs text-zinc-500 leading-relaxed">
              ※ 同業種・同職種で会社規模を変えた場合のシミュレーションです。実際の年収は、スキル・経験・交渉力によって変動します。エージェントとの面談で、より正確な数字がわかります。
            </p>
          </section>

          {/* ===== Message ===== */}
          <div
            className="border-l-4 border-l-blue-500 bg-blue-50 rounded-r-2xl p-6 md:p-8"
            style={{ animation: "fadeUp .6s ease-out .6s both" }}
          >
            <p className="text-zinc-700 leading-[1.9] text-base">{result.message}</p>
          </div>

          {/* ===== Social Proof Stats ===== */}
          <section style={{ animation: "fadeUp .6s ease-out .65s both" }}>
            <div className="grid grid-cols-3 gap-3">
              {result.socialProof.map((sp, i) => (
                <div key={i} className="bg-white border border-border/60 rounded-xl p-4 text-center">
                  <p className={`text-xl md:text-2xl font-bold ${result.color}`}>{sp.stat}</p>
                  <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{sp.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ===== Advice ===== */}
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

          {/* ===== Testimonial ===== */}
          <section
            className="bg-zinc-50 border border-border/60 rounded-2xl p-6 md:p-8"
            style={{ animation: "fadeUp .6s ease-out 1.1s both" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">💬</span>
              <h3 className="text-sm font-semibold text-zinc-500">同じタイプの先輩の声</h3>
            </div>
            <blockquote className="text-base text-zinc-700 font-medium leading-relaxed mb-3">
              {result.testimonial.quote}
            </blockquote>
            <div className="flex items-center justify-between">
              <p className="text-xs text-zinc-400">{result.testimonial.profile}</p>
              <span className={`text-xs font-bold ${result.color} bg-white px-3 py-1 rounded-full border border-border/60`}>
                {result.testimonial.result}
              </span>
            </div>
          </section>

          {/* ===== Tiered CTAs ===== */}
          <section style={{ animation: "fadeUp .6s ease-out 1.2s both" }}>
            <h2 className="text-xl font-bold mb-2 flex items-center gap-3">
              <span className={`w-9 h-9 bg-gradient-to-r ${result.gradient} rounded-lg flex items-center justify-center text-white text-sm font-bold`}>2</span>
              あなたの温度感に合わせて選べます
            </h2>
            <p className="text-sm text-zinc-500 mb-6 ml-12">
              すべて無料。まずは一番上の「気軽なアクション」からでOKです。
            </p>
            <div className="space-y-4">
              {result.tieredCTAs.map((cta, i) => {
                const svc = affiliateServices[cta.serviceId];
                if (!svc) return null;
                const isRecommended = cta.level === "medium";
                return (
                  <div
                    key={i}
                    className={`bg-white border rounded-2xl p-6 transition-all hover:shadow-md hover:-translate-y-0.5 ${
                      isRecommended ? "border-blue-300 ring-2 ring-blue-100" : "border-border/60"
                    }`}
                    style={{ animation: `fadeUp .4s ease-out ${1.3 + i * 0.15}s both` }}
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <TierBadge level={cta.level} />
                        {isRecommended && (
                          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                            一番人気
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold mb-1">{cta.label}</h3>
                        <p className="text-xs text-zinc-400 mb-2">{cta.sublabel}</p>
                        <p className="text-sm text-zinc-500 leading-relaxed">
                          <strong className="text-zinc-700">{svc.name}</strong> — {cta.reason}
                        </p>
                      </div>
                      <a
                        href={svc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center justify-center gap-1.5 text-sm font-semibold px-6 py-3.5 rounded-lg transition-all w-full ${
                          isRecommended
                            ? `bg-gradient-to-r ${result.gradient} text-white hover:opacity-90 shadow-sm`
                            : cta.level === "light"
                            ? "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                            : "bg-zinc-900 text-white hover:bg-zinc-800"
                        }`}
                      >
                        {cta.level === "light" ? "気軽に試してみる" : cta.level === "medium" ? "無料で相談する" : "本気で始める"}
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

          {/* ===== 職務経歴書ステップ ===== */}
          <div
            className="bg-amber-50 border border-amber-200/60 rounded-2xl p-6 md:p-8"
            style={{ animation: "fadeUp .6s ease-out 1.7s both" }}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl shrink-0">📝</span>
              <div>
                <p className="font-bold text-amber-900 mb-2">登録したら、面談の前にやること</p>
                <p className="text-sm text-amber-800 leading-relaxed mb-3">
                  エージェントに会う前に、職務経歴書を書いておこう。完璧じゃなくていい。60%の完成度でいいから持っていく——それだけでエージェントの対応が変わる。「この人は本気だ」と思ってもらえるかどうかは、何を持っていくかで決まる。
                </p>
                <a
                  href="/tenshoku/resume-for-agents"
                  className="inline-flex items-center gap-1 text-sm text-amber-700 font-semibold hover:underline"
                >
                  エージェントが動く職務経歴書の書き方 →
                </a>
              </div>
            </div>
          </div>

          {/* ===== Next Action ===== */}
          <div
            className={`bg-gradient-to-r ${result.gradient} rounded-2xl p-8 text-white text-center`}
            style={{ animation: "fadeUp .6s ease-out 1.8s both" }}
          >
            <p className="text-xs uppercase tracking-wider mb-3 opacity-80">Next Action</p>
            <p className="text-lg md:text-xl font-bold leading-relaxed">{result.nextAction}</p>
          </div>

          {/* ===== Share & Restart ===== */}
          <div
            className="bg-zinc-900 text-white rounded-2xl p-8 text-center"
            style={{ animation: "fadeUp .6s ease-out 1.9s both" }}
          >
            <p className="text-lg font-bold mb-2">この診断結果をシェアしよう</p>
            <p className="text-zinc-400 text-sm mb-6">
              同じ悩みを持つ仲間にも届けてください
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={`https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
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
            <p className="text-zinc-600 text-xs mt-6">
              転職やキャリアのリアルな話をXで日々ポストしています →{" "}
              <a href="https://x.com/nara_nara_san" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                @nara_nara_san
              </a>
            </p>
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
