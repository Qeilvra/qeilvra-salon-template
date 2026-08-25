import type { Metadata } from "next";
import { ArrowRight, GraduationCap, HeartHandshake, Sparkles } from "lucide-react";
import { ArtistCard } from "@/components/cards/artist-card";
import { PageHero } from "@/components/layout/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { artists } from "@/lib/site-data";

export const metadata: Metadata = { title: "Our Nail Artists", description: "Meet the expert nail artists and wellness specialists at Maison Élan." };

export default function TeamPage() {
  return (
    <>
      <PageHero eyebrow="The people behind the polish" title="Artists who listen. Craft that lasts." description="A close-knit team of nail obsessives, trained in advanced technique and the quiet art of making people feel at home." image="/images/salon-interior.png" />
      <section className="py-14 md:py-28"><div className="container-shell"><SectionHeading eyebrow="Meet the team" title="Choose your nail confidante" description="Book by specialty, browse their work, or choose first available and let us make the perfect match." /><div className="mt-10 grid gap-10 sm:grid-cols-2 md:mt-14 lg:grid-cols-4">{artists.map((artist) => <ArtistCard key={artist.slug} artist={artist} />)}</div></div></section>
      <section className="bg-cream py-14 md:py-20"><div className="container-shell grid gap-5 md:grid-cols-3 md:gap-6">{[[GraduationCap, "Always learning", "Monthly technique education and ongoing nail-health training."], [HeartHandshake, "Warm by nature", "Skilled listeners who make every guest feel seen, never rushed."], [Sparkles, "Creatively fluent", "From understated classics to tiny works of art, beautifully balanced."]].map(([Icon, title, text]) => { const C = Icon as typeof Sparkles; return <div key={title as string} className="rounded-3xl border border-ink/10 bg-white p-6 md:p-7"><C className="h-6 w-6 text-rose-500" /><h3 className="mt-5 font-display text-2xl">{title as string}</h3><p className="mt-2 text-xs leading-6 text-ink/55">{text as string}</p></div>; })}</div></section>
      <section className="bg-ink py-14 text-white md:py-16"><div className="container-shell flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left"><div><p className="eyebrow text-blush-300">Join the Maison</p><h2 className="display-title mt-3 text-4xl">Do your best work, beautifully.</h2><p className="mt-2 text-sm text-white/55">We’re always happy to meet thoughtful, detail-obsessed artists.</p></div><ButtonLink href="/careers" variant="light" className="max-[479px]:w-full">Explore careers <ArrowRight className="h-4 w-4" /></ButtonLink></div></section>
    </>
  );
}
