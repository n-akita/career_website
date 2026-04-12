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
/*  Salary simulation（ならならの実績ベースで現実的に）                   */
/* ------------------------------------------------------------------ */

type SalarySimulation = {
  currentMid: number;
  upMin: number;
  upMax: number;
  afterMin: number;
  afterMax: number;
  naraCase: string; // ならなら自身の実績
};

function estimateSalary(answers: Record<string, string>): SalarySimulation {
  const { company, salary, goal } = answers;

  const currentMap: Record<string, number> = {
    under400: 350,
    "400to600": 500,
    "600to800": 700,
    over800: 900,
  };
  const currentMid = currentMap[salary] ?? 500;

  let baseUpMin: number;
  let baseUpMax: number;
  let naraCase: string;

  // ならならの実績に基づいた現実的なレンジ
  if (salary === "under400") {
    if (company === "venture" || company === "mid") {
      // ならなら：410万→450万（同規模）→670万（大手へ）
      baseUpMin = 40;
      baseUpMax = 120;
      naraCase = "僕は年収410万のベンチャーから、まず同規模の会社で450万、その後大手に移って670万になりました";
    } else {
      baseUpMin = 30;
      baseUpMax = 80;
      naraCase = "僕が年収410万だった頃、環境を変えるだけで年収は大きく変わることに気づきました";
    }
  } else if (salary === "400to600") {
    if (company === "venture" || company === "mid") {
      // ならなら：450万→670万（doda経由で大手へ）
      baseUpMin = 80;
      baseUpMax = 200;
      naraCase = "僕は年収450万の時、dodaを使って大手に転職し670万になりました。+220万円です";
    } else {
      baseUpMin = 50;
      baseUpMax = 150;
      naraCase = "僕は年収450万からdodaを使って670万になりました。会社の規模を変えるだけで年収は跳ねます";
    }
  } else if (salary === "600to800") {
    // ならなら：670万→860万（JAC経由で大手へ）
    baseUpMin = 50;
    baseUpMax = 190;
    naraCase = "僕は年収670万の時、JACリクルートメントを使って860万になりました。+190万円です";
  } else {
    // ならなら：860万→1200万（doda経由で現職へ）
    baseUpMin = 80;
    baseUpMax = 300;
    naraCase = "僕は年収860万の時、dodaのエージェントと1年間毎週電話して、1,200万のポジションを見つけました";
  }

  // WLB重視は年収よりQoL優先。正直にレンジを下げる
  if (goal === "balance") {
    baseUpMin = Math.round(baseUpMin * 0.6);
    baseUpMax = Math.round(baseUpMax * 0.7);
  }

  return {
    currentMid,
    upMin: baseUpMin,
    upMax: baseUpMax,
    afterMin: currentMid + baseUpMin,
    afterMax: currentMid + baseUpMax,
    naraCase,
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

type NaraStory = {
  era: string;
  quote: string;
  result: string;
};

type ResultType = {
  type: string;
  ogType: string;
  title: string;
  emoji: string;
  color: string;
  gradient: string;
  message: string;
  advice: string[];
  tieredCTAs: TierCTA[];
  naraStory: NaraStory;
  firstCTA: { label: string; serviceId: string };
  nextAction: string;
};

function getResult(answers: Record<string, string>): ResultType {
  const { company, salary, pain, goal, action } = answers;

  // ── 1. 人間関係で悩んでいる人（専用ルート）──
  if (pain === "relation") {
    return {
      type: "relation-escape",
      ogType: "relation-escape",
      title: "環境リセットで\n自分を取り戻す型",
      emoji: "🔄",
      color: "text-teal-400",
      gradient: "from-teal-500 to-cyan-500",
      message:
        "上司や人間関係がつらいのは、あなたの能力の問題ではありません。僕も大手企業にいた頃、上司から「何もできない」と言われ続けました。でも別の大手に移ったら、同じ自分なのに評価が180度変わった。環境が人を殺すこともあれば、生かすこともある。",
      advice: [
        "今の人間関係がつらいのは、あなたではなく環境の問題。まずそれを認める",
        "転職エージェントに「上司と合わない」と正直に言っていい。守秘義務がある",
        "口コミサイトで「次の会社」の雰囲気を事前に調べる（同じ失敗を繰り返さないために）",
        "面接では「よりチームワークを発揮できる環境で働きたい」と前向きに伝える",
      ],
      tieredCTAs: [
        {
          level: "light",
          label: "気になる企業の社風を調べる",
          sublabel: "社員の口コミで人間関係がわかる",
          serviceId: "openwork",
          reason: "「上司との関係」「風通しの良さ」が数値でわかる。次こそ同じ失敗をしないために",
        },
        {
          level: "medium",
          label: "プロに状況を相談する",
          sublabel: "「上司と合わない」と正直に言える場所",
          serviceId: "doda",
          reason: "僕が人間関係で悩んでいた大手から別の大手に移れたのもdoda。つらい状況を打ち明けるところから始まった",
        },
        {
          level: "strong",
          label: "年収を維持して環境を変える",
          sublabel: "企業の内情に詳しいエージェント",
          serviceId: "jac",
          reason: "面接官の人柄や部署の雰囲気まで教えてくれる。「次の上司」を事前に知れるのはJACだけだった",
        },
      ],
      naraStory: {
        era: "3社目・大手企業時代（年収670万）",
        quote: "上司から「お前は何もできない」「次の会社でもうまくいかない」と言われ続けた。自信を完全に失い、退職時は恥ずかしくて行き先を嘘ついて辞めた。でも次の大手に移ったら、同じ自分が4,000万円のプロジェクトをリードして、Xトレンド入りを達成した。僕が変わったんじゃない。場所が変わっただけ。",
        result: "年収670万 → 860万。評価も成果も激変",
      },
      firstCTA: {
        label: "まず自分の市場価値を確認してみる",
        serviceId: "bizreach",
      },
      nextAction: "つらい環境にいる時こそ、外の世界を見てみよう。ビズリーチに登録して、届くスカウトを眺めるだけでいい。「自分を必要としている会社がある」と知るだけで、気持ちは変わる。",
    };
  }

  // ── 2. ベンチャー/中小 × 年収低め → 環境チェンジ ──
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
        "あなたのスキルは、今の会社では「普通」かもしれません。でも大手企業に持っていけば「希少」になります。僕自身、ベンチャーで年収410万だったスキルが、大手に移っただけで670万の評価になりました。同じスキルでも、居場所を変えるだけで年収は跳ねます。",
      advice: [
        "まず転職エージェントに登録して、自分の市場価値を客観的に知る",
        "職務経歴書は「やったこと」ではなく「動かしたこと」を書く——これだけで書類通過率が変わる",
        "大企業のDX部門・新規事業部門を狙い撃ちする（ベンチャー経験が最も活きるポジション）",
        "年収交渉はエージェントに任せる——僕はdodaに任せて想定以上の額が出た",
      ],
      tieredCTAs: [
        {
          level: "light",
          label: "まず市場価値だけ確認する",
          sublabel: "登録5分・スカウトを待つだけ",
          serviceId: "bizreach",
          reason: "僕も最初の転職はビズリーチ系のスカウトがきっかけだった。届く年収が、あなたの市場価値そのもの",
        },
        {
          level: "medium",
          label: "プロに無料で相談する",
          sublabel: "オンライン面談OK・服装自由",
          serviceId: "doda",
          reason: "僕がベンチャーから大手に移れたのはdodaのおかげ。ベンチャー経験を大企業向けに「翻訳」してくれた",
        },
        {
          level: "strong",
          label: "年収を本気で上げにいく",
          sublabel: "企業の内情に詳しいハイクラス特化",
          serviceId: "jac",
          reason: "面接官の人柄まで教えてくれた唯一のエージェント。合否連絡が10分で届いた時は驚いた",
        },
      ],
      naraStory: {
        era: "ベンチャー2社 → 大手への転職時代",
        quote: "年収410万のベンチャーにいた頃、大学の同期が結婚式にタクシーで来ていた。自分は電車だった。「ちょっとつらいなあ」と思った。でもdodaを使って大手に転職したら、同じスキルで年収670万になった。変わったのは自分じゃない。場所だ。",
        result: "年収410万 → 670万（+260万円）",
      },
      firstCTA: {
        label: "自分のスキルが大手でいくらになるか聞いてみる",
        serviceId: "doda",
      },
      nextAction: "dodaに登録して、エージェントに「自分のスキルは大手でいくらになるか？」を聞いてみよう。僕はこの一歩で人生が変わった。",
    };
  }

  // ── 3. 大手 × スキル不安 → スキルアップシフト ──
  if (company === "large" && (pain === "growth" || goal === "skill")) {
    return {
      type: "skill-up",
      ogType: "skill-up",
      title: "スキルアップ\n環境シフト型",
      emoji: "📈",
      color: "text-emerald-400",
      gradient: "from-emerald-500 to-teal-500",
      message:
        "給料は悪くないけど、スキルが身につかない。「この会社でしか通用しない人間」になる恐怖。その感覚は正しいです。僕も大手にいた頃、社内調整とパワポばかりで「市場価値がゼロになる」と焦っていました。でもDXに力を入れている企業に移ったことで、年収を維持しながら手触り感のある仕事を手に入れられました。",
      advice: [
        "年収を下げずに環境を変えられる案件を探す（ハイクラスエージェント推奨）",
        "DX推進・新規事業など「手触り感のある仕事」ができるポジションを狙う",
        "副業も検討する——僕は本業の安定を維持しつつ、副業で年100万の成長機会を得ている",
        "職務経歴書は「社内調整」を「ステークホルダーマネジメント」に翻訳する",
      ],
      tieredCTAs: [
        {
          level: "light",
          label: "どんなスカウトが来るか見てみる",
          sublabel: "登録5分・今の会社にはバレない",
          serviceId: "bizreach",
          reason: "僕は副業案件もビズリーチで見つけた。転職だけでなく副業という選択肢も見えてくる",
        },
        {
          level: "medium",
          label: "年収維持×成長環境をプロと探す",
          sublabel: "企業の内情まで教えてくれる",
          serviceId: "jac",
          reason: "僕が大手から別の大手に移れたのはJAC。求人の質が高く、年収を維持しつつ環境を変えられた",
        },
        {
          level: "strong",
          label: "幅広い選択肢から本気で選ぶ",
          sublabel: "粘り強く一緒に探してくれる",
          serviceId: "doda",
          reason: "求人数の幅広さはdodaが圧倒的。1年かけて僕に合うポジションを見つけてくれた粘り強さがある",
        },
      ],
      naraStory: {
        era: "3社目 → 4社目の大手転職時代",
        quote: "前の大手では2億円のプロジェクトを一人で仕切った実績があった。でも社内では「パワポ職人」扱い。JACに相談して別の大手のDX部門に移ったら、4,000万の予算を任され、ゼロから会員1万人を集めた。場所を変えたら、眠っていた力が一気に目覚めた。",
        result: "年収670万 → 860万。裁量と成長実感が激変",
      },
      firstCTA: {
        label: "自分のスキルが活きる環境を探してみる",
        serviceId: "jac",
      },
      nextAction: "JACリクルートメントに登録して、「年収維持で成長できる環境」を条件に相談してみよう。僕はこれで人生が変わった。",
    };
  }

  // ── 4. WLB重視 ──
  if (pain === "worklife" || goal === "balance") {
    return {
      type: "work-life-balance",
      ogType: "work-life-balance",
      title: "ワークライフバランス\n改善型",
      emoji: "⚖️",
      color: "text-sky-400",
      gradient: "from-sky-500 to-blue-500",
      message:
        "年収も大事。でも心身が壊れたら元も子もないですよね。僕もベンチャー時代は土日もSlackが鳴り止まなかった。大手に移ったことで、年収は上がったのに残業は減った。「年収と生活の質はトレードオフ」は嘘です。",
      advice: [
        "「残業時間」「リモート可否」「副業可否」を重視して求人を探す",
        "口コミサイトで実際の働き方を確認する（面接では見えない実態がわかる）",
        "エージェントに「残業月20時間以内」など具体的な条件を伝える",
        "面接では「ワークライフバランスを重視している」と正直に言ってOK",
      ],
      tieredCTAs: [
        {
          level: "light",
          label: "気になる企業の実態を調べる",
          sublabel: "残業時間・有休消化率が口コミでわかる",
          serviceId: "openwork",
          reason: "社員の口コミで残業実態やリモート可否がわかる。入社後のギャップ防止に必須",
        },
        {
          level: "medium",
          label: "条件に合う求人をプロと探す",
          sublabel: "「残業月20h以内」で絞り込める",
          serviceId: "doda",
          reason: "僕が2回使って2回とも決めたサービス。条件の細かい希望を伝えやすく、粘り強くサポートしてくれる",
        },
        {
          level: "strong",
          label: "年収維持で環境を変える",
          sublabel: "ハイクラス向け・非公開求人あり",
          serviceId: "jac",
          reason: "年収を下げずにWLBを改善したいなら、求人の質が高いJACが合う",
        },
      ],
      naraStory: {
        era: "ベンチャー時代 → 大手転職後",
        quote: "ベンチャーにいた頃、朝4時起きで勉強して夜は終電。成長している実感はあったけど、この働き方で結婚や子育てはできないと思った。大手に移ったら、年収は260万上がったのに自分の時間ができた。WLBと年収は両立できる。",
        result: "年収410万 → 670万。自分の時間も増えた",
      },
      firstCTA: {
        label: "まず企業の口コミで実態を確認する",
        serviceId: "openwork",
      },
      nextAction: "dodaに登録して、「残業月20時間以内・リモート可」の条件で求人を探してみよう。年収を下げる必要はない。",
    };
  }

  // ── 5. 年収800万以上 × 年収アップ志向 → ハイクラスジャンプ ──
  if (
    (salary === "600to800" || salary === "over800") &&
    (goal === "money" || pain === "salary")
  ) {
    return {
      type: "high-class",
      ogType: "high-class",
      title: "ハイクラス\n年収ジャンプ型",
      emoji: "💎",
      color: "text-amber-400",
      gradient: "from-amber-500 to-yellow-500",
      message:
        "年収600万以上からの年収アップは、求人の数が一気に減ります。だからこそ、ハイクラス特化のエージェントを使うこと、そしてエージェントとの接触頻度を上げることが重要です。僕は860万から1,200万に上がりましたが、dodaのエージェントと1年間毎週電話し続けた結果です。",
      advice: [
        "ハイクラス特化のエージェント（JAC, doda）を併用する",
        "エージェントとの接触頻度を上げる（僕は毎週10分の電話を1年続けた）",
        "年収交渉は必ずエージェントに任せる——自分では言えない金額もプロなら通せる",
        "副業も検討する——僕は本業1,200万+副業200万で収入を分散している",
      ],
      tieredCTAs: [
        {
          level: "light",
          label: "ハイクラスのスカウトを見てみる",
          sublabel: "登録5分・年収800万以上の求人が中心",
          serviceId: "bizreach",
          reason: "僕も副業案件をビズリーチで見つけた。転職だけでなく副業という選択肢も見えてくる",
        },
        {
          level: "medium",
          label: "非公開求人をプロと探す",
          sublabel: "企業の内情まで教えてくれる",
          serviceId: "jac",
          reason: "僕が4社目の大手に入れたのはJAC。合否連絡が面接後10分で来た時は驚いた。企業との関係が深い",
        },
        {
          level: "strong",
          label: "粘り強く一緒に探してもらう",
          sublabel: "見つかるまで毎週伴走してくれる",
          serviceId: "doda",
          reason: "僕が860万→1,200万になったのはdoda。1年間毎週電話し続けて、最終的に見つけてくれた",
        },
      ],
      naraStory: {
        era: "4社目 → 現職への転職時代",
        quote: "年収860万からの転職は求人が少なく長期化した。でもdodaのエージェントと毎週10分だけ電話し続けた。1年かかったが、年収1,200万のポジションを見つけてくれた。ハイクラスの転職は「どれだけエージェントと密にやれるか」で結果が変わる。",
        result: "年収860万 → 1,200万（+340万円）",
      },
      firstCTA: {
        label: "まずスカウトで市場の反応を見る",
        serviceId: "bizreach",
      },
      nextAction: "dodaとJACの両方に登録して、まず自分の年収帯でどんな求人があるか聞いてみよう。毎週10分の電話を始めるだけで、結果は変わる。",
    };
  }

  // ── 6. 市場価値を知りたい / まだ動いていない ──
  if (goal === "value" || action === "nothing") {
    return {
      type: "market-value",
      ogType: "market-value",
      title: "まず市場価値を\n知ろう型",
      emoji: "🔍",
      color: "text-violet-400",
      gradient: "from-violet-500 to-purple-500",
      message:
        "転職するかどうかはまだ決めなくていい。でも自分が市場でいくらの価値があるか知っておくことは、キャリアの「健康診断」です。僕が初めて自分の年収を計算した時、「あれ、思ったより安いな」と感じた。それが全ての始まりでした。",
      advice: [
        "ビズリーチに登録してスカウトを待つ（登録5分、無料。届くスカウトの年収があなたの市場価値）",
        "転職エージェントに「まだ転職は決めていないが、市場価値を知りたい」と正直に伝える",
        "職務経歴書を書いてみる（書くだけで自分の経験が整理される。完璧じゃなくていい）",
      ],
      tieredCTAs: [
        {
          level: "light",
          label: "スカウトで市場価値を見てみる",
          sublabel: "登録5分・届く年収があなたの価値",
          serviceId: "bizreach",
          reason: "登録するだけで企業からスカウトが来る。僕は副業案件もここで見つけた",
        },
        {
          level: "medium",
          label: "プロに市場価値を聞いてみる",
          sublabel: "「転職未定」と伝えれば大丈夫",
          serviceId: "doda",
          reason: "僕が一番信頼しているエージェント。市場価値の相談だけでも丁寧に対応してくれる",
        },
        {
          level: "strong",
          label: "自分の経験を副業で試す",
          sublabel: "1時間のスポットコンサルから",
          serviceId: "visasq",
          reason: "僕はビザスクで年100万の副収入を得ている。「普通のスキル」が外では専門知識になる",
        },
      ],
      naraStory: {
        era: "2社目・ベンチャー時代（年収450万）",
        quote: "転職面接で「希望年収は？」と聞かれて初めて自分の年収を計算した。410万円。「あれ、思ったより安いな」と感じた。それまでは成長環境だけ見ていて、給料を気にしていなかった。自分の値段を知ることが、全ての始まりだった。",
        result: "自分の市場価値を知った後、410万→670万→860万→1,200万と上がっていった",
      },
      firstCTA: {
        label: "まずスカウトで自分の値段を見てみる",
        serviceId: "bizreach",
      },
      nextAction: "ビズリーチに登録してみよう。5分で終わる。届くスカウトの年収が、あなたの市場価値だ。",
    };
  }

  // ── 7. フォールバック ──
  return {
    type: "general",
    ogType: "general",
    title: "キャリア\n見直し型",
    emoji: "🧭",
    color: "text-blue-400",
    gradient: "from-blue-500 to-indigo-500",
    message:
      "今の環境に違和感を感じているなら、それは正しいサインです。僕も4回転職しましたが、毎回「なんか違う」という違和感が出発点でした。転職するかどうかは、情報を集めてから決めればいい。まず外の世界を見てみましょう。",
    advice: [
      "転職エージェントに登録して、自分の市場価値を知る",
      "職務経歴書を書いてみる（書くだけで自分の経験が整理される）",
      "口コミサイトで気になる企業の実態を調べる",
    ],
    tieredCTAs: [
      {
        level: "light",
        label: "気になる企業の口コミを見る",
        sublabel: "社員のリアルな声がわかる",
        serviceId: "openwork",
        reason: "転職するか決める前に、まず「外の世界」を覗いてみるだけでも視野が広がる",
      },
      {
        level: "medium",
        label: "プロに気軽に相談する",
        sublabel: "「転職未定でもOK」で気軽に",
        serviceId: "doda",
        reason: "僕が4回の転職で2回使って2回とも決めたサービス。初めての転職相談にも丁寧に対応してくれる",
      },
      {
        level: "strong",
        label: "スカウトで市場の反応を見る",
        sublabel: "登録5分・届く年収が自分の価値",
        serviceId: "bizreach",
        reason: "登録するだけでスカウトが来る。自分の市場価値が数字でわかる",
      },
    ],
    naraStory: {
      era: "4回の転職を経て",
      quote: "410万→450万→670万→860万→1,200万。4回の転職でわかったのは、「努力」より「場所選び」で年収は決まるということ。どのエージェントに行くかより、何を持っていくか（職務経歴書）の方がもっと大事。それに気づくまで、僕は1回目の転職で失敗している。",
      result: "年収410万 → 1,200万（4回の転職で約3倍）",
    },
    firstCTA: {
      label: "まず外の世界を覗いてみる",
      serviceId: "doda",
    },
    nextAction: "dodaに登録して、まずはエージェントと話してみよう。「転職するかわからないけど相談したい」でOK。僕もそこから始まった。",
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
/*  Loading screen                                                     */
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
            className="text-zinc-500 text-sm mb-10 leading-relaxed"
            style={{ animation: "fadeUp .6s ease-out .35s both" }}
          >
            4回の転職で年収410万→1,200万になった<br className="md:hidden" />
            僕の経験をもとに作りました
          </p>
          {/* 結果サンプル */}
          <div
            className="mb-10 text-left"
            style={{ animation: "fadeUp .6s ease-out .4s both" }}
          >
            <p className="text-sm font-semibold text-zinc-400 text-center mb-5">こんな結果がわかります</p>
            <div className="grid gap-3">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-zinc-800/60 border border-zinc-700/50 backdrop-blur-sm">
                <span className="text-2xl shrink-0">🚀</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-orange-400">環境チェンジで年収ジャンプ型</p>
                  <p className="text-xs text-zinc-500 mt-0.5">ベンチャー・中小から大手への転職で年収アップを狙う戦略</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-zinc-800/60 border border-zinc-700/50 backdrop-blur-sm">
                <span className="text-2xl shrink-0">💎</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-amber-400">ハイクラス年収ジャンプ型</p>
                  <p className="text-xs text-zinc-500 mt-0.5">年収600万以上からさらに上を目指すハイクラス転職戦略</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-zinc-800/60 border border-zinc-700/50 backdrop-blur-sm">
                <span className="text-2xl shrink-0">⚖️</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-sky-400">ワークライフバランス改善型</p>
                  <p className="text-xs text-zinc-500 mt-0.5">年収を維持しながら働き方を改善する環境シフト戦略</p>
                </div>
              </div>
            </div>
            <p className="text-xs text-zinc-600 text-center mt-3">...ほか全7タイプ + 推定年収アップ額を診断</p>
          </div>

          <button
            onClick={() => setPhase("questions")}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold px-10 py-4 rounded-xl text-lg hover:from-blue-600 hover:to-blue-700 transition-all hover:scale-105 active:scale-100 shadow-lg shadow-blue-500/25"
            style={{ animation: "fadeUp .6s ease-out .5s both" }}
          >
            無料で診断する
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
          <p
            className="text-zinc-600 text-xs mt-4"
            style={{ animation: "fadeUp .6s ease-out .45s both" }}
          >
            所要時間：約30秒 / 完全無料
          </p>
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

    const firstSvc = affiliateServices[result.firstCTA.serviceId];

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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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

            {/* ならならの実績ベースの注釈 */}
            <div className="bg-zinc-700/30 rounded-lg p-4 mb-4">
              <p className="text-sm text-zinc-300 leading-relaxed">
                <span className="text-base mr-1">📝</span>
                <strong>僕の場合：</strong>{salaryResult.naraCase}
              </p>
            </div>

            <p className="text-xs text-zinc-500 leading-relaxed">
              ※ 実際の年収はスキル・経験・交渉力によって変動します。より正確な数字は、エージェントとの面談でわかります。
            </p>
          </section>

          {/* ===== First CTA（年収シミュレーション直下）===== */}
          {firstSvc && (
            <div
              className={`bg-gradient-to-r ${result.gradient} rounded-2xl p-6 text-center`}
              style={{ animation: "fadeUp .6s ease-out .6s both" }}
            >
              <p className="text-white/80 text-sm mb-2">この数字、気になったら</p>
              <a
                href={firstSvc.url}
                target="_blank"
                rel="noopener noreferrer sponsored nofollow"
                className="inline-flex items-center gap-2 bg-white text-zinc-900 font-bold px-8 py-3.5 rounded-xl text-base hover:bg-zinc-100 transition-colors shadow-lg"
              >
                {result.firstCTA.label}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <p className="text-white/60 text-xs mt-2">
                {firstSvc.name} / 無料・登録5分
              </p>
            </div>
          )}

          {/* ===== Message ===== */}
          <div
            className="border-l-4 border-l-blue-500 bg-blue-50 rounded-r-2xl p-6 md:p-8"
            style={{ animation: "fadeUp .6s ease-out .65s both" }}
          >
            <p className="text-zinc-700 leading-[1.9] text-base">{result.message}</p>
          </div>

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

          {/* ===== ならならの体験談（実話）===== */}
          <section
            className="bg-zinc-50 border border-border/60 rounded-2xl p-6 md:p-8"
            style={{ animation: "fadeUp .6s ease-out 1.1s both" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">💬</span>
              <h3 className="text-sm font-semibold text-zinc-500">僕（ならなら）の場合 — {result.naraStory.era}</h3>
            </div>
            <blockquote className="text-base text-zinc-700 font-medium leading-[1.9] mb-3">
              {result.naraStory.quote}
            </blockquote>
            <div className="flex items-end justify-end">
              <span className={`text-xs font-bold ${result.color} bg-white px-3 py-1 rounded-full border border-border/60`}>
                {result.naraStory.result}
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
                            僕が実際に使ったサービス
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
                        rel="noopener noreferrer sponsored nofollow"
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
                  エージェントに会う前に、職務経歴書を書いておこう。完璧じゃなくていい。60%の完成度でいいから持っていく——それだけでエージェントの対応が変わる。僕は1回目の転職で職務経歴書なしで行って失敗した。「どのエージェントに行くか」より「何を持っていくか」が大事。
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
