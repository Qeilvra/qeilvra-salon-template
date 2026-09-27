"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useShop } from "@/components/shop/shop-provider";
import { products } from "@/lib/site-data";
import { formatCurrency } from "@/lib/utils";

export function CartView() {
  const { cart, subtotal, updateQuantity, removeItem } = useShop();
  const [coupon, setCoupon] = useState("");
  const shipping = subtotal >= 75 || subtotal === 0 ? 0 : 8;

  if (cart.length === 0) return (
    <div className="mx-auto max-w-xl py-24 text-center"><span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-blush-100"><ShoppingBag className="h-8 w-8 text-rose-500" /></span><h1 className="display-title mt-7 text-5xl">Your bag is taking a quiet moment.</h1><p className="mt-4 text-sm leading-6 text-ink/55">Explore our artist-approved edit of nail and hand care, created for beautiful rituals at home.</p><Link href="/shop" className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-ink px-6 text-xs font-bold uppercase tracking-wider text-white">Shop the edit <ArrowRight className="h-4 w-4" /></Link></div>
  );

  return (
    <div className="grid min-w-0 gap-10 lg:grid-cols-[1fr_380px]">
      <div className="min-w-0"><h1 className="display-title text-5xl">Your bag</h1><p className="mt-2 text-sm text-ink/50">A few beautiful things, reserved for you.</p><div className="mt-8 min-w-0 divide-y divide-ink/10 border-y border-ink/10">{cart.map((item) => { const product = products.find((candidate) => candidate.slug === item.slug); if (!product) return null; return <article key={item.slug} className="grid min-w-0 grid-cols-[88px_minmax(0,1fr)] gap-3 py-5 sm:grid-cols-[130px_minmax(0,1fr)_auto] sm:gap-4"><Link href={`/shop/${product.slug}`} className="relative aspect-square overflow-hidden rounded-2xl bg-blush-100"><Image src={product.image} alt={product.name} fill className="object-cover" sizes="130px" /></Link><div className="min-w-0 py-1"><p className="text-[9px] uppercase tracking-wider text-rose-500">{product.category}</p><Link href={`/shop/${product.slug}`}><h2 className="mt-1 break-words font-display text-xl">{product.name}</h2></Link><p className="mt-2 text-sm font-semibold">{formatCurrency(product.price)}</p><div className="mt-3 flex w-fit items-center rounded-full border border-ink/15"><button onClick={() => updateQuantity(item.slug, item.quantity - 1)} className="grid h-11 w-11 place-items-center" aria-label={`Decrease ${product.name} quantity`}><Minus className="h-3 w-3" /></button><span className="w-5 text-center text-xs">{item.quantity}</span><button onClick={() => updateQuantity(item.slug, item.quantity + 1)} className="grid h-11 w-11 place-items-center" aria-label={`Increase ${product.name} quantity`}><Plus className="h-3 w-3" /></button></div></div><div className="col-start-2 flex min-w-0 items-center justify-between sm:col-auto sm:flex-col sm:items-end"><strong>{formatCurrency(product.price * item.quantity)}</strong><button onClick={() => removeItem(item.slug)} className="flex min-h-11 items-center gap-1 px-2 text-[10px] uppercase tracking-wider text-ink/40 hover:text-red-700"><Trash2 className="h-3.5 w-3.5" /> Remove</button></div></article>; })}</div><Link href="/shop" className="mt-5 inline-flex min-h-11 items-center gap-2 text-[10px] font-bold uppercase tracking-wider"><span>←</span> Continue shopping</Link></div>
      <aside className="h-fit rounded-[2rem] bg-cream p-5 sm:p-7 lg:sticky lg:top-28"><h2 className="font-display text-3xl">Order summary</h2><div className="mt-6 space-y-3 border-b border-ink/10 pb-5 text-sm"><div className="flex justify-between"><span className="text-ink/55">Subtotal</span><span>{formatCurrency(subtotal)}</span></div><div className="flex justify-between"><span className="text-ink/55">Shipping</span><span>{shipping === 0 ? "Complimentary" : formatCurrency(shipping)}</span></div><div className="flex justify-between"><span className="text-ink/55">Estimated tax</span><span>Calculated at checkout</span></div></div><div className="flex justify-between py-5"><strong>Total</strong><strong className="font-display text-2xl font-normal">{formatCurrency(subtotal + shipping)}</strong></div><Link href="/checkout" className="flex min-h-14 items-center justify-center gap-2 rounded-full bg-ink px-6 text-xs font-bold uppercase tracking-wider text-white hover:-translate-y-0.5 hover:shadow-lg">Secure checkout <ArrowRight className="h-4 w-4" /></Link><div className="mt-6"><p className="text-[10px] font-bold uppercase tracking-wider">Have a code?</p><div className="mt-2 flex min-h-12 rounded-full border border-ink/15 bg-white p-1"><input value={coupon} onChange={(event) => setCoupon(event.target.value)} placeholder="Offer or gift card" className="min-w-0 flex-1 bg-transparent px-3 text-base outline-none md:text-xs" /><Button size="sm" variant="ghost">Apply</Button></div></div><p className="mt-5 text-center text-[10px] leading-5 text-ink/45">Secure payment · Visa · Mastercard · Amex · Apple Pay</p></aside>
    </div>
  );
}

