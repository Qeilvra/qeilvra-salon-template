import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  light = false,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
}) {
  return (
    <div className={cn(align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-2xl", className)}>
      {eyebrow ? <p className={cn("eyebrow mb-4", light ? "text-blush-300" : "text-rose-500")}>{eyebrow}</p> : null}
      <h2 className={cn("display-title text-4xl sm:text-5xl lg:text-6xl", light && "text-white")}>{title}</h2>
      {description ? (
        <p className={cn("mt-5 text-sm leading-7 sm:text-base", light ? "text-white/65" : "text-ink/62")}>{description}</p>
      ) : null}
      <div className="mx-auto mt-6 flex w-24 items-center gap-2">
        <span className={cn("h-px flex-1", light ? "bg-white/25" : "bg-gold/35")} />
        <span className="h-1.5 w-1.5 rotate-45 border border-gold" />
        <span className={cn("h-px flex-1", light ? "bg-white/25" : "bg-gold/35")} />
      </div>
    </div>
  );
}

