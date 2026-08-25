import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  description,
  image,
  compact = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  image?: string;
  compact?: boolean;
}) {
  return (
    <section className={cn("relative flex items-center overflow-hidden bg-ink text-white md:block", compact ? "py-14 md:py-24" : "min-h-[390px] py-16 md:min-h-[500px] md:py-28")}>
      {image ? (
        <>
          <Image src={image} alt="" fill priority className="object-cover opacity-45" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/55 md:via-ink/80 md:to-ink/15" />
        </>
      ) : <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(238,189,184,.2),transparent_35%)]" />}
      <div className="container-shell relative z-10 flex min-h-0 flex-col justify-center md:min-h-[inherit]">
        <div className="flex min-w-0 items-center gap-2 text-[11px] uppercase leading-4 tracking-[0.12em] text-white/60 md:text-[10px] md:leading-normal md:tracking-[0.14em] md:text-white/45">
          <Link href="/" className="shrink-0 hover:text-white">Home</Link><ChevronRight className="h-3 w-3 shrink-0" /><span className="min-w-0 break-words">{title}</span>
        </div>
        {eyebrow ? <p className="eyebrow mt-7 text-blush-300 md:mt-10">{eyebrow}</p> : null}
        <h1 className="display-title mt-4 max-w-4xl break-words text-[clamp(2.55rem,12vw,3.5rem)] leading-[0.94] md:text-6xl md:leading-[0.98] lg:text-7xl">{title}</h1>
        {description ? <p className="mt-5 max-w-2xl text-sm leading-7 text-white/70 md:mt-6 md:text-base md:text-white/65">{description}</p> : null}
      </div>
    </section>
  );
}
