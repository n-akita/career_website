type Props = {
  data: Record<string, unknown>;
};

export default function JsonLd({ data }: Props) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebSiteJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "ビジネスマンの居場所戦略",
        url: "https://ibasho-senryaku.com",
        description:
          "5回の転職で年収3.5倍。出世ではなく「環境を変える」キャリア戦略を発信。",
        author: {
          "@type": "Person",
          name: "ならなら",
          url: "https://x.com/nara_nara_san",
        },
      }}
    />
  );
}

export function ArticleJsonLd({
  title,
  description,
  date,
  url,
}: {
  title: string;
  description: string;
  date: string;
  url: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description,
        datePublished: date,
        dateModified: date,
        url,
        author: {
          "@type": "Person",
          name: "ならなら",
          url: "https://x.com/nara_nara_san",
        },
        publisher: {
          "@type": "Organization",
          name: "ビジネスマンの居場所戦略",
        },
      }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          item: item.url,
        })),
      }}
    />
  );
}
