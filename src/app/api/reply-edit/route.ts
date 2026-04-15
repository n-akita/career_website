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

  const reply = replyB64 ? decodeParam(replyB64) : "";

  const html = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>リプライを修正</title>
  <style>
    body { font-family: -apple-system, sans-serif; margin: 0; padding: 1rem; background: #f5f5f5; }
    .card { background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); max-width: 500px; margin: 0 auto; }
    h1 { font-size: 1.2rem; margin: 0 0 1rem; }
    textarea { width: 100%; height: 120px; border: 1px solid #ddd; border-radius: 8px; padding: 0.75rem; font-size: 16px; resize: vertical; box-sizing: border-box; }
    .count { text-align: right; color: #888; font-size: 0.85rem; margin: 0.25rem 0 1rem; }
    .count.over { color: red; }
    .info { background: #f9f9f9; padding: 0.75rem; border-radius: 8px; margin-bottom: 1rem; font-size: 0.85rem; color: #666; }
    .btn { width: 100%; padding: 0.75rem; border: none; border-radius: 8px; font-size: 1rem; cursor: pointer; margin-bottom: 0.5rem; }
    .btn-primary { background: #1DA1F2; color: white; }
    .btn-secondary { background: #e0e0e0; color: #333; }
    .btn:disabled { opacity: 0.5; }
    .result { display: none; text-align: center; padding: 2rem 0; }
  </style>
</head>
<body>
  <div class="card">
    <div id="form-area">
      <h1>リプライを修正</h1>
      <textarea id="reply" maxlength="280">${escapeHtml(reply)}</textarea>
      <div class="count" id="count">${reply.length}/200文字</div>
      <div class="info">
        リプライ先ツイートID: ${escapeHtml(tweetId || "")}
      </div>
      <button class="btn btn-primary" id="post-btn" onclick="submitReply()">この内容で返信する</button>
      <button class="btn btn-secondary" onclick="window.close()">キャンセル</button>
    </div>
    <div class="result" id="result-area">
      <h1 id="result-title"></h1>
      <p id="result-msg"></p>
    </div>
  </div>
  <script>
    const textarea = document.getElementById('reply');
    const countEl = document.getElementById('count');
    textarea.addEventListener('input', () => {
      const len = textarea.value.length;
      countEl.textContent = len + '/200文字';
      countEl.className = len > 200 ? 'count over' : 'count';
    });

    async function submitReply() {
      const btn = document.getElementById('post-btn');
      btn.disabled = true;
      btn.textContent = '送信中...';
      const replyText = textarea.value;
      const replyB64 = btoa(unescape(encodeURIComponent(replyText)));
      const replyUrl = '/api/reply?s=${encodeURIComponent(secret || "")}&t=' + encodeURIComponent(replyB64) + '&id=${encodeURIComponent(tweetId || "")}';
      try {
        const res = await fetch(replyUrl);
        document.getElementById('form-area').style.display = 'none';
        const resultArea = document.getElementById('result-area');
        resultArea.style.display = 'block';
        if (res.ok) {
          document.getElementById('result-title').textContent = 'リプライ完了!';
          document.getElementById('result-msg').textContent = 'Xにリプライしました。LINEにも通知が届きます。';
        } else {
          document.getElementById('result-title').textContent = 'リプライ失敗';
          document.getElementById('result-msg').textContent = 'エラーが発生しました。';
        }
      } catch(e) {
        btn.disabled = false;
        btn.textContent = 'この内容で返信する';
        alert('エラー: ' + e.message);
      }
    }
  </script>
</body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
