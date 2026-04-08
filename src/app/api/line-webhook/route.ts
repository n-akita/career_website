import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, unlink, mkdir } from "fs/promises";
import { join } from "path";
import { createHmac } from "crypto";

export const dynamic = "force-dynamic";

const DRAFTS_DIR = join("/tmp", "x-drafts");

// LINE署名検証
function verifySignature(body: string, signature: string): boolean {
  const hash = createHmac("sha256", process.env.LINE_CHANNEL_SECRET!)
    .update(body)
    .digest("base64");
  return hash === signature;
}

// ドラフト読み込み
async function getDraft(id: string) {
  try {
    const data = await readFile(join(DRAFTS_DIR, `${id}.json`), "utf-8");
    return JSON.parse(data);
  } catch {
    return null;
  }
}

// ドラフト保存
async function saveDraft(draft: Record<string, unknown>) {
  await mkdir(DRAFTS_DIR, { recursive: true });
  await writeFile(
    join(DRAFTS_DIR, `${draft.id}.json`),
    JSON.stringify(draft)
  );
}

// ドラフト削除
async function deleteDraft(id: string) {
  await unlink(join(DRAFTS_DIR, `${id}.json`)).catch(() => {});
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
async function replyMessage(replyToken: string, messages: unknown[]) {
  await fetch("https://api.line.me/v2/bot/message/reply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({ replyToken, messages }),
  });
}

// 承認用Flex Messageを生成
function buildApprovalMessage(
  tweet: string,
  articleTitle: string,
  articleUrl: string,
  draftId: string
) {
  return {
    type: "flex",
    altText: `【X投稿承認】${tweet.substring(0, 30)}...`,
    contents: {
      type: "bubble",
      body: {
        type: "box",
        layout: "vertical",
        spacing: "md",
        contents: [
          {
            type: "text",
            text: "X投稿の承認",
            weight: "bold",
            size: "lg",
          },
          { type: "separator" },
          {
            type: "text",
            text: tweet,
            wrap: true,
            size: "sm",
            margin: "md",
          },
          { type: "separator", margin: "md" },
          {
            type: "text",
            text: `元記事: ${articleTitle}`,
            wrap: true,
            size: "xs",
            color: "#888888",
            margin: "md",
          },
          {
            type: "text",
            text: articleUrl,
            wrap: true,
            size: "xs",
            color: "#1DA1F2",
            margin: "sm",
            action: { type: "uri", label: "記事を見る", uri: articleUrl },
          },
        ],
      },
      footer: {
        type: "box",
        layout: "vertical",
        spacing: "sm",
        contents: [
          {
            type: "button",
            action: {
              type: "postback",
              label: "投稿する",
              data: `approve::${draftId}`,
            },
            style: "primary",
            color: "#1DA1F2",
          },
          {
            type: "button",
            action: {
              type: "postback",
              label: "修正する",
              data: `edit::${draftId}`,
            },
            style: "secondary",
          },
          {
            type: "button",
            action: {
              type: "postback",
              label: "投稿しない",
              data: `reject::${draftId}`,
            },
            style: "secondary",
          },
        ],
      },
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
    const replyToken = event.replyToken;

    // ポストバック（ボタン押下）
    if (event.type === "postback") {
      const data = event.postback.data;
      const [action, draftId] = data.split("::");

      const draft = await getDraft(draftId);
      if (!draft) {
        await replyMessage(replyToken, [
          { type: "text", text: "この下書きは期限切れです。" },
        ]);
        continue;
      }

      if (action === "approve") {
        // 投稿する
        try {
          const tweetText = `${draft.tweet}\n\n${draft.url}`;
          const tweetId = await postToX(tweetText);
          const tweetUrl = `https://x.com/nara_nara_san/status/${tweetId}`;
          await deleteDraft(draftId);
          await replyMessage(replyToken, [
            { type: "text", text: `投稿完了！\n${tweetUrl}` },
          ]);
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : "Unknown error";
          await replyMessage(replyToken, [
            { type: "text", text: `投稿失敗: ${msg}` },
          ]);
        }
      } else if (action === "edit") {
        // 修正する → 編集モードに
        draft.editing = true;
        await saveDraft(draft);
        await replyMessage(replyToken, [
          { type: "text", text: "修正文を送ってください。" },
        ]);
      } else if (action === "reject") {
        // 投稿しない
        await deleteDraft(draftId);
        await replyMessage(replyToken, [
          { type: "text", text: "スキップしました。" },
        ]);
      }
    }

    // テキストメッセージ（修正文）
    if (event.type === "message" && event.message.type === "text") {
      const userText = event.message.text.trim();

      // 編集中のドラフトを探す
      const { readdir } = await import("fs/promises");
      let editingDraft = null;
      try {
        const files = await readdir(DRAFTS_DIR);
        for (const file of files) {
          const data = await readFile(join(DRAFTS_DIR, file), "utf-8");
          const d = JSON.parse(data);
          if (d.editing) {
            editingDraft = d;
            break;
          }
        }
      } catch {
        // no drafts
      }

      if (!editingDraft) {
        await replyMessage(replyToken, [
          {
            type: "text",
            text: "修正待ちの下書きがありません。通知の「修正する」ボタンを先に押してください。",
          },
        ]);
        continue;
      }

      // 修正文で更新し、再度承認メッセージを送信
      editingDraft.tweet = userText;
      editingDraft.editing = false;
      await saveDraft(editingDraft);

      await replyMessage(replyToken, [
        buildApprovalMessage(
          userText,
          editingDraft.title,
          editingDraft.url,
          editingDraft.id
        ),
      ]);
    }
  }

  return NextResponse.json({ status: "ok" });
}
