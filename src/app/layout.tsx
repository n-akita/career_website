import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { WebSiteJsonLd } from "@/components/JsonLd";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ビジネスマンの居場所戦略",
    template: "%s | ビジネスマンの居場所戦略",
  },
  description:
    "出世も大事。でも職場を変えるだけで年収が上がることもある。ベンチャーからJTCへの転職経験をもとに、キャリア戦略・転職ノウハウ・副業の始め方を発信します。",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "ビジネスマンの居場所戦略",
    title: "ビジネスマンの居場所戦略",
    description:
      "5回の転職で年収3.5倍。出世ではなく「環境を変える」キャリア戦略を発信。",
    images: [
      {
        url: "https://nara-career.com/api/og",
        width: 1200,
        height: 630,
        alt: "ビジネスマンの居場所戦略",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <Script id="gtm" strategy="afterInteractive">{`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-TZLBHG5Q');
      `}</Script>
      <body className="min-h-full flex flex-col">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TZLBHG5Q"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <WebSiteJsonLd />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
