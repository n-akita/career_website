"use client";

type Props = {
  onStart: () => void;
};

export default function StartScreen({ onStart }: Props) {
  return (
    <div className="min-h-[80vh] bg-zinc-900 text-white flex items-center relative overflow-hidden">
      {/* パーティクル背景 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `particle ${3 + Math.random() * 4}s ease-in-out ${Math.random() * 2}s infinite alternate`,
              transform: `scale(${0.5 + Math.random() * 1.5})`,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-2xl mx-auto px-4 py-20 text-center">
        <div
          className="text-6xl mb-6"
          style={{ animation: "float 3s ease-in-out infinite" }}
        >
          &#x2694;&#xFE0F;
        </div>
        <p
          className="text-sm font-semibold text-blue-400 tracking-wider uppercase mb-4"
          style={{ animation: "fadeUp .6s ease-out .1s both" }}
        >
          Career Combat Power
        </p>
        <h1
          className="text-3xl md:text-5xl font-bold mb-4 leading-tight"
          style={{ animation: "fadeUp .6s ease-out .2s both" }}
        >
          ならなら式<br />キャリア戦闘力診断
        </h1>
        <p
          className="text-zinc-400 mb-3 leading-relaxed"
          style={{ animation: "fadeUp .6s ease-out .3s both" }}
        >
          10の質問であなたの<strong className="text-white">キャリア戦闘力</strong>を測定。<br />
          5つの武器をレーダーチャートで可視化します。
        </p>
        <p
          className="text-zinc-500 text-sm mb-10 leading-relaxed"
          style={{ animation: "fadeUp .6s ease-out .35s both" }}
        >
          4回の転職で年収410万→1,200万になった<br className="md:hidden" />
          僕の経験をもとに作りました
        </p>

        {/* 結果サンプル */}
        <div
          className="mb-10 text-left"
          style={{ animation: "fadeUp .6s ease-out .4s both" }}
        >
          <p className="text-sm font-semibold text-zinc-400 text-center mb-5">こんな結果がわかります</p>
          <div className="grid gap-3">
            {[
              { name: "沈黙の市場価値モンスター", color: "text-purple-400", desc: "能力はあるのに動いていない" },
              { name: "電光石火の行動派", color: "text-orange-400", desc: "動くのは早いが計画を加えれば無敵" },
              { name: "グランドストラテジスト", color: "text-indigo-400", desc: "計画的に着実にキャリアを積む" },
            ].map((t) => (
              <div key={t.name} className="flex items-center gap-3 p-4 rounded-xl bg-zinc-800/60 border border-zinc-700/50 backdrop-blur-sm">
                <span className="text-2xl shrink-0">&#x2694;&#xFE0F;</span>
                <div className="flex-1 min-w-0">
                  <p className={`font-bold text-sm ${t.color}`}>{t.name}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-zinc-600 text-center mt-3">...ほか全8タイプ + 5軸レーダーチャート + 推定年収アップ額</p>
        </div>

        <button
          onClick={onStart}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold px-10 py-4 rounded-xl text-lg hover:from-blue-600 hover:to-blue-700 transition-all hover:scale-105 active:scale-100 shadow-lg shadow-blue-500/25"
          style={{ animation: "fadeUp .6s ease-out .5s both" }}
        >
          無料で診断する
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
        <p
          className="text-zinc-600 text-xs mt-4"
          style={{ animation: "fadeUp .6s ease-out .45s both" }}
        >
          所要時間：約2分 / 完全無料
        </p>
      </div>

      <style>{`
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes particle{from{transform:translateY(0) scale(1)}to{transform:translateY(-30px) scale(1.5)}}
      `}</style>
    </div>
  );
}
