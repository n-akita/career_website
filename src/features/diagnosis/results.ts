import type { ResultType } from "./types";

export const resultTypes: Record<string, ResultType> = {
  "silent-monster": {
    type: "silent-monster",
    title: "沈黙の市場価値モンスター",
    subtitle: "能力はあるのに動いていない。市場はあなたを待っている",
    color: "text-purple-400",
    gradient: "from-purple-500 to-violet-500",
    hexColor: "#a855f7",
    hexGradientFrom: "#a855f7",
    hexGradientTo: "#8b5cf6",
    message:
      "あなたは自分の市場価値をちゃんと理解している。でも、まだ動いていない。僕も2社目のベンチャーにいた頃、「なんとなく低い気がする」と感じながら1年以上放置していた。ある日ビズリーチに登録したら、今の年収より200万高いスカウトが届いて目が覚めた。あなたの「動かない時間」は、年収で換算するといくらの損失だろう？",
    strengths: [
      "自分の市場価値を正しく認識できている。これは多くの人ができないこと",
      "情報収集力が高く、冷静に状況を分析できる",
    ],
    growthTip: "あとは「動く」だけ。最初の一歩は、ビズリーチに登録してスカウトを見ること。5分でできる",
    tieredCTAs: [
      {
        level: "light",
        label: "スカウトで自分の値段を確認する",
        sublabel: "登録5分・届くスカウトがあなたの市場価値",
        serviceId: "bizreach",
        reason: "僕も「動いていなかった時期」に登録して、今より200万高いスカウトが届いて目が覚めた",
      },
      {
        level: "medium",
        label: "プロに背中を押してもらう",
        sublabel: "「転職未定」でもOK",
        serviceId: "doda",
        reason: "僕が2回使って2回とも決めたサービス。市場価値を知った後の「次の一歩」を一緒に考えてくれる",
      },
      {
        level: "strong",
        label: "年収交渉をプロに任せる",
        sublabel: "企業との年収交渉を代行",
        serviceId: "jac",
        reason: "合否連絡が面接後10分で来た。企業との関係が深いから、年収交渉も強い",
      },
    ],
    naraStory: {
      era: "2社目ベンチャー時代（年収450万）",
      quote: "市場価値は感覚的に「低い」とわかっていた。でも動くのが面倒で1年放置した。その1年で失った年収は推定200万以上。ビズリーチに登録した翌週、670万のスカウトが来て「もっと早く動けばよかった」と後悔した。",
      result: "年収450万 → 670万。動くだけで+220万",
    },
    naraScores: { action: 30, market: 85, risk: 40, strategy: 50, adapt: 45 },
    firstCTA: {
      label: "まずスカウトで自分の値段を見る",
      serviceId: "bizreach",
    },
    nextAction: "ビズリーチに登録して、届くスカウトの年収を見てみよう。それがあなたの市場価値だ。5分で終わる。",
  },

  "lightning-mover": {
    type: "lightning-mover",
    title: "電光石火の行動派",
    subtitle: "動くのは誰より早い。あとは「設計」を加えれば無敵になる",
    color: "text-orange-400",
    gradient: "from-orange-500 to-amber-500",
    hexColor: "#f97316",
    hexGradientFrom: "#f97316",
    hexGradientTo: "#f59e0b",
    message:
      "あなたの行動力は武器だ。でも「とりあえず動く」だけだと、転職で失敗する。僕の1回目の転職がまさにそれだった。職務経歴書も書かずにエージェントに会いに行って、結果は散々。2回目以降は「市場調査→経歴書→エージェント選定」の順番を守った。同じ行動力でも、順番を変えるだけで結果は激変する。",
    strengths: [
      "行動力が高く、チャンスを逃さない",
      "変化を恐れず、新しい環境に飛び込める",
    ],
    growthTip: "動く前に30分だけ「作戦会議」をしよう。職務経歴書を書いてからエージェントに会うだけで結果が変わる",
    tieredCTAs: [
      {
        level: "light",
        label: "まず職務経歴書を用意する",
        sublabel: "60%の完成度でOK",
        serviceId: "openwork",
        reason: "企業の口コミを見ながら「自分がどう貢献できるか」を整理すると、経歴書の質が上がる",
      },
      {
        level: "medium",
        label: "プロと一緒に戦略を立てる",
        sublabel: "あなたの行動力をプロが設計に変える",
        serviceId: "doda",
        reason: "僕の行動力を「計画」に変えてくれたのがdodaのエージェント。ベンチャー経験を大手向けに翻訳してくれた",
      },
      {
        level: "strong",
        label: "非公開求人でさらに上を狙う",
        sublabel: "ハイクラス向け・企業の内情に詳しい",
        serviceId: "jac",
        reason: "行動力がある人ほど、JACのような質の高いエージェントと組むと爆発力が出る",
      },
    ],
    naraStory: {
      era: "1回目の転職（年収410万）",
      quote: "「動けばなんとかなる」と思って職務経歴書も書かずにエージェントに突撃した。結果、まともな求人を紹介してもらえなかった。2回目はdodaに経歴書を持参して行ったら、対応が全く違った。同じ行動力でも「準備」があるだけで世界が変わる。",
      result: "1回目は年収ほぼ横ばい → 2回目は+220万",
    },
    naraScores: { action: 90, market: 45, risk: 70, strategy: 30, adapt: 60 },
    firstCTA: {
      label: "今すぐプロに相談する",
      serviceId: "doda",
    },
    nextAction: "dodaに登録して、職務経歴書を持ってエージェントに会いに行こう。あなたの行動力にプロの設計力が加われば最強だ。",
  },

  "iron-wall": {
    type: "iron-wall",
    title: "鉄壁の安定キャリア",
    subtitle: "堅実さは大きな武器。でも「守り」だけでは機会を逃す",
    color: "text-blue-400",
    gradient: "from-blue-500 to-indigo-500",
    hexColor: "#3b82f6",
    hexGradientFrom: "#3b82f6",
    hexGradientTo: "#6366f1",
    message:
      "あなたは計画的にキャリアを積み上げている。それは間違いなく強みだ。でも「リスクを取らない」ことが最大のリスクになる時期がある。僕も大手で安定していた時期があったけど、「3年後の自分」が見えた瞬間に危機感を覚えた。見えるキャリアは天井が見えるキャリアだ。",
    strengths: [
      "計画性が高く、着実にキャリアを積み上げられる",
      "リスク管理ができ、失敗の可能性を最小化できる",
    ],
    growthTip: "「転職する」ではなく「市場を見る」から始めてみよう。情報を持つだけでもキャリアの選択肢は広がる",
    tieredCTAs: [
      {
        level: "light",
        label: "リスクゼロで市場を覗いてみる",
        sublabel: "スカウトを見るだけでOK",
        serviceId: "bizreach",
        reason: "転職しなくても、自分の市場価値を知っているだけで交渉力が変わる",
      },
      {
        level: "medium",
        label: "情報収集としてプロに相談する",
        sublabel: "「転職未定・情報収集したい」でOK",
        serviceId: "doda",
        reason: "転職しない選択肢も含めて、冷静にキャリアを相談できる。僕も最初は情報収集から始めた",
      },
      {
        level: "strong",
        label: "非公開のハイクラス求人を見る",
        sublabel: "安定感を維持しながら年収アップ",
        serviceId: "jac",
        reason: "堅実な人ほど、JACのような質重視のエージェントと相性がいい",
      },
    ],
    naraStory: {
      era: "3社目・大手時代（年収670万）",
      quote: "大手で安定した年収と肩書を持っていた。でも「3年後も同じことをしている自分」が見えた時、このままでは市場価値が下がると気づいた。JACに相談して別の大手に移ったら、年収は860万に。安定を手放すのが怖かったけど、結果的にもっと安定した。",
      result: "年収670万 → 860万。安定のまま+190万",
    },
    naraScores: { action: 35, market: 55, risk: 20, strategy: 85, adapt: 40 },
    firstCTA: {
      label: "まず市場価値だけ確認する",
      serviceId: "bizreach",
    },
    nextAction: "ビズリーチに登録して、スカウトを眺めるだけでいい。転職しなくても、市場価値を知っているだけでキャリアの選択肢は広がる。",
  },

  "wild-card": {
    type: "wild-card",
    title: "ワイルドカード挑戦者",
    subtitle: "リスクを恐れない挑戦心。その勢いを「結果」に変えよう",
    color: "text-red-400",
    gradient: "from-red-500 to-rose-500",
    hexColor: "#ef4444",
    hexGradientFrom: "#ef4444",
    hexGradientTo: "#f43f5e",
    message:
      "あなたはリスクを取れる人だ。それは転職市場で最も希少な武器の一つ。でも「勢いだけの転職」は痛い目を見る。僕も1回目の転職は勢いで動いて年収が横ばいだった。2回目以降は「リスクを取る×エージェントの戦略」を掛け合わせた。挑戦心にプロの知恵を載せれば、年収は跳ねる。",
    strengths: [
      "変化を恐れず挑戦できる。これは多くの人にない武器",
      "行動力とリスク耐性の両方が高く、チャンスを掴める",
    ],
    growthTip: "「飛び込む力」は十分。あとはエージェントという「パラシュート」を持って飛べば安全に着地できる",
    tieredCTAs: [
      {
        level: "light",
        label: "どんなスカウトが来るか見てみる",
        sublabel: "攻めの姿勢で市場を確認",
        serviceId: "bizreach",
        reason: "挑戦者タイプのあなたなら、スカウトの年収を見て「もっと上を狙える」と思うはず",
      },
      {
        level: "medium",
        label: "プロの戦略を武器にする",
        sublabel: "あなたの挑戦心×プロの設計",
        serviceId: "doda",
        reason: "僕のリスクテイクをdodaが「計画」に変えてくれた。勢いだけの転職と戦略的な転職は結果が全然違う",
      },
      {
        level: "strong",
        label: "ハイリスク・ハイリターンを狙う",
        sublabel: "非公開のハイクラス求人",
        serviceId: "jac",
        reason: "攻めの転職にはJACのような質重視のエージェントが必要。年収交渉も強い",
      },
    ],
    naraStory: {
      era: "1回目 → 2回目の転職比較",
      quote: "1回目は「えいや」で転職して年収ほぼ横ばい。2回目はdodaのエージェントと戦略を立てて、同じ「飛び込む力」で+220万を勝ち取った。リスクを取れる力は最強の武器。でも武器は正しく使わないと意味がない。",
      result: "無計画な転職→年収横ばい / 計画的な転職→+220万",
    },
    naraScores: { action: 85, market: 50, risk: 90, strategy: 35, adapt: 65 },
    firstCTA: {
      label: "今すぐ動き出す",
      serviceId: "doda",
    },
    nextAction: "dodaに登録して、あなたの挑戦心をプロの戦略に載せよう。「飛び込む力」×「設計力」で年収は跳ねる。",
  },

  chameleon: {
    type: "chameleon",
    title: "環境カメレオン",
    subtitle: "環境を読み、変化に適応する力。それを「選ぶ力」に進化させよう",
    color: "text-emerald-400",
    gradient: "from-emerald-500 to-teal-500",
    hexColor: "#10b981",
    hexGradientFrom: "#10b981",
    hexGradientTo: "#14b8a6",
    message:
      "あなたは環境の良し悪しを見極め、適応する力がある。でも「適応する」と「最適な環境を選ぶ」は違う。僕も以前は「与えられた環境で頑張る」タイプだった。でもdodaで「環境を選ぶ」ことを学んでから、同じ適応力で年収が260万上がった。",
    strengths: [
      "環境の良し悪しを素早く見極められる",
      "変化への適応力が高く、新しい場所でもすぐに力を発揮できる",
    ],
    growthTip: "「適応する」から「選ぶ」へ。口コミサイトで次の環境を事前リサーチすることで、適応力が最大限に活きる",
    tieredCTAs: [
      {
        level: "light",
        label: "次の環境を事前にリサーチする",
        sublabel: "社員の口コミで職場の実態がわかる",
        serviceId: "openwork",
        reason: "適応力が高い人ほど、事前に環境を知っておけば初日から全力で走れる",
      },
      {
        level: "medium",
        label: "自分に合う環境をプロと探す",
        sublabel: "あなたの適応力を活かせる場所",
        serviceId: "doda",
        reason: "僕が「環境を選ぶ」転職をできたのはdodaのおかげ。適応力×正しい環境で年収+260万",
      },
      {
        level: "strong",
        label: "企業の内情を深く知る",
        sublabel: "面接官の人柄まで教えてくれる",
        serviceId: "jac",
        reason: "JACは企業の「中の人」情報に強い。適応力が高い人ほど、事前情報があれば無敵",
      },
    ],
    naraStory: {
      era: "ベンチャー2社 → 大手への転職",
      quote: "ベンチャーでは何でもやった。適応力だけは自信があった。でも「我慢して適応する」と「最適な場所を選んで適応する」は全然違う。dodaでのエージェントに「あなたの経験は大手のDX部門で活きる」と言われて初めて「選ぶ」転職ができた。",
      result: "年収410万 → 670万。適応力を正しい場所で発揮",
    },
    naraScores: { action: 55, market: 65, risk: 50, strategy: 45, adapt: 90 },
    firstCTA: {
      label: "次の環境をリサーチする",
      serviceId: "openwork",
    },
    nextAction: "OpenWorkで気になる企業の口コミを見てみよう。あなたの適応力が最も活きる環境を見つけることが、年収アップの最短ルートだ。",
  },

  "sleeping-dragon": {
    type: "sleeping-dragon",
    title: "眠れる龍",
    subtitle: "ポテンシャルは眠っている。目覚めれば一気に飛躍する",
    color: "text-yellow-400",
    gradient: "from-yellow-500 to-amber-500",
    hexColor: "#eab308",
    hexGradientFrom: "#eab308",
    hexGradientTo: "#f59e0b",
    message:
      "あなたのスコアは全体的にバランスが取れている。裏を返せば、まだ本気を出していない。僕が最初にベンチャーにいた頃もそうだった。何となく仕事して、何となく年収に不満を感じて、でも何もしていなかった。ある日「自分の年収、安くない？」と気づいてからすべてが変わった。",
    strengths: [
      "バランスの取れた能力を持っている",
      "伸びしろが大きく、どの方向にも成長できるポテンシャルがある",
    ],
    growthTip: "まずは「自分の市場価値を知る」ことから始めよう。知るだけで、眠っていた力が目覚め始める",
    tieredCTAs: [
      {
        level: "light",
        label: "自分の市場価値を知ることから",
        sublabel: "登録5分・届くスカウトがあなたの値段",
        serviceId: "bizreach",
        reason: "僕が「目覚めた」きっかけはスカウトの年収を見たこと。今の年収との差に驚くかもしれない",
      },
      {
        level: "medium",
        label: "プロに可能性を引き出してもらう",
        sublabel: "何から始めればいいか一緒に考える",
        serviceId: "doda",
        reason: "僕が最初に相談したのがdoda。「あなたの経験はこう活かせる」と言われて目が覚めた",
      },
      {
        level: "strong",
        label: "口コミで「次の世界」を見る",
        sublabel: "いい会社がどんな場所か知る",
        serviceId: "openwork",
        reason: "口コミサイトで「いい会社」の基準を知ると、自分が何を求めているかが見えてくる",
      },
    ],
    naraStory: {
      era: "1社目ベンチャー時代（年収410万）",
      quote: "毎日なんとなく働いて、なんとなく不満を感じていた。全部「まあいいか」で済ませていた。転職面接で「希望年収は？」と聞かれて初めて自分の年収を計算した時、「安い」と気づいた。そこから4回の転職で年収は3倍になった。きっかけは「知る」ことだった。",
      result: "年収410万 → 1,200万。気づいてから全てが変わった",
    },
    naraScores: { action: 25, market: 30, risk: 25, strategy: 20, adapt: 30 },
    firstCTA: {
      label: "まず自分の市場価値を見てみる",
      serviceId: "bizreach",
    },
    nextAction: "ビズリーチに登録するだけでいい。届くスカウトの年収が、あなたの「本来の値段」だ。そこから全てが始まる。",
  },

  "grand-strategist": {
    type: "grand-strategist",
    title: "グランドストラテジスト",
    subtitle: "計画的に着実にキャリアを積む。あなたのやり方は正しい",
    color: "text-indigo-400",
    gradient: "from-indigo-500 to-blue-600",
    hexColor: "#6366f1",
    hexGradientFrom: "#6366f1",
    hexGradientTo: "#2563eb",
    message:
      "あなたは市場価値を意識しながら、戦略的にキャリアを設計できるタイプだ。これは転職市場で最強の組み合わせ。僕が860万から1,200万に上がった時もまさにこの戦略——市場調査→経歴書準備→エージェント選定→週次電話を1年間。あとはこの戦略を「実行」するだけだ。",
    strengths: [
      "キャリアを戦略的に設計できる。これは最も希少な能力",
      "市場価値への感度が高く、自分の「値段」を正確に把握できている",
    ],
    growthTip: "戦略は完璧。あとは「実行のパートナー」を見つけるだけ。ハイクラス特化のエージェントと組もう",
    tieredCTAs: [
      {
        level: "light",
        label: "ハイクラスのスカウトを確認する",
        sublabel: "戦略的に市場を分析する材料として",
        serviceId: "bizreach",
        reason: "戦略家のあなたには、まず市場データが必要。スカウトの年収と職種が最高の市場調査になる",
      },
      {
        level: "medium",
        label: "戦略を一緒に実行するパートナー",
        sublabel: "あなたの計画×プロの実行力",
        serviceId: "jac",
        reason: "僕が860→1,200万を実現した時のパートナー。戦略家には戦略を理解できるエージェントが必要",
      },
      {
        level: "strong",
        label: "粘り強く最高の一手を見つける",
        sublabel: "長期戦に付き合ってくれるエージェント",
        serviceId: "doda",
        reason: "1年間毎週電話してくれた粘り強さ。戦略的な転職は時間がかかるが、dodaは付き合ってくれる",
      },
    ],
    naraStory: {
      era: "4社目 → 5社目（現職）への転職",
      quote: "860万→1,200万の転職は「計画勝ち」だった。ビズリーチでスカウトを分析→JACで非公開求人を紹介→dodaで長期伴走。1年かかったが、計画通りに着地した。戦略がある転職は、結果が読める。",
      result: "年収860万 → 1,200万。計画通りの+340万",
    },
    naraScores: { action: 60, market: 90, risk: 45, strategy: 95, adapt: 50 },
    firstCTA: {
      label: "ハイクラスのスカウトを分析する",
      serviceId: "bizreach",
    },
    nextAction: "ビズリーチとJACの両方に登録して、市場データを集めよう。あなたの戦略力があれば、あとは実行するだけだ。",
  },

  phoenix: {
    type: "phoenix",
    title: "不死鳥リスタート",
    subtitle: "環境の変化を力に変える。何度でも復活する不死鳥",
    color: "text-rose-400",
    gradient: "from-rose-500 to-orange-500",
    hexColor: "#f43f5e",
    hexGradientFrom: "#f43f5e",
    hexGradientTo: "#f97316",
    message:
      "あなたは環境が変わっても適応し、行動できる。これは転職市場で最も強い組み合わせの一つだ。僕も4回の転職で何度も環境をリセットしてきた。でも毎回「前より良い場所」に着地できたのは、適応力と行動力が両方あったから。あなたも同じ力を持っている。",
    strengths: [
      "環境の変化に強く、新しい場所でもすぐに力を発揮できる",
      "行動力と適応力の両方を持つ。転職市場で最強の組み合わせ",
    ],
    growthTip: "あなたの力を最大化するには「次の環境選び」がカギ。口コミサイトで事前調査してから動こう",
    tieredCTAs: [
      {
        level: "light",
        label: "次の環境を事前にリサーチ",
        sublabel: "口コミで企業のリアルがわかる",
        serviceId: "openwork",
        reason: "適応力がある人ほど、正しい環境を選べば一気に花開く。事前調査が成功率を上げる",
      },
      {
        level: "medium",
        label: "プロと一緒に次の舞台を選ぶ",
        sublabel: "あなたの経験を活かせる場所",
        serviceId: "doda",
        reason: "僕が4回の転職すべてで使ったサービス。「次はどこがベストか」を一緒に考えてくれる",
      },
      {
        level: "strong",
        label: "ハイクラスの次の舞台へ",
        sublabel: "非公開求人で最高の環境を",
        serviceId: "jac",
        reason: "不死鳥タイプのあなたなら、ハイクラスの環境で一気に覚醒できる",
      },
    ],
    naraStory: {
      era: "4回の転職を通じて",
      quote: "ベンチャー2社→大手2社→現職。環境が変わるたびに不安だったけど、毎回前より良い場所に着地できた。適応力×行動力があれば、転職は「リスク」ではなく「リスタート」になる。4回の転職で年収は3倍になった。",
      result: "年収410万 → 1,200万。4回のリスタートで3倍",
    },
    naraScores: { action: 80, market: 55, risk: 65, strategy: 50, adapt: 85 },
    firstCTA: {
      label: "次の舞台をリサーチする",
      serviceId: "openwork",
    },
    nextAction: "OpenWorkで「いい環境」の基準を調べて、dodaのエージェントに「こんな環境で働きたい」と伝えよう。あなたの適応力が最も活きる場所を見つけよう。",
  },
};

// 旧タイプコードから新タイプコードへのマッピング（後方互換）
export const legacyTypeMapping: Record<string, string> = {
  "relation-escape": "phoenix",
  "environment-change": "lightning-mover",
  "skill-up": "grand-strategist",
  "work-life-balance": "iron-wall",
  "high-class": "grand-strategist",
  "market-value": "silent-monster",
  general: "sleeping-dragon",
};
