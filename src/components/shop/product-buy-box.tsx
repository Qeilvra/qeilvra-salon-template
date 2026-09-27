"use client";

import { Check, Minus, Plus, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useShop } from "@/components/shop/shop-provider";

export function ProductBuyBox({ slug }: { slug: string }) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useShop();
  return (
    <div>
      <div className="flex flex-wrap gap-2">{["One time", "Subscribe & save 10%"].map((item, index) => <button key={item} className={`rounded-full border px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider ${index === 0 ? "border-ink bg-ink text-white" : "border-ink/15"}`}>{item}</button>)}</div>
      <div className="mt-6 flex gap-3"><div className="flex h-14 items-center rounded-full border border-ink/15 px-1"><button onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="grid h-11 w-11 place-items-center" aria-label="Decrease quantity"><Minus className="h-4 w-4" /></button><span className="w-7 text-center text-sm font-semibold">{quantity}</span><button onClick={() => setQuantity((value) => value + 1)} className="grid h-11 w-11 place-items-center" aria-label="Increase quantity"><Plus className="h-4 w-4" /></button></div><Button onClick={() => addItem(slug, quantity)} size="lg" variant="secondary" className="min-w-0 flex-1"><ShoppingBag className="h-4 w-4 shrink-0" /> <span className="truncate">Add to bag</span></Button></div>
      <div className="mt-5 grid gap-2 text-[11px] text-ink/55 sm:grid-cols-2">{["Complimentary shipping over $75", "30-day considered returns", "Packed by hand in our atelier", "Earn Élan reward points"].map((item) => <span key={item} className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-rose-500" />{item}</span>)}</div>
    </div>
  );
}

