import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import Anthropic from "@anthropic-ai/sdk";

export const dynamic = "force-dynamic";

const BASE_URL = "https://www.nara-career.com";

function verifySignature(body: string, signature: string): boolean {
  const hash = createHmac("sha256", process.env.LINE_CHANNEL_SECRET!)
    .update(body)
    .digest("base64");
  return hash === signature;
}

function b64(str: string): string {
  return Buffer.from(str, "utf-8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

async function replyMessages(replyToken: string, messages: unknown[]) {
  const res = await fetch("https://api.line.me/v2/bot/message/reply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({ replyToken, messages }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error(`[LINE reply failed] status=${res.status} body=${body}`);
  }
}

// ツイートURLからtweetIdとusernameを抽出
function extractTweetInfo(text: string): { url: string; tweetId: string; username: string } | null {
  const match = text.match(/https?:\/\/(?:x\.com|twitter\.com)\/(\w+)\/status\/(\d+)/);
  if (!match) return null;
  return { url: match[0], tweetId: match[2], username: match[1] };
}

// oEmbed APIでツイート本文を取得
async function fetchTweetText(tweetUrl: string): Promise<{ text: string; authorName: string } | null> {
  try {
    const res = await fetch(
      `https://publish.twitter.com/oembed?url=${encodeURIComponent(tweetUrl)}&omit_script=true`,
      { signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const pMatch = data.html?.match(/<p[^>]*>([\s\S]*?)<\/p>/);
    if (!pMatch) return null;
    const text = pMatch[1]
      .replace(/<br\s*\/?>/g, "\n")
      .replace(/<a[^>]*>([^<]*)<\/a>/g, "$1")
      .replace(/<[^>]+>/g, "")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();
    return { text, authorName: data.author_name || "" };
  } catch {
    return null;
  }
}

// Claude APIでリプライ候補を3つ生成
async function generateReplyCandidates(
  tweetText: string,
  authorName: string
): Promise<{ type: string; text: string }[]> {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const systemPrompt = `あなたは秋田直樹（@nara_nara_san）のXリプライ職人です。目的はリプからプロフ遷移→フォローを生むこと。共感コメントを量産する役ではない。

【リプの基本姿勢】
- 主役は元投稿者。自分は脇役。リプは元投稿への鋭い反応＋ちょっとした視点提供が主。
- 自分の経歴は「軽く匂わせる」程度。詳細はプロフィールで見てもらう。
- 自分語りが3割を超えるリプは即NG。経歴自慢に見えた瞬間にスルーされる。
- いきなり経歴の具体を並べると、初対面の相手は引く。リプは"会話の入り口"であって"自己紹介"ではない。

【プロフィールの背景情報（リプ生成のための内的知識。直接書くな）】
- 業種遍歴：ベンチャー2社 → 大手 → 大手 → 大手(現職)。転職4回で年収3倍。
- マーケティング/広告系のキャリア。事業立ち上げ・新規事業の経験あり。副業で別の場所でも働いている。
- 引いていい経験パターン（抽象度高めで）：「業界が違うと年収が変わった」「環境を変えたら評価が変わった」「自社では評価されなかったが転職先で評価された」「在宅で孤立した時期」「努力しても上がらない時期」「副業でスキルを別の場所で売る経験」「大手に来て初めて分かった会社の仕組みの差」など。

【固有情報の出し方ルール（厳守）】
- 業種・職種：固有名詞NG。「婚活ベンチャー」「フィットネス」「通信」「小売」「保険」「損保」も全てNG。「ベンチャー」「大手」「大企業」「JTC」のいずれかにぼかす。
- 数字：実数NG、丸めて抽象化。「年収410万」→「年収400万」程度。「2億円のプロジェクションマッピング」→「数億規模のPJ」または「会社の旗艦PJ」。「4000万のメタバースPJ」→「数千万規模の新規事業」。「25→40店舗」のような具体数字も避ける。
- 役職・社名・サービス名：一切出さない。「VTuber起用」「Meta広告」「DAMプロジェクト」なども避け、「新規事業」「広告運用」程度に抽象化。
- 年数：「3年半」「1年半」のような細かい数字は出さず「数年」「短期間」程度。
- リプ1本につき、自分のエピソード要素は1つまで。複数盛り込むと自分語りに見える。

【文体ルール】
- 一人称：「私」
- 敬体ベース、少しカジュアル可
- 絵文字・ハッシュタグ不使用
- 各リプ最大200字厳守（技術制約）。目安は80〜150字。短くて鋭い方が強い。
- 自分の話は1〜2行に圧縮。残りは元投稿への視点・補足に使う。
- **初対面の相手に送るので断言調は避ける**。「〜です」「〜のは事実」「〜の方が重要」のような言い切りはNG。
- 語尾は柔らかく：「〜かもしれません」「〜な気がします」「〜と思います」「〜と感じてます」「〜のかなと」「〜だったりします」を意識的に混ぜる。
- 「〜ですよね」のような軽い同意マーカーはOK（連発はNG）。

【禁止事項（最重要）】
- 「まさにそれ！」「わかります！私も経験しました」のようなベタ褒め共感で始まる → 絶対NG
- 「〜どう思いますか？」で締める質問型 → NG
- 汎用的な励まし・応援 → NG
- 自分の経歴・実績・数字を3つ以上並べる → NG（自慢に見える）
- 業種名・サービス名・固有名詞の出力 → NG
- 相手を持ち上げる・媚びる → NG
- 言い切り・断定調 → NG（初対面相手への配慮）`;

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1500,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: `以下のツイートに対するリプ案を3つ、必ず異なる型で生成してください。

【ツイート】
投稿者: ${authorName}
本文: ${tweetText}

【3つの型（各型を1つずつ必ず出す）】※すべて初対面の相手に送る前提。柔らかく。
1. 逆張り型：元投稿の主張に「半分同意、ただ別の見方もありそう」で切り込む。自分の経験は軽く匂わせる程度。
   例：「頑張れば年収は上がる」→「半分同意です。ただ私は数年間社内で頑張っても年収400万前後で停滞してた時期があって、上がったのは転職した後だったりします。努力の方向が社内だと天井が来やすいのかも、とも思います。」

2. 構造暴露型：業界・会社・制度の仕組みを1つだけ開示し、元投稿の現象を別の角度から説明する。経歴は具体的に書かず、抽象的な経験パターンで語る。語尾は柔らかく。
   例：「大手の方が給料高いのは当然」→「大手に移って気づいたんですが、同じ仕事量でも給料が変わるのは粗利が大きい事業に乗ってるからな気がします。個人の能力というより、乗ってる船の推進力の差なのかも、と思いました。」

3. 一言断定型：1〜3行で核心を突くが、語尾は柔らかく。数字は最大1つ。経歴は出さず核心だけ。
   例：「出世しないと年収上がらないと思ってる方へ。"出世"は社内の話、"年収"は市場の話、なのかなと思ったりします。両方狙わなくていいかもしれないですよね。」

【リプ作成時のチェック（生成前に必ず確認）】
- 自分の経験を語る部分は1〜2行に収まっているか？それ以上書いたら自慢に見える。
- 業種名・社名・固有名詞・実数を出していないか？「ベンチャー」「大手」「数年」「年収400万」レベルにぼかせているか？
- 元投稿への反応・視点提供がリプの主軸になっているか？自己紹介になっていないか？
- 言い切り・断定の語尾になっていないか？「〜です」「〜のは事実」「〜が重要」を「〜かもしれません」「〜な気がします」「〜と思ったりします」「〜のかなと」に置き換えたか？
- 各案は必ず200字以内（技術制約）。目安は80〜150字。

【出力フォーマット厳守】
- 純粋なJSONのみ出力。説明文・コードブロック(\`\`\`)・前置き後置き一切禁止。
- typeの値は必ず「逆張り」「構造暴露」「一言断定」の3つを順番通り。
- text値の中に半角ダブルクォート(")を使うな。引用は必ず日本語の「」を使う。
- text値の中に改行を入れるな。1行で書く。
- 配列は必ず3要素。

出力例(これに完全準拠)：
{"replies":[{"type":"逆張り","text":"..."},{"type":"構造暴露","text":"..."},{"type":"一言断定","text":"..."}]}`,
      },
    ],
  });

  const text = response.content[0].type === "text" ? response.content[0].text.trim() : "";
  console.log(`[Claude raw output] length=${text.length} stop_reason=${response.stop_reason}`);
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch![0]);
    return parsed.replies;
  } catch (e) {
    console.error(`[Claude JSON parse failed] error=${(e as Error).message} raw=${text.substring(0, 1000)}`);
    return [
      { type: "逆張り", text: "[生成失敗1] Vercelログを確認してください" },
      { type: "構造暴露", text: "[生成失敗2] Vercelログを確認してください" },
      { type: "一言断定", text: "[生成失敗3] Vercelログを確認してください" },
    ];
  }
}

// リプライ候補のFlex Messageを構築（カルーセル）
function buildReplyCarousel(
  replies: { type: string; text: string }[],
  tweetId: string,
  originalTweet: string,
  authorName: string
) {
  const secret = process.env.DRAFT_API_SECRET;
  const colors = ["#1DA1F2", "#17BF63", "#F45D22"];
  const labels = ["① 逆張り", "② 構造暴露", "③ 一言断定"];

  const bubbles = replies.map((reply, i) => {
    // LINE Flex Messageのaction.uri上限1000字→base64後の実質上限は約200字。保険として切詰め。
    const safeText = reply.text.length > 200 ? reply.text.substring(0, 200) : reply.text;
    // /api/reply 経由でXのリプライ画面にリダイレクト（URL長制限対策）
    const replyUrl = `${BASE_URL}/api/reply?s=${secret}&t=${b64(safeText)}&id=${tweetId}`;
    const editUrl = `${BASE_URL}/api/reply-edit?s=${secret}&t=${b64(safeText)}&id=${tweetId}`;

    return {
      type: "bubble",
      size: "kilo",
      header: {
        type: "box",
        layout: "vertical",
        backgroundColor: colors[i] || "#888888",
        contents: [
          { type: "text", text: labels[i] || `候補${i + 1}`, color: "#FFFFFF", weight: "bold", size: "sm" },
        ],
        paddingAll: "10px",
      },
      body: {
        type: "box",
        layout: "vertical",
        spacing: "sm",
        contents: [
          { type: "text", text: `@${authorName} への返信:`, size: "xxs", color: "#999999" },
          { type: "text", text: safeText, wrap: true, size: "sm", margin: "sm" },
        ],
      },
      footer: {
        type: "box",
        layout: "vertical",
        spacing: "sm",
        contents: [
          { type: "button", action: { type: "uri", label: "これで返信", uri: replyUrl }, style: "primary", color: colors[i] || "#888888", height: "sm" },
          { type: "button", action: { type: "uri", label: "修正する", uri: editUrl }, style: "secondary", height: "sm" },
        ],
      },
    };
  });

  return {
    type: "flex",
    altText: `リプライ候補（${authorName}宛）`,
    contents: {
      type: "carousel",
      contents: bubbles,
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
    // 既存: 投稿スキップのpostback
    if (event.type === "postback") {
      const data = event.postback.data;
      if (data === "reject" || data === "reject_reply") {
        await replyMessages(event.replyToken, [{ type: "text", text: "スキップしました。" }]);
      }
    }

    // 新規: テキストメッセージからツイートURL検出 → リプライ候補生成
    if (event.type === "message" && event.message.type === "text") {
      const tweetInfo = extractTweetInfo(event.message.text);
      if (!tweetInfo) continue; // URL以外のメッセージは無視

      try {
        // oEmbedでツイート本文取得
        const tweet = await fetchTweetText(tweetInfo.url);
        if (!tweet) {
          await replyMessages(event.replyToken, [
            { type: "text", text: "ツイートの取得に失敗しました。非公開アカウントまたは削除されたツイートの可能性があります。" },
          ]);
          continue;
        }

        // Claude APIでリプライ候補生成
        const replies = await generateReplyCandidates(tweet.text, tweet.authorName);

        // Flex Messageで返信（replyMessageなので月200通にカウントされない）
        const carousel = buildReplyCarousel(replies, tweetInfo.tweetId, tweet.text, tweet.authorName);
        await replyMessages(event.replyToken, [carousel]);
      } catch (err) {
        console.error("Reply generation error:", err);
        await replyMessages(event.replyToken, [
          { type: "text", text: "リプライ候補の生成中にエラーが発生しました。しばらくしてから再度お試しください。" },
        ]).catch(() => {}); // replyTokenが期限切れの場合もある
      }
    }
  }

  return NextResponse.json({ status: "ok" });
}
