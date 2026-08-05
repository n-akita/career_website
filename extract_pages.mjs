import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join } from 'node:path';

const CONTENT = 'content';
const BASE = 'https://nara-career.com';
const careerCats = new Set(['mindset', 'sidejob', 'story', 'tenshoku']);

function fm(text) {
  const m = text.match(/^﻿?---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  const out = {};
  for (const line of m[1].split(/\r?\n/)) {
    const mm = line.match(/^(\w+):\s*(.*)$/);
    if (mm) out[mm[1]] = mm[2].replace(/\r$/, '').replace(/^['"]|['"]$/g, '').trim();
  }
  return out;
}

function gitDates(file) {
  let commits = 0, first = '', last = '';
  try {
    const log = execSync(`git log --follow --format=%ad --date=short -- "${file}"`, { encoding: 'utf8' })
      .trim().split('\n').filter(Boolean);
    commits = log.length;
    last = log[0] || '';
    first = log[log.length - 1] || '';
  } catch {}
  return { commits, first, last };
}

const rows = [];

// ---- articles ----
for (const cat of readdirSync(CONTENT)) {
  if (cat === 'x-posts') continue;
  const dir = join(CONTENT, cat);
  if (!statSync(dir).isDirectory()) continue;
  for (const f of readdirSync(dir)) {
    if (!f.endsWith('.md')) continue;
    const slug = f.replace(/\.md$/, '');
    const file = join(dir, f);
    const meta = fm(readFileSync(file, 'utf8'));
    const g = gitDates(file);
    const url = careerCats.has(cat)
      ? `${BASE}/career/${cat}/${slug}`
      : `${BASE}/${cat}/${slug}`;
    rows.push({
      type: '記事', category: cat, title: meta.title || '', slug, url,
      date: meta.date || g.first, updated: meta.updated || '',
      updateCount: Math.max(0, g.commits - 1),
    });
  }
}

// ---- index / fixed pages (path within app router -> url, category, label) ----
const INDEX = [
  ['src/app/page.tsx', '/', '共通', 'トップページ'],
  ['src/app/about/page.tsx', '/about', '共通', '運営者について'],
  ['src/app/contact/page.tsx', '/contact', '共通', 'お問い合わせ'],
  ['src/app/search/page.tsx', '/search', '共通', 'サイト内検索'],
  ['src/app/privacy/page.tsx', '/privacy', '共通', 'プライバシーポリシー'],
  ['src/app/disclaimer/page.tsx', '/disclaimer', '共通', '免責事項'],
  ['src/app/career/page.tsx', '/career', 'career', 'キャリアトップ(ハブ)'],
  ['src/app/career/diagnosis/page.tsx', '/career/diagnosis', 'career', 'キャリア診断ツール'],
  ['src/app/shitsugyo/page.tsx', '/shitsugyo', 'shitsugyo', '失業保険・退職後手続き 記事一覧'],
  ['src/app/blog/page.tsx', '/blog', 'blog', '副業ブログ 記事一覧'],
  ['src/app/sim/page.tsx', '/sim', 'sim', 'スマホ・通信費 記事一覧'],
  ['src/app/hikari/page.tsx', '/hikari', 'hikari', '光回線 記事一覧'],
  ['src/app/denki/page.tsx', '/denki', 'denki', '電気・ガス 記事一覧'],
  ['src/app/career/tenshoku/page.tsx', '/career/tenshoku', 'tenshoku', '転職 記事一覧'],
  ['src/app/career/mindset/page.tsx', '/career/mindset', 'mindset', 'マインドセット 記事一覧'],
  ['src/app/career/story/page.tsx', '/career/story', 'story', 'ストーリー 記事一覧'],
  ['src/app/career/sidejob/page.tsx', '/career/sidejob', 'sidejob', '副業 記事一覧'],
  ['src/app/taishoku/page.tsx', '/taishoku', 'taishoku', '退職 記事一覧'],
  ['src/app/shikaku/page.tsx', '/shikaku', 'shikaku', '資格 記事一覧'],
  ['src/app/coaching/page.tsx', '/coaching', 'coaching', 'コーチング 記事一覧'],
  ['src/app/english/page.tsx', '/english', 'english', '英語学習 記事一覧'],
  ['src/app/kaikei/page.tsx', '/kaikei', 'kaikei', '会計 記事一覧'],
  ['src/app/furusato/page.tsx', '/furusato', 'furusato', 'ふるさと納税 記事一覧'],
];
for (const [file, path, cat, label] of INDEX) {
  if (!existsSync(file)) continue;
  const g = gitDates(file);
  rows.push({
    type: 'インデックス', category: cat, title: label, slug: path, url: BASE + path,
    date: g.first, updated: g.last, updateCount: Math.max(0, g.commits - 1),
  });
}

console.log(JSON.stringify(rows, null, 2));
