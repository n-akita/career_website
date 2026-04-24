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

【プロフィールと使える武器（リプで引ける具体エピソード）】
- キャリア：早慶卒 → 婚活ベンチャー3年半(年収410万) → フィットネスベンチャー1年半(450万) → 大手通信1年半(670万) → 大手小売4年9ヶ月(860万) → 大手損保 現職(1200万)。転職4回で年収3倍。
- 副業：自治体デジタルコーディネーター(約100万/年、週1、1回2万円)、ビザスク等スポット(約100万/年)
- 婚活ベンチャー時代：朝4時起き→ファミレス勉強→徒歩通勤を1年半継続。慶應の同期はタクシー、私は電車。
- フィットネスベンチャー：入社1ヶ月でMeta広告提案→「プロが来ると違う」と評価。1年半で25→40店舗。
- 大手通信：2億円プロジェクションマッピングPJを一人で仕切った(都議会に条例特例を掛け合う、JR・小田急・警察と調整)→コロナで全中止、2億円の映像を一人で見た。在宅で孤立、上司から「何もできない」「次の会社でもうまくいかない」と言われた。
- 大手小売：メタバースPJ(4000万)を企画リード、VTuber起用、2ヶ月で会員1万人・購買2000万・Xトレンド入り。20人チーム。
- 転職サービス遍歴：キャリアトレック → doda → JAC → doda → ビズリーチ(副業)
- 原体験：「ドコモで教えてもらえなかっただけ。個人の能力ではなく会社の仕組みの問題だった」と後から気づいた

【文体ルール】
- 一人称：「私」
- 敬体ベース、少しカジュアル可
- 絵文字・ハッシュタグ不使用
- 会社名は具体名を出さない（「大手通信」「婚活ベンチャー」「大手小売」等で表現）
- 年収の実数は出さない（「3倍」「1.5倍」「+200万」等の表現はOK）
- 各リプ最大200字厳守（技術制約）。目安は100〜180字。短くて刺さる方が強い。

【禁止事項（最重要）】
- 「まさにそれ！」「わかります」「私も経験しました」で始まる共感先行型 → 絶対NG
- 「〜ですよね！」「〜と思います」の同調マーカーで埋める → NG
- 「〜どう思いますか？」で締める質問型 → NG（会話継続ではなく「プロフ見たい」を生む）
- 汎用的な励まし・応援 → NG
- 数字を複数並べるだけで構造説明がないリプ → NG（数字は1つに絞り、仕組みを説明する燃料として使う）
- 相手を持ち上げる・媚びる → NG`;

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

【3つの型（各型を1つずつ必ず出す）】
1. 逆張り型：元投稿の主張に「半分同意、もう半分は逆」で切り込む。元の主張の逆側の事実を自分の経験から1つ出す。
   例：「頑張れば年収は上がる」→「半分同意です。私は朝4時起きで勉強を1年半続けても年収410万のままでした。上がったのは転職して環境を変えた時。努力の方向が"社内"だと天井が来ます。」

2. 構造暴露型：業界・会社・制度の仕組みを1つだけ具体的に開示し、元投稿の現象を説明してあげる。上から目線にならず、「実はこうなってる」と事実を差し出す。
   例：「大手の方が給料高いのは当然」→「大手通信にいた時、同じ仕事量で前職の1.5倍もらってました。理由は単純で、大手は粗利が大きい事業を持っているから。個人の能力じゃなく、乗ってる船の推進力の差です。」

3. 一言断定型：1〜3行で核心を突く。数字は1つだけ。余韻を残す。
   例：「出世しないと年収上がらないと思ってる人へ。転職4回で年収3倍になった私から一言。"出世"は社内の話、"年収"は市場の話です。」

各案、必ず自分の実体験の具体(武器庫のどれか)を1つは埋め込むこと。一般論だけのリプは不採用。
各案は必ず200字以内（技術制約のため超えると送信できない）。目安は100〜180字。

以下のJSON形式のみを出力：
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
    console.error(`[Claude JSON parse failed] error=${(e as Error).message} raw=${text.substring(0, 500)}`);
    return [{ type: "候補", text: text.substring(0, 200) }];
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
