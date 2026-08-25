import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { posts } from "@/lib/site-data";

export const metadata: Metadata = { title: "The Élan Edit", description: "Nail health, beauty tips, artist advice and quiet-luxury inspiration from Maison Élan." };

export default function BlogPage() {
  const featured = posts[0];

  return (
    <>
      <PageHero eyebrow="The Élan Edit" title="Notes for beautiful hands & slower moments" description="Artist advice, considered trends and small rituals that keep the salon feeling with you." image="/images/spa-flatlay.png" />
      <section className="py-14 md:py-20">
        <div className="container-shell">
          <Link href={`/blog/${featured.slug}`} className="group grid overflow-hidden rounded-[2rem] bg-ink text-white lg:grid-cols-[1.2fr_.8fr]">
            <div className="relative min-h-[300px] md:min-h-[380px]"><Image src={featured.image} alt={featured.title} fill priority className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" sizes="(max-width: 767px) calc(100vw - 2rem), 60vw" /></div>
            <div className="flex flex-col justify-center p-6 md:p-12">
              <p className="eyebrow text-blush-300">Featured · {featured.category}</p>
              <h2 className="display-title mt-5 break-words text-[clamp(2.3rem,11vw,3rem)] md:text-5xl">{featured.title}</h2>
              <p className="mt-5 text-sm leading-7 text-white/55">{featured.excerpt}</p>
              <span className="mt-8 inline-flex min-h-11 items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-blush-300 md:min-h-0">Read the story <ArrowRight className="h-4 w-4" /></span>
            </div>
          </Link>

          <div className="mt-12 flex flex-col justify-between gap-5 border-b border-ink/10 pb-5 md:mt-14 md:flex-row md:items-end">
            <div><p className="eyebrow text-rose-500">Latest notes</p><h2 className="display-title mt-3 text-[clamp(2.4rem,11vw,3rem)] md:text-5xl">From the journal</h2></div>
            <div className="no-scrollbar flex w-full gap-2 overflow-x-auto pb-1 md:w-auto md:pb-0">
              {["All", "Nail health", "Trends", "Bridal", "At home"].map((item, index) => <button key={item} aria-pressed={index === 0} className={`min-h-11 shrink-0 rounded-full border px-4 py-2 text-[11px] font-bold uppercase tracking-wider md:min-h-0 md:text-[9px] ${index === 0 ? "border-ink bg-ink text-white" : "border-ink/15"}`}>{item}</button>)}
            </div>
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {[...posts, ...posts].map((post, index) => <article key={`${post.slug}-${index}`} className="group"><Link href={`/blog/${post.slug}`} className="relative block aspect-[4/3] overflow-hidden rounded-2xl"><Image src={post.image} alt={post.title} fill className="object-cover transition-transform duration-700 group-hover:scale-[1.035]" sizes="(max-width: 767px) calc(100vw - 2rem), 33vw" /></Link><p className="eyebrow mt-5 text-rose-500">{post.category}</p><Link href={`/blog/${post.slug}`}><h3 className="mt-3 font-display text-2xl leading-7 group-hover:text-rose-500">{post.title}</h3></Link><p className="mt-3 text-xs leading-6 text-ink/50">{post.excerpt}</p><p className="mt-4 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-wider text-ink/45 md:text-[9px] md:text-ink/35"><Clock3 className="h-3 w-3" />{post.date} · {post.readTime}</p></article>)}
          </div>
        </div>
      </section>
    </>
  );
}
