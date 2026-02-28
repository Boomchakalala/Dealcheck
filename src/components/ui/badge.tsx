import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'balanced' | 'vendor-favorable' | 'high-risk' | 'default';
  children: React.ReactNode;
}

export function Badge({ variant = 'default', children, className, ...props }: BadgeProps) {
  const variants = {
    'balanced': 'bg-green-100 text-green-800 border-green-200',
    'vendor-favorable': 'bg-amber-100 text-amber-800 border-amber-200',
    'high-risk': 'bg-red-100 text-red-800 border-red-200',
    'default': 'bg-gray-100 text-gray-800 border-gray-200',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold border uppercase tracking-wide',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
