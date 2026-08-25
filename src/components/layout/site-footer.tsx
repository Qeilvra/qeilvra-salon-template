"use client";

import Link from "next/link";
import { ArrowRight, Clock3, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { navItems, siteFacts } from "@/lib/site-data";

const company = [
  ["About", "/about"],
  ["Our artists", "/team"],
  ["Reviews", "/reviews"],
  ["Careers", "/careers"],
  ["Contact", "/contact"],
];

const support = [
  ["FAQs", "/faq"],
  ["Cancellation policy", "/policies/cancellation"],
  ["Refund policy", "/policies/refunds"],
  ["Privacy", "/policies/privacy"],
  ["Terms", "/policies/terms"],
];

export function SiteFooter() {
  const [email, setEmail] = useState("");

  function subscribe(event: FormEvent) {
    event.preventDefault();
    toast.success("Welcome to the Maison", { description: "Your first note will arrive soon." });
    setEmail("");
  }

  return (
    <footer className="bg-ink text-white">
      <div className="border-b border-white/10 bg-blush-300 text-ink">
        <div className="container-shell grid gap-7 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Easy booking", "Choose your artist and time in a few simple steps."],
            ["Thoughtful rewards", "Earn points every time you visit or shop."],
            ["Private events", "Beautiful group rituals, tailored to your occasion."],
            ["Gift beautifully", "Instant digital gift cards, ready in moments."],
          ].map(([title, text], index) => (
            <div key={title} className="flex gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-ink/25 font-display text-lg italic">0{index + 1}</span>
              <div><h3 className="font-display text-xl">{title}</h3><p className="mt-1 text-xs leading-5 text-ink/65">{text}</p></div>
            </div>
          ))}
        </div>
      </div>

      <div className="container-shell grid gap-8 py-12 md:gap-12 md:py-16 lg:grid-cols-[1.25fr_.8fr_.8fr_1.3fr]">
        <div>
          <span className="font-display text-4xl italic text-blush-300">Maison Élan</span>
          <p className="mt-5 max-w-xs text-sm leading-7 text-white/55">
            A modern nail atelier where expert craft, restorative care and quiet luxury come together.
          </p>
          <div className="mt-7 space-y-1 text-xs text-white/65 md:space-y-3">
            <a href={`tel:${siteFacts.phone}`} className="flex min-h-11 items-center gap-3 hover:text-white md:min-h-0"><Phone className="h-4 w-4 text-blush-300" />{siteFacts.phone}</a>
            <a href={`mailto:${siteFacts.email}`} className="flex min-h-11 items-center gap-3 hover:text-white md:min-h-0"><Mail className="h-4 w-4 text-blush-300" />{siteFacts.email}</a>
            <span className="flex min-h-11 items-start gap-3 py-2 md:min-h-0 md:py-0"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blush-300" />{siteFacts.address}</span>
            <span className="flex min-h-11 items-start gap-3 py-2 md:min-h-0 md:py-0"><Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-blush-300" />{siteFacts.hours}</span>
          </div>
        </div>
        <FooterColumn title="Discover" links={navItems.map((item) => [item.label, item.href])} />
        <div className="grid gap-3 md:grid-cols-2 md:gap-8 lg:grid-cols-1">
          <FooterColumn title="Maison" links={company} />
          <FooterColumn title="Support" links={support} />
        </div>
        <div>
          <p className="eyebrow text-blush-300">The Élan Edit</p>
          <h3 className="mt-4 font-display text-3xl">A beautiful note, occasionally.</h3>
          <p className="mt-3 text-sm leading-6 text-white/55">New rituals, artist tips, private offers and appointments worth knowing about.</p>
          <form onSubmit={subscribe} className="mt-6 flex rounded-full border border-white/20 bg-white/[0.04] p-1.5 focus-within:border-blush-300">
            <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email address" className="min-w-0 flex-1 bg-transparent px-4 text-xs text-white outline-none placeholder:text-white/35" />
            <button aria-label="Subscribe" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-blush-300 text-ink hover:bg-blush-400"><ArrowRight className="h-4 w-4" /></button>
          </form>
          <a href="https://instagram.com" className="mt-5 inline-flex min-h-11 items-center gap-2 text-xs text-white/65 hover:text-white md:mt-7 md:min-h-0"><Instagram className="h-4 w-4 text-blush-300" /> @maisonelan.atelier</a>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-shell flex flex-col gap-3 py-6 text-[10px] uppercase tracking-[0.12em] text-white/35 max-md:text-[11px] max-md:leading-5 max-md:tracking-[0.08em] sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Maison Élan Nail Atelier. All rights reserved.</span>
          <span>Designed for slower moments & beautiful details.</span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: string[][] }) {
  return (
    <>
      <details className="group border-y border-white/10 md:hidden">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-blush-300">
          {title}<span aria-hidden="true" className="text-lg font-light text-white/45 transition-transform group-open:rotate-45">+</span>
        </summary>
        <div className="grid gap-1 pb-4">
          {links.map(([label, href]) => <Link key={`mobile-${label}-${href}`} href={href} className="flex min-h-11 items-center text-sm text-white/60 hover:text-white">{label}</Link>)}
        </div>
      </details>
      <div className="hidden md:block">
        <p className="eyebrow text-blush-300">{title}</p>
        <div className="mt-5 grid gap-3">
          {links.map(([label, href]) => <Link key={`${label}-${href}`} href={href} className="text-xs text-white/55 hover:translate-x-1 hover:text-white">{label}</Link>)}
        </div>
      </div>
    </>
  );
}
