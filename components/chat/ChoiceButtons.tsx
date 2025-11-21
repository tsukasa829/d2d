"use client";
import { motion } from 'motion/react';
import { CreditCard } from 'lucide-react';
import { useEffect, useState } from 'react';

const AppleLogo = () => (
  <svg viewBox="0 0 384 512" className="w-5 h-5 fill-current">
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
  </svg>
);

const GoogleLogo = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
  </svg>
);

export default function ChoiceButtons({
  choices,
  disabled,
  onSelect,
  isPaymentMode,
}: {
  choices: { label: string; value: string }[];
  disabled?: boolean;
  onSelect: (value: string) => void;
  isPaymentMode?: boolean;
}) {
  const [os, setOs] = useState<'android' | 'apple' | 'other'>('other');

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes('android')) {
      setOs('android');
    } else if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('mac')) {
      setOs('apple');
    }
  }, []);

  const handlePaymentClick = () => {
    const url = process.env.NEXT_PUBLIC_STRIPE_1DAYPASS_PAYMENT_URL;
    if (url) {
      window.location.href = url;
    } else {
      console.error('Payment URL not found');
    }
  };

  if (!choices?.length) return null;

  if (isPaymentMode) {
    // Track if we've already rendered Apple/Google Pay buttons for PC/other OS
    let hasRenderedMobilePay = false;

    return (
      <div className="flex flex-col gap-3">
        {choices.map((c, index) => {
          const isGoogleApple = c.value.includes('google') || c.value.includes('apple');

          // Google/Apple Pay Button
          if (isGoogleApple) {
            const showApple = os === 'apple';
            const showGoogle = os === 'android';
            const showBoth = !showApple && !showGoogle;

            if (showBoth) {
              // For PC/Other: Show both buttons only once
              if (hasRenderedMobilePay) {
                return null; // Skip subsequent google/apple choices
              }
              hasRenderedMobilePay = true;

              return (
                <>
                  <motion.button
                    key="apple-pay"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0 }}
                    disabled={disabled}
                    onClick={handlePaymentClick}
                    className="w-full px-5 py-3 rounded-full bg-white/60 backdrop-blur-sm border border-white/60 text-gray-800 hover:bg-white/80 hover:border-white/80 hover:shadow-lg disabled:bg-gray-300/50 disabled:cursor-not-allowed disabled:text-gray-500 transition-all active:scale-95 font-medium flex items-center justify-center gap-2"
                  >
                    <AppleLogo /> ApplePay
                  </motion.button>
                  <motion.button
                    key="google-pay"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    disabled={disabled}
                    onClick={handlePaymentClick}
                    className="w-full px-5 py-3 rounded-full bg-white/60 backdrop-blur-sm border border-white/60 text-gray-800 hover:bg-white/80 hover:border-white/80 hover:shadow-lg disabled:bg-gray-300/50 disabled:cursor-not-allowed disabled:text-gray-500 transition-all active:scale-95 font-medium flex items-center justify-center gap-2"
                  >
                    <GoogleLogo /> GooglePay
                  </motion.button>
                </>
              );
            }

            if (showApple) {
              return (
                <motion.button
                  key="apple-pay"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0 }}
                  disabled={disabled}
                  onClick={handlePaymentClick}
                  className="w-full px-5 py-3 rounded-full bg-white/60 backdrop-blur-sm border border-white/60 text-gray-800 hover:bg-white/80 hover:border-white/80 hover:shadow-lg disabled:bg-gray-300/50 disabled:cursor-not-allowed disabled:text-gray-500 transition-all active:scale-95 font-medium flex items-center justify-center gap-2"
                >
                  <AppleLogo /> ApplePay
                </motion.button>
              );
            }

            if (showGoogle) {
              return (
                <motion.button
                  key="google-pay"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0 }}
                  disabled={disabled}
                  onClick={handlePaymentClick}
                  className="w-full px-5 py-3 rounded-full bg-white/60 backdrop-blur-sm border border-white/60 text-gray-800 hover:bg-white/80 hover:border-white/80 hover:shadow-lg disabled:bg-gray-300/50 disabled:cursor-not-allowed disabled:text-gray-500 transition-all active:scale-95 font-medium flex items-center justify-center gap-2"
                >
                  <GoogleLogo /> GooglePay
                </motion.button>
              );
            }
            return null;
          }

          // Credit Card Button
          return (
            <motion.button
              key={c.value}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              disabled={disabled}
              onClick={handlePaymentClick}
              className="w-full px-5 py-3 rounded-full bg-white/60 backdrop-blur-sm border border-white/60 text-gray-800 hover:bg-white/80 hover:border-white/80 hover:shadow-lg disabled:bg-gray-300/50 disabled:cursor-not-allowed disabled:text-gray-500 transition-all active:scale-95 font-medium flex items-center justify-center gap-2"
            >
              <CreditCard className="w-5 h-5" />
              クレジットカード
            </motion.button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {choices.map((c, index) => (
        <motion.button
          key={c.value}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          disabled={disabled}
          onClick={() => onSelect(c.value)}
          className="w-full px-5 py-3 rounded-full bg-white/60 backdrop-blur-sm border border-white/60 text-gray-800 hover:bg-white/80 hover:border-white/80 hover:shadow-lg disabled:bg-gray-300/50 disabled:cursor-not-allowed disabled:text-gray-500 transition-all active:scale-95 font-medium"
        >
          {c.label}
        </motion.button>
      ))}
    </div>
  );
}
