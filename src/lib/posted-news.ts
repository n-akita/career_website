const GITHUB_REPO = "n-akita/career_website";
const GITHUB_FILE = "posted_news.json";

export async function getPostedTitles(): Promise<string[]> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE}`,
      { headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    const content = Buffer.from(data.content, "base64").toString("utf-8");
    return JSON.parse(content);
  } catch {
    return [];
  }
}

export async function savePostedTitle(title: string): Promise<void> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE}`,
      { headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } }
    );
    const data = await res.json();
    const sha = data.sha;
    const current: string[] = res.ok
      ? JSON.parse(Buffer.from(data.content, "base64").toString("utf-8"))
      : [];

    current.push(title);
    const updated = current.slice(-200);

    await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Add posted news: ${title.substring(0, 50)}`,
          content: Buffer.from(JSON.stringify(updated, null, 2)).toString("base64"),
          sha,
        }),
      }
    );
  } catch (err) {
    console.error("Failed to save posted title:", err);
  }
}

export function normalizeTitle(title: string): string {
  return title.replace(/ - [^-]+$/, "").trim().replace(/\s+/g, " ");
}
