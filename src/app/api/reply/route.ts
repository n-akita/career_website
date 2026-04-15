import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function decodeParam(str: string): string {
  const b64 = str.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(b64, "base64").toString("utf-8");
}

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("s");
  const replyB64 = req.nextUrl.searchParams.get("t");
  const tweetId = req.nextUrl.searchParams.get("id");

  if (secret !== process.env.DRAFT_API_SECRET) {
    return new NextResponse("認証エラー", { status: 401 });
  }

  if (!replyB64 || !tweetId) {
    return new NextResponse("パラメータ不足", { status: 400 });
  }

  const replyText = decodeParam(replyB64);

  // Xアプリのリプライ画面にリダイレクト（テキスト入力済み）
  const intentUrl = `https://x.com/intent/post?in_reply_to=${tweetId}&text=${encodeURIComponent(replyText)}`;
  return NextResponse.redirect(intentUrl);
}
