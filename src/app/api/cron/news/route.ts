import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { XMLParser } from "fast-xml-parser";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const TRUSTED_SOURCES = [
  "NHK", "日本経済新聞", "朝日新聞", "読売新聞", "毎日新聞", "産経新聞",
  "東洋経済", "ダイヤモンド", "プレジデント", "日経ビジネス", "ITmedia",
  "BUSINESS INSIDER", "Forbes", "現代ビジネス", "新R25", "マネーポスト",
  "弁護士ドットコム", "J-CAST", "Yahoo!ニュース", "Bloomberg", "ロイター",
  "共同通信", "時事通信", "テレ朝", "TBS", "日テレ", "FNN", "AERA", "文春",
];

const GITHUB_REPO = "n-akita/career_website";
const GITHUB_FILE = "posted_news.json";

function b64(str: string): string {
  return Buffer.from(str, "utf-8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

async function sendLineBroadcast(text: string): Promise<void> {
  await fetch("https://api.line.me/v2/bot/message/broadcast", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      messages: [{ type: "text", text }],
    }),
  });
}

// GitHub上のposted_news.jsonを読み取る
async function getPostedTitles(): Promise<string[]> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE}`,
      { headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    const content = Buffer.from(data.content, "base64").toString("utf-8");
    return JSON.parse(content);
  } catch {
    return [];
  }
}

// GitHub上のposted_news.jsonに追記する
async function savePostedTitle(title: string): Promise<void> {
  try {
    // 現在のファイルを取得（sha が必要）
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE}`,
      { headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } }
    );
    const data = await res.json();
    const sha = data.sha;
    const current: string[] = res.ok
      ? JSON.parse(Buffer.from(data.content, "base64").toString("utf-8"))
      : [];

    // タイトルを追加（直近200件のみ保持）
    current.push(title);
    const updated = current.slice(-200);

    // ファイルを更新
    await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Add posted news: ${title.substring(0, 50)}`,
          content: Buffer.from(JSON.stringify(updated, null, 2)).toString("base64"),
          sha,
        }),
      }
    );
  } catch (err) {
    console.error("Failed to save posted title:", err);
  }
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. 投稿済みタイトルを取得
    const postedTitles = await getPostedTitles();

    // 2. ニュース取得
    const { articles: allArticles, errors: rssErrors } = await fetchCareerNews();
    if (allArticles.length === 0) {
      const detail = rssErrors.length > 0 ? `\n${rssErrors.join("\n")}` : "";
      await sendLineBroadcast(`⚠ ニュースが見つかりませんでした${detail}`);
      return NextResponse.json({ message: "No news found", errors: rssErrors });
    }

    // 3. 投稿済みを除外（タイトルの先頭30文字で比較）
    const articles = allArticles.filter((a) => {
      const shortTitle = a.title.replace(/ - [^-]+$/, "").trim().substring(0, 30);
      return !postedTitles.some((t) => t.includes(shortTitle) || shortTitle.includes(t.substring(0, 30)));
    });

    if (articles.length === 0) {
      await sendLineBroadcast(`⚠ 新しいニュースがありませんでした（全${allArticles.length}件が投稿済み）`);
      return NextResponse.json({ message: "No new articles (all posted)" });
    }

    // 4. Claude APIで記事選定＋下書き生成
    const { article, draft } = await selectAndGenerate(articles);

    // 5. URL解決（元記事URLを取得）
    const resolvedUrl = await resolveArticleUrl(article);

    // 6. 投稿済みとして記録
    await savePostedTitle(article.title.replace(/ - [^-]+$/, "").trim());

    // 7. LINEに通知
    const approveUrl = `https://www.nara-career.com/api/approve?s=${process.env.DRAFT_API_SECRET}&t=${b64(draft)}&u=${b64(resolvedUrl)}`;
    const editUrl = `https://www.nara-career.com/api/edit?s=${process.env.DRAFT_API_SECRET}&t=${b64(draft)}&u=${b64(resolvedUrl)}&n=${b64(article.title.substring(0, 30))}`;

    const message = {
      type: "flex",
      altText: `【X投稿承認】${draft.substring(0, 30)}...`,
      contents: {
        type: "bubble",
        body: {
          type: "box",
          layout: "vertical",
          spacing: "md",
          contents: [
            { type: "text", text: "X投稿の承認", weight: "bold", size: "lg" },
            { type: "separator" },
            { type: "text", text: draft, wrap: true, size: "sm", margin: "md" },
            { type: "separator", margin: "md" },
            { type: "text", text: `元記事: ${article.title.substring(0, 50)}`, wrap: true, size: "xs", color: "#888888", margin: "md" },
            { type: "button", action: { type: "uri", label: "元記事を読む", uri: article.link }, style: "link", height: "sm", margin: "sm" },
          ],
        },
        footer: {
          type: "box",
          layout: "vertical",
          spacing: "sm",
          contents: [
            { type: "button", action: { type: "uri", label: "投稿する", uri: approveUrl }, style: "primary", color: "#1DA1F2" },
            { type: "button", action: { type: "uri", label: "修正する", uri: editUrl }, style: "secondary" },
            { type: "button", action: { type: "postback", label: "投稿しない", data: "reject" }, style: "secondary" },
          ],
        },
      },
    };

    const lineRes = await fetch("https://api.line.me/v2/bot/message/broadcast", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        messages: [message, { type: "text", text: draft }],
      }),
    });

    if (!lineRes.ok) {
      const lineError = await lineRes.text();
      console.error("LINE broadcast failed:", lineRes.status, lineError);
      return NextResponse.json({ error: "LINE broadcast failed", detail: lineError }, { status: 500 });
    }

    return NextResponse.json({ message: "OK", article: article.title, draft });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("Cron news error:", msg);
    try { await sendLineBroadcast(`❌ ニュース投稿エラー: ${msg.substring(0, 100)}`); } catch {}
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

async function fetchCareerNews() {
  const queries = [
    "転職 年収 2026",
    "リストラ 賃上げ 早期退職",
    "大企業 採用 人手不足",
    "AI 雇用 失業",
    "副業 解禁 働き方",
  ];
  const allItems: Record<string, unknown>[] = [];
  const parser = new XMLParser({ ignoreAttributes: false });

  const errors: string[] = [];

  async function fetchRss(q: string): Promise<void> {
    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=ja&gl=JP&ceid=JP:ja`;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        if (attempt > 0) await new Promise((r) => setTimeout(r, 3000));
        const res = await fetch(url, {
          headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
        });
        if (!res.ok) {
          if (attempt === 0) continue; // retry once
          errors.push(`${q}: HTTP ${res.status}`);
          return;
        }
        const xml = await res.text();
        const feed = parser.parse(xml);
        const items = feed?.rss?.channel?.item;
        if (items) {
          const arr = Array.isArray(items) ? items : [items];
          allItems.push(...arr);
        }
        return;
      } catch (err) {
        if (attempt === 1) {
          errors.push(`${q}: ${err instanceof Error ? err.message : "unknown"}`);
        }
      }
    }
  }

  // キーワードごとに少し間隔を空けて取得（レート制限対策）
  for (const q of queries) {
    await fetchRss(q);
    await new Promise((r) => setTimeout(r, 500));
  }

  if (allItems.length === 0 && errors.length > 0) {
    console.error("RSS fetch errors:", errors);
  }

  // 30日以内の記事のみに絞る
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const recent = allItems.filter((item: Record<string, unknown>) => {
    const pubDate = item.pubDate as string;
    if (!pubDate) return true; // 日付がない場合は含める
    const date = new Date(pubDate).getTime();
    return date >= thirtyDaysAgo;
  });

  // 重複除去
  const seen = new Set<string>();
  const unique = recent.filter((item: Record<string, unknown>) => {
    const title = (item.title as string) || "";
    const key = title.replace(/ - [^-]+$/, "").trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // 信頼ソースフィルタ
  const filtered = unique.filter((item: Record<string, unknown>) => {
    const source = (item.source as Record<string, string>)?.["#text"] || "";
    const titleSource = ((item.title as string) || "").split(" - ").pop() || "";
    return TRUSTED_SOURCES.some((s) => source.includes(s) || titleSource.includes(s));
  });

  const results = (filtered.length > 0 ? filtered : unique.slice(0, 10)).map((item: Record<string, unknown>) => ({
    title: (item.title as string) || "",
    link: (item.link as string) || "",
    pubDate: (item.pubDate as string) || "",
    sourceUrl: (item.source as Record<string, string>)?.["@_url"] || "",
    sourceName: (item.source as Record<string, string>)?.["#text"] || "",
  }));
  return { articles: results, errors };
}

type Article = { title: string; link: string; pubDate?: string; sourceUrl?: string; sourceName?: string };

async function selectAndGenerate(articles: Article[]) {
  const writingRules = `# X投稿ルール
- 一人称：「私」
- 性格：冷静、ドライ、論理的
- 語尾は「〜です」「〜ます」「〜ですよ」
- 1文20〜40文字以内
- 記号（▪︎や↓）は使わない。普通の文章で書く
- 2〜3文ごとに空行
- 具体的な会社名は出さない
- 年収の実数は出さない。「3.5倍」はOK
- ターゲット：28〜35歳の転職・キャリアに悩むビジネスマン
- コアメッセージ：「年収を決めるのは自分だけじゃない。会社が半分決めている。」`;

  const articleList = articles
    .slice(0, 10)
    .map((a, i) => {
      const date = a.pubDate ? new Date(a.pubDate).toLocaleDateString("ja-JP") : "";
      return `[${i + 1}] ${a.title}${date ? ` (${date})` : ""}`;
    })
    .join("\n");

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 500,
    system: writingRules,
    messages: [
      {
        role: "user",
        content: `以下のニュース候補から、ターゲット（28〜35歳の転職・キャリアに悩むビジネスマン）が最も反応しそうな記事を1つ選び、投稿文を作成してください。

【選定基準（重要度順）】
1. 今日・昨日のニュース速報や最新の出来事を最優先（「○○社がリストラ発表」「賃上げ率○%」「○○業界で人手不足深刻化」等）
2. 具体的な数字やデータが含まれる記事を優先（「年収○万」「○%増」「○万人」等）
3. 多くの会社員に関係する社会的なニュースを優先
4. 個人のコラムやハウツー記事よりも、ニュース速報・調査結果を優先
5. プレスリリースや特定企業の宣伝は避ける
6. 一般論や抽象的な記事は避ける

【ニュース候補】
${articleList}

【投稿ルール】
- 120文字以内（厳守）
- 末尾にニュースURLは含めないでください
- ハッシュタグは不要

以下のJSON形式のみを出力：
{"selected": 番号, "tweet": "投稿文"}`,
      },
    ],
  });

  const text = response.content[0].type === "text" ? response.content[0].text.trim() : "";
  let parsed: { selected: number; tweet: string };
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    parsed = JSON.parse(jsonMatch![0]);
  } catch {
    parsed = { selected: 1, tweet: text.substring(0, 120) };
  }

  const selectedIndex = (parsed.selected || 1) - 1;
  const article = articles[selectedIndex] || articles[0];
  return { article, draft: parsed.tweet };
}

// 主要ニュースサイトのRSSフィード一覧
const PUBLISHER_RSS: Record<string, string[]> = {
  "news.yahoo.co.jp": [
    "https://news.yahoo.co.jp/rss/topics/business.xml",
    "https://news.yahoo.co.jp/rss/topics/it.xml",
    "https://news.yahoo.co.jp/rss/topics/domestic.xml",
    "https://news.yahoo.co.jp/rss/topics/economy.xml",
  ],
  "toyokeizai.net": ["https://toyokeizai.net/list/feed/rss"],
  "diamond.jp": ["https://diamond.jp/feed/index.xml"],
  "itmedia.co.jp": [
    "https://rss.itmedia.co.jp/rss/2.0/itmedia_all.xml",
    "https://rss.itmedia.co.jp/rss/2.0/itmedia_business.xml",
  ],
  "j-cast.com": ["https://www.j-cast.com/rss/all.xml"],
  "nhk.or.jp": [
    "https://www.nhk.or.jp/rss/news/cat0.xml",
    "https://www.nhk.or.jp/rss/news/cat5.xml",
  ],
  "kyodo.co.jp": ["https://www.47news.jp/rss/national_summary.xml"],
  "jiji.com": ["https://www.jiji.com/rss/ranking.rdf"],
};

async function resolveArticleUrl(article: Article): Promise<string> {
  const { title, googleUrl, sourceUrl } = {
    title: article.title,
    googleUrl: article.link,
    sourceUrl: article.sourceUrl || "",
  };

  // 記事タイトルからソース名を除去してキーワード抽出
  const cleanTitle = title.replace(/ - [^-]+$/, "").replace(/（[^）]+）$/, "").trim();
  const keywords = cleanTitle.split(/[\s、。「」（）【】,\-]+/).filter((w) => w.length >= 2);

  if (keywords.length < 2) return googleUrl;

  // 1. ソースドメインに対応するRSSがあれば検索
  const domain = sourceUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const rssFeeds: string[] = [];

  for (const [key, feeds] of Object.entries(PUBLISHER_RSS)) {
    if (domain.includes(key) || key.includes(domain)) {
      rssFeeds.push(...feeds);
      break;
    }
  }

  // 対応するRSSがなくても、一般的なRSSパスを試す
  if (rssFeeds.length === 0 && sourceUrl) {
    rssFeeds.push(`${sourceUrl}/feed`, `${sourceUrl}/rss`, `${sourceUrl}/feed/rss`);
  }

  // Yahoo!ニュースのRSSは常に検索対象に含める（多くの記事がYahoo転載される）
  if (!domain.includes("news.yahoo.co.jp")) {
    rssFeeds.push(...PUBLISHER_RSS["news.yahoo.co.jp"]);
  }

  const parser = new XMLParser({ ignoreAttributes: false });

  for (const feedUrl of rssFeeds) {
    try {
      const res = await fetch(feedUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
        signal: AbortSignal.timeout(5000),
      });
      if (!res.ok) continue;
      const xml = await res.text();
      const feed = parser.parse(xml);

      // RSS 2.0 or Atom format
      const items = feed?.rss?.channel?.item || feed?.feed?.entry || [];
      const arr = Array.isArray(items) ? items : [items];

      for (const item of arr) {
        const itemTitle = (item.title as string) || "";
        const matchCount = keywords.filter((k) => itemTitle.includes(k)).length;
        // タイトルのキーワードが3つ以上一致すれば同じ記事とみなす
        if (matchCount >= 3 || (matchCount >= 2 && keywords.length <= 4)) {
          const url = (item.link as string) || item["@_href"] || "";
          if (url && !url.includes("news.google.com")) {
            // Yahoo!ニュースの場合、クエリパラメータを除去
            if (url.includes("news.yahoo.co.jp")) {
              return url.split("?")[0];
            }
            return url;
          }
        }
      }
    } catch {
      // 個別のRSSフェッチ失敗は無視して次を試す
    }
  }

  console.log("URL resolve: falling back to Google News URL for:", cleanTitle.substring(0, 50));
  return googleUrl;
}
