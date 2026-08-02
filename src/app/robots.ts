import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        // /ueno-okachimachi 配下は別プロジェクトを rewrite で載せている。
        // robots.txt はドメイン直下の1枚しか読まれないので、子側が出している
        // /ueno-okachimachi/robots.txt は無視される。ここで代わりに指定する。
        "/ueno-okachimachi/admin",
        "/ueno-okachimachi/api/",
      ],
    },
    sitemap: [
      "https://nara-career.com/sitemap.xml",
      "https://nara-career.com/ueno-okachimachi/sitemap.xml",
    ],
  };
}
