import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
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
          background:
            "linear-gradient(135deg, #18181b 0%, #27272a 50%, #18181b 100%)",
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
            background: "linear-gradient(90deg, #3b82f6, #6366f1)",
          }}
        />

        {/* Emoji */}
        <div style={{ fontSize: "80px", marginBottom: "24px" }}>🧭</div>

        {/* Site title */}
        <div
          style={{
            fontSize: "56px",
            fontWeight: 900,
            color: "#f4f4f5",
            textAlign: "center",
            lineHeight: 1.3,
            marginBottom: "20px",
          }}
        >
          会社員の居場所戦略
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "26px",
            color: "#a1a1aa",
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          5回の転職で年収3.5倍。出世ではなく「環境を変える」キャリア戦略を発信。
        </div>

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
          <div style={{ fontSize: "20px", color: "#52525b" }}>
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
