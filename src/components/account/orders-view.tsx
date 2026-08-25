"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Download, PackageCheck, RotateCcw, ShoppingBag, Truck } from "lucide-react";
import { toast } from "sonner";
import { orders } from "@/components/account/data";
import { AccountPageHeader, PortalCard, StatusPill } from "@/components/account/portal-ui";
import { cn } from "@/lib/utils";

export function OrdersView() {
  const [openOrder, setOpenOrder] = useState<string | null>(orders[0]?.id ?? null);

  return (
    <div className="space-y-7">
      <AccountPageHeader
        eyebrow="Maison shop"
        title="Your orders"
        description="Track your care edit, revisit past purchases, and reorder the rituals you reach for most."
        action={<Link href="/shop" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 text-[10px] font-bold uppercase tracking-[0.13em] text-white hover:bg-black"><ShoppingBag className="h-4 w-4 text-blush-300" /> Shop products</Link>}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <PortalCard className="p-5"><span className="grid h-10 w-10 place-items-center rounded-full bg-blush-100 text-rose-500"><PackageCheck className="h-4 w-4" /></span><p className="mt-4 font-display text-3xl">2</p><p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-ink/35">Lifetime orders</p></PortalCard>
        <PortalCard className="p-5"><span className="grid h-10 w-10 place-items-center rounded-full bg-blush-100 text-rose-500"><ShoppingBag className="h-4 w-4" /></span><p className="mt-4 font-display text-3xl">4</p><p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-ink/35">Products purchased</p></PortalCard>
        <PortalCard className="p-5"><span className="grid h-10 w-10 place-items-center rounded-full bg-blush-100 text-rose-500"><Truck className="h-4 w-4" /></span><p className="mt-4 font-display text-3xl">0</p><p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-ink/35">On the way</p></PortalCard>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const expanded = openOrder === order.id;
          const itemCount = order.items.reduce((total, item) => total + item.quantity, 0);
          return (
            <PortalCard key={order.id} className="overflow-hidden">
              <button onClick={() => setOpenOrder(expanded ? null : order.id)} className="flex w-full flex-col gap-4 p-5 text-left sm:flex-row sm:items-center sm:justify-between sm:p-6" aria-expanded={expanded}>
                <div className="flex items-center gap-4"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-cream text-gold"><PackageCheck className="h-5 w-5" /></span><div><div className="flex flex-wrap items-center gap-2"><p className="font-display text-xl">Order {order.id}</p><StatusPill tone="success">{order.status}</StatusPill></div><p className="mt-1 text-[11px] text-ink/40">Placed {order.date} · {itemCount} {itemCount === 1 ? "item" : "items"}</p></div></div>
                <div className="flex w-full items-center justify-between gap-4 sm:w-auto"><p className="font-display text-2xl">${order.total.toFixed(2)}</p><ChevronDown className={cn("h-4 w-4 text-ink/30 transition", expanded && "rotate-180")} /></div>
              </button>
              <div className={cn("grid transition-all duration-300", expanded ? "grid-rows-[1fr] border-t border-ink/10" : "grid-rows-[0fr]")}>
                <div className="overflow-hidden">
                  <div className="p-5 sm:p-6">
                    <div className="space-y-3">
                      {order.items.map((item) => <div key={item.name} className="flex items-center gap-4 rounded-2xl bg-cream/55 p-3"><div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl"><Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" /></div><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold">{item.name}</p><p className="mt-1 text-[10px] text-ink/40">Quantity {item.quantity}</p></div><p className="text-sm font-semibold">${(item.price * item.quantity).toFixed(2)}</p></div>)}
                    </div>
                    <div className="mt-5 grid gap-5 border-t border-ink/10 pt-5 lg:grid-cols-[1fr_280px]">
                      <div className="grid gap-4 text-[11px] text-ink/50 sm:grid-cols-2"><div><p className="mb-2 text-[9px] font-bold uppercase tracking-[0.12em] text-ink/30">Shipped to</p><p className="font-semibold text-ink/70">Avery Morgan</p><p className="mt-1 leading-5">1842 Rosewood Lane, Apt 4B<br />Dallas, TX 75201</p></div><div><p className="mb-2 text-[9px] font-bold uppercase tracking-[0.12em] text-ink/30">Payment</p><p className="font-semibold text-ink/70">Visa ending in 4242</p><p className="mt-1 leading-5">Standard delivery · Complimentary</p></div></div>
                      <div className="space-y-2 text-xs"><div className="flex justify-between"><span className="text-ink/45">Subtotal</span><span>${order.total.toFixed(2)}</span></div><div className="flex justify-between"><span className="text-ink/45">Shipping</span><span className="text-emerald-700">Free</span></div><div className="flex justify-between border-t border-ink/10 pt-2 font-semibold"><span>Total</span><span>${order.total.toFixed(2)}</span></div></div>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3"><button onClick={() => toast.success("Added to your bag", { description: `${itemCount} item${itemCount === 1 ? "" : "s"} from order ${order.id}.` })} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-ink px-5 text-[9px] font-bold uppercase tracking-[0.12em] text-white"><RotateCcw className="h-3.5 w-3.5 text-blush-300" /> Buy again</button><button onClick={() => toast("Invoice ready", { description: `Invoice for ${order.id} would download securely.` })} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-ink/15 px-5 text-[9px] font-bold uppercase tracking-[0.12em]"><Download className="h-3.5 w-3.5" /> Invoice</button></div>
                  </div>
                </div>
              </div>
            </PortalCard>
          );
        })}
      </div>

      <PortalCard className="p-8 text-center"><ShoppingBag className="mx-auto h-6 w-6 text-gold" /><h2 className="mt-4 font-display text-2xl">Care, between appointments.</h2><p className="mx-auto mt-2 max-w-md text-xs leading-5 text-ink/45">Discover artist-approved formulas and tools chosen to protect your manicure at home.</p><Link href="/shop" className="mt-5 inline-flex min-h-10 items-center justify-center rounded-full border border-ink/15 px-5 text-[9px] font-bold uppercase tracking-[0.12em] hover:border-ink">Explore the care edit</Link></PortalCard>
    </div>
  );
}
