import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";

export const dynamic = "force-dynamic";

function verifySignature(body: string, signature: string): boolean {
  const hash = createHmac("sha256", process.env.LINE_CHANNEL_SECRET!)
    .update(body)
    .digest("base64");
  return hash === signature;
}

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

  if (!verifySignature(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const parsed = JSON.parse(body);
  const events = parsed.events || [];

  for (const event of events) {
    if (event.type === "postback") {
      const data = event.postback.data;
      if (data === "reject") {
        await replyMessage(event.replyToken, "スキップしました。");
      }
    }
  }

  return NextResponse.json({ status: "ok" });
}
