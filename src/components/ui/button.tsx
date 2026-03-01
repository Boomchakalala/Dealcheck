import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      default: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm hover:shadow-md',
      outline: 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300',
      secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
      ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
      destructive: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
