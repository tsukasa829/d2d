import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { updateSession1DayPass } from '@/lib/session';

// Note: Stripe SDKの初期化はリクエスト時に行い、ビルド時に環境変数が未設定でも失敗しないようにする
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature || !webhookSecret) {
      console.error('[stripe-webhook] Missing signature or webhook secret');
      return NextResponse.json({ error: 'Webhook configuration error' }, { status: 400 });
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      console.error('[stripe-webhook] Missing STRIPE_SECRET_KEY');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const stripe = require('stripe')(secretKey);

    // Stripeイベントの検証
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('[stripe-webhook] Signature verification failed:', err.message);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // checkout.session.completed イベントの処理
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;
      const sessionId = session.client_reference_id as string | undefined;

      if (sessionId) {
        console.log(`[stripe-webhook] Payment successful for user: ${sessionId}`);
        
        // 1日パスを付与
        await updateSession1DayPass(sessionId, true);
        
        console.log(`[stripe-webhook] 1-day pass granted to user: ${sessionId}`);
      } else {
        console.warn('[stripe-webhook] No client_reference_id found in session');
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('[stripe-webhook] Error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
