import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Base64デコード
function decodeParam(str: string): string {
  return Buffer.from(str, "base64").toString("utf-8");
}

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("s");
  const tweetB64 = req.nextUrl.searchParams.get("t");
  const urlB64 = req.nextUrl.searchParams.get("u");

  if (secret !== process.env.DRAFT_API_SECRET) {
    return htmlResponse("認証エラー", "不正なアクセスです。", 401);
  }

  if (!tweetB64 || !urlB64) {
    return htmlResponse("エラー", "パラメータが不足しています。", 400);
  }

  const tweet = decodeParam(tweetB64);
  const articleUrl = decodeParam(urlB64);
  const tweetText = `${tweet}\n\n${articleUrl}`;

  try {
    const { TwitterApi } = await import("twitter-api-v2");
    const client = new TwitterApi({
      appKey: process.env.X_API_KEY!,
      appSecret: process.env.X_API_SECRET!,
      accessToken: process.env.X_ACCESS_TOKEN!,
      accessSecret: process.env.X_ACCESS_TOKEN_SECRET!,
    });

    const { data } = await client.v2.tweet(tweetText);
    const tweetUrl = `https://x.com/nara_nara_san/status/${data.id}`;

    // LINE に完了通知
    await sendLineBroadcast(`投稿完了！\n${tweetUrl}`);

    return htmlResponse(
      "投稿完了",
      `Xに投稿されました！<br><br><a href="${tweetUrl}" style="color:#1DA1F2;">投稿を確認する</a>`,
      200
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return htmlResponse("投稿失敗", `エラー: ${message}`, 500);
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
