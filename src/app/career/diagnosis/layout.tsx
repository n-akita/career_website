import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ならなら式キャリア戦闘力診断",
  description:
    "10の質問であなたのキャリア戦闘力を測定。5つの武器をレーダーチャートで可視化し、推定年収アップ額がわかります。所要時間2分・完全無料。",
  alternates: {
    canonical: "https://nara-career.com/career/diagnosis",
  },
  openGraph: {
    title: "ならなら式キャリア戦闘力診断 — あなたの戦闘力は？",
    description:
      "10の質問でキャリア戦闘力を測定。5つの武器をレーダーチャートで可視化し、推定年収アップ額がわかります。",
    images: [
      {
        url: "/api/og/diagnosis?type=general",
        width: 1200,
        height: 630,
        alt: "ならなら式キャリア戦闘力診断",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ならなら式キャリア戦闘力診断 — あなたの戦闘力は？",
    description:
      "10の質問でキャリア戦闘力を測定。レーダーチャートで5つの武器を可視化。",
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
