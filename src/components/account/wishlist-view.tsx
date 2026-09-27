"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { CalendarPlus, Heart, ImagePlus, Search, Sparkles, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { savedLooks } from "@/components/account/data";
import { AccountPageHeader, PortalCard, fieldClass } from "@/components/account/portal-ui";

export function WishlistView() {
  const [looks, setLooks] = useState(savedLooks);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<(typeof savedLooks)[number] | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(
    () => looks.filter((look) => `${look.name} ${look.style}`.toLowerCase().includes(query.toLowerCase())),
    [looks, query],
  );

  function removeLook(id: number) {
    const look = looks.find((item) => item.id === id);
    setLooks((current) => current.filter((item) => item.id !== id));
    setSelected(null);
    toast("Removed from saved looks", {
      description: look?.name,
      action: { label: "Undo", onClick: () => look && setLooks((current) => [...current, look].sort((a, b) => a.id - b.id)) },
    });
  }

  return (
    <div className="space-y-7">
      <AccountPageHeader
        eyebrow="Your private edit"
        title="Saved looks"
        description="Keep every shade, shape, and tiny detail that catches your eye. Share a saved look with your artist when you book."
        action={
          <>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={() => toast.success("Inspiration saved", { description: "Your image is now ready to share with your artist." })} />
            <button onClick={() => fileRef.current?.click()} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 text-[10px] font-bold uppercase tracking-[0.13em] text-white hover:bg-black"><ImagePlus className="h-4 w-4 text-blush-300" /> Add inspiration</button>
          </>
        }
      />

      <PortalCard className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/30" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search your looks" className={`${fieldClass} pl-11`} />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-ink/35">{looks.length} {looks.length === 1 ? "look" : "looks"} saved</p>
      </PortalCard>

      {filtered.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((look) => (
            <article key={look.id} className="group overflow-hidden rounded-[24px] border border-ink/10 bg-white shadow-[0_12px_40px_rgba(56,39,31,.05)]">
              <button onClick={() => setSelected(look)} className="relative block aspect-[4/3] w-full overflow-hidden text-left">
                <Image src={look.image} alt={look.name} fill className="object-cover transition duration-700 group-hover:scale-105" sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                <span className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-rose-500 shadow-sm backdrop-blur"><Heart className="h-4 w-4 fill-current" /></span>
                <span className="absolute bottom-4 left-4 rounded-full bg-ink/75 px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur">{look.style}</span>
              </button>
              <div className="p-5">
                <div className="flex items-start justify-between gap-4"><div><h2 className="font-display text-2xl">{look.name}</h2><p className="mt-1 text-[10px] text-ink/35">Saved {look.saved}</p></div><button onClick={() => removeLook(look.id)} aria-label={`Remove ${look.name}`} className="grid h-9 w-9 place-items-center rounded-full text-ink/30 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button></div>
                <div className="mt-5 flex gap-2">
                  <Link href="/book" onClick={() => toast.success("Look attached", { description: `${look.name} will be shared with your artist.` })} className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-full bg-ink px-4 text-[9px] font-bold uppercase tracking-[0.11em] text-white hover:bg-black"><CalendarPlus className="h-3.5 w-3.5 text-blush-300" /> Book this look</Link>
                  <button onClick={() => setSelected(look)} className="inline-flex min-h-10 items-center justify-center rounded-full border border-ink/15 px-4 text-[9px] font-bold uppercase tracking-[0.11em] hover:border-ink">View</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <PortalCard className="p-10 text-center sm:p-16">
          <Search className="mx-auto h-7 w-7 text-ink/20" /><h2 className="mt-4 font-display text-3xl">No matching looks</h2><p className="mt-2 text-sm text-ink/45">Try a different name or style.</p><button onClick={() => setQuery("")} className="mt-5 text-[10px] font-bold uppercase tracking-[0.13em] text-rose-500">Clear search</button>
        </PortalCard>
      )}

      <PortalCard className="relative overflow-hidden bg-blush-100/60 p-6 sm:p-8">
        <div className="absolute -right-10 -top-14 h-40 w-40 rounded-full bg-blush-300/30 blur-2xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-4"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-gold"><Sparkles className="h-5 w-5" /></span><div><h2 className="font-display text-2xl">Find your next detail</h2><p className="mt-1 text-xs leading-5 text-ink/50">Browse our latest artist work and save anything you love.</p></div></div>
          <Link href="/gallery" className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-full border border-ink/20 px-5 text-[10px] font-bold uppercase tracking-[0.12em] hover:bg-ink hover:text-white">Explore lookbook</Link>
        </div>
      </PortalCard>

      {selected ? (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/70 p-0 pt-[env(safe-area-inset-top)] backdrop-blur-sm md:grid md:place-items-center md:p-4" role="dialog" aria-modal="true" aria-label={selected.name}>
          <button className="absolute inset-0" onClick={() => setSelected(null)} aria-label="Close preview" />
          <div className="relative z-10 max-h-[calc(100dvh-env(safe-area-inset-top))] w-full max-w-3xl overflow-y-auto rounded-t-[28px] bg-white pb-[env(safe-area-inset-bottom)] shadow-2xl md:grid md:grid-cols-[1.1fr_.9fr] md:overflow-hidden md:rounded-[28px] md:pb-0">
            <div className="relative min-h-[280px] md:min-h-[520px]"><Image src={selected.image} alt={selected.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 55vw" /></div>
            <div className="flex flex-col p-6 sm:p-8">
              <button onClick={() => setSelected(null)} className="ml-auto grid h-11 w-11 place-items-center rounded-full border border-ink/10" aria-label="Close"><X className="h-4 w-4" /></button>
              <p className="eyebrow mt-8 text-rose-500">{selected.style}</p><h2 className="mt-3 font-display text-4xl">{selected.name}</h2><p className="mt-4 text-sm leading-6 text-ink/50">Bring this reference to your appointment and your artist will tailor the color, shape, and details to you.</p>
              <div className="mt-auto pt-8"><Link href="/book" onClick={() => toast.success("Look attached to booking")} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-ink px-5 text-[10px] font-bold uppercase tracking-[0.12em] text-white"><CalendarPlus className="h-4 w-4 text-blush-300" /> Book this look</Link><button onClick={() => removeLook(selected.id)} className="mt-3 inline-flex min-h-10 w-full items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-ink/40 hover:text-red-600"><Trash2 className="h-3.5 w-3.5" /> Remove from saved</button></div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
