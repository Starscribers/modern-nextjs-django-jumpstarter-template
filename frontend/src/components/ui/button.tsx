import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative select-none',
  {
    variants: {
      // primary stylistic surface / structure
      variant: {
        default:
          'bg-gradient-to-r from-cyan-500/15 to-blue-500/15 dark:from-cyan-500/20 dark:to-blue-500/20 backdrop-blur-md border border-cyan-400/40 dark:border-cyan-400/30 text-cyan-700 dark:text-cyan-100 shadow-lg shadow-cyan-500/10 dark:shadow-cyan-500/20 hover:shadow-cyan-500/20 dark:hover:shadow-cyan-500/30 hover:shadow-xl hover:border-cyan-400/60 dark:hover:border-cyan-400/50 hover:from-cyan-500/25 hover:to-blue-500/25 dark:hover:from-cyan-500/30 dark:hover:to-blue-500/30 hover:scale-[1.02] active:scale-[0.98] before:absolute before:pointer-events-none before:rounded-[inherit] before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/30 dark:before:via-white/10 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700',
        destructive:
          'bg-gradient-to-r from-red-500/12 to-orange-500/12 dark:from-red-500/20 dark:to-orange-500/20 backdrop-blur-md border border-red-500/40 dark:border-red-400/30 text-red-700 dark:text-red-100 shadow-lg shadow-red-500/10 dark:shadow-red-500/20 hover:shadow-red-500/20 dark:hover:shadow-red-500/30 hover:shadow-xl hover:border-red-500/60 dark:hover:border-red-400/50 hover:from-red-500/22 hover:to-orange-500/22 dark:hover:from-red-500/30 dark:hover:to-orange-500/30 hover:scale-[1.02] active:scale-[0.98] before:absolute before:pointer-events-none before:rounded-[inherit] before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/25 dark:before:via-white/10 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700',
        outline:
          'bg-gradient-to-r from-slate-300/40 to-slate-400/40 dark:from-slate-500/10 dark:to-slate-600/10 backdrop-blur-md border border-slate-400/70 dark:border-slate-400/40 text-slate-800 dark:text-slate-200 shadow-lg shadow-slate-400/10 dark:shadow-slate-500/10 hover:shadow-slate-400/20 dark:hover:shadow-slate-500/20 hover:shadow-xl hover:border-slate-500/80 dark:hover:border-slate-400/60 hover:from-slate-300/55 hover:to-slate-400/55 dark:hover:from-slate-500/20 dark:hover:to-slate-600/20 hover:scale-[1.02] active:scale-[0.98] before:absolute before:pointer-events-none before:rounded-[inherit] before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/40 dark:before:via-white/5 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700',
        secondary:
          'bg-gradient-to-r from-slate-200/70 to-slate-300/70 dark:from-slate-600/20 dark:to-slate-700/20 backdrop-blur-md border border-slate-300 dark:border-slate-500/30 text-slate-800 dark:text-slate-100 shadow-lg shadow-slate-300/30 dark:shadow-slate-600/20 hover:shadow-slate-300/50 dark:hover:shadow-slate-600/30 hover:shadow-xl hover:border-slate-400 dark:hover:border-slate-500/50 hover:from-slate-200/90 hover:to-slate-300/90 dark:hover:from-slate-600/30 dark:hover:to-slate-700/30 hover:scale-[1.02] active:scale-[0.98] before:absolute before:pointer-events-none before:rounded-[inherit] before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/50 dark:before:via-white/10 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700',
        ghost:
          'bg-transparent border border-transparent text-slate-600 dark:text-slate-300 hover:bg-gradient-to-r hover:from-slate-200/70 hover:to-slate-300/70 dark:hover:from-slate-500/20 dark:hover:to-slate-600/20 hover:backdrop-blur-md hover:border-slate-300 dark:hover:border-slate-400/40 hover:text-slate-900 dark:hover:text-white hover:shadow-lg hover:shadow-slate-300/30 dark:hover:shadow-slate-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300',
        link:
          'bg-transparent border border-transparent text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 hover:bg-cyan-500/10 hover:backdrop-blur-sm hover:border-cyan-400/30 hover:shadow-lg hover:shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 underline underline-offset-4 decoration-cyan-500/40 dark:decoration-cyan-400/50 hover:decoration-cyan-600 dark:hover:decoration-cyan-400',
        glass:
          'bg-gradient-to-r from-white to-slate-50 dark:from-white/10 dark:to-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/20 text-slate-800 dark:text-white shadow-2xl shadow-slate-200/40 dark:shadow-white/10 hover:shadow-slate-300/60 dark:hover:shadow-white/20 hover:shadow-2xl hover:border-slate-300 dark:hover:border-white/30 hover:from-white hover:to-slate-50 dark:hover:from-white/15 dark:hover:to-white/10 hover:scale-[1.02] active:scale-[0.98] before:absolute before:pointer-events-none before:rounded-[inherit] before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/60 dark:before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700',
        neon:
          'bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-transparent dark:bg-black/50 backdrop-blur-md border border-cyan-500/50 dark:border-cyan-400/60 text-cyan-700 dark:text-cyan-100 shadow-lg shadow-cyan-500/20 dark:shadow-cyan-400/30 hover:shadow-cyan-500/40 dark:hover:shadow-cyan-400/50 hover:shadow-xl hover:border-cyan-500/70 dark:hover:border-cyan-400/80 hover:bg-cyan-500/15 dark:hover:bg-cyan-400/10 hover:scale-[1.02] active:scale-[0.98] before:absolute before:pointer-events-none before:rounded-[inherit] before:inset-0 before:bg-gradient-to-r before:from-cyan-400/0 before:via-cyan-500/40 dark:before:via-cyan-400/30 before:to-cyan-400/0 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700',
      },
      // color accent overlay (applied on top for thematic palette). Not used for link/ghost normally but allowed.
      themeColor: {
        none: '',
        cyan: 'data-[variant~="default"]:from-cyan-500/20 data-[variant~="default"]:to-blue-500/20 focus-visible:ring-cyan-400/50',
        blue: 'focus-visible:ring-blue-400/50 [data-theme-color=blue]&:shadow-blue-500/20',
        purple: 'focus-visible:ring-purple-400/50',
        emerald: 'focus-visible:ring-emerald-400/50',
        amber: 'focus-visible:ring-amber-400/50',
        rose: 'focus-visible:ring-rose-400/50',
      },
      size: {
        // line-height set implicitly via flex centering; remove vertical padding to avoid extra height
        default: 'h-11 px-5',
        sm: 'h-9 rounded-lg px-4 text-xs',
        lg: 'h-13 rounded-2xl px-7 text-base',
        xl: 'h-15 rounded-2xl px-9 text-lg',
        hero: 'h-16 rounded-2xl px-10 text-lg md:text-xl font-semibold gap-3',
        icon: 'size-11',
      },
      density: {
        normal: '',
        compact: 'px-3 text-[0.8rem] h-9 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      themeColor: 'none',
      size: 'default',
      density: 'normal',
    },
  }
);

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, themeColor, density, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        data-variant={variant}
        data-theme-color={themeColor}
        data-density={density}
        className={cn(buttonVariants({ variant, size, themeColor, density, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
