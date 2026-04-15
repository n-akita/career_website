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
    default: "年収を上げる転職戦略｜会社員の居場所戦略",
    template: "%s | 会社員の居場所戦略",
  },
  description:
    "5回の転職で年収3.5倍（400万→1,200万）を実現。ベンチャーから大手JTCへの転職経験をもとに、環境を変えるキャリア戦略・転職ノウハウ・副業の始め方を発信。",
  alternates: {
    canonical: "https://nara-career.com",
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "会社員の居場所戦略",
    title: "会社員の居場所戦略",
    description:
      "5回の転職で年収3.5倍。出世ではなく「環境を変える」キャリア戦略を発信。",
    images: [
      {
        url: "https://nara-career.com/images/ogp/default.png",
        width: 2848,
        height: 1504,
        alt: "会社員の居場所戦略",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@nara_nara_san",
    creator: "@nara_nara_san",
    images: ["https://nara-career.com/images/ogp/default.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "fJ5jfg772oVZ2SaK2S-UIzH6wqUoSexqGDsoqTEKG1s",
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
