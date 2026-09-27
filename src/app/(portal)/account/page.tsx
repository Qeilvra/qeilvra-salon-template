import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Gift,
  Heart,
  MapPin,
  ShoppingBag,
  Sparkles,
  Star,
} from "lucide-react";
import { portalAppointments, savedLooks } from "@/components/account/data";
import { AccountPageHeader, MetricCard, PortalCard, StatusPill } from "@/components/account/portal-ui";
import { services } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Account Overview",
};

export default function AccountOverviewPage() {
  const nextAppointment = portalAppointments[0];

  return (
    <div className="space-y-8">
      <AccountPageHeader
        eyebrow="Sunday, August 23"
        title="Good afternoon, Avery."
        description="Everything for your next ritual, thoughtfully gathered in one place."
        action={
          <Link href="/book" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-blush-300 px-5 text-[10px] font-bold uppercase tracking-[0.13em] hover:-translate-y-0.5 hover:bg-blush-400">
            <CalendarDays className="h-4 w-4" /> Book a visit
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <MetricCard icon={CalendarDays} label="Next visit" value="Sep 03" helper="11 days away" accent />
        <MetricCard icon={Star} label="Élan points" value="760" helper="240 to your next reward" />
        <MetricCard icon={Heart} label="Saved looks" value="6" helper="Your private edit" />
        <MetricCard icon={ShoppingBag} label="Orders" value="2" helper="All orders delivered" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_.8fr]">
        <PortalCard className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-ink/10 px-5 py-5 sm:px-7">
            <div>
              <p className="eyebrow text-rose-500">Your next appointment</p>
              <h2 className="mt-2 font-display text-2xl">A beautiful moment, reserved.</h2>
            </div>
            <StatusPill tone="success">Confirmed</StatusPill>
          </div>
          <div className="grid md:grid-cols-[180px_1fr]">
            <div className="relative min-h-[210px] overflow-hidden md:min-h-full">
              <Image src={nextAppointment.image} alt="Blush gel manicure" fill className="object-cover" sizes="(max-width: 768px) 100vw, 180px" />
              <div className="absolute left-4 top-4 rounded-2xl bg-white/95 px-3 py-2 text-center shadow-sm backdrop-blur">
                <span className="block font-display text-2xl leading-none">{nextAppointment.day}</span>
                <span className="mt-1 block text-[8px] font-bold uppercase tracking-[0.15em] text-rose-500">{nextAppointment.month}</span>
              </div>
            </div>
            <div className="p-5 sm:p-7">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-display text-3xl">{nextAppointment.service}</h3>
                  <p className="mt-1 text-sm text-ink/50">with {nextAppointment.artist}</p>
                </div>
                <p className="font-display text-2xl">${nextAppointment.price}</p>
              </div>
              <div className="mt-6 grid gap-3 text-xs text-ink/60 sm:grid-cols-3">
                <span className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-rose-500" /> {nextAppointment.date.replace(", 2026", "")}</span>
                <span className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-rose-500" /> {nextAppointment.time}</span>
                <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-rose-500" /> Dallas atelier</span>
              </div>
              {nextAppointment.note ? <div className="mt-5 rounded-2xl bg-cream px-4 py-3 text-xs leading-5 text-ink/55"><span className="font-semibold text-ink">Your note:</span> {nextAppointment.note}</div> : null}
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={`/account/appointments/manage?id=${nextAppointment.id}`} className="inline-flex min-h-10 items-center justify-center rounded-full border border-ink bg-ink px-5 text-[10px] font-bold uppercase tracking-[0.12em] text-white hover:bg-black">Manage visit</Link>
                <Link href="/account/appointments" className="inline-flex min-h-10 items-center justify-center rounded-full border border-ink/15 px-5 text-[10px] font-bold uppercase tracking-[0.12em] hover:border-ink">All appointments</Link>
              </div>
            </div>
          </div>
        </PortalCard>

        <PortalCard className="overflow-hidden bg-ink text-white">
          <div className="relative p-6 sm:p-7">
            <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-blush-300/15 blur-2xl" />
            <div className="relative">
              <span className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-blush-300"><Star className="h-5 w-5" /></span>
              <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.17em] text-blush-300">Élan rewards</p>
              <div className="mt-2 flex items-end justify-between"><h2 className="font-display text-4xl">760 points</h2><span className="pb-1 text-[10px] text-white/40">Atelier tier</span></div>
              <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[76%] rounded-full bg-blush-300" /></div>
              <p className="mt-3 text-xs leading-5 text-white/45">Just 240 more points unlocks a $20 service reward.</p>
              <Link href="/account/rewards" className="mt-7 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.13em] text-blush-300 hover:text-white">View rewards <ArrowRight className="h-3.5 w-3.5" /></Link>
            </div>
          </div>
        </PortalCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_.95fr]">
        <PortalCard className="p-5 sm:p-7">
          <div className="flex items-center justify-between">
            <div><p className="eyebrow text-rose-500">Saved for later</p><h2 className="mt-2 font-display text-2xl">Your lookbook edit</h2></div>
            <Link href="/account/wishlist" className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-rose-500">View all <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3">
            {savedLooks.slice(0, 3).map((look) => (
              <Link key={look.id} href="/account/wishlist" className="group relative aspect-[4/5] overflow-hidden rounded-2xl">
                <Image src={look.image} alt={look.name} fill className="object-cover transition duration-700 group-hover:scale-105" sizes="(max-width: 640px) 30vw, 180px" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-10"><p className="truncate text-[11px] font-semibold text-white">{look.name}</p></div>
              </Link>
            ))}
          </div>
        </PortalCard>

        <PortalCard className="p-5 sm:p-7">
          <div className="flex items-center justify-between"><div><p className="eyebrow text-rose-500">Curated for you</p><h2 className="mt-2 font-display text-2xl">Your next ritual</h2></div><Sparkles className="h-5 w-5 text-gold" /></div>
          <div className="mt-5 space-y-3">
            {services.slice(4, 7).map((service) => (
              <Link key={service.slug} href={`/services/${service.slug}`} className="group flex items-center gap-4 rounded-2xl border border-ink/10 p-3 hover:border-blush-300 hover:bg-blush-50">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl"><Image src={service.image} alt="" fill className="object-cover" sizes="64px" /></div>
                <div className="min-w-0 flex-1"><p className="text-xs font-semibold">{service.name}</p><p className="mt-1 truncate text-[11px] text-ink/45">{service.duration} min · from ${service.price}</p></div>
                <ArrowRight className="h-4 w-4 text-ink/25 transition group-hover:translate-x-1 group-hover:text-rose-500" />
              </Link>
            ))}
          </div>
        </PortalCard>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: Gift, title: "Gift beautifully", text: "Send an instant Maison gift card.", href: "/gift-cards" },
          { icon: Sparkles, title: "Member privileges", text: "Explore what your Atelier plan includes.", href: "/membership" },
          { icon: ShoppingBag, title: "Care between visits", text: "Shop our artist-approved home rituals.", href: "/shop" },
        ].map(({ icon: Icon, title, text, href }) => (
          <Link key={title} href={href} className="group flex gap-4 rounded-[22px] border border-ink/10 bg-white p-5 hover:-translate-y-0.5 hover:border-blush-300 hover:shadow-card">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blush-100 text-rose-500"><Icon className="h-4 w-4" /></span>
            <div><p className="font-display text-lg">{title}</p><p className="mt-1 text-[11px] leading-5 text-ink/45">{text}</p></div>
          </Link>
        ))}
      </div>
    </div>
  );
}
