import clsx from 'clsx';

export default function AppHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        'bg-[#9333EA]/20 backdrop-blur-md text-white px-4 py-6 shadow-lg border-b border-white/30',
        className
      )}
    >
      {children}
    </div>
  );
}
