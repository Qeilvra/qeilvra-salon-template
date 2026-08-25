"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bell,
  CalendarCheck2,
  ChevronDown,
  Command,
  ExternalLink,
  Menu,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { adminNav } from "@/lib/site-data";
import { cn } from "@/lib/utils";
import { Avatar } from "./admin-ui";

const groups = [
  { label: "Workspace", items: ["Overview", "Appointments", "Customers"] },
  { label: "Salon", items: ["Services", "Categories", "Team"] },
  { label: "Commerce & content", items: ["Products", "Reviews", "Journal", "Promotions", "Memberships", "Gift cards"] },
  { label: "Business", items: ["Reports", "Settings"] },
];

const pageTitles: Record<string, string> = {
  "/admin": "Overview",
  "/admin/appointments": "Appointments",
  "/admin/customers": "Customers",
  "/admin/services": "Services",
  "/admin/categories": "Service categories",
  "/admin/staff": "Team & availability",
  "/admin/products": "Products",
  "/admin/reviews": "Reviews",
  "/admin/blog": "Journal",
  "/admin/promotions": "Promotions",
  "/admin/memberships": "Memberships",
  "/admin/gift-cards": "Gift cards",
  "/admin/reports": "Reports & analytics",
  "/admin/settings": "Settings",
};

function Sidebar({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col bg-[#171411] text-white">
      <div className="flex h-[84px] items-center border-b border-white/10 px-6">
        <Link href="/admin" onClick={onNavigate} className="flex items-center gap-3" aria-label="Maison Elan admin home">
          <span className="grid h-10 w-10 place-items-center rounded-2xl border border-blush-300/30 bg-blush-300/10 text-blush-300">
            <Sparkles className="h-[18px] w-[18px]" />
          </span>
          <span>
            <span className="block font-display text-xl leading-none tracking-tight">Maison Élan</span>
            <span className="mt-1 block text-[8px] font-bold uppercase tracking-[0.28em] text-blush-300/80">Salon command</span>
          </span>
        </Link>
      </div>

      <nav className="no-scrollbar flex-1 overflow-y-auto px-3 py-5" aria-label="Admin navigation">
        {groups.map((group) => (
          <div key={group.label} className="mb-5">
            <p className="mb-2 px-3 text-[9px] font-bold uppercase tracking-[0.2em] text-white/35">{group.label}</p>
            <div className="space-y-1">
              {adminNav.filter((item) => group.items.includes(item.label)).map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "group relative flex h-10 min-h-11 items-center gap-3 rounded-xl px-3 text-xs font-medium md:min-h-0",
                      active ? "bg-white/[0.09] text-white" : "text-white/55 hover:bg-white/[0.05] hover:text-white/90",
                    )}
                  >
                    {active ? <span className="absolute left-0 h-5 w-0.5 rounded-r-full bg-blush-300" /> : null}
                    <Icon className={cn("h-[17px] w-[17px]", active ? "text-blush-300" : "text-white/40 group-hover:text-white/70")} />
                    <span>{item.label}</span>
                    {item.label === "Appointments" ? <span className="ml-auto rounded-md bg-blush-300/15 px-1.5 py-0.5 text-[9px] font-bold text-blush-300">8</span> : null}
                    {item.label === "Reviews" ? <span className="ml-auto h-1.5 w-1.5 rounded-full bg-amber-400" /> : null}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
          <div className="flex items-center gap-3">
            <Avatar name="Olivia Bennett" size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold">Olivia Bennett</p>
              <p className="mt-0.5 truncate text-[10px] text-white/40">Salon administrator</p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-white/35" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const mobileDrawerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        document.getElementById("admin-global-search")?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = "hidden";

    const focusTimer = window.requestAnimationFrame(() => {
      mobileDrawerRef.current?.querySelector<HTMLElement>("button, a[href]")?.focus();
    });
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMobileOpen(false);
        return;
      }
      if (event.key !== "Tab" || !mobileDrawerRef.current) return;
      const focusable = Array.from(mobileDrawerRef.current.querySelectorAll<HTMLElement>("button:not([disabled]), a[href], [tabindex]:not([tabindex='-1'])"));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [mobileOpen]);

  const title = useMemo(() => pageTitles[pathname] ?? "Admin", [pathname]);
  const formattedDate = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" }).format(new Date());

  return (
    <div className="min-h-screen bg-[#f8f6f3] text-ink max-md:overflow-x-hidden">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[252px] lg:block">
        <Sidebar pathname={pathname} />
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <button aria-label="Close navigation" className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" onClick={() => setMobileOpen(false)} />
          <aside ref={mobileDrawerRef} role="dialog" aria-modal="true" aria-label="Admin navigation" className="relative h-full w-[284px] max-w-[86vw] pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)] shadow-2xl">
            <button aria-label="Close navigation" onClick={() => setMobileOpen(false)} className="absolute right-3 top-[calc(1.25rem+env(safe-area-inset-top))] z-10 grid h-9 w-9 min-h-11 min-w-11 place-items-center rounded-xl border border-white/10 text-white/60 hover:bg-white/10 hover:text-white md:min-h-0 md:min-w-0">
              <X className="h-4 w-4" />
            </button>
            <Sidebar pathname={pathname} onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      ) : null}

      <div className="lg:pl-[252px]">
        <header className="sticky top-0 z-30 flex h-[72px] items-center border-b border-stone-200/80 bg-white/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <button aria-label="Open navigation" onClick={() => setMobileOpen(true)} className="mr-3 grid h-10 w-10 min-h-11 min-w-11 place-items-center rounded-xl border border-stone-200 text-stone-600 md:min-h-0 md:min-w-0 lg:hidden">
            <Menu className="h-[18px] w-[18px]" />
          </button>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">{title}</p>
            <p className="mt-0.5 hidden text-[10px] text-stone-400 sm:block">{formattedDate} · Dallas studio</p>
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <label className="relative hidden w-48 xl:block">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone-400" />
              <input
                id="admin-global-search"
                value={globalSearch}
                onChange={(event) => setGlobalSearch(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && globalSearch && toast.info(`Searching Maison Élan for “${globalSearch}”`)}
                placeholder="Search workspace"
                className="h-9 w-full rounded-xl border border-stone-200 bg-stone-50 pl-8 pr-10 text-[11px] focus:border-blush-400 focus:bg-white focus:outline-none"
              />
              <span className="absolute right-2 top-1/2 inline-flex -translate-y-1/2 items-center gap-0.5 rounded border border-stone-200 bg-white px-1.5 py-0.5 text-[8px] font-semibold text-stone-400"><Command className="h-2.5 w-2.5" />K</span>
            </label>

            <Link href="/book" className="hidden h-9 items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 text-[11px] font-semibold text-stone-600 hover:border-stone-300 hover:text-ink md:inline-flex">
              <CalendarCheck2 className="h-3.5 w-3.5" /> New booking
            </Link>
            <Link href="/" target="_blank" className="hidden h-9 items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 text-[11px] font-semibold text-stone-600 hover:border-stone-300 hover:text-ink sm:inline-flex">
              View site <ExternalLink className="h-3 w-3" />
            </Link>
            <button aria-label="Notifications" onClick={() => toast("You’re all caught up", { description: "No new operational alerts." })} className="relative grid h-9 w-9 min-h-11 min-w-11 place-items-center rounded-xl border border-stone-200 bg-white text-stone-500 hover:text-ink md:min-h-0 md:min-w-0">
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-blush-500 ring-2 ring-white" />
            </button>
            <Avatar name="Olivia Bennett" size="sm" />
          </div>
        </header>

        <main className="admin-grid min-h-[calc(100vh-72px)] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="mx-auto max-w-[1440px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
