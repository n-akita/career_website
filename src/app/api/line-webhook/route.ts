import { NextRequest, NextResponse } from "next/server";
import { readdir, readFile, unlink } from "fs/promises";
import { join } from "path";
import { createHmac } from "crypto";

export const dynamic = "force-dynamic";

// LINE署名検証
function verifySignature(body: string, signature: string): boolean {
  const hash = createHmac("sha256", process.env.LINE_CHANNEL_SECRET!)
    .update(body)
    .digest("base64");
  return hash === signature;
}

// 最新の未投稿ドラフトを取得
async function getLatestDraft() {
  const dir = join("/tmp", "x-drafts");
  try {
    const files = await readdir(dir);
    if (files.length === 0) return null;

    // 最新のファイルを取得
    let latest = null;
    let latestTime = 0;
    for (const file of files) {
      const data = await readFile(join(dir, file), "utf-8");
      const draft = JSON.parse(data);
      const time = new Date(draft.createdAt).getTime();
      if (time > latestTime) {
        latestTime = time;
        latest = { ...draft, filePath: join(dir, file) };
      }
    }
    return latest;
  } catch {
    return null;
  }
}

// Xに投稿
async function postToX(text: string) {
  const { TwitterApi } = await import("twitter-api-v2");
  const client = new TwitterApi({
    appKey: process.env.X_API_KEY!,
    appSecret: process.env.X_API_SECRET!,
    accessToken: process.env.X_ACCESS_TOKEN!,
    accessSecret: process.env.X_ACCESS_TOKEN_SECRET!,
  });
  const { data } = await client.v2.tweet(text);
  return data.id;
}

// LINEに返信
async function replyMessage(replyToken: string, text: string) {
  await fetch("https://api.line.me/v2/bot/message/reply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      replyToken,
      messages: [{ type: "text", text }],
    }),
  });
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-line-signature") || "";

  // 署名検証
  if (!verifySignature(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const parsed = JSON.parse(body);
  const events = parsed.events || [];

  for (const event of events) {
    // テキストメッセージ = 修正した投稿文
    if (event.type === "message" && event.message.type === "text") {
      const userText = event.message.text.trim();
      const replyToken = event.replyToken;

      // 最新のドラフトを取得（URLを取得するため）
      const draft = await getLatestDraft();

      if (!draft) {
        await replyMessage(
          replyToken,
          "投稿待ちの下書きがありません。次の通知をお待ちください。"
        );
        continue;
      }

      try {
        // 修正文 + 元記事URLで投稿
        const tweetText = `${userText}\n\n${draft.url}`;
        const tweetId = await postToX(tweetText);
        const tweetUrl = `https://x.com/nara_nara_san/status/${tweetId}`;

        // ドラフトファイル削除
        await unlink(draft.filePath).catch(() => {});

        await replyMessage(
          replyToken,
          `修正版を投稿しました！\n${tweetUrl}`
        );
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        await replyMessage(replyToken, `投稿失敗: ${message}`);
      }
    }
  }

  return NextResponse.json({ status: "ok" });
}
