"use client";

import Image from "next/image";
import { Heart, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

const looks = [
  { id: 1, category: "Minimal", title: "Blush micro-French", image: "/images/nail-art-editorial.png", position: "center" },
  { id: 2, category: "Gel", title: "Soft almond veil", image: "/images/hero-luxury-manicure.png", position: "73% center" },
  { id: 3, category: "Atelier", title: "The quiet room", image: "/images/salon-interior.png", position: "center" },
  { id: 4, category: "Ritual", title: "Sunday restoration", image: "/images/spa-flatlay.png", position: "center" },
  { id: 5, category: "Art", title: "Champagne trace", image: "/images/nail-art-editorial.png", position: "75% center" },
  { id: 6, category: "Minimal", title: "Milky blush", image: "/images/hero-luxury-manicure.png", position: "86% center" },
  { id: 7, category: "Art", title: "Fine gold study", image: "/images/nail-art-editorial.png", position: "30% center" },
  { id: 8, category: "Ritual", title: "Botanical edit", image: "/images/spa-flatlay.png", position: "65% center" },
  { id: 9, category: "Gel", title: "Glossed rose", image: "/images/hero-luxury-manicure.png", position: "70% center" },
];

export function LookbookGrid() {
  const [category, setCategory] = useState("All");
  const [saved, setSaved] = useState<number[]>([]);
  const [active, setActive] = useState<(typeof looks)[number] | null>(null);
  const categories = ["All", ...Array.from(new Set(looks.map((look) => look.category)))];
  const visible = useMemo(() => category === "All" ? looks : looks.filter((look) => look.category === category), [category]);

  function toggleSaved(id: number) {
    setSaved((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  return (
    <>
      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2">
        {categories.map((item) => <button key={item} onClick={() => setCategory(item)} aria-pressed={category === item} className={cn("min-h-11 shrink-0 rounded-full border px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider md:min-h-0 md:px-5 md:text-[10px]", category === item ? "border-ink bg-ink text-white" : "border-ink/15 hover:border-ink/50")}>{item}</button>)}
      </div>
      <div className="mt-6 columns-1 gap-3 min-[360px]:columns-2 md:mt-8 md:gap-4 lg:columns-3">
        {visible.map((look, index) => (
          <article key={look.id} className="group relative mb-4 break-inside-avoid overflow-hidden rounded-[1.5rem] bg-blush-100" style={{ aspectRatio: index % 3 === 0 ? "4 / 5" : "1 / 1" }}>
            <button onClick={() => setActive(look)} className="absolute inset-0 z-10" aria-label={`Open ${look.title}`} />
            <Image src={look.image} alt={look.title} fill className="object-cover transition-transform duration-700 group-hover:scale-[1.035]" style={{ objectPosition: look.position }} sizes="(max-width: 640px) 100vw, 33vw" />
            <div className="absolute inset-x-0 bottom-0 z-20 flex translate-y-0 items-end justify-between bg-gradient-to-t from-black/75 to-transparent p-3 pt-12 text-white opacity-100 transition-all max-md:pointer-events-none md:translate-y-3 md:from-black/70 md:p-5 md:pt-16 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
              <div className="min-w-0"><p className="text-[10px] uppercase tracking-wider text-blush-200 md:text-[9px]">{look.category}</p><h3 className="mt-1 break-words font-display text-base leading-5 md:text-xl md:leading-normal">{look.title}</h3></div>
              <button onClick={(event) => { event.stopPropagation(); toggleSaved(look.id); }} className="pointer-events-auto absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full bg-white text-ink md:static md:h-10 md:w-10" aria-label="Save look" aria-pressed={saved.includes(look.id)}><Heart className={cn("h-4 w-4", saved.includes(look.id) && "fill-rose-500 text-rose-500")} /></button>
            </div>
          </article>
        ))}
      </div>

      {active ? (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/85 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-sm md:p-4" role="dialog" aria-modal="true" aria-label={active.title} onClick={() => setActive(null)}>
          <div className="relative h-[calc(100dvh-1.5rem)] max-h-[760px] w-full max-w-4xl overflow-hidden rounded-[1.5rem] bg-ink md:h-[82vh] md:max-h-none" onClick={(event) => event.stopPropagation()}>
            <Image src={active.image} alt={active.title} fill className="object-contain" sizes="90vw" style={{ objectPosition: active.position }} />
            <button onClick={() => setActive(null)} className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-white text-ink shadow-soft" aria-label="Close"><X className="h-5 w-5" /></button>
            <div className="absolute bottom-3 left-3 right-3 flex flex-col items-stretch gap-3 rounded-2xl bg-white/90 p-3 text-ink backdrop-blur md:bottom-4 md:left-4 md:right-4 md:flex-row md:items-center md:justify-between md:gap-0 md:p-4"><div><p className="text-[10px] uppercase tracking-wider text-rose-500 md:text-[9px]">{active.category}</p><h3 className="font-display text-xl md:text-2xl">{active.title}</h3></div><a href={`/book/service`} className="flex min-h-11 items-center justify-center rounded-full bg-ink px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-white md:min-h-0">Book this look</a></div>
          </div>
        </div>
      ) : null}
    </>
  );
}
