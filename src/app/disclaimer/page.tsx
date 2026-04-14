import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "免責事項",
  description:
    "「会社員の居場所戦略」の免責事項です。当サイトの情報利用に関する注意事項をご確認ください。",
  alternates: {
    canonical: "https://nara-career.com/disclaimer",
  },
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">免責事項</h1>

      <div className="space-y-8 text-zinc-700 leading-relaxed text-sm">
        <section>
          <h2 className="text-lg font-bold mb-3">当サイトの情報について</h2>
          <p>
            当サイト「会社員の居場所戦略」（以下、当サイト）は、転職やキャリアに関する情報を提供することを目的としています。
            掲載されている情報は、運営者個人の経験および見解に基づくものであり、すべての方に当てはまることを保証するものではありません。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3">損害等の責任について</h2>
          <p>
            当サイトの情報を利用することで生じたいかなる損害についても、運営者は一切の責任を負いかねます。
            転職活動やキャリアに関する意思決定は、ご自身の判断と責任のもとで行っていただきますようお願いいたします。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3">年収・報酬に関する記載について</h2>
          <p>
            当サイトに掲載されている年収や報酬に関する情報は、運営者個人の実績または公開されたデータに基づくものです。
            同様の結果を保証するものではなく、個人の経験・スキル・市場環境などにより結果は異なります。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3">転職サービスの紹介について</h2>
          <p>
            当サイトでは、転職エージェント・転職サイト等のサービスを紹介しています。
            これらのサービスに関する情報は紹介時点のものであり、サービス内容・料金・利用条件等は変更される場合があります。
            最新の情報は各サービスの公式サイトにてご確認ください。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3">アフィリエイトプログラムについて</h2>
          <p>
            当サイトは、一部のリンクにおいてアフィリエイトプログラムを利用しています。
            ユーザーがリンクを経由してサービスの利用や商品の購入を行った場合、当サイト運営者に報酬が支払われることがあります。
            ただし、これにより推奨するサービスの選定が影響を受けることはありません。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3">外部リンクについて</h2>
          <p>
            当サイトから外部サイトへのリンクを設置している場合がありますが、リンク先の内容・サービスについて当サイトは責任を負いません。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3">情報の正確性について</h2>
          <p>
            当サイトのコンテンツは可能な限り正確な情報を提供するよう努めておりますが、
            誤った情報や古くなった情報が含まれている場合があります。
            お気づきの点がございましたら、
            <a href="/contact" className="text-primary hover:underline">お問い合わせページ</a>
            よりご連絡ください。
          </p>
        </section>
      </div>
    </div>
  );
}
