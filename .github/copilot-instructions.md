# GitHub Copilot Instructions

## Build & Deployment Rules

- **開発に必要ない場合には勝手に `npm run build` を行わない**
  - ビルドは明示的に指示された場合のみ実行する
  - 開発サーバー (`npm run dev`) で十分な場合はビルドしない

## Git Workflow Rules

- **コードをいじったら、必ず `git commit` する**
  - ファイルを編集・作成したら、適切なコミットメッセージと共にコミットする
  - コミットメッセージは変更内容を明確に記述する

- **勝手に `push` しない**
  - `git push` は実行しない
  - リモートへの反映はユーザーが手動で行う
