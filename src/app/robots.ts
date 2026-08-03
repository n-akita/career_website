import type { MetadataRoute } from "next";

/**
 * 「週間◯◯」シリーズの子サイト。next.config.ts の ZONES と同じ並びにする。
 *
 * robots.txt はドメイン直下の1枚しか読まれないので、子側が出している
 * /<町>/robots.txt は無視される。子サイトぶんの除外とサイトマップは
 * ここで代わりに指定する。町を増やしたら next.config.ts と両方に足す。
 */
const ZONE_PATHS = ["ueno-okachimachi", "toyosu"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        ...ZONE_PATHS.flatMap((path) => [`/${path}/admin`, `/${path}/api/`]),
      ],
    },
    sitemap: [
      "https://nara-career.com/sitemap.xml",
      ...ZONE_PATHS.map(
        (path) => `https://nara-career.com/${path}/sitemap.xml`,
      ),
    ],
  };
}
