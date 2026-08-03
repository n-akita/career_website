"use client";

import { useState } from "react";
import type { DiagnosisResult } from "../types";
import { AXIS_LABELS } from "../types";

type Props = {
  diagnosis: DiagnosisResult;
  onRestart: () => void;
};

export default function ShareSection({ diagnosis, onRestart }: Props) {
  const { resultType, totalScore, topAxes, bottomAxis, salary } = diagnosis;
  const [copied, setCopied] = useState(false);

  const shareText = [
    `ならなら式キャリア戦闘力診断の結果は`,
    `⚔ 戦闘力${totalScore}「${resultType.title}」でした！`,
    ``,
    `💪 強み：${AXIS_LABELS[topAxes[0]]}・${AXIS_LABELS[topAxes[1]]}`,
    `🌱 伸びしろ：${AXIS_LABELS[bottomAxis]}`,
    `📈 推定年収アップ：+${salary.upMin}〜${salary.upMax}万円`,
    ``,
    `あなたのキャリア戦闘力は？`,
  ].join("\n");

  const shareUrl = `https://nara-career.com/career/diagnosis?type=${resultType.type}&score=${totalScore}&a=${diagnosis.scores.action}&m=${diagnosis.scores.market}&r=${diagnosis.scores.risk}&s=${diagnosis.scores.strategy}&ad=${diagnosis.scores.adapt}`;

  // URLに結果が載っているので、本文＋URLをまとめてコピーすればそのまま貼れる
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // クリップボードが使えない環境では何もしない
    }
  };

  return (
    <div className="bg-zinc-900 text-white rounded-2xl p-8 text-center">
      <p className="text-lg font-bold mb-2">この診断結果をシェアしよう</p>
      <p className="text-zinc-400 text-sm mb-6">
        友人とキャリア戦闘力を比べてみよう
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 bg-white text-zinc-900 font-semibold px-6 py-3 rounded-lg hover:bg-zinc-100 transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          {copied ? "コピーしました" : "結果をコピーする"}
        </button>
        <button
          onClick={onRestart}
          className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/10 transition-colors text-sm"
        >
          もう一度診断する
        </button>
      </div>
    </div>
  );
}
