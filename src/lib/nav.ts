// グローバルナビの表示設定。
// 注意: articles.ts は fs/path を使うサーバー専用モジュールのため、
// クライアントコンポーネント（Header/Footer）から import できない。
// ここはクライアント安全な「表示名 + パス」だけを持つ独立モジュールにしている。
// パスの正本ロジックは articles.ts の categoryPath() 側にあり、本ファイルはそれと整合させる。

export type NavChild = { label: string; href: string; emoji: string };
export type NavItem = {
  label: string;
  href: string;
  emoji: string;
  children?: NavChild[];
};

/** カテゴリ slug → 日本語表示名（Header/Footer/トップで共有） */
export const CATEGORY_LABELS: Record<string, string> = {
  mindset: "キャリアの考え方",
  tenshoku: "転職ノウハウ",
  sidejob: "副業の始め方",
  story: "体験談",
  taishoku: "退職代行",
  shikaku: "資格・学び直し",
  coaching: "キャリア相談",
  english: "ビジネス英語",
  furusato: "ふるさと納税",
  kaikei: "会計・確定申告",
};

/** カテゴリ slug → アイコン絵文字（トップページのカードと揃える） */
export const CATEGORY_EMOJI: Record<string, string> = {
  mindset: "💡",
  tenshoku: "📝",
  sidejob: "💼",
  story: "📖",
  taishoku: "🚪",
  shikaku: "📚",
  coaching: "🧭",
  english: "🌐",
  furusato: "🎁",
  kaikei: "🧾",
};

/** アンブレラ型グローバルナビ。キャリアは4サブカテゴリを子に持つ。 */
export const GLOBAL_NAV: NavItem[] = [
  {
    label: "キャリア・転職",
    href: "/career",
    emoji: "🏢",
    children: [
      { label: CATEGORY_LABELS.mindset, href: "/career/mindset", emoji: CATEGORY_EMOJI.mindset },
      { label: CATEGORY_LABELS.tenshoku, href: "/career/tenshoku", emoji: CATEGORY_EMOJI.tenshoku },
      { label: CATEGORY_LABELS.sidejob, href: "/career/sidejob", emoji: CATEGORY_EMOJI.sidejob },
      { label: CATEGORY_LABELS.story, href: "/career/story", emoji: CATEGORY_EMOJI.story },
    ],
  },
  { label: CATEGORY_LABELS.taishoku, href: "/taishoku", emoji: CATEGORY_EMOJI.taishoku },
  { label: CATEGORY_LABELS.shikaku, href: "/shikaku", emoji: CATEGORY_EMOJI.shikaku },
  { label: CATEGORY_LABELS.coaching, href: "/coaching", emoji: CATEGORY_EMOJI.coaching },
  { label: CATEGORY_LABELS.english, href: "/english", emoji: CATEGORY_EMOJI.english },
  {
    label: "お金と税金",
    href: "/kaikei",
    emoji: "💰",
    children: [
      { label: CATEGORY_LABELS.furusato, href: "/furusato", emoji: CATEGORY_EMOJI.furusato },
      { label: CATEGORY_LABELS.kaikei, href: "/kaikei", emoji: CATEGORY_EMOJI.kaikei },
    ],
  },
];

/** 現在のパスがナビ項目（またはその子）に属するか */
export function isNavItemActive(pathname: string, item: NavItem): boolean {
  const matches = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);
  if (matches(item.href)) return true;
  return item.children?.some((c) => matches(c.href)) ?? false;
}
