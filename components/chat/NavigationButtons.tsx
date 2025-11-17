import Link from 'next/link';
import { NavigationButton as NavigationButtonType } from '@/lib/types/chat';

interface NavigationButtonsProps {
  buttons: NavigationButtonType[];
  isBot: boolean;
}

export default function NavigationButtons({ buttons, isBot }: NavigationButtonsProps) {
  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}>
      <div className={`flex flex-col gap-2 ${isBot ? 'order-2' : 'order-1'}`}>
        {buttons.map((btn, idx) => (
          <Link
            key={idx}
            href={btn.url}
            className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md text-center"
          >
            {btn.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
