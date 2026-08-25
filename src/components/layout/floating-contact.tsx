"use client";

import { CalendarDays, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteFacts } from "@/lib/site-data";

export function FloatingContact() {
  const pathname = usePathname();
  const showMobileBooking = pathname !== "/cart" && pathname !== "/checkout" && !pathname.startsWith("/shop");

  return (
    <>
      <div className="fixed bottom-5 right-4 z-40 hidden flex-col gap-2 md:bottom-7 md:right-7 md:flex">
        <Link href="/book" className="group flex h-12 items-center gap-0 overflow-hidden rounded-full bg-blush-300 px-3 text-ink shadow-soft hover:gap-2 hover:px-4" aria-label="Book now">
          <CalendarDays className="h-5 w-5 shrink-0" /><span className="max-w-0 overflow-hidden whitespace-nowrap text-[10px] font-bold uppercase tracking-wider opacity-0 transition-all group-hover:max-w-20 group-hover:opacity-100">Book now</span>
        </Link>
        <a href={`tel:${siteFacts.phone}`} className="group flex h-12 items-center gap-0 overflow-hidden rounded-full bg-ink px-3 text-white shadow-soft hover:gap-2 hover:px-4" aria-label="Call us">
          <Phone className="h-5 w-5 shrink-0" /><span className="max-w-0 overflow-hidden whitespace-nowrap text-[10px] font-bold uppercase tracking-wider opacity-0 transition-all group-hover:max-w-16 group-hover:opacity-100">Call us</span>
        </a>
        <a href="https://wa.me/12145550198" className="group flex h-12 items-center gap-0 overflow-hidden rounded-full bg-[#2f8f67] px-3 text-white shadow-soft hover:gap-2 hover:px-4" aria-label="WhatsApp">
          <MessageCircle className="h-5 w-5 shrink-0" /><span className="max-w-0 overflow-hidden whitespace-nowrap text-[10px] font-bold uppercase tracking-wider opacity-0 transition-all group-hover:max-w-20 group-hover:opacity-100">WhatsApp</span>
        </a>
      </div>

      {showMobileBooking ? (
        <>
          <div className="fixed inset-x-3 z-40 flex items-center gap-2 rounded-[1.35rem] border border-white/10 bg-ink/95 p-2 shadow-[0_18px_45px_rgba(23,20,17,.3)] backdrop-blur-xl md:hidden" style={{ bottom: "max(0.65rem, env(safe-area-inset-bottom))" }}>
            <Link href="/book" className="flex min-h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-2xl bg-blush-300 px-4 text-[11px] font-bold uppercase tracking-[0.1em] text-ink">
              <CalendarDays className="h-4 w-4 shrink-0" /> <span className="truncate">Book appointment</span>
            </Link>
            <a href={`tel:${siteFacts.phone}`} className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/15 bg-white/[0.06] text-white" aria-label={`Call Maison Élan at ${siteFacts.phone}`}>
              <Phone className="h-5 w-5" />
            </a>
          </div>
          <div aria-hidden="true" className="h-[calc(5.25rem+env(safe-area-inset-bottom))] md:hidden" />
        </>
      ) : null}
    </>
  );
}
