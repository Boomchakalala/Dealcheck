import { cn } from '@/lib/utils';
import { AlertCircle, Info } from 'lucide-react';

interface CalloutProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'warning';
  children: React.ReactNode;
}

export function Callout({ variant = 'info', children, className, ...props }: CalloutProps) {
  const Icon = variant === 'warning' ? AlertCircle : Info;

  const variants = {
    info: 'bg-slate-900/40 border-slate-800 text-slate-300',
    warning: 'bg-amber-500/5 border-amber-500/20 text-amber-300',
  };

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-xl border backdrop-blur-sm',
        variants[variant],
        className
      )}
      {...props}
    >
      <Icon className={cn(
        'w-4 h-4 mt-0.5 flex-shrink-0',
        variant === 'warning' ? 'text-amber-400' : 'text-emerald-400'
      )} />
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}
