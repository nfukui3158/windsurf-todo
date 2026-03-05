## 0. 技術スタック
- Node.js: **v24.x LTS**（受講者の環境差を減らす）
- Next.js: **16.1.6** :contentReference[oaicite:0]{index=0}
- React: **19.2.1** :contentReference[oaicite:1]{index=1}
- TypeScript: **5.9.x** :contentReference[oaicite:2]{index=2}
- Tailwind CSS: **4.2.1** :contentReference[oaicite:3]{index=3}
- OpenAPI: **3.1.0**（仕様は3.1で書く）
- OpenAPI → TS 型生成: **openapi-typescript 7.13.0** :contentReference[oaicite:4]{index=4}
- Test: **Vitest 4.0.18** :contentReference[oaicite:5]{index=5} + **@testing-library/react 16.3.2** :contentReference[oaicite:6]{index=6}  
  （Jest を使う場合は **jest 30.2.0** :contentReference[oaicite:7]{index=7} だが、基本は Vitest を推奨）

---

## 1. 制約
- Docker を必須にしない
- ローカルDBの新規インストールを前提にしない
- 追加のバックエンドプロセス（別サーバ起動）を必須にしない  
  → **Next.js 単体で完結**させる（Route Handlers / Server Actions を活用）

---

## 2. 進め方のルール
- 変更は **小さく段階的**に進める
- 仮定がある場合は **仮定として明記**する（勝手に決めない）

---

## 3. 依存関係のルール
- 依存追加は原則しない
- 追加が必要な場合は、先に以下を文章で残す
  - 目的（なぜ必要か）
  - 代替案（入れない場合どうするか）
  - 影響範囲

---

## 4. OpenAPI を中心にする
### 4.1 方針
- **OpenAPI（openapi.yaml）が真実**
- 実装が先に進んで OpenAPI がズレるのは禁止

### 4.2 変更手順
- API 変更がある場合は、必ず次の順で進める
  1. `openapi.yaml` を更新（リクエスト/レスポンス/エラーを定義）
  2. `openapi-typescript` で型生成（生成物は `generated/` などに隔離）
  3. 実装（Route Handler / Server Action）
  4. テスト（最低1本）

### 4.3 OpenAPI 設計ルール
- OpenAPI 3.1 で書く
- `components/schemas` で型を再利用する
- 各エンドポイントに `example` を最低1つ付ける（学習・テストが楽になる）
- エラーは「コード」と「ユーザー向けメッセージ」を分ける
  - 例：`{ code: "VALIDATION_ERROR", message: "入力が不正です" }`

---

## 5. Next.js / React
### 5.1 RSC 優先
- 基本は **Server Components（RSC）優先**。
- `'use client'` は最小限（フォーム入力など Web API / ブラウザ状態が必要な部分だけ）。
- `useEffect` / `useState` は必要最小限。  
  "とりあえず state + effect" を禁止。

### 5.2 データの置き場所
- グローバル状態管理（Redux/Zustand等）は導入しない（MVPで不要）。
- 状態は **局所化**（コンポーネント境界で閉じる）。
- 共有が必要なら「サーバー側の状態/関数」に寄せる（Server Actions / Route Handlers）。

### 5.3 クライアントコンポーネントの扱い
- クライアントコンポーネントは必要に応じて `Suspense` + fallback を付ける。
- "重要でない" コンポーネントは `next/dynamic` を検討してよいが、乱用しない。

---

## 6. Tailwind CSS
### 6.1 方針
- スタイリングは Tailwind を第一選択とする。
- グローバルCSSの増殖を避け、**ユーティリティ優先**で書く。
- コンポーネント化は「見た目の共通化」ではなく「意味の共通化」を優先。

### 6.2 運用ルール
- Tailwind の標準運用（content scanning）で進める

---

## 7. フォームとバリデーション
### 7.1 二重バリデーション
- **クライアント側**：UXのための最低限（空/長さ/形式）
- **サーバー側**：セキュリティと整合性のための本命

### 7.2 スキーマ検証
- スキーマ検証は **Zod に統一**（使うなら Zod 以外は混ぜない）
- バリデーションの責務は「UI」ではなく「境界（API/Action）」に置く
- UIはエラー表示に集中

### 7.3 react-hook-form
- ToDo 程度では原則不要
- "項目が増えて制御がつらい" と判断した場合のみ導入検討してよい（導入理由が必要）

## 8. エラー処理とエッジケース
- エラーとエッジケースを優先する（空入力、存在しないID、二重送信、競合など）
- ガード句 + アーリーリターンで深いネストを避ける
- 不要な `else` は避ける（if-return 基本）
- **予想されるエラー**は戻り値でモデル化する（例外にしない）
  - 例：`{ ok: false, error: { code, message, fieldErrors? } }`
- **予想しない障害**（バグ/環境）は例外に寄せ、Next.js の error boundary で握る
  - `error.tsx` / `global-error.tsx` でフォールバックを用意（必要に応じて）

---

## 9. アクセシビリティ（a11y）
- セマンティックHTMLを使う（button/label/nav/main 等）
- 入力には `label` を必ず紐づける（`htmlFor` + `id`）
- キーボード操作で主要機能が成立すること
- ARIA は「セマンティクスで足りないときだけ」最小限にする（増やしすぎ禁止）

---

## 10. テスト
- 最低1本、**落ちると困るロジック**をテストする
  - 推奨：ドメイン（toggle/validate/filter） or API境界（バリデーション/エラー形）
- テストは "実装詳細" ではなく "利用者視点" に寄せる（RTLの原則） :contentReference[oaicite:9]{index=9}
- スナップショットは乱用しない（変更に弱い）

---

## 11. セキュリティ
- **ユーザー入力は信用しない**（サーバー側で検証・正規化）
- `dangerouslySetInnerHTML` は原則禁止
- 文字列を HTML として扱わず、React の通常レンダリングに寄せる（XSS 回避）

---

## 12. Git / PR ルール
- 1 PR = 1 目的（混ぜない）
- PR には最低限以下を書く
  - 何を変えたか（要約）
  - どう確認するか（手順）
- コミットは意味のある単位で分ける（巨大コミット禁止）---
trigger: manual
---

