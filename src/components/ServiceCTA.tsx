import Link from "next/link";
import { getGenreCta, getCtaServices, isLive, SHOW_SERVICE_CTA } from "@/lib/affiliates";

// ジャンル別サービスCTA。
// affiliateUrl が入っているサービスは外部アフィリリンク（rel=sponsored）＋「広告」バッジ、
// 未提携のサービスはサイト内の評判・比較記事への内部リンクとして表示される。
// 表示内容は lib/affiliates.ts の GENRE_CTA / AFFILIATE_SERVICES で一元管理。

export default function ServiceCTA({
  category,
  currentPath,
}: {
  category: string;
  /** 表示中の記事パス。フォールバック先が自分自身になる場合はボタンを出さない */
  currentPath?: string;
}) {
  if (!SHOW_SERVICE_CTA) return null;
  const config = getGenreCta(category);
  if (!config) return null;
  const services = getCtaServices(category);
  if (services.length === 0) return null;
  const anyLive = services.some(isLive);

  return (
    <div className="my-12 bg-muted border border-border/60 rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-2 mb-2">
        {anyLive && (
          <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
            広告
          </span>
        )}
        <p className="text-xs font-semibold text-primary tracking-wider uppercase">
          Recommended
        </p>
      </div>
      <h3 className="text-lg font-bold mb-2">{config.heading}</h3>
      {config.lead && (
        <p className="text-sm text-zinc-500 leading-relaxed mb-6">{config.lead}</p>
      )}
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
            {isLive(svc) ? (
              <a
                href={svc.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer sponsored nofollow"
                className="shrink-0 inline-flex items-center justify-center gap-1 bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-primary-dark transition-colors w-full sm:w-auto"
              >
                {svc.trackingPixel && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={svc.trackingPixel}
                    height="1"
                    width="1"
                    alt=""
                    className="absolute"
                    style={{ border: 0 }}
                  />
                )}
                {svc.cta}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            ) : svc.fallbackPath === currentPath ? null : (
              <Link
                href={svc.fallbackPath}
                className="shrink-0 inline-flex items-center justify-center gap-1 border border-primary text-primary text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-primary hover:text-white transition-colors w-full sm:w-auto"
              >
                評判・詳細を見る
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
