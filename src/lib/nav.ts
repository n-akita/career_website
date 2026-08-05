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
  shitsugyo: "失業保険・手続き",
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
  shitsugyo: "📋",
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
  { label: CATEGORY_LABELS.shitsugyo, href: "/shitsugyo", emoji: CATEGORY_EMOJI.shitsugyo },
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

// ──────────────────────────────────────────────
// ジャンル別サブナビ（ヘッダー直下のコンテキストナビ）
// 検索流入したユーザーをジャンル内で回遊・成約させるための固定導線。
// links にはそのジャンルの比較・ランキング系ピラー記事を置き、
// cta はジャンルごとの最重要コンバージョンページを指す。
// ──────────────────────────────────────────────

export type GenreLink = { label: string; href: string };
export type GenreSubNavConfig = {
  /** ジャンル表示名（サブナビ左端） */
  genre: string;
  emoji: string;
  /** ジャンルトップのパス */
  href: string;
  /** ピラー記事への固定リンク */
  links: GenreLink[];
  /** ジャンル別CTA（右端で強調表示） */
  cta: GenreLink;
};

const CAREER_SUBNAV: GenreSubNavConfig = {
  genre: "キャリア・転職",
  emoji: "🏢",
  href: "/career",
  links: [
    { label: CATEGORY_LABELS.mindset, href: "/career/mindset" },
    { label: CATEGORY_LABELS.tenshoku, href: "/career/tenshoku" },
    { label: CATEGORY_LABELS.sidejob, href: "/career/sidejob" },
    { label: CATEGORY_LABELS.story, href: "/career/story" },
  ],
  cta: { label: "3分キャリア診断", href: "/career/diagnosis" },
};

/** カテゴリ slug → サブナビ設定。キャリア4サブカテゴリは同じ設定を共有する。 */
export const GENRE_SUBNAV: Record<string, GenreSubNavConfig> = {
  career: CAREER_SUBNAV,
  mindset: CAREER_SUBNAV,
  tenshoku: CAREER_SUBNAV,
  sidejob: CAREER_SUBNAV,
  story: CAREER_SUBNAV,
  taishoku: {
    genre: CATEGORY_LABELS.taishoku,
    emoji: CATEGORY_EMOJI.taishoku,
    href: "/taishoku",
    links: [
      { label: "労組と弁護士の違い", href: "/taishoku/union-lawyer-difference" },
      { label: "違法にならない条件", href: "/taishoku/taishoku-daiko-legality" },
      { label: "格安・後払い比較", href: "/taishoku/cheap-postpay-comparison" },
      { label: "辞めた後の転職", href: "/taishoku/after-taishoku-tenshoku" },
    ],
    cta: { label: "選び方完全ガイド", href: "/taishoku/taishoku-daiko-guide" },
  },
  shitsugyo: {
    genre: CATEGORY_LABELS.shitsugyo,
    emoji: CATEGORY_EMOJI.shitsugyo,
    href: "/shitsugyo",
    links: [
      { label: "いつからもらえる", href: "/shitsugyo/jikotsugou-itsukara" },
      { label: "いくらもらえる", href: "/shitsugyo/ikura-keisan" },
      { label: "退職代行と失業保険", href: "/shitsugyo/taishokudaiko-shitsugyohoken" },
      { label: "給付金サポートの実態", href: "/shitsugyo/kyufukin-support-hikaku" },
    ],
    cta: { label: "退職後の手続き完全ガイド", href: "/shitsugyo/taishokugo-tetsuduki-list" },
  },
  shikaku: {
    genre: CATEGORY_LABELS.shikaku,
    emoji: CATEGORY_EMOJI.shikaku,
    href: "/shikaku",
    links: [
      { label: "簿記講座の比較", href: "/shikaku/boki-tsushin-kouza-hikaku" },
      { label: "FP講座の比較", href: "/shikaku/fp-tsushin-kouza-hikaku" },
      { label: "宅建講座の比較", href: "/shikaku/takken-tsushin-kouza-hikaku" },
      { label: "給付金で安く学ぶ", href: "/shikaku/kyouiku-kunren-kyufukin-guide" },
    ],
    cta: { label: "資格の選び方ガイド", href: "/shikaku/tenshoku-shikaku-guide" },
  },
  coaching: {
    genre: CATEGORY_LABELS.coaching,
    emoji: CATEGORY_EMOJI.coaching,
    href: "/coaching",
    links: [
      { label: "サービス比較", href: "/coaching/coaching-hikaku" },
      { label: "料金相場", href: "/coaching/coaching-ryoukin-souba" },
      { label: "無料でできる相談", href: "/coaching/muryou-career-soudan" },
      { label: "ポジウィルの評判", href: "/coaching/posiwill-hyouban" },
    ],
    cta: { label: "選び方完全ガイド", href: "/coaching/coaching-erabikata-guide" },
  },
  english: {
    genre: CATEGORY_LABELS.english,
    emoji: CATEGORY_EMOJI.english,
    href: "/english",
    links: [
      { label: "オンライン英会話比較", href: "/english/online-eikaiwa-hikaku" },
      { label: "転職に必要なTOEIC点数", href: "/english/toeic-tenshoku-nanten" },
      { label: "スタサプTOEICの評判", href: "/english/sutasapu-toeic-hyouban" },
      { label: "社会人の勉強法", href: "/english/toeic-benkyou-shakaijin" },
    ],
    cta: { label: "英語×キャリア完全ガイド", href: "/english/eigo-career-guide" },
  },
  furusato: {
    genre: CATEGORY_LABELS.furusato,
    emoji: CATEGORY_EMOJI.furusato,
    href: "/furusato",
    links: [
      { label: "サイト比較", href: "/furusato/furusato-site-hikaku" },
      { label: "限度額の調べ方", href: "/furusato/furusato-gendogaku" },
      { label: "ワンストップ特例", href: "/furusato/furusato-onestop" },
      { label: "ポイント廃止後の選び方", href: "/furusato/furusato-point-haishi" },
    ],
    cta: { label: "始め方完全ガイド", href: "/furusato/furusato-nouzei-guide" },
  },
  kaikei: {
    genre: CATEGORY_LABELS.kaikei,
    emoji: CATEGORY_EMOJI.kaikei,
    href: "/kaikei",
    links: [
      { label: "freee vs マネーフォワード", href: "/kaikei/freee-mf-hikaku" },
      { label: "副業の確定申告", href: "/kaikei/fukugyou-kakuteishinkoku" },
      { label: "インボイス対応", href: "/kaikei/invoice-kojin-taiou" },
      { label: "電子帳簿保存法", href: "/kaikei/denchoho-kojin" },
    ],
    cta: { label: "会計ソフトの選び方", href: "/kaikei/kaikei-soft-erabikata" },
  },
};

/** 現在のパスがナビ項目（またはその子）に属するか */
export function isNavItemActive(pathname: string, item: NavItem): boolean {
  const matches = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);
  if (matches(item.href)) return true;
  return item.children?.some((c) => matches(c.href)) ?? false;
}
