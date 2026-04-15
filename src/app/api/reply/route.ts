import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function decodeParam(str: string): string {
  const b64 = str.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(b64, "base64").toString("utf-8");
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
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
  const intentUrl = `https://twitter.com/intent/tweet?in_reply_to=${tweetId}&text=${encodeURIComponent(replyText)}`;

  const html = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>リプライ送信</title>
  <style>
    body { font-family: -apple-system, sans-serif; margin: 0; padding: 1rem; background: #f5f5f5; }
    .card { background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); max-width: 500px; margin: 0 auto; }
    h1 { font-size: 1.2rem; margin: 0 0 1rem; }
    .reply-text { background: #f0f7ff; padding: 0.75rem; border-radius: 8px; margin-bottom: 1rem; font-size: 0.95rem; line-height: 1.6; white-space: pre-wrap; word-break: break-all; }
    .btn { display: block; width: 100%; padding: 0.75rem; border: none; border-radius: 8px; font-size: 1rem; cursor: pointer; margin-bottom: 0.5rem; text-align: center; text-decoration: none; box-sizing: border-box; }
    .btn-x { background: #000; color: white; }
    .btn-copy { background: #e0e0e0; color: #333; }
    .btn-copy.done { background: #17BF63; color: white; }
    .info { font-size: 0.8rem; color: #999; text-align: center; margin-top: 0.75rem; }
  </style>
</head>
<body>
  <div class="card">
    <h1>リプライ内容</h1>
    <div class="reply-text" id="reply-text">${escapeHtml(replyText)}</div>
    <button class="btn btn-copy" id="copy-btn" onclick="copyText()">テキストをコピー</button>
    <a class="btn btn-x" href="${escapeHtml(intentUrl)}" target="_blank">Xで返信する</a>
    <p class="info">「Xで返信する」で開かない場合は、<br>テキストをコピーしてXアプリで直接返信してください。</p>
  </div>
  <script>
    function copyText() {
      const text = document.getElementById('reply-text').textContent;
      navigator.clipboard.writeText(text).then(() => {
        const btn = document.getElementById('copy-btn');
        btn.textContent = 'コピーしました!';
        btn.className = 'btn btn-copy done';
        setTimeout(() => {
          btn.textContent = 'テキストをコピー';
          btn.className = 'btn btn-copy';
        }, 2000);
      });
    }
  </script>
</body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
