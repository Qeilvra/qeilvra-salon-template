import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Clock3, Heart, ShieldCheck, Sparkles, Star } from "lucide-react";
import { ServiceCard } from "@/components/cards/service-card";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { reviews, services } from "@/lib/site-data";
import { formatCurrency } from "@/lib/utils";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  return service ? { title: service.name, description: service.description } : { title: "Service" };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) notFound();
  const related = services.filter((item) => item.slug !== service.slug).slice(0, 3);

  return (
    <>
      <section className="bg-cream py-6 sm:py-10">
        <div className="container-shell"><ButtonLink href="/services" variant="ghost" size="sm"><ArrowLeft className="h-4 w-4" /> All services</ButtonLink></div>
      </section>
      <section className="bg-cream pb-16 sm:pb-24">
        <div className="container-shell grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div className="editorial-image relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-blush-100 sm:aspect-[5/4]">
            <Image src={service.image} alt={service.name} fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 52vw" />
            <span className="absolute bottom-5 left-5 rounded-full bg-white/90 px-4 py-2 text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur">{service.category}</span>
          </div>
          <div className="lg:pl-10">
            <p className="eyebrow text-rose-500">Maison Élan ritual</p>
            <h1 className="display-title mt-5 text-5xl sm:text-7xl">{service.name}</h1>
            <p className="mt-6 text-sm leading-7 text-ink/62 sm:text-base">{service.longDescription}</p>
            <div className="mt-8 flex flex-wrap items-center gap-6 border-y border-ink/10 py-5">
              <span><small className="block text-[9px] uppercase tracking-wider text-ink/40">From</small><strong className="mt-1 block font-display text-3xl font-normal">{formatCurrency(service.price)}</strong></span>
              <span><small className="block text-[9px] uppercase tracking-wider text-ink/40">Time</small><strong className="mt-2 flex items-center gap-2 text-sm font-semibold"><Clock3 className="h-4 w-4 text-rose-500" />{service.duration} minutes</strong></span>
              <span><small className="block text-[9px] uppercase tracking-wider text-ink/40">Guest rating</small><strong className="mt-2 flex items-center gap-2 text-sm font-semibold"><Star className="h-4 w-4 fill-gold text-gold" />4.9 / 5</strong></span>
            </div>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">{service.benefits.map((benefit) => <li key={benefit} className="flex items-center gap-3 text-xs"><span className="grid h-6 w-6 place-items-center rounded-full bg-blush-200"><Check className="h-3.5 w-3.5 text-rose-500" /></span>{benefit}</li>)}</ul>
            <div className="mt-9 flex flex-wrap gap-3"><ButtonLink href={`/book/service?service=${service.slug}`} size="lg">Book this ritual <ArrowRight className="h-4 w-4" /></ButtonLink><ButtonLink href="/contact" size="lg" variant="ghost"><Heart className="h-4 w-4" /> Ask an artist</ButtonLink></div>
          </div>
        </div>
      </section>

      <section className="py-20"><div className="container-shell grid gap-10 lg:grid-cols-[1fr_.8fr]">
        <div><p className="eyebrow text-rose-500">Your experience</p><h2 className="display-title mt-4 text-5xl">What to expect</h2><div className="mt-8 grid gap-5">{[["01", "Consult", "We begin with your nail history, goals, preferred shape and inspiration."], ["02", "Perfect", "Your artist prepares, shapes and refines using the technique best suited to you."], ["03", "Restore", "A nourishing finishing ritual leaves hands soft and every detail immaculate."]].map(([number, title, text]) => <div key={number} className="flex gap-5 rounded-2xl border border-ink/10 p-5"><span className="font-display text-3xl italic text-blush-400">{number}</span><div><h3 className="font-display text-xl">{title}</h3><p className="mt-1 text-xs leading-5 text-ink/55">{text}</p></div></div>)}</div></div>
        <aside className="rounded-[2rem] bg-ink p-8 text-white sm:p-10"><ShieldCheck className="h-9 w-9 text-blush-300" /><h2 className="display-title mt-6 text-4xl">The care promise</h2><p className="mt-5 text-sm leading-7 text-white/60">We never over-file or rush removal. Your natural nail health guides every product and technique we choose.</p><div className="mt-7 space-y-4 text-xs text-white/70">{["Single-use files and buffers", "Hospital-grade sterilization", "Vegan and cruelty-free options", "7-day finish guarantee"].map((item) => <p key={item} className="flex items-center gap-3"><Sparkles className="h-4 w-4 text-blush-300" />{item}</p>)}</div></aside>
      </div></section>

      <section className="bg-cream py-20"><div className="container-shell"><SectionHeading eyebrow="You may also love" title="Complete your ritual" /><div className="mt-10 grid gap-5 md:grid-cols-3">{related.map((item, index) => <ServiceCard key={item.slug} service={item} index={index} />)}</div></div></section>
      <section className="bg-blush-300 py-14"><div className="container-shell flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left"><div><p className="flex items-center justify-center gap-1 sm:justify-start">{Array.from({length:5}).map((_, index) => <Star key={index} className="h-4 w-4 fill-ink text-ink" />)}</p><p className="mt-3 font-display text-2xl italic">“{reviews[0].text}”</p><p className="mt-2 text-xs text-ink/60">— {reviews[0].name}</p></div><ButtonLink href={`/book/service?service=${service.slug}`} variant="secondary" className="shrink-0">Reserve {service.name}<ArrowRight className="h-4 w-4" /></ButtonLink></div></section>
    </>
  );
}

