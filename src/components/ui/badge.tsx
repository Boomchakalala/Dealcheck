import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive' | 'secondary' | 'success' | 'warning' | 'commercial' | 'legal' | 'security' | 'operational';
  children: React.ReactNode;
}

export function Badge({ variant = 'default', children, className, ...props }: BadgeProps) {
  const variants = {
    'default': 'bg-slate-100 text-slate-800 border-slate-200',
    'destructive': 'bg-red-50 text-red-700 border-red-200',
    'secondary': 'bg-slate-100 text-slate-700 border-slate-200',
    'success': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'warning': 'bg-amber-50 text-amber-700 border-amber-200',
    'commercial': 'bg-blue-50 text-blue-700 border-blue-200',
    'legal': 'bg-purple-50 text-purple-700 border-purple-200',
    'security': 'bg-orange-50 text-orange-700 border-orange-200',
    'operational': 'bg-cyan-50 text-cyan-700 border-cyan-200',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
