"use client";

import { useState, useCallback } from "react";
import type { Question, Scores, AxisKey } from "../types";
import { AXIS_LABELS } from "../types";

const AXES: AxisKey[] = ["action", "market", "risk", "strategy", "adapt"];

type Props = {
  question: Question;
  step: number;
  totalSteps: number;
  cumulativeScores: Scores;
  onSelect: (value: string) => void;
  onBack: () => void;
};

export default function QuestionCard({ question, step, totalSteps, cumulativeScores, onSelect, onBack }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const progress = ((step + 1) / totalSteps) * 100;

  const handleSelect = useCallback((value: string) => {
    if (selected !== null) return;
    setSelected(value);
    setTimeout(() => {
      onSelect(value);
    }, 400);
  }, [selected, onSelect]);

  return (
    <div className="min-h-[80vh] bg-zinc-900 text-white">
      <div className="max-w-2xl mx-auto px-4 pt-8 pb-20">
        {/* ヘッダー: 戻るボタン + プログレス */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              {step > 0 && (
                <button
                  onClick={onBack}
                  className="text-zinc-500 hover:text-zinc-300 transition-colors text-sm flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  戻る
                </button>
              )}
              <p className="text-xs text-zinc-500 font-semibold tracking-wider uppercase">
                Question {step + 1} / {totalSteps}
              </p>
            </div>
            <p className="text-xs text-zinc-500">{Math.round(progress)}%</p>
          </div>
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-blue-400 to-purple-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* ミニレーダー（戦闘力チャージ中） */}
        <div className="flex justify-center mb-8">
          <MiniRadar scores={cumulativeScores} step={step} totalSteps={totalSteps} />
        </div>

        {/* 質問 */}
        <div key={`q-${step}`} style={{ animation: "slideIn .4s ease-out both" }}>
          <h2 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">
            {question.question}
          </h2>
          <p className="text-zinc-500 text-sm mb-8">{question.sub}</p>

          <div className="space-y-3">
            {question.choices.map((c, i) => (
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

      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideIn{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}
      `}</style>
    </div>
  );
}

/* ミニレーダー: 回答するたびに軸が光る */
function MiniRadar({ scores, step, totalSteps }: { scores: Scores; step: number; totalSteps: number }) {
  const size = 80;
  const center = size / 2;
  const radius = 28;
  const angleOffset = -Math.PI / 2;

  const getPoint = (index: number, value: number): [number, number] => {
    const angle = angleOffset + (2 * Math.PI * index) / AXES.length;
    const r = radius * (value / 100);
    return [center + r * Math.cos(angle), center + r * Math.sin(angle)];
  };

  // 正規化（現在のステップまでの最大値で割る）
  const maxPossible = (step + 1) * 3;
  const normalized: Scores = { action: 0, market: 0, risk: 0, strategy: 0, adapt: 0 };
  for (const key of AXES) {
    normalized[key] = maxPossible > 0 ? Math.min(Math.round((scores[key] / maxPossible) * 100), 100) : 0;
  }

  const polygonPts = AXES.map((key, i) => getPoint(i, normalized[key]).join(",")).join(" ");
  const gridPts = AXES.map((_, i) => getPoint(i, 100).join(",")).join(" ");

  return (
    <div className="flex flex-col items-center gap-1">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-16 h-16">
        <polygon points={gridPts} fill="none" stroke="rgba(113,113,122,0.3)" strokeWidth="0.5" />
        {AXES.map((_, i) => {
          const [x, y] = getPoint(i, 100);
          return <line key={i} x1={center} y1={center} x2={x} y2={y} stroke="rgba(113,113,122,0.15)" strokeWidth="0.5" />;
        })}
        <polygon points={polygonPts} fill="rgba(59,130,246,0.15)" stroke="rgba(59,130,246,0.6)" strokeWidth="1.5" />
        {AXES.map((key, i) => {
          const [x, y] = getPoint(i, normalized[key]);
          return <circle key={key} cx={x} cy={y} r="2" fill="#3b82f6" />;
        })}
      </svg>
      <p className="text-[10px] text-zinc-600">戦闘力チャージ中... {step + 1}/{totalSteps}</p>
    </div>
  );
}
