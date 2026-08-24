import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  children,
  ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center rounded-xl border font-medium transition-all duration-200 ease focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50';

  const variants: Record<ButtonVariant, string> = {
    primary: 'border-white/[0.12] bg-black text-white hover:scale-[1.03] hover:border-white/[0.25] hover:shadow-[0_0_20px_rgba(120,120,255,0.2)]',
    secondary: 'border-white/[0.08] bg-black text-white/70 hover:text-white hover:scale-[1.02] hover:border-white/[0.2] hover:shadow-[0_0_20px_rgba(120,120,255,0.15)]',
    ghost: 'border-transparent bg-transparent text-white/70 hover:scale-[1.02] hover:text-white',
    outline: 'border-[#232326] bg-transparent text-white hover:border-white/[0.2] hover:bg-[#18181C]',
  };

  const sizes: Record<ButtonSize, string> = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-11 px-5 text-sm',
    lg: 'h-12 px-6 text-base',
    icon: 'h-10 w-10',
  };

  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}
