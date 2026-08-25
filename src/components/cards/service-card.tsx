import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";
import type { Service } from "@/lib/site-data";
import { formatCurrency } from "@/lib/utils";

export function ServiceCard({ service, index = 0 }: { service: Service; index?: number }) {
  return (
    <article className="group luxury-card overflow-hidden rounded-[1.4rem]">
      <Link href={`/services/${service.slug}`} className="editorial-image relative block aspect-[4/3] bg-blush-100">
        <Image
          src={service.image}
          alt={`${service.name} at Maison Élan`}
          fill
          sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 300px"
          className="object-cover"
          style={{ objectPosition: index % 2 ? "60% center" : "center" }}
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] backdrop-blur">{service.category}</span>
      </Link>
      <div className="p-5 md:p-6">
        <div className="flex items-start justify-between gap-3 md:gap-4">
          <div className="min-w-0">
            <h3 className="break-words font-display text-[1.4rem] tracking-tight md:text-2xl">{service.name}</h3>
            <span className="mt-2 flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-ink/45"><Clock3 className="h-3 w-3" /> {service.duration} minutes</span>
          </div>
          <span className="font-display text-xl text-rose-500">{formatCurrency(service.price)}</span>
        </div>
        <p className="mt-4 min-h-0 text-xs leading-6 text-ink/60 md:min-h-12">{service.description}</p>
        <div className="mt-5 hidden items-center justify-between border-t border-ink/10 pt-4 md:flex">
          <Link href={`/services/${service.slug}`} className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink hover:text-rose-500">View ritual</Link>
          <Link href={`/book/service?service=${service.slug}`} className="grid h-9 w-9 place-items-center rounded-full border border-ink/15 group-hover:border-ink group-hover:bg-ink group-hover:text-white" aria-label={`Book ${service.name}`}><ArrowUpRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2 border-t border-ink/10 pt-4 md:hidden">
          <Link href={`/services/${service.slug}`} className="flex min-h-11 items-center justify-center rounded-full border border-ink/20 px-3 text-center text-[10px] font-bold uppercase tracking-[0.12em] text-ink">
            View ritual
          </Link>
          <Link href={`/book/service?service=${service.slug}`} className="flex min-h-11 items-center justify-center gap-2 rounded-full bg-ink px-3 text-center text-[10px] font-bold uppercase tracking-[0.12em] text-white" aria-label={`Book ${service.name}`}>
            Book now <ArrowUpRight className="h-4 w-4 shrink-0" />
          </Link>
        </div>
      </div>
    </article>
  );
}
