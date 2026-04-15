import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import Anthropic from "@anthropic-ai/sdk";

export const dynamic = "force-dynamic";

const BASE_URL = "https://www.nara-career.com";

function verifySignature(body: string, signature: string): boolean {
  const hash = createHmac("sha256", process.env.LINE_CHANNEL_SECRET!)
    .update(body)
    .digest("base64");
  return hash === signature;
}

function b64(str: string): string {
  return Buffer.from(str, "utf-8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

async function replyMessages(replyToken: string, messages: unknown[]) {
  await fetch("https://api.line.me/v2/bot/message/reply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({ replyToken, messages }),
  });
}

// ツイートURLからtweetIdとusernameを抽出
function extractTweetInfo(text: string): { url: string; tweetId: string; username: string } | null {
  const match = text.match(/https?:\/\/(?:x\.com|twitter\.com)\/(\w+)\/status\/(\d+)/);
  if (!match) return null;
  return { url: match[0], tweetId: match[2], username: match[1] };
}

// oEmbed APIでツイート本文を取得
async function fetchTweetText(tweetUrl: string): Promise<{ text: string; authorName: string } | null> {
  try {
    const res = await fetch(
      `https://publish.twitter.com/oembed?url=${encodeURIComponent(tweetUrl)}&omit_script=true`,
      { signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const pMatch = data.html?.match(/<p[^>]*>([\s\S]*?)<\/p>/);
    if (!pMatch) return null;
    const text = pMatch[1]
      .replace(/<br\s*\/?>/g, "\n")
      .replace(/<a[^>]*>([^<]*)<\/a>/g, "$1")
      .replace(/<[^>]+>/g, "")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();
    return { text, authorName: data.author_name || "" };
  } catch {
    return null;
  }
}

// Claude APIでリプライ候補を3つ生成
async function generateReplyCandidates(
  tweetText: string,
  authorName: string
): Promise<{ type: string; text: string }[]> {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const systemPrompt = `あなたは秋田直樹（@nara_nara_san）のXリプライアシスタントです。

【プロフィール】
- 15年以上のキャリア。ベンチャー2社→大手通信→大手小売→損保（現職）
- 年収を環境選択で3.5倍にした経験
- 地方自治体でデジタルマーケティング支援の副業中
- 4000万円予算のメタバースプロジェクトをリード経験あり

【リプライの方針】
- 相手のツイートに「価値を追加」する（同意だけのリプライは絶対NG）
- スパムと思われない自然な文体
- 相手を持ち上げすぎない（媚びない）
- 敬意を持ちつつ率直に

【文体ルール】
- 一人称: 「私」
- 語尾: 「〜です」「〜ます」敬体ベースだが、少しカジュアルも可
- 1リプライ100〜200文字
- 絵文字・ハッシュタグは不使用
- 具体的な会社名は出さない（「大手通信」「大手小売」等で表現）
- 年収の実数は出さない（「3.5倍」等はOK）`;

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 800,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: `以下のツイートに対するリプライ候補を3つ生成してください。

【ツイート】
投稿者: ${authorName}
本文: ${tweetText}

【3つの候補の方向性】
1. 経験データ: 自分のキャリア経験から具体的なエピソードや数字を添える
2. 別の視点: 相手が触れていない角度からの指摘や補足
3. 追加Tips: 相手の読者にとって実用的な情報を1つ追加

各候補は100〜200文字。以下のJSON形式のみを出力：
{"replies":[{"type":"経験データ","text":"..."},{"type":"別の視点","text":"..."},{"type":"追加Tips","text":"..."}]}`,
      },
    ],
  });

  const text = response.content[0].type === "text" ? response.content[0].text.trim() : "";
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch![0]);
    return parsed.replies;
  } catch {
    return [{ type: "候補", text: text.substring(0, 200) }];
  }
}

// リプライ候補のFlex Messageを構築（カルーセル）
function buildReplyCarousel(
  replies: { type: string; text: string }[],
  tweetId: string,
  originalTweet: string,
  authorName: string
) {
  const secret = process.env.DRAFT_API_SECRET;
  const colors = ["#1DA1F2", "#17BF63", "#F45D22"];
  const labels = ["① 経験データ", "② 別の視点", "③ 追加Tips"];

  const bubbles = replies.map((reply, i) => {
    // Xアプリでリプライ画面を直接開く（テキスト入力済み）
    const replyUrl = `https://x.com/intent/post?in_reply_to=${tweetId}&text=${encodeURIComponent(reply.text)}`;
    const editUrl = `${BASE_URL}/api/reply-edit?s=${secret}&t=${b64(reply.text)}&id=${tweetId}`;

    return {
      type: "bubble",
      size: "kilo",
      header: {
        type: "box",
        layout: "vertical",
        backgroundColor: colors[i] || "#888888",
        contents: [
          { type: "text", text: labels[i] || `候補${i + 1}`, color: "#FFFFFF", weight: "bold", size: "sm" },
        ],
        paddingAll: "10px",
      },
      body: {
        type: "box",
        layout: "vertical",
        spacing: "sm",
        contents: [
          { type: "text", text: `@${authorName} への返信:`, size: "xxs", color: "#999999" },
          { type: "text", text: reply.text, wrap: true, size: "sm", margin: "sm" },
        ],
      },
      footer: {
        type: "box",
        layout: "vertical",
        spacing: "sm",
        contents: [
          { type: "button", action: { type: "uri", label: "これで返信", uri: replyUrl }, style: "primary", color: colors[i] || "#888888", height: "sm" },
          { type: "button", action: { type: "uri", label: "修正する", uri: editUrl }, style: "secondary", height: "sm" },
        ],
      },
    };
  });

  return {
    type: "flex",
    altText: `リプライ候補（${authorName}宛）`,
    contents: {
      type: "carousel",
      contents: bubbles,
    },
  };
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-line-signature") || "";

  if (!verifySignature(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const parsed = JSON.parse(body);
  const events = parsed.events || [];

  for (const event of events) {
    // 既存: 投稿スキップのpostback
    if (event.type === "postback") {
      const data = event.postback.data;
      if (data === "reject" || data === "reject_reply") {
        await replyMessages(event.replyToken, [{ type: "text", text: "スキップしました。" }]);
      }
    }

    // 新規: テキストメッセージからツイートURL検出 → リプライ候補生成
    if (event.type === "message" && event.message.type === "text") {
      const tweetInfo = extractTweetInfo(event.message.text);
      if (!tweetInfo) continue; // URL以外のメッセージは無視

      try {
        // oEmbedでツイート本文取得
        const tweet = await fetchTweetText(tweetInfo.url);
        if (!tweet) {
          await replyMessages(event.replyToken, [
            { type: "text", text: "ツイートの取得に失敗しました。非公開アカウントまたは削除されたツイートの可能性があります。" },
          ]);
          continue;
        }

        // Claude APIでリプライ候補生成
        const replies = await generateReplyCandidates(tweet.text, tweet.authorName);

        // Flex Messageで返信（replyMessageなので月200通にカウントされない）
        const carousel = buildReplyCarousel(replies, tweetInfo.tweetId, tweet.text, tweet.authorName);
        await replyMessages(event.replyToken, [carousel]);
      } catch (err) {
        console.error("Reply generation error:", err);
        await replyMessages(event.replyToken, [
          { type: "text", text: "リプライ候補の生成中にエラーが発生しました。しばらくしてから再度お試しください。" },
        ]).catch(() => {}); // replyTokenが期限切れの場合もある
      }
    }
  }

  return NextResponse.json({ status: "ok" });
}
