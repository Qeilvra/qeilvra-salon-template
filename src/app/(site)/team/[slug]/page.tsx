import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarDays, Check, Instagram, Star } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { ArtistCard } from "@/components/cards/artist-card";
import { artists, services } from "@/lib/site-data";

export function generateStaticParams() { return artists.map((artist) => ({ slug: artist.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const artist = artists.find((item) => item.slug === slug);
  return { title: artist?.name ?? "Nail Artist", description: artist ? `Meet ${artist.name}, ${artist.role} at Maison Élan.` : undefined };
}

export default async function TechnicianProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const artist = artists.find((item) => item.slug === slug); if (!artist) notFound();
  const others = artists.filter((item) => item.slug !== slug).slice(0, 3);
  return (
    <>
      <section className="bg-cream py-16 sm:py-24"><div className="container-shell grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-center"><div className="relative mx-auto aspect-[4/5] w-full max-w-lg overflow-hidden rounded-t-[16rem] rounded-b-[2rem]"><Image src={artist.image} alt={artist.name} fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 42vw" /></div><div className="lg:pl-12"><p className="eyebrow text-rose-500">{artist.role}</p><h1 className="display-title mt-5 text-6xl sm:text-7xl">{artist.name}</h1><p className="mt-5 font-display text-2xl italic text-rose-500">“{artist.quote}”</p><div className="mt-6 flex flex-wrap gap-5 text-xs"><span className="flex items-center gap-2"><Star className="h-4 w-4 fill-gold text-gold" /> {artist.rating} guest rating</span><span>{artist.experience} experience</span></div><p className="mt-7 text-sm leading-7 text-ink/60">Known for a refined eye, a gentle touch and the ability to translate a mood into the perfect set. {artist.name.split(" ")[0]} approaches every appointment as a collaboration, with natural nail health always at the heart of the work.</p><div className="mt-7"><p className="text-[10px] font-bold uppercase tracking-wider">Specialties</p><div className="mt-3 flex flex-wrap gap-2">{artist.specialties.map((item) => <span key={item} className="rounded-full bg-blush-200 px-4 py-2 text-xs">{item}</span>)}</div></div><div className="mt-9 flex flex-wrap gap-3"><ButtonLink href={`/book/date-time?artist=${artist.slug}`} size="lg"><CalendarDays className="h-4 w-4" /> Book with {artist.name.split(" ")[0]}</ButtonLink><ButtonLink href="/gallery" variant="ghost" size="lg"><Instagram className="h-4 w-4" /> View work</ButtonLink></div></div></div></section>
      <section className="py-20"><div className="container-shell"><div className="grid gap-6 rounded-[2rem] bg-ink p-8 text-white sm:grid-cols-3 sm:p-12">{services.slice(0,3).map((service) => <div key={service.slug}><Check className="h-5 w-5 text-blush-300" /><h3 className="mt-4 font-display text-2xl">{service.name}</h3><p className="mt-2 text-xs leading-5 text-white/50">One of {artist.name.split(" ")[0]}’s most-booked rituals, tailored to you.</p><a href={`/book/service?service=${service.slug}&artist=${artist.slug}`} className="mt-4 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-blush-300">Reserve <ArrowRight className="h-3.5 w-3.5" /></a></div>)}</div></div></section>
      <section className="bg-cream py-20"><div className="container-shell"><h2 className="display-title text-center text-5xl">More artists to meet</h2><div className="mx-auto mt-10 grid max-w-4xl gap-8 sm:grid-cols-3">{others.map((item) => <ArtistCard key={item.slug} artist={item} />)}</div></div></section>
    </>
  );
}

