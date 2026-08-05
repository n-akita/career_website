import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border/60 bg-zinc-900 text-zinc-300 mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* ブランド */}
          <div className="max-w-sm">
            <p className="flex items-center gap-2 font-bold text-white text-lg mb-3">
              <span>🧪</span> ならならの実験場
            </p>
            <p className="text-sm text-zinc-400 leading-relaxed mb-4">
              現役の会社員エンジニアが、自分で作ったサービスと自分で使ったサービスを
              試して記録している個人サイト。
              作りかけのものも、使ってみて期待外れだったものも、そのまま置いています。
            </p>
          </div>

          <div className="flex gap-8 md:gap-12">
            {/* コンテンツ */}
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">コンテンツ</p>
              <div className="flex flex-col gap-1 text-sm">
                <Link href="/career/mindset" className="hover:text-white transition-colors py-1.5">キャリアの考え方</Link>
                <Link href="/career/tenshoku" className="hover:text-white transition-colors py-1.5">転職ノウハウ</Link>
                <Link href="/career/sidejob" className="hover:text-white transition-colors py-1.5">副業の始め方</Link>
                <Link href="/career/story" className="hover:text-white transition-colors py-1.5">体験談ストーリー</Link>
                <Link href="/taishoku" className="hover:text-white transition-colors py-1.5">退職のリアル</Link>
                <Link href="/shitsugyo" className="hover:text-white transition-colors py-1.5">失業保険と退職後の手続き</Link>
                <Link href="/shikaku" className="hover:text-white transition-colors py-1.5">資格とリスキリング</Link>
                <Link href="/coaching" className="hover:text-white transition-colors py-1.5">キャリア相談とコーチング</Link>
                <Link href="/english" className="hover:text-white transition-colors py-1.5">ビジネス英語とTOEIC</Link>
                <Link href="/blog" className="hover:text-white transition-colors py-1.5">副業ブログの実験室</Link>
                <Link href="/sim" className="hover:text-white transition-colors py-1.5">スマホ代と通信費</Link>
                <Link href="/furusato" className="hover:text-white transition-colors py-1.5">ふるさと納税</Link>
                <Link href="/kaikei" className="hover:text-white transition-colors py-1.5">会計ソフトと確定申告</Link>
                <Link href="/career/diagnosis" className="hover:text-white transition-colors py-1.5">転職診断</Link>
              </div>
            </div>

            {/* 人気記事 */}
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">まずはここから</p>
              <div className="flex flex-col gap-1 text-sm">
                <Link href="/taishoku/taishoku-daiko-guide" className="hover:text-white transition-colors py-1.5 max-w-[200px] truncate">
                  退職代行の選び方ガイド
                </Link>
                <Link href="/shikaku/tenshoku-shikaku-guide" className="hover:text-white transition-colors py-1.5 max-w-[200px] truncate">
                  資格の選び方ガイド
                </Link>
                <Link href="/furusato/furusato-nouzei-guide" className="hover:text-white transition-colors py-1.5 max-w-[200px] truncate">
                  ふるさと納税の始め方
                </Link>
                <Link href="/kaikei/kaikei-soft-erabikata" className="hover:text-white transition-colors py-1.5 max-w-[200px] truncate">
                  会計ソフトの選び方
                </Link>
              </div>
            </div>

            {/* サイト情報 */}
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">サイト情報</p>
              <div className="flex flex-col gap-1 text-sm">
                <Link href="/about" className="hover:text-white transition-colors py-1.5">運営者情報</Link>
                <Link href="/privacy" className="hover:text-white transition-colors py-1.5">プライバシーポリシー</Link>
                <Link href="/disclaimer" className="hover:text-white transition-colors py-1.5">免責事項</Link>
                <Link href="/contact" className="hover:text-white transition-colors py-1.5">お問い合わせ</Link>
                <a href="/feed.xml" className="hover:text-white transition-colors py-1.5">RSSフィード</a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-800 mt-10 pt-6 text-center text-xs text-zinc-500">
          &copy; {new Date().getFullYear()} ならならの実験場（nara-career.com） All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
