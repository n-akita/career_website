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
      <p className="text-xs font-semibold text-primary tracking-wider uppercase mb-2">
        Recommended
      </p>
      <h3 className="text-lg font-bold mb-6">{heading}</h3>
      <div className="space-y-4">
        {services.map((svc) => (
          <div
            key={svc.id}
            className="bg-white border border-border/60 rounded-xl p-5 flex items-start justify-between gap-4 flex-wrap"
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
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-1 bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-primary-dark transition-colors"
            >
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
