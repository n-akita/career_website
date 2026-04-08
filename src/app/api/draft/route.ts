import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";

// 下書きを一時保存する（/tmp ディレクトリに JSON ファイルとして保存）
export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.DRAFT_API_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { tweet, url, title } = body;

  if (!tweet || !url) {
    return NextResponse.json(
      { error: "tweet and url are required" },
      { status: 400 }
    );
  }

  const id = randomUUID().slice(0, 8);
  const draft = { id, tweet, url, title, createdAt: new Date().toISOString() };

  const dir = join("/tmp", "x-drafts");
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, `${id}.json`), JSON.stringify(draft));

  return NextResponse.json({ id });
}
