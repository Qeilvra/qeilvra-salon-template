import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function AccountPageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 border-b border-ink/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? <p className="eyebrow text-rose-500">{eyebrow}</p> : null}
        <h1 className="mt-2 font-display text-4xl tracking-[-0.035em] text-ink sm:text-5xl">{title}</h1>
        {description ? <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/55">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function PortalCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={cn("rounded-[26px] border border-ink/10 bg-white shadow-[0_12px_40px_rgba(56,39,31,.055)]", className)}>{children}</section>;
}

export function MetricCard({
  icon: Icon,
  label,
  value,
  helper,
  accent = false,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  helper: string;
  accent?: boolean;
}) {
  return (
    <PortalCard className={cn("relative overflow-hidden p-4 sm:p-5", accent && "border-blush-300/60 bg-blush-100/65")}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink/45">{label}</p>
          <p className="mt-2 font-display text-2xl text-ink sm:mt-3 sm:text-3xl">{value}</p>
          <p className="mt-1 text-[10px] leading-4 text-ink/50 sm:text-xs">{helper}</p>
        </div>
        <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-full bg-cream text-gold sm:h-11 sm:w-11", accent && "bg-white/80 text-rose-500")}>
          <Icon className="h-[18px] w-[18px]" />
        </span>
      </div>
    </PortalCard>
  );
}

export function StatusPill({ children, tone = "neutral" }: { children: ReactNode; tone?: "success" | "warning" | "neutral" | "rose" }) {
  const tones = {
    success: "border-emerald-700/15 bg-emerald-50 text-emerald-700",
    warning: "border-amber-700/15 bg-amber-50 text-amber-700",
    neutral: "border-ink/10 bg-cream text-ink/60",
    rose: "border-rose-500/15 bg-blush-100 text-rose-500",
  };
  return <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em]", tones[tone])}>{children}</span>;
}

export const fieldClass =
  "min-h-12 w-full rounded-2xl border border-ink/10 bg-white px-4 text-sm text-ink outline-none transition placeholder:text-ink/30 focus:border-rose-500 focus:ring-4 focus:ring-blush-100";

export function FormError({ children }: { children?: ReactNode }) {
  return children ? <p className="mt-1.5 text-[11px] font-medium text-red-600">{children}</p> : null;
}
