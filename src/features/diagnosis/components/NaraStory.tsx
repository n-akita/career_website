"use client";

import type { ResultType } from "../types";

type Props = {
  result: ResultType;
};

export default function NaraStory({ result }: Props) {
  return (
    <section className="bg-zinc-50 border border-border/60 rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">&#x1F4AC;</span>
        <h3 className="text-sm font-semibold text-zinc-500">僕（ならなら）の場合 — {result.naraStory.era}</h3>
      </div>
      <blockquote className="text-base text-zinc-700 font-medium leading-[1.9] mb-3">
        {result.naraStory.quote}
      </blockquote>
      <div className="flex items-end justify-end">
        <span className={`text-xs font-bold ${result.color} bg-white px-3 py-1 rounded-full border border-border/60`}>
          {result.naraStory.result}
        </span>
      </div>
    </section>
  );
}
