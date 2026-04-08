import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function decodeParam(str: string): string {
  const b64 = str.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(b64, "base64").toString("utf-8");
}

function encodeParam(str: string): string {
  return Buffer.from(str, "utf-8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

// GET: 編集フォームを表示
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("s");
  const tweetB64 = req.nextUrl.searchParams.get("t");
  const urlB64 = req.nextUrl.searchParams.get("u");
  const titleB64 = req.nextUrl.searchParams.get("n");

  if (secret !== process.env.DRAFT_API_SECRET) {
    return new NextResponse("認証エラー", { status: 401 });
  }

  const tweet = tweetB64 ? decodeParam(tweetB64) : "";
  const articleUrl = urlB64 ? decodeParam(urlB64) : "";
  const articleTitle = titleB64 ? decodeParam(titleB64) : "";

  const html = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>投稿を修正</title>
  <style>
    body { font-family: -apple-system, sans-serif; margin: 0; padding: 1rem; background: #f5f5f5; }
    .card { background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); max-width: 500px; margin: 0 auto; }
    h1 { font-size: 1.2rem; margin: 0 0 1rem; }
    textarea { width: 100%; height: 120px; border: 1px solid #ddd; border-radius: 8px; padding: 0.75rem; font-size: 16px; resize: vertical; box-sizing: border-box; }
    .count { text-align: right; color: #888; font-size: 0.85rem; margin: 0.25rem 0 1rem; }
    .count.over { color: red; }
    .article { background: #f9f9f9; padding: 0.75rem; border-radius: 8px; margin-bottom: 1rem; font-size: 0.85rem; color: #666; word-break: break-all; }
    .article a { color: #1DA1F2; }
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
      <h1>投稿を修正</h1>
      <textarea id="tweet" maxlength="200">${escapeHtml(tweet)}</textarea>
      <div class="count" id="count">${tweet.length}/120文字</div>
      <div class="article">
        <strong>元記事:</strong> ${escapeHtml(articleTitle)}<br>
        <a href="${escapeHtml(articleUrl)}" target="_blank">記事を読む</a>
      </div>
      <button class="btn btn-primary" id="post-btn" onclick="submitTweet()">この内容で投稿する</button>
      <button class="btn btn-secondary" onclick="window.close()">キャンセル</button>
    </div>
    <div class="result" id="result-area">
      <h1 id="result-title"></h1>
      <p id="result-msg"></p>
    </div>
  </div>
  <script>
    const textarea = document.getElementById('tweet');
    const countEl = document.getElementById('count');
    textarea.addEventListener('input', () => {
      const len = textarea.value.length;
      countEl.textContent = len + '/120文字';
      countEl.className = len > 120 ? 'count over' : 'count';
    });

    async function submitTweet() {
      const btn = document.getElementById('post-btn');
      btn.disabled = true;
      btn.textContent = '投稿中...';
      const tweet = textarea.value;
      const tweetB64 = btoa(unescape(encodeURIComponent(tweet)));
      const approveUrl = '/api/approve?s=${encodeURIComponent(secret || "")}&t=' + encodeURIComponent(tweetB64) + '&u=${encodeURIComponent(urlB64 || "")}';
      try {
        const res = await fetch(approveUrl);
        document.getElementById('form-area').style.display = 'none';
        const resultArea = document.getElementById('result-area');
        resultArea.style.display = 'block';
        if (res.ok) {
          document.getElementById('result-title').textContent = '投稿完了！';
          document.getElementById('result-msg').textContent = 'Xに投稿されました。LINEにも通知が届きます。';
        } else {
          document.getElementById('result-title').textContent = '投稿失敗';
          document.getElementById('result-msg').textContent = 'エラーが発生しました。';
        }
      } catch(e) {
        btn.disabled = false;
        btn.textContent = 'この内容で投稿する';
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

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
