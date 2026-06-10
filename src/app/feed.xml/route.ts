import { getAllArticles, articlePath } from "@/lib/articles";

const BASE_URL = "https://nara-career.com";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const articles = getAllArticles()
    .slice()
    .sort((a, b) => ((a.updated || a.date) > (b.updated || b.date) ? -1 : 1))
    .slice(0, 30);

  const items = articles
    .map((a) => {
      const url = `${BASE_URL}${articlePath(a)}`;
      const pubDate = new Date(a.updated || a.date).toUTCString();
      return [
        "    <item>",
        `      <title>${escapeXml(a.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <description>${escapeXml(a.description)}</description>`,
        `      <pubDate>${pubDate}</pubDate>`,
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  const lastBuildDate = articles.length
    ? new Date(articles[0].updated || articles[0].date).toUTCString()
    : new Date("2026-04-01").toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>会社員の居場所戦略</title>
    <link>${BASE_URL}/career</link>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <description>5回の転職で年収3.5倍。出世ではなく「環境を変える」キャリア戦略を発信。</description>
    <language>ja</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
