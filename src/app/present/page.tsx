import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "【無料】転職4回で使った職務経歴書テンプレート",
  description:
    "転職4回・年収3.5倍を実現した筆者が、実際に書類選考を突破してきた職務経歴書の型を無料テンプレートとして配布します。",
  // 配布用の受け皿ページのため検索インデックスは不要（導線はサイト内・Xから）
  robots: { index: false, follow: true },
  alternates: { canonical: "/present" },
};

// メール登録フォーム（Brevo等）の埋め込みURL。未設定の間はフォームの代わりに準備中の案内を出す
const FORM_URL = process.env.NEXT_PUBLIC_LEADMAGNET_FORM_URL;

export default function PresentPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-14 md:py-20">
      <p className="text-xs font-semibold text-primary tracking-wider uppercase mb-3">
        Free Template
      </p>
      <h1 className="text-2xl md:text-3xl font-bold leading-snug mb-6">
        転職4回で書類を通し続けた
        <br />
        職務経歴書テンプレート（無料）
      </h1>

      <div className="space-y-4 text-[15px] leading-relaxed text-zinc-700">
        <p>
          転職4回・年収3.5倍。私が実際に書類選考を突破してきた職務経歴書には、共通の「型」があります。
        </p>
        <p>
          特にベンチャー⇔大手（JTC）をまたぐ転職では、同じ経験でも
          <strong>「どう翻訳して書くか」</strong>
          で通過率が大きく変わります。社内の言葉のままでは、あなたの経験に値段がつきません。
        </p>
        <p>このテンプレートに含まれるもの:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>職務要約の書き方（3行で「何ができる人か」を伝える型）</li>
          <li>ベンチャー経験を大手向けに翻訳する言い換え対応表（抜粋版）</li>
          <li>実績が数字で書けないときの定量化パターン</li>
          <li>職務経歴書の全体構成テンプレート（そのまま使える見出し付き）</li>
        </ul>
      </div>

      <div className="mt-10">
        {FORM_URL ? (
          <div className="rounded-2xl border border-border/60 bg-muted p-6 md:p-8">
            <h2 className="text-lg font-bold mb-2">メールで受け取る</h2>
            <p className="text-sm text-zinc-500 mb-5">
              登録いただいたメールアドレスにテンプレートをお送りします。転職・キャリアに関する新しい記事やテンプレートの更新もお知らせします（いつでも解除できます）。
            </p>
            <iframe
              src={FORM_URL}
              title="テンプレート受け取りフォーム"
              className="w-full min-h-[320px] rounded-xl border-0 bg-white"
            />
          </div>
        ) : (
          <div className="rounded-2xl border border-border/60 bg-muted p-6 md:p-8">
            <h2 className="text-lg font-bold mb-2">配布準備中です</h2>
            <p className="text-sm text-zinc-600 leading-relaxed mb-5">
              テンプレートの配布フォームを準備しています。公開までの間は、Xで転職・キャリアのリアルを毎日発信しているので、そちらをフォローしてお待ちください。
            </p>
            <a
              href="https://x.com/nara_nara_san"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-zinc-900 text-white text-sm font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
            >
              Xをフォローして待つ
            </a>
          </div>
        )}
      </div>

      <div className="mt-12 border-t border-border/60 pt-8">
        <p className="text-sm text-zinc-500 leading-relaxed">
          職務経歴書の書き方は記事でも解説しています。まずは読み物から入りたい方はこちら。
        </p>
        <div className="mt-4 flex flex-col gap-2">
          <Link href="/career/tenshoku" className="text-sm font-semibold text-primary hover:underline">
            → 転職ノウハウの記事一覧
          </Link>
          <Link href="/career/story" className="text-sm font-semibold text-primary hover:underline">
            → 転職4回の実体験ストーリー
          </Link>
        </div>
      </div>
    </main>
  );
}
