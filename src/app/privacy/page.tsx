import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description:
    "「会社員の居場所戦略」のプライバシーポリシーです。個人情報の取り扱い・広告・アクセス解析について記載しています。",
  alternates: {
    canonical: "https://nara-career.com/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">プライバシーポリシー</h1>

      <div className="space-y-8 text-zinc-700 leading-relaxed text-sm">
        <section>
          <h2 className="text-lg font-bold mb-3">個人情報の利用目的</h2>
          <p>
            当サイト「会社員の居場所戦略」（以下、当サイト）では、お問い合わせの際に、お名前・メールアドレス等の個人情報をご入力いただく場合がございます。
            取得した個人情報は、お問い合わせに対する回答のためにのみ利用し、それ以外の目的では利用いたしません。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3">広告について</h2>
          <p>
            当サイトでは、第三者配信の広告サービスおよびアフィリエイトプログラムを利用しています。
            広告配信事業者は、ユーザーの興味に応じた広告を表示するために、Cookie を使用することがあります。
            Cookie の利用を望まない場合は、ブラウザの設定から無効にすることが可能です。
          </p>
          <p className="mt-2">当サイトが参加しているアフィリエイトプログラム：</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>A8.net</li>
            <li>もしもアフィリエイト</li>
            <li>afb</li>
            <li>バリューコマース</li>
            <li>アクセストレード</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3">アクセス解析ツールについて</h2>
          <p>
            当サイトでは、Google アナリティクスを利用してアクセス情報を収集しています。
            データは匿名で収集されており、個人を特定するものではありません。
            この機能は Cookie を無効にすることで収集を拒否できます。
            詳しくは Google アナリティクスの利用規約をご確認ください。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3">免責事項</h2>
          <p>
            当サイトに掲載された内容によって生じた損害等については、一切の責任を負いかねます。
            情報の正確性には万全を期しておりますが、正確性・安全性を保証するものではありません。
            リンク先の他サイトで提供される情報・サービスについても、責任を負いかねます。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3">著作権について</h2>
          <p>
            当サイトに掲載されている文章・画像等の著作権は、運営者に帰属します。
            無断転載を禁止いたします。引用の際は、当サイトへのリンクをお願いいたします。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3">お問い合わせ</h2>
          <p>
            当サイトのプライバシーポリシーに関するお問い合わせは、
            <a href="/contact" className="text-primary hover:underline">お問い合わせページ</a>
            よりお願いいたします。
          </p>
        </section>
      </div>
    </div>
  );
}
