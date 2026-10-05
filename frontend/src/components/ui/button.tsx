'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { type HTMLMotionProps, motion, type Transition } from "motion/react";
import { cn } from '@/lib/utils';

export const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-primary",
        ghost: "hover:text-accent-foreground dark:hover:bg-accent/50",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
      effect: {
        none: "",
        ripple: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      effect: "none",
    },
  }
);

const rippleVariants = cva('absolute rounded-full size-5 pointer-events-none', {
  variants: {
    variant: {
      default: 'bg-primary-foreground/60',
      secondary: 'bg-secondary-foreground/50',
      ghost: 'bg-accent/40',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

type Ripple = { id: number; x: number; y: number };

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  rippleScale?: number;
  rippleTransition?: Transition;
  rippleClassName?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      effect = "none",
      children,
      rippleScale = 10,
      rippleTransition = { duration: 0.6, ease: "easeOut" },
      rippleClassName,
      onClick,
      ...props
    },
    ref
  ) => {
    const [ripples, setRipples] = React.useState<Ripple[]>([]);
    const internalRef = React.useRef<HTMLButtonElement>(null);

    React.useImperativeHandle(ref, () => internalRef.current as HTMLButtonElement);

    const createRipple = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        if (effect !== "ripple") return;

        const button = internalRef.current;
        if (!button) return;

        const rect = button.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const id = Date.now();

        setRipples(prev => [...prev, { id, x, y }]);
        setTimeout(() => {
          setRipples(prev => prev.filter(r => r.id !== id));
        }, 600);
      },
      [effect]
    );

    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        if (effect === "ripple") {
          createRipple(event);
        }
        onClick?.(event);
      },
      [effect, createRipple, onClick]
    );

    return (
      <motion.button
        ref={internalRef}
        data-slot="button"
        whileTap={{ scale: 0.97 }}
        whileHover={effect === "ripple" ? { scale: 1.05 } : undefined}
        onPointerDown={effect === "ripple" ? createRipple : undefined}
        onClick={handleClick}
        className={cn(
          effect === "ripple" ? "relative overflow-hidden" : "",
          buttonVariants({ variant, size, effect, className })
        )}
        {...(props as HTMLMotionProps<"button">)}
      >
        {children}
        {effect === "ripple" &&
          ripples.map(ripple => (
            <motion.span
              key={ripple.id}
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{ scale: rippleScale, opacity: 0 }}
              transition={rippleTransition}
              className={cn(rippleVariants({ variant }), rippleClassName)}
              style={{ top: ripple.y - 10, left: ripple.x - 10 }}
              aria-hidden
            />
          ))}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
