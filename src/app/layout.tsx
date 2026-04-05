import type { Metadata } from "next";
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
  },
  twitter: {
    card: "summary_large_image",
    creator: "@nara_nara_san",
  },
  robots: {
    index: true,
    follow: true,
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
      <body className="min-h-full flex flex-col">
        <WebSiteJsonLd />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
