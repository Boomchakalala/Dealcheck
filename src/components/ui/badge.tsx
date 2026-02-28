import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'balanced' | 'vendor-favorable' | 'high-risk' | 'default';
  children: React.ReactNode;
}

export function Badge({ variant = 'default', children, className, ...props }: BadgeProps) {
  const variants = {
    'balanced': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'vendor-favorable': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'high-risk': 'bg-red-500/10 text-red-400 border-red-500/20',
    'default': 'bg-slate-800 text-slate-300 border-slate-700',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold border uppercase tracking-wide',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
