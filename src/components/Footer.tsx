import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border/60 bg-zinc-900 text-zinc-300 mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* ブランド */}
          <div className="max-w-sm">
            <p className="flex items-center gap-2 font-bold text-white text-lg mb-3">
              <span>🏢</span> 会社員の居場所戦略
            </p>
            <p className="text-sm text-zinc-400 leading-relaxed mb-4">
              出世も大事。でも&ldquo;職場を変える&rdquo;だけで年収が上がることもある。
              5社の転職で年収3.5倍を実現した「ならなら」が、
              環境を味方につけるキャリア戦略を発信。
            </p>
            {/* SNSアイコン */}
            <a
              href="https://x.com/nara_nara_san"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              @nara_nara_san
            </a>
          </div>

          <div className="flex gap-8 md:gap-12">
            {/* コンテンツ */}
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">コンテンツ</p>
              <div className="flex flex-col gap-1 text-sm">
                <Link href="/career" className="hover:text-white transition-colors py-1.5">キャリアの考え方</Link>
                <Link href="/tenshoku" className="hover:text-white transition-colors py-1.5">転職ノウハウ</Link>
                <Link href="/sidejob" className="hover:text-white transition-colors py-1.5">副業の始め方</Link>
                <Link href="/diagnosis" className="hover:text-white transition-colors py-1.5">転職診断</Link>
              </div>
            </div>

            {/* 人気記事 */}
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">人気の記事</p>
              <div className="flex flex-col gap-1 text-sm">
                <Link href="/career/environment-decides-salary" className="hover:text-white transition-colors py-1.5 max-w-[200px] truncate">
                  年収は「居場所」で決まる
                </Link>
                <Link href="/career/career-story" className="hover:text-white transition-colors py-1.5 max-w-[200px] truncate">
                  年収400万→1,400万の転職記録
                </Link>
                <Link href="/tenshoku/jtc-complete-guide" className="hover:text-white transition-colors py-1.5 max-w-[200px] truncate">
                  大手JTC転職の完全ガイド
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
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-800 mt-10 pt-6 text-center text-xs text-zinc-500">
          &copy; {new Date().getFullYear()} 会社員の居場所戦略 All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
