import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-24 text-center">
      <p className="text-6xl font-bold text-primary mb-4">404</p>
      <h1 className="text-2xl font-bold mb-4">ページが見つかりませんでした</h1>
      <p className="text-zinc-500 mb-10 leading-relaxed">
        お探しのページは移動または削除された可能性があります。
      </p>

      <div className="space-y-4 max-w-md mx-auto">
        <Link
          href="/"
          className="block bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary-dark transition-colors"
        >
          トップページへ戻る
        </Link>

        <div className="border-t border-border/60 pt-6 mt-6">
          <p className="text-sm font-semibold text-zinc-500 mb-4">人気の記事</p>
          <div className="space-y-2 text-left">
            <Link
              href="/career/environment-decides-salary"
              className="block p-3 border border-border/60 rounded-lg hover:shadow-sm hover:-translate-y-0.5 transition-all text-sm font-medium hover:text-primary"
            >
              年収を決めるのは「あなたの能力」ではなく「あなたの居場所」
            </Link>
            <Link
              href="/career/career-story"
              className="block p-3 border border-border/60 rounded-lg hover:shadow-sm hover:-translate-y-0.5 transition-all text-sm font-medium hover:text-primary"
            >
              年収400万→1,400万。5社の転職ストーリー
            </Link>
            <Link
              href="/tenshoku/jtc-complete-guide"
              className="block p-3 border border-border/60 rounded-lg hover:shadow-sm hover:-translate-y-0.5 transition-all text-sm font-medium hover:text-primary"
            >
              JTC転職の教科書
            </Link>
          </div>
        </div>

        <div className="pt-4">
          <Link
            href="/search"
            className="inline-flex items-center gap-2 text-sm text-primary font-semibold hover:underline"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            記事を検索する
          </Link>
        </div>
      </div>
    </div>
  );
}
