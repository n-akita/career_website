"use client";

import type { ResultType, AxisKey } from "../types";
import { AXIS_LABELS } from "../types";

type Props = {
  result: ResultType;
  topAxes: [AxisKey, AxisKey];
  bottomAxis: AxisKey;
  scores: Record<AxisKey, number>;
};

export default function StrengthWeakness({ result, topAxes, bottomAxis, scores }: Props) {
  return (
    <section>
      {/* 強み */}
      <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
        <span className={`w-9 h-9 bg-gradient-to-r ${result.gradient} rounded-lg flex items-center justify-center text-white text-sm font-bold`}>&#x1F4AA;</span>
        あなたの強み
      </h2>
      <div className="space-y-3 mb-8">
        {result.strengths.map((s, i) => (
          <div
            key={i}
            className="flex items-start gap-3 bg-white border border-border/60 rounded-xl p-4"
          >
            <span className={`w-7 h-7 bg-gradient-to-r ${result.gradient} text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5`}>
              {i + 1}
            </span>
            <div>
              <p className="text-sm font-semibold text-zinc-800 mb-0.5">
                {AXIS_LABELS[topAxes[i]]}：{scores[topAxes[i]]}点
              </p>
              <p className="text-zinc-600 text-sm leading-relaxed">{s}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 伸びしろ */}
      <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
        <span className="w-9 h-9 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">&#x1F331;</span>
        伸びしろ
      </h2>
      <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4">
        <p className="text-sm font-semibold text-amber-900 mb-1">
          {AXIS_LABELS[bottomAxis]}：{scores[bottomAxis]}点
        </p>
        <p className="text-sm text-amber-800 leading-relaxed">{result.growthTip}</p>
      </div>
    </section>
  );
}
