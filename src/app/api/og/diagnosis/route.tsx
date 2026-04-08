import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";

export const runtime = "edge";

const typeConfig: Record<string, { emoji: string; title: string; color: string; bgFrom: string; bgTo: string }> = {
  "environment-change": {
    emoji: "🚀",
    title: "環境チェンジで年収ジャンプ型",
    color: "#f97316",
    bgFrom: "#f97316",
    bgTo: "#ef4444",
  },
  "skill-up": {
    emoji: "📈",
    title: "スキルアップ環境シフト型",
    color: "#10b981",
    bgFrom: "#10b981",
    bgTo: "#14b8a6",
  },
  "work-life-balance": {
    emoji: "⚖️",
    title: "ワークライフバランス改善型",
    color: "#0ea5e9",
    bgFrom: "#0ea5e9",
    bgTo: "#3b82f6",
  },
  "market-value": {
    emoji: "🔍",
    title: "まず市場価値を知ろう型",
    color: "#8b5cf6",
    bgFrom: "#8b5cf6",
    bgTo: "#a855f7",
  },
  "high-class": {
    emoji: "💎",
    title: "ハイクラス年収ジャンプ型",
    color: "#f59e0b",
    bgFrom: "#f59e0b",
    bgTo: "#eab308",
  },
  general: {
    emoji: "🧭",
    title: "キャリア見直し型",
    color: "#3b82f6",
    bgFrom: "#3b82f6",
    bgTo: "#6366f1",
  },
};

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const type = searchParams.get("type") || "general";
  const salaryUp = searchParams.get("up") || "";

  const config = typeConfig[type] || typeConfig.general;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(135deg, #18181b 0%, #27272a 50%, #18181b 100%)`,
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Accent gradient bar at top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: `linear-gradient(90deg, ${config.bgFrom}, ${config.bgTo})`,
          }}
        />

        {/* Label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              fontSize: "18px",
              color: config.color,
              fontWeight: 700,
              letterSpacing: "2px",
            }}
          >
            CAREER DIAGNOSIS RESULT
          </div>
        </div>

        {/* Emoji */}
        <div style={{ fontSize: "80px", marginBottom: "16px" }}>
          {config.emoji}
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: "52px",
            fontWeight: 900,
            color: config.color,
            textAlign: "center",
            lineHeight: 1.3,
            marginBottom: "24px",
          }}
        >
          {config.title}
        </div>

        {/* Salary up badge */}
        {salaryUp && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              background: `linear-gradient(90deg, ${config.bgFrom}, ${config.bgTo})`,
              borderRadius: "16px",
              padding: "12px 32px",
              marginBottom: "24px",
            }}
          >
            <div style={{ fontSize: "20px", color: "rgba(255,255,255,0.8)" }}>
              推定年収アップ
            </div>
            <div style={{ fontSize: "32px", fontWeight: 900, color: "#fff" }}>
              {salaryUp}
            </div>
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            bottom: "32px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div style={{ fontSize: "22px", color: "#71717a" }}>
            🧭 ならなら式転職診断
          </div>
          <div style={{ fontSize: "18px", color: "#52525b" }}>
            nara-career.com/diagnosis
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
