import { cn } from '@/lib/utils';
import { AlertCircle, Info } from 'lucide-react';

interface CalloutProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'warning';
  children: React.ReactNode;
}

export function Callout({ variant = 'info', children, className, ...props }: CalloutProps) {
  const Icon = variant === 'warning' ? AlertCircle : Info;

  const variants = {
    info: 'bg-blue-50 border-blue-200 text-blue-900',
    warning: 'bg-amber-50 border-amber-200 text-amber-900',
  };

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-xl border',
        variants[variant],
        className
      )}
      {...props}
    >
      <Icon className={cn(
        'w-5 h-5 mt-0.5 flex-shrink-0',
        variant === 'warning' ? 'text-amber-600' : 'text-blue-600'
      )} />
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}
