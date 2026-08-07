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

// 「週間◯◯」シリーズは町ごとに別Vercelプロジェクト。各 /<町> 配下をそちらへ
// 中継する（マルチゾーン構成）。子側は basePath=/<町> なので、転送先にも
// 同じ接頭辞が要る。町を増やすときはここに 1 行足す。
//
// origin は各プロジェクトの production エイリアス。toyosu だけ末尾に -nu が
// 付いているのは、toyosu.vercel.app が他所に取られていて Vercel が
// 別名を割り当てたため。勝手に変わる値ではないが、プロジェクトを作り直したら
// `vercel project ls` の Latest Production URL で取り直すこと。
const ZONES = [
  { path: "ueno-okachimachi", origin: "https://ueno-okachimachi.vercel.app" },
  { path: "toyosu", origin: "https://toyosu-nu.vercel.app" },
];

// 中継のオン/オフ。2026-08-07、AdSense に「有用性の低いコンテンツ」と判定されて
// off にした（イベント名と日付を並べた自動生成ページがドメイン405本中243本を占め、
// ドメイン全体の評価を下げていた）。off の間も各サイトは *.vercel.app で生きている。
// 審査に通ったら Vercel の環境変数に SHOW_LOCAL_ZONES=1 を入れて再デプロイすれば戻る。
// src/app/robots.ts も同じ変数を見ているので、切り替えはこの1箇所で足りる。
const SHOW_LOCAL_ZONES = process.env.SHOW_LOCAL_ZONES === "1";

const nextConfig: NextConfig = {
  async rewrites() {
    if (!SHOW_LOCAL_ZONES) return [];
    return ZONES.flatMap((zone) => [
      {
        source: `/${zone.path}`,
        destination: `${zone.origin}/${zone.path}`,
      },
      {
        // ページだけでなく _next/static 等のアセットもこのルールで流れる
        source: `/${zone.path}/:path*`,
        destination: `${zone.origin}/${zone.path}/:path*`,
      },
    ]);
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
