import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, Star } from "lucide-react";
import { artists } from "@/lib/site-data";

type Artist = (typeof artists)[number];

export function ArtistCard({ artist }: { artist: Artist }) {
  return (
    <article className="group">
      <Link href={`/team/${artist.slug}`} className="editorial-image relative block aspect-[4/5] overflow-hidden rounded-t-[10rem] rounded-b-[1.5rem] bg-blush-100">
        <Image src={artist.image} alt={artist.name} fill sizes="(max-width: 768px) 90vw, 300px" className="object-cover grayscale-[12%]" />
        <span className="absolute bottom-4 right-4 grid h-11 w-11 place-items-center rounded-full bg-white text-ink shadow-soft transition-transform group-hover:rotate-45"><ArrowUpRight className="h-4 w-4" /></span>
      </Link>
      <div className="px-2 pt-5 text-center">
        <h3 className="font-display text-2xl">{artist.name}</h3>
        <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-rose-500">{artist.role}</p>
        <div className="mt-3 flex items-center justify-center gap-1 text-xs text-ink/50"><Star className="h-3.5 w-3.5 fill-gold text-gold" /> {artist.rating} · {artist.experience}</div>
        <p className="mt-3 text-xs italic leading-5 text-ink/60 sm:hidden">“{artist.quote}”</p>
        <div className="mt-3 flex flex-wrap justify-center gap-2 sm:hidden">
          {artist.specialties.map((specialty) => (
            <span key={specialty} className="rounded-full bg-blush-100 px-3 py-2 text-[11px] font-medium text-ink/70">{specialty}</span>
          ))}
        </div>
        <Link href={`/book/date-time?artist=${artist.slug}`} className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-ink px-4 text-[10px] font-bold uppercase tracking-[0.12em] text-white sm:hidden">
          <CalendarDays className="h-4 w-4" /> Book with {artist.name.split(" ")[0]}
        </Link>
      </div>
    </article>
  );
}
