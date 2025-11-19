"use client";
import Link from 'next/link';
import { Check, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import PageHeader from '@/components/ui/PageHeader';
// StripeのBuy Buttonは使用しないデザインに統一

export default function OneDayPassPage() {
  const paymentUrl = process.env.NEXT_PUBLIC_STRIPE_1DAYPASS_PAYMENT_URL;
  
  const [isAndroid, setIsAndroid] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    setIsAndroid(ua.includes('android'));
    setIsIOS(/iphone|ipad|ipod/.test(ua));
  }, []);

  return (
    <div className="min-h-screen max-w-md mx-auto bg-gradient-to-br from-[#E9D5FF] via-purple-100 to-[#B794F6]">
      <PageHeader title="1日体験パス" subtitle="まずは¥500で気軽にお試し" showBack />

      <div className="px-4 py-6">
        <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden border-2 border-white/60">
          <div className="bg-gradient-to-r from-[#9333EA] to-[#B794F6] text-white px-6 py-6 border-b border-white/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white/30 backdrop-blur-md border border-white/40 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="tracking-wide">1日体験パス</h3>
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl tracking-tight">¥500</span>
              <span className="text-white/90 text-sm">/回</span>
            </div>
          </div>

          <div className="px-6 py-6">
            <ul className="space-y-3">
              {[
                '初日コンテンツのフルアクセス',
                'スタートガイド & チェックリスト',
                'チャットサポート体験',
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-5 h-5 bg-gradient-to-br from-[#B794F6] to-[#9333EA] rounded-full flex items-center justify-center mt-0.5 shadow-md border border-white/40">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-gray-800 leading-relaxed">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-col items-stretch gap-3 w-full">
              {paymentUrl ? (
                <>
                  {/* Android/PC: Google Pay */}
                  {(isAndroid || (!isAndroid && !isIOS)) && (
                    <Link
                      href={paymentUrl}
                      className="flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl transition-all backdrop-blur-md border shadow-lg bg-white text-gray-900 hover:shadow-xl hover:scale-[1.02] border-gray-200"
                    >
                      <img src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg" alt="Google" className="w-6 h-6" />
                      <span className="font-medium">Google Pay で購入（¥500）</span>
                    </Link>
                  )}

                  {/* iOS/PC: Apple Pay */}
                  {(isIOS || (!isAndroid && !isIOS)) && (
                    <Link
                      href={paymentUrl}
                      className="flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl transition-all backdrop-blur-md border shadow-lg bg-black text-white hover:shadow-xl hover:scale-[1.02] border-gray-800"
                    >
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                      </svg>
                      <span className="font-medium">Apple Pay で購入（¥500）</span>
                    </Link>
                  )}

                  {/* すべてのデバイス: クレジットカード */}
                  <Link
                    href={paymentUrl}
                    className="flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl transition-all backdrop-blur-md border shadow-lg bg-gradient-to-r from-[#9333EA]/80 to-[#B794F6]/80 text-white hover:shadow-xl hover:scale-[1.02] border-white/40"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span className="font-medium">クレジットカードで購入（¥500）</span>
                  </Link>
                </>
              ) : (
                <button
                  disabled
                  className="px-8 py-3 rounded-xl border shadow-lg bg-white/60 text-[#9333EA] border-white/60 cursor-not-allowed"
                >
                  準備中（決済リンク未設定）
                </button>
              )}

              <p className="text-xs text-gray-600 text-center">購入後は自動で体験を開始できます</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
