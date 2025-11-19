"use client";
import { useRouter } from 'next/navigation';
import AppHeader from './AppHeader';
import { ArrowLeft } from 'lucide-react';

export default function PageHeader({
  title,
  subtitle,
  showBack = false,
  onBack,
  right,
}: {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  right?: React.ReactNode;
}) {
  const router = useRouter();
  const handleBack = () => {
    if (onBack) return onBack();
    router.back();
  };

  return (
    <AppHeader>
      <div className="flex items-center gap-3">
        {showBack && (
          <button onClick={handleBack} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
        )}
        <div>
          <h1 className="tracking-wide">{title}</h1>
          {subtitle && <p className="text-white/90 text-sm mt-1">{subtitle}</p>}
        </div>
        {right && <div className="ml-auto">{right}</div>}
      </div>
    </AppHeader>
  );
}
