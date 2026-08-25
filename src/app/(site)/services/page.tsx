import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { ServicesExplorer } from "@/components/services/services-explorer";
import { ButtonLink } from "@/components/ui/button";
import { ArrowRight, Gem, ShieldCheck, Sparkles } from "lucide-react";

export const metadata: Metadata = { title: "Nail Services", description: "Explore luxury manicures, pedicures, gel, extensions, nail art and spa rituals at Maison Élan." };

export default function ServicesPage() {
  return (
    <>
      <PageHero eyebrow="The treatment menu" title="Rituals for hands, feet & self" description="Every service begins with a conversation and ends with the kind of detail you’ll notice for weeks." image="/images/nail-art-editorial.png" />
      <section className="py-16 sm:py-24"><div className="container-shell"><ServicesExplorer /></div></section>
      <section className="bg-cream py-16">
        <div className="container-shell grid gap-8 md:grid-cols-3">
          {[[ShieldCheck, "Always immaculate", "Fresh files for every client and hospital-grade sterilization."], [Gem, "Tailored to you", "Shape, finish and care recommendations chosen for your nails."], [Sparkles, "Beautifully transparent", "Clear timings and pricing before your ritual begins."]].map(([Icon, title, text]) => {
            const IconComponent = Icon as typeof ShieldCheck;
            return <div key={title as string} className="text-center"><span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-blush-200"><IconComponent className="h-5 w-5 text-rose-500" /></span><h3 className="mt-4 font-display text-2xl">{title as string}</h3><p className="mx-auto mt-2 max-w-xs text-xs leading-6 text-ink/55">{text as string}</p></div>;
          })}
        </div>
        <div className="mt-10 text-center"><ButtonLink href="/pricing" variant="ghost">See the full pricing menu <ArrowRight className="h-4 w-4" /></ButtonLink></div>
      </section>
    </>
  );
}

