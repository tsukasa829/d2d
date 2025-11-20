# D2D プロジェクト - LLM引き継ぎドキュメント

## プロジェクト概要

**D2D (Door to Door)** は、7日間のメンタルヘルスプログラムを提供するNext.jsアプリケーションです。ユーザーは各日のチャットセッションを通じてプログラムを進め、段階的にコンテンツにアクセスします。

### 基本情報
- **フレームワーク**: Next.js 16 (App Router)
- **言語**: TypeScript
- **UI**: Tailwind CSS v4 + motion/react
- **状態管理**: Zustand (persist middleware使用)
- **データベース**: PostgreSQL (PGlite開発環境、Neon本番環境)
- **決済**: Stripe
- **デプロイ**: Netlify

---

## プロジェクト構造

```
d2d/
├── app/                          # Next.js App Router
│   ├── api/                      # APIエンドポイント
│   │   ├── admin/users/          # ユーザー管理API
│   │   ├── chat-script/          # チャットスクリプト取得
│   │   ├── session/              # セッション管理
│   │   └── webhooks/stripe/      # Stripe Webhook
│   ├── chat/                     # チャットページ
│   │   ├── day1/ ~ day7/         # 各日のチャットページ
│   │   └── [sessionId]/          # 動的チャットルート
│   ├── product/                  # 商品/決済ページ
│   │   ├── 1daypass/             # 1日パス購入
│   │   ├── standerd/             # スタンダードプラン
│   │   └── trial/                # トライアル
│   ├── admin/                    # 管理画面
│   ├── stageup/                  # ステージアップ処理
│   ├── layout.tsx                # ルートレイアウト
│   ├── page.tsx                  # ホーム（7日間インデックス）
│   ├── loading.tsx               # グローバルローディング
│   └── globals.css               # グローバルスタイル
├── components/                   # Reactコンポーネント
│   ├── chat/                     # チャット関連
│   │   └── ChatContainer.tsx     # チャットUI本体
│   ├── session/                  # セッション管理
│   │   └── SessionInitializer.tsx
│   └── ui/                       # UI共通コンポーネント
│       ├── AppHeader.tsx         # ヘッダー
│       ├── PageHeader.tsx        # ページヘッダー
│       └── LoadingScreen.tsx     # ローディング画面
├── lib/                          # ビジネスロジック
│   ├── stores/                   # Zustandストア
│   │   └── sessionStore.ts       # ユーザーセッション状態
│   ├── types/                    # TypeScript型定義
│   │   └── session.ts            # User型
│   ├── session.ts                # セッションDB操作
│   ├── stageRules.ts             # ステージルール定義
│   ├── dbClient.ts               # DB接続管理
│   └── migrate.ts                # マイグレーション実行
├── migrations/                   # SQLマイグレーション
│   ├── 000_create_schema_migrations.sql
│   ├── 001_create_sessions.sql
│   └── 008_add_stageup_date_column.sql
├── docs/                         # ドキュメント
│   └── chats/                    # チャットスクリプト (Markdown)
├── public/                       # 静的ファイル
│   └── success-bg.png            # 成功ページ背景
└── scripts/                      # ビルド/デプロイスクリプト

```

---

## コア概念

### 1. ステージシステム

ユーザーの進捗は `stage` (数値) で管理されます。

**ステージの意味:**
- `stage = 0`: 初期状態（未登録）
- `stage = 1`: Day 1アクセス可能（初回登録時に自動設定）
- `stage = 2`: Day 1完了、Day 2アクセス可能（5分間のカウントダウン後）
- `stage = 3 ~ 7`: 以降同様

**重要な仕様:**
- `stage = N` のとき、Day 1 ~ N-1は完了済み、Day Nは進行中（カウントダウン表示）、Day N+1以降はロック
- 新規ユーザー作成時に `stage = 1` かつ `stageup_date = 現在時刻(JST)` が設定される
- ステージアップ時に `stageup_date` が更新され、次のステージへのカウントダウンが開始

### 2. カウントダウンタイマー

**仕様:**
- ホームページ (`app/page.tsx`) で表示
- `stageup_date + 5分` までの残り時間を1秒ごとに表示 (MM:SS形式)
- カウントダウン中は該当Dayカードにクロックアイコン表示、クリック不可
- `stage = 1` の場合は待機時間0（即座にDay 1アクセス可能）

**実装のポイント:**
```tsx
// useEffectの依存配列に user?.stageupDate と stage を含める
useEffect(() => {
  // stage === 1 なら待機時間0
  if (stage === 1) {
    setRemainingSeconds(null);
    return;
  }
  
  const stageupTime = new Date(user.stageupDate).getTime();
  const fiveMinutesLater = stageupTime + 5 * 60 * 1000;
  const remaining = Math.max(0, Math.floor((fiveMinutesLater - Date.now()) / 1000));
  // ...
}, [user?.stageupDate, stage]);
```

### 3. タイムゾーン処理

**重要:** すべてのタイムスタンプはJST (UTC+9) で保存・処理されます。

```typescript
// 日本時間で保存する例 (lib/session.ts)
const now = new Date();
const jstOffset = 9 * 60 * 60 * 1000;
const jstDate = new Date(now.getTime() + jstOffset);
const jstString = jstDate.toISOString().replace('Z', '+09:00');
// DB: INSERT ... VALUES ($1, $2) ... [sessionId, jstString]
```

### 4. データベーススキーマ

**sessions テーブル:**
```sql
CREATE TABLE sessions (
  session_id TEXT PRIMARY KEY,
  email TEXT,
  trial BOOLEAN DEFAULT FALSE,
  has_1day_pass BOOLEAN DEFAULT FALSE,
  has_standard BOOLEAN DEFAULT FALSE,
  stage NUMERIC(4,1) DEFAULT 0,
  stageup_date TIMESTAMP,  -- JST時刻
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_access_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5. Zustandストア

**sessionStore.ts** がユーザー状態を管理:
```typescript
interface User {
  sessionId: string;
  email: string;
  trial: boolean;
  has1DayPass: boolean;
  hasStandard: boolean;
  stage: number;
  stageupDate: Date | null;  // カウントダウン計算に使用
  createdAt: Date;
  lastAccessAt: Date;
}

// アクション
setUser(user: User)         // 完全な上書き
updateStage(stage: number)  // stageのみ更新（非推奨: stageupDate更新されない）
grant1DayPass()             // has1DayPass = true
grantStandard()             // hasStandard = true
```

**重要:** `/stageup` でAPIレスポンスを受け取ったら、`setUser(data.user)` を使って**完全なユーザーオブジェクト**で更新すること。`updateStage`だけだと`stageupDate`が更新されず、カウントダウンが動作しない。

---

## 主要ページ・機能

### ホームページ (`app/page.tsx`)

**機能:**
- 7日間プログラムのインデックス表示
- 各Dayカードの状態表示（完了/進行中/ロック）
- カウントダウンタイマー表示
- プログレスバー

**Day カードの状態:**
```tsx
const days = [
  { 
    day: 1, 
    title: "初回カウンセリング", 
    completed: stage > 1,      // 完了済み（チェックマーク）
    accessible: stage >= 1,    // アクセス可能
    path: "/chat/day1" 
  },
  // day 2 ~ 7 同様
];

const isCurrentStage = day === Math.floor(stage);  // カウントダウン表示対象
```

### チャットページ (`app/chat/day[N]/page.tsx`)

各日のチャットセッションページ。

**構造:**
```tsx
import ChatContainer from '@/components/chat/ChatContainer';

export default function Day1Page() {
  return <ChatContainer sessionId="day1" />;
}
```

**ChatContainer.tsx の役割:**
- Markdownスクリプト (`docs/chats/day1.md`) を `/api/chat-script/[sessionId]` から取得
- スクリプトをパースして会話形式で表示
- 選択肢ボタンで分岐処理

### ステージアップページ (`app/stageup/page.tsx`)

**URL:** `/stageup?nextStage=<数値>`

**処理フロー:**
1. クエリパラメータ `nextStage` を検証（現在のstageより大きい必要がある）
2. `POST /api/session/stage` でステージ更新
3. APIレスポンスの `data.user` で Zustandストアを更新 (`setUser`)
4. `/` にリダイレクト

**重要な修正ポイント:**
```tsx
if (response.ok) {
  const data = await response.json();
  // ❌ updateStage(nextStage) だけだとstageupDateが更新されない
  // ✅ 完全なuserオブジェクトで更新
  if (data.user) {
    useSessionStore.getState().setUser(data.user);
  }
}
```

### 決済成功ページ

#### 1daypass成功 (`app/product/1daypass/success/page.tsx`)
- 1日パスフラグを付与: `PATCH /api/admin/users/[id]` → `{ has1DayPass: true }`
- **リダイレクト先:** `/stageup?nextStage=3`
- 重複実行防止: `sessionStorage` でガード
- 背景: 紫グラデーション (`from-[#E9D5FF] via-purple-100 to-[#B794F6]`)

#### standerd成功 (`app/product/standerd/success/page.tsx`)
- スタンダードフラグを付与: `PATCH /api/admin/users/[id]` → `{ hasStandard: true }`
- **リダイレクト先:** `/stageup?nextStage=4`
- 同様に重複実行防止、背景は紫グラデーション

**重要な修正:**
```tsx
// 重複実行ガードでもリダイレクトする
if (sessionStorage.getItem(completedKey) === '1') {
  router.push('/stageup?nextStage=3');  // ← これがないと2回目のアクセスで止まる
  return;
}
```

### 管理画面 (`app/admin/page.tsx`)

**機能:**
- 全ユーザー一覧表示
- `stageup_date` の表示（ja-JPロケール）
- 他ユーザー一括削除ボタン（確認ダイアログあり）

---

## API エンドポイント

### セッション管理

#### `GET /api/session/init`
- 新規セッションIDを生成し、DBに保存
- 初期 `stage = 1`, `stageup_date = 現在時刻(JST)`

#### `GET/POST /api/session/stage`
- **GET:** 現在のstageを返す
- **POST:** stageを更新し、`stageup_date`を更新
  - Body: `{ stage: number, sessionId?: string }`
  - Response: `{ user: User }` （完全なユーザーオブジェクト）

### チャット

#### `GET /api/chat-script/[sessionId]`
- `docs/chats/[sessionId].md` を読み込んでパース
- Markdownの見出しレベルで構造化（speaker, content, choices）

### 管理

#### `GET /api/admin/users`
- 全ユーザーを取得

#### `PATCH /api/admin/users/[id]`
- ユーザーフラグ更新
- Body: `{ has1DayPass?: boolean, hasStandard?: boolean, ... }`

#### `DELETE /api/admin/users/[id]`
- ユーザー削除

---

## ステージルール (`lib/stageRules.ts`)

各チャットページのアクセス制御を定義:

```typescript
export interface StageRule {
  path: string;
  requiredStage: number;  // このstageのときに訪問可能
  nextStage: number;      // 訪問完了後に進める先のstage
  maxStage?: number;      // これ以上のstageでは訪問不可
}

export const STAGE_RULES: StageRule[] = [
  { path: '/chat/day1', requiredStage: 0, nextStage: 1, maxStage: 1 },
  { path: '/chat/day2', requiredStage: 1, nextStage: 2, maxStage: 2 },
  // ... day3 ~ day7
];
```

**アクセス制御の使い方:**
- ページ訪問時に `requiredStage <= currentStage <= maxStage` をチェック
- 条件を満たさない場合は `/` にリダイレクト

---

## デザインシステム

### カラーパレット

**紫グラデーション（共通背景）:**
```css
bg-gradient-to-br from-[#E9D5FF] via-purple-100 to-[#B794F6]
```

**カード背景（ガラスモーフィズム）:**
```css
bg-white/70 backdrop-blur-md border border-white/40
```

**ヘッダー:**
```css
bg-[#9333EA]/40 backdrop-blur-md text-white border-b border-white/30
```

### グラデーション使い分け

**サービスプランカードヘッダー (`app/product/standerd/page.tsx`):**
- 法人・医師プラン（薄い）: `from-[#E9D5FF] to-[#B794F6]`
- 個人プラン（中くらい）: `from-[#B794F6] to-[#9333EA]`

### アイコン

lucide-react を使用:
```tsx
import { Calendar, Clock, Check, Building2, Stethoscope, User, Sparkles } from 'lucide-react';
```

---

## よくある実装パターン

### 1. 新しいDayページを追加

**手順:**
1. `app/chat/day8/page.tsx` を作成
   ```tsx
   import ChatContainer from '@/components/chat/ChatContainer';
   export default function Day8Page() {
     return <ChatContainer sessionId="day8" />;
   }
   ```

2. `docs/chats/day8.md` にスクリプトを作成
   ```markdown
   ## SYSTEM
   Day 8のセッションへようこそ！
   
   ## USER
   こんにちは
   
   ## ASSISTANT
   今日のテーマは...
   ```

3. `lib/stageRules.ts` にルールを追加
   ```typescript
   { path: '/chat/day8', requiredStage: 7, nextStage: 8, maxStage: 8 },
   ```

4. `app/page.tsx` の `days` 配列に追加
   ```tsx
   { day: 8, title: "新しいテーマ", completed: stage > 8, accessible: stage >= 8, path: "/chat/day8" },
   ```

### 2. カウントダウン時間を変更

`app/page.tsx` の `calculateRemaining` 内:
```tsx
const fiveMinutesLater = stageupTime + 5 * 60 * 1000;  // 5分
// 10分にする場合:
const tenMinutesLater = stageupTime + 10 * 60 * 1000;
```

### 3. 新しいユーザーフラグを追加

**1. DB マイグレーション (`migrations/009_add_new_flag.sql`):**
```sql
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS new_flag BOOLEAN DEFAULT FALSE;
```

**2. 型定義 (`lib/types/session.ts`):**
```typescript
export interface User {
  // ... 既存フィールド
  newFlag: boolean;
}
```

**3. Zustandストア (`lib/stores/sessionStore.ts`):**
```typescript
grantNewFlag: () =>
  set((state) =>
    state.user ? { user: { ...state.user, newFlag: true } } : state
  ),
```

**4. DB操作 (`lib/session.ts`):**
```typescript
export async function rowToUser(row: any): Promise<User> {
  return {
    // ... 既存フィールド
    newFlag: row.new_flag ?? false,
  };
}
```

### 4. 新しいサービスプランを追加

`app/product/standerd/page.tsx` の `plans` 配列に追加:
```tsx
{
  id: 'premium',
  name: 'プレミアムプラン',
  price: '¥2,000,000',
  icon: <Star className="w-8 h-8" />,
  gradient: 'from-[#9333EA] to-[#7C3AED]',  // 濃い紫
  features: [
    '特徴1',
    '特徴2',
    // ...
  ],
},
```

---

## トラブルシューティング

### カウントダウンが動作しない

**症状:** `/stageup` から `/` にリダイレクトされた後、カウントダウンが表示されない。リロードすると表示される。

**原因:** `/stageup` で `updateStage(nextStage)` だけ呼んでおり、`stageupDate` が更新されていない。

**解決策:** APIレスポンスの完全な `user` オブジェクトで更新:
```tsx
if (data.user) {
  useSessionStore.getState().setUser(data.user);
}
```

### 決済成功後にリダイレクトされない

**症状:** 成功ページが表示されたまま止まる。

**原因:** 重複実行ガードで `setProcessing(false)` だけして `return` している。

**解決策:**
```tsx
if (sessionStorage.getItem(completedKey) === '1') {
  router.push('/stageup?nextStage=3');  // ← リダイレクトを追加
  return;
}
```

### タイムゾーンがずれる

**症状:** 日本時間でない時刻が表示される。

**原因:** `new Date()` をそのまま保存している。

**解決策:** 明示的にJST変換:
```typescript
const jstOffset = 9 * 60 * 60 * 1000;
const jstDate = new Date(now.getTime() + jstOffset);
const jstString = jstDate.toISOString().replace('Z', '+09:00');
```

---

## 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# 本番サーバー起動
npm start

# マイグレーション実行（開発環境）
npm run migrate

# マイグレーション実行（本番環境）
npm run migrate:prod

# データベースリセット（開発環境）
npm run db:reset

# テスト実行
npm test

# E2Eテスト
npm run test:e2e
```

---

## 環境変数

**.env.local (開発環境):**
```bash
# PGliteを使用（PostgreSQLサーバー不要）
USE_PGLITE=true
PGLITE_DATA_DIR=./data/pglite

# Stripe (テストモード)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**.env.production (本番環境):**
```bash
# PostgreSQL接続
DATABASE_URL=postgresql://user:pass@host/db

# Stripe (本番モード)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## デプロイ (Netlify)

**netlify.toml:**
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

**デプロイ前の準備:**
1. 環境変数を Netlify の設定画面で登録
2. PostgreSQL (Neon) のデータベースURLを設定
3. マイグレーションを実行: `npm run migrate:prod`

---

## 今後の拡張案

### 1. リマインダー機能
- 次のセッションまでの時間をメール/プッシュ通知

### 2. セッション履歴
- 各Dayの完了日時を記録
- プログレスカレンダー表示

### 3. カスタムプログラム
- 管理者が独自の7日間プログラムを作成可能に

### 4. グループセッション
- 複数ユーザーで同じチャットルームを共有

---

## 参考リソース

- [Next.js App Router ドキュメント](https://nextjs.org/docs)
- [Zustand ドキュメント](https://docs.pmnd.rs/zustand)
- [PGlite ドキュメント](https://github.com/electric-sql/pglite)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Stripe API](https://stripe.com/docs/api)

---

## 連絡先・質問

このドキュメントで不明な点があれば、コードベースを直接参照するか、プロジェクトオーナーに問い合わせてください。

**Last Updated:** 2025-11-21
