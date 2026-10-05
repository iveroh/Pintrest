import * as React from "react";
import {
  motion,
  AnimatePresence,
  type HTMLMotionProps,
  type Transition,
} from "motion/react";
import { cn } from "@/lib/utils";

// Icon sizes
const sizes = {
  default: "size-8 [&_svg]:size-5",
  sm: "size-6 [&_svg]:size-4",
  md: "size-10 [&_svg]:size-6",
  lg: "size-12 [&_svg]:size-8",
};

type ColorInput = [number, number, number] | string | undefined;

// Props
type IconButtonProps = Omit<HTMLMotionProps<"button">, "color"> & {
  icon: React.ElementType;
  active?: boolean;
  animate?: boolean;
  size?: keyof typeof sizes;
  fillOnActive?: boolean; 
  color?: ColorInput;
  transition?: Transition;
  iconProps?: React.SVGProps<SVGSVGElement>;
};

const DEFAULT_COLOR: [number, number, number] = [246, 190, 9];

// Resolve color helper
function resolveColor(color: ColorInput): [number, number, number] {
  if (Array.isArray(color)) return color;

  if (typeof color === "string") {
    if (color.startsWith("--") && typeof window !== "undefined") {
      const computed = getComputedStyle(document.documentElement).getPropertyValue(color).trim();
      const match = computed.match(/rgb\(\s*(\d+),\s*(\d+),\s*(\d+)\s*\)/);
      if (match) return [Number(match[1]), Number(match[2]), Number(match[3])];
    }

    const match = color.match(/rgb\(\s*(\d+),\s*(\d+),\s*(\d+)\s*\)/);
    if (match) return [Number(match[1]), Number(match[2]), Number(match[3])];
  }
  return DEFAULT_COLOR;
}

// Component
function IconButton({
  icon: Icon,
  className,
  active = false,
  animate = true,
  size = "default",
  color = DEFAULT_COLOR,
  fillOnActive = true,
  transition = { type: "spring", stiffness: 300, damping: 15 },
  iconProps = {},
  type = "button",
  ...props
}: IconButtonProps) {
    const [r, g, b] = resolveColor(color);

    return (
      <motion.button
        className={cn(
        `group/icon-button cursor-pointer relative inline-flex size-10 shrink-0 rounded-full 
        hover:bg-[var(--icon-button-color)]/10 
        active:bg-[var(--icon-button-color)]/20 
        text-[var(--icon-button-color)]`,
        sizes[size],
        className
        )}
        style={{ "--icon-button-color": `rgb(${r}, ${g}, ${b})` } as React.CSSProperties}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type={type}
        {...props}
      >

      {/* OUTLINE ICON */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 stroke-muted-foreground group-hover/icon-button:stroke-[var(--icon-button-color)]"
        aria-hidden="true"
      >
        {React.createElement(Icon, {
          ...iconProps,
          className: cn(
            iconProps.className,
            fillOnActive && active ? "fill-[var(--icon-button-color)]" : "fill-transparent"
          ),
        })}
      </motion.div>

      {/* FILLED ICON (only if fillOnActive = true) */}
      <AnimatePresence mode="wait">
        {fillOnActive && active && (
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
            text-[var(--icon-button-color)] fill-[var(--icon-button-color)]"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={transition}
          >
            {React.createElement(Icon, { ...iconProps })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* SPARKLES */}
      <AnimatePresence>
        {animate && active && (
          <>
            <motion.div
              className="absolute inset-0 z-10 rounded-full"
              style={{
                background: `radial-gradient(circle, rgba(${r},${g},${b},0.4) 0%, rgba(${r},${g},${b},0) 70%)`,
              }}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: [1.2, 1.8, 1.2], opacity: [0, 0.3, 0] }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />

            <motion.div
              className="absolute inset-0 z-10 rounded-full"
              style={{ boxShadow: `0 0 10px 2px rgba(${r},${g},${b},0.6)` }}
              initial={{ scale: 1, opacity: 0 }}
              animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />

            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-[var(--icon-button-color)]"
                initial={{ x: "50%", y: "50%", scale: 0, opacity: 0 }}
                animate={{
                  x: `calc(50% + ${Math.cos((i * Math.PI) / 3) * 30}px)`,
                  y: `calc(50% + ${Math.sin((i * Math.PI) / 3) * 30}px)`,
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{ duration: 0.8, delay: i * 0.05, ease: "easeOut" }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export { IconButton, sizes, type IconButtonProps };
