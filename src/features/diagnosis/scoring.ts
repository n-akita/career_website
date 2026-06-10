import type { Scores, AxisKey, ScoreWeight } from "./types";
import { questions } from "./questions";

const AXIS_KEYS: AxisKey[] = ["action", "market", "risk", "strategy", "adapt"];

// 各軸の理論上の最大スコア（全問で最大値を選んだ場合）
const maxPerAxis: ScoreWeight = (() => {
  const max: ScoreWeight = { action: 0, market: 0, risk: 0, strategy: 0, adapt: 0 };
  for (const q of questions) {
    for (const key of AXIS_KEYS) {
      const best = Math.max(...q.choices.map((c) => c.scores[key]));
      max[key] += best;
    }
  }
  return max;
})();

export function calculateScores(answers: Record<string, string>): Scores {
  const raw: ScoreWeight = { action: 0, market: 0, risk: 0, strategy: 0, adapt: 0 };

  for (const q of questions) {
    const selected = answers[q.id];
    const choice = q.choices.find((c) => c.value === selected);
    if (!choice) continue;
    for (const key of AXIS_KEYS) {
      raw[key] += choice.scores[key];
    }
  }

  // 0-100 に正規化
  const normalized: ScoreWeight = { action: 0, market: 0, risk: 0, strategy: 0, adapt: 0 };
  for (const key of AXIS_KEYS) {
    normalized[key] = maxPerAxis[key] > 0
      ? Math.round((raw[key] / maxPerAxis[key]) * 100)
      : 0;
  }

  return normalized;
}

export function calculateTotalScore(scores: Scores): number {
  return Math.round(
    scores.action * 0.25 +
    scores.market * 0.20 +
    scores.risk * 0.15 +
    scores.strategy * 0.25 +
    scores.adapt * 0.15
  );
}

export function getTopAxes(scores: Scores): [AxisKey, AxisKey] {
  const sorted = AXIS_KEYS.slice().sort((a, b) => scores[b] - scores[a]);
  return [sorted[0], sorted[1]];
}

export function getBottomAxis(scores: Scores): AxisKey {
  const sorted = AXIS_KEYS.slice().sort((a, b) => scores[a] - scores[b]);
  return sorted[0];
}

export function determineTypeCode(topAxes: [AxisKey, AxisKey], scores: Scores): string {
  const [top1, top2] = topAxes;
  const topSet = new Set([top1, top2]);

  // 全軸が近い（標準偏差が小さい）→ sleeping-dragon
  const values = AXIS_KEYS.map((k) => scores[k]);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((a, v) => a + (v - mean) ** 2, 0) / values.length;
  if (Math.sqrt(variance) < 12) return "sleeping-dragon";

  // market高 + action低 → silent-monster
  if (top1 === "market" && scores.action <= 40) return "silent-monster";

  // action高 + strategy低 → lightning-mover
  if (top1 === "action" && scores.strategy <= 40) return "lightning-mover";

  // strategy高 + risk低 → iron-wall
  if (topSet.has("strategy") && scores.risk <= 35) return "iron-wall";

  // risk高 + action高 → wild-card
  if (topSet.has("risk") && topSet.has("action")) return "wild-card";

  // adapt高 + action高 → phoenix
  if (topSet.has("adapt") && topSet.has("action")) return "phoenix";

  // adapt高 + market高 → chameleon
  if (topSet.has("adapt") && topSet.has("market")) return "chameleon";

  // strategy高 + market高 → grand-strategist
  if (topSet.has("strategy") && topSet.has("market")) return "grand-strategist";

  // フォールバック: 最も高い軸に基づく
  if (top1 === "action") return "lightning-mover";
  if (top1 === "market") return "silent-monster";
  if (top1 === "strategy") return "grand-strategist";
  if (top1 === "adapt") return "phoenix";
  if (top1 === "risk") return "wild-card";

  return "sleeping-dragon";
}
