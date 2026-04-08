import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ならなら式転職診断",
  description:
    "5つの質問に答えるだけ。あなたに合ったキャリア戦略と推定年収アップ額がわかります。所要時間30秒・完全無料。",
  openGraph: {
    title: "ならなら式転職診断 — あなたの推定年収アップ額は？",
    description:
      "5つの質問に答えるだけ。あなたに合ったキャリア戦略と推定年収アップ額がわかります。",
    images: [
      {
        url: "/api/og/diagnosis?type=general",
        width: 1200,
        height: 630,
        alt: "ならなら式転職診断",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ならなら式転職診断 — あなたの推定年収アップ額は？",
    description:
      "5つの質問に答えるだけ。キャリア戦略と推定年収アップ額がわかります。",
    images: ["/api/og/diagnosis?type=general"],
  },
};

export default function DiagnosisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
