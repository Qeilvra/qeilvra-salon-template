import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

export default function NotFound() {
  return <main className="relative grid min-h-screen place-items-center overflow-hidden bg-ink px-4 text-white"><Image src="/images/hero-luxury-manicure.png" alt="" fill priority className="object-cover opacity-25"/><div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/90 to-ink/60"/><div className="relative z-10 max-w-2xl text-center"><p className="font-display text-[9rem] italic leading-none text-blush-300/25 sm:text-[13rem]">404</p><p className="eyebrow -mt-6 text-blush-300">A little out of place</p><h1 className="display-title mt-5 text-5xl sm:text-6xl">This page has slipped away.</h1><p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-white/55">Let’s bring you back to the Maison, find a ritual or reserve your next beautiful hour.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><Link href="/" className="flex min-h-12 items-center gap-2 rounded-full bg-blush-300 px-6 text-[10px] font-bold uppercase tracking-wider text-ink">Return home <ArrowRight className="h-4 w-4"/></Link><Link href="/services" className="flex min-h-12 items-center gap-2 rounded-full border border-white/25 px-6 text-[10px] font-bold uppercase tracking-wider"><Search className="h-4 w-4"/>Explore services</Link></div></div></main>;
}

