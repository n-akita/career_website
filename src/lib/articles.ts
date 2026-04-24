import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type Article = {
  slug: string;
  category: string;
  title: string;
  description: string;
  date: string;
  updated: string;
  tags: string[];
  image: string;
  readingTime: number;
  content: string;
};

export type ArticleMeta = Omit<Article, "content">;

const contentDir = path.join(process.cwd(), "content");

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
      image: (data.image as string) ?? "",
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
    image: (data.image as string) ?? "",
    readingTime: Math.max(1, Math.round(content.length / 600)),
    content,
  };
}

export function getAllArticles(): ArticleMeta[] {
  const categories = ["career", "tenshoku", "sidejob", "story"];
  return categories.flatMap((cat) => getArticlesByCategory(cat));
}
