import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ならならについて",
  description:
    "運営者「ならなら」のプロフィール。5社の転職で年収3.5倍を実現。環境を味方につけるキャリア戦略を発信しています。",
};

export default function AboutPage() {
  return (
    <>
      {/* ヒーロー */}
      <section className="relative overflow-hidden bg-zinc-900 text-white">
        <div className="absolute inset-0">
          <Image src="/images/hero-city.jpg" alt="" fill className="object-cover opacity-30" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 pt-20 pb-16 text-center">
          <Image
            src="/images/avatar.png"
            alt="ならなら"
            width={96}
            height={96}
            className="mx-auto rounded-full border-4 border-white/20 mb-6"
          />
          <h1 className="text-3xl md:text-4xl font-bold mb-3">ならなら</h1>
          <p className="text-zinc-400 mb-6">ビジネスマンの居場所戦略 運営者</p>
          <p className="text-zinc-300 leading-relaxed max-w-lg mx-auto">
            デジタルマーケティング歴10年。中小企業から大手企業まで5社を渡り歩き、
            年収を<strong className="text-white">3.5倍</strong>に。
            出世ではなく「環境を変える」ことでキャリアを切り拓いてきました。
            現在は大手損害保険会社でフルリモート勤務しながら、副業にも挑戦中。
          </p>
        </div>
      </section>

      {/* 数字バー */}
      <section className="bg-white border-b border-border/60">
        <div className="max-w-3xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center">
          <div>
            <p className="text-3xl md:text-4xl font-bold text-primary">5<span className="text-lg">社</span></p>
            <p className="text-sm text-zinc-500 mt-1">転職経験</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-bold text-primary">10<span className="text-lg">年</span></p>
            <p className="text-sm text-zinc-500 mt-1">デジマ歴</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-bold text-primary">本業<span className="text-lg">+</span>副業</p>
            <p className="text-sm text-zinc-500 mt-1">現在の働き方</p>
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-16 space-y-24">

        {/* 共感セクション */}
        <section>
          <SectionHeading label="For You" title="こんな悩み、ありませんか？" />
          <div className="grid sm:grid-cols-2 gap-4">
            <PainPoint text="頑張っているのに、年収が全然上がらない" />
            <PainPoint text="出世コースに乗れないと給料は頭打ちだと思っている" />
            <PainPoint text="転職したいけど、自分のスキルに自信がない" />
            <PainPoint text="ベンチャーで消耗 or 大手で飼い殺し、どちらかに当てはまる" />
          </div>
          <p className="text-center text-zinc-500 mt-8 leading-relaxed">
            全部、過去の自分です。<br />
            だからこそ伝えられることがあると思っています。
          </p>
        </section>

        {/* 転機のストーリー */}
        <section>
          <SectionHeading label="Turning Point" title="転職で気づいたこと" />
          <div className="bg-zinc-900 rounded-2xl p-8 md:p-10 text-white">
            <div className="flex items-start gap-3 mb-6">
              <span className="text-3xl leading-none mt-1">&ldquo;</span>
              <p className="text-zinc-300 leading-relaxed">
                3社目の大手通信会社に転職した直後、
                新卒社員にできることが自分にはできなかった。
                「自分の能力が足りないんだ」とずっと自分を責めていた。
              </p>
            </div>
            <div className="border-l-2 border-blue-500 pl-6 mb-6">
              <p className="text-white leading-relaxed font-medium">
                でも後になって気づいた。それは能力の問題じゃなく、
                教えてもらえる環境がなかっただけだった。
                会社の仕組みの問題を、自分のせいにしていた。
              </p>
            </div>
            <p className="text-right">
              <span className="text-xl md:text-2xl font-bold text-blue-400">
                過去の自分に言いたい——「早く気づけよ」
              </span>
            </p>
          </div>
        </section>

        {/* 伝えたいこと */}
        <section>
          <SectionHeading label="Message" title="伝えたいこと" />
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 md:p-10 text-white text-center">
            <blockquote className="text-xl md:text-2xl font-bold leading-relaxed mb-6">
              &ldquo;出世しなくても給料は上がる。
              <br />
              役職で転職しなくていい。
              <br />
              場所を変えるだけ。
              <br />
              <span className="text-blue-200">しかも再現性が高い。</span>&rdquo;
            </blockquote>
            <div className="w-12 h-px bg-white/30 mx-auto mb-6" />
            <p className="text-blue-100 leading-relaxed max-w-md mx-auto text-sm">
              ベンチャーで消耗している人、大手で飼い殺されている人。
              「出世ルートじゃないと年収は上がらない」と思い込んでいる人に、
              早く気づいてほしい。自分がそうだったから。
            </p>
          </div>
        </section>

        {/* 経歴（簡潔な年表） */}
        <section>
          <SectionHeading label="Career" title="経歴" />
          <div className="space-y-0">
            <TimelineItem
              number="01"
              title="BtoC向けマッチングサービス企業"
              role="SEO・WEB広告・LP改善"
              summary="デジマの基礎をすべて叩き込んだ原点。検索順位を圏外から1位に改善。"
            />
            <TimelineItem
              number="02"
              title="フィットネス企業"
              role="WEBマーケ・TVCM・SNS・採用"
              summary="集客と採用の両面で成果を出し、入会者数を月1,000人から2,000人に倍増。"
            />
            <TimelineItem
              number="03"
              title="大手通信会社"
              role="新規事業・広告商品開発・データ活用"
              summary="「大手企業の動かし方」を学んだ転機。ここでの挫折が、環境の大切さに気づくきっかけに。"
              turning
            />
            <TimelineItem
              number="04"
              title="大手企業のDX推進部門"
              role="DX推進・PM・生成AI・メタバース"
              summary="ゼロから立ち上げたサービスが全国の店舗で利用されるまでに成長。"
            />
            <TimelineItem
              number="05"
              title="大手損害保険会社（現職）"
              role="新規事業マーケティング"
              summary="フルリモート＋副業OKの環境を獲得。場所と時間に縛られない働き方を実現。"
              current
            />
            <TimelineItem
              number="＋"
              title="地方自治体のデジタル化推進（副業）"
              role="地方DX"
              summary="本業のスキルを地方に還元し、収入の柱を複数化。"
              current
            />
          </div>
        </section>

        {/* 発信メディア & CTA */}
        <section>
          <SectionHeading label="Follow" title="発信メディア" />
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <a
              href="https://x.com/nara_nara_san"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-5 border border-border/60 rounded-xl hover:shadow-md hover:-translate-y-0.5 transition-all bg-white"
            >
              <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold">X (Twitter)</p>
                <p className="text-sm text-zinc-500">@nara_nara_san</p>
              </div>
            </a>
            <div className="flex items-center gap-4 p-5 border border-border/60 rounded-xl bg-blue-50/50">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shrink-0">
                <span className="text-white text-lg">📝</span>
              </div>
              <div>
                <p className="font-semibold">ブログ</p>
                <p className="text-sm text-zinc-500">このサイト</p>
              </div>
            </div>
          </div>
          <div className="bg-muted border border-border/60 rounded-2xl p-8 text-center">
            <p className="text-zinc-600 mb-4">
              キャリアや転職のリアルな気づきを発信しています。
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://x.com/nara_nara_san"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-zinc-900 text-white font-semibold px-6 py-3 rounded-lg hover:bg-zinc-800 transition-colors text-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Xをフォローする
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 border border-zinc-300 text-zinc-700 font-semibold px-6 py-3 rounded-lg hover:bg-white transition-colors text-sm"
              >
                お問い合わせ
              </Link>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}

/* --- サブコンポーネント --- */

function SectionHeading({ label, title }: { label: string; title: string }) {
  return (
    <div className="mb-10">
      <p className="text-xs font-semibold text-primary tracking-wider uppercase mb-1.5">{label}</p>
      <h2 className="text-2xl font-bold">{title}</h2>
    </div>
  );
}

function PainPoint({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 p-5 bg-zinc-50 border border-border/60 rounded-xl">
      <span className="text-primary mt-0.5 shrink-0">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </span>
      <p className="text-sm text-zinc-700 leading-relaxed">{text}</p>
    </div>
  );
}

function TimelineItem({
  number,
  title,
  role,
  summary,
  current,
  turning,
}: {
  number: string;
  title: string;
  role: string;
  summary: string;
  current?: boolean;
  turning?: boolean;
}) {
  return (
    <div className="flex gap-3 md:gap-5">
      {/* 左のライン */}
      <div className="flex flex-col items-center">
        <div
          className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 text-xs md:text-sm font-bold ${
            current
              ? "bg-primary text-white"
              : turning
                ? "bg-blue-100 text-primary border-2 border-primary"
                : "bg-zinc-100 text-zinc-400 border border-zinc-200"
          }`}
        >
          {number}
        </div>
        <div className="w-px flex-1 bg-zinc-200" />
      </div>

      {/* 右のコンテンツ */}
      <div className="pb-8 pt-1.5 flex-1 min-w-0">
        <h3 className={`font-bold ${current ? "text-primary" : ""}`}>{title}</h3>
        <p className="text-xs text-zinc-400 mt-0.5 mb-2">{role}</p>
        <p className="text-sm text-zinc-600 leading-relaxed">{summary}</p>
        {turning && (
          <p className="text-xs text-primary mt-2 font-medium">
            ※ この転職が大きな転機になった
          </p>
        )}
      </div>
    </div>
  );
}
