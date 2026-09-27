import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";
import type { Service } from "@/lib/site-data";
import { formatCurrency } from "@/lib/utils";

export function ServiceCard({ service, index = 0 }: { service: Service; index?: number }) {
  return (
    <article className="group luxury-card grid min-h-[174px] grid-cols-[112px_minmax(0,1fr)] overflow-hidden rounded-[1.4rem] min-[390px]:grid-cols-[140px_minmax(0,1fr)] md:block md:min-h-0">
      <Link href={`/services/${service.slug}`} className="editorial-image relative block h-full min-h-[174px] bg-blush-100 md:aspect-[4/3] md:h-auto md:min-h-0">
        <Image
          src={service.image}
          alt={`${service.name} at Maison Élan`}
          fill
          sizes="(max-width: 767px) 140px, (max-width: 1200px) 45vw, 300px"
          className="object-cover"
          style={{ objectPosition: index % 2 ? "60% center" : "center" }}
        />
        <span className="absolute left-3 top-3 hidden rounded-full bg-white/90 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] backdrop-blur md:inline-flex">{service.category}</span>
      </Link>
      <div className="flex min-w-0 flex-col p-4 md:block md:p-6">
        <div className="flex items-start justify-between gap-3 md:gap-4">
          <div className="min-w-0">
            <p className="mb-1 text-[8px] font-bold uppercase tracking-[0.14em] text-rose-500 md:hidden">{service.category}</p>
            <h3 className="break-words font-display text-[1.25rem] leading-5 tracking-tight md:text-2xl md:leading-normal">{service.name}</h3>
            <span className="mt-2 flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-ink/45"><Clock3 className="h-3 w-3" /> {service.duration} minutes</span>
          </div>
          <span className="shrink-0 font-display text-lg text-rose-500 md:text-xl">{formatCurrency(service.price)}</span>
        </div>
        <p className="mt-2 line-clamp-2 min-h-0 text-[10px] leading-4 text-ink/60 md:mt-4 md:min-h-12 md:text-xs md:leading-6">{service.description}</p>
        <div className="mt-5 hidden items-center justify-between border-t border-ink/10 pt-4 md:flex">
          <Link href={`/services/${service.slug}`} className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink hover:text-rose-500">View ritual</Link>
          <Link href={`/book/service?service=${service.slug}`} className="grid h-9 w-9 place-items-center rounded-full border border-ink/15 group-hover:border-ink group-hover:bg-ink group-hover:text-white" aria-label={`Book ${service.name}`}><ArrowUpRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-ink/10 pt-3 md:hidden">
          <Link href={`/services/${service.slug}`} className="flex min-h-11 min-w-0 flex-1 items-center text-[9px] font-bold uppercase tracking-[0.1em] text-ink">
            View details <span className="ml-1 text-rose-500">→</span>
          </Link>
          <Link href={`/book/service?service=${service.slug}`} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink text-white" aria-label={`Book ${service.name}`}>
            <ArrowUpRight className="h-4 w-4 shrink-0" />
          </Link>
        </div>
      </div>
    </article>
  );
}
