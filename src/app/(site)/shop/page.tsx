import type { Metadata } from "next";
import Image from "next/image";
import { Leaf, PackageCheck, Sparkles } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { ShopGrid } from "@/components/shop/shop-grid";

export const metadata: Metadata = { title: "The Care Edit", description: "Shop artist-approved nail care, hand treatments and at-home rituals from Maison Élan." };

export default function ShopPage() {
  return <><PageHero eyebrow="The care edit" title="Salon results, beautifully kept" description="The tools, formulas and small rituals our artists trust—curated to make caring for your nails at home feel effortless." image="/images/spa-flatlay.png" /><section className="py-16 sm:py-24"><div className="container-shell"><ShopGrid /></div></section><section className="bg-cream py-16"><div className="container-shell grid gap-7 sm:grid-cols-3">{[[Sparkles,"Artist approved","Every formula earns a place at our tables first."],[Leaf,"Considered formulas","Kind to nails, thoughtful about ingredients."],[PackageCheck,"Packed with care","Hand-wrapped at the Maison, ready to gift."]].map(([Icon,title,text])=>{const C=Icon as typeof Sparkles;return <div key={title as string} className="text-center"><C className="mx-auto h-6 w-6 text-rose-500"/><h3 className="mt-4 font-display text-2xl">{title as string}</h3><p className="mt-2 text-xs text-ink/55">{text as string}</p></div>})}</div></section></>;
}

