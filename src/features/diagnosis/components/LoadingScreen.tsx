"use client";

import { useState, useEffect } from "react";

const messages = [
  "あなたの回答を分析しています...",
  "5つの武器をスキャン中...",
  "戦闘力を算出中...",
  "レーダーチャートを生成中...",
  "最適なキャリア戦略を選定中...",
];

export default function LoadingScreen() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timers = messages.slice(1).map((_, i) =>
      setTimeout(() => setCount(i + 1), (i + 1) * 500)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-zinc-900">
      <div className="text-center">
        <div className="relative w-28 h-28 mx-auto mb-8">
          {/* 外枠 */}
          <div className="absolute inset-0 rounded-full border-4 border-zinc-700" />
          {/* スピナー */}
          <div
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-blue-400"
            style={{ animation: "spin .8s linear infinite" }}
          />
          {/* ミニ五角形（パルス） */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 60 60" className="w-10 h-10" style={{ animation: "pulse 1.2s ease-in-out infinite" }}>
              {(() => {
                const cx = 30, cy = 30, r = 22;
                const pts = Array.from({ length: 5 }, (_, i) => {
                  const angle = -Math.PI / 2 + (2 * Math.PI * i) / 5;
                  const progress = Math.min((count + 1) / messages.length, 1);
                  const pr = r * (0.3 + 0.7 * progress);
                  return `${cx + pr * Math.cos(angle)},${cy + pr * Math.sin(angle)}`;
                }).join(" ");
                return (
                  <polygon
                    points={pts}
                    fill="rgba(59,130,246,0.2)"
                    stroke="rgba(59,130,246,0.8)"
                    strokeWidth="1.5"
                  />
                );
              })()}
            </svg>
          </div>
        </div>

        <div className="h-12">
          <p
            key={count}
            className="text-white text-lg font-bold"
            style={{ animation: "fadeUp .3s ease-out both" }}
          >
            {messages[count]}
          </p>
        </div>

        <div className="flex gap-1.5 justify-center mt-6">
          {messages.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                i <= count ? "bg-blue-500" : "bg-zinc-700"
              }`}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
      `}</style>
    </div>
  );
}
