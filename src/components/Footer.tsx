import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border/60 bg-zinc-900 text-zinc-300 mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="max-w-sm">
            <p className="flex items-center gap-2 font-bold text-white text-lg mb-3">
              <span>🏢</span> ビジネスマンの居場所戦略
            </p>
            <p className="text-sm text-zinc-400 leading-relaxed">
              出世も大事。でも&ldquo;職場を変える&rdquo;だけで年収が上がることもある。
              あなたのキャリアを一歩先へ。
            </p>
          </div>

          <div className="flex gap-8 md:gap-12">
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">コンテンツ</p>
              <div className="flex flex-col gap-1 text-sm">
                <Link href="/career" className="hover:text-white transition-colors py-1.5">キャリアの考え方</Link>
                <Link href="/tenshoku" className="hover:text-white transition-colors py-1.5">転職ノウハウ</Link>
                <Link href="/sidejob" className="hover:text-white transition-colors py-1.5">副業の始め方</Link>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">サイト情報</p>
              <div className="flex flex-col gap-1 text-sm">
                <Link href="/about" className="hover:text-white transition-colors py-1.5">運営者情報</Link>
                <Link href="/privacy" className="hover:text-white transition-colors py-1.5">プライバシーポリシー</Link>
                <Link href="/contact" className="hover:text-white transition-colors py-1.5">お問い合わせ</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-800 mt-10 pt-6 text-center text-xs text-zinc-500">
          &copy; {new Date().getFullYear()} ビジネスマンの居場所戦略 All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
