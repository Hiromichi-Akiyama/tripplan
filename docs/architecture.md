# TripPlan Architecture

## 全体構成

[ Browser (PC / Mobile) ]
        |
        | HTTPS
        v
[ Rails 7 Application ]
  - Controllers
  - Views (SSR)
  - Hotwire (Turbo / Stimulus)
        |
        v
[ MySQL Database ]

---

## ER図


## 技術要素

### フロントエンド
- Rails View (ERB)
- Turbo Drive / Turbo Streams
- Stimulus Controllers
- レスポンシブ対応（CSS）

### バックエンド
- Ruby on Rails 7
- RESTful Controllers
- ActiveRecord
- Devise（認証）

### データベース
- MySQL
- Render Managed DB
- 自動バックアップ

---

## デプロイ構成

- 開発環境：Local (Rails development)
- 本番環境：Render
- ステージング：なし（将来追加）

---

## セキュリティ
- HTTPS 強制
- CSRF / XSS 対策
- パスワードハッシュ化（Devise）

---

## パフォーマンス方針
- SSR 中心
- 部分更新は Turbo Streams
- 不要な SPA 化は行わない
