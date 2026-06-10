"use client";

import type { DiagnosisResult } from "../types";
import { AXIS_LABELS } from "../types";

type Props = {
  diagnosis: DiagnosisResult;
  onRestart: () => void;
};

export default function ShareSection({ diagnosis, onRestart }: Props) {
  const { resultType, totalScore, topAxes, bottomAxis, salary } = diagnosis;

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

  return (
    <div className="bg-zinc-900 text-white rounded-2xl p-8 text-center">
      <p className="text-lg font-bold mb-2">この診断結果をシェアしよう</p>
      <p className="text-zinc-400 text-sm mb-6">
        友人とキャリア戦闘力を比べてみよう
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
          onClick={onRestart}
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
  );
}
