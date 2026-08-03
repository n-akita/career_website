import type { Metadata } from "next";
import Script from "next/script";
import { Noto_Sans_JP } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { WebSiteJsonLd, OrganizationJsonLd } from "@/components/JsonLd";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nara-career.com"),
  title: {
    default: "ならならの実験場｜作ったものと使ったものの記録",
    template: "%s | ならならの実験場",
  },
  description:
    "現役の会社員エンジニアが、自分で作ったサービスと自分で使ったサービスを試して記録している個人サイト。作りかけのものも、使ってみて期待外れだったものも、判断した理由ごとそのまま置いています。",
  alternates: {
    canonical: "https://nara-career.com",
    types: {
      "application/rss+xml": "https://nara-career.com/feed.xml",
    },
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "ならならの実験場",
    title: "ならならの実験場",
    description:
      "会社員エンジニアが、自分で作ったサービスと自分で使ったサービスを試して記録している個人サイト。",
    images: [
      {
        // 静的PNGは旧サイト名が焼き込まれているため、/api/og の動的生成を正とする
        url: "https://nara-career.com/api/og",
        width: 1200,
        height: 630,
        alt: "ならならの実験場",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@nara_nara_san",
    creator: "@nara_nara_san",
    images: ["https://nara-career.com/api/og"],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "fJ5jfg772oVZ2SaK2S-UIzH6wqUoSexqGDsoqTEKG1s",
  },
  // AdSenseの所有者確認用メタタグ（サイト確認が弾かれたときの保険）
  other: {
    "google-adsense-account": "ca-pub-1375496123662459",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${notoSansJP.variable} h-full antialiased`}
    >
      <Script id="gtm" strategy="afterInteractive">{`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-TZLBHG5Q');
      `}</Script>
      <body className="min-h-full flex flex-col">
        {/* Google AdSense: React が <head> へ巻き上げるため、生HTMLに素のタグが出る */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1375496123662459"
          crossOrigin="anonymous"
        />
        <a href="#main-content" className="skip-to-content">メインコンテンツへスキップ</a>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TZLBHG5Q"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <WebSiteJsonLd />
        <OrganizationJsonLd />
        <Header />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
