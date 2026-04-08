import { NextRequest, NextResponse } from "next/server";
import { readFile, unlink } from "fs/promises";
import { join } from "path";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  const secret = req.nextUrl.searchParams.get("secret");

  if (secret !== process.env.DRAFT_API_SECRET) {
    return new NextResponse(renderHTML("認証エラー", "不正なアクセスです。"), {
      status: 401,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  if (!id) {
    return new NextResponse(renderHTML("エラー", "IDが指定されていません。"), {
      status: 400,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  // 下書きを読み込み
  const filePath = join("/tmp", "x-drafts", `${id}.json`);
  let draft;
  try {
    const data = await readFile(filePath, "utf-8");
    draft = JSON.parse(data);
  } catch {
    return new NextResponse(
      renderHTML("期限切れ", "この下書きは既に投稿済みか、期限切れです。"),
      { status: 404, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }

  // X に投稿
  try {
    const tweetText = `${draft.tweet}\n\n${draft.url}`;

    const { TwitterApi } = await import("twitter-api-v2");
    const client = new TwitterApi({
      appKey: process.env.X_API_KEY!,
      appSecret: process.env.X_API_SECRET!,
      accessToken: process.env.X_ACCESS_TOKEN!,
      accessSecret: process.env.X_ACCESS_TOKEN_SECRET!,
    });

    const { data } = await client.v2.tweet(tweetText);
    const tweetUrl = `https://x.com/nara_nara_san/status/${data.id}`;

    // 使用済みの下書きを削除
    await unlink(filePath).catch(() => {});

    // LINE に完了通知
    await sendLineMessage(`投稿完了しました！\n${tweetUrl}`);

    return new NextResponse(
      renderHTML(
        "投稿完了",
        `Xに投稿されました！<br><br><a href="${tweetUrl}" style="color:#1DA1F2;">投稿を確認する</a>`
      ),
      { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new NextResponse(
      renderHTML("投稿失敗", `エラーが発生しました: ${message}`),
      { status: 500, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }
}

async function sendLineMessage(text: string) {
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

function renderHTML(title: string, body: string) {
  return `<!DOCTYPE html>
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
  <div class="card">
    <h1>${title}</h1>
    <p>${body}</p>
  </div>
</body>
</html>`;
}
