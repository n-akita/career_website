import { getAffiliates } from "@/lib/affiliates";
import Link from "next/link";

type Props = {
  serviceIds: string[];
  heading?: string;
};

export default function ServiceCTA({
  serviceIds,
  heading = "おすすめの転職サービス",
}: Props) {
  const services = getAffiliates(...serviceIds);

  return (
    <div className="my-12 bg-muted border border-border/60 rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
          広告
        </span>
        <p className="text-xs font-semibold text-primary tracking-wider uppercase">
          Recommended
        </p>
      </div>
      <h3 className="text-lg font-bold mb-6">{heading}</h3>
      <div className="space-y-4">
        {services.map((svc) => (
          <div
            key={svc.id}
            className="bg-white border border-border/60 rounded-xl p-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
          >
            <div className="flex-1 min-w-0">
              <p className="font-bold mb-1">{svc.name}</p>
              <p className="text-sm text-zinc-500 leading-relaxed">
                {svc.description}
              </p>
            </div>
            <a
              href={svc.url}
              target="_blank"
              rel="noopener noreferrer sponsored nofollow"
              className="shrink-0 inline-flex items-center justify-center gap-1 bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-primary-dark transition-colors w-full sm:w-auto"
            >
              {svc.trackingPixel && (
                <img src={svc.trackingPixel} height="1" width="1" alt="" className="absolute" style={{border:0}} />
              )}
              {svc.cta}
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </a>
          </div>
        ))}
      </div>
      {/* 職務経歴書ステップ */}
      <div className="mt-6 bg-amber-50 border border-amber-200/60 rounded-xl p-5">
        <p className="text-sm font-bold text-amber-900 mb-1">
          登録したら、面談の前にやること
        </p>
        <p className="text-sm text-amber-800 leading-relaxed">
          エージェントに会う前に、職務経歴書を書いておこう。完璧じゃなくていい。60%の完成度でいいから持っていく。それだけで「この人は本気だ」とエージェントの対応が変わる。
        </p>
        <Link
          href="/tenshoku/resume-for-agents"
          className="inline-flex items-center gap-1 text-sm text-amber-700 font-semibold mt-2 hover:underline"
        >
          職務経歴書の書き方を見る →
        </Link>
      </div>

      <div className="mt-4 text-center">
        <Link
          href="/diagnosis"
          className="text-sm text-primary font-semibold hover:underline"
        >
          どれが合うかわからない？ → ならなら式転職診断で調べる
        </Link>
      </div>
    </div>
  );
}
