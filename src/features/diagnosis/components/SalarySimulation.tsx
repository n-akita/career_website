"use client";

import { useState } from "react";
import type { ResultType, SalarySimulation as SalarySim } from "../types";
import AnimatedNumber from "./AnimatedNumber";

type Props = {
  result: ResultType;
  salary: SalarySim;
};

export default function SalarySimulation({ result, salary }: Props) {
  const [inputSalary, setInputSalary] = useState<string>("");
  const parsedSalary = parseInt(inputSalary, 10);
  const hasInput = !isNaN(parsedSalary) && parsedSalary > 0;

  return (
    <section className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 rounded-2xl p-6 md:p-8 text-white border border-zinc-700/50">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-2xl">&#x1F4B0;</span>
        <h2 className="text-xl font-bold">年収シミュレーション</h2>
      </div>

      {/* 概算レンジ */}
      <div className={`bg-gradient-to-r ${result.gradient} rounded-xl p-5 text-center mb-4`}>
        <p className="text-white/70 text-sm mb-1">あなたのタイプの推定年収アップ</p>
        <p className="text-3xl font-black text-white">
          +<AnimatedNumber target={salary.upMin} />〜<AnimatedNumber target={salary.upMax} suffix="万円" />
        </p>
      </div>

      {/* オプショナル年収入力 */}
      <div className="bg-zinc-700/30 rounded-lg p-4 mb-4">
        <p className="text-sm text-zinc-300 mb-3">
          現在の年収を入力すると、より具体的な数字が見られます
        </p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="例: 500"
            value={inputSalary}
            onChange={(e) => setInputSalary(e.target.value)}
            className="flex-1 bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-2.5 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
          <span className="text-zinc-400 text-sm shrink-0">万円</span>
        </div>

        {hasInput && (
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="bg-zinc-800/80 rounded-lg p-3 text-center">
              <p className="text-[10px] text-zinc-400 mb-0.5">現在</p>
              <p className="text-lg font-bold text-zinc-300">{parsedSalary}万</p>
            </div>
            <div className="bg-zinc-800/80 rounded-lg p-3 text-center relative">
              <div className={`absolute -top-2 left-1/2 -translate-x-1/2 bg-gradient-to-r ${result.gradient} text-[10px] font-bold px-2 py-0.5 rounded-full`}>
                UP
              </div>
              <p className="text-[10px] text-zinc-400 mb-0.5">推定アップ</p>
              <p className={`text-lg font-bold ${result.color}`}>+{salary.upMin}〜{salary.upMax}万</p>
            </div>
            <div className={`bg-gradient-to-br ${result.gradient} rounded-lg p-3 text-center`}>
              <p className="text-[10px] text-white/70 mb-0.5">転職後</p>
              <p className="text-lg font-bold text-white">{parsedSalary + salary.upMin}〜{parsedSalary + salary.upMax}万</p>
            </div>
          </div>
        )}
      </div>

      {/* ならならの実績 */}
      <div className="bg-zinc-700/30 rounded-lg p-4 mb-4">
        <p className="text-sm text-zinc-300 leading-relaxed">
          <span className="text-base mr-1">&#x1F4DD;</span>
          <strong>僕の場合：</strong>{salary.naraCase}
        </p>
      </div>

      <p className="text-xs text-zinc-500 leading-relaxed">
        ※ 実際の年収はスキル・経験・交渉力によって変動します。より正確な数字は、エージェントとの面談でわかります。
      </p>
    </section>
  );
}
