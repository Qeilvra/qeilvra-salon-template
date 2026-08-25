"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  Clock3,
  MapPin,
  Menu,
  Phone,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";
import { navItems, siteFacts } from "@/lib/site-data";
import { cn } from "@/lib/utils";
import { useShop } from "@/components/shop/shop-provider";

const exploreLinks = [
  { label: "About Maison Élan", href: "/about" },
  { label: "Pricing menu", href: "/pricing" },
  { label: "Client reviews", href: "/reviews" },
  { label: "Gift cards", href: "/gift-cards" },
  { label: "Offers", href: "/offers" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const { count } = useShop();
  const darkOverlay = pathname === "/" && !scrolled && !open;

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 18);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open || !window.matchMedia("(max-width: 767px)").matches) return;
    const previousOverflow = document.documentElement.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      window.requestAnimationFrame(() => menuButtonRef.current?.focus());
    };
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.documentElement.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <>
      <div className="hidden border-b border-white/10 bg-ink text-white lg:block">
        <div className="container-shell flex h-9 items-center justify-between text-[10px] tracking-wide text-white/65">
          <span className="flex items-center gap-2"><MapPin className="h-3 w-3 text-blush-300" /> {siteFacts.address}</span>
          <span className="flex items-center gap-2"><Clock3 className="h-3 w-3 text-blush-300" /> {siteFacts.hours}</span>
          <a className="flex items-center gap-2 hover:text-white" href={`tel:${siteFacts.phone}`}><Phone className="h-3 w-3 text-blush-300" /> {siteFacts.phone}</a>
        </div>
      </div>
      <header
        className={cn(
          "z-50 w-full border-b transition-all duration-300",
          pathname === "/" ? "absolute left-0 top-0 lg:top-9" : "sticky top-0",
          darkOverlay
            ? "border-white/10 bg-transparent text-white"
            : "border-ink/10 bg-[#fffdf9]/95 text-ink shadow-[0_8px_30px_rgba(23,20,17,.05)] backdrop-blur-xl",
        )}
      >
        <div className="container-shell flex h-16 items-center justify-between gap-3 md:h-[74px] md:gap-5 lg:h-[84px]">
          <Link href="/" className="shrink-0" aria-label="Maison Élan home">
            <span className={cn("block font-display text-[24px] italic leading-none tracking-[-0.03em] md:text-[28px]", darkOverlay ? "text-blush-300" : "text-gold")}>
              Maison Élan
            </span>
            <span className="mt-1 block text-center text-[7px] font-semibold uppercase tracking-[0.32em] opacity-65 md:text-[8px] md:tracking-[0.38em]">Nail atelier</span>
          </Link>

          <nav className="hidden items-center gap-6 xl:flex" aria-label="Primary navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative py-2 text-[11px] font-semibold uppercase tracking-[0.12em] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-blush-400 after:transition-all hover:after:w-full",
                  pathname.startsWith(item.href) && "after:w-full",
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="group relative">
              <button className="flex items-center gap-1 py-3 text-[11px] font-semibold uppercase tracking-[0.12em]">
                Explore <ChevronDown className="h-3 w-3" />
              </button>
              <div className="invisible absolute right-0 top-full w-56 translate-y-2 rounded-2xl border border-ink/10 bg-white p-2 text-ink opacity-0 shadow-soft transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                {exploreLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="block rounded-xl px-4 py-3 text-xs font-medium hover:bg-blush-50">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <Link href="/account" aria-label="My account" className="hidden h-10 w-10 items-center justify-center rounded-full hover:bg-blush-100 sm:flex">
              <UserRound className="h-[18px] w-[18px]" />
            </Link>
            <Link href="/cart" aria-label={`Shopping bag with ${count} items`} className="relative flex h-11 w-11 items-center justify-center rounded-full hover:bg-blush-100 md:h-10 md:w-10">
              <ShoppingBag className="h-[18px] w-[18px]" />
              {count > 0 ? <span className="absolute right-0 top-0 grid h-5 min-w-5 place-items-center rounded-full bg-blush-400 px-1 text-[9px] font-bold text-ink">{count}</span> : null}
            </Link>
            <Link href="/book" className="hidden min-h-11 items-center gap-2 rounded-full bg-blush-300 px-5 text-[10px] font-bold uppercase tracking-[0.12em] text-ink shadow-sm hover:-translate-y-0.5 hover:bg-blush-400 md:flex">
              <CalendarDays className="h-4 w-4" /> Book now
            </Link>
            <button ref={menuButtonRef} onClick={() => setOpen((value) => !value)} className="grid h-11 w-11 place-items-center rounded-full xl:hidden md:h-10 md:w-10" aria-label="Toggle navigation" aria-expanded={open} aria-controls="mobile-navigation">
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <button
          aria-label="Close navigation"
          tabIndex={open ? 0 : -1}
          onClick={() => setOpen(false)}
          className={cn("fixed inset-0 top-16 z-30 bg-ink/45 backdrop-blur-sm transition-opacity md:hidden", open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0")}
        />
        <div
          id="mobile-navigation"
          inert={!open}
          aria-hidden={!open}
          className={cn("fixed bottom-0 right-0 top-16 z-40 flex w-[min(88vw,360px)] flex-col overflow-y-auto overscroll-contain border-l border-ink/10 bg-[#fffdf9] text-ink shadow-2xl transition-transform duration-300 md:hidden", open ? "translate-x-0" : "translate-x-full")}
        >
          <nav className="grid gap-1 px-4 py-5" aria-label="Mobile navigation">
            <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-ink/35">Discover the Maison</p>
            {[...navItems, ...exploreLinks].map((item) => (
              <Link key={`mobile-${item.href}-${item.label}`} href={item.href} className="flex min-h-12 items-center justify-between rounded-xl px-3 text-sm font-medium hover:bg-blush-50">
                {item.label}<span aria-hidden="true" className="text-rose-500">↗</span>
              </Link>
            ))}
          </nav>
          <div className="mt-auto border-t border-ink/10 bg-cream px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
            <Link href="/book" className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-ink px-5 text-xs font-bold uppercase tracking-[0.12em] text-white">
              <CalendarDays className="h-4 w-4 text-blush-300" /> Book appointment
            </Link>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <a href={`tel:${siteFacts.phone}`} className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-ink/15 bg-white text-xs font-semibold"><Phone className="h-4 w-4 text-rose-500" /> Call us</a>
              <Link href="/account" className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-ink/15 bg-white text-xs font-semibold"><UserRound className="h-4 w-4 text-rose-500" /> Account</Link>
            </div>
          </div>
        </div>

        <div inert={!open} aria-hidden={!open} className={cn("hidden overflow-hidden border-t transition-all duration-300 md:block xl:hidden", open ? "max-h-[760px] border-ink/10" : "max-h-0 border-transparent")}>
          <div className="container-shell grid gap-1 bg-[#fffdf9]/98 py-5 text-ink">
            {[...navItems, ...exploreLinks].map((item) => (
              <Link key={`${item.href}-${item.label}`} href={item.href} className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium hover:bg-blush-50">
                {item.label}<span className="text-rose-500">↗</span>
              </Link>
            ))}
            <Link href="/book" className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-full bg-ink px-6 text-xs font-bold uppercase tracking-[0.12em] text-white">
              <CalendarDays className="h-4 w-4" /> Book an appointment
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
