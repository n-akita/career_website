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
        name: "会社員の居場所戦略",
        url: "https://nara-career.com",
        description:
          "5回の転職で年収3.5倍。出世ではなく「環境を変える」キャリア戦略を発信。",
        author: {
          "@type": "Person",
          name: "ならなら",
          url: "https://x.com/nara_nara_san",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: "https://nara-career.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      }}
    />
  );
}

export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "会社員の居場所戦略",
        url: "https://nara-career.com",
        logo: "https://nara-career.com/images/avatar.png",
        founder: {
          "@type": "Person",
          name: "ならなら",
          url: "https://x.com/nara_nara_san",
        },
        sameAs: ["https://x.com/nara_nara_san"],
      }}
    />
  );
}

export function ArticleJsonLd({
  title,
  description,
  date,
  dateModified,
  url,
  image,
}: {
  title: string;
  description: string;
  date: string;
  dateModified?: string;
  url: string;
  image?: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description,
        datePublished: date,
        dateModified: dateModified || date,
        url,
        image: image || "https://nara-career.com/images/ogp/default.png",
        author: {
          "@type": "Person",
          name: "ならなら",
          url: "https://x.com/nara_nara_san",
        },
        publisher: {
          "@type": "Organization",
          name: "会社員の居場所戦略",
          logo: {
            "@type": "ImageObject",
            url: "https://nara-career.com/images/avatar.png",
          },
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

export function FAQPageJsonLd({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      }}
    />
  );
}
