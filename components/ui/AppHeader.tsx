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
        'bg-white/5 backdrop-blur-xl text-white px-4 py-6 shadow-xl border-b border-white/10',
        className
      )}
    >
      {children}
    </div>
  );
}
