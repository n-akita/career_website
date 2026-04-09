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
    const allArticles = await fetchCareerNews();
    if (allArticles.length === 0) {
      return NextResponse.json({ message: "No news found" });
    }

    // 3. 投稿済みを除外（タイトルの先頭30文字で比較）
    const articles = allArticles.filter((a) => {
      const shortTitle = a.title.replace(/ - [^-]+$/, "").trim().substring(0, 30);
      return !postedTitles.some((t) => t.includes(shortTitle) || shortTitle.includes(t.substring(0, 30)));
    });

    if (articles.length === 0) {
      return NextResponse.json({ message: "No new articles (all posted)" });
    }

    // 4. Claude APIで記事選定＋下書き生成
    const { article, draft } = await selectAndGenerate(articles);

    // 5. URL解決
    const resolvedUrl = await resolveArticleUrl(article.title, article.link);

    // 6. 投稿済みとして記録
    await savePostedTitle(article.title.replace(/ - [^-]+$/, "").trim());

    // 7. LINEに通知
    const approveUrl = `https://www.nara-career.com/api/approve?s=${process.env.DRAFT_API_SECRET}&t=${b64(draft)}&u=${b64(resolvedUrl)}`;
    const editUrl = `https://www.nara-career.com/api/edit?s=${process.env.DRAFT_API_SECRET}&u=${b64(resolvedUrl)}&n=${b64(article.title.substring(0, 30))}`;

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

    await fetch("https://api.line.me/v2/bot/message/broadcast", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        messages: [message, { type: "text", text: draft }],
      }),
    });

    return NextResponse.json({ message: "OK", article: article.title, draft });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("Cron news error:", msg);
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

  for (const q of queries) {
    try {
      const url = `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=ja&gl=JP&ceid=JP:ja`;
      const res = await fetch(url);
      const xml = await res.text();
      const feed = parser.parse(xml);
      const items = feed?.rss?.channel?.item;
      if (items) {
        const arr = Array.isArray(items) ? items : [items];
        allItems.push(...arr);
      }
    } catch {}
  }

  const seen = new Set<string>();
  const unique = allItems.filter((item: Record<string, unknown>) => {
    const title = (item.title as string) || "";
    const key = title.replace(/ - [^-]+$/, "").trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const filtered = unique.filter((item: Record<string, unknown>) => {
    const source = (item.source as Record<string, string>)?.["#text"] || "";
    const titleSource = ((item.title as string) || "").split(" - ").pop() || "";
    return TRUSTED_SOURCES.some((s) => source.includes(s) || titleSource.includes(s));
  });

  return (filtered.length > 0 ? filtered : unique.slice(0, 10)).map((item: Record<string, unknown>) => ({
    title: (item.title as string) || "",
    link: (item.link as string) || "",
  }));
}

async function selectAndGenerate(articles: { title: string; link: string }[]) {
  const writingRules = `# X投稿ルール
- 一人称：「私」
- 性格：冷静、ドライ、論理的
- 語尾は「〜です」「〜ます」「〜ですよ」
- 1文20〜40文字以内
- 記号：タイトル的な一言には「▪︎」を、変化や結果には「↓」を使用
- 2〜3文ごとに空行
- 具体的な会社名は出さない
- 年収の実数は出さない。「3.5倍」はOK
- ターゲット：28〜35歳の転職・キャリアに悩むビジネスマン
- コアメッセージ：「年収を決めるのは自分だけじゃない。会社が半分決めている。」`;

  const articleList = articles
    .slice(0, 10)
    .map((a, i) => `[${i + 1}] ${a.title}`)
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

async function resolveArticleUrl(title: string, googleUrl: string): Promise<string> {
  const isYahoo = title.includes("Yahoo!ニュース");
  if (!isYahoo) return googleUrl;

  const feeds = [
    "https://news.yahoo.co.jp/rss/topics/business.xml",
    "https://news.yahoo.co.jp/rss/topics/it.xml",
    "https://news.yahoo.co.jp/rss/topics/domestic.xml",
  ];

  const searchTitle = title.replace(/ - [^-]+$/, "").replace(/（[^）]+）$/, "").replace(/\([^)]+\)$/, "").trim();
  const keywords = searchTitle.split(/[\s、。「」（）,]+/).filter((w) => w.length >= 2);

  for (const feedUrl of feeds) {
    try {
      const res = await fetch(feedUrl);
      const xml = await res.text();
      const parser = new XMLParser();
      const feed = parser.parse(xml);
      const items = feed?.rss?.channel?.item || [];
      const arr = Array.isArray(items) ? items : [items];
      for (const item of arr) {
        const matchCount = keywords.filter((k: string) => item.title?.includes(k)).length;
        if (matchCount >= 2) return (item.link as string)?.split("?")[0];
      }
    } catch {}
  }

  return googleUrl;
}
