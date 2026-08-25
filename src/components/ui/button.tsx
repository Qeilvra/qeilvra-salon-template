import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type SharedProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "light" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
};

const styles = {
  primary: "border border-blush-300 bg-blush-300 text-ink hover:-translate-y-0.5 hover:bg-blush-400 hover:shadow-lg",
  secondary: "border border-ink bg-ink text-white hover:-translate-y-0.5 hover:bg-black hover:shadow-lg",
  light: "border border-white/50 bg-white text-ink hover:-translate-y-0.5 hover:bg-blush-100",
  ghost: "border border-ink/20 bg-transparent text-ink hover:border-ink hover:bg-ink hover:text-white",
};

const sizes = {
  sm: "min-h-10 px-4 py-2 text-[11px]",
  md: "min-h-12 px-6 py-3 text-xs",
  lg: "min-h-14 px-7 py-4 text-xs",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}: SharedProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold uppercase tracking-[0.13em] disabled:pointer-events-none disabled:opacity-50",
        styles[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
}: SharedProps & { href: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold uppercase tracking-[0.13em]",
        styles[variant],
        sizes[size],
        className,
      )}
    >
      {children}
    </Link>
  );
}

