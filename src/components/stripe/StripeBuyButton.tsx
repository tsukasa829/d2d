"use client";
import { useEffect } from 'react';

interface Props {
  buyButtonId?: string;
  publishableKey?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function StripeBuyButton({ buyButtonId, publishableKey, className, style }: Props) {
  // SSR 対応: クライアントでのみ描画
  if (typeof window === 'undefined') return null;

  const id = buyButtonId ?? process.env.NEXT_PUBLIC_STRIPE_BUY_BUTTON_ID;
  const key = publishableKey ?? process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  useEffect(() => {
    if (!id || !key) {
      console.warn('StripeBuyButton: missing buyButtonId or publishableKey');
      return;
    }

    const scriptSrc = 'https://js.stripe.com/v3/buy-button.js';
    // 既に読み込まれていなければ追加
    if (!document.querySelector(`script[src="${scriptSrc}"]`)) {
      const s = document.createElement('script');
      s.src = scriptSrc;
      s.async = true;
      document.body.appendChild(s);
    }
  }, [id, key]);

  // カスタム要素に属性を渡す。TypeScript向けの型は別途定義しています。
  return (
    // eslint-disable-next-line react/no-unknown-property
    <stripe-buy-button
      buy-button-id={id!}
      publishable-key={key!}
      class={className}
      // custom element の style は any として渡す
      style={style as any}
    />
  );
}
