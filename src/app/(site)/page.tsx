import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  Check,
  ChevronRight,
  Gift,
  HeartHandshake,
  Instagram,
  Leaf,
  Play,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { ArtistCard } from "@/components/cards/artist-card";
import { ServiceCard } from "@/components/cards/service-card";
import { QuickBook } from "@/components/booking/quick-book";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { artists, posts, reviews, services } from "@/lib/site-data";

const gallery = [
  "/images/nail-art-editorial.png",
  "/images/hero-luxury-manicure.png",
  "/images/salon-interior.png",
  "/images/spa-flatlay.png",
  "/images/nail-art-editorial.png",
];

export default function HomePage() {
  return (
    <>
      <section className="relative flex min-h-0 items-center overflow-hidden bg-black pt-[74px] text-white md:min-h-[820px] md:pt-24 lg:min-h-[calc(100vh-36px)] lg:pt-20">
        <Image
          src="/images/hero-luxury-manicure.png"
          alt="Elegant blush manicure by Maison Élan"
          fill
          priority
          quality={92}
          sizes="100vw"
          className="object-cover object-[62%_center] sm:object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/10 sm:via-black/65" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
        <div className="container-shell relative z-10 pb-10 pt-12 md:pb-12 md:pt-24 lg:pb-16">
          <div className="max-w-2xl animate-reveal">
            <p className="eyebrow flex items-center gap-3 text-blush-300"><span className="h-px w-8 bg-blush-300" /> Dallas · Nail atelier & spa</p>
            <h1 className="display-title mt-6 break-words text-[clamp(2.7rem,13vw,3.6rem)] leading-[0.92] md:text-7xl md:leading-[0.9] lg:text-[6.5rem]">
              Beautiful nails,
              <span className="mt-2 block font-display text-[0.8em] italic text-blush-300">beautifully you.</span>
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-7 text-white/75 md:mt-7 md:text-base md:text-white/68">
              Impeccable nail craft and restorative rituals, delivered in a calm space designed around you.
            </p>
            <div className="mt-6 grid gap-3 min-[480px]:flex min-[480px]:flex-wrap md:mt-8">
              <ButtonLink href="/book" size="lg" className="w-full min-[480px]:w-auto">Book appointment <ArrowRight className="h-4 w-4" /></ButtonLink>
              <ButtonLink href="/services" size="lg" variant="light" className="w-full border-white/25 bg-white/5 text-white backdrop-blur hover:text-ink min-[480px]:w-auto">Explore services <Play className="h-3.5 w-3.5 fill-current" /></ButtonLink>
            </div>
          </div>
          <div className="mt-8 hidden max-w-3xl animate-reveal-delay md:mt-12 md:block lg:mt-16">
            <QuickBook />
          </div>
          <div className="mt-8 grid max-w-3xl grid-cols-2 gap-x-4 gap-y-5 border-t border-white/15 pt-5 md:mt-10 md:grid-cols-4 md:gap-0 md:divide-x md:divide-white/15 md:pt-7">
            {[
              [ShieldCheck, "Safe & serene", "Hospital-grade care"],
              [Award, "Expert artists", "Master-level detail"],
              [Sparkles, "Premium products", "Artist-approved formulas"],
              [Leaf, "Conscious rituals", "Vegan, considered care"],
            ].map(([Icon, title, text]) => {
              const IconComponent = Icon as typeof ShieldCheck;
              return (
                <div key={title as string} className="flex items-center gap-3 md:px-5 md:first:pl-0">
                  <IconComponent className="h-5 w-5 shrink-0 text-blush-300" />
                  <div><p className="text-[10px] font-semibold md:text-xs">{title as string}</p><p className="mt-1 text-[9px] leading-4 text-white/45">{text as string}</p></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-cream py-14 md:py-28">
        <div className="container-shell">
          <SectionHeading eyebrow="What we offer" title="Our signature rituals" description="Considered nail care, precise technique and a little time that belongs entirely to you." />
          <div className="mt-10 grid gap-5 md:mt-12 md:grid-cols-2 lg:grid-cols-4">
            {services.filter((item) => item.featured).map((service, index) => <ServiceCard key={service.slug} service={service} index={index} />)}
          </div>
          <div className="mt-10 text-center"><ButtonLink href="/services" variant="ghost">View all services <ArrowRight className="h-4 w-4" /></ButtonLink></div>
        </div>
      </section>

      <section className="overflow-hidden bg-ink text-white">
        <div className="grid lg:grid-cols-[.88fr_1.12fr]">
          <div className="flex items-center px-6 py-14 md:px-12 md:py-20 lg:px-[max(3rem,calc((100vw-1240px)/2))] lg:py-28 lg:pr-16">
            <div className="max-w-xl">
              <p className="eyebrow text-blush-300">Our philosophy</p>
              <h2 className="display-title mt-5 text-[clamp(2.5rem,11vw,3rem)] md:text-6xl">Care is the most beautiful detail.</h2>
              <p className="mt-6 text-sm leading-7 text-white/60">
                Maison Élan was created as an antidote to the rushed salon appointment. We pair obsessive craft with quiet hospitality—so every visit leaves you feeling restored, not simply polished.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {["Unhurried appointments", "Advanced nail-health training", "Hospital-grade hygiene", "Curated, conscious formulas"].map((item) => (
                  <span key={item} className="flex items-center gap-3 text-xs text-white/75"><span className="grid h-6 w-6 place-items-center rounded-full bg-blush-300/15"><Check className="h-3.5 w-3.5 text-blush-300" /></span>{item}</span>
                ))}
              </div>
              <div className="mt-9"><ButtonLink href="/about" variant="light">Our story <ArrowRight className="h-4 w-4" /></ButtonLink></div>
            </div>
          </div>
          <div className="relative min-h-[380px] md:min-h-[500px] lg:min-h-[650px]">
            <Image src="/images/salon-interior.png" alt="Maison Élan salon interior" fill sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" />
            <div className="absolute bottom-6 left-6 right-6 rounded-[1.5rem] border border-white/30 bg-white/85 p-6 text-ink shadow-soft backdrop-blur-md sm:bottom-10 sm:left-10 sm:right-auto sm:max-w-sm">
              <p className="font-display text-3xl">A softer kind of luxury</p>
              <p className="mt-2 text-xs leading-5 text-ink/60">Warm, spotless and intentionally calm—from the welcome tea to the final drop of cuticle oil.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#fffdf9] py-14 md:py-28">
        <div className="container-shell grid gap-12 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div className="relative grid grid-cols-2 gap-3">
            <div className="editorial-image relative aspect-[3/4] overflow-hidden rounded-[10rem_10rem_1.5rem_1.5rem] bg-blush-100"><Image src="/images/nail-art-editorial.png" alt="Blush nail art" fill className="object-cover" sizes="(max-width: 767px) 46vw, 40vw" /></div>
            <div className="editorial-image relative mt-12 aspect-[3/4] overflow-hidden rounded-[1.5rem_1.5rem_10rem_10rem] bg-blush-100 md:mt-16"><Image src="/images/spa-flatlay.png" alt="Nail spa products" fill className="object-cover" sizes="(max-width: 767px) 46vw, 40vw" /></div>
            <div className="absolute left-1/2 top-1/2 grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[5px] border-[#fffdf9] bg-blush-300 text-center shadow-soft md:h-28 md:w-28 md:border-[7px]"><span className="font-display text-lg italic leading-5 md:text-xl">Made for<br />your moment</span></div>
          </div>
          <div className="lg:pl-12">
            <p className="eyebrow text-rose-500">Why Maison Élan</p>
            <h2 className="display-title mt-5 text-[clamp(2.5rem,11vw,3rem)] md:text-6xl">Elevated in every sense.</h2>
            <p className="mt-6 text-sm leading-7 text-ink/60">Exceptional results are only the beginning. Our rituals are built around the way you want to feel: seen, safe and entirely at ease.</p>
            <div className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
              {[
                [Sparkles, "Personal artistry", "A tailored plan for your nail health, shape and personal style."],
                [ShieldCheck, "Immaculate standards", "Medical-grade sterilization and fresh tools prepared for every guest."],
                [HeartHandshake, "Genuinely warm service", "No rush, no judgment—just artists who listen and care."],
              ].map(([Icon, title, text]) => {
                const IconComponent = Icon as typeof Sparkles;
                return <div key={title as string} className="flex gap-5 py-6"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-blush-100"><IconComponent className="h-5 w-5 text-rose-500" /></span><div><h3 className="font-display text-xl">{title as string}</h3><p className="mt-1 text-xs leading-5 text-ink/55">{text as string}</p></div></div>;
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-blush-200 py-10">
        <div className="container-shell flex flex-col items-center justify-between gap-7 text-center sm:flex-row sm:text-left">
          <div><p className="eyebrow text-rose-500">A beautiful beginning</p><h2 className="mt-2 font-display text-3xl sm:text-4xl">20% off your first ritual</h2><p className="mt-2 text-xs text-ink/60">Welcome to the Maison. Use code <strong>HELLO20</strong> when booking online.</p></div>
          <ButtonLink href="/book" variant="secondary" className="shrink-0">Claim your welcome <ArrowRight className="h-4 w-4" /></ButtonLink>
        </div>
      </section>

      <section className="py-14 md:py-28">
        <div className="container-shell">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <SectionHeading eyebrow="The artists" title="Meet your nail confidantes" description="Known for their craft. Loved for the way they make you feel." align="left" />
            <ButtonLink href="/team" variant="ghost" size="sm">Meet the team <ArrowRight className="h-4 w-4" /></ButtonLink>
          </div>
          <div className="no-scrollbar -mx-4 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 md:mt-12 lg:grid-cols-4">{artists.map((artist) => <div key={artist.slug} className="w-[78vw] max-w-[300px] shrink-0 snap-start sm:w-auto sm:max-w-none"><ArtistCard artist={artist} /></div>)}</div>
        </div>
      </section>

      <section className="overflow-hidden bg-cream py-14 md:py-28">
        <div className="container-shell">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <SectionHeading eyebrow="Lookbook" title="Details worth saving" description="Fresh from the atelier: our latest sets, quiet colors and beautifully tiny details." align="left" />
            <ButtonLink href="/gallery" variant="ghost" size="sm">View lookbook <ArrowRight className="h-4 w-4" /></ButtonLink>
          </div>
          <div className="mt-8 grid h-auto auto-rows-[clamp(132px,42vw,180px)] grid-flow-row-dense grid-cols-2 grid-rows-none gap-3 md:mt-10 md:h-[500px] md:auto-rows-auto md:grid-flow-row md:grid-cols-4 md:grid-rows-2">
            {gallery.map((image, index) => (
              <Link key={`${image}-${index}`} href="/gallery" className={`editorial-image relative overflow-hidden rounded-2xl bg-blush-100 ${index === 0 ? "row-span-2" : ""} ${index === 2 ? "md:col-span-2" : ""}`}>
                <Image src={image} alt={`Maison Élan look ${index + 1}`} fill sizes="(max-width: 768px) 50vw, 30vw" className="object-cover" style={{ objectPosition: index === 1 ? "72% center" : "center" }} />
                <span className="absolute bottom-3 right-3 grid h-11 w-11 place-items-center rounded-full bg-white/90 opacity-100 shadow-sm transition-opacity md:h-9 md:w-9 md:opacity-0 md:hover:opacity-100"><HeartHandshake className="h-4 w-4" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-ink py-14 text-white md:py-28">
        <div className="absolute inset-0 opacity-15"><Image src="/images/nail-art-editorial.png" alt="" fill className="object-cover blur-sm" /></div>
        <div className="absolute inset-0 bg-ink/85" />
        <div className="container-shell relative z-10">
          <SectionHeading eyebrow="Client notes" title="Kind words, beautifully kept" light />
          <div className="no-scrollbar -mx-4 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0">
            {reviews.map((review) => (
              <blockquote key={review.name} className="w-[82vw] max-w-[340px] shrink-0 snap-start rounded-[1.5rem] border border-white/12 bg-white/[0.055] p-6 backdrop-blur lg:w-auto lg:max-w-none lg:p-7">
                <div className="flex gap-1">{Array.from({ length: review.rating }).map((_, index) => <Star key={index} className="h-3.5 w-3.5 fill-blush-300 text-blush-300" />)}</div>
                <p className="mt-6 font-display text-2xl italic leading-9 text-white/90">“{review.text}”</p>
                <footer className="mt-7 border-t border-white/10 pt-5"><span className="text-xs font-semibold">{review.name}</span><span className="ml-2 text-[10px] uppercase tracking-wider text-white/35">{review.service}</span></footer>
              </blockquote>
            ))}
          </div>
          <div className="mt-9 text-center"><ButtonLink href="/reviews" variant="light">Read every love note <ArrowRight className="h-4 w-4" /></ButtonLink></div>
        </div>
      </section>

      <section className="py-14 md:py-28">
        <div className="container-shell grid gap-5 lg:grid-cols-2">
          <div className="relative min-h-[360px] overflow-hidden rounded-[2rem] bg-blush-200 p-7 md:min-h-[460px] md:p-12">
            <div className="relative z-10 max-w-sm"><p className="eyebrow text-rose-500">Élan Society</p><h2 className="display-title mt-5 text-[clamp(2.35rem,10.5vw,3rem)] md:text-5xl">Your ritual, with a little more.</h2><p className="mt-5 text-sm leading-7 text-ink/60">Monthly care, priority booking, member pricing and thoughtful surprises—designed around consistency.</p><div className="mt-8"><ButtonLink href="/membership" variant="secondary" className="max-[479px]:w-full">Explore membership <ArrowRight className="h-4 w-4" /></ButtonLink></div></div>
            <div className="pointer-events-none absolute -bottom-16 -right-12 h-72 w-72 rounded-full border-[45px] border-white/30" /><HeartHandshake className="pointer-events-none absolute bottom-10 right-10 h-24 w-24 stroke-[.65] text-rose-500/50" />
          </div>
          <div className="relative min-h-[360px] overflow-hidden rounded-[2rem] bg-ink p-7 text-white md:min-h-[460px] md:p-12">
            <Image src="/images/spa-flatlay.png" alt="Maison Élan gift" fill className="object-cover opacity-30" /><div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-transparent" />
            <div className="relative z-10 max-w-sm"><p className="eyebrow text-blush-300">Gift cards</p><h2 className="display-title mt-5 text-[clamp(2.35rem,10.5vw,3rem)] md:text-5xl">Give them time to feel beautiful.</h2><p className="mt-5 text-sm leading-7 text-white/60">Instant digital delivery, a personal note and the freedom to choose their perfect ritual.</p><div className="mt-8"><ButtonLink href="/gift-cards" variant="light" className="max-[479px]:w-full">Send a gift <Gift className="h-4 w-4" /></ButtonLink></div></div>
          </div>
        </div>
      </section>

      <section className="border-y border-ink/10 bg-cream py-14 md:py-20">
        <div className="container-shell">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="eyebrow text-rose-500">The Élan Edit</p><h2 className="display-title mt-4 text-[clamp(2.4rem,11vw,3rem)] md:text-5xl">Notes from the atelier</h2></div><ButtonLink href="/blog" variant="ghost" size="sm" className="max-[479px]:w-full">Visit the journal <ArrowRight className="h-4 w-4" /></ButtonLink></div>
          <div className="mt-10 grid gap-7 md:grid-cols-3">
            {posts.map((post) => <article key={post.slug} className="group"><Link href={`/blog/${post.slug}`} className="editorial-image relative block aspect-[16/10] overflow-hidden rounded-2xl"><Image src={post.image} alt={post.title} fill className="object-cover" sizes="(max-width: 767px) calc(100vw - 2rem), 33vw" /></Link><p className="eyebrow mt-5 text-rose-500">{post.category} · {post.readTime}</p><Link href={`/blog/${post.slug}`}><h3 className="mt-3 font-display text-2xl leading-7 group-hover:text-rose-500">{post.title}</h3></Link><p className="mt-3 text-xs leading-6 text-ink/55">{post.excerpt}</p></article>)}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-28">
        <div className="container-shell text-center">
          <p className="eyebrow text-rose-500"><Instagram className="mr-2 inline h-4 w-4" /> @maisonelan.atelier</p>
          <h2 className="display-title mt-4 text-[clamp(2.4rem,11vw,3rem)] md:text-5xl">A little daily inspiration</h2>
          <div className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {[...gallery, "/images/salon-interior.png"].map((image, index) => <a key={`${image}-social-${index}`} href="https://instagram.com" className="editorial-image relative aspect-square overflow-hidden rounded-xl"><Image src={image} alt="Maison Élan Instagram post" fill sizes="(max-width: 767px) 50vw, 16vw" className="object-cover" /></a>)}
          </div>
        </div>
      </section>

      <section className="bg-blush-300 py-16">
        <div className="container-shell flex flex-col items-center justify-between gap-8 text-center lg:flex-row lg:text-left">
          <div><p className="eyebrow text-rose-500">Your chair is waiting</p><h2 className="display-title mt-3 text-4xl sm:text-5xl">Ready for your next beautiful ritual?</h2><p className="mt-3 text-sm text-ink/60">Reserve in under two minutes. Same-week appointments are often available.</p></div>
          <ButtonLink href="/book" variant="secondary" size="lg" className="shrink-0">Find your appointment <ChevronRight className="h-4 w-4" /></ButtonLink>
        </div>
      </section>
    </>
  );
}
