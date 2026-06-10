export type ScoreWeight = {
  action: number;
  market: number;
  risk: number;
  strategy: number;
  adapt: number;
};

export type AxisKey = keyof ScoreWeight;

export const AXIS_LABELS: Record<AxisKey, string> = {
  action: "行動突破力",
  market: "市場価値感度",
  risk: "リスク耐性",
  strategy: "戦略設計力",
  adapt: "環境適応力",
};

export type Choice = {
  label: string;
  value: string;
  icon: string;
  scores: ScoreWeight;
};

export type Question = {
  id: string;
  question: string;
  sub: string;
  choices: Choice[];
};

export type TierCTA = {
  level: "light" | "medium" | "strong";
  label: string;
  sublabel: string;
  serviceId: string;
  reason: string;
};

export type NaraStory = {
  era: string;
  quote: string;
  result: string;
};

export type ResultType = {
  type: string;
  title: string;
  subtitle: string;
  color: string;
  gradient: string;
  hexColor: string;
  hexGradientFrom: string;
  hexGradientTo: string;
  message: string;
  strengths: string[];
  growthTip: string;
  tieredCTAs: TierCTA[];
  naraStory: NaraStory;
  naraScores: ScoreWeight;
  firstCTA: { label: string; serviceId: string };
  nextAction: string;
};

export type Scores = ScoreWeight;

export type SalarySimulation = {
  upMin: number;
  upMax: number;
  naraCase: string;
};

export type DiagnosisResult = {
  scores: Scores;
  totalScore: number;
  resultType: ResultType;
  topAxes: [AxisKey, AxisKey];
  bottomAxis: AxisKey;
  salary: SalarySimulation;
};

export type Phase = "start" | "questions" | "loading" | "result";
