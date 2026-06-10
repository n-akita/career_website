import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";

export const runtime = "edge";

const typeConfig: Record<string, { title: string; color: string; bgFrom: string; bgTo: string }> = {
  "silent-monster": {
    title: "沈黙の市場価値モンスター",
    color: "#a855f7",
    bgFrom: "#a855f7",
    bgTo: "#8b5cf6",
  },
  "lightning-mover": {
    title: "電光石火の行動派",
    color: "#f97316",
    bgFrom: "#f97316",
    bgTo: "#f59e0b",
  },
  "iron-wall": {
    title: "鉄壁の安定キャリア",
    color: "#3b82f6",
    bgFrom: "#3b82f6",
    bgTo: "#6366f1",
  },
  "wild-card": {
    title: "ワイルドカード挑戦者",
    color: "#ef4444",
    bgFrom: "#ef4444",
    bgTo: "#f43f5e",
  },
  chameleon: {
    title: "環境カメレオン",
    color: "#10b981",
    bgFrom: "#10b981",
    bgTo: "#14b8a6",
  },
  "sleeping-dragon": {
    title: "眠れる龍",
    color: "#eab308",
    bgFrom: "#eab308",
    bgTo: "#f59e0b",
  },
  "grand-strategist": {
    title: "グランドストラテジスト",
    color: "#6366f1",
    bgFrom: "#6366f1",
    bgTo: "#2563eb",
  },
  phoenix: {
    title: "不死鳥リスタート",
    color: "#f43f5e",
    bgFrom: "#f43f5e",
    bgTo: "#f97316",
  },
  // 旧タイプ（後方互換）
  "relation-escape": {
    title: "環境リセットで自分を取り戻す型",
    color: "#14b8a6",
    bgFrom: "#14b8a6",
    bgTo: "#06b6d4",
  },
  "environment-change": {
    title: "環境チェンジで年収ジャンプ型",
    color: "#f97316",
    bgFrom: "#f97316",
    bgTo: "#ef4444",
  },
  "skill-up": {
    title: "スキルアップ環境シフト型",
    color: "#10b981",
    bgFrom: "#10b981",
    bgTo: "#14b8a6",
  },
  "work-life-balance": {
    title: "ワークライフバランス改善型",
    color: "#0ea5e9",
    bgFrom: "#0ea5e9",
    bgTo: "#3b82f6",
  },
  "market-value": {
    title: "まず市場価値を知ろう型",
    color: "#8b5cf6",
    bgFrom: "#8b5cf6",
    bgTo: "#a855f7",
  },
  "high-class": {
    title: "ハイクラス年収ジャンプ型",
    color: "#f59e0b",
    bgFrom: "#f59e0b",
    bgTo: "#eab308",
  },
  general: {
    title: "キャリア戦闘力診断",
    color: "#3b82f6",
    bgFrom: "#3b82f6",
    bgTo: "#6366f1",
  },
};

const AXES = ["action", "market", "risk", "strategy", "adapt"] as const;
const AXIS_LABELS = ["行動突破力", "市場価値感度", "リスク耐性", "戦略設計力", "環境適応力"];

function getRadarPoint(centerX: number, centerY: number, radius: number, index: number, value: number): [number, number] {
  const angle = -Math.PI / 2 + (2 * Math.PI * index) / 5;
  const r = radius * (value / 100);
  return [centerX + r * Math.cos(angle), centerY + r * Math.sin(angle)];
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const type = searchParams.get("type") || "general";
  const score = searchParams.get("score") || "";
  const salaryUp = searchParams.get("up") || "";

  // レーダーチャート用スコア
  const a = parseInt(searchParams.get("a") || "0", 10);
  const m = parseInt(searchParams.get("m") || "0", 10);
  const r = parseInt(searchParams.get("r") || "0", 10);
  const s = parseInt(searchParams.get("s") || "0", 10);
  const ad = parseInt(searchParams.get("ad") || "0", 10);
  const hasScores = a > 0 || m > 0 || r > 0 || s > 0 || ad > 0;
  const scores = [a, m, r, s, ad];

  const config = typeConfig[type] || typeConfig.general;

  // レーダーチャートのSVG座標
  const cx = 600, cy = 260, radius = 100;
  const gridPoints = Array.from({ length: 5 }, (_, i) => getRadarPoint(cx, cy, radius, i, 100));
  const gridPath = gridPoints.map((p) => p.join(",")).join(" ");

  const scorePoints = hasScores
    ? scores.map((v, i) => getRadarPoint(cx, cy, radius, i, v))
    : null;
  const scorePath = scorePoints ? scorePoints.map((p) => p.join(",")).join(" ") : "";

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
        {/* グラデーションバー */}
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

        {/* ラベル */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
          <div style={{ fontSize: "18px", color: config.color, fontWeight: 700, letterSpacing: "2px" }}>
            CAREER COMBAT POWER
          </div>
        </div>

        {/* 戦闘力スコア */}
        {score && (
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "12px" }}>
            <div style={{ fontSize: "16px", color: "#a1a1aa" }}>戦闘力</div>
            <div style={{ fontSize: "72px", fontWeight: 900, color: config.color }}>{score}</div>
          </div>
        )}

        {/* タイトル */}
        <div
          style={{
            fontSize: score ? "36px" : "52px",
            fontWeight: 900,
            color: config.color,
            textAlign: "center",
            lineHeight: 1.3,
            marginBottom: "16px",
          }}
        >
          {config.title}
        </div>

        {/* レーダーチャート（スコアがある場合） */}
        {hasScores && (
          <div style={{ display: "flex", position: "absolute", right: "80px", top: "140px" }}>
            <svg width="220" height="220" viewBox="440 140 320 240">
              {/* グリッド */}
              <polygon points={gridPath} fill="none" stroke="rgba(113,113,122,0.3)" strokeWidth="1" />
              {/* 軸線 */}
              {gridPoints.map(([x, y], i) => (
                <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(113,113,122,0.2)" strokeWidth="0.5" />
              ))}
              {/* スコア */}
              <polygon points={scorePath} fill={`${config.color}25`} stroke={config.color} strokeWidth="2" />
              {/* ラベル */}
              {gridPoints.map(([x, y], i) => {
                const labelX = cx + (x - cx) * 1.35;
                const labelY = cy + (y - cy) * 1.35;
                return (
                  <text
                    key={i}
                    x={labelX}
                    y={labelY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#a1a1aa"
                    fontSize="10"
                  >
                    {AXIS_LABELS[i]}
                  </text>
                );
              })}
            </svg>
          </div>
        )}

        {/* 年収アップバッジ */}
        {salaryUp && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              background: `linear-gradient(90deg, ${config.bgFrom}, ${config.bgTo})`,
              borderRadius: "16px",
              padding: "10px 28px",
              marginBottom: "16px",
            }}
          >
            <div style={{ fontSize: "18px", color: "rgba(255,255,255,0.8)" }}>推定年収アップ</div>
            <div style={{ fontSize: "28px", fontWeight: 900, color: "#fff" }}>{salaryUp}</div>
          </div>
        )}

        {/* フッター */}
        <div style={{ position: "absolute", bottom: "28px", display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ fontSize: "20px", color: "#71717a" }}>⚔️ ならなら式キャリア戦闘力診断</div>
          <div style={{ fontSize: "16px", color: "#52525b" }}>nara-career.com/diagnosis</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
