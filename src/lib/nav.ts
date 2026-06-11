// グローバルナビの表示設定。
// 注意: articles.ts は fs/path を使うサーバー専用モジュールのため、
// クライアントコンポーネント（Header/Footer）から import できない。
// ここはクライアント安全な「表示名 + パス」だけを持つ独立モジュールにしている。
// パスの正本ロジックは articles.ts の categoryPath() 側にあり、本ファイルはそれと整合させる。

export type NavChild = { label: string; href: string };
export type NavItem = { label: string; href: string; children?: NavChild[] };

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
};

/** アンブレラ型グローバルナビ。キャリアは4サブカテゴリを子に持つ。 */
export const GLOBAL_NAV: NavItem[] = [
  {
    label: "キャリア・転職",
    href: "/career",
    children: [
      { label: CATEGORY_LABELS.mindset, href: "/career/mindset" },
      { label: CATEGORY_LABELS.tenshoku, href: "/career/tenshoku" },
      { label: CATEGORY_LABELS.sidejob, href: "/career/sidejob" },
      { label: CATEGORY_LABELS.story, href: "/career/story" },
    ],
  },
  { label: CATEGORY_LABELS.taishoku, href: "/taishoku" },
  { label: CATEGORY_LABELS.shikaku, href: "/shikaku" },
  { label: CATEGORY_LABELS.coaching, href: "/coaching" },
  { label: CATEGORY_LABELS.english, href: "/english" },
];
