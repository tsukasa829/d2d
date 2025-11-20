"use client";
import Link from "next/link";
import { CreditCard, CalendarClock, Banknote } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";

export default function StandardPaymentPage() {
  const paymentUrl = process.env.NEXT_PUBLIC_STRIPE_STANDARD_PAYMENT_URL;

  return (
    <div className="min-h-screen max-w-md mx-auto bg-gradient-to-br from-[#E9D5FF] via-purple-100 to-[#B794F6]">
      <PageHeader title="お支払い方法の選択" subtitle="ご希望の方法をお選びください" showBack />

      <div className="px-4 py-6 space-y-4">
        <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden border-2 border-white/60">
          <div className="px-6 py-6 space-y-4">
            {/* 分割払い */}
            {paymentUrl ? (
              <Link
                href={paymentUrl}
                className="flex items-center gap-3 w-full px-6 py-4 rounded-2xl transition-all backdrop-blur-md border shadow-lg bg-gradient-to-r from-[#9333EA]/80 to-[#B794F6]/80 text-white hover:shadow-xl hover:scale-[1.02] border-white/40"
              >
                <div className="w-11 h-11 bg-white/30 backdrop-blur-md border border-white/40 rounded-xl flex items-center justify-center shadow-md">
                  <CalendarClock className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium">分割払い（月額¥10,000）</p>
                  <p className="text-sm text-white/90">クレジットカード分割に対応</p>
                </div>
                <CreditCard className="w-5 h-5 text-white" />
              </Link>
            ) : (
              <button
                disabled
                className="flex items-center gap-3 w-full px-6 py-4 rounded-2xl border shadow-lg bg-white/60 text-[#9333EA] border-white/60 cursor-not-allowed"
              >
                <div className="w-11 h-11 bg-white/30 rounded-xl flex items-center justify-center border border-white/40">
                  <CalendarClock className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium">分割払い</p>
                  <p className="text-sm">準備中（決済リンク未設定）</p>
                </div>
              </button>
            )}

            {/* デビットカード払い */}
            {paymentUrl ? (
              <Link
                href={paymentUrl}
                className="flex items-center gap-3 w-full px-6 py-4 rounded-2xl transition-all backdrop-blur-md border shadow-lg bg-white/80 text-[#1f2937] hover:shadow-xl hover:bg-white/90 border-white/60"
              >
                <div className="w-11 h-11 bg-gradient-to-br from-[#B794F6] to-[#9333EA] rounded-xl flex items-center justify-center shadow-md border border-white/40">
                  <Banknote className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium">一括払い</p>
                  <p className="text-sm text-gray-600">デビット/クレジット対応</p>
                </div>
              </Link>
            ) : (
              <button
                disabled
                className="flex items-center gap-3 w-full px-6 py-4 rounded-2xl border shadow-lg bg-white/60 text-[#9333EA] border-white/60 cursor-not-allowed"
              >
                <div className="w-11 h-11 bg-white/30 rounded-xl flex items-center justify-center border border-white/40">
                  <Banknote className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium">デビットカード払い</p>
                  <p className="text-sm">準備中（決済リンク未設定）</p>
                </div>
              </button>
            )}

            <p className="text-xs text-gray-600 text-center">お支払いリンクは安全なStripe決済を利用します</p>
          </div>
        </div>
      </div>
    </div>
  );
}
