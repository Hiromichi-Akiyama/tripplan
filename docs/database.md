# Database Design (TripPlan)

このドキュメントは TripPlan の **DB設計の詳細（実装の正本）** です。  
ER図（画像/URL）と合わせて、マイグレーション・モデル実装時の参照元とします。

---

## Overview

- Trip を中心にしたシンプルな構成（**Users 1:N Trips / Trips 1:N Activities / Trips 1:N PackingItems**）
- **共同編集（TripMembers 等）は MVP では扱わない**
- メモは **Trips.notes（text）に集約**（Notes テーブルは MVP では作らない）
- Trip 削除時は関連データを **dependent: :destroy** でまとめて削除（物理削除）

---

## ER Diagram

> ここに ER 図を貼ってください（画像 or 外部URL）。

例（画像を置く場合）：
```md
![ER Diagram](./images/er_diagram.png)
```

例（dbdiagram の URL を置く場合）：
```md
ER: https://dbdiagram.io/...
```

---

## Tables

### users

#### Columns

| column | type | null | default | note |
|---|---|---:|---:|---|
| id | bigint | false |  | PK |
| name | string | true |  | 表示名（任意、最大50文字） |
| email | string | false |  | 一意・ログインID |
| encrypted_password | string | false |  | Devise |
| reset_password_token | string | true |  | Devise |
| reset_password_sent_at | datetime | true |  | Devise |
| remember_created_at | datetime | true |  | Devise |
| created_at | datetime | false |  | |
| updated_at | datetime | false |  | |

#### Indexes

- UNIQUE: `email`
- (Devise) `reset_password_token` など Devise 標準インデックス

#### Relations

- `has_many :trips, dependent: :destroy`

---

### trips

#### Columns

| column | type | null | default | note |
|---|---|---:|---:|---|
| id | bigint | false |  | PK |
| user_id | bigint | false |  | FK -> users.id |
| title | string | false |  | 必須 |
| destination | string | true |  | 目的地（任意） |
| start_date | date | false |  | 必須 |
| end_date | date | false |  | 必須 |
| color | string | true |  | テーマカラー（例: #1e90ff） |
| notes | text | true |  | 旅全体メモ（MVPはここに集約） |
| created_at | datetime | false |  | |
| updated_at | datetime | false |  | |

#### Indexes

- `index_trips_on_user_id`
- 並び替え・検索用途で必要なら将来 `start_date`, `end_date` へ追加検討

#### Validations / Rules

- `start_date` / `end_date` 必須
- `start_date <= end_date` を必須  
  - エラーメッセージ例：`終了日は開始日以降の日付を選択してください`

#### Relations

- `belongs_to :user`
- `has_many :activities, dependent: :destroy`
- `has_many :packing_items, dependent: :destroy`

---

### activities

> 旅程（スケジュール）  
> date と time を統合し **datetime の開始・終了**で持つ（`date_start_time`, `date_end_time`）。

#### Columns

| column | type | null | default | note |
|---|---|---:|---:|---|
| id | bigint | false |  | PK |
| trip_id | bigint | false |  | FK -> trips.id |
| date_start_time | datetime | true |  | 日付は必須だが、時刻は任意（※下記参照） |
| date_end_time | datetime | true |  | 任意 |
| title | string | false |  | 必須 |
| location | string | true |  | 任意 |
| cost | integer | true |  | 円、0以上（NULL許容） |
| memo | text | true |  | 任意 |
| address | string | true |  | 任意 |
| url | string | true |  | 任意 |
| booking_code | string | true |  | 任意 |
| display_order | integer | false | 1 | 同一条件内の表示順 |
| created_at | datetime | false |  | |
| updated_at | datetime | false |  | |

#### Indexes

- `index_activities_on_trip_id`
- ソート/一覧最適化（推奨）  
  - `index_activities_on_trip_id_and_date_start_time`
  - `index_activities_on_trip_id_and_display_order`

#### Validations / Rules

- 必須：`title`
- 「日付」は必須だが、時刻は任意のため以下の運用を採用：
  - 日付のみ入力の場合：`date_start_time` は **当日 00:00** で保存する（表示時は「時刻なし」扱いにする）
  - 時刻ありの場合：`date_start_time` に正確な日時を保存する
- `cost` は **0以上の整数**（マイナス不可）
- 通貨は **円のみ**

#### Sorting Rule (MVP)

Activity 一覧の表示順は以下：

1. `date_start_time` の **日付** 昇順  
2. `date_start_time` に「時刻あり」→「時刻なし」  
3. （時刻ありの中で）時刻昇順  
4. `display_order` 昇順

> ※「時刻なし」は同一日の末尾にまとめる。

#### Relations

- `belongs_to :trip`

---

### packing_items

#### Columns

| column | type | null | default | note |
|---|---|---:|---:|---|
| id | bigint | false |  | PK |
| trip_id | bigint | false |  | FK -> trips.id |
| name | string | false |  | 必須 |
| category | string | true |  | 固定カテゴリ（未選択可） |
| checked | boolean | false | false | 準備済み |
| display_order | integer | false | 1 | 表示順 |
| created_at | datetime | false |  | |
| updated_at | datetime | false |  | |

#### Indexes

- `index_packing_items_on_trip_id`
- （推奨）`index_packing_items_on_trip_id_and_category`
- （推奨）`index_packing_items_on_trip_id_and_checked`

#### Category (Fixed List)

固定カテゴリ候補（MVP）：

- 衣類
- 洗面・バス用品
- 電子機器
- 貴重品・書類
- 薬・ヘルスケア
- その他

運用：
- 未選択の場合は表示上「その他」または「カテゴリなし」にまとめる

#### Display Rule (MVP)

- カテゴリごとに表示
- 各カテゴリ内で：
  1. 未チェック
  2. チェック済み（グレーアウト＋取り消し線）
- それぞれのグループ内は `display_order` 昇順

#### Relations

- `belongs_to :trip`

---

## Cascading Delete Policy

- Trip を削除した場合、紐づく以下は **同時に物理削除**する：
  - Activities
  - PackingItems
- 論理削除・アーカイブは MVP では実装しない（将来対応）

---

## Notes about Future Extensions

将来対応の拡張案（DB変更が必要になるもの）：

- 公開リンク（共有）  
  - `trips` に `public_token` / `is_public` 等を追加するか、`share_links` テーブルを新設
- 共同編集  
  - `trip_members` 中間テーブル（users と trips の many-to-many）
- 持ち物カテゴリのカスタマイズ  
  - `packing_categories` テーブル（ユーザー単位 or Trip単位）

---

## Appendix: Minimal Rails Model Sketch (Reference)

> 実装時のイメージ（このドキュメントは設計正本。コードは変更され得ます）

- User
  - has_many :trips, dependent: :destroy
- Trip
  - belongs_to :user
  - has_many :activities, dependent: :destroy
  - has_many :packing_items, dependent: :destroy
- Activity
  - belongs_to :trip
- PackingItem
  - belongs_to :trip
