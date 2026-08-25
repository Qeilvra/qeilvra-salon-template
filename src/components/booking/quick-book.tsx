"use client";

import { useRouter } from "next/navigation";
import { CalendarDays, ChevronDown, Sparkles, UserRound } from "lucide-react";
import { useState } from "react";
import { artists, services } from "@/lib/site-data";

export function QuickBook() {
  const router = useRouter();
  const [service, setService] = useState(services[0].slug);
  const [artist, setArtist] = useState("first-available");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        router.push(`/book/date-time?service=${service}&artist=${artist}`);
      }}
      className="grid gap-2 rounded-[1.6rem] border border-white/15 bg-black/35 p-2 backdrop-blur-xl sm:grid-cols-[1fr_1fr_auto]"
    >
      <label className="relative flex min-h-14 items-center gap-3 rounded-[1.1rem] px-4 hover:bg-white/[0.06]">
        <Sparkles className="h-4 w-4 shrink-0 text-blush-300" />
        <span className="min-w-0 flex-1">
          <span className="block text-[9px] uppercase tracking-[0.14em] text-white/40">Choose a ritual</span>
          <select value={service} onChange={(event) => setService(event.target.value)} className="mt-1 w-full appearance-none bg-transparent pr-5 text-xs font-medium text-white outline-none">
            {services.map((item) => <option className="text-ink" key={item.slug} value={item.slug}>{item.name}</option>)}
          </select>
        </span>
        <ChevronDown className="pointer-events-none absolute right-4 h-3 w-3 text-white/35" />
      </label>
      <label className="relative flex min-h-14 items-center gap-3 rounded-[1.1rem] border-t border-white/10 px-4 hover:bg-white/[0.06] sm:border-l sm:border-t-0">
        <UserRound className="h-4 w-4 shrink-0 text-blush-300" />
        <span className="min-w-0 flex-1">
          <span className="block text-[9px] uppercase tracking-[0.14em] text-white/40">Your artist</span>
          <select value={artist} onChange={(event) => setArtist(event.target.value)} className="mt-1 w-full appearance-none bg-transparent pr-5 text-xs font-medium text-white outline-none">
            <option className="text-ink" value="first-available">First available</option>
            {artists.map((item) => <option className="text-ink" key={item.slug} value={item.slug}>{item.name}</option>)}
          </select>
        </span>
        <ChevronDown className="pointer-events-none absolute right-4 h-3 w-3 text-white/35" />
      </label>
      <button className="flex min-h-14 items-center justify-center gap-2 rounded-[1.1rem] bg-blush-300 px-6 text-[10px] font-bold uppercase tracking-[0.13em] text-ink hover:bg-blush-400">
        <CalendarDays className="h-4 w-4" /> Find a time
      </button>
    </form>
  );
}

