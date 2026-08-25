"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Copy, Gift, History, Plus, Send, Sparkles, WalletCards, X } from "lucide-react";
import { toast } from "sonner";
import { giftCards } from "@/components/account/data";
import { AccountPageHeader, PortalCard, fieldClass } from "@/components/account/portal-ui";
import { cn } from "@/lib/utils";

export function GiftCardsView() {
  const [cards, setCards] = useState(giftCards);
  const [addOpen, setAddOpen] = useState(false);
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  async function copyCode(cardCode: string) {
    try { await navigator.clipboard.writeText(cardCode); } catch { /* clipboard can be unavailable in preview */ }
    setCopied(cardCode);
    toast.success("Gift card code copied");
    window.setTimeout(() => setCopied(null), 1800);
  }

  function addCard(event: React.FormEvent) {
    event.preventDefault();
    if (code.trim().length < 8) {
      toast.error("That code looks incomplete", { description: "Enter the full code from your gift email or card." });
      return;
    }
    setCards((current) => [...current, { id: code.toUpperCase(), label: "Added gift card", balance: 50, original: 50, expires: "No expiration", color: "rose" }]);
    setCode(""); setAddOpen(false);
    toast.success("Gift card added", { description: "$50.00 is now available on your account." });
  }

  const totalBalance = cards.reduce((total, card) => total + card.balance, 0);

  return (
    <div className="space-y-7">
      <AccountPageHeader
        eyebrow="Give & receive"
        title="Your gift cards"
        description="Keep every Maison gift safely in one place, check balances, or send someone a beautiful moment of their own."
        action={<Link href="/gift-cards" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 text-[10px] font-bold uppercase tracking-[0.13em] text-white hover:bg-black"><Send className="h-4 w-4 text-blush-300" /> Send a gift</Link>}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="grid gap-4 sm:grid-cols-2">
          {cards.map((card) => {
            const ink = card.color === "ink";
            const percent = Math.round((card.balance / card.original) * 100);
            return (
              <article key={card.id} className={cn("relative min-h-[235px] overflow-hidden rounded-[26px] p-6 shadow-soft", ink ? "bg-ink text-white" : "bg-[linear-gradient(135deg,#f3ccc7,#df9795)] text-ink")}>
                <div className={cn("absolute -right-14 -top-14 h-40 w-40 rounded-full border-[30px]", ink ? "border-white/[0.035]" : "border-white/20")} />
                <div className="relative flex h-full flex-col">
                  <div className="flex items-start justify-between"><div><p className={cn("font-display text-2xl italic", ink && "text-blush-300")}>Maison Élan</p><p className={cn("mt-1 text-[8px] font-bold uppercase tracking-[0.22em]", ink ? "text-white/35" : "text-ink/45")}>Digital gift</p></div><Gift className={cn("h-5 w-5", ink ? "text-blush-300" : "text-ink/55")} /></div>
                  <div className="mt-8"><p className={cn("text-[9px] font-bold uppercase tracking-[0.13em]", ink ? "text-white/35" : "text-ink/45")}>{card.label}</p><div className="mt-1 flex items-end gap-2"><span className="font-display text-4xl">${card.balance}</span><span className={cn("pb-1 text-[10px]", ink ? "text-white/35" : "text-ink/40")}>remaining</span></div></div>
                  <div className="mt-auto flex items-end justify-between gap-3 pt-5"><button onClick={() => copyCode(card.id)} className={cn("inline-flex items-center gap-2 font-mono text-[10px] tracking-wider", ink ? "text-white/50 hover:text-white" : "text-ink/55 hover:text-ink")}>{card.id} {copied === card.id ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}</button><span className={cn("text-[8px] uppercase tracking-wider", ink ? "text-white/30" : "text-ink/35")}>{percent}% left</span></div>
                </div>
              </article>
            );
          })}
        </div>

        <PortalCard className="p-6">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-blush-100 text-rose-500"><WalletCards className="h-5 w-5" /></span>
          <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.15em] text-ink/35">Total available</p><p className="mt-1 font-display text-5xl">${totalBalance}</p><p className="mt-2 text-[11px] leading-5 text-ink/45">Across {cards.length} saved gift cards. Applied automatically at checkout when selected.</p>
          <div className="mt-6 space-y-2"><button onClick={() => setAddOpen(true)} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-ink text-[9px] font-bold uppercase tracking-[0.12em] text-white"><Plus className="h-3.5 w-3.5 text-blush-300" /> Add a gift card</button><button onClick={() => toast("No recent activity", { description: "Your latest gift-card transaction was June 19." })} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-ink/15 text-[9px] font-bold uppercase tracking-[0.12em]"><History className="h-3.5 w-3.5" /> View activity</button></div>
        </PortalCard>
      </div>

      <PortalCard className="overflow-hidden">
        <div className="grid md:grid-cols-[.8fr_1.2fr]">
          <div className="relative min-h-[240px] overflow-hidden bg-ink p-7 text-white"><div className="absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-blush-300/15 blur-3xl" /><div className="relative"><Sparkles className="h-5 w-5 text-blush-300" /><p className="eyebrow mt-7 text-blush-300">The perfect gesture</p><h2 className="mt-3 max-w-xs font-display text-4xl">A beautiful moment, theirs to choose.</h2></div></div>
          <div className="p-6 sm:p-8"><h3 className="font-display text-2xl">Send instantly or schedule the surprise.</h3><p className="mt-3 text-xs leading-6 text-ink/50">Choose any amount from $25, add a personal note, and select an email delivery date. Maison gift cards never expire and can be used for services or products.</p><div className="mt-6 flex flex-wrap gap-3"><Link href="/gift-cards" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-blush-300 px-5 text-[9px] font-bold uppercase tracking-[0.12em] hover:bg-blush-400"><Gift className="h-3.5 w-3.5" /> Create a gift card</Link><button onClick={() => toast.success("Balance checker ready", { description: "Enter a card from the gift-card page to see its balance." })} className="inline-flex min-h-11 items-center rounded-full border border-ink/15 px-5 text-[9px] font-bold uppercase tracking-[0.12em]">Check another balance</button></div></div>
        </div>
      </PortalCard>

      {addOpen ? (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-ink/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="add-gift-card-title">
          <button className="absolute inset-0" onClick={() => setAddOpen(false)} aria-label="Close" />
          <form onSubmit={addCard} className="relative z-10 w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl sm:p-8">
            <button type="button" onClick={() => setAddOpen(false)} className="ml-auto grid h-9 w-9 place-items-center rounded-full border border-ink/10" aria-label="Close"><X className="h-4 w-4" /></button>
            <span className="mt-2 grid h-12 w-12 place-items-center rounded-full bg-blush-100 text-rose-500"><Gift className="h-5 w-5" /></span><p className="eyebrow mt-5 text-rose-500">Redeem a gift</p><h2 id="add-gift-card-title" className="mt-2 font-display text-3xl">Add a gift card</h2><p className="mt-3 text-xs leading-5 text-ink/45">Find the code in your gift email or on the back of a physical card.</p>
            <label className="mt-6 block text-[11px] font-semibold">Gift card code<input autoFocus value={code} onChange={(event) => setCode(event.target.value)} placeholder="GC-ÉLAN-XXXX" className={`${fieldClass} mt-2 font-mono uppercase tracking-wider`} /></label>
            <button className="mt-5 min-h-12 w-full rounded-full bg-ink px-5 text-[10px] font-bold uppercase tracking-[0.12em] text-white">Add to account</button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
