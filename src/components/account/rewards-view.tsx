"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check, Crown, Gift, LockKeyhole, ShoppingBag, Sparkles, Star, UsersRound } from "lucide-react";
import { toast } from "sonner";
import { rewardActivity } from "@/components/account/data";
import { AccountPageHeader, PortalCard, StatusPill } from "@/components/account/portal-ui";
import { cn } from "@/lib/utils";

const rewards = [
  { id: 1, points: 500, name: "$10 service credit", detail: "Use toward any salon service", icon: Sparkles },
  { id: 2, points: 750, name: "Complimentary add-on", detail: "French, chrome, or massage", icon: Gift },
  { id: 3, points: 1000, name: "$20 service credit", detail: "A little more time for you", icon: Star },
  { id: 4, points: 1500, name: "Signature Manicure", detail: "Our complete 45-minute ritual", icon: Crown },
];

export function RewardsView() {
  const [balance, setBalance] = useState(760);
  const [redeemed, setRedeemed] = useState<number[]>([]);

  function redeem(reward: (typeof rewards)[number]) {
    if (balance < reward.points) return;
    setBalance((value) => value - reward.points);
    setRedeemed((current) => [...current, reward.id]);
    toast.success("Reward added to your account", { description: `${reward.name} will be available at checkout.` });
  }

  return (
    <div className="space-y-7">
      <AccountPageHeader eyebrow="Élan rewards" title="Beautiful care, rewarded." description="Earn two points for every dollar spent in the atelier or shop, then turn them into little luxuries." />

      <PortalCard className="relative overflow-hidden bg-ink p-6 text-white sm:p-8 lg:p-10">
        <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full bg-blush-300/20 blur-3xl" />
        <div className="absolute bottom-0 right-[25%] h-40 w-40 rounded-full bg-gold/10 blur-3xl" />
        <div className="relative grid gap-9 lg:grid-cols-[1fr_1.15fr] lg:items-center">
          <div>
            <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-blush-300"><Crown className="h-5 w-5" /></span><div><p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blush-300">Current tier</p><p className="mt-0.5 font-display text-xl">Atelier</p></div></div>
            <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">Available balance</p>
            <div className="mt-2 flex items-end gap-3"><span className="font-display text-6xl sm:text-7xl">{balance}</span><span className="pb-2 text-sm text-white/45">points</span></div>
            <p className="mt-4 max-w-sm text-xs leading-5 text-white/50">Your points never expire while your account remains active.</p>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-white/[0.05] p-5 backdrop-blur sm:p-6">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.12em]"><span>Atelier</span><span className="text-blush-300">Icon at 2,000</span></div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[38%] rounded-full bg-gradient-to-r from-blush-300 to-gold" /></div>
            <div className="mt-4 flex justify-between text-[10px] text-white/35"><span>760 earned</span><span>1,240 to Icon</span></div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {["2× points", "Priority waitlist", "10% birthday gift"].map((benefit) => <span key={benefit} className="flex items-center gap-2 text-[10px] text-white/60"><Check className="h-3.5 w-3.5 text-blush-300" /> {benefit}</span>)}
            </div>
          </div>
        </div>
      </PortalCard>

      <div>
        <div className="flex items-end justify-between"><div><p className="eyebrow text-rose-500">The rewards edit</p><h2 className="mt-2 font-display text-3xl">Choose a little luxury</h2></div><p className="hidden text-xs text-ink/40 sm:block">Redeem at checkout or in the atelier</p></div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {rewards.map((reward) => {
            const Icon = reward.icon;
            const locked = balance < reward.points;
            const used = redeemed.includes(reward.id);
            return (
              <PortalCard key={reward.id} className={cn("flex flex-col p-5", locked && "bg-cream/60")}>
                <div className="flex items-start justify-between"><span className={cn("grid h-11 w-11 place-items-center rounded-full", locked ? "bg-white text-ink/25" : "bg-blush-100 text-rose-500")}><Icon className="h-5 w-5" /></span>{locked ? <LockKeyhole className="h-4 w-4 text-ink/20" /> : <StatusPill tone="success">Unlocked</StatusPill>}</div>
                <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.13em] text-gold">{reward.points.toLocaleString()} points</p>
                <h3 className="mt-2 font-display text-xl">{reward.name}</h3><p className="mt-2 min-h-10 text-[11px] leading-5 text-ink/45">{reward.detail}</p>
                <button disabled={locked || used} onClick={() => redeem(reward)} className={cn("mt-5 min-h-10 rounded-full border text-[9px] font-bold uppercase tracking-[0.12em]", locked ? "cursor-not-allowed border-ink/10 text-ink/25" : used ? "border-emerald-700/15 bg-emerald-50 text-emerald-700" : "border-ink bg-ink text-white hover:bg-black")}>
                  {used ? "Added to account" : locked ? `${reward.points - balance} more points` : "Redeem reward"}
                </button>
              </PortalCard>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_.75fr]">
        <PortalCard className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-ink/10 px-5 py-5 sm:px-6"><div><p className="eyebrow text-rose-500">Recent activity</p><h2 className="mt-2 font-display text-2xl">Points history</h2></div><button onClick={() => toast("Statement ready", { description: "Your rewards statement would download as a PDF." })} className="text-[9px] font-bold uppercase tracking-[0.12em] text-rose-500">Download</button></div>
          <div className="divide-y divide-ink/8">
            {rewardActivity.map((activity) => <div key={activity.id} className="flex items-center gap-4 px-5 py-4 sm:px-6"><span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-full", activity.type === "earned" ? "bg-blush-100 text-rose-500" : "bg-cream text-gold")}><Star className="h-4 w-4" /></span><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold">{activity.title}</p><p className="mt-1 text-[10px] text-ink/35">{activity.date}</p></div><span className={cn("text-sm font-semibold", activity.points > 0 ? "text-emerald-700" : "text-ink/50")}>{activity.points > 0 ? "+" : ""}{activity.points}</span></div>)}
          </div>
        </PortalCard>

        <div className="space-y-4">
          {[
            { icon: ShoppingBag, title: "Shop & earn", text: "Two points for every dollar in our care edit.", href: "/shop", cta: "Shop the edit" },
            { icon: UsersRound, title: "Invite a friend", text: "You’ll both receive 250 points after their first visit.", href: "/contact", cta: "Share an invite" },
          ].map(({ icon: Icon, title, text, href, cta }) => <PortalCard key={title} className="p-5"><span className="grid h-10 w-10 place-items-center rounded-full bg-blush-100 text-rose-500"><Icon className="h-4 w-4" /></span><h3 className="mt-4 font-display text-xl">{title}</h3><p className="mt-2 text-[11px] leading-5 text-ink/45">{text}</p><Link href={href} className="mt-4 inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.12em] text-rose-500">{cta} <ArrowRight className="h-3.5 w-3.5" /></Link></PortalCard>)}
        </div>
      </div>
    </div>
  );
}
