"use client";
import Link from 'next/link';
import { Building2, Stethoscope, User, Check, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import PageHeader from '@/components/ui/PageHeader';

export default function ServicePlansPage() {
  const plans: Array<{
    id: string;
    name: string;
    price: string;
    icon: React.ReactNode;
    features: string[];
    popular?: boolean;
    gradient: string;
  }> = [
    {
      id: 'corporate',
      name: '法人プラン',
      price: '¥5,000,000',
      icon: <Building2 className="w-8 h-8" />,
      gradient: 'from-[#9333EA] to-[#7C3AED]',
      features: [
        '全社員対象の無制限カウンセリング',
        '専任カウンセラー配置',
        'メンタルヘルス研修',
        '管理者向けコンサルティング',
        '24時間緊急対応',
        '月次レポート提供',
      ],
    },
    {
      id: 'doctor',
      name: '医師プラン',
      price: '¥3,000,000',
      icon: <Stethoscope className="w-8 h-8" />,
      gradient: 'from-[#B794F6] to-[#9333EA]',
      features: [
        '医療従事者専門カウンセリング',
        '業界特化型サポート',
        'バーンアウト予防プログラム',
        '同僚紹介割引',
        '優先予約',
        '年間フォローアップ',
      ],
    },
    {
      id: 'personal',
      name: '個人プラン',
      price: '¥1,000,000',
      icon: <User className="w-8 h-8" />,
      popular: true,
      gradient: 'from-[#E9D5FF] to-[#B794F6]',
      features: [
        '月1回カウンセリング（年間8回）',
        'チャットサポート',
        'ビデオ/音声通話対応',
        'セルフケアツール',
        'プログレス・トラッキング',
        '柔軟なスケジュール変更',
      ],
    },
  ];

  return (
    <div className="min-h-screen max-w-md mx-auto bg-gradient-to-br from-[#E9D5FF] via-purple-100 to-[#B794F6]">
      <PageHeader title="サービスプラン" subtitle="最適なプランをお選びください" showBack />

      <div className="px-4 py-6 space-y-4">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="relative"
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                <div className="bg-gradient-to-r from-[#9333EA] to-[#B794F6] text-white px-4 py-1 rounded-full text-sm shadow-lg backdrop-blur-md border border-white/30">
                  人気プラン
                </div>
              </div>
            )}

            <div className={`bg-white/70 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden border-2 transition-all hover:shadow-2xl hover:bg-white/80 ${
              plan.popular ? 'border-white/60' : 'border-white/40'
            }`}>
              <div className={`bg-gradient-to-r ${plan.gradient} bg-opacity-80 backdrop-blur-sm text-white px-6 py-6 border-b border-white/30`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-white/30 backdrop-blur-md border border-white/40 rounded-xl flex items-center justify-center shadow-lg">
                    {plan.icon}
                  </div>
                  <div>
                    <h3 className="tracking-wide">{plan.name}</h3>
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl tracking-tight">{plan.price}</span>
                  <span className="text-white/90 text-sm">/年</span>
                </div>
              </div>

              <div className="px-6 py-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 bg-gradient-to-br from-[#B794F6] to-[#9333EA] rounded-full flex items-center justify-center mt-0.5 shadow-md border border-white/40">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-gray-800 leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex justify-center">
                  <Link
                    href={plan.id === 'personal' ? '/product/standerd/payment' : (process.env.NEXT_PUBLIC_STRIPE_STANDARD_PAYMENT_URL || '/product/1daypass')}
                    className={`mt-6 px-8 py-3 rounded-xl transition-all backdrop-blur-md border shadow-lg ${
                      plan.popular
                        ? 'bg-gradient-to-r from-[#9333EA]/80 to-[#B794F6]/80 text-white hover:shadow-xl hover:scale-[1.02] border-white/40'
                        : 'bg-white/60 text-[#9333EA] hover:bg-white/80 border-white/60'
                    }`}
                  >
                    お申し込み
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
