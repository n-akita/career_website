import Image from "next/image";
import Link from "next/link";
import { getAllArticles, getArticle } from "@/lib/articles";
import { FAQPageJsonLd } from "@/components/JsonLd";

const PICK_SLUGS: { category: string; slug: string }[] = [
  { category: "career", slug: "dx-talent-salary" },
  { category: "tenshoku", slug: "jtc-regret-checklist" },
  { category: "career", slug: "venture-vs-enterprise-reality" },
  { category: "tenshoku", slug: "job-change-count" },
  { category: "sidejob", slug: "how-to-start-sidejob" },
  { category: "career", slug: "two-billion-yen-night" },
];

export default function Home() {
  const articles = getAllArticles().slice(0, 6);
  const pickedArticles = PICK_SLUGS
    .map(({ category, slug }) => getArticle(category, slug))
    .filter((a): a is NonNullable<typeof a> => a !== null);

  return (
    <>
      <FAQPageJsonLd
        items={[
          {
            question: "転職で年収を上げるにはどうすればいい？",
            answer: "出世だけが年収アップの手段ではありません。同じスキルでも業界・企業規模を変えるだけで年収が大きく変わります。当サイトでは5回の転職で年収3.5倍を実現した実体験をもとに、環境を変えるキャリア戦略を解説しています。",
          },
          {
            question: "ベンチャーから大手企業（JTC）への転職は可能？",
            answer: "可能です。実際に運営者はベンチャー企業から大手通信会社、大手損害保険会社へ転職しています。職務経歴書の書き方や面接戦略など、具体的なノウハウを転職ノウハウカテゴリで解説しています。",
          },
          {
            question: "転職回数が多いと不利になる？",
            answer: "転職回数が多いこと自体が不利になるとは限りません。大切なのは各社での経験をどうストーリー化するかです。5回の転職経験を持つ運営者が、転職回数の伝え方を詳しく解説しています。",
          },
        ]}
      />
      {/* ヒーローセクション */}
      <section className="relative min-h-[480px] md:min-h-[620px] flex items-center overflow-hidden">
        <Image
          src="/images/hero-city.jpg"
          alt="都市のビジネス街の風景"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/95 via-zinc-900/80 to-zinc-900/30" />

        {/* 装飾パーティクル */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-float hidden md:block" />
        <div className="absolute bottom-10 right-40 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl animate-float-delay hidden md:block" />

        <div className="relative max-w-5xl mx-auto px-4 py-20 md:py-28 w-full">
          <div className="animate-fade-in-up">
            <p className="text-sm font-semibold text-blue-400 mb-4 tracking-wider flex items-center gap-2">
              <span className="w-8 h-px bg-blue-400" />
              CAREER STRATEGY
            </p>
            <h1 className="text-3xl md:text-5xl font-bold leading-[1.25] tracking-tight text-white mb-6 max-w-2xl">
              <span className="inline-block">出世も大事。</span>
              <span className="inline-block">でも<span className="text-blue-400">&ldquo;環境を変える&rdquo;</span>だけで</span>
              <span className="inline-block">年収は上がる。</span>
            </h1>
          </div>
          <p className="text-base md:text-lg text-zinc-300 max-w-lg mb-10 leading-relaxed animate-fade-in-up-delay">
            5社の転職で年収3.5倍を実現した「ならなら」が、
            環境を味方につけるキャリア戦略を発信。
          </p>
          <div className="flex flex-wrap gap-4 animate-fade-in-up-delay-2">
            <Link
              href="/diagnosis"
              className="group inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-blue-500 transition-all hover:shadow-lg hover:shadow-blue-600/25"
            >
              ならなら式転職診断
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-white/10 transition-all backdrop-blur-sm"
            >
              ならならについて
            </Link>
          </div>
        </div>
      </section>

      {/* こんな人に読んでほしい */}
      <section className="bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-5xl mx-auto px-4 py-12 md:py-16">
          <p className="text-sm font-semibold text-blue-400 mb-6 tracking-wider flex items-center gap-2">
            <span className="w-8 h-px bg-blue-400" />
            FOR YOU
          </p>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-8">こんな人に読んでほしい</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <TargetItem text="30代前後で、年収に不満があるけど転職に踏み出せない人" />
            <TargetItem text="ベンチャーで消耗していて、大手への転職を考えている人" />
            <TargetItem text="DX・デジタルマーケ領域でキャリアアップしたい人" />
            <TargetItem text="出世コースに乗れなくても、環境を変えて年収を上げたい人" />
          </div>
        </div>
      </section>

      {/* 数字セクション - デザイン強化 */}
      <section className="relative bg-white border-b border-border/60">
        <div className="max-w-5xl mx-auto px-4 py-12 md:py-14">
          <div className="grid grid-cols-3 gap-4 md:gap-8">
            <StatCard number="3.5" unit="倍" label="年収アップ" icon="📈" />
            <StatCard number="5" unit="社" label="転職経験" icon="🏢" />
            <StatCard number="10" unit="年" label="デジマ歴" icon="💼" />
          </div>
        </div>
      </section>

      {/* カテゴリセクション - デザイン強化 */}
      <section className="max-w-5xl mx-auto px-4 py-20 md:py-24">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-primary mb-2 tracking-wider uppercase flex items-center justify-center gap-3">
            <span className="w-8 h-px bg-primary/40" />
            Contents
            <span className="w-8 h-px bg-primary/40" />
          </p>
          <h2 className="text-3xl font-bold">コンテンツ</h2>
          <p className="text-zinc-500 mt-3 text-sm">あなたのキャリアを次のステージへ導くための3つのテーマ</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <CategoryCard
            title="キャリアの考え方"
            description="生涯賃金の話、環境を変える選択肢、社内で評価される方法"
            href="/career"
            image="/images/career.png"
            accent="blue"
            articleCount="6"
          />
          <CategoryCard
            title="転職ノウハウ"
            description="職務経歴書の書き方、面接戦略、年収の上げ方"
            href="/tenshoku"
            image="/images/tenshoku.png"
            accent="indigo"
            articleCount="12"
          />
          <CategoryCard
            title="副業の始め方"
            description="副業の方法、地方DX、本業との両立"
            href="/sidejob"
            image="/images/sidejob.png"
            accent="emerald"
            articleCount="1"
          />
          <CategoryCard
            title="体験談ストーリー"
            description="建前を外した、ならならのキャリア一次情報"
            href="/story"
            image="/images/career_story_hero.png"
            accent="amber"
            articleCount="2"
          />
        </div>
      </section>

      {/* 最新記事セクション - デザイン強化 */}
      {articles.length > 0 && (
        <section className="bg-muted">
          <div className="max-w-5xl mx-auto px-4 py-20 md:py-24">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
              <div>
                <p className="text-sm font-semibold text-primary mb-2 tracking-wider uppercase">
                  Latest Articles
                </p>
                <h2 className="text-3xl font-bold">最新の記事</h2>
              </div>
              <Link
                href="/search"
                className="text-sm text-primary font-semibold hover:underline flex items-center gap-1"
              >
                すべての記事を見る
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {articles.map((article, index) => (
                <Link
                  key={`${article.category}/${article.slug}`}
                  href={`/${article.category}/${article.slug}`}
                  className={`group block bg-white border border-border/60 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${
                    index === 0 ? "md:col-span-2" : ""
                  }`}
                >
                  <div className={`p-6 ${index === 0 ? "md:p-8" : ""}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        article.category === "career"
                          ? "bg-blue-50 text-blue-600"
                          : article.category === "tenshoku"
                          ? "bg-indigo-50 text-indigo-600"
                          : article.category === "sidejob"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-amber-50 text-amber-700"
                      }`}>
                        {article.category === "career"
                          ? "Career"
                          : article.category === "tenshoku"
                          ? "Job Change"
                          : article.category === "sidejob"
                          ? "Side Job"
                          : "Story"}
                      </span>
                      <span className="text-xs text-zinc-400">
                        {article.date} · 約{article.readingTime}分
                      </span>
                    </div>
                    <h3 className={`font-bold mb-2 group-hover:text-primary transition-colors leading-snug ${
                      index === 0 ? "text-lg md:text-xl" : "text-base"
                    }`}>
                      {article.title}
                    </h3>
                    <p className="text-sm text-zinc-500 line-clamp-2">
                      {article.description}
                    </p>
                    <p className="mt-4 text-sm font-semibold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                      続きを読む
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ピックアップ記事セクション（内部リンク強化・SEO） */}
      {pickedArticles.length > 0 && (
        <section className="bg-white border-b border-border/60">
          <div className="max-w-5xl mx-auto px-4 py-16 md:py-20">
            <div className="mb-10">
              <p className="text-sm font-semibold text-primary mb-2 tracking-wider uppercase">
                Pick Up
              </p>
              <h2 className="text-2xl md:text-3xl font-bold">読まれているテーマから探す</h2>
              <p className="text-zinc-500 mt-2 text-sm">
                年収・転職回数・JTC・ベンチャーなど、よく読まれている記事をピックアップ。
              </p>
            </div>
            <ul className="grid md:grid-cols-2 gap-x-8 gap-y-3">
              {pickedArticles.map((a) => (
                <li key={`${a.category}/${a.slug}`}>
                  <Link
                    href={`/${a.category}/${a.slug}`}
                    className="group flex items-start gap-3 py-3 border-b border-border/60 hover:border-primary/40 transition-colors"
                  >
                    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded mt-1 shrink-0 ${
                      a.category === "career"
                        ? "bg-blue-50 text-blue-600"
                        : a.category === "tenshoku"
                        ? "bg-indigo-50 text-indigo-600"
                        : a.category === "sidejob"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-amber-50 text-amber-700"
                    }`}>
                      {a.category}
                    </span>
                    <p className="text-sm font-semibold text-zinc-700 group-hover:text-primary transition-colors leading-snug">
                      {a.title}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* 診断CTAセクション - デザイン強化 */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-300 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 py-20 text-center text-white">
          <p className="text-5xl mb-5">🧭</p>
          <h2 className="text-2xl md:text-4xl font-bold mb-4">ならなら式転職診断</h2>
          <p className="text-blue-200 mb-3 max-w-lg mx-auto leading-relaxed">
            5つの質問に答えるだけで、あなたに合ったキャリア戦略と
            おすすめの転職サービスがわかります。
          </p>
          <p className="text-blue-300 text-sm mb-8">
            所要時間：約30秒 ・ 完全無料
          </p>
          <Link
            href="/diagnosis"
            className="group inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-10 py-4.5 rounded-xl text-lg hover:bg-blue-50 transition-all hover:shadow-xl hover:shadow-black/10"
          >
            無料で診断する
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* メッセージセクション */}
      <section className="relative min-h-[360px] flex items-center">
        <Image
          src="/images/hero-work.jpg"
          alt="仕事をしている会社員の風景"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-zinc-900/85" />
        <div className="relative max-w-3xl mx-auto px-4 py-20 text-center">
          <p className="text-sm font-semibold text-blue-400 mb-6 tracking-wider uppercase flex items-center justify-center gap-3">
            <span className="w-8 h-px bg-blue-400/50" />
            Message
            <span className="w-8 h-px bg-blue-400/50" />
          </p>
          <h2 className="text-2xl md:text-4xl font-bold leading-relaxed text-white mb-6">
            「もっと頑張れ」じゃなくて、
            <br />
            <span className="text-blue-400">「場所を変えろ」</span>という戦略。
          </h2>
          <p className="text-zinc-400 leading-relaxed max-w-xl mx-auto text-base">
            同じ能力でも、会社が違えば評価も年収も変わる。
            <br className="hidden md:block" />
            努力の方向を変えることは逃げじゃない。
            <br className="hidden md:block" />
            それが「環境ハック」という考え方です。
          </p>
        </div>
      </section>

      {/* Xフォロー＋コンタクトセクション */}
      <section className="bg-muted">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <div className="bg-white border border-border/60 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </div>
                <h2 className="text-xl md:text-2xl font-bold">Xでキャリアの気づきを発信中</h2>
              </div>
              <p className="text-zinc-500 text-sm leading-relaxed">
                転職やキャリアに関するリアルな気づきを日々ポスト。
                フォローして最新の発信をチェックしてください。
              </p>
            </div>
            <a
              href="https://x.com/nara_nara_san"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-2 bg-zinc-900 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-zinc-800 transition-all hover:shadow-lg"
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

/* --- サブコンポーネント --- */

function TargetItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
      <svg className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      <p className="text-sm text-zinc-300 leading-relaxed">{text}</p>
    </div>
  );
}

function StatCard({
  number,
  unit,
  label,
  icon,
}: {
  number: string;
  unit: string;
  label: string;
  icon: string;
}) {
  return (
    <div className="text-center group">
      <p className="text-2xl md:text-3xl mb-1">{icon}</p>
      <p className="text-3xl md:text-4xl font-bold text-primary leading-none">
        {number}
        <span className="text-lg md:text-xl font-semibold text-zinc-600">{unit}</span>
      </p>
      <p className="text-xs md:text-sm text-zinc-400 mt-2">{label}</p>
    </div>
  );
}

function CategoryCard({
  title,
  description,
  href,
  image,
  accent,
  articleCount,
}: {
  title: string;
  description: string;
  href: string;
  image: string;
  accent: "blue" | "indigo" | "emerald" | "amber";
  articleCount: string;
}) {
  const accentStyles = {
    blue: "group-hover:border-blue-200 group-hover:shadow-blue-100/50",
    indigo: "group-hover:border-indigo-200 group-hover:shadow-indigo-100/50",
    emerald: "group-hover:border-emerald-200 group-hover:shadow-emerald-100/50",
    amber: "group-hover:border-amber-200 group-hover:shadow-amber-100/50",
  };

  return (
    <Link
      href={href}
      className={`group block border border-border/60 rounded-2xl overflow-hidden bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${accentStyles[accent]}`}
    >
      <div className="p-6 md:p-7">
        <div className="flex items-start gap-4 mb-4">
          <Image
            src={image}
            alt={title}
            width={56}
            height={56}
            className="rounded-xl shrink-0"
          />
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-1">{title}</h3>
            <p className="text-xs text-zinc-400">{articleCount}記事</p>
          </div>
        </div>
        <p className="text-sm text-zinc-500 leading-relaxed mb-4">{description}</p>
        <p className="text-sm font-semibold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
          {title}の記事を読む
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </p>
      </div>
    </Link>
  );
}
