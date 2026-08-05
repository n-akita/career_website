import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type ArticleFaq = { q: string; a: string };

export type Article = {
  slug: string;
  category: string;
  title: string;
  description: string;
  date: string;
  updated: string;
  tags: string[];
  related: string[];
  image: string;
  faq: ArticleFaq[];
  /** 狙いの検索KW。表示には使わず、週次のGSC順位検証（seo-checkup）が参照する */
  targetKeywords: string[];
  readingTime: number;
  content: string;
};

export type ArticleMeta = Omit<Article, "content">;

const contentDir = path.join(process.cwd(), "content");

/** キャリアジャンルのURLプレフィックス（将来 /internet 等の他ジャンルを並設するため） */
export const BLOG_BASE = "/career";

/** キャリアジャンル配下のカテゴリ（/career/<category>/<slug>） */
export const CAREER_CATEGORIES = ["mindset", "tenshoku", "sidejob", "story"] as const;

/** トップ直下に独立ジャンルとして並設するカテゴリ（/<category>/<slug>） */
export const GENRE_CATEGORIES = ["taishoku", "shitsugyo", "shikaku", "coaching", "english", "blog", "sim", "furusato", "kaikei"] as const;

export const CATEGORIES = [...CAREER_CATEGORIES, ...GENRE_CATEGORIES] as const;

export function isGenreCategory(category: string): boolean {
  return (GENRE_CATEGORIES as readonly string[]).includes(category);
}

/** 記事ページのパス（例: /career/tenshoku/jtc-complete-guide、/taishoku/taishoku-daiko-guide） */
export function articlePath(a: { category: string; slug: string }): string {
  return `${categoryPath(a.category)}/${a.slug}`;
}

/** カテゴリ一覧ページのパス（例: /career/tenshoku、/taishoku） */
export function categoryPath(category: string): string {
  return isGenreCategory(category) ? `/${category}` : `${BLOG_BASE}/${category}`;
}

export function getArticlesByCategory(category: string): ArticleMeta[] {
  const dir = path.join(contentDir, category);
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));

  const articles = files.map((file) => {
    const slug = file.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(dir, file), "utf-8");
    const { data, content } = matter(raw);

    return {
      slug,
      category,
      title: (data.title as string) ?? "",
      description: (data.description as string) ?? "",
      date: (data.date as string) ?? "",
      updated: (data.updated as string) ?? "",
      tags: (data.tags as string[]) ?? [],
      related: (data.related as string[]) ?? [],
      image: (data.image as string) ?? "",
      faq: (data.faq as ArticleFaq[]) ?? [],
      targetKeywords: (data.targetKeywords as string[]) ?? [],
      readingTime: Math.max(1, Math.round(content.length / 600)),
    };
  });

  return articles.sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getArticle(category: string, slug: string): Article | null {
  const filePath = path.join(contentDir, category, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    slug,
    category,
    title: (data.title as string) ?? "",
    description: (data.description as string) ?? "",
    date: (data.date as string) ?? "",
    updated: (data.updated as string) ?? "",
    tags: (data.tags as string[]) ?? [],
    related: (data.related as string[]) ?? [],
    image: (data.image as string) ?? "",
    faq: (data.faq as ArticleFaq[]) ?? [],
    targetKeywords: (data.targetKeywords as string[]) ?? [],
    readingTime: Math.max(1, Math.round(content.length / 600)),
    content,
  };
}

export function getAllArticles(): ArticleMeta[] {
  return CATEGORIES.flatMap((cat) => getArticlesByCategory(cat));
}

/**
 * 関連記事を返す。frontmatter の related（"category/slug" 形式）を最優先し、
 * 残りは「共有タグ数×2 + 同カテゴリ+1」のスコアで全カテゴリから補完する。
 */
export function getRelatedArticles(article: ArticleMeta, limit = 4): ArticleMeta[] {
  const all = getAllArticles().filter(
    (a) => !(a.category === article.category && a.slug === article.slug)
  );
  const byKey = new Map(all.map((a) => [`${a.category}/${a.slug}`, a]));

  const pinned = article.related
    .map((key) => byKey.get(key))
    .filter((a): a is ArticleMeta => a != null);

  const pinnedKeys = new Set(pinned.map((a) => `${a.category}/${a.slug}`));
  const tagSet = new Set(article.tags);

  const scored = all
    .filter((a) => !pinnedKeys.has(`${a.category}/${a.slug}`))
    .map((a) => {
      const sharedTags = a.tags.filter((t) => tagSet.has(t)).length;
      const score = sharedTags * 2 + (a.category === article.category ? 1 : 0);
      return { a, score };
    })
    .sort((x, y) => y.score - x.score || (x.a.date > y.a.date ? -1 : 1))
    .map(({ a }) => a);

  return [...pinned, ...scored].slice(0, limit);
}
