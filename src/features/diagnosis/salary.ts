import type { SalarySimulation, Scores } from "./types";

export function estimateSalary(scores: Scores, totalScore: number): SalarySimulation {
  // 戦闘力スコアに基づいた年収アップ推定
  // ならならの実績: 410→450(+40), 450→670(+220), 670→860(+190), 860→1200(+340)
  let upMin: number;
  let upMax: number;
  let naraCase: string;

  if (totalScore <= 30) {
    upMin = 30;
    upMax = 100;
    naraCase = "僕が最初のベンチャーにいた頃は戦闘力30以下だった。でも環境を変えるだけで年収410万→670万になった。まず動くことが大事";
  } else if (totalScore <= 50) {
    upMin = 50;
    upMax = 200;
    naraCase = "僕は年収450万の時、dodaを使って大手に転職し670万になった。戦闘力を上げながら環境を変えれば年収は跳ねる";
  } else if (totalScore <= 70) {
    upMin = 80;
    upMax = 260;
    naraCase = "僕は年収670万の時、JACを使って860万になった。戦闘力が高い人ほどエージェントの効果が大きい";
  } else {
    upMin = 100;
    upMax = 340;
    naraCase = "僕は年収860万の時、dodaと1年間毎週電話して1,200万のポジションを見つけた。高い戦闘力をプロの力で最大化しよう";
  }

  // 行動力が低い場合はレンジを控えめに
  if (scores.action <= 30) {
    upMin = Math.round(upMin * 0.7);
    upMax = Math.round(upMax * 0.8);
  }

  // 戦略力が高い場合はレンジを上げる
  if (scores.strategy >= 70) {
    upMin = Math.round(upMin * 1.1);
    upMax = Math.round(upMax * 1.15);
  }

  return { upMin, upMax, naraCase };
}
