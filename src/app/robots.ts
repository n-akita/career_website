import type { MetadataRoute } from "next";

/**
 * 「週間◯◯」シリーズの子サイト。next.config.ts の ZONES と同じ並びにする。
 *
 * robots.txt はドメイン直下の1枚しか読まれないので、子側が出している
 * /<町>/robots.txt は無視される。子サイトぶんの除外とサイトマップは
 * ここで代わりに指定する。町を増やしたら next.config.ts と両方に足す。
 *
 * SHOW_LOCAL_ZONES が 1 でないときは中継自体が止まっていて /<町> は 404 なので、
 * サイトマップも出さない（存在しないURLをGoogleに知らせないため）。
 */
const ZONE_PATHS = ["ueno-okachimachi", "toyosu"];
const SHOW_LOCAL_ZONES = process.env.SHOW_LOCAL_ZONES === "1";

export default function robots(): MetadataRoute.Robots {
  const zones = SHOW_LOCAL_ZONES ? ZONE_PATHS : [];
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        ...zones.flatMap((path) => [`/${path}/admin`, `/${path}/api/`]),
      ],
    },
    sitemap: [
      "https://nara-career.com/sitemap.xml",
      ...zones.map((path) => `https://nara-career.com/${path}/sitemap.xml`),
    ],
  };
}
