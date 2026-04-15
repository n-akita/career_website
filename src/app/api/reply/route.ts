import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function decodeParam(str: string): string {
  const b64 = str.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(b64, "base64").toString("utf-8");
}

const GITHUB_REPO = "n-akita/career_website";
const GITHUB_FILE = "reply_history.json";

interface ReplyRecord {
  tweetId: string;
  replyId: string;
  replyUrl: string;
  replyText: string;
  inReplyToTweetId: string;
  postedAt: string;
}

async function saveReplyHistory(record: ReplyRecord): Promise<void> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE}`,
      { headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } }
    );
    const data = await res.json();
    const sha = data.sha;
    const current: ReplyRecord[] = res.ok
      ? JSON.parse(Buffer.from(data.content, "base64").toString("utf-8"))
      : [];

    current.push(record);
    const updated = current.slice(-200);

    await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Reply: ${record.replyText.substring(0, 40)}...`,
          content: Buffer.from(JSON.stringify(updated, null, 2)).toString("base64"),
          sha: sha || undefined,
        }),
      }
    );
  } catch (err) {
    console.error("Failed to save reply history:", err);
  }
}

async function sendLineBroadcast(text: string) {
  await fetch("https://api.line.me/v2/bot/message/broadcast", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({ messages: [{ type: "text", text }] }),
  });
}

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("s");
  const replyB64 = req.nextUrl.searchParams.get("t");
  const tweetId = req.nextUrl.searchParams.get("id");

  if (secret !== process.env.DRAFT_API_SECRET) {
    return htmlResponse("認証エラー", "不正なアクセスです。", 401);
  }

  if (!replyB64 || !tweetId) {
    return htmlResponse("エラー", "パラメータが不足しています。", 400);
  }

  const replyText = decodeParam(replyB64);

  try {
    const { TwitterApi } = await import("twitter-api-v2");
    const client = new TwitterApi({
      appKey: process.env.X_API_KEY!,
      appSecret: process.env.X_API_SECRET!,
      accessToken: process.env.X_ACCESS_TOKEN!,
      accessSecret: process.env.X_ACCESS_TOKEN_SECRET!,
    });

    const { data } = await client.v2.tweet({
      text: replyText,
      reply: { in_reply_to_tweet_id: tweetId },
    });

    const replyUrl = `https://x.com/nara_nara_san/status/${data.id}`;

    await saveReplyHistory({
      tweetId: data.id,
      replyId: data.id,
      replyUrl,
      replyText,
      inReplyToTweetId: tweetId,
      postedAt: new Date().toISOString(),
    });

    await sendLineBroadcast(`リプライ完了!\n${replyUrl}`);

    return htmlResponse(
      "リプライ完了",
      `Xにリプライしました!<br><br><a href="${replyUrl}" style="color:#1DA1F2;">リプライを確認する</a>`,
      200
    );
  } catch (err: unknown) {
    let message = "Unknown error";
    let detail = "";
    if (err instanceof Error) {
      message = err.message;
      // twitter-api-v2 のエラーには data プロパティがある場合がある
      const apiErr = err as Error & { data?: unknown; code?: number };
      if (apiErr.data) {
        detail = JSON.stringify(apiErr.data);
      }
      if (apiErr.code) {
        detail += ` (code: ${apiErr.code})`;
      }
    }
    console.error("Reply failed:", message, detail);
    const displayMsg = detail
      ? `エラー: ${message}<br><br><small style="color:#999;">${detail}</small>`
      : `エラー: ${message}`;
    return htmlResponse("リプライ失敗", displayMsg, 500);
  }
}

function htmlResponse(title: string, body: string, status: number) {
  const html = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #f5f5f5; }
    .card { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center; max-width: 400px; }
    h1 { font-size: 1.5rem; margin-bottom: 1rem; }
    p { color: #666; line-height: 1.6; }
    a { text-decoration: none; }
  </style>
</head>
<body>
  <div class="card"><h1>${title}</h1><p>${body}</p></div>
</body>
</html>`;
  return new NextResponse(html, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
