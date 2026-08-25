import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, ShieldCheck, Sparkles, Star } from "lucide-react";

export const metadata: Metadata = {
  title: { default: "Client Sign In", template: "%s | Maison Élan" },
  description: "Sign in or create your Maison Élan client account.",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#fffdf9] lg:grid lg:grid-cols-[minmax(380px,.88fr)_1.12fr]">
      <aside className="relative hidden min-h-screen overflow-hidden bg-ink lg:block">
        <Image src="/images/hero-luxury-manicure.png" alt="Luxury manicure at Maison Élan" fill priority className="object-cover object-center" sizes="45vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/15 to-black/80" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-9 text-white">
          <Link href="/" className="font-display text-3xl italic text-blush-300">Maison Élan</Link>
          <span className="text-[8px] font-bold uppercase tracking-[0.22em] text-white/55">Nail atelier</span>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-9 text-white xl:p-12">
          <span className="grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-white/10 backdrop-blur"><Sparkles className="h-5 w-5 text-blush-300" /></span>
          <p className="eyebrow mt-7 text-blush-300">Your private Maison</p>
          <h2 className="mt-4 max-w-lg font-display text-5xl leading-[1.02] xl:text-6xl">Beautiful care, remembered.</h2>
          <p className="mt-5 max-w-md text-sm leading-7 text-white/60">Book in moments, keep every favorite, and let each visit feel more personal than the last.</p>
          <div className="mt-8 grid max-w-xl gap-3 text-[11px] text-white/65 sm:grid-cols-3">
            {["Priority booking", "Élan rewards", "Saved preferences"].map((feature) => <span key={feature} className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-blush-300" /> {feature}</span>)}
          </div>
          <div className="mt-9 flex items-center gap-3 border-t border-white/15 pt-6"><div className="flex -space-x-2">{["AM", "PS", "ER"].map((initials) => <span key={initials} className="grid h-8 w-8 place-items-center rounded-full border-2 border-ink bg-blush-300 text-[8px] font-bold text-ink">{initials}</span>)}</div><div><div className="flex gap-0.5 text-blush-300">{Array.from({ length: 5 }).map((_, index) => <Star key={index} className="h-3 w-3 fill-current" />)}</div><p className="mt-1 text-[9px] text-white/45">Loved by 2,400+ clients</p></div></div>
        </div>
      </aside>

      <section className="relative flex min-h-screen flex-col">
        <header className="flex h-20 items-center justify-between border-b border-ink/10 px-5 sm:px-8 lg:border-0 lg:px-10">
          <Link href="/" className="font-display text-2xl italic text-gold lg:hidden">Maison Élan</Link>
          <Link href="/" className="inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.13em] text-ink/45 hover:text-rose-500 lg:ml-auto"><ArrowLeft className="h-3.5 w-3.5" /> Back to the Maison</Link>
        </header>
        <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
          <div className="w-full max-w-[480px]">{children}</div>
        </div>
        <footer className="flex flex-col items-center justify-between gap-3 border-t border-ink/10 px-6 py-5 text-[9px] uppercase tracking-[0.11em] text-ink/30 sm:flex-row"><span>© 2026 Maison Élan</span><span className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 text-rose-500" /> Secure client access</span></footer>
      </section>
    </main>
  );
}
