import { NextRequest, NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 今日の日付 (JST)
  const now = new Date();
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const dateStr =
    jst.getFullYear().toString() +
    (jst.getMonth() + 1).toString().padStart(2, "0") +
    jst.getDate().toString().padStart(2, "0");

  // GitHub から朝投稿ファイルを取得
  try {
    const res = await fetch(
      `https://api.github.com/repos/n-akita/career_website/contents/content/x-posts/${dateStr}.md`,
      { headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } }
    );

    if (!res.ok) {
      return NextResponse.json({
        message: `No morning post for ${dateStr}`,
      });
    }

    const data = await res.json();
    const content = Buffer.from(data.content, "base64").toString("utf-8").trim();

    // X に投稿
    const { TwitterApi } = await import("twitter-api-v2");
    const client = new TwitterApi({
      appKey: process.env.X_API_KEY!,
      appSecret: process.env.X_API_SECRET!,
      accessToken: process.env.X_ACCESS_TOKEN!,
      accessSecret: process.env.X_ACCESS_TOKEN_SECRET!,
    });

    const { data: tweetData } = await client.v2.tweet(content);
    const tweetUrl = `https://x.com/nara_nara_san/status/${tweetData.id}`;

    // 投稿履歴をGitHubに記録
    await savePostHistory({
      tweetId: tweetData.id,
      tweetUrl,
      tweetText: content,
      articleUrl: "",
      postedAt: new Date().toISOString(),
      type: "morning",
    });

    // LINE に完了通知
    await fetch("https://api.line.me/v2/bot/message/broadcast", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        messages: [{ type: "text", text: `朝投稿完了！\n${tweetUrl}` }],
      }),
    });

    return NextResponse.json({ message: "OK", date: dateStr, tweetUrl });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("Morning post error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

interface PostRecord {
  tweetId: string;
  tweetUrl: string;
  tweetText: string;
  articleUrl: string;
  postedAt: string;
  type?: string;
}

async function savePostHistory(record: PostRecord): Promise<void> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/n-akita/career_website/contents/post_history.json`,
      { headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } }
    );
    const data = await res.json();
    const sha = data.sha;
    const current: PostRecord[] = res.ok
      ? JSON.parse(Buffer.from(data.content, "base64").toString("utf-8"))
      : [];

    current.push(record);

    await fetch(
      `https://api.github.com/repos/n-akita/career_website/contents/post_history.json`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Morning post: ${record.tweetText.substring(0, 40)}...`,
          content: Buffer.from(JSON.stringify(current, null, 2)).toString("base64"),
          sha,
        }),
      }
    );
  } catch (err) {
    console.error("Failed to save post history:", err);
  }
}
