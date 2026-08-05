import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/articles";
import { getRelatedArticles, articlePath, isGenreCategory } from "@/lib/articles";
import MarkdownRenderer from "./MarkdownRenderer";
import ReadingProgress from "./ReadingProgress";
import TableOfContents from "./TableOfContents";
import { ArticleJsonLd, BreadcrumbJsonLd, FAQPageJsonLd } from "./JsonLd";
import GenreSubNav from "./GenreSubNav";
import ServiceCTA from "./ServiceCTA";
import { hasLiveAffiliate, SHOW_SERVICE_CTA } from "@/lib/affiliates";

const BASE_URL = "https://nara-career.com";

const categoryImages: Record<string, string> = {
  mindset: "/images/hero-city.jpg",
  tenshoku: "/images/hero-work.jpg",
  sidejob: "/images/hero-photo.jpg",
  story: "/images/hero-work.jpg",
  taishoku: "/images/hero-work.jpg",
  shitsugyo: "/images/hero-city.jpg",
  shikaku: "/images/hero-photo.jpg",
  coaching: "/images/hero-city.jpg",
  english: "/images/hero-work.jpg",
  blog: "/images/hero-photo.jpg",
  furusato: "/images/hero-photo.jpg",
  kaikei: "/images/hero-work.jpg",
};

const categoryLabels: Record<string, { label: string; en: string; href: string }> = {
  mindset: { label: "キャリアの考え方", en: "Career", href: "/career/mindset" },
  tenshoku: { label: "転職ノウハウ", en: "Job Change", href: "/career/tenshoku" },
  sidejob: { label: "副業の始め方", en: "Side Job", href: "/career/sidejob" },
  story: { label: "体験談ストーリー", en: "Story", href: "/career/story" },
  taishoku: { label: "退職のリアル", en: "Resignation", href: "/taishoku" },
  shitsugyo: { label: "失業保険と退職後の手続き", en: "After Resignation", href: "/shitsugyo" },
  shikaku: { label: "資格とリスキリング", en: "Reskilling", href: "/shikaku" },
  coaching: { label: "キャリア相談とコーチング", en: "Coaching", href: "/coaching" },
  english: { label: "ビジネス英語とTOEIC", en: "English", href: "/english" },
  blog: { label: "副業ブログの実験室", en: "Blog", href: "/blog" },
  furusato: { label: "ふるさと納税", en: "Furusato Tax", href: "/furusato" },
  kaikei: { label: "会計ソフトと確定申告", en: "Accounting", href: "/kaikei" },
};

const isStory = (category: string) => category === "story";

/** 独立ジャンルごとの固定導線（ハブ記事CTA） */
const genreConfig: Record<
  string,
  { hubSlug: string; hubTitle: string; hubSub: string }
> = {
  taishoku: {
    hubSlug: "taishoku-daiko-guide",
    hubTitle: "安全な退職代行の選び方 完全ガイドを読む",
    hubSub: "運営形態・料金・選び方の全体像を1本で。迷ったらまずここから",
  },
  shitsugyo: {
    hubSlug: "taishokugo-tetsuduki-list",
    hubTitle: "退職後の手続き 完全ガイドを読む",
    hubSub: "健康保険・年金・失業保険・住民税。順番と期限の全体像を1本で",
  },
  shikaku: {
    hubSlug: "tenshoku-shikaku-guide",
    hubTitle: "転職に効く資格の選び方 完全ガイドを読む",
    hubSub: "資格の選び方・勉強法・給付金の全体像を1本で。迷ったらまずここから",
  },
  coaching: {
    hubSlug: "coaching-erabikata-guide",
    hubTitle: "キャリアコーチングの選び方 完全ガイドを読む",
    hubSub: "料金相場・エージェントとの違い・選び方の全体像を1本で。迷ったらまずここから",
  },
  english: {
    hubSlug: "eigo-career-guide",
    hubTitle: "英語はキャリアの武器になるか 完全ガイドを読む",
    hubSub: "TOEICの目安スコア・学習設計・サービス選びの全体像を1本で。迷ったらまずここから",
  },
  blog: {
    hubSlug: "fukugyou-blog-hajimekata",
    hubTitle: "会社員の副業ブログ 始め方ガイドを読む",
    hubSub: "初期費用・かかる時間・収益化までの現実的な道筋を1本で",
  },
  furusato: {
    hubSlug: "furusato-nouzei-guide",
    hubTitle: "ふるさと納税の始め方 完全ガイドを読む",
    hubSub: "仕組み・限度額・サイト選び・手続きの全体像を1本で。迷ったらまずここから",
  },
  kaikei: {
    hubSlug: "kaikei-soft-erabikata",
    hubTitle: "会計ソフトの選び方 完全ガイドを読む",
    hubSub: "freee・マネーフォワード・弥生の違いと選び方の全体像を1本で。迷ったらまずここから",
  },
};

export default function ArticlePage({ article }: { article: Article }) {
  const cat = categoryLabels[article.category] ?? {
    label: article.category,
    en: article.category,
    href: `/career/${article.category}`,
  };
  const isGenre = isGenreCategory(article.category);
  const genre = genreConfig[article.category];

  const articleUrl = `${BASE_URL}${articlePath(article)}`;
  // 個別画像がない記事は、静的PNG（旧サイト名が焼き込まれている）ではなく
  // タイトル入りのOG画像をその場で生成して使う
  const articleImage = article.image
    ? `${BASE_URL}${article.image}`
    : `${BASE_URL}/api/og/article?title=${encodeURIComponent(article.title)}&category=${article.category}`;
  const shareUrl = encodeURIComponent(articleUrl);

  // 関連記事（frontmatter指定を優先しつつ、タグの近い記事をカテゴリ横断で取得）
  const relatedArticles = getRelatedArticles(article, 4);

  return (
    <>
      {/* 構造化データ */}
      <ArticleJsonLd
        title={article.title}
        description={article.description}
        date={article.date}
        dateModified={article.updated || article.date}
        url={articleUrl}
        image={articleImage}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "トップ", url: BASE_URL },
          ...(isGenre ? [] : [{ name: "キャリア", url: `${BASE_URL}/career` }]),
          { name: cat.label, url: `${BASE_URL}${cat.href}` },
          { name: article.title, url: articleUrl },
        ]}
      />
      {article.faq.length > 0 && (
        <FAQPageJsonLd
          items={article.faq.map((f) => ({ question: f.q, answer: f.a }))}
        />
      )}

      {/* ジャンル内サブナビ */}
      <GenreSubNav category={article.category} currentPath={articlePath(article)} />

      {/* ヒーロー */}
      <section className="bg-zinc-900 text-white relative">
        {/* 背景画像 */}
        <Image
          src={article.image || categoryImages[article.category] || "/images/hero-city.jpg"}
          alt={article.title}
          fill
          className="object-cover opacity-20"
        />
        <div className="relative max-w-3xl mx-auto px-4 pt-10 pb-8 md:pt-12 md:pb-10">
          {/* パンくずリスト */}
          <nav aria-label="パンくずリスト" className="flex items-center gap-1.5 text-xs text-zinc-500 mb-6 flex-wrap">
            <Link href="/" className="hover:text-zinc-300 transition-colors">トップ</Link>
            {!isGenre && (
              <>
                <span>/</span>
                <Link href="/career" className="hover:text-zinc-300 transition-colors">キャリア</Link>
              </>
            )}
            <span>/</span>
            <Link href={cat.href} className="hover:text-zinc-300 transition-colors">{cat.label}</Link>
            <span>/</span>
            <span className="text-zinc-400 truncate max-w-[200px]">{article.title}</span>
          </nav>

          <h1 className="text-2xl md:text-3xl font-bold leading-[1.3] mb-4">
            {article.title}
          </h1>
          <div className="flex items-center gap-4 flex-wrap">
            <p className="text-zinc-400 text-sm">
              {article.date}
              {article.updated && article.updated !== article.date && (
                <span className="ml-2">（更新: {article.updated}）</span>
              )}
            </p>
            <p className="text-zinc-400 text-sm">約{article.readingTime}分で読めます</p>
          </div>
          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-zinc-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 読了プログレスバー */}
      <ReadingProgress />

      {/* 本文 */}
      <article className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        {/* ステマ規制対応: CTA表示ON かつ アフィリリンク稼働中のカテゴリのみ冒頭にPR表記 */}
        {SHOW_SERVICE_CTA && hasLiveAffiliate(article.category) && (
          <p className="text-xs text-zinc-400 mb-6">
            ※本記事にはプロモーション（広告）が含まれます
          </p>
        )}
        <TableOfContents content={article.content} />
        <MarkdownRenderer content={article.content} />

        {/* ジャンル別サービスCTA（affiliates.ts で一元管理） */}
        <ServiceCTA category={article.category} currentPath={articlePath(article)} />

        {/* ストーリー記事の導線：ノウハウ記事へ */}
        {isStory(article.category) && (
          <div className="my-12 bg-muted border border-border/60 rounded-2xl p-6 md:p-8">
            <p className="text-xs font-semibold text-primary tracking-wider uppercase mb-2">
              Related Knowledge
            </p>
            <h3 className="text-lg font-bold mb-3">実践的なノウハウも読む</h3>
            <p className="text-sm text-zinc-500 leading-relaxed mb-5">
              体験談だけでなく、転職を前に進めるための具体的な準備・選考対策もまとめています。
            </p>
            <div className="space-y-3">
              <Link
                href="/career/tenshoku"
                className="flex items-center justify-between p-4 bg-white border border-border/60 rounded-xl hover:shadow-sm transition-all group"
              >
                <div>
                  <p className="font-bold text-sm mb-0.5">転職ノウハウを読む</p>
                  <p className="text-xs text-zinc-500">職務経歴書・面接・エージェントの使い方</p>
                </div>
                <svg className="w-4 h-4 text-zinc-300 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/career/mindset"
                className="flex items-center justify-between p-4 bg-white border border-border/60 rounded-xl hover:shadow-sm transition-all group"
              >
                <div>
                  <p className="font-bold text-sm mb-0.5">キャリアの考え方を読む</p>
                  <p className="text-xs text-zinc-500">環境を変える発想と生涯賃金の話</p>
                </div>
                <svg className="w-4 h-4 text-zinc-300 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        )}

        {/* シェアボタン */}
        <div className="my-10 flex items-center gap-3 flex-wrap">
          <span className="text-sm font-semibold text-zinc-500">Share</span>
          <a
            href={`https://b.hatena.ne.jp/entry/${articleUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-[#00A4DE] text-white text-xs font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity min-w-[44px] justify-center"
            aria-label="はてなブックマークに追加する"
          >
            B!
          </a>
          <a
            href={`https://social-plugins.line.me/lineit/share?url=${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-[#06C755] text-white text-xs font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
            aria-label="LINEでシェアする"
          >
            LINE
          </a>
        </div>

        {/* 関連記事 */}
        {relatedArticles.length > 0 && (
          <div className="my-12 border-t border-border/60 pt-10">
            <h3 className="text-lg font-bold mb-6">あわせて読みたい</h3>
            <div className="space-y-3">
              {relatedArticles.map((a) => (
                <Link
                  key={`${a.category}/${a.slug}`}
                  href={articlePath(a)}
                  className="group flex items-start gap-3 p-4 border border-border/60 rounded-xl bg-white hover:shadow-sm hover:-translate-y-0.5 transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold group-hover:text-primary transition-colors leading-snug">
                      {a.title}
                    </p>
                    <p className="text-xs text-zinc-400 mt-1">{a.date}</p>
                  </div>
                  <svg
                    className="w-4 h-4 text-zinc-300 group-hover:text-primary shrink-0 mt-1 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ハブ記事への固定導線（ジャンルごとに出し分け） */}
        {genre
          ? article.slug !== genre.hubSlug && (
              <div className="my-10">
                <Link
                  href={`/${article.category}/${genre.hubSlug}`}
                  className="group flex items-center justify-between gap-4 p-5 bg-muted border border-border/60 rounded-2xl hover:shadow-sm transition-all"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-primary tracking-wider uppercase mb-1">
                      Complete Guide
                    </p>
                    <p className="font-bold text-sm md:text-base leading-snug">
                      {genre.hubTitle}
                    </p>
                    <p className="text-xs text-zinc-500 mt-1">
                      {genre.hubSub}
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-zinc-300 group-hover:text-primary shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            )
          : !(article.category === "tenshoku" && article.slug === "jtc-complete-guide") && (
              <div className="my-10">
                <Link
                  href="/career/tenshoku/jtc-complete-guide"
                  className="group flex items-center justify-between gap-4 p-5 bg-muted border border-border/60 rounded-2xl hover:shadow-sm transition-all"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-primary tracking-wider uppercase mb-1">
                      Complete Guide
                    </p>
                    <p className="font-bold text-sm md:text-base leading-snug">
                      ベンチャーから大手への転職 完全ガイドを読む
                    </p>
                    <p className="text-xs text-zinc-500 mt-1">
                      転職活動の全体像を1本で。迷ったらまずここから
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-zinc-300 group-hover:text-primary shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            )}

        {/* フッターCTA */}
        <div className="mt-12 pt-8 border-t border-border/60 space-y-6">
          {/* フラッグシップ記事CTA（story・独立ジャンル・career-story自身では非表示） */}
          {!isStory(article.category) &&
            !isGenre &&
            !(article.category === "mindset" && article.slug === "career-story") && (
            <Link
              href="/career/mindset/career-story"
              className="block bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 md:p-8 text-white text-center hover:from-blue-700 hover:to-indigo-700 transition-all group"
            >
              <p className="text-2xl mb-2">📖</p>
              <p className="font-bold text-lg mb-1">年収400万→3.5倍。5回転職した僕の全記録</p>
              <p className="text-blue-200 text-sm mb-4">
                「場所を変えるだけで年収は上がる」——このサイトの原点になった話
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-semibold border border-white/30 px-5 py-2 rounded-lg group-hover:bg-white/10 transition-colors">
                全記録を読む
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
          )}

          {/* 著者プロフィール */}
          <div className="bg-muted border border-border/60 rounded-2xl p-6 md:p-8">
            <div className="flex items-start gap-4">
              <Image
                src="/images/avatar.png"
                alt="ならなら"
                width={56}
                height={56}
                className="rounded-full shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold">ならなら</p>
                </div>
                <p className="text-sm text-zinc-500 leading-relaxed mb-3">
                  デジタルマーケティング歴10年。5社の転職で年収3.5倍を実現。
                  「出世しなくても環境を変えるだけで年収は上がる」をテーマに発信中。
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={cat.href}
                    className="inline-flex items-center gap-1.5 border border-zinc-300 text-zinc-600 font-semibold px-4 py-2 rounded-lg hover:bg-white transition-colors text-xs"
                  >
                    {cat.label}の記事一覧へ
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
