import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText, Mail } from "lucide-react";
import { siteFacts } from "@/lib/site-data";

type Policy = { title: string; intro: string; sections: { heading: string; body: string }[] };

const policies: Record<string, Policy> = {
  privacy: {
    title: "Privacy Policy",
    intro: "This policy explains what information Maison Élan collects, why we collect it and the choices you have.",
    sections: [
      { heading: "Information we collect", body: "We collect information you provide when you create an account, book an appointment, make a purchase, join our mailing list or contact us. This can include your name, contact details, appointment preferences, transaction records and notes you choose to share with your artist." },
      { heading: "How we use information", body: "We use your information to provide and improve services, manage bookings and orders, send confirmations and reminders, administer rewards, respond to requests, prevent fraud and comply with legal obligations. Marketing communications are sent only where permitted, and you can opt out at any time." },
      { heading: "Payments and service providers", body: "Payment details are processed securely by our payment provider and are not stored in full by Maison Élan. We may share limited information with providers that support bookings, email, SMS, payments, analytics and site hosting, under appropriate contractual safeguards." },
      { heading: "Retention and security", body: "We keep personal information only as long as reasonably necessary for the purposes described or as required by law. We use administrative, technical and physical measures designed to protect information, though no online service can guarantee absolute security." },
      { heading: "Your choices", body: "Depending on where you live, you may request access, correction, deletion or a copy of personal information, and may object to or limit certain processing. You can update many details from your account or contact our privacy team." },
      { heading: "Cookies", body: "Our website uses essential cookies for security, account sessions, cart and booking functions. With consent, we may also use analytics and advertising cookies. Browser settings and our cookie controls let you manage non-essential cookies." },
    ],
  },
  terms: {
    title: "Terms & Conditions",
    intro: "These terms govern use of the Maison Élan website, online booking, memberships, gift cards and shop.",
    sections: [
      { heading: "Using our services", body: "You must provide accurate information, keep account credentials secure and use the website only for lawful personal purposes. We may refuse or cancel bookings or orders affected by error, misuse, fraud or safety concerns." },
      { heading: "Appointments", body: "Appointment times and prices are confirmed during booking. Final price can vary with length, product removal or requested complexity, and your artist will confirm changes before beginning. Deposits, cancellations and late arrivals are governed by our cancellation policy." },
      { heading: "Shop orders", body: "Product availability, prices and promotions may change. An order is accepted when we send confirmation. We may correct errors, limit quantities or cancel an unavailable item and issue a refund. Delivery estimates are not guaranteed." },
      { heading: "Memberships", body: "Memberships renew monthly until cancelled. Benefits are personal, non-transferable unless stated, and have no cash value. Changes or cancellation must be requested before the next renewal. Current plan-specific rules are displayed before enrollment." },
      { heading: "Gift cards and promotions", body: "Gift cards do not expire where prohibited by law and cannot be exchanged for cash except where required. Promotional codes have stated eligibility and cannot be combined unless explicitly allowed." },
      { heading: "Intellectual property", body: "Website copy, photography, branding, designs and other content belong to Maison Élan or its licensors and may not be copied, modified or used commercially without permission." },
      { heading: "Liability", body: "To the maximum extent permitted by law, Maison Élan is not responsible for indirect or consequential losses arising from use of the website. Nothing in these terms limits rights or liability that cannot lawfully be limited." },
    ],
  },
  cancellation: {
    title: "Cancellation Policy",
    intro: "Reserved time is prepared especially for you. A little notice helps us care for our artists and guests fairly.",
    sections: [
      { heading: "Changes with 24+ hours’ notice", body: "Appointments may be rescheduled or cancelled without charge at least 24 hours before the scheduled start. Your deposit can be returned to the original method or held as account credit." },
      { heading: "Late cancellations", body: "Changes made within 24 hours forfeit the booking deposit. Members may use one late-cancellation grace per membership year, subject to plan terms." },
      { heading: "Missed appointments", body: "A missed appointment is charged at 100% of the scheduled service value. A valid payment method or prepayment may be required before booking again." },
      { heading: "Late arrivals", body: "Please contact us if you are delayed. Arrivals more than 10 minutes late may require a shortened service or reschedule to protect the next guest’s time. The originally booked service price may still apply." },
      { heading: "Groups and private events", body: "Group bookings follow the cancellation schedule stated in the event proposal, typically 14 days for final guest count and seven days for service changes." },
      { heading: "How to change an appointment", body: "Use My Appointments online, call the Maison during opening hours or reply to your confirmation. A request is complete only when you receive cancellation or reschedule confirmation." },
    ],
  },
  refunds: {
    title: "Refund Policy",
    intro: "We want every service and purchase to feel worthy of the Maison. Here is how we make things right.",
    sections: [
      { heading: "Service guarantee", body: "If your polish chips or lifts within seven days despite following aftercare, contact us with a clear photo. Where eligible, we will arrange a complimentary repair. Service payments are generally non-refundable once completed, but concerns are reviewed individually by our studio director." },
      { heading: "Retail returns", body: "Unopened, unused products in original condition may be returned within 30 days with proof of purchase. For hygiene reasons, opened cosmetics, tools and personalized items cannot be returned unless faulty." },
      { heading: "Damaged or incorrect orders", body: "Contact us within seven days of delivery with your order number and photographs. We will replace, refund or otherwise resolve an item that arrived damaged, defective or incorrect." },
      { heading: "Gift cards", body: "Gift-card purchases are final and cannot be refunded or exchanged for cash except where required by law. Lost digital gift cards may be reissued to the verified purchaser where the balance remains unused." },
      { heading: "Processing times", body: "Approved refunds are sent to the original payment method, usually within five to ten business days after processing. Bank timing can vary." },
      { heading: "Contact us", body: "Email our guest team with your order or appointment number and a short description. We aim to acknowledge concerns within one business day." },
    ],
  },
};

export function generateStaticParams() { return Object.keys(policies).map((type) => ({ type })); }
export async function generateMetadata({ params }: { params: Promise<{ type: string }> }): Promise<Metadata> { const { type } = await params; return { title: policies[type]?.title ?? "Policy", robots: { index: true, follow: true } }; }

export default async function PolicyPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params; const policy = policies[type]; if (!policy) notFound();
  return <><section className="bg-ink py-20 text-white sm:py-28"><div className="container-shell max-w-4xl"><Link href="/" className="inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider text-white/45"><ArrowLeft className="h-4 w-4"/>Maison Élan</Link><p className="eyebrow mt-10 text-blush-300">Guest care & legal</p><h1 className="display-title mt-5 text-6xl sm:text-7xl">{policy.title}</h1><p className="mt-6 max-w-2xl text-sm leading-7 text-white/55">{policy.intro}</p><p className="mt-6 text-[9px] uppercase tracking-wider text-white/35">Last updated August 23, 2026</p></div></section><section className="py-20"><div className="container-shell grid gap-12 lg:grid-cols-[240px_1fr]"><aside className="h-fit rounded-2xl bg-cream p-6 lg:sticky lg:top-28"><FileText className="h-6 w-6 text-rose-500"/><p className="mt-4 text-[10px] font-bold uppercase tracking-wider">In this policy</p><nav className="mt-4 grid gap-2">{policy.sections.map((section,index)=><a key={section.heading} href={`#section-${index}`} className="text-xs leading-5 text-ink/50 hover:text-ink">{section.heading}</a>)}</nav></aside><div className="max-w-3xl divide-y divide-ink/10 border-y border-ink/10">{policy.sections.map((section,index)=><section id={`section-${index}`} key={section.heading} className="scroll-mt-32 py-8"><h2 className="display-title text-3xl">{index+1}. {section.heading}</h2><p className="mt-4 text-sm leading-8 text-ink/62">{section.body}</p></section>)}<section className="py-8"><h2 className="display-title text-3xl">Questions about this policy?</h2><p className="mt-4 text-sm leading-7 text-ink/62">Contact Maison Élan at <a className="underline" href={`mailto:${siteFacts.email}`}>{siteFacts.email}</a> or write to {siteFacts.address}.</p></section></div></div></section></>;
}

