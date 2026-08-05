import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";

export const runtime = "edge";

const categoryConfig: Record<
  string,
  { label: string; color: string; bgFrom: string; bgTo: string; emoji: string }
> = {
  mindset: {
    label: "CAREER",
    color: "#3b82f6",
    bgFrom: "#1e3a5f",
    bgTo: "#18181b",
    emoji: "💡",
  },
  tenshoku: {
    label: "JOB CHANGE",
    color: "#6366f1",
    bgFrom: "#312e5c",
    bgTo: "#18181b",
    emoji: "🔄",
  },
  sidejob: {
    label: "SIDE JOB",
    color: "#10b981",
    bgFrom: "#1a3a2a",
    bgTo: "#18181b",
    emoji: "💼",
  },
  story: {
    label: "STORY",
    color: "#f59e0b",
    bgFrom: "#3a2e1a",
    bgTo: "#18181b",
    emoji: "🗣️",
  },
  taishoku: {
    label: "RESIGNATION",
    color: "#f43f5e",
    bgFrom: "#4c1d2e",
    bgTo: "#18181b",
    emoji: "🚪",
  },
  shikaku: {
    label: "RESKILLING",
    color: "#14b8a6",
    bgFrom: "#134e4a",
    bgTo: "#18181b",
    emoji: "📚",
  },
  coaching: {
    label: "COACHING",
    color: "#a855f7",
    bgFrom: "#3b1d5c",
    bgTo: "#18181b",
    emoji: "🧭",
  },
  english: {
    label: "ENGLISH",
    color: "#0ea5e9",
    bgFrom: "#0c3a5c",
    bgTo: "#18181b",
    emoji: "🌐",
  },
  furusato: {
    label: "FURUSATO TAX",
    color: "#f97316",
    bgFrom: "#4a2a12",
    bgTo: "#18181b",
    emoji: "🎁",
  },
  kaikei: {
    label: "ACCOUNTING",
    color: "#84cc16",
    bgFrom: "#2c3a14",
    bgTo: "#18181b",
    emoji: "🧾",
  },
  blog: {
    label: "SIDE BLOG",
    color: "#a855f7",
    bgFrom: "#3b2153",
    bgTo: "#18181b",
    emoji: "✍️",
  },
  shitsugyo: {
    label: "AFTER RESIGNATION",
    color: "#f59e0b",
    bgFrom: "#4a3520",
    bgTo: "#18181b",
    emoji: "📋",
  },
};

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get("title") || "ならならの実験場";
  const category = searchParams.get("category") || "mindset";

  const config = categoryConfig[category] || categoryConfig.mindset;

  // タイトルが長い場合はフォントサイズを小さくする
  const titleLen = title.length;
  const fontSize = titleLen > 40 ? 38 : titleLen > 25 ? 44 : 52;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: `linear-gradient(135deg, ${config.bgFrom} 0%, #27272a 40%, ${config.bgTo} 100%)`,
          fontFamily: "sans-serif",
          position: "relative",
          padding: "0",
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
            background: `linear-gradient(90deg, ${config.color}, ${config.bgFrom})`,
          }}
        />

        {/* Decorative circle */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: "320px",
            height: "320px",
            borderRadius: "50%",
            background: config.color,
            opacity: 0.06,
          }}
        />

        {/* Main content area */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            padding: "60px 72px 40px",
          }}
        >
          {/* Category label */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "28px",
            }}
          >
            <span style={{ fontSize: "28px" }}>{config.emoji}</span>
            <div
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: config.color,
                letterSpacing: "3px",
              }}
            >
              {config.label}
            </div>
            <div
              style={{
                height: "1px",
                width: "60px",
                background: config.color,
                opacity: 0.4,
                marginLeft: "8px",
              }}
            />
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: `${fontSize}px`,
              fontWeight: 900,
              color: "#f4f4f5",
              lineHeight: 1.4,
              maxWidth: "1000px",
              wordBreak: "keep-all",
              overflowWrap: "break-word",
            }}
          >
            {title}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 72px 36px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                fontSize: "20px",
                fontWeight: 700,
                color: "#a1a1aa",
              }}
            >
              🧪 ならならの実験場
            </div>
          </div>
          <div style={{ fontSize: "16px", color: "#52525b" }}>
            nara-career.com
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
