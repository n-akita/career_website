import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description:
    "「会社員の居場所戦略」へのお問い合わせはこちらから。記事に関するご質問やご意見をお気軽にお送りください。",
  alternates: {
    canonical: "https://nara-career.com/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
