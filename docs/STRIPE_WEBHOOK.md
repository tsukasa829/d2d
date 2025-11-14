# Stripe Webhook Setup

## 必要な環境変数

`.env.local` に以下を追加：

```bash
# Stripe Secret Key (ダッシュボード > Developers > API keys)
STRIPE_SECRET_KEY=sk_test_...  # テスト環境
# STRIPE_SECRET_KEY=sk_live_...  # 本番環境

# Webhook Secret (Stripe CLI または ダッシュボード > Webhooks)
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Webhook設定手順

### ローカル開発（Stripe CLI使用）

1. Stripe CLIでログイン：
```bash
stripe login
```

2. Webhookをローカルにフォワード：
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

3. 表示される `whsec_...` を `.env.local` の `STRIPE_WEBHOOK_SECRET` に設定

4. テスト購入をトリガー：
```bash
stripe trigger checkout.session.completed
```

### 本番環境

1. Stripeダッシュボード > Developers > Webhooks
2. 「Add endpoint」をクリック
3. エンドポイントURL: `https://your-domain.com/api/webhooks/stripe`
4. イベント選択: `checkout.session.completed`
5. Webhook signing secret をコピーして環境変数に設定

## 動作確認

1. `/product/1daypass` にアクセス
2. Stripe Buy Buttonをクリック
3. テストカード `4242 4242 4242 4242` で購入
4. Webhookが `/api/webhooks/stripe` にPOSTされる
5. ユーザーの `has1DayPass` が `true` になる
