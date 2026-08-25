"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, Check, Gift, Mail, Sparkles } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

const amounts = [50, 75, 100, 150, 200];

export function GiftCardBuilder() {
  const [amount, setAmount] = useState(100);
  const [delivery, setDelivery] = useState("email");
  const [complete, setComplete] = useState(false);

  function submit(event: FormEvent) { event.preventDefault(); setComplete(true); }

  if (complete) return <div className="rounded-[2rem] bg-ink p-6 text-center text-white md:p-12"><span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-blush-300 text-ink"><Gift className="h-7 w-7" /></span><p className="eyebrow mt-6 text-blush-300">Gift card GC-ELAN-6248</p><h3 className="display-title mt-4 text-[clamp(2.35rem,11vw,3rem)] md:text-5xl">A beautiful gift is ready.</h3><p className="mx-auto mt-4 max-w-md text-sm leading-7 text-white/55">Your {formatCurrency(amount)} Maison Élan gift card has been prepared for {delivery === "email" ? "digital delivery" : "atelier collection"}. A receipt is on its way to you.</p><button onClick={() => setComplete(false)} className="mt-7 min-h-11 rounded-full border border-white/30 px-6 py-3 text-[10px] font-bold uppercase tracking-wider md:min-h-0">Create another gift</button></div>;

  return (
    <form onSubmit={submit} className="rounded-[2rem] border border-ink/10 bg-white p-5 shadow-soft min-[360px]:p-6 md:p-9">
      <p className="eyebrow text-rose-500">Create your gift</p><h2 className="display-title mt-4 text-[clamp(2.15rem,10vw,2.5rem)] md:text-4xl">Choose an amount</h2>
      <div className="mt-5 overflow-hidden rounded-2xl bg-ink p-5 text-white md:hidden">
        <div className="flex items-start justify-between gap-4"><span><small className="block text-[10px] uppercase tracking-[0.16em] text-blush-300">Maison Élan</small><strong className="mt-7 block font-display text-2xl font-normal italic">A little time, beautifully given.</strong></span><Gift className="h-6 w-6 shrink-0 text-blush-300" /></div>
        <p className="mt-5 border-t border-white/15 pt-4 font-display text-3xl">{formatCurrency(amount)}</p>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-2 md:grid-cols-5">{amounts.map((value) => <button type="button" key={value} onClick={() => setAmount(value)} className={cn("min-h-11 rounded-xl border py-3 text-sm font-semibold md:min-h-0", amount === value ? "border-ink bg-ink text-white" : "border-ink/15")}>{formatCurrency(value)}</button>)}</div>
      <label className="mt-4 block"><span className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-ink/55 md:text-[10px] md:text-ink/50">Or enter an amount</span><input type="number" min="25" max="1000" value={amount} onChange={(event) => setAmount(Number(event.target.value))} className="h-12 w-full rounded-xl border border-ink/15 px-4 text-base outline-none md:text-sm" /></label>
      <h3 className="mt-7 font-display text-2xl">How should it arrive?</h3><div className="mt-3 grid gap-3 md:grid-cols-2">{[["email", Mail, "Email instantly", "Perfect for right now"], ["collect", Gift, "Collect at Maison", "Beautifully wrapped"]].map(([key, Icon, title, text]) => { const C = Icon as typeof Mail; return <button type="button" key={key as string} onClick={() => setDelivery(key as string)} aria-pressed={delivery === key} className={cn("flex min-h-11 items-center gap-3 rounded-xl border p-4 text-left", delivery === key ? "border-rose-500 bg-blush-50" : "border-ink/10")}><span className="grid h-10 w-10 place-items-center rounded-full bg-blush-200"><C className="h-4 w-4 text-rose-500" /></span><span className="flex-1"><strong className="block text-xs">{title as string}</strong><small className="text-ink/45">{text as string}</small></span>{delivery === key ? <Check className="h-4 w-4 text-rose-500" /> : null}</button>; })}</div>
      <div className="mt-7 grid gap-4 md:grid-cols-2"><BuilderField label="Recipient name" placeholder="Their name" /><BuilderField label="Recipient email" type="email" placeholder="them@example.com" /><BuilderField label="Your name" placeholder="Your name" /><BuilderField label="Delivery date" type="date" /></div>
      <label className="mt-4 block"><span className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-ink/55 md:text-[10px] md:text-ink/50">Personal note</span><textarea rows={3} maxLength={240} placeholder="For a little time that’s entirely yours…" className="w-full rounded-xl border border-ink/15 px-4 py-3 text-base outline-none md:text-sm" /></label>
      <div className="mt-6 flex flex-col items-stretch gap-4 border-t border-ink/10 pt-5 md:flex-row md:items-center md:justify-between md:gap-0"><span><small className="block text-[10px] uppercase tracking-wider text-ink/50 md:text-[9px] md:text-ink/40">Gift value</small><strong className="font-display text-3xl font-normal">{formatCurrency(amount)}</strong></span><button className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-ink px-5 text-[10px] font-bold uppercase tracking-wider text-white md:w-auto md:justify-start md:px-6">Continue to payment <ArrowRight className="h-4 w-4 shrink-0" /></button></div>
      <p className="mt-4 flex flex-wrap items-center justify-center gap-2 text-center text-[10px] leading-5 text-ink/50 md:text-[9px] md:text-ink/40"><Sparkles className="h-3.5 w-3.5 text-rose-500" /> Never expires · Valid on services and products</p>
    </form>
  );
}

function BuilderField({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) { return <label><span className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-ink/55 md:text-[10px] md:text-ink/50">{label}</span><input required className="h-12 w-full min-w-0 rounded-xl border border-ink/15 px-4 text-base outline-none md:text-sm" {...props} /></label>; }
