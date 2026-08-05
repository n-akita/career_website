// アフィリエイトサービス台帳（全ジャンル一元管理）
//
// 運用ルール:
// - affiliateUrl が空文字の間、CTAは fallbackPath（サイト内の評判・比較記事）への
//   内部リンクとして表示される。ASP承認後に affiliateUrl を貼るだけで、そのサービスの
//   ボタンが外部アフィリリンク（rel=sponsored）に切り替わり、記事冒頭にPR表記が自動で付く。
// - 実リンクの有効化は再収益化ゲート（記事80%インデックス＋オーガニック500/月×2ヶ月）達成後。
//   それまでは affiliateUrl を空のまま維持する。
// - 実リンク有効化の際は privacy/disclaimer ページへの広告掲載ポリシー記載も復活させること。
// - nav.ts と同じくクライアント安全な純データモジュール（fs等は使わない）。

// CTA表示のマスタースイッチ。
// 「検索順位がある程度付くまでCTA枠自体を出さない」方針（2026-08-05ユーザー確定）のため false。
// 週次checkupのゲート指標（上位20位KW数・オーガニック流入）達成後、ユーザー承認を得て true にする。
export const SHOW_SERVICE_CTA = false;

export type AffiliateService = {
  id: string;
  name: string;
  /** ASP発行のアフィリエイトURL。空の間は fallbackPath への内部リンクで表示 */
  affiliateUrl: string;
  /** バリューコマース等のトラッキングピクセルURL（ある場合のみ） */
  trackingPixel?: string;
  /** 未提携の間に案内するサイト内記事（評判・比較・ガイド） */
  fallbackPath: string;
  description: string;
  /** アフィリ稼働時のボタン文言 */
  cta: string;
};

// 旧サイトで提携済みだったバリューコマースのタグ（sid=3767027）。
// プログラム提携が現在も有効かVC管理画面で確認のうえ、ゲート達成後に affiliateUrl へ移す。
//   ビズリーチ:            //ck.jp.ap.valuecommerce.com/servlet/referral?sid=3767027&pid=892595365
//   JACリクルートメント:    //ck.jp.ap.valuecommerce.com/servlet/referral?sid=3767027&pid=892595364
//   リクルートエージェント: //ck.jp.ap.valuecommerce.com/servlet/referral?sid=3767027&pid=892595356
//   （ピクセルは同sid/pidの gifbanner URL）

export const AFFILIATE_SERVICES: Record<string, AffiliateService> = {
  // ── 転職エージェント（/career系） ──────────────────
  doda: {
    id: "doda",
    name: "doda",
    affiliateUrl: "",
    fallbackPath: "/career/tenshoku/agent-guide",
    description:
      "僕が2回使って2回とも転職を決めたサービス。年収帯を問わず求人が豊富で、エージェントが粘り強くサポートしてくれる",
    cta: "自分の「次の居場所」を探してみる",
  },
  recruit: {
    id: "recruit",
    name: "リクルートエージェント",
    affiliateUrl: "",
    fallbackPath: "/career/tenshoku/agent-guide",
    description:
      "業界最大の求人数で選択肢が広い。まず求人の全体像を把握したい人向け",
    cta: "どんな求人があるか見てみる",
  },
  jac: {
    id: "jac",
    name: "JACリクルートメント",
    affiliateUrl: "",
    fallbackPath: "/career/tenshoku/agent-guide",
    description:
      "面接官の人柄まで教えてくれた唯一のエージェント。合否連絡が10分で届いた。ハイクラス・ミドルクラス特化",
    cta: "企業の「中の人」情報を手に入れる",
  },
  bizreach: {
    id: "bizreach",
    name: "ビズリーチ",
    affiliateUrl: "",
    fallbackPath: "/career/tenshoku/agent-guide",
    description:
      "スカウトが届くから、今の自分の市場価値がわかる。僕は副業案件もここで見つけた",
    cta: "自分の市場価値を確認してみる",
  },

  // ── 退職代行（/taishoku） ──────────────────
  taishokuGuardian: {
    id: "taishokuGuardian",
    name: "退職代行ガーディアン",
    affiliateUrl: "",
    fallbackPath: "/taishoku/taishoku-daiko-guide",
    description:
      "労働組合が運営する退職代行。会社への連絡をすべて任せられ、有給消化などの交渉もできる",
    cta: "公式サイトで詳細を見る",
  },
  taishokuMiyabi: {
    id: "taishokuMiyabi",
    name: "弁護士法人みやび",
    affiliateUrl: "",
    fallbackPath: "/taishoku/union-lawyer-difference",
    description:
      "弁護士が対応する退職代行。未払い残業代・退職金の請求などトラブル込みの退職を任せられる",
    cta: "無料相談してみる",
  },
  taishokuJobs: {
    id: "taishokuJobs",
    name: "退職代行Jobs",
    affiliateUrl: "",
    fallbackPath: "/taishoku/cheap-postpay-comparison",
    description:
      "弁護士監修＋労働組合連携。後払いに対応していて、手元にお金がなくても依頼しやすい",
    cta: "公式サイトで詳細を見る",
  },

  // ── 失業保険・給付金サポート（/shitsugyo） ──────────────────
  taishokuConcierge: {
    id: "taishokuConcierge",
    name: "退職コンシェルジュ",
    affiliateUrl: "",
    fallbackPath: "/shitsugyo/kyufukin-support-hikaku",
    description:
      "社会保険給付金サポートの代表格。受給できる可能性のある給付金を無料のWEB説明会で診断できる",
    cta: "無料WEB説明会に参加してみる",
  },

  // ── キャリアコーチング（/coaching） ──────────────────
  posiwill: {
    id: "posiwill",
    name: "ポジウィルキャリア",
    affiliateUrl: "",
    fallbackPath: "/coaching/posiwill-hyouban",
    description:
      "「どう生きたいか」から掘り下げる自己分析特化型。転職ありきではない相談ができる代表格",
    cta: "無料カウンセリングを予約する",
  },
  majicari: {
    id: "majicari",
    name: "マジキャリ",
    affiliateUrl: "",
    fallbackPath: "/coaching/majicari-hyouban",
    description:
      "転職エージェント運営会社によるコーチング。自己分析から転職成功までを一気通貫で設計してくれる",
    cta: "無料面談を予約する",
  },
  kizuku: {
    id: "kizuku",
    name: "きづく。転職相談",
    affiliateUrl: "",
    fallbackPath: "/coaching/kizuku-hyouban",
    description:
      "短期集中の1ヶ月プランなど比較的手頃な価格帯から始められる。まず一度キャリアを整理したい人向け",
    cta: "無料相談してみる",
  },
  lifeshiftlab: {
    id: "lifeshiftlab",
    name: "ライフシフトラボ",
    affiliateUrl: "",
    fallbackPath: "/coaching/lifeshiftlab-hyouban",
    description:
      "40〜50代のキャリア再設計に特化。複業・独立も視野に入れた実践型プログラムが特徴",
    cta: "無料個別相談を予約する",
  },

  // ── 英語・TOEIC（/english） ──────────────────
  nativecamp: {
    id: "nativecamp",
    name: "ネイティブキャンプ",
    affiliateUrl: "",
    fallbackPath: "/english/nativecamp-hyouban",
    description:
      "レッスン回数無制限が最大の特徴。とにかく話す量を確保したい人向け",
    cta: "無料体験を試してみる",
  },
  dmmEikaiwa: {
    id: "dmmEikaiwa",
    name: "DMM英会話",
    affiliateUrl: "",
    fallbackPath: "/english/dmm-eikaiwa-hyouban",
    description:
      "教材が豊富で講師の国籍も幅広い。大手ならではの安定感で迷ったらまず候補になる",
    cta: "無料体験を試してみる",
  },
  bizmates: {
    id: "bizmates",
    name: "Bizmates",
    affiliateUrl: "",
    fallbackPath: "/english/bizmates-hyouban",
    description:
      "ビジネス英語特化。講師全員がビジネス経験者で、会議・商談など実務シーンに直結する",
    cta: "無料体験を試してみる",
  },
  sutasapuToeic: {
    id: "sutasapuToeic",
    name: "スタディサプリENGLISH（TOEIC対策）",
    affiliateUrl: "",
    fallbackPath: "/english/sutasapu-toeic-hyouban",
    description:
      "アプリ完結でTOEIC対策ができる。通勤などスキマ時間で点数を上げたい社会人向け",
    cta: "無料体験を試してみる",
  },
  rarejob: {
    id: "rarejob",
    name: "レアジョブ英会話",
    affiliateUrl: "",
    fallbackPath: "/english/rarejob-hyouban",
    description:
      "上場企業運営の老舗オンライン英会話。日本人カウンセラーに学習相談できるのが心強い",
    cta: "無料体験を試してみる",
  },

  // ── 資格・通信講座（/shikaku） ──────────────────
  studying: {
    id: "studying",
    name: "スタディング",
    affiliateUrl: "",
    fallbackPath: "/shikaku/studying-hyouban",
    description:
      "スマホ完結の学習システムで業界最安級。通勤時間で資格を取りたい社会人の定番",
    cta: "無料講座を試してみる",
  },
  agaroot: {
    id: "agaroot",
    name: "アガルート",
    affiliateUrl: "",
    fallbackPath: "/shikaku/agaroot-hyouban",
    description:
      "講師・テキストの質に定評があり、合格特典が手厚い。本気で一発合格を狙う人向け",
    cta: "資料請求・無料体験を見る",
  },
  foresight: {
    id: "foresight",
    name: "フォーサイト",
    affiliateUrl: "",
    fallbackPath: "/shikaku/foresight-hyouban",
    description:
      "フルカラーテキストと高い合格率の公表で定評。教材の見やすさ重視の人向け",
    cta: "無料資料請求してみる",
  },

  // ── 電気・ガス（/denki） ──────────────────
  enechange: {
    id: "enechange",
    name: "エネチェンジ",
    affiliateUrl: "",
    fallbackPath: "/denki/denryoku-norikae-demerit",
    description:
      "電力・ガスの料金比較サイト。今の使用量を入れると、乗り換えでいくら変わるかを試算できる",
    cta: "電気料金を比較してみる",
  },

  // ── 光回線（/hikari） ──────────────────
  docomoHikari: {
    id: "docomoHikari",
    name: "ドコモ光",
    affiliateUrl: "",
    fallbackPath: "/hikari/hikari-hikaku",
    description:
      "ドコモのスマホを使っているならまず候補。セット割が家族の回線数だけ効くのが強み",
    cta: "料金プランを見てみる",
  },
  softbankHikari: {
    id: "softbankHikari",
    name: "ソフトバンク光",
    affiliateUrl: "",
    fallbackPath: "/hikari/hikari-hikaku",
    description:
      "ソフトバンク・ワイモバイルのスマホとセットで割引。マンションでも導入しやすい光コラボ",
    cta: "料金プランを見てみる",
  },
  auHikari: {
    id: "auHikari",
    name: "auひかり",
    affiliateUrl: "",
    fallbackPath: "/hikari/hikari-hikaku",
    description:
      "au・UQのスマホとセット割。NTT回線とは別系統のため、混雑時の速度で有利になる場合がある",
    cta: "提供エリアを確認する",
  },
  nuroHikari: {
    id: "nuroHikari",
    name: "NURO光",
    affiliateUrl: "",
    fallbackPath: "/hikari/hikari-hikaku",
    description:
      "独自回線で高速をうたうサービス。提供エリアが限られるので、まずエリア判定から",
    cta: "提供エリアを確認する",
  },

  // ── スマホ・通信費（/sim） ──────────────────
  uqMobile: {
    id: "uqMobile",
    name: "UQモバイル",
    affiliateUrl: "",
    fallbackPath: "/sim/senior-sim",
    description:
      "au回線のサブブランド。全国に店舗があり、対面で相談しながら乗り換えたい人に向く",
    cta: "料金プランを見てみる",
  },
  ymobile: {
    id: "ymobile",
    name: "ワイモバイル",
    affiliateUrl: "",
    fallbackPath: "/sim/senior-sim",
    description:
      "ソフトバンク回線のサブブランド。店舗数が多く、家族割やネットセット割の割引幅が大きい",
    cta: "料金プランを見てみる",
  },
  aeonMobile: {
    id: "aeonMobile",
    name: "イオンモバイル",
    affiliateUrl: "",
    fallbackPath: "/sim/senior-sim",
    description:
      "イオン店舗で相談・契約ができる格安SIM。細かい容量プランが選べて、使う量が少ない人ほど安くなる",
    cta: "料金プランを見てみる",
  },
  iijmio: {
    id: "iijmio",
    name: "IIJmio",
    affiliateUrl: "",
    fallbackPath: "/sim/why-phone-bill-high",
    description:
      "老舗のMVNO。小容量が安く、端末セールも多い。設定を自分でできる人向けのコスパ枠",
    cta: "料金プランを見てみる",
  },

  // ── 副業ブログ・レンタルサーバー（/blog） ──────────────────
  xserver: {
    id: "xserver",
    name: "エックスサーバー",
    affiliateUrl: "",
    fallbackPath: "/blog/rental-server-hikaku",
    description:
      "国内シェア最大級の定番サーバー。表示速度と安定性に定評があり、WordPressの導入も管理画面から完結する",
    cta: "料金プランを見てみる",
  },
  conohaWing: {
    id: "conohaWing",
    name: "ConoHa WING",
    affiliateUrl: "",
    fallbackPath: "/blog/xserver-conoha-dochira",
    description:
      "表示速度の速さを打ち出す後発サーバー。長期割引の実質月額が安く、初期費用も無料で始めやすい",
    cta: "料金プランを見てみる",
  },
  lolipop: {
    id: "lolipop",
    name: "ロリポップ",
    affiliateUrl: "",
    fallbackPath: "/blog/rental-server-hikaku",
    description:
      "月数百円台から使える低価格サーバー。まず最小コストで試したい人向けの選択肢",
    cta: "料金プランを見てみる",
  },

  // ── 会計ソフト（/kaikei・/career/sidejob） ──────────────────
  freee: {
    id: "freee",
    name: "freee会計",
    affiliateUrl: "",
    fallbackPath: "/kaikei/freee-hyouban",
    description:
      "簿記知識ゼロでも使える設計。質問に答えていくだけで確定申告書類ができあがる",
    cta: "無料で試してみる",
  },
  moneyforward: {
    id: "moneyforward",
    name: "マネーフォワード クラウド確定申告",
    affiliateUrl: "",
    fallbackPath: "/kaikei/moneyforward-hyouban",
    description:
      "銀行・カード連携の自動仕訳が強力。明細取り込みで入力の手間を大幅に減らせる",
    cta: "無料で試してみる",
  },
  yayoi: {
    id: "yayoi",
    name: "やよいの青色申告 オンライン",
    affiliateUrl: "",
    fallbackPath: "/kaikei/kaikei-soft-erabikata",
    description:
      "老舗の安心感と低価格が魅力。まずコストを抑えて始めたい人向け",
    cta: "無料で試してみる",
  },

  // ── ふるさと納税（/furusato） ──────────────────
  furunavi: {
    id: "furunavi",
    name: "ふるなび",
    affiliateUrl: "",
    fallbackPath: "/furusato/furusato-site-hikaku",
    description: "家電やチケット系の返礼品に強い老舗ポータル",
    cta: "返礼品を探してみる",
  },
  rakutenFurusato: {
    id: "rakutenFurusato",
    name: "楽天ふるさと納税",
    affiliateUrl: "",
    fallbackPath: "/furusato/furusato-site-hikaku",
    description: "楽天会員情報でそのまま寄付できる手軽さが魅力。普段楽天を使う人向け",
    cta: "返礼品を探してみる",
  },
  satofull: {
    id: "satofull",
    name: "さとふる",
    affiliateUrl: "",
    fallbackPath: "/furusato/furusato-site-hikaku",
    description: "食品系返礼品の掲載が豊富で、配送状況の管理がわかりやすい定番ポータル",
    cta: "返礼品を探してみる",
  },
  furusatoChoice: {
    id: "furusatoChoice",
    name: "ふるさとチョイス",
    affiliateUrl: "",
    fallbackPath: "/furusato/furusato-site-hikaku",
    description: "掲載自治体数・返礼品数が最大級。選択肢の多さで選ぶならここ",
    cta: "返礼品を探してみる",
  },
};

export function getAffiliate(id: string): AffiliateService | undefined {
  return AFFILIATE_SERVICES[id];
}

/** アフィリリンクが稼働中か（URLが入っていれば稼働） */
export function isLive(svc: AffiliateService): boolean {
  return svc.affiliateUrl !== "";
}

// ──────────────────────────────────────────────
// カテゴリ別CTA構成（記事ページ末尾に自動表示するラインナップ）
// ──────────────────────────────────────────────

export type GenreCtaConfig = {
  heading: string;
  lead?: string;
  serviceIds: string[];
};

const TENSHOKU_CTA: GenreCtaConfig = {
  heading: "おすすめの転職サービス",
  lead: "複数登録して比較するのが基本。まずは求人を眺めるだけでも市場感がつかめる。",
  serviceIds: ["doda", "recruit", "jac", "bizreach"],
};

export const GENRE_CTA: Record<string, GenreCtaConfig> = {
  mindset: TENSHOKU_CTA,
  tenshoku: TENSHOKU_CTA,
  story: TENSHOKU_CTA,
  sidejob: {
    heading: "副業を始めたら備えたい会計ソフト",
    lead: "副業の売上が立ったら確定申告はセット。ソフトに任せれば手間は大幅に減らせる。",
    serviceIds: ["freee", "moneyforward"],
  },
  taishoku: {
    heading: "安全に頼める退職代行サービス",
    lead: "運営形態（労働組合・弁護士）でできることが違う。比較して自分の状況に合うものを。",
    serviceIds: ["taishokuGuardian", "taishokuMiyabi", "taishokuJobs"],
  },
  shitsugyo: {
    heading: "退職後のお金の不安に使えるサービス",
    lead: "まず自分がもらえる額と時期を把握するのが先。そのうえで、手続きに不安があればサポートも選択肢。",
    serviceIds: ["taishokuConcierge", "taishokuGuardian", "taishokuMiyabi"],
  },
  shikaku: {
    heading: "資格取得におすすめの通信講座",
    lead: "講座選びは相性が大事。無料体験・資料請求で教材を見てから決めるのが失敗しないコツ。",
    serviceIds: ["studying", "agaroot", "foresight"],
  },
  coaching: {
    heading: "おすすめのキャリアコーチング",
    lead: "各社とも初回は無料相談から。合わなければ契約しなくていいので、まず話してみるのが早い。",
    serviceIds: ["posiwill", "majicari", "kizuku", "lifeshiftlab"],
  },
  english: {
    heading: "おすすめのオンライン英会話・英語学習",
    lead: "どれも無料体験あり。目的（話す量・ビジネス特化・TOEIC）で選ぶと失敗しない。",
    serviceIds: ["nativecamp", "dmmEikaiwa", "bizmates", "sutasapuToeic"],
  },
  denki: {
    heading: "電気・ガスの見直しに使えるサービス",
    lead: "まず今の使用量(検針票のkWh)を手元に。比較サイトの試算は条件次第で変わるので、契約前に公式で最終確認を。",
    serviceIds: ["enechange"],
  },
  hikari: {
    heading: "主要な光回線",
    lead: "使っているスマホのキャリアで決めるのが基本。キャッシュバックは受取条件を必ず確認してから。",
    serviceIds: ["docomoHikari", "softbankHikari", "auHikari", "nuroHikari"],
  },
  sim: {
    heading: "スマホ代の見直し先",
    lead: "使うデータ量と「店舗で相談したいか」で選ぶのが失敗しないコツ。回線品質はサブブランドなら大差ない。",
    serviceIds: ["uqMobile", "ymobile", "aeonMobile", "iijmio"],
  },
  blog: {
    heading: "副業ブログを始めるためのレンタルサーバー",
    lead: "初期費用の大半はサーバー代。まず1年続ける前提で、実質月額と管理のしやすさで選ぶのが現実的。",
    serviceIds: ["xserver", "conohaWing", "lolipop"],
  },
  kaikei: {
    heading: "おすすめの会計ソフト",
    lead: "主要3ソフトはどれも無料お試しあり。実際に触って操作感で選ぶのが確実。",
    serviceIds: ["freee", "moneyforward", "yayoi"],
  },
  furusato: {
    heading: "主要ふるさと納税サイト",
    lead: "欲しい返礼品のジャンルでサイトを使い分けるのが賢い。掲載内容はサイトごとに結構違う。",
    serviceIds: ["furunavi", "rakutenFurusato", "satofull", "furusatoChoice"],
  },
};

/** カテゴリのCTA構成を取得（未定義カテゴリは null） */
export function getGenreCta(category: string): GenreCtaConfig | null {
  return GENRE_CTA[category] ?? null;
}

/** カテゴリのCTAサービス一覧を取得 */
export function getCtaServices(category: string): AffiliateService[] {
  const config = GENRE_CTA[category];
  if (!config) return [];
  return config.serviceIds
    .map((id) => AFFILIATE_SERVICES[id])
    .filter((svc): svc is AffiliateService => Boolean(svc));
}

/** そのカテゴリのCTAに稼働中のアフィリリンクが1つでも含まれるか（PR表記の要否判定） */
export function hasLiveAffiliate(category: string): boolean {
  return getCtaServices(category).some(isLive);
}
