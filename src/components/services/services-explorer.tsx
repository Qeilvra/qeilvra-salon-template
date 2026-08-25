"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { ServiceCard } from "@/components/cards/service-card";
import { services } from "@/lib/site-data";
import { cn } from "@/lib/utils";

const categories = ["All", ...Array.from(new Set(services.map((service) => service.category)))];

export function ServicesExplorer() {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");

  const visible = useMemo(() => {
    const filtered = services.filter((service) => {
      const inCategory = category === "All" || service.category === category;
      const matches = `${service.name} ${service.description} ${service.category}`.toLowerCase().includes(query.toLowerCase());
      return inCategory && matches;
    });
    if (sort === "price-low") return [...filtered].sort((a, b) => a.price - b.price);
    if (sort === "price-high") return [...filtered].sort((a, b) => b.price - a.price);
    if (sort === "duration") return [...filtered].sort((a, b) => a.duration - b.duration);
    return filtered;
  }, [category, query, sort]);

  return (
    <div>
      <div className="sticky top-[74px] z-30 -mx-4 border-y border-ink/10 bg-[#fffdf9]/95 px-4 py-4 backdrop-blur-xl sm:top-[84px] md:mx-0 md:rounded-2xl md:border lg:top-[84px]">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1 lg:pb-0">
            {categories.map((item) => (
              <button key={item} onClick={() => setCategory(item)} aria-pressed={category === item} className={cn("min-h-11 shrink-0 rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] md:min-h-0 md:text-[10px]", category === item ? "border-ink bg-ink text-white" : "border-ink/15 bg-white hover:border-ink/35")}>
                {item}
              </button>
            ))}
          </div>
          <div className="flex gap-2 max-[340px]:grid max-[340px]:grid-cols-1">
            <label className="flex min-h-11 min-w-0 flex-1 items-center gap-2 rounded-full border border-ink/15 bg-white px-4 md:min-h-10 lg:w-56">
              <Search className="h-4 w-4 text-ink/40" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a service" className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-ink/35 md:text-xs" />
            </label>
            <label className="flex min-h-11 min-w-0 items-center gap-2 rounded-full border border-ink/15 bg-white px-4 md:min-h-10">
              <SlidersHorizontal className="h-4 w-4 text-ink/40" />
              <select value={sort} onChange={(event) => setSort(event.target.value)} className="min-w-0 flex-1 bg-transparent text-base font-semibold outline-none md:flex-none md:text-[10px] md:uppercase md:tracking-wider">
                <option value="featured">Featured</option><option value="price-low">Price: low</option><option value="price-high">Price: high</option><option value="duration">Shortest</option>
              </select>
            </label>
          </div>
        </div>
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visible.map((service, index) => <ServiceCard key={service.slug} service={service} index={index} />)}
      </div>
      {visible.length === 0 ? <div className="rounded-3xl border border-dashed border-ink/20 py-20 text-center"><p className="font-display text-3xl">No rituals found</p><p className="mt-2 text-sm text-ink/50">Try another category or search phrase.</p></div> : null}
    </div>
  );
}
