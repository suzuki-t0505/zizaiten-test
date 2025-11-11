// セッション0.6.2 - 2025-10-15
// データベース定義
// ESModules対応版

// ========================================
// 動画データベース
// ========================================
export const videoDatabase = {
    "010": {
        "title": "袴姿で走る和装の男性",
        "description": "紺色の袴と着物を着た男性が腕を組んで走っている様子。和装での走行動作を観察できます。",
        "characterTags": ["侍", "男性"],
        "costumeTags": ["和装", "袴", "着物", "帯"],
        "situationTags": ["走行", "腕組み", "移動"],
        "isFree": true,
        "collectionTag": "服のしわVol.1（着流しの男性）"
    },
    "011": {
        "title": "座卓で書道をする和装の男性",
        "description": "座卓の前に座り、書道をしている和装の男性。伝統的な書道シーンを描写しています。",
        "characterTags": ["侍", "書道家", "男性"],
        "costumeTags": ["和装", "着物", "袴", "座卓", "筆"],
        "situationTags": ["座り姿勢", "書道", "正座"],
        "isFree": false,
        "collectionTag": "服のしわVol.1（着流しの男性）"
    },
    "012": {
        "title": "万年筆で執筆する和装の男性",
        "description": "座卓で万年筆を使って執筆している和装の男性。和洋折衷の執筆シーンを表現しています。",
        "characterTags": ["侍", "文筆家", "男性"],
        "costumeTags": ["和装", "着物", "袴", "座卓", "万年筆"],
        "situationTags": ["座り姿勢", "執筆", "正座"],
        "isFree": false,
        "collectionTag": "服のしわVol.1（着流しの男性）"
    },
    "013": {
        "title": "立ち上がる和装の男性",
        "description": "紺色の着物を着た男性が正座から立ち上がっている様子。和装での立ち上がり動作を表現しています。",
        "characterTags": ["侍", "男性"],
        "costumeTags": ["和装", "着物", "帯"],
        "situationTags": ["立ち上がる", "動作", "座り姿勢"],
        "isFree": false,
        "collectionTag": "服のしわVol.1（着流しの男性）"
    },
    "014": {
        "title": "横になる和装の男性",
        "description": "和装の男性が床に横たわっている様子。休息や倒れるシーンに使用できます。",
        "characterTags": ["侍", "男性"],
        "costumeTags": ["和装", "着物", "袴"],
        "situationTags": ["横たわる", "休息", "寝姿"],
        "isFree": false,
        "collectionTag": "服のしわVol.1（着流しの男性）"
    },
    "015": {
        "title": "ボックスステップで踊る侍",
        "description": "紺色の袴と着物を着た侍が刀を携えてボックスステップで踊っている。和装でのダンス表現です。",
        "characterTags": ["侍", "男性"],
        "costumeTags": ["和装", "袴", "着物", "帯", "刀"],
        "situationTags": ["ダンス", "ボックスステップ", "動作"],
        "isFree": true,
        "collectionTag": "服のしわVol.1（着流しの男性）"
    },
    "016": {
        "title": "刀を持って歩く侍",
        "description": "刀を携えた侍が歩いている様子。和装での自然な歩行動作を観察できます。",
        "characterTags": ["侍", "男性"],
        "costumeTags": ["和装", "袴", "着物", "帯", "刀"],
        "situationTags": ["歩行", "移動", "立ち姿勢"],
        "isFree": false,
        "collectionTag": "服のしわVol.1（着流しの男性）"
    },
    "017": {
        "title": "挨拶する侍",
        "description": "刀を携えた侍が挨拶している様子。和装での礼儀作法を表現しています。",
        "characterTags": ["侍", "男性"],
        "costumeTags": ["和装", "袴", "着物", "帯", "刀"],
        "situationTags": ["挨拶", "礼儀", "動作"],
        "isFree": false,
        "collectionTag": "服のしわVol.1（着流しの男性）"
    },
    "018": {
        "title": "腕を組む侍",
        "description": "刀を携えた侍が腕を組んでいる様子。威厳のある立ち姿を表現しています。",
        "characterTags": ["侍", "男性"],
        "costumeTags": ["和装", "袴", "着物", "帯", "刀"],
        "situationTags": ["腕組み", "立ち姿勢", "静止"],
        "isFree": false,
        "collectionTag": "服のしわVol.1（着流しの男性）"
    },
    "020": {
        "title": "マイクパフォーマンスをするアイドル",
        "description": "クリーム色のフリルドレスを着たアイドルがマイクパフォーマンスをしている様子。ステージ上での表現を観察できます。",
        "characterTags": ["アイドル", "女性"],
        "costumeTags": ["ドレス", "フリル", "レース", "リボン", "ブーツ", "マイク"],
        "situationTags": ["マイクパフォーマンス", "歌唱", "ステージ"],
        "isFree": false,
        "collectionTag": "汎用素材Vol.2（アイドル）"
    },
    "021": {
        "title": "しゃがむアイドル",
        "description": "フリルドレスを着たアイドルがその場にしゃがんでいる様子。ステージ上での多様な動作を表現しています。",
        "characterTags": ["アイドル", "女性"],
        "costumeTags": ["ドレス", "フリル", "レース", "リボン", "ブーツ"],
        "situationTags": ["しゃがむ", "ステージ", "動作"],
        "isFree": false,
        "collectionTag": "汎用素材Vol.2（アイドル）"
    },
    "023": {
        "title": "ダンスパフォーマンスをするアイドル",
        "description": "フリルドレスのアイドルがダンスパフォーマンスをしている。ドレスの動きが鮮やかに表現されています。",
        "characterTags": ["アイドル", "女性"],
        "costumeTags": ["ドレス", "フリル", "レース", "リボン", "ブーツ"],
        "situationTags": ["ダンス", "パフォーマンス", "ステージ"],
        "isFree": true,
        "collectionTag": "汎用素材Vol.2（アイドル）"
    },
    "030": {
        "title": "歩く女子学生",
        "description": "黒のブレザーと膝丈スカートの制服を着た女子学生が歩いている様子。通学シーンを表現しています。",
        "characterTags": ["女子学生", "女性"],
        "costumeTags": ["制服", "ブレザー", "スカート", "ローファー", "靴下"],
        "situationTags": ["歩行", "移動", "学校"],
        "isFree": false,
        "collectionTag": "汎用素材Vol.1（男女の学生）"
    },
    "031": {
        "title": "服を着る女子学生",
        "description": "制服を着た女子学生が服を着ている様子。着替え動作を観察できます。",
        "characterTags": ["女子学生", "女性"],
        "costumeTags": ["制服", "ブレザー", "スカート", "ローファー", "靴下"],
        "situationTags": ["着替え", "動作", "日常"],
        "isFree": false,
        "collectionTag": "汎用素材Vol.1（男女の学生）"
    },
    "032": {
        "title": "腕を組んで歩く女子学生二人",
        "description": "制服を着た2人の女子学生が歩きながらお互いの腕を組んでいる様子。親密な友人関係を表現しています。",
        "characterTags": ["女子学生", "女性"],
        "costumeTags": ["制服", "ブレザー", "スカート", "ローファー", "靴下"],
        "situationTags": ["歩行", "腕組み", "複数人"],
        "isFree": false,
        "collectionTag": "汎用素材Vol.1（男女の学生）"
    },
    "033": {
        "title": "後ろから抱きつく女性二人",
        "description": "床に座っている女性にもう一人の女性が後ろから抱きついている様子。親密な関係性を表現しています。",
        "characterTags": ["女性"],
        "costumeTags": ["カジュアル", "パーカー", "パンツ", "スニーカー"],
        "situationTags": ["座り姿勢", "抱きつく", "複数人"],
        "isFree": false,
        "collectionTag": "汎用素材Vol.1（男女の学生）"
    },
    "034": {
        "title": "ベンチでくつろぐ男子高校生二人",
        "description": "制服姿の男子高校生二人組がベンチでくつろいでいる様子。学生の日常を表現しています。",
        "characterTags": ["男子学生", "男性"],
        "costumeTags": ["制服", "ブレザー", "スラックス", "ローファー", "ベンチ"],
        "situationTags": ["座り姿勢", "くつろぐ", "複数人"],
        "isFree": false,
        "collectionTag": "汎用素材Vol.1（男女の学生）"
    },
    "035": {
        "title": "バッグを持って歩く男子高校生二人",
        "description": "制服にベージュのジャケットを羽織った男子高校生がバッグを持ち、もう一人と一緒に歩いている様子。通学シーンを表現しています。",
        "characterTags": ["男子学生", "男性"],
        "costumeTags": ["制服", "ジャケット", "パンツ", "革靴", "バッグ"],
        "situationTags": ["歩行", "通学", "移動", "複数人"],
        "isFree": false,
        "collectionTag": "汎用素材Vol.1（男女の学生）"
    },
    "036": {
        "title": "会話する男子高校生二人",
        "description": "制服姿の2人の男子高校生が並んで立ち、会話している様子。学生同士の交流を表現しています。",
        "characterTags": ["男子学生", "男性"],
        "costumeTags": ["制服", "スラックス", "革靴", "バッグ"],
        "situationTags": ["立ち姿勢", "会話", "複数人"],
        "isFree": false,
        "collectionTag": "汎用素材Vol.1（男女の学生）"
    },
    "037": {
        "title": "歩く男子高校生",
        "description": "黒の制服を着た男子高校生が歩いている様子。通学での移動シーンを表現しています。",
        "characterTags": ["男子学生", "男性"],
        "costumeTags": ["制服", "スラックス", "革靴"],
        "situationTags": ["歩行", "通学", "移動"],
        "isFree": false,
        "collectionTag": "汎用素材Vol.1（男女の学生）"
    },
    "040": {
        "title": "ワンピースを着た女性",
        "description": "花柄のワンピースを着た女性が立っている様子。優雅で女性らしいシルエットを表現しています。",
        "characterTags": ["女性"],
        "costumeTags": ["ワンピース", "花柄", "サンダル"],
        "situationTags": ["立ち姿勢", "静止", "優雅"],
        "isFree": false,
        "collectionTag": "服のしわVol.2（ロングスカートワンピースの女性）"
    },
    "041": {
        "title": "歩いて座る女性",
        "description": "花柄のワンピースを着た女性が歩いて座る動作をしている。日常的な動作の流れを観察できます。",
        "characterTags": ["女性"],
        "costumeTags": ["ワンピース", "花柄", "サンダル"],
        "situationTags": ["歩行", "座る", "動作"],
        "isFree": false,
        "collectionTag": "服のしわVol.2（ロングスカートワンピースの女性）"
    },
    "042": {
        "title": "床に座り込む女性",
        "description": "女性が床に膝をついて座り込んでいる様子。感情的なシーンや休息を表現できます。",
        "characterTags": ["女性"],
        "costumeTags": ["カジュアル", "シャツ", "パンツ"],
        "situationTags": ["座り姿勢", "膝をつく", "休息"],
        "isFree": false,
        "collectionTag": "服のしわVol.2（ロングスカートワンピースの女性）"
    },
    "051": {
        "title": "格闘する二人の男性(トレーニングウェア)",
        "description": "グレーのタンクトップと短パンを着た2人の男性が格闘している様子。アクションシーンやトレーニングに使用できます。",
        "characterTags": ["格闘家"],
        "costumeTags": ["タンクトップ", "短パン", "スニーカー", "トレーニングウェア"],
        "situationTags": ["格闘", "アクション", "複数人"],
        "variations": ["052"],
        "isFree": false,
        "collectionTag": "アクションVol.1（ソードアクション）"
    },
    "052": {
        "title": "格闘する二人の男性(スーツ&カジュアル)",
        "description": "スーツ姿の男性とジャケット姿の男性が格闘している様子。051の衣装違いバージョンで、異なる服装での対決を表現しています。",
        "characterTags": ["ビジネスマン", "男性"],
        "costumeTags": ["スーツ", "ジャケット", "ネクタイ", "革靴", "パンツ"],
        "situationTags": ["格闘", "アクション", "複数人"],
        "variations": ["051"],
        "isFree": false,
        "collectionTag": "アクションVol.1（ソードアクション）"
    },
    "053": {
        "title": "切りかかる男性(ジャケット)",
        "description": "ジャケットとパンツ姿の男性が刀で切りかかっている様子。日常服でのアクションシーンを表現しています。",
        "characterTags": ["男性", "剣士"],
        "costumeTags": ["ジャケット", "パンツ", "シャツ", "スニーカー", "刀"],
        "situationTags": ["切りかかる", "アクション", "攻撃"],
        "variations": ["054"],
        "isFree": false,
        "collectionTag": "アクションVol.1（ソードアクション）"
    },
    "054": {
        "title": "切りかかる男性(トレーニングウェア)",
        "description": "グレーのタンクトップと短パン姿の男性が刀で切りかかっている様子。053の衣装違いバージョンで、軽装でのアクションを表現しています。",
        "characterTags": ["男性", "剣士"],
        "costumeTags": ["タンクトップ", "短パン", "スニーカー", "トレーニングウェア", "刀"],
        "situationTags": ["切りかかる", "アクション", "攻撃"],
        "variations": ["053"],
        "isFree": false,
        "collectionTag": "アクションVol.1（ソードアクション）"
    },
    "055": {
        "title": "歩く男性(ジャケット)",
        "description": "ベージュのジャケットとパンツ姿の男性が歩いている様子。日常的なカジュアルシーンを表現しています。",
        "characterTags": ["男性"],
        "costumeTags": ["ジャケット", "パンツ", "シャツ", "スニーカー"],
        "situationTags": ["歩行", "移動", "日常"],
        "isFree": false,
        "collectionTag": "アクションVol.1（ソードアクション）"
    },
    "056": {
        "title": "歩くビジネスマン",
        "description": "グレーのスーツを着た男性が歩いている様子。ビジネスシーンでの移動を表現しています。",
        "characterTags": ["ビジネスマン"],
        "costumeTags": ["スーツ", "ネクタイ", "革靴", "ジャケット"],
        "situationTags": ["歩行", "通勤", "移動"],
        "isFree": false,
        "collectionTag": "アクションVol.1（ソードアクション）"
    },
    "057": {
        "title": "格闘する二人の男性2(トレーニングウェア)",
        "description": "グレーのタンクトップと短パンを着た2人の男性が格闘している別パターン。異なる動作やアングルでのアクションシーンです。",
        "characterTags": ["格闘家"],
        "costumeTags": ["タンクトップ", "短パン", "スニーカー", "トレーニングウェア"],
        "situationTags": ["格闘", "アクション", "複数人"],
        "variations": ["058"],
        "isFree": false,
        "collectionTag": "アクションVol.1（ソードアクション）"
    },
    "058": {
        "title": "格闘する二人の男性2(スーツ&カジュアル)",
        "description": "スーツ姿の男性とジャケット姿の男性が格闘している様子。057の衣装違いバージョンで、異なる服装での対決を表現しています。",
        "characterTags": ["ビジネスマン", "男性"],
        "costumeTags": ["スーツ", "ジャケット", "革靴", "パンツ"],
        "situationTags": ["格闘", "アクション", "複数人"],
        "variations": ["057"],
        "isFree": false,
        "collectionTag": "アクションVol.1（ソードアクション）"
    }
};

// ========================================
// キャラクタータグ一覧（動的生成）
// ========================================
export const characterTags = Array.from(
    new Set(
        Object.values(videoDatabase)
            .flatMap(v => v.characterTags)
    )
).sort();
