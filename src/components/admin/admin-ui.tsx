"use client";

import { useEffect, useRef, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type StatusTone = "green" | "amber" | "rose" | "blue" | "slate" | "violet";

const statusStyles: Record<StatusTone, string> = {
  green: "border-emerald-200 bg-emerald-50 text-emerald-700",
  amber: "border-amber-200 bg-amber-50 text-amber-700",
  rose: "border-rose-200 bg-rose-50 text-rose-700",
  blue: "border-sky-200 bg-sky-50 text-sky-700",
  slate: "border-stone-200 bg-stone-100 text-stone-600",
  violet: "border-violet-200 bg-violet-50 text-violet-700",
};

export function StatusChip({ label, tone = "slate", dot = true }: { label: string; tone?: StatusTone; dot?: boolean }) {
  return (
    <span className={cn("inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold", statusStyles[tone])}>
      {dot ? <span className="h-1.5 w-1.5 rounded-full bg-current" /> : null}
      {label}
    </span>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 border-b border-stone-200/80 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow ? <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-blush-500">{eyebrow}</p> : null}
        <h1 className="font-display text-3xl tracking-tight text-ink sm:text-[2.35rem]">{title}</h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-stone-500">{description}</p>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function AdminButton({
  children,
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
}) {
  const variants = {
    primary: "border-ink bg-ink text-white shadow-sm hover:bg-stone-800",
    secondary: "border-stone-200 bg-white text-ink hover:border-stone-300 hover:bg-stone-50",
    ghost: "border-transparent bg-transparent text-stone-600 hover:bg-stone-100 hover:text-ink",
    danger: "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100",
  };
  return (
    <button
      className={cn(
        "inline-flex h-10 min-h-11 items-center justify-center gap-2 rounded-xl border px-4 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 md:min-h-0",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function IconButton({ label, children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      aria-label={label}
      title={label}
      className={cn("inline-flex h-9 w-9 min-h-11 min-w-11 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-500 hover:border-stone-300 hover:text-ink md:min-h-0 md:min-w-0", className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function KpiCard({
  label,
  value,
  change,
  trend = "up",
  icon: Icon,
  note,
  tone = "blush",
}: {
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: LucideIcon;
  note?: string;
  tone?: "blush" | "gold" | "ink" | "cream";
}) {
  const tones = {
    blush: "bg-blush-100 text-blush-500",
    gold: "bg-amber-50 text-gold",
    ink: "bg-stone-900 text-white",
    cream: "bg-cream text-stone-600",
  };
  const TrendIcon = trend === "down" ? ArrowDownRight : ArrowUpRight;
  return (
    <article className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(42,32,26,0.04)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-stone-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-ink">{value}</p>
        </div>
        <span className={cn("grid h-10 w-10 place-items-center rounded-xl", tones[tone])}>
          <Icon className="h-[18px] w-[18px]" />
        </span>
      </div>
      <div className="mt-4 flex min-h-5 items-center gap-2 text-[11px]">
        {change ? (
          <span className={cn("inline-flex items-center gap-0.5 font-semibold", trend === "down" ? "text-rose-600" : trend === "neutral" ? "text-stone-500" : "text-emerald-600")}>
            {trend !== "neutral" ? <TrendIcon className="h-3.5 w-3.5" /> : null}
            {change}
          </span>
        ) : null}
        {note ? <span className="text-stone-400">{note}</span> : null}
      </div>
    </article>
  );
}

export function Panel({
  title,
  subtitle,
  action,
  children,
  className,
  bodyClassName,
}: {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn("overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-[0_8px_30px_rgba(42,32,26,0.035)]", className)}>
      {title || action ? (
        <div className="flex items-center justify-between gap-4 border-b border-stone-100 px-5 py-4">
          <div>
            {title ? <h2 className="text-sm font-semibold text-ink">{title}</h2> : null}
            {subtitle ? <p className="mt-1 text-xs text-stone-400">{subtitle}</p> : null}
          </div>
          {action}
        </div>
      ) : null}
      <div className={cn("p-5", bodyClassName)}>{children}</div>
    </section>
  );
}

export function SearchField({ value, onChange, placeholder = "Search...", className }: { value: string; onChange: (value: string) => void; placeholder?: string; className?: string }) {
  return (
    <label className={cn("relative block", className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-10 min-h-11 w-full rounded-xl border border-stone-200 bg-white pl-9 pr-12 text-xs text-ink placeholder:text-stone-400 focus:border-blush-400 focus:outline-none md:min-h-0 md:pr-8"
      />
      {value ? (
        <button type="button" aria-label="Clear search" onClick={() => onChange("")} className="absolute right-0 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-lg text-stone-400 hover:bg-stone-100 hover:text-ink md:right-2 md:h-6 md:w-6">
          <X className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </label>
  );
}

export function SelectField({ value, onChange, children, className, label }: { value: string; onChange: (value: string) => void; children: ReactNode; className?: string; label?: string }) {
  return (
    <label className={cn("block", className)}>
      {label ? <span className="mb-1.5 block text-[11px] font-semibold text-stone-600">{label}</span> : null}
      <select value={value} onChange={(event) => onChange(event.target.value)} className="h-10 min-h-11 w-full rounded-xl border border-stone-200 bg-white px-3 text-xs text-ink focus:border-blush-400 focus:outline-none md:min-h-0">
        {children}
      </select>
    </label>
  );
}

export function Field({ label, hint, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold text-stone-600">{label}</span>
      <input {...props} className={cn("h-11 w-full rounded-xl border border-stone-200 bg-white px-3.5 text-sm text-ink placeholder:text-stone-300 focus:border-blush-400 focus:outline-none", props.className)} />
      {hint ? <span className="mt-1.5 block text-[10px] text-stone-400">{hint}</span> : null}
    </label>
  );
}

export function TextAreaField({ label, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold text-stone-600">{label}</span>
      <textarea {...props} className={cn("min-h-28 w-full resize-y rounded-xl border border-stone-200 bg-white px-3.5 py-3 text-sm text-ink placeholder:text-stone-300 focus:border-blush-400 focus:outline-none", props.className)} />
    </label>
  );
}

export function Toggle({ checked, onChange, label, description }: { checked: boolean; onChange: (checked: boolean) => void; label?: string; description?: string }) {
  return (
    <label className="flex min-h-11 cursor-pointer items-center justify-between gap-4 md:min-h-0">
      {label ? (
        <span>
          <span className="block text-xs font-semibold text-ink">{label}</span>
          {description ? <span className="mt-1 block text-[11px] leading-4 text-stone-400">{description}</span> : null}
        </span>
      ) : null}
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="sr-only" />
      <span className={cn("relative h-6 w-11 shrink-0 rounded-full transition", checked ? "bg-ink" : "bg-stone-200")}>
        <span className={cn("absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition", checked ? "left-6" : "left-1")} />
      </span>
    </label>
  );
}

export function Avatar({ name, image, size = "md" }: { name: string; image?: string; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "h-8 w-8 text-[10px]", md: "h-10 w-10 text-xs", lg: "h-12 w-12 text-sm" };
  const initials = name.split(" ").map((part) => part[0]).join("").slice(0, 2);
  return image ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={image} alt="" className={cn("shrink-0 rounded-full object-cover", sizes[size])} />
  ) : (
    <span className={cn("grid shrink-0 place-items-center rounded-full bg-blush-100 font-semibold uppercase text-blush-500", sizes[size])}>{initials}</span>
  );
}

export function TableShell({ children }: { children: ReactNode }) {
  return <div className="-mx-5 max-w-[calc(100%+2.5rem)] overflow-x-auto px-5 pb-1"><table className="w-full min-w-[720px] border-separate border-spacing-0 text-left max-md:w-[720px] max-md:table-fixed">{children}</table></div>;
}

export function TableHead({ children }: { children?: ReactNode }) {
  return <th className="border-b border-stone-100 px-3 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-stone-400 first:pl-0 last:pr-0">{children}</th>;
}

export function TableCell({ children, className }: { children: ReactNode; className?: string }) {
  return <td className={cn("border-b border-stone-100 px-3 py-3.5 text-xs text-stone-600 first:pl-0 last:pr-0", className)}>{children}</td>;
}

export function Segmented({ options, value, onChange }: { options: Array<{ label: string; value: string; icon?: LucideIcon }>; value: string; onChange: (value: string) => void }) {
  return (
    <div className="inline-flex rounded-xl border border-stone-200 bg-stone-50 p-1">
      {options.map((option) => {
        const Icon = option.icon;
        return (
          <button key={option.value} type="button" onClick={() => onChange(option.value)} className={cn("inline-flex h-8 min-h-11 items-center gap-1.5 rounded-lg px-3 text-[11px] font-semibold md:min-h-0", value === option.value ? "bg-white text-ink shadow-sm" : "text-stone-400 hover:text-stone-600")}>
            {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function ProgressBar({ value, tone = "blush" }: { value: number; tone?: "blush" | "gold" | "ink" | "green" }) {
  const tones = { blush: "bg-blush-400", gold: "bg-gold", ink: "bg-ink", green: "bg-emerald-500" };
  return <div className="h-1.5 overflow-hidden rounded-full bg-stone-100"><div className={cn("h-full rounded-full", tones[tone])} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} /></div>;
}

export function AdminModal({ open, title, description, onClose, children, footer }: { open: boolean; title: string; description?: string; onClose: () => void; children: ReactNode; footer?: ReactNode }) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = "hidden";

    const focusTimer = window.requestAnimationFrame(() => {
      dialogRef.current?.querySelector<HTMLElement>("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])")?.focus();
    });
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>("button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])"));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div ref={dialogRef} className="fixed inset-0 z-[80] flex items-end justify-center bg-black/45 p-0 pt-[env(safe-area-inset-top)] backdrop-blur-[2px] sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="max-h-[calc(100dvh-env(safe-area-inset-top))] w-full max-w-lg overscroll-contain overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl md:max-h-[92vh]">
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-stone-100 bg-white px-5 py-4 md:px-6 md:py-5">
          <div><h2 className="font-display text-2xl text-ink">{title}</h2>{description ? <p className="mt-1 text-xs text-stone-400">{description}</p> : null}</div>
          <IconButton label="Close" onClick={onClose}><X className="h-4 w-4" /></IconButton>
        </div>
        <div className="p-5 md:p-6">{children}</div>
        {footer ? <div className="sticky bottom-0 flex flex-col-reverse items-stretch justify-end gap-2 border-t border-stone-100 bg-white px-5 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 md:flex-row md:items-center md:px-6 md:py-4">{footer}</div> : null}
      </div>
    </div>
  );
}
