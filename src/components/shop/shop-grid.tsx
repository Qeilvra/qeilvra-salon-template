"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/cards/product-card";
import { products } from "@/lib/site-data";
import { cn } from "@/lib/utils";

export function ShopGrid() {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const categories = ["All", ...Array.from(new Set(products.map((product) => product.category)))];
  const visible = useMemo(() => {
    let output = products.filter((product) => (category === "All" || product.category === category) && product.name.toLowerCase().includes(query.toLowerCase()));
    if (sort === "low") output = [...output].sort((a, b) => a.price - b.price);
    if (sort === "high") output = [...output].sort((a, b) => b.price - a.price);
    if (sort === "rating") output = [...output].sort((a, b) => b.rating - a.rating);
    return output;
  }, [category, query, sort]);

  return (
    <>
      <div className="flex flex-col gap-4 border-b border-ink/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="no-scrollbar flex gap-2 overflow-x-auto">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={cn("shrink-0 rounded-full border px-4 py-2 text-[10px] font-bold uppercase tracking-wider", category === item ? "border-ink bg-ink text-white" : "border-ink/15")}>{item}</button>)}</div>
        <div className="flex gap-2"><label className="flex min-h-10 flex-1 items-center gap-2 rounded-full border border-ink/15 px-4 lg:w-52"><Search className="h-4 w-4 text-ink/35" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search care" className="min-w-0 flex-1 bg-transparent text-xs outline-none" /></label><label className="flex items-center gap-2 rounded-full border border-ink/15 px-4"><SlidersHorizontal className="h-4 w-4 text-ink/35" /><select value={sort} onChange={(event) => setSort(event.target.value)} className="bg-transparent text-[10px] font-semibold uppercase tracking-wider outline-none"><option value="featured">Featured</option><option value="low">Price low</option><option value="high">Price high</option><option value="rating">Top rated</option></select></label></div>
      </div>
      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">{visible.map((product) => <ProductCard key={product.slug} product={product} />)}</div>
    </>
  );
}

