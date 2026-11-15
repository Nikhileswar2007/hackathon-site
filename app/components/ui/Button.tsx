import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "./cn";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface SharedButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
}

type ButtonProps = SharedButtonProps & {
  href?: string;
} & Omit<
    ComponentPropsWithoutRef<"button">,
    "className" | "children"
  >;

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-[transform,background-color,color,border-color] duration-200 ease-out focus-visible:outline-offset-4 disabled:pointer-events-none disabled:opacity-50 active:translate-y-px";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-[0_0_34px_var(--glow-primary)]",
  secondary:
    "border border-border-strong bg-surface-raised/80 text-foreground hover:-translate-y-0.5 hover:border-primary hover:text-primary",
  ghost:
    "text-foreground hover:bg-surface-raised hover:text-primary",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3.5 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

export function Button({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  const classes = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className,
  );

  if (href) {
    const linkProps = rest as Omit<
      ComponentPropsWithoutRef<typeof Link>,
      "href" | "className" | "children"
    >;

    return (
      <Link href={href} className={classes} {...linkProps}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}
