import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* ヒーロー */}
      <section className="relative min-h-[360px] md:min-h-[440px] flex items-center overflow-hidden">
        <Image
          src="/images/hero-city.jpg"
          alt="都市のビジネス街の風景"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/95 via-zinc-900/80 to-zinc-900/40" />
        <div className="relative max-w-5xl mx-auto px-4 py-16 md:py-20 w-full">
          <p className="text-sm font-semibold text-blue-400 mb-4 tracking-wider flex items-center gap-2">
            <span className="w-8 h-px bg-blue-400" />
            NARA-CAREER.COM
          </p>
          <h1 className="text-3xl md:text-4xl font-bold leading-[1.3] tracking-tight text-white mb-5 max-w-2xl">
            働く人の「選び方」を変えるメディア
          </h1>
          <p className="text-base text-zinc-300 max-w-lg leading-relaxed">
            会社・サービス・働き方——人生を左右する選択を、実体験ベースの一次情報で支えます。
          </p>
        </div>
      </section>

      {/* ジャンル一覧 */}
      <section className="max-w-5xl mx-auto px-4 py-16 md:py-20">
        <div className="mb-10">
          <p className="text-sm font-semibold text-primary mb-2 tracking-wider uppercase">
            Contents
          </p>
          <h2 className="text-2xl md:text-3xl font-bold">コンテンツ</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Link
            href="/career"
            className="group block border border-border/60 rounded-2xl overflow-hidden bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="p-7 md:p-8">
              <div className="flex items-start gap-4 mb-4">
                <span className="text-4xl">🏢</span>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">会社員の居場所戦略</h3>
                  <p className="text-xs text-zinc-400">キャリア・転職・副業</p>
                </div>
              </div>
              <p className="text-sm text-zinc-500 leading-relaxed mb-5">
                5回の転職で年収3.5倍を実現した運営者が、出世ではなく「環境を変える」キャリア戦略を発信。
                転職ノウハウから体験談まで、実体験ベースの一次情報。
              </p>
              <p className="text-sm font-semibold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                キャリアのコンテンツを見る
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </p>
            </div>
          </Link>

          <Link
            href="/taishoku"
            className="group block border border-border/60 rounded-2xl overflow-hidden bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="p-7 md:p-8">
              <div className="flex items-start gap-4 mb-4">
                <span className="text-4xl">🚪</span>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">退職のリアル</h3>
                  <p className="text-xs text-zinc-400">退職代行・辞め方・辞めた後</p>
                </div>
              </div>
              <p className="text-sm text-zinc-500 leading-relaxed mb-5">
                「辞めたいのに言えない」を解決する実践情報。安全な退職代行の選び方、
                労働組合と弁護士の違い、退職代行を受けた側の管理職が見た実情まで。
              </p>
              <p className="text-sm font-semibold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                退職のコンテンツを見る
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </p>
            </div>
          </Link>

          <Link
            href="/shikaku"
            className="group block border border-border/60 rounded-2xl overflow-hidden bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="p-7 md:p-8">
              <div className="flex items-start gap-4 mb-4">
                <span className="text-4xl">📚</span>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">資格とリスキリング</h3>
                  <p className="text-xs text-zinc-400">学び直し・資格・通信講座</p>
                </div>
              </div>
              <p className="text-sm text-zinc-500 leading-relaxed mb-5">
                転職・年収アップに本当に効く資格はどれか。採用側も経験したマーケターの視点で、
                資格の選び方・独学と通信講座の使い分け・給付金の活用法を解説。
              </p>
              <p className="text-sm font-semibold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                資格のコンテンツを見る
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </p>
            </div>
          </Link>

          <Link
            href="/coaching"
            className="group block border border-border/60 rounded-2xl overflow-hidden bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="p-7 md:p-8">
              <div className="flex items-start gap-4 mb-4">
                <span className="text-4xl">🧭</span>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">キャリア相談とコーチング</h3>
                  <p className="text-xs text-zinc-400">キャリア迷子・相談先・コーチング比較</p>
                </div>
              </div>
              <p className="text-sm text-zinc-500 leading-relaxed mb-5">
                「このままでいいのか」に答えを出すための実践情報。キャリアの棚卸しのやり方から、
                30万円超のキャリアコーチングは価値があるのかまで、転職5社の経験者が本音で整理。
              </p>
              <p className="text-sm font-semibold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                キャリア相談のコンテンツを見る
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </p>
            </div>
          </Link>

          <Link
            href="/english"
            className="group block border border-border/60 rounded-2xl overflow-hidden bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="p-7 md:p-8">
              <div className="flex items-start gap-4 mb-4">
                <span className="text-4xl">🌐</span>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">ビジネス英語とTOEIC</h3>
                  <p className="text-xs text-zinc-400">TOEIC・オンライン英会話・学習設計</p>
                </div>
              </div>
              <p className="text-sm text-zinc-500 leading-relaxed mb-5">
                英語はキャリアの武器になるのか。転職で評価されるTOEICスコアの目安から、
                忙しい社会人の学習設計、英会話サービスの比較まで、キャリア目線で整理。
              </p>
              <p className="text-sm font-semibold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                英語のコンテンツを見る
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* 運営者紹介 */}
      <section className="bg-muted">
        <div className="max-w-5xl mx-auto px-4 py-14">
          <div className="bg-white border border-border/60 rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center gap-6">
            <Image
              src="/images/avatar.png"
              alt="ならなら"
              width={72}
              height={72}
              className="rounded-full shrink-0"
            />
            <div className="flex-1">
              <h2 className="text-lg font-bold mb-2">運営者：ならなら</h2>
              <p className="text-sm text-zinc-500 leading-relaxed mb-4">
                デジタルマーケティング歴10年の現役会社員。5社の転職で年収3.5倍を実現。
                実際に使ったサービスと自分の体験だけをもとに、後悔しない選択のための情報を発信しています。
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-1.5 border border-zinc-300 text-zinc-600 font-semibold px-4 py-2 rounded-lg hover:bg-zinc-50 transition-colors text-xs"
                >
                  運営者についてもっと知る
                </Link>
                <a
                  href="https://x.com/nara_nara_san"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-zinc-900 text-white font-semibold px-4 py-2 rounded-lg hover:bg-zinc-800 transition-colors text-xs"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  Xでフォローする
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
