"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Bell,
  CalendarPlus,
  ChevronDown,
  Crown,
  LogOut,
  Menu,
  Sparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { accountNav } from "@/lib/site-data";
import { cn } from "@/lib/utils";

export function AccountShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => setNavOpen(false), [pathname]);

  const activeFor = (href: string) =>
    href === "/account" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="min-h-screen bg-[#f8f4ef] text-ink">
      {navOpen ? (
        <button
          aria-label="Close account navigation"
          onClick={() => setNavOpen(false)}
          className="fixed inset-0 z-40 bg-ink/45 backdrop-blur-sm lg:hidden"
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[286px] flex-col border-r border-white/10 bg-ink text-white transition-transform duration-300 lg:translate-x-0",
          navOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-24 items-center justify-between border-b border-white/10 px-7">
          <Link href="/" className="group" aria-label="Maison Élan home">
            <span className="block font-display text-[28px] italic leading-none text-blush-300 group-hover:text-white">Maison Élan</span>
            <span className="mt-1.5 block text-[7px] font-semibold uppercase tracking-[0.42em] text-white/45">Client maison</span>
          </Link>
          <button onClick={() => setNavOpen(false)} className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-white/65 lg:hidden" aria-label="Close menu">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="border-b border-white/10 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-blush-300 font-display text-lg text-ink">AM</div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">Avery Morgan</p>
              <p className="mt-0.5 truncate text-[10px] uppercase tracking-[0.12em] text-white/40">Atelier member</p>
            </div>
          </div>
        </div>

        <nav className="no-scrollbar flex-1 overflow-y-auto px-4 py-5" aria-label="Account navigation">
          <p className="px-3 pb-3 text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">Your account</p>
          <div className="space-y-1">
            {accountNav.map((item) => {
              const Icon = item.icon;
              const active = activeFor(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex min-h-11 items-center gap-3 rounded-xl px-3.5 text-[12px] font-medium transition",
                    active ? "bg-white text-ink shadow-sm" : "text-white/55 hover:bg-white/[0.07] hover:text-white",
                  )}
                >
                  <Icon className={cn("h-[17px] w-[17px]", active ? "text-rose-500" : "text-blush-300/70 group-hover:text-blush-300")} />
                  <span>{item.label}</span>
                  {item.label === "Rewards" ? <span className="ml-auto rounded-full bg-blush-300 px-2 py-0.5 text-[8px] font-bold text-ink">760</span> : null}
                </Link>
              );
            })}
          </div>

          <div className="mt-7 overflow-hidden rounded-2xl border border-blush-300/25 bg-[radial-gradient(circle_at_top_right,rgba(238,189,184,.2),transparent_55%)] p-4">
            <Crown className="h-5 w-5 text-blush-300" />
            <p className="mt-3 font-display text-lg">Your next reward is close.</p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[76%] rounded-full bg-blush-300" /></div>
            <p className="mt-2 text-[10px] text-white/45">240 points to a $20 reward</p>
          </div>
        </nav>

        <div className="border-t border-white/10 p-4">
          <Link
            href="/auth/login"
            onClick={() => toast("Signed out safely", { description: "We’ll keep your preferences ready for next time." })}
            className="flex min-h-11 items-center gap-3 rounded-xl px-3.5 text-xs text-white/45 hover:bg-white/[0.07] hover:text-white"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </Link>
        </div>
      </aside>

      <div className="min-w-0 lg:pl-[286px]">
        <header className="sticky top-0 z-30 border-b border-ink/10 bg-[#fffdf9]/90 backdrop-blur-xl">
          <div className="flex h-[72px] items-center justify-between gap-3 px-4 sm:px-7 lg:px-10">
            <div className="flex items-center gap-3">
              <button onClick={() => setNavOpen(true)} className="grid h-10 w-10 place-items-center rounded-full border border-ink/10 bg-white lg:hidden" aria-label="Open account navigation">
                <Menu className="h-[18px] w-[18px]" />
              </button>
              <div className="hidden sm:block">
                <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-ink/35">Welcome back</p>
                <p className="mt-0.5 font-display text-lg">Avery’s Maison</p>
              </div>
              <Link href="/" className="font-display text-xl italic text-gold sm:hidden">Maison Élan</Link>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/book" className="hidden min-h-10 items-center gap-2 rounded-full bg-ink px-4 text-[10px] font-bold uppercase tracking-[0.12em] text-white hover:-translate-y-0.5 hover:bg-black sm:flex">
                <CalendarPlus className="h-4 w-4 text-blush-300" /> New booking
              </Link>
              <div className="relative">
                <button
                  onClick={() => { setNotificationsOpen((value) => !value); setProfileOpen(false); }}
                  className="relative grid h-10 w-10 place-items-center rounded-full border border-ink/10 bg-white hover:bg-blush-50"
                  aria-label="Notifications"
                  aria-expanded={notificationsOpen}
                >
                  <Bell className="h-[17px] w-[17px]" />
                  <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border-2 border-white bg-rose-500" />
                </button>
                {notificationsOpen ? (
                  <div className="absolute right-0 top-12 w-[min(21rem,calc(100vw-2rem))] rounded-2xl border border-ink/10 bg-white p-3 shadow-soft">
                    <div className="flex items-center justify-between px-2 py-2"><p className="font-display text-xl">Notifications</p><button onClick={() => setNotificationsOpen(false)} className="text-[10px] font-bold uppercase tracking-wider text-rose-500">Mark read</button></div>
                    <div className="rounded-xl bg-blush-50 p-3.5">
                      <div className="flex gap-3"><Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" /><div><p className="text-xs font-semibold">Your visit is coming up</p><p className="mt-1 text-[11px] leading-5 text-ink/50">Atelier Gel with Mina · Sep 3 at 11:00 AM</p></div></div>
                    </div>
                    <p className="px-3 py-4 text-center text-[11px] text-ink/35">You’re all caught up.</p>
                  </div>
                ) : null}
              </div>
              <div className="relative">
                <button
                  onClick={() => { setProfileOpen((value) => !value); setNotificationsOpen(false); }}
                  className="flex h-10 items-center gap-2 rounded-full border border-ink/10 bg-white p-1 pr-2 hover:bg-blush-50"
                  aria-label="Open profile menu"
                  aria-expanded={profileOpen}
                >
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-blush-300 text-[10px] font-bold">AM</span>
                  <ChevronDown className="hidden h-3.5 w-3.5 sm:block" />
                </button>
                {profileOpen ? (
                  <div className="absolute right-0 top-12 w-48 rounded-2xl border border-ink/10 bg-white p-2 text-xs shadow-soft">
                    <Link href="/account/profile" className="block rounded-xl px-3 py-2.5 hover:bg-blush-50">Profile settings</Link>
                    <Link href="/account/rewards" className="block rounded-xl px-3 py-2.5 hover:bg-blush-50">Rewards balance</Link>
                    <Link href="/auth/login" className="block rounded-xl px-3 py-2.5 text-rose-500 hover:bg-blush-50">Sign out</Link>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 py-7 sm:px-7 sm:py-9 lg:px-10 lg:py-10">
          <div className="mx-auto max-w-[1180px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
