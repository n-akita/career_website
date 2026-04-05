/**
 * アフィリエイトリンク一元管理
 *
 * 全サイトの転職サービスリンクをここで管理します。
 * ASP登録後、各サービスの url を差し替えるだけで全ページに反映されます。
 */

export type AffiliateService = {
  id: string;
  name: string;
  url: string;
  description: string;
};

export const affiliateServices: Record<string, AffiliateService> = {
  doda: {
    id: "doda",
    name: "doda",
    url: "#", // ← ASP登録後にアフィリエイトURLに差し替え
    description: "求人数が多く、幅広い年収帯に対応。エージェントのサポートが手厚い",
  },
  bizreach: {
    id: "bizreach",
    name: "ビズリーチ",
    url: "#", // ← ASP登録後にアフィリエイトURLに差し替え
    description: "スカウト型で市場価値がわかる。副業案件も掲載。ハイクラス向け",
  },
  jac: {
    id: "jac",
    name: "JACリクルートメント",
    url: "#", // ← ASP登録後にアフィリエイトURLに差し替え
    description: "ハイクラス・ミドルクラス特化。企業の内情に詳しいエージェント",
  },
  recruit: {
    id: "recruit",
    name: "リクルートエージェント",
    url: "#", // ← ASP登録後にアフィリエイトURLに差し替え
    description: "業界最大の求人数。幅広い選択肢から条件に合う企業を見つけやすい",
  },
  openwork: {
    id: "openwork",
    name: "OpenWork",
    url: "#", // ← ASP登録後にアフィリエイトURLに差し替え
    description: "社員の口コミで企業の実態がわかる。転職前のリサーチに必須",
  },
  visasq: {
    id: "visasq",
    name: "ビザスク",
    url: "#", // ← ASP登録後にアフィリエイトURLに差し替え
    description: "スポットコンサルのマッチング。自分の経験を副業に変える第一歩",
  },
};

/**
 * IDでサービス情報を取得
 */
export function getAffiliate(id: string): AffiliateService {
  return affiliateServices[id] ?? { id, name: id, url: "#", description: "" };
}

/**
 * 複数IDでまとめて取得
 */
export function getAffiliates(...ids: string[]): AffiliateService[] {
  return ids.map(getAffiliate);
}
