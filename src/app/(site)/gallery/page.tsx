import type { Metadata } from "next";
import { Heart, Images, Instagram } from "lucide-react";
import { LookbookGrid } from "@/components/gallery/lookbook-grid";
import { PageHero } from "@/components/layout/page-hero";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = { title: "Lookbook", description: "Explore and save Maison Élan nail inspiration, from minimal manicures to custom nail art." };

export default function GalleryPage() {
  return (
    <>
      <PageHero eyebrow="The lookbook" title="Find your next detail" description="A living edit of the color, shape and artistry leaving our atelier. Save what you love and bring it to your next visit." image="/images/nail-art-editorial.png" />
      <section className="py-16 sm:py-24"><div className="container-shell"><div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><p className="flex items-center gap-2 text-xs text-ink/50"><Images className="h-4 w-4 text-rose-500" /> 48 atelier looks, updated weekly</p><ButtonLink href="/account/wishlist" variant="ghost" size="sm"><Heart className="h-4 w-4" /> My saved looks</ButtonLink></div><LookbookGrid /></div></section>
      <section className="bg-blush-200 py-14"><div className="container-shell flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left"><div><p className="eyebrow text-rose-500">Make it yours</p><h2 className="mt-3 font-display text-4xl">Have an idea we haven’t made yet?</h2><p className="mt-2 text-sm text-ink/60">Send your inspiration before your appointment and your artist will prepare a plan.</p></div><ButtonLink href="/contact" variant="secondary"><Instagram className="h-4 w-4" /> Share inspiration</ButtonLink></div></section>
    </>
  );
}

