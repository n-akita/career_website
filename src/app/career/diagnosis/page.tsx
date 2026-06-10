"use client";

import { useState, useCallback } from "react";
import type { Phase, Scores, DiagnosisResult, AxisKey } from "@/features/diagnosis/types";
import { questions } from "@/features/diagnosis/questions";
import { calculateScores, calculateTotalScore, getTopAxes, getBottomAxis, determineTypeCode } from "@/features/diagnosis/scoring";
import { resultTypes, legacyTypeMapping } from "@/features/diagnosis/results";
import { estimateSalary } from "@/features/diagnosis/salary";
import StartScreen from "@/features/diagnosis/components/StartScreen";
import QuestionCard from "@/features/diagnosis/components/QuestionCard";
import LoadingScreen from "@/features/diagnosis/components/LoadingScreen";
import ResultHero from "@/features/diagnosis/components/ResultHero";
import RadarChart from "@/features/diagnosis/components/RadarChart";
import StrengthWeakness from "@/features/diagnosis/components/StrengthWeakness";
import NaraStory from "@/features/diagnosis/components/NaraStory";
import SalarySimulation from "@/features/diagnosis/components/SalarySimulation";
import ActionPlan from "@/features/diagnosis/components/ActionPlan";
import ShareSection from "@/features/diagnosis/components/ShareSection";

export default function DiagnosisPage() {
  const [phase, setPhase] = useState<Phase>("start");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);

  // 累積スコア（ミニレーダー用）
  const cumulativeScores: Scores = (() => {
    const raw: Scores = { action: 0, market: 0, risk: 0, strategy: 0, adapt: 0 };
    for (const q of questions.slice(0, step)) {
      const selected = answers[q.id];
      const choice = q.choices.find((c) => c.value === selected);
      if (!choice) continue;
      for (const key of Object.keys(raw) as AxisKey[]) {
        raw[key] += choice.scores[key];
      }
    }
    return raw;
  })();

  const handleStart = useCallback(() => setPhase("questions"), []);

  const handleSelect = useCallback((value: string) => {
    const q = questions[step];
    const next = { ...answers, [q.id]: value };
    setAnswers(next);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      // 最後の質問 → ローディング → 結果
      setPhase("loading");
      setTimeout(() => {
        const scores = calculateScores(next);
        const totalScore = calculateTotalScore(scores);
        const topAxes = getTopAxes(scores);
        const bottomAxis = getBottomAxis(scores);
        const typeCode = determineTypeCode(topAxes, scores);
        const resultType = resultTypes[typeCode] || resultTypes["sleeping-dragon"];
        const salary = estimateSalary(scores, totalScore);

        setDiagnosis({ scores, totalScore, resultType, topAxes, bottomAxis, salary });
        setPhase("result");
      }, 2800);
    }
  }, [step, answers]);

  const handleBack = useCallback(() => {
    if (step > 0) {
      const prevQ = questions[step - 1];
      const next = { ...answers };
      delete next[prevQ.id];
      setAnswers(next);
      setStep(step - 1);
    }
  }, [step, answers]);

  const restart = useCallback(() => {
    setPhase("start");
    setStep(0);
    setAnswers({});
    setDiagnosis(null);
  }, []);

  // ===== START =====
  if (phase === "start") {
    return <StartScreen onStart={handleStart} />;
  }

  // ===== LOADING =====
  if (phase === "loading") {
    return <LoadingScreen />;
  }

  // ===== RESULT =====
  if (phase === "result" && diagnosis) {
    const { resultType, scores, totalScore, topAxes, bottomAxis, salary } = diagnosis;

    return (
      <>
        <ResultHero result={resultType} totalScore={totalScore} />

        <div className="max-w-2xl mx-auto px-4 py-12 space-y-10">
          {/* レーダーチャート */}
          <section className="bg-zinc-900 rounded-2xl p-6 md:p-8 text-white border border-zinc-700/50">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">&#x1F4CA;</span>
              <h2 className="text-xl font-bold">あなたのキャリア戦闘力</h2>
            </div>
            <RadarChart
              scores={scores}
              naraScores={resultType.naraScores}
              color={resultType.hexColor}
            />
          </section>

          {/* 強み/伸びしろ */}
          <StrengthWeakness
            result={resultType}
            topAxes={topAxes}
            bottomAxis={bottomAxis}
            scores={scores}
          />

          {/* メッセージ */}
          <div className="border-l-4 border-l-blue-500 bg-blue-50 rounded-r-2xl p-6 md:p-8">
            <p className="text-zinc-700 leading-[1.9] text-base">{resultType.message}</p>
          </div>

          {/* ならならストーリー */}
          <NaraStory result={resultType} />

          {/* 年収シミュレーション */}
          <SalarySimulation result={resultType} salary={salary} />

          {/* アクションプラン + CTA */}
          <ActionPlan result={resultType} />

          {/* シェア */}
          <ShareSection diagnosis={diagnosis} onRestart={restart} />
        </div>
      </>
    );
  }

  // ===== QUESTIONS =====
  return (
    <QuestionCard
      key={step}
      question={questions[step]}
      step={step}
      totalSteps={questions.length}
      cumulativeScores={cumulativeScores}
      onSelect={handleSelect}
      onBack={handleBack}
    />
  );
}
