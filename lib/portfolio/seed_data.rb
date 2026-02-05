module Portfolio
  module SeedData
    # SOURCE: docs/mockups/mockup.tsx
    TRIPS = [
      {
        id: 1,
        title: "北海道 冬の旅",
        destination: "札幌・小樽",
        start_date: "2026-02-10",
        end_date: "2026-02-14",
        color: "#4c6ef5",
        packing_list: [
          { id: 1, name: "ダウンジャケット", category: "衣類", checked: true },
          { id: 2, name: "手袋", category: "衣類", checked: true },
          { id: 3, name: "カイロ", category: "その他", checked: true },
          { id: 4, name: "スノーブーツ", category: "衣類", checked: false },
          { id: 5, name: "カメラ", category: "電子機器", checked: false },
          { id: 6, name: "モバイルバッテリー", category: "電子機器", checked: false }
        ]
      },
      {
        id: 2,
        title: "沖縄 ビーチリゾート",
        destination: "那覇・石垣島",
        start_date: "2026-05-20",
        end_date: "2026-05-25",
        color: "#f06595",
        packing_list: [
          { id: 1, name: "水着", category: "衣類", checked: true },
          { id: 2, name: "サングラス", category: "衣類", checked: true },
          { id: 3, name: "日焼け止め", category: "洗面用具", checked: true },
          { id: 4, name: "ビーチサンダル", category: "衣類", checked: false },
          { id: 5, name: "防水スマホケース", category: "電子機器", checked: false },
          { id: 6, name: "タオル", category: "洗面用具", checked: false }
        ]
      },
      {
        id: 3,
        title: "京都 紅葉巡り",
        destination: "京都・奈良",
        start_date: "2026-11-10",
        end_date: "2026-11-15",
        color: "#cc5de8",
        packing_list: [
          { id: 1, name: "御朱印帳", category: "その他", checked: true },
          { id: 2, name: "歩きやすい靴", category: "衣類", checked: true },
          { id: 3, name: "ハンカチ", category: "衣類", checked: true },
          { id: 4, name: "ガイドブック", category: "書類", checked: false },
          { id: 5, name: "折り畳み傘", category: "その他", checked: false },
          { id: 6, name: "自撮り棒", category: "電子機器", checked: false }
        ]
      },
      {
        id: 4,
        title: "東京 週末旅行",
        destination: "東京",
        start_date: "2024-12-10",
        end_date: "2024-12-12",
        color: "#ff922b",
        packing_list: [
          { id: 1, name: "Suica/ICカード", category: "書類", checked: true },
          { id: 2, name: "常備薬", category: "医薬品", checked: true },
          { id: 3, name: "化粧ポーチ", category: "洗面用具", checked: true },
          { id: 4, name: "モバイルバッテリー", category: "電子機器", checked: false },
          { id: 5, name: "エコバッグ", category: "その他", checked: false },
          { id: 6, name: "着替え", category: "衣類", checked: false }
        ]
      },
      {
        id: 5,
        title: "ソウル グルメツアー",
        destination: "ソウル",
        start_date: "2023-09-15",
        end_date: "2023-09-18",
        color: "#20c997",
        packing_list: [
          { id: 1, name: "パスポート", category: "書類", checked: true },
          { id: 2, name: "変換プラグ", category: "電子機器", checked: true },
          { id: 3, name: "クレジットカード", category: "書類", checked: true },
          { id: 4, name: "胃腸薬", category: "医薬品", checked: false },
          { id: 5, name: "翻訳アプリ", category: "電子機器", checked: false },
          { id: 6, name: "ウェットティッシュ", category: "洗面用具", checked: false }
        ]
      }
    ].freeze

    # SOURCE: docs/mockups/mockup.tsx
    ACTIVITIES = [
      { id: 101, trip_id: 1, date: "2026-02-10", time: "09:00–11:00", title: "フライト 羽田→新千歳", location: "羽田空港", cost: "15000", memo: "ANA 55便" },
      { id: 102, trip_id: 1, date: "2026-02-10", time: "12:00–13:00", title: "海鮮丼ランチ", location: "新千歳空港", cost: "2500", memo: "空港内の有名店で" },
      { id: 103, trip_id: 1, date: "2026-02-10", time: "15:00–17:00", title: "札幌時計台・大通公園", location: "札幌市中央区", cost: "200", memo: "雪まつり見学" },
      { id: 104, trip_id: 1, date: "2026-02-11", time: "10:00–12:00", title: "小樽運河クルーズ", location: "小樽市", cost: "1800", memo: "冬の景色を楽しむ" },
      { id: 105, trip_id: 1, date: "2026-02-11", time: "13:00–14:30", title: "小樽寿司ランチ", location: "寿司屋通り", cost: "3500", memo: "予約済み" },
      { id: 106, trip_id: 1, date: "2026-02-11", time: "15:30–17:00", title: "オルゴール堂", location: "小樽市", cost: "0", memo: "お土産購入" },
      { id: 201, trip_id: 2, date: "2026-05-20", time: "11:00–14:00", title: "フライト 成田→那覇", location: "成田空港", cost: "12000", memo: "LCC利用" },
      { id: 202, trip_id: 2, date: "2026-05-20", time: "15:00–16:00", title: "ソーキそば", location: "那覇市内", cost: "800", memo: "到着後の軽食" },
      { id: 203, trip_id: 2, date: "2026-05-20", time: "17:00–18:00", title: "国際通り散策", location: "那覇市", cost: "0", memo: "お土産の下見" },
      { id: 204, trip_id: 2, date: "2026-05-21", time: "09:00–12:00", title: "美ら海水族館", location: "本部町", cost: "2180", memo: "朝一で行く" },
      { id: 205, trip_id: 2, date: "2026-05-21", time: "13:00–14:00", title: "カフェランチ", location: "本部町", cost: "1500", memo: "海の見えるカフェ" },
      { id: 206, trip_id: 2, date: "2026-05-21", time: "15:00–17:00", title: "エメラルドビーチ", location: "本部町", cost: "0", memo: "海水浴" },
      { id: 301, trip_id: 3, date: "2026-11-10", time: "10:00–12:00", title: "清水寺", location: "京都市東山区", cost: "400", memo: "紅葉ライトアップ前" },
      { id: 302, trip_id: 3, date: "2026-11-10", time: "12:30–13:30", title: "湯豆腐ランチ", location: "清水周辺", cost: "3000", memo: "混雑予想" },
      { id: 303, trip_id: 3, date: "2026-11-10", time: "14:00–16:00", title: "高台寺", location: "京都市東山区", cost: "600", memo: "庭園散策" },
      { id: 304, trip_id: 3, date: "2026-11-11", time: "09:00–11:00", title: "嵐山・渡月橋", location: "京都市右京区", cost: "0", memo: "早朝散歩" },
      { id: 305, trip_id: 3, date: "2026-11-11", time: "11:30–12:30", title: "京料理ランチ", location: "嵐山", cost: "4000", memo: "予約必須" },
      { id: 306, trip_id: 3, date: "2026-11-11", time: "13:00–15:00", title: "天龍寺", location: "京都市右京区", cost: "500", memo: "世界遺産" },
      { id: 401, trip_id: 4, date: "2024-12-10", time: "10:00–12:00", title: "浅草寺", location: "台東区浅草", cost: "0", memo: "雷門で写真撮影" },
      { id: 402, trip_id: 4, date: "2024-12-10", time: "12:30–13:30", title: "もんじゃ焼き", location: "月島", cost: "2000", memo: "人気店へ" },
      { id: 403, trip_id: 4, date: "2024-12-10", time: "15:00–18:00", title: "スカイツリー", location: "墨田区", cost: "3000", memo: "展望台予約済み" },
      { id: 404, trip_id: 4, date: "2024-12-11", time: "09:00–18:00", title: "ディズニーランド", location: "千葉県浦安市", cost: "8400", memo: "一日中遊ぶ" },
      { id: 405, trip_id: 4, date: "2024-12-11", time: "19:00–20:30", title: "パーク内ディナー", location: "TDL", cost: "4000", memo: "ショーを見ながら" },
      { id: 406, trip_id: 4, date: "2024-12-11", time: "21:00–22:00", title: "ホテルへ移動", location: "舞浜", cost: "0", memo: "シャトルバス" },
      { id: 501, trip_id: 5, date: "2023-09-15", time: "12:00–15:00", title: "フライト 関空→仁川", location: "関西国際空港", cost: "20000", memo: "ピーチ航空" },
      { id: 502, trip_id: 5, date: "2023-09-15", time: "17:00–18:30", title: "サムギョプサル", location: "明洞", cost: "2500", memo: "有名店" },
      { id: 503, trip_id: 5, date: "2023-09-15", time: "19:00–21:00", title: "明洞ショッピング", location: "明洞", cost: "10000", memo: "コスメ購入" },
      { id: 504, trip_id: 5, date: "2023-09-16", time: "10:00–13:00", title: "景福宮", location: "ソウル", cost: "300", memo: "チマチョゴリ体験" },
      { id: 505, trip_id: 5, date: "2023-09-16", time: "13:30–14:30", title: "参鶏湯", location: "土俗村", cost: "1800", memo: "並ぶ可能性あり" },
      { id: 506, trip_id: 5, date: "2023-09-16", time: "15:30–17:30", title: "北村韓屋村", location: "北村", cost: "0", memo: "写真スポット" }
    ].freeze
  end
end
