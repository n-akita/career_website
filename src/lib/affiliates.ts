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
  cta: string;
};

export const affiliateServices: Record<string, AffiliateService> = {
  doda: {
    id: "doda",
    name: "doda",
    url: "#", // ← ASP登録後にアフィリエイトURLに差し替え
    description:
      "僕が2回使って2回とも転職を決めたサービス。年収帯を問わず求人が豊富で、エージェントが粘り強くサポートしてくれる",
    cta: "自分の「次の居場所」を探してみる",
  },
  bizreach: {
    id: "bizreach",
    name: "ビズリーチ",
    url: "#", // ← ASP登録後にアフィリエイトURLに差し替え
    description:
      "スカウトが届くから、今の自分の市場価値がわかる。僕は副業案件もここで見つけた",
    cta: "自分の市場価値を確認してみる",
  },
  jac: {
    id: "jac",
    name: "JACリクルートメント",
    url: "#", // ← ASP登録後にアフィリエイトURLに差し替え
    description:
      "面接官の人柄まで教えてくれた唯一のエージェント。合否連絡が10分で届いた。ハイクラス・ミドルクラス特化",
    cta: "企業の「中の人」情報を手に入れる",
  },
  recruit: {
    id: "recruit",
    name: "リクルートエージェント",
    url: "#", // ← ASP登録後にアフィリエイトURLに差し替え
    description:
      "業界最大の求人数で選択肢が広い。まず求人の全体像を把握したい人向け",
    cta: "どんな求人があるか見てみる",
  },
  openwork: {
    id: "openwork",
    name: "OpenWork",
    url: "#", // ← ASP登録後にアフィリエイトURLに差し替え
    description:
      "社員の口コミで企業のリアルな内情がわかる。入社後のギャップを防ぐために必須",
    cta: "気になる企業の口コミを見る",
  },
  visasq: {
    id: "visasq",
    name: "ビザスク",
    url: "#", // ← ASP登録後にアフィリエイトURLに差し替え
    description:
      "1回1時間のスポットコンサルで副業デビュー。「普通のスキル」が外では専門知識になる",
    cta: "自分の経験を副業にしてみる",
  },
};

/**
 * IDでサービス情報を取得
 */
export function getAffiliate(id: string): AffiliateService {
  return affiliateServices[id] ?? { id, name: id, url: "#", description: "", cta: "無料で登録する" };
}

/**
 * 複数IDでまとめて取得
 */
export function getAffiliates(...ids: string[]): AffiliateService[] {
  return ids.map(getAffiliate);
}
