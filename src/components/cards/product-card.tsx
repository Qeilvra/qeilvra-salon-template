"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Plus, Star } from "lucide-react";
import { useState } from "react";
import { products } from "@/lib/site-data";
import { formatCurrency } from "@/lib/utils";
import { useShop } from "@/components/shop/shop-provider";

type Product = (typeof products)[number];

export function ProductCard({ product }: { product: Product }) {
  const [saved, setSaved] = useState(false);
  const { addItem } = useShop();

  return (
    <article className="group">
      <div className="editorial-image relative aspect-square overflow-hidden rounded-[1.5rem] bg-blush-50">
        <Link href={`/shop/${product.slug}`}>
          <Image src={product.image} alt={product.name} fill sizes="(max-width: 768px) 50vw, 300px" className="object-cover" />
        </Link>
        {product.badge ? <span className="absolute left-3 top-3 rounded-full bg-ink px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-white">{product.badge}</span> : null}
        <button onClick={() => setSaved((value) => !value)} className="absolute right-2 top-2 grid h-11 w-11 place-items-center rounded-full bg-white/90 shadow-sm md:right-3 md:top-3 md:h-10 md:w-10" aria-label="Save product">
          <Heart className={`h-4 w-4 ${saved ? "fill-rose-500 text-rose-500" : "text-ink"}`} />
        </button>
        <button onClick={() => addItem(product.slug)} className="absolute bottom-2 right-2 grid h-11 w-11 place-items-center rounded-full bg-ink text-white opacity-100 shadow-lg md:bottom-3 md:right-3 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100" aria-label={`Add ${product.name} to bag`}>
          <Plus className="h-5 w-5" />
        </button>
      </div>
      <div className="px-1 pt-3 md:pt-4">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-ink/45"><span>{product.category}</span><span className="flex items-center gap-1"><Star className="h-3 w-3 fill-gold text-gold" />{product.rating}</span></div>
        <Link href={`/shop/${product.slug}`}><h3 className="mt-2 font-display text-lg leading-5 hover:text-rose-500 md:text-xl md:leading-normal">{product.name}</h3></Link>
        <p className="mt-1 text-sm font-semibold">{formatCurrency(product.price)}</p>
      </div>
    </article>
  );
}

