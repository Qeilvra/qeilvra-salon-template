import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Bookmark, Clock3, Link2, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { posts } from "@/lib/site-data";

export function generateStaticParams() { return posts.map((post) => ({ slug: post.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const post = posts.find((item) => item.slug === slug); return post ? { title: post.title, description: post.excerpt, openGraph: { images: [post.image], type: "article" } } : { title: "Journal" }; }

const articleSections = [
  { heading: "The return to refinement", body: "The most modern manicures aren’t asking for attention. They reveal themselves slowly: a beautifully balanced shape, a veil of translucent color, a line so fine it catches only in certain light. This is quiet luxury at fingertip scale—not defined by a single shade, but by restraint and immaculate execution." },
  { heading: "Shape is the first detail", body: "A softened almond and short oval continue to feel effortless because they echo the natural line of the hand. Your ideal shape is less about a trend and more about proportion. At the atelier, we consider nail-bed length, finger shape and the way you use your hands before reaching for a file." },
  { heading: "Sheer color, considered", body: "Milky blush, soft tea and barely-there taupe are endlessly adaptable. One layer feels clean and translucent; two create a porcelain effect. The secret is preparation: sheer shades reveal every detail, so smooth structure and careful cuticle work matter more than ever." },
  { heading: "The art of one small accent", body: "If you want a little more, choose one deliberate gesture—a micro French line, a thread of champagne foil or a tiny tonal dot. Keeping the palette close and the detail precise lets the nail art feel personal without losing its sense of ease." },
];

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug);
  if (!post) notFound();
  const related = posts.filter((item) => item.slug !== slug);

  return (
    <>
      <article>
        <header className="bg-cream py-14 md:py-24">
          <div className="container-shell max-w-4xl text-center">
            <Link href="/blog" className="inline-flex min-h-11 items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-ink/50 md:min-h-0 md:text-[9px] md:text-ink/45"><ArrowLeft className="h-4 w-4" />The Élan Edit</Link>
            <p className="eyebrow mt-8 text-rose-500 md:mt-10">{post.category}</p>
            <h1 className="display-title mt-5 break-words text-[clamp(2.55rem,12vw,3.5rem)] leading-[.95] md:text-7xl">{post.title}</h1>
            <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-ink/55">{post.excerpt}</p>
            <p className="mt-6 flex flex-wrap items-center justify-center gap-2 text-[10px] uppercase leading-5 tracking-wider text-ink/45 md:flex-nowrap md:text-[9px] md:leading-normal md:text-ink/35"><Clock3 className="h-3.5 w-3.5" />{post.date} · {post.readTime} · By Maison Élan artists</p>
          </div>
        </header>

        <div className="container-shell relative aspect-[4/3] max-h-[680px] overflow-hidden rounded-[1.5rem] md:aspect-[16/8] md:rounded-[2rem]"><Image src={post.image} alt={post.title} fill priority className="object-cover" sizes="100vw" /></div>

        <div className="container-shell grid gap-8 py-12 md:gap-10 md:py-16 lg:grid-cols-[160px_1fr_220px]">
          <aside className="hidden lg:block">
            <div className="sticky top-28"><p className="text-[9px] font-bold uppercase tracking-wider text-ink/40">Share & save</p><div className="mt-4 flex gap-2"><button className="grid h-10 w-10 place-items-center rounded-full border border-ink/15"><Link2 className="h-4 w-4" /></button><button className="grid h-10 w-10 place-items-center rounded-full border border-ink/15"><Bookmark className="h-4 w-4" /></button></div></div>
          </aside>

          <div className="grid gap-3 md:hidden">
            <div className="flex items-center justify-between rounded-2xl border border-ink/10 bg-white p-3"><span className="text-[11px] font-bold uppercase tracking-wider text-ink/55">Share & save</span><span className="flex gap-2"><button aria-label="Copy article link" className="grid h-11 w-11 place-items-center rounded-full border border-ink/15"><Link2 className="h-4 w-4" /></button><button aria-label="Save article" className="grid h-11 w-11 place-items-center rounded-full border border-ink/15"><Bookmark className="h-4 w-4" /></button></span></div>
            <div className="rounded-2xl bg-ink p-5 text-white"><p className="eyebrow text-blush-300">Try the look</p><div className="mt-3 flex items-end justify-between gap-4"><div><h2 className="font-display text-2xl">Atelier Gel + minimal art</h2><p className="mt-2 text-[11px] text-white/55">65–80 minutes · from $90</p></div></div><ButtonLink href="/book/service?service=atelier-gel" variant="primary" size="sm" className="mt-5 min-h-11 w-full">Book the ritual</ButtonLink></div>
          </div>

          <div className="min-w-0">
            <p className="font-display text-2xl leading-9 first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-7xl first-letter:leading-[.75] first-letter:text-rose-500">Beauty trends move quickly, but the looks with real staying power tend to feel almost timeless. This season, our artists are seeing a return to polished understatement—nails that whisper rather than announce.</p>
            {articleSections.map((section, index) => <section key={section.heading} className="mt-10"><h2 className="display-title break-words text-[clamp(2rem,9vw,2.25rem)] md:text-4xl">{section.heading}</h2><p className="mt-5 text-sm leading-8 text-ink/65">{section.body}</p>{index === 1 ? <div className="relative my-10 aspect-[4/3] overflow-hidden rounded-2xl"><Image src="/images/nail-art-editorial.png" alt="Fine blush and gold nail art" fill className="object-cover" sizes="(max-width: 767px) calc(100vw - 2rem), 60vw" /></div> : null}</section>)}
            <div className="mt-12 rounded-[2rem] bg-blush-200 p-5 md:p-7"><Sparkles className="h-6 w-6 text-rose-500" /><h3 className="mt-4 font-display text-3xl">The artist takeaway</h3><p className="mt-3 text-sm leading-7 text-ink/60">Bring your inspiration, but leave room for your artist to translate it to your hands. The most beautiful version of a trend is always the one tailored to you.</p></div>
          </div>

          <aside className="hidden lg:block"><div className="sticky top-28 rounded-2xl bg-ink p-6 text-white"><p className="eyebrow text-blush-300">Try the look</p><h3 className="mt-4 font-display text-2xl">Atelier Gel + minimal art</h3><p className="mt-3 text-[10px] leading-5 text-white/45">65–80 minutes · from $90</p><ButtonLink href="/book/service?service=atelier-gel" variant="primary" size="sm" className="mt-5 w-full">Book the ritual</ButtonLink></div></aside>
        </div>
      </article>

      <section className="bg-cream py-14 md:py-20">
        <div className="container-shell">
          <div className="flex flex-col items-start gap-5 md:flex-row md:items-end md:justify-between"><div><p className="eyebrow text-rose-500">Continue reading</p><h2 className="display-title mt-3 text-[clamp(2.4rem,11vw,3rem)] md:text-5xl">More from the edit</h2></div><ButtonLink href="/blog" variant="ghost" size="sm" className="max-[479px]:w-full">All notes <ArrowRight className="h-4 w-4" /></ButtonLink></div>
          <div className="mt-10 grid gap-7 md:grid-cols-2">{related.map((item) => <Link key={item.slug} href={`/blog/${item.slug}`} className="group grid gap-5 md:grid-cols-[180px_1fr]"><span className="relative aspect-[4/3] overflow-hidden rounded-xl"><Image src={item.image} alt="" fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 767px) calc(100vw - 2rem), 180px" /></span><span><small className="eyebrow text-rose-500">{item.category}</small><strong className="mt-3 block font-display text-2xl font-normal leading-7">{item.title}</strong><small className="mt-3 block text-ink/40">{item.readTime}</small></span></Link>)}</div>
        </div>
      </section>
    </>
  );
}
