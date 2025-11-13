import Link from 'next/link';

interface NavigationButtonProps {
  label: string;
  url: string;
  isBot: boolean;
}

export default function NavigationButton({ label, url, isBot }: NavigationButtonProps) {
  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}>
      <div className={`${isBot ? 'order-2' : 'order-1'}`}>
        <Link
          href={url}
          className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md"
        >
          {label}
        </Link>
      </div>
    </div>
  );
}
