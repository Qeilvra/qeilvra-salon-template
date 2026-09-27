"use client";

import Link from "next/link";
import { Check, ChevronLeft, CreditCard, LockKeyhole, PackageCheck } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { useShop } from "@/components/shop/shop-provider";
import { products } from "@/lib/site-data";
import { formatCurrency } from "@/lib/utils";

export function CheckoutForm() {
  const { cart, subtotal, clearCart } = useShop();
  const [sameBilling, setSameBilling] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [processing, setProcessing] = useState(false);
  const shipping = subtotal >= 75 ? 0 : 8;
  const tax = subtotal * 0.0825;
  const orderItems = useMemo(() => cart.map((item) => ({ ...item, product: products.find((candidate) => candidate.slug === item.slug) })).filter((item) => item.product), [cart]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProcessing(true);
    window.setTimeout(() => { setProcessing(false); setSubmitted(true); clearCart(); window.scrollTo({ top: 0, behavior: "smooth" }); }, 900);
  }

  if (submitted) return <div className="mx-auto max-w-2xl py-20 text-center"><span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-blush-200"><PackageCheck className="h-9 w-9 text-rose-500" /></span><p className="eyebrow mt-7 text-rose-500">Order ME-28416</p><h1 className="display-title mt-4 text-6xl">Beautifully on its way.</h1><p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-ink/55">Thank you for your order. A confirmation has been sent to your email, and we’ll share tracking as soon as your care edit leaves the Maison.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><Link href="/account/orders" className="rounded-full bg-ink px-6 py-3 text-xs font-bold uppercase tracking-wider text-white">View my order</Link><Link href="/" className="rounded-full border border-ink/20 px-6 py-3 text-xs font-bold uppercase tracking-wider">Return home</Link></div></div>;

  if (cart.length === 0) return <div className="mx-auto max-w-xl py-24 text-center"><h1 className="display-title text-5xl">There’s nothing to check out just yet.</h1><Link href="/shop" className="mt-7 inline-flex rounded-full bg-ink px-6 py-3 text-xs font-bold uppercase tracking-wider text-white">Visit the care edit</Link></div>;

  return (
    <form onSubmit={submit} className="grid gap-10 lg:grid-cols-[1fr_400px]">
      <div><Link href="/cart" className="mb-8 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-ink/50"><ChevronLeft className="h-4 w-4" /> Back to bag</Link><h1 className="display-title text-5xl">Secure checkout</h1><p className="mt-2 flex items-center gap-2 text-xs text-ink/45"><LockKeyhole className="h-3.5 w-3.5" /> Your details are encrypted and protected.</p>
        <CheckoutSection number="01" title="Contact"><div className="grid gap-4 sm:grid-cols-2"><Field label="Email address" type="email" placeholder="you@example.com" className="sm:col-span-2"/><Field label="First name" placeholder="First name"/><Field label="Last name" placeholder="Last name"/><Field label="Mobile number" type="tel" placeholder="(214) 555-0000" className="sm:col-span-2"/></div><label className="mt-4 flex items-start gap-3 text-xs text-ink/55"><input type="checkbox" defaultChecked className="mt-0.5 accent-ink" /> Email me artist notes, care tips and private offers.</label></CheckoutSection>
        <CheckoutSection number="02" title="Delivery"><div className="grid gap-4 sm:grid-cols-2"><Field label="Address" placeholder="Street address" className="sm:col-span-2"/><Field label="Apartment, suite" placeholder="Optional" className="sm:col-span-2"/><Field label="City" placeholder="Dallas"/><Field label="State" placeholder="Texas"/><Field label="ZIP code" placeholder="75001"/><Field label="Country" value="United States" readOnly/></div><label className="mt-4 flex items-center gap-3 text-xs"><input type="checkbox" checked={sameBilling} onChange={(event)=>setSameBilling(event.target.checked)} className="accent-ink"/> Billing address is the same as delivery</label></CheckoutSection>
        <CheckoutSection number="03" title="Payment"><div className="rounded-2xl border border-ink/15 bg-white p-5"><div className="flex items-center justify-between"><span className="flex items-center gap-2 text-xs font-semibold"><CreditCard className="h-4 w-4"/> Credit or debit card</span><span className="text-[9px] uppercase tracking-wider text-ink/40">Powered by Stripe</span></div><div className="mt-5 grid gap-4 sm:grid-cols-2"><Field label="Card number" inputMode="numeric" placeholder="4242 4242 4242 4242" className="sm:col-span-2"/><Field label="Expiry" placeholder="MM / YY"/><Field label="CVC" placeholder="123"/></div></div><p className="mt-4 text-[10px] leading-5 text-ink/45">This preview uses Stripe-ready fields. Connect the server PaymentIntent endpoint and Stripe Elements for live payments.</p></CheckoutSection>
      </div>
      <aside className="h-fit overflow-hidden rounded-[2rem] bg-cream lg:sticky lg:top-28"><details open className="group"><summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 px-5 lg:hidden"><span className="font-display text-2xl">Order summary</span><span className="text-right"><strong className="block font-display text-xl font-normal">{formatCurrency(subtotal+shipping+tax)}</strong><small className="text-[9px] text-ink/40 group-open:hidden">Show details</small><small className="hidden text-[9px] text-ink/40 group-open:block">Hide details</small></span></summary><div className="border-t border-ink/10 p-5 lg:border-0 lg:p-7"><h2 className="hidden font-display text-3xl lg:block">Your care edit</h2><div className="mt-1 divide-y divide-ink/10 border-y border-ink/10 lg:mt-5">{orderItems.map((item)=><div key={item.slug} className="flex justify-between gap-4 py-4 text-xs"><span className="text-ink/65">{item.product?.name} <small>× {item.quantity}</small></span><strong>{formatCurrency((item.product?.price??0)*item.quantity)}</strong></div>)}</div><div className="mt-5 space-y-3 text-xs"><div className="flex justify-between"><span className="text-ink/50">Subtotal</span><span>{formatCurrency(subtotal)}</span></div><div className="flex justify-between"><span className="text-ink/50">Shipping</span><span>{shipping===0?"Complimentary":formatCurrency(shipping)}</span></div><div className="flex justify-between"><span className="text-ink/50">Tax</span><span>{formatCurrency(tax)}</span></div><div className="flex justify-between border-t border-ink/10 pt-4 text-base"><strong>Total</strong><strong className="font-display text-2xl font-normal">{formatCurrency(subtotal+shipping+tax)}</strong></div></div><button disabled={processing} className="mt-6 flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-ink px-6 text-xs font-bold uppercase tracking-wider text-white disabled:opacity-60">{processing?"Preparing your order…":<><LockKeyhole className="h-4 w-4"/> Pay securely</>}</button><div className="mt-5 grid gap-2 text-[10px] text-ink/45">{["Encrypted Stripe payment", "30-day considered returns", "Order confirmation by email"].map((item)=><span key={item} className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-rose-500"/>{item}</span>)}</div></div></details></aside>
    </form>
  );
}

function CheckoutSection({number,title,children}:{number:string;title:string;children:React.ReactNode}){return <section className="mt-10 border-t border-ink/10 pt-7"><div className="mb-5 flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-full bg-blush-200 font-display text-sm italic">{number}</span><h2 className="font-display text-3xl">{title}</h2></div>{children}</section>}

function Field({label,className="",...props}:React.InputHTMLAttributes<HTMLInputElement>&{label:string}){return <label className={className}><span className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-ink/55">{label}</span><input required className="h-12 w-full rounded-xl border border-ink/15 bg-white px-4 text-sm outline-none focus:border-rose-500" {...props}/></label>}

