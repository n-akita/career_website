import type { Question } from "./types";

export const questions: Question[] = [
  {
    id: "q1_mindset",
    question: "日曜夜、明日の仕事を考えると？",
    sub: "一番近い気持ちを選んでください",
    choices: [
      { label: "正直つらい", value: "painful", icon: "😞", scores: { action: 1, market: 0, risk: 0, strategy: 0, adapt: 3 } },
      { label: "ちょっと憂鬱", value: "blue", icon: "😐", scores: { action: 0, market: 1, risk: 0, strategy: 0, adapt: 2 } },
      { label: "特に何も感じない", value: "neutral", icon: "😶", scores: { action: 0, market: 0, risk: 1, strategy: 1, adapt: 1 } },
      { label: "わりとワクワクする", value: "excited", icon: "😊", scores: { action: 1, market: 2, risk: 2, strategy: 2, adapt: 0 } },
    ],
  },
  {
    id: "q2_action",
    question: "転職サイトやエージェントに登録したことは？",
    sub: "過去の経験も含めてOK",
    choices: [
      { label: "登録したことがない", value: "never", icon: "🙅", scores: { action: 0, market: 0, risk: 0, strategy: 0, adapt: 0 } },
      { label: "登録だけして放置中", value: "dormant", icon: "📱", scores: { action: 1, market: 1, risk: 0, strategy: 0, adapt: 1 } },
      { label: "たまにスカウトを見ている", value: "browsing", icon: "👀", scores: { action: 2, market: 2, risk: 1, strategy: 1, adapt: 1 } },
      { label: "エージェントと面談済み", value: "consulted", icon: "🤝", scores: { action: 3, market: 3, risk: 2, strategy: 2, adapt: 2 } },
    ],
  },
  {
    id: "q3_market",
    question: "自分の年収、同業種の平均と比べて高い？低い？",
    sub: "なんとなくでOK",
    choices: [
      { label: "考えたこともない", value: "unaware", icon: "🤷", scores: { action: 0, market: 0, risk: 0, strategy: 0, adapt: 0 } },
      { label: "なんとなく低い気がする", value: "probably_low", icon: "😥", scores: { action: 1, market: 1, risk: 0, strategy: 0, adapt: 1 } },
      { label: "調べたことがあり、大体わかる", value: "researched", icon: "📊", scores: { action: 1, market: 2, risk: 1, strategy: 2, adapt: 1 } },
      { label: "定期的にチェックしている", value: "monitoring", icon: "🔍", scores: { action: 2, market: 3, risk: 2, strategy: 3, adapt: 1 } },
    ],
  },
  {
    id: "q4_risk",
    question: "同じ年収で全く違う業界のオファーが来たら？",
    sub: "直感で選んでください",
    choices: [
      { label: "怖いから断る", value: "reject", icon: "🛡️", scores: { action: 0, market: 0, risk: 0, strategy: 1, adapt: 0 } },
      { label: "興味はあるけど多分断る", value: "hesitate", icon: "🤔", scores: { action: 0, market: 1, risk: 1, strategy: 1, adapt: 0 } },
      { label: "話だけは聞いてみる", value: "listen", icon: "👂", scores: { action: 2, market: 2, risk: 2, strategy: 1, adapt: 1 } },
      { label: "面白そうなら飛び込む", value: "jump", icon: "🚀", scores: { action: 3, market: 2, risk: 3, strategy: 0, adapt: 2 } },
    ],
  },
  {
    id: "q5_resume",
    question: "職務経歴書、今すぐ出せと言われたら？",
    sub: "完成度で選んでください",
    choices: [
      { label: "書いたことがない", value: "none", icon: "📄", scores: { action: 0, market: 0, risk: 0, strategy: 0, adapt: 0 } },
      { label: "昔書いたものがあるが古い", value: "outdated", icon: "📁", scores: { action: 1, market: 0, risk: 0, strategy: 1, adapt: 1 } },
      { label: "ある程度はすぐ出せる", value: "ready", icon: "📋", scores: { action: 2, market: 1, risk: 1, strategy: 2, adapt: 1 } },
      { label: "常に最新に保っている", value: "updated", icon: "✅", scores: { action: 3, market: 2, risk: 2, strategy: 3, adapt: 2 } },
    ],
  },
  {
    id: "q6_future",
    question: "今の会社で「3年後の自分」が見える？",
    sub: "キャリアの見通しを教えてください",
    choices: [
      { label: "全く見えない", value: "blind", icon: "🌑", scores: { action: 1, market: 0, risk: 0, strategy: 0, adapt: 3 } },
      { label: "なんとなく見えるが不安", value: "vague", icon: "🌤️", scores: { action: 0, market: 1, risk: 0, strategy: 1, adapt: 2 } },
      { label: "見えるし、悪くはない", value: "ok", icon: "☀️", scores: { action: 0, market: 1, risk: 1, strategy: 2, adapt: 1 } },
      { label: "見える。でも、もっと上がありそう", value: "ambitious", icon: "🔥", scores: { action: 2, market: 3, risk: 2, strategy: 2, adapt: 1 } },
    ],
  },
  {
    id: "q7_strategy",
    question: "転職するとしたら、どう動く？",
    sub: "一番近い動き方を選んでください",
    choices: [
      { label: "とりあえず求人サイトで探す", value: "browse", icon: "🔎", scores: { action: 2, market: 0, risk: 1, strategy: 0, adapt: 1 } },
      { label: "知人に相談する", value: "ask_friend", icon: "💬", scores: { action: 1, market: 1, risk: 0, strategy: 1, adapt: 2 } },
      { label: "エージェント複数社に登録して比較する", value: "multi_agent", icon: "📱", scores: { action: 2, market: 2, risk: 1, strategy: 2, adapt: 1 } },
      { label: "市場調査→経歴書→エージェント選定の順で計画", value: "planned", icon: "📐", scores: { action: 2, market: 3, risk: 1, strategy: 3, adapt: 1 } },
    ],
  },
  {
    id: "q8_income",
    question: "今の会社で年収を上げる方法は？",
    sub: "一番近い考え方を選んでください",
    choices: [
      { label: "昇進するしかない", value: "promotion", icon: "📈", scores: { action: 0, market: 0, risk: 0, strategy: 1, adapt: 0 } },
      { label: "副業で補う", value: "sidejob", icon: "💻", scores: { action: 2, market: 2, risk: 2, strategy: 1, adapt: 1 } },
      { label: "転職で環境を変える", value: "switch", icon: "🔄", scores: { action: 2, market: 2, risk: 2, strategy: 1, adapt: 2 } },
      { label: "複数の方法を組み合わせている", value: "combined", icon: "🎯", scores: { action: 3, market: 3, risk: 2, strategy: 3, adapt: 2 } },
    ],
  },
  {
    id: "q9_invest",
    question: "仕事関連のスキルアップ、直近1年で何かした？",
    sub: "プライベートの時間を使ったものを選んでください",
    choices: [
      { label: "特にしていない", value: "nothing", icon: "😴", scores: { action: 0, market: 0, risk: 0, strategy: 0, adapt: 0 } },
      { label: "本を読んだ程度", value: "reading", icon: "📚", scores: { action: 1, market: 1, risk: 0, strategy: 1, adapt: 0 } },
      { label: "資格取得や講座を受けた", value: "course", icon: "🎓", scores: { action: 2, market: 1, risk: 1, strategy: 2, adapt: 1 } },
      { label: "副業やプロジェクトで実践した", value: "practice", icon: "⚡", scores: { action: 3, market: 3, risk: 2, strategy: 2, adapt: 2 } },
    ],
  },
  {
    id: "q10_decision",
    question: "「今の会社、もう限界だ」と感じたとき、どうする？",
    sub: "過去の経験 or 想像で答えてください",
    choices: [
      { label: "我慢して続ける", value: "endure", icon: "😣", scores: { action: 0, market: 0, risk: 0, strategy: 0, adapt: 0 } },
      { label: "愚痴を言いつつ耐える", value: "complain", icon: "😤", scores: { action: 0, market: 0, risk: 0, strategy: 0, adapt: 1 } },
      { label: "転職活動を始める", value: "start_search", icon: "🏃", scores: { action: 2, market: 1, risk: 2, strategy: 1, adapt: 2 } },
      { label: "転職先を決めてから辞める計画を立てる", value: "plan_exit", icon: "🧠", scores: { action: 2, market: 2, risk: 1, strategy: 3, adapt: 2 } },
    ],
  },
];
