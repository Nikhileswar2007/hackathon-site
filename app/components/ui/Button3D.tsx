import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "./cn";

type Button3DVariant = "primary" | "secondary" | "ghost" | "icon";
type Button3DSize = "sm" | "md" | "lg";

interface SharedButton3DProps {
  variant?: Button3DVariant;
  size?: Button3DSize;
  className?: string;
  children: ReactNode;
}

type Button3DProps = SharedButton3DProps & {
  href?: string;
} & Omit<
    ComponentPropsWithoutRef<"button">,
    "className" | "children"
  >;

const baseClasses = "btn3d focus-visible:outline-offset-4";

const variantClasses: Record<Button3DVariant, string> = {
  primary: "btn3d-primary",
  secondary: "btn3d-secondary",
  ghost: "btn3d-ghost",
  icon: "btn3d-secondary btn3d-icon",
};

const sizeClasses: Record<Button3DSize, string> = {
  sm: "px-3.5 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

const iconSizeClasses: Record<Button3DSize, string> = {
  sm: "size-9",
  md: "size-11",
  lg: "size-12",
};

export function Button3D({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  type = "button",
  ...rest
}: Button3DProps) {
  const classes = cn(baseClasses, variantClasses[variant], className);
  const innerClasses = cn(
    "btn3d-inner",
    variant === "icon" ? iconSizeClasses[size] : sizeClasses[size],
  );

  if (href) {
    const linkProps = rest as Omit<
      ComponentPropsWithoutRef<typeof Link>,
      "href" | "className" | "children"
    >;

    return (
      <Link href={href} className={classes} {...linkProps}>
        <span className={innerClasses}>{children}</span>
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...rest}>
      <span className={innerClasses}>{children}</span>
    </button>
  );
}
