import type { NextConfig } from "next";

// 旧 /career/<slug> は新ルート /career/mindset 等と衝突するため、slugを明示列挙する
const MINDSET_SLUGS = [
  "career-story",
  "dx-talent-salary",
  "environment-decides-salary",
  "keio-to-venture",
  "two-billion-yen-night",
  "venture-vs-enterprise-reality",
];

// 「週間上野御徒町」は別Vercelプロジェクト。/ueno-okachimachi 配下をそちらへ中継する
// （マルチゾーン構成）。子側は basePath=/ueno-okachimachi なので転送先にも同じ接頭辞が要る。
const UENO_ORIGIN = "https://ueno-okachimachi.vercel.app";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/ueno-okachimachi",
        destination: `${UENO_ORIGIN}/ueno-okachimachi`,
      },
      {
        // ページだけでなく _next/static 等のアセットもこのルールで流れる
        source: "/ueno-okachimachi/:path*",
        destination: `${UENO_ORIGIN}/ueno-okachimachi/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      // 旧URL（2026-04の初期リダイレクト）を新URLへ1ホップで直行させる
      {
        source: "/tenshoku/agent-review-8services",
        destination: "/career/story/agent-review-8services",
        permanent: true,
      },
      ...MINDSET_SLUGS.map((slug) => ({
        source: `/career/${slug}`,
        destination: `/career/mindset/${slug}`,
        permanent: true,
      })),
      { source: "/tenshoku", destination: "/career/tenshoku", permanent: true },
      { source: "/tenshoku/:slug", destination: "/career/tenshoku/:slug", permanent: true },
      { source: "/sidejob", destination: "/career/sidejob", permanent: true },
      { source: "/sidejob/:slug", destination: "/career/sidejob/:slug", permanent: true },
      { source: "/story", destination: "/career/story", permanent: true },
      { source: "/story/:slug", destination: "/career/story/:slug", permanent: true },
      { source: "/diagnosis", destination: "/career/diagnosis", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
