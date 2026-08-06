"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    // AdSense が使うグローバル配列
    adsbygoogle?: unknown[];
  }
}

// AdSense パブリッシャーID。layout.tsx で読み込むスクリプトと同じ値にすること。
const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "ca-pub-1375496123662459";

/**
 * 広告ユニット1枠。slot（広告ユニットID）を渡して使う。
 * slot が未設定のあいだは何も描画しない（プレースホルダも出さない）ため、
 * AdSense管理画面でユニットを作って環境変数を入れるまでレイアウトに影響しない。
 */
export default function AdSlot({ slot }: { slot?: string }) {
  useEffect(() => {
    if (!ADSENSE_CLIENT || !slot) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // スクリプト読み込み前などは無視
    }
  }, [slot]);

  if (!ADSENSE_CLIENT || !slot) return null;

  return (
    <ins
      className="adsbygoogle block my-8"
      style={{ display: "block" }}
      data-ad-client={ADSENSE_CLIENT}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
