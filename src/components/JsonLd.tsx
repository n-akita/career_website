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
        name: "ならならの実験場",
        url: "https://nara-career.com",
        description:
          "会社員エンジニアが、自分で作ったサービスと自分で使ったサービスを試して記録している個人サイト。",
        author: {
          "@type": "Person",
          name: "ならなら",
          url: "https://nara-career.com/about",        },
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
        name: "ならならの実験場",
        url: "https://nara-career.com",
        logo: "https://nara-career.com/images/avatar.png",
        founder: {
          "@type": "Person",
          name: "ならなら",
          url: "https://nara-career.com/about",        },      }}
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
        image: image || "https://nara-career.com/api/og",
        author: {
          "@type": "Person",
          name: "ならなら",
          url: "https://nara-career.com/about",        },
        publisher: {
          "@type": "Organization",
          name: "ならならの実験場",
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

export function CollectionPageJsonLd({
  name,
  description,
  url,
  items,
}: {
  name: string;
  description: string;
  url: string;
  items: { name: string; url: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name,
        description,
        url,
        mainEntity: {
          "@type": "ItemList",
          itemListElement: items.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.name,
            url: item.url,
          })),
        },
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
