import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/articles";
import { getArticlesByCategory } from "@/lib/articles";
import MarkdownRenderer from "./MarkdownRenderer";
import ServiceCTA from "./ServiceCTA";
import { ArticleJsonLd, BreadcrumbJsonLd } from "./JsonLd";

const BASE_URL = "https://nara-career.com";

const categoryImages: Record<string, string> = {
  career: "/images/hero-city.jpg",
  tenshoku: "/images/hero-work.jpg",
  sidejob: "/images/hero-photo.jpg",
};

const categoryLabels: Record<string, { label: string; en: string; href: string }> = {
  career: { label: "キャリアの考え方", en: "Career", href: "/career" },
  tenshoku: { label: "転職ノウハウ", en: "Job Change", href: "/tenshoku" },
  sidejob: { label: "副業の始め方", en: "Side Job", href: "/sidejob" },
};

const categoryServices: Record<string, string[]> = {
  career: ["doda", "jac", "bizreach"],
  tenshoku: ["doda", "jac", "bizreach"],
  sidejob: ["bizreach", "visasq"],
};

const categoryCtaHeadings: Record<string, string> = {
  career: "僕が実際に使った転職サービス",
  tenshoku: "この記事で紹介した転職サービス",
  sidejob: "副業を始めるならこのサービス",
};

export default function ArticlePage({ article }: { article: Article }) {
  const cat = categoryLabels[article.category] ?? {
    label: article.category,
    en: article.category,
    href: `/${article.category}`,
  };

  const serviceIds = categoryServices[article.category] ?? ["doda", "bizreach"];
  const articleUrl = `${BASE_URL}/${article.category}/${article.slug}`;
  const shareText = encodeURIComponent(`${article.title}\n`);
  const shareUrl = encodeURIComponent(articleUrl);

  // 関連記事（同カテゴリから自分以外を最大3件）
  const relatedArticles = getArticlesByCategory(article.category)
    .filter((a) => a.slug !== article.slug)
    .slice(0, 3);

  return (
    <>
      {/* 構造化データ */}
      <ArticleJsonLd
        title={article.title}
        description={article.description}
        date={article.date}
        url={articleUrl}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "トップ", url: BASE_URL },
          { name: cat.label, url: `${BASE_URL}${cat.href}` },
          { name: article.title, url: articleUrl },
        ]}
      />

      {/* ヒーロー */}
      <section className="bg-zinc-900 text-white relative">
        {/* 背景画像 */}
        <Image
          src={article.image || categoryImages[article.category] || "/images/hero-city.jpg"}
          alt=""
          fill
          className="object-cover opacity-20"
        />
        <div className="relative max-w-3xl mx-auto px-4 pt-16 pb-12">
          {/* パンくずリスト */}
          <nav className="flex items-center gap-1.5 text-xs text-zinc-500 mb-6 flex-wrap">
            <Link href="/" className="hover:text-zinc-300 transition-colors">トップ</Link>
            <span>/</span>
            <Link href={cat.href} className="hover:text-zinc-300 transition-colors">{cat.label}</Link>
            <span>/</span>
            <span className="text-zinc-400 truncate max-w-[200px]">{article.title}</span>
          </nav>

          <h1 className="text-2xl md:text-4xl font-bold leading-[1.3] mb-6">
            {article.title}
          </h1>
          <div className="flex items-center gap-4 flex-wrap">
            <p className="text-zinc-400 text-sm">{article.date}</p>
            {/* 広告表記 */}
            <span className="text-xs text-zinc-600 border border-zinc-700 px-2 py-0.5 rounded">
              PR・広告を含みます
            </span>
          </div>
          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
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

      {/* 本文 */}
      <article className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <MarkdownRenderer content={article.content} />

        {/* サービスCTA */}
        <ServiceCTA
          serviceIds={serviceIds}
          heading={categoryCtaHeadings[article.category]}
        />

        {/* シェアボタン */}
        <div className="my-10 flex items-center gap-3 flex-wrap">
          <span className="text-sm font-semibold text-zinc-500">Share</span>
          <a
            href={`https://x.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-zinc-900 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Xでシェア
          </a>
          <a
            href={`https://b.hatena.ne.jp/entry/${articleUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-[#00A4DE] text-white text-xs font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity min-w-[44px] justify-center"
          >
            B!
          </a>
          <a
            href={`https://social-plugins.line.me/lineit/share?url=${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-[#06C755] text-white text-xs font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
          >
            LINE
          </a>
        </div>

        {/* 関連記事 */}
        {relatedArticles.length > 0 && (
          <div className="my-12 border-t border-border/60 pt-10">
            <h3 className="text-lg font-bold mb-6">同じカテゴリの記事</h3>
            <div className="space-y-3">
              {relatedArticles.map((a) => (
                <Link
                  key={a.slug}
                  href={`/${a.category}/${a.slug}`}
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

        {/* フッターCTA */}
        <div className="mt-12 pt-8 border-t border-border/60 space-y-6">
          {/* 診断CTA */}
          <Link
            href="/diagnosis"
            className="block bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 md:p-8 text-white text-center hover:from-blue-700 hover:to-indigo-700 transition-all group"
          >
            <p className="text-2xl mb-2">🧭</p>
            <p className="font-bold text-lg mb-1">ならなら式転職診断</p>
            <p className="text-blue-200 text-sm mb-4">
              5つの質問であなたに合ったキャリア戦略がわかる
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-semibold border border-white/30 px-5 py-2 rounded-lg group-hover:bg-white/10 transition-colors">
              無料で診断する
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </Link>

          {/* X + カテゴリ */}
          <div className="bg-muted border border-border/60 rounded-2xl p-8 text-center">
            <p className="font-bold text-lg mb-2">キャリアの気づきを発信中</p>
            <p className="text-zinc-500 text-sm mb-6">
              Xではリアルタイムで転職やキャリアの話をしています。
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
                href={cat.href}
                className="inline-flex items-center gap-2 border border-zinc-300 text-zinc-700 font-semibold px-6 py-3 rounded-lg hover:bg-white transition-colors text-sm"
              >
                {cat.label}の記事一覧へ
              </Link>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
