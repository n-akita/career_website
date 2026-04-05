import Image from "next/image";
import Link from "next/link";
import { getAllArticles } from "@/lib/articles";

export default function Home() {
  const articles = getAllArticles().slice(0, 6);

  return (
    <>
      {/* ヒーローセクション */}
      <section className="relative min-h-[520px] md:min-h-[600px] flex items-center">
        <Image
          src="/images/hero-city.jpg"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/90 via-zinc-900/75 to-zinc-900/40" />

        <div className="relative max-w-5xl mx-auto px-4 py-20 md:py-28 w-full">
          <p className="text-sm font-semibold text-blue-400 mb-4 tracking-wider">
            CAREER STRATEGY
          </p>
          <h1 className="text-3xl md:text-5xl font-bold leading-[1.2] tracking-tight text-white mb-6 max-w-2xl">
            出世も大事。
            <br />
            でも<span className="text-blue-400">&ldquo;環境を変える&rdquo;</span>だけで
            <br />
            年収は上がる。
          </h1>
          <p className="text-base md:text-lg text-zinc-300 max-w-lg mb-10 leading-relaxed">
            5社の転職で年収3.5倍を実現した「ならなら」が、
            環境を味方につけるキャリア戦略を発信。
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/diagnosis"
              className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-7 py-3.5 rounded-lg hover:bg-primary-dark transition-colors"
            >
              ならなら式転職診断
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-7 py-3.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              ならならについて
            </Link>
          </div>
        </div>
      </section>

      {/* 数字セクション */}
      <section className="border-b border-border/60 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl md:text-3xl font-bold text-primary">3.5倍</p>
            <p className="text-xs md:text-sm text-zinc-400 mt-1">年収アップ</p>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-bold text-primary">5社</p>
            <p className="text-xs md:text-sm text-zinc-400 mt-1">転職経験</p>
          </div>
          <div>
            <p className="text-2xl md:text-3xl font-bold text-primary">10年</p>
            <p className="text-xs md:text-sm text-zinc-400 mt-1">デジマ歴</p>
          </div>
        </div>
      </section>

      {/* カテゴリセクション */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-primary mb-2 tracking-wider uppercase">Contents</p>
          <h2 className="text-3xl font-bold">コンテンツ</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <CategoryCard
            title="キャリアの考え方"
            description="生涯賃金の話、環境を変える選択肢、社内で評価される方法"
            href="/career"
            image="/images/career.png"
          />
          <CategoryCard
            title="転職ノウハウ"
            description="職務経歴書の書き方、面接戦略、年収の上げ方"
            href="/tenshoku"
            image="/images/tenshoku.png"
          />
          <CategoryCard
            title="副業の始め方"
            description="副業の方法、地方DX、本業との両立"
            href="/sidejob"
            image="/images/sidejob.png"
          />
        </div>
      </section>

      {/* 最新記事セクション */}
      {articles.length > 0 && (
        <section className="bg-muted">
          <div className="max-w-5xl mx-auto px-4 py-20">
            <div className="text-center mb-12">
              <p className="text-sm font-semibold text-primary mb-2 tracking-wider uppercase">
                Latest Articles
              </p>
              <h2 className="text-3xl font-bold">最新の記事</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {articles.map((article) => (
                <Link
                  key={`${article.category}/${article.slug}`}
                  href={`/${article.category}/${article.slug}`}
                  className="group block bg-white border border-border/60 rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-2">
                    {article.category === "career"
                      ? "Career"
                      : article.category === "tenshoku"
                      ? "Job Change"
                      : "Side Job"}
                  </p>
                  <h3 className="text-base font-bold mb-2 group-hover:text-primary transition-colors leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-sm text-zinc-500 line-clamp-2">
                    {article.description}
                  </p>
                  <p className="mt-3 text-xs text-zinc-400">{article.date}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 診断CTAセクション */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-5xl mx-auto px-4 py-16 text-center text-white">
          <p className="text-4xl mb-4">🧭</p>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">ならなら式転職診断</h2>
          <p className="text-blue-200 mb-8 max-w-lg mx-auto">
            5つの質問に答えるだけで、あなたに合ったキャリア戦略と
            おすすめの転職サービスがわかります。
          </p>
          <Link
            href="/diagnosis"
            className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-8 py-4 rounded-xl text-lg hover:bg-blue-50 transition-colors"
          >
            無料で診断する
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* メッセージセクション */}
      <section className="relative min-h-[320px] flex items-center">
        <Image
          src="/images/hero-work.jpg"
          alt=""
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-zinc-900/80" />
        <div className="relative max-w-3xl mx-auto px-4 py-20 text-center">
          <p className="text-sm font-semibold text-blue-400 mb-4 tracking-wider uppercase">Message</p>
          <h2 className="text-2xl md:text-3xl font-bold leading-relaxed text-white mb-6">
            「もっと頑張れ」じゃなくて、
            <br />
            <span className="text-blue-400">「場所を変えろ」</span>という戦略。
          </h2>
          <p className="text-zinc-400 leading-relaxed max-w-xl mx-auto">
            同じ能力でも、会社が違えば評価も年収も変わる。
            努力の方向を変えることは逃げじゃない。
            それが「環境ハック」という考え方です。
          </p>
        </div>
      </section>

      {/* CTAセクション */}
      <section className="bg-muted">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <div className="bg-white border border-border/60 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h2 className="text-xl md:text-2xl font-bold mb-3">Xでキャリアの気づきを発信中</h2>
              <p className="text-zinc-500 text-sm leading-relaxed">
                転職やキャリアに関するリアルな気づきを日々ポスト。
                フォローして最新の発信をチェックしてください。
              </p>
            </div>
            <a
              href="https://x.com/nara_nara_san"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-2 bg-zinc-900 text-white font-semibold px-8 py-3.5 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              フォローする
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function CategoryCard({
  title,
  description,
  href,
  image,
}: {
  title: string;
  description: string;
  href: string;
  image: string;
}) {
  return (
    <Link
      href={href}
      className="group block border border-border/60 rounded-2xl overflow-hidden bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      <div className="p-6 flex items-start gap-4">
        <Image
          src={image}
          alt={title}
          width={56}
          height={56}
          className="rounded-lg shrink-0"
        />
        <div>
          <h3 className="text-lg font-bold mb-1">{title}</h3>
          <p className="text-sm text-zinc-500 leading-relaxed">{description}</p>
          <p className="mt-3 text-sm font-semibold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
            読む
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </p>
        </div>
      </div>
    </Link>
  );
}
