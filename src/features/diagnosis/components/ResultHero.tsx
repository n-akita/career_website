"use client";

import type { ResultType } from "../types";
import AnimatedNumber from "./AnimatedNumber";

type Props = {
  result: ResultType;
  totalScore: number;
};

export default function ResultHero({ result, totalScore }: Props) {
  return (
    <section className="bg-zinc-900 text-white relative overflow-hidden">
      {/* パーティクル */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 rounded-full bg-gradient-to-r ${result.gradient} opacity-20`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `particle ${3 + Math.random() * 4}s ease-in-out ${Math.random() * 2}s infinite alternate`,
              transform: `scale(${0.5 + Math.random() * 1.5})`,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-2xl mx-auto px-4 pt-16 pb-14 text-center">
        <p
          className="text-sm font-semibold text-blue-400 tracking-wider uppercase mb-6"
          style={{ animation: "fadeUp .5s ease-out both" }}
        >
          Your Career Combat Power
        </p>

        {/* 戦闘力スコア */}
        <div
          className="mb-6"
          style={{ animation: "pop .6s ease-out .2s both" }}
        >
          <p className="text-zinc-400 text-sm mb-2">戦闘力</p>
          <p className={`text-7xl md:text-8xl font-black ${result.color}`}>
            <AnimatedNumber target={totalScore} duration={1500} />
          </p>
        </div>

        {/* 二つ名 */}
        <h1
          className={`text-2xl md:text-4xl font-bold mb-3 leading-tight ${result.color}`}
          style={{ animation: "fadeUp .6s ease-out .5s both" }}
        >
          {result.title}
        </h1>
        <p
          className="text-zinc-400 text-sm mb-6"
          style={{ animation: "fadeUp .6s ease-out .6s both" }}
        >
          {result.subtitle}
        </p>

        <div
          className={`inline-block bg-gradient-to-r ${result.gradient} rounded-full px-6 py-1.5 text-sm font-semibold`}
          style={{ animation: "fadeUp .6s ease-out .7s both" }}
        >
          ならなら式キャリア戦闘力診断
        </div>
      </div>

      <style>{`
        @keyframes pop{0%{transform:scale(0) rotate(-10deg);opacity:0}60%{transform:scale(1.15) rotate(5deg)}100%{transform:scale(1) rotate(0);opacity:1}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes particle{from{transform:translateY(0) scale(1)}to{transform:translateY(-30px) scale(1.5)}}
      `}</style>
    </section>
  );
}
