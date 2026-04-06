import Image from "next/image";
import Link from "next/link";
import type { ArticleMeta } from "@/lib/articles";

export type ArticleSection = {
  label: string;
  emoji: string;
  slugs: string[];
};

type Props = {
  enLabel: string;
  title: string;
  description: string;
  image: string;
  articles: ArticleMeta[];
  category: string;
  sections?: ArticleSection[];
  featured?: string; // slug of featured article
};

function ArticleCard({
  article,
  category,
  featured = false,
}: {
  article: ArticleMeta;
  category: string;
  featured?: boolean;
}) {
  return (
    <Link
      href={`/${category}/${article.slug}`}
      className={`group block border rounded-xl bg-white hover:shadow-md hover:-translate-y-0.5 transition-all ${
        featured
          ? "border-primary/30 ring-1 ring-primary/10 p-6 md:p-8"
          : "border-border/60 p-6"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          {featured && (
            <span className="inline-block text-xs font-semibold text-primary bg-primary/5 px-2.5 py-1 rounded-full mb-3">
              まず読む
            </span>
          )}
          <p className="text-xs text-zinc-400 mb-2">{article.date}</p>
          <h2
            className={`font-bold mb-2 group-hover:text-primary transition-colors ${
              featured ? "text-xl" : "text-lg"
            }`}
          >
            {article.title}
          </h2>
          <p className="text-sm text-zinc-500 leading-relaxed line-clamp-2">
            {article.description}
          </p>
          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-500"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <svg
          className="w-5 h-5 text-zinc-300 group-hover:text-primary shrink-0 mt-1 transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </Link>
  );
}

export default function CategoryPage({
  enLabel,
  title,
  description,
  image,
  articles,
  category,
  sections,
  featured,
}: Props) {
  const articleMap = new Map(articles.map((a) => [a.slug, a]));

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <Image
          src={image}
          alt={title}
          width={120}
          height={120}
          className="mx-auto mb-4 rounded-xl"
        />
        <p className="text-sm font-semibold text-primary mb-2 tracking-wider uppercase">
          {enLabel}
        </p>
        <h1 className="text-3xl font-bold mb-4">{title}</h1>
        <p className="text-zinc-500">{description}</p>
      </div>

      {articles.length === 0 ? (
        <div className="border border-dashed border-border rounded-xl p-10 text-center text-zinc-400">
          記事を準備中です。お楽しみに。
        </div>
      ) : sections ? (
        <div className="space-y-10">
          {/* Featured article */}
          {featured && articleMap.has(featured) && (
            <div className="mb-4">
              <ArticleCard
                article={articleMap.get(featured)!}
                category={category}
                featured
              />
            </div>
          )}

          {/* Sections */}
          {sections.map((section) => {
            const sectionArticles = section.slugs
              .map((slug) => articleMap.get(slug))
              .filter((a): a is ArticleMeta => a != null);

            if (sectionArticles.length === 0) return null;

            return (
              <div key={section.label}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg">{section.emoji}</span>
                  <h2 className="text-base font-bold text-zinc-700">
                    {section.label}
                  </h2>
                  <div className="flex-1 border-t border-border/60 ml-2" />
                </div>
                <div className="space-y-3">
                  {sectionArticles.map((article) => (
                    <ArticleCard
                      key={article.slug}
                      article={article}
                      category={category}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Flat list (fallback) */
        <div className="space-y-4">
          {articles.map((article) => (
            <ArticleCard
              key={article.slug}
              article={article}
              category={category}
            />
          ))}
        </div>
      )}
    </div>
  );
}
