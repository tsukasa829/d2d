# Next.js + PGlite ToDoアプリ

PGlite（PostgreSQL互換WASM実装）を使用したNext.jsベースのToDoアプリケーション。開発環境ではPGlite、本番環境ではPostgreSQLを使用し、共通のコードベースで動作します。

## 技術スタック

- **Next.js 16** - App Router
- **TypeScript** - 型安全性
- **Zustand** - 状態管理
- **PGlite** - 開発環境用データベース（PostgreSQL互換WASM）
- **PostgreSQL** - 本番環境用データベース
- **Tailwind CSS** - スタイリング

## 特徴

- 📦 **開発/本番共通コード**: 同じSQLとロジックが両環境で動作
- 🔄 **自動マイグレーション**: アプリ起動時にデータベースを自動セットアップ
- 💾 **ファイルベース永続化**: PGliteはファイルシステムにデータを保存
- 🎯 **型安全**: TypeScriptで完全に型付け
- 🚀 **高速開発**: PostgreSQLサーバー不要で即座に開発開始

## ディレクトリ構造

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/             # Reactコンポーネント
│   └── TodoApp.tsx        # メインToDoコンポーネント
├── stores/                 # Zustandストア
│   ├── index.ts           # ストアのエクスポート
│   ├── userStore.ts       # ユーザー管理
│   └── todoStore.ts       # ToDo管理
├── lib/                    # ユーティリティ
│   ├── db.ts              # データベース操作関数
│   ├── dbClient.ts        # PostgreSQL/PGliteクライアント切り替え
│   └── migrate.ts         # マイグレーション実行
├── types/                  # TypeScript型定義
│   ├── user.ts
│   └── todo.ts
└── migrations/             # SQLマイグレーション
    ├── 000_create_schema_migrations.sql
    ├── 001_create_users.sql
    └── 002_create_todos.sql
```

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

開発環境用（`.env.local`は既に作成済み）:
```env
NODE_ENV=development
PGLITE_DATA_DIR=./data/pglite
```

本番環境用（`.env.production`）:
```env
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

初回アクセス時に自動的にマイグレーションが実行され、デモユーザーが作成されます。

## スクリプト

- `npm run dev` - 開発サーバー起動
- `npm run build` - 本番ビルド
- `npm run start` - 本番サーバー起動
- `npm run migrate` - マイグレーション手動実行
- `npm run db:reset` - データベースリセット（開発環境のみ）
- `npm run lint` - ESLint実行

## データベース設計

### Users テーブル

| カラム名 | 型 | 説明 |
|---------|-----|------|
| id | UUID | 主キー |
| email | VARCHAR(255) | メールアドレス（一意） |
| name | VARCHAR(255) | ユーザー名 |
| google_id | VARCHAR(255) | Google OAuth用（将来対応） |
| created_at | TIMESTAMP | 作成日時 |

### Todos テーブル

| カラム名 | 型 | 説明 |
|---------|-----|------|
| id | UUID | 主キー |
| user_id | UUID | ユーザーID（外部キー） |
| title | VARCHAR(500) | ToDoタイトル |
| completed | BOOLEAN | 完了フラグ |
| created_at | TIMESTAMP | 作成日時 |

## PGliteの動作

- **開発環境**: `./data/pglite`ディレクトリにデータを保存
- **永続化**: ファイルベースで再起動後もデータが保持される
- **互換性**: PostgreSQLと同じSQLが動作
- **Node.js専用**: Server ComponentsまたはAPI Routesで使用

## マイグレーション

マイグレーションは`src/migrations/`ディレクトリのSQLファイルで管理されます。

- ファイル名は番号順（例: `000_`, `001_`, `002_`）
- 実行済みマイグレーションは`schema_migrations`テーブルで管理
- 未実行のマイグレーションのみが自動実行される

新しいマイグレーションを追加:
1. `src/migrations/`に新しい`.sql`ファイルを作成
2. 番号を連番で命名（例: `003_add_column.sql`）
3. 次回起動時またはマイグレーションコマンド実行時に自動適用

## 本番環境へのデプロイ

1. PostgreSQLデータベースを準備
2. `.env.production`に`DATABASE_URL`を設定
3. ビルドとデプロイ:

```bash
npm run build
npm run start
```

Vercel、Railway、Renderなどのプラットフォームにデプロイ可能です。

## 将来の拡張

- [ ] Google OAuth認証の実装
- [ ] ToDoの優先度設定
- [ ] ToDoのカテゴリ分け
- [ ] 期限日の設定
- [ ] ユーザー間でのToDo共有

## 開発ルール

### LLMによるコード修正

> [!IMPORTANT]
> LLMはコード修正を行うたびに、**必ずgit commitを実行してください**。

- 各修正内容を明確に記録するため、修正ごとにコミットを作成します
- コミットメッセージは変更内容を簡潔に説明してください
- 例: `feat: ユーザー認証機能を追加`, `fix: ToDoの削除バグを修正`, `refactor: データベース接続ロジックを整理`

これにより、変更履歴が追跡可能になり、問題が発生した際に特定のコミットに戻すことが容易になります。

### Git操作の権限

> [!NOTE]
> Gitに関するあらゆる操作（`git add`, `git commit`, `git checkout`, `git reset`など）は、エージェントの判断で**確認なしに実行して構いません**。

エージェントは開発の流れに応じて適切にGit操作を行い、コードの変更履歴を管理します。

## トラブルシューティング

### PGliteが初期化できない

```bash
npm run db:reset
```

### マイグレーションエラー

```bash
# データディレクトリを削除して再実行
rm -rf ./data/pglite
npm run dev
```

### TypeScriptエラー

```bash
```bash
# 型定義を再インストール
npm install
```

## ライセンス

MIT
```

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
