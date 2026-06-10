"use client";

import { useState, useEffect } from "react";
import type { Scores, AxisKey } from "../types";
import { AXIS_LABELS } from "../types";

const AXES: AxisKey[] = ["action", "market", "risk", "strategy", "adapt"];
const SIZE = 300;
const CENTER = SIZE / 2;
const RADIUS = 110;
const ANGLE_OFFSET = -Math.PI / 2;

function getPoint(index: number, value: number, radius = RADIUS): [number, number] {
  const angle = ANGLE_OFFSET + (2 * Math.PI * index) / AXES.length;
  const r = radius * (value / 100);
  return [CENTER + r * Math.cos(angle), CENTER + r * Math.sin(angle)];
}

function polygonPoints(scores: Scores, radius = RADIUS): string {
  return AXES.map((key, i) => getPoint(i, scores[key], radius).join(",")).join(" ");
}

function gridPolygon(level: number): string {
  return AXES.map((_, i) => getPoint(i, level).join(",")).join(" ");
}

type Props = {
  scores: Scores;
  naraScores: Scores;
  color: string;
  animate?: boolean;
};

export default function RadarChart({ scores, naraScores, color, animate = true }: Props) {
  const [progress, setProgress] = useState(animate ? 0 : 1);

  useEffect(() => {
    if (!animate) return;
    const start = Date.now();
    const duration = 1200;
    const tick = () => {
      const elapsed = Date.now() - start;
      const p = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setProgress(eased);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [animate]);

  const animatedScores: Scores = {
    action: Math.round(scores.action * progress),
    market: Math.round(scores.market * progress),
    risk: Math.round(scores.risk * progress),
    strategy: Math.round(scores.strategy * progress),
    adapt: Math.round(scores.adapt * progress),
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-[280px] md:w-[340px]">
        {/* グリッド線 */}
        {[33, 66, 100].map((level) => (
          <polygon
            key={level}
            points={gridPolygon(level)}
            fill="none"
            stroke="rgba(113,113,122,0.3)"
            strokeWidth="1"
          />
        ))}

        {/* 軸線 */}
        {AXES.map((_, i) => {
          const [x, y] = getPoint(i, 100);
          return (
            <line
              key={i}
              x1={CENTER}
              y1={CENTER}
              x2={x}
              y2={y}
              stroke="rgba(113,113,122,0.2)"
              strokeWidth="1"
            />
          );
        })}

        {/* ならならのスコア（半透明） */}
        <polygon
          points={polygonPoints(naraScores)}
          fill="rgba(250,204,21,0.08)"
          stroke="rgba(250,204,21,0.4)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />

        {/* ユーザーのスコア */}
        <polygon
          points={polygonPoints(animatedScores)}
          fill={`${color}15`}
          stroke={color}
          strokeWidth="2.5"
        />

        {/* スコアのドット */}
        {AXES.map((key, i) => {
          const [x, y] = getPoint(i, animatedScores[key]);
          return (
            <circle key={key} cx={x} cy={y} r="4" fill={color} />
          );
        })}

        {/* 軸ラベル */}
        {AXES.map((key, i) => {
          const [x, y] = getPoint(i, 130);
          const anchor = x < CENTER - 10 ? "end" : x > CENTER + 10 ? "start" : "middle";
          return (
            <text
              key={key}
              x={x}
              y={y}
              textAnchor={anchor}
              dominantBaseline="middle"
              fill="#a1a1aa"
              fontSize="11"
              fontWeight="600"
            >
              {AXIS_LABELS[key]}
            </text>
          );
        })}
      </svg>

      {/* スコアバー */}
      <div className="w-full max-w-xs space-y-2">
        {AXES.map((key) => (
          <div key={key} className="flex items-center gap-2">
            <span className="text-xs text-zinc-400 w-[5.5rem] shrink-0 text-right">{AXIS_LABELS[key]}</span>
            <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${animatedScores[key]}%`,
                  backgroundColor: color,
                }}
              />
            </div>
            <span className="text-xs font-bold text-zinc-300 w-8 text-right">{animatedScores[key]}</span>
          </div>
        ))}
      </div>

      {/* 凡例 */}
      <div className="flex items-center gap-4 text-xs text-zinc-500">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 rounded" style={{ backgroundColor: color }} />
          <span>あなた</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 rounded bg-yellow-400/40" style={{ borderTop: "1px dashed rgba(250,204,21,0.6)" }} />
          <span>ならなら</span>
        </div>
      </div>
    </div>
  );
}
