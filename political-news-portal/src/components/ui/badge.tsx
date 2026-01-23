import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'category' | 'status';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide';
  
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    category: 'bg-red-600 text-white',
    status: 'bg-blue-100 text-blue-800',
  };

  return (
    <span className={cn(baseStyles, variants[variant], className)}>
      {children}
    </span>
  );
}
