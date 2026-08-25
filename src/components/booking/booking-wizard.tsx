"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { addDays, format } from "date-fns";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  Check,
  Clock3,
  CreditCard,
  Gift,
  MapPin,
  Minus,
  Plus,
  ShieldCheck,
  Sparkles,
  Star,
  UserRound,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { addOns, artists, services, siteFacts } from "@/lib/site-data";
import { cn, formatCurrency } from "@/lib/utils";

const steps = [
  { key: "service", label: "Service" },
  { key: "add-ons", label: "Add-ons" },
  { key: "technician", label: "Artist" },
  { key: "date-time", label: "Time" },
  { key: "details", label: "Details" },
] as const;

type Step = (typeof steps)[number]["key"] | "confirmation";
type BookingState = {
  serviceSlug: string;
  addOnIds: string[];
  artistSlug: string;
  date: string;
  time: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes: string;
  sms: boolean;
  deposit: boolean;
  bookingId: string;
};

const initialState: BookingState = {
  serviceSlug: "",
  addOnIds: [],
  artistSlug: "first-available",
  date: "",
  time: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  notes: "",
  sms: true,
  deposit: true,
  bookingId: "",
};

export function BookingWizard({
  step,
  initialService,
  initialArtist,
}: {
  step: Step;
  initialService?: string;
  initialArtist?: string;
}) {
  const router = useRouter();
  const [booking, setBooking] = useState<BookingState>({
    ...initialState,
    serviceSlug: initialService && services.some((item) => item.slug === initialService) ? initialService : "",
    artistSlug: initialArtist && artists.some((item) => item.slug === initialArtist) ? initialArtist : "first-available",
  });
  const [hydrated, setHydrated] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    try {
      const saved = window.sessionStorage.getItem("maison-elan-booking");
      if (saved) {
        const parsed = JSON.parse(saved) as BookingState;
        setBooking((current) => ({
          ...parsed,
          serviceSlug: initialService || parsed.serviceSlug || current.serviceSlug,
          artistSlug: initialArtist || parsed.artistSlug || current.artistSlug,
        }));
      }
    } finally {
      setHydrated(true);
    }
  }, [initialArtist, initialService]);

  useEffect(() => {
    if (hydrated) window.sessionStorage.setItem("maison-elan-booking", JSON.stringify(booking));
  }, [booking, hydrated]);

  const selectedService = services.find((item) => item.slug === booking.serviceSlug);
  const selectedArtist = artists.find((item) => item.slug === booking.artistSlug);
  const selectedAddOns = addOns.filter((item) => booking.addOnIds.includes(item.id));
  const total = (selectedService?.price ?? 0) + selectedAddOns.reduce((sum, item) => sum + item.price, 0);
  const duration = (selectedService?.duration ?? 0) + selectedAddOns.reduce((sum, item) => sum + item.duration, 0);
  const deposit = Math.round(total * 0.25);
  const stepIndex = steps.findIndex((item) => item.key === step);

  function update(patch: Partial<BookingState>) {
    setBooking((current) => ({ ...current, ...patch }));
  }

  function go(next: Step) {
    router.push(`/book/${next}`);
  }

  if (step === "confirmation") {
    return <Confirmation booking={booking} service={selectedService} artist={selectedArtist} addOnNames={selectedAddOns.map((item) => item.name)} total={total} />;
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="border-b border-ink/10 bg-white">
        <div className="container-shell flex min-h-16 items-center justify-between gap-4 md:min-h-20">
          <Link href="/" className="font-display text-2xl italic text-gold">Maison Élan</Link>
          <p className="hidden items-center gap-2 text-[10px] uppercase tracking-wider text-ink/45 sm:flex"><ShieldCheck className="h-4 w-4 text-rose-500" /> Secure online booking</p>
          <Link href="/services" className="text-[10px] font-bold uppercase tracking-wider text-ink/50">Exit</Link>
        </div>
      </div>

      <div className="border-b border-ink/10 bg-white">
        <div className="container-shell no-scrollbar flex overflow-x-auto py-4">
          {steps.map((item, index) => {
            const complete = index < stepIndex;
            const current = index === stepIndex;
            return <div key={item.key} className="flex min-w-[132px] flex-1 items-center last:min-w-[90px]"><Link href={`/book/${item.key}`} className="flex items-center gap-2"><span className={cn("grid h-7 w-7 place-items-center rounded-full border text-[10px] font-semibold", complete ? "border-ink bg-ink text-white" : current ? "border-rose-500 bg-blush-200 text-ink" : "border-ink/15 text-ink/35")}>{complete ? <Check className="h-3.5 w-3.5" /> : index + 1}</span><span className={cn("text-[9px] font-bold uppercase tracking-wider", current ? "text-ink" : "text-ink/35")}>{item.label}</span></Link>{index < steps.length - 1 ? <span className={cn("mx-3 h-px flex-1", complete ? "bg-ink" : "bg-ink/10")} /> : null}</div>;
          })}
        </div>
      </div>

      <div className="container-shell grid gap-10 py-10 lg:grid-cols-[1fr_340px] lg:py-14">
        <div className="min-w-0">
          {step === "service" ? <ServiceStep selected={booking.serviceSlug} onSelect={(serviceSlug) => update({ serviceSlug })} onNext={() => selectedService ? go("add-ons") : toast.error("Choose a service to continue")} /> : null}
          {step === "add-ons" ? <AddOnStep selected={booking.addOnIds} onToggle={(id) => update({ addOnIds: booking.addOnIds.includes(id) ? booking.addOnIds.filter((item) => item !== id) : [...booking.addOnIds, id] })} onBack={() => go("service")} onNext={() => go("technician")} /> : null}
          {step === "technician" ? <ArtistStep selected={booking.artistSlug} onSelect={(artistSlug) => update({ artistSlug })} onBack={() => go("add-ons")} onNext={() => go("date-time")} /> : null}
          {step === "date-time" ? <DateTimeStep date={booking.date} time={booking.time} onDate={(date) => update({ date, time: "" })} onTime={(time) => update({ time })} onBack={() => go("technician")} onNext={() => booking.date && booking.time ? go("details") : toast.error("Choose a date and time to continue")} /> : null}
          {step === "details" ? <DetailsStep booking={booking} update={update} processing={processing} onBack={() => go("date-time")} onSubmit={(event) => { event.preventDefault(); setProcessing(true); window.setTimeout(() => { const bookingId = `ME-${Math.floor(100000 + Math.random() * 900000)}`; update({ bookingId }); setProcessing(false); router.push("/book/confirmation"); }, 1000); }} deposit={deposit} /> : null}
        </div>
        <BookingSummary service={selectedService} artist={selectedArtist} addOns={selectedAddOns} date={booking.date} time={booking.time} total={total} duration={duration} deposit={deposit} />
      </div>
    </div>
  );
}

function StepHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div className="mb-8"><p className="eyebrow text-rose-500">{eyebrow}</p><h1 className="display-title mt-4 text-5xl sm:text-6xl">{title}</h1><p className="mt-4 max-w-xl text-sm leading-6 text-ink/55">{description}</p></div>;
}

function StepActions({ onBack, onNext, nextLabel = "Continue" }: { onBack?: () => void; onNext: () => void; nextLabel?: string }) {
  return <div className="mt-8 flex items-center justify-between gap-4 border-t border-ink/10 pt-6">{onBack ? <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-ink/50"><ArrowLeft className="h-4 w-4" /> Back</button> : <span />}<button onClick={onNext} className="flex min-h-12 items-center gap-2 rounded-full bg-ink px-6 text-[10px] font-bold uppercase tracking-wider text-white">{nextLabel}<ArrowRight className="h-4 w-4" /></button></div>;
}

function ServiceStep({ selected, onSelect, onNext }: { selected: string; onSelect: (slug: string) => void; onNext: () => void }) {
  const [category, setCategory] = useState("All");
  const categories = ["All", ...Array.from(new Set(services.map((item) => item.category)))];
  return <><StepHeading eyebrow="Step one" title="Choose your ritual" description="Start with the service you’d like. You can add art, repairs and finishing details next." /><div className="no-scrollbar flex gap-2 overflow-x-auto pb-4">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={cn("shrink-0 rounded-full border px-4 py-2 text-[9px] font-bold uppercase tracking-wider", category === item ? "border-ink bg-ink text-white" : "border-ink/15 bg-white")}>{item}</button>)}</div><div className="grid gap-3 sm:grid-cols-2">{services.filter((item) => category === "All" || item.category === category).map((service) => <button key={service.slug} onClick={() => onSelect(service.slug)} className={cn("flex gap-4 rounded-2xl border bg-white p-4 text-left transition", selected === service.slug ? "border-rose-500 ring-2 ring-blush-200" : "border-ink/10 hover:border-ink/25")}><span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl"><Image src={service.image} alt="" fill className="object-cover" sizes="80px" /></span><span className="min-w-0 flex-1"><span className="flex items-start justify-between gap-2"><strong className="font-display text-xl font-normal">{service.name}</strong>{selected === service.slug ? <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-rose-500 text-white"><Check className="h-3 w-3" /></span> : null}</span><span className="mt-1 block text-[10px] text-ink/45">{service.duration} min · from {formatCurrency(service.price)}</span><span className="mt-2 line-clamp-2 block text-[10px] leading-4 text-ink/50">{service.description}</span></span></button>)}</div><StepActions onNext={onNext} /></>;
}

function AddOnStep({ selected, onToggle, onBack, onNext }: { selected: string[]; onToggle: (id: string) => void; onBack: () => void; onNext: () => void }) {
  return <><StepHeading eyebrow="Step two" title="Make it entirely yours" description="Choose any finishing details or extra care. It’s perfectly fine to skip this step." /><div className="grid gap-3 sm:grid-cols-2">{addOns.map((item) => <button key={item.id} onClick={() => onToggle(item.id)} className={cn("flex min-h-32 flex-col items-start justify-between rounded-2xl border bg-white p-5 text-left", selected.includes(item.id) ? "border-rose-500 ring-2 ring-blush-200" : "border-ink/10 hover:border-ink/25")}><span className="flex w-full items-start justify-between"><span className="grid h-9 w-9 place-items-center rounded-full bg-blush-100"><Sparkles className="h-4 w-4 text-rose-500" /></span><span className={cn("grid h-7 w-7 place-items-center rounded-full border", selected.includes(item.id) ? "border-rose-500 bg-rose-500 text-white" : "border-ink/15")} >{selected.includes(item.id) ? <Minus className="h-3 w-3" /> : <Plus className="h-3 w-3" />}</span></span><span className="mt-5"><strong className="block font-display text-xl font-normal">{item.name}</strong><small className="mt-1 block text-ink/45">{item.description}</small><span className="mt-3 block text-xs font-semibold">+{formatCurrency(item.price)} · {item.duration} min</span></span></button>)}</div><StepActions onBack={onBack} onNext={onNext} nextLabel={selected.length ? "Add & continue" : "Skip add-ons"} /></>;
}

function ArtistStep({ selected, onSelect, onBack, onNext }: { selected: string; onSelect: (slug: string) => void; onBack: () => void; onNext: () => void }) {
  return <><StepHeading eyebrow="Step three" title="Choose your artist" description="Select someone you know, browse by specialty, or choose first available for the widest choice of times." /><div className="grid gap-3 sm:grid-cols-2"><button onClick={() => onSelect("first-available")} className={cn("flex min-h-28 items-center gap-4 rounded-2xl border bg-white p-5 text-left sm:col-span-2", selected === "first-available" ? "border-rose-500 ring-2 ring-blush-200" : "border-ink/10")}><span className="grid h-14 w-14 place-items-center rounded-full bg-blush-200"><Sparkles className="h-5 w-5 text-rose-500" /></span><span className="flex-1"><strong className="font-display text-2xl font-normal">First available</strong><small className="mt-1 block text-ink/45">Best for the most appointment options. We’ll match you beautifully.</small></span>{selected === "first-available" ? <BadgeCheck className="h-6 w-6 text-rose-500" /> : null}</button>{artists.map((artist) => <button key={artist.slug} onClick={() => onSelect(artist.slug)} className={cn("flex gap-4 rounded-2xl border bg-white p-4 text-left", selected === artist.slug ? "border-rose-500 ring-2 ring-blush-200" : "border-ink/10")}><span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full"><Image src={artist.image} alt={artist.name} fill className="object-cover" sizes="80px" /></span><span><strong className="font-display text-xl font-normal">{artist.name}</strong><small className="mt-1 block text-ink/45">{artist.role}</small><span className="mt-2 flex items-center gap-1 text-[10px]"><Star className="h-3 w-3 fill-gold text-gold" />{artist.rating} · {artist.specialties[0]}</span></span></button>)}</div><StepActions onBack={onBack} onNext={onNext} /></>;
}

function DateTimeStep({ date, time, onDate, onTime, onBack, onNext }: { date: string; time: string; onDate: (date: string) => void; onTime: (time: string) => void; onBack: () => void; onNext: () => void }) {
  const dates = useMemo(() => Array.from({ length: 12 }, (_, index) => addDays(new Date(), index + 1)), []);
  const times = ["9:00 AM", "9:45 AM", "10:30 AM", "11:15 AM", "12:30 PM", "1:15 PM", "2:00 PM", "3:30 PM", "4:15 PM", "5:45 PM", "6:30 PM", "7:15 PM"];
  return <><StepHeading eyebrow="Step four" title="Find your moment" description="Times shown are live from our appointment calendar. We’ll hold your selection for ten minutes." /><div className="rounded-2xl border border-ink/10 bg-white p-5"><p className="text-[10px] font-bold uppercase tracking-wider">Choose a day</p><div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-2">{dates.map((item) => { const value = format(item, "yyyy-MM-dd"); return <button key={value} onClick={() => onDate(value)} className={cn("flex min-w-20 flex-col items-center rounded-xl border px-3 py-3", date === value ? "border-ink bg-ink text-white" : "border-ink/10 hover:border-ink/30")}><span className="text-[9px] uppercase tracking-wider opacity-60">{format(item, "EEE")}</span><strong className="mt-1 font-display text-2xl font-normal">{format(item, "d")}</strong><span className="text-[9px] uppercase tracking-wider opacity-60">{format(item, "MMM")}</span></button>; })}</div></div>{date ? <div className="mt-5 rounded-2xl border border-ink/10 bg-white p-5"><div className="flex items-center justify-between"><p className="text-[10px] font-bold uppercase tracking-wider">Available times</p><span className="flex items-center gap-1 text-[9px] text-green-700"><span className="h-2 w-2 rounded-full bg-green-500" />Live availability</span></div><div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">{times.map((item, index) => <button key={item} disabled={index === 3 || index === 8} onClick={() => onTime(item)} className={cn("rounded-xl border px-2 py-3 text-xs", time === item ? "border-ink bg-ink text-white" : "border-ink/10 hover:border-ink/30", "disabled:cursor-not-allowed disabled:bg-ink/[0.03] disabled:text-ink/20 disabled:line-through")}>{item}</button>)}</div></div> : <div className="mt-5 rounded-2xl border border-dashed border-ink/15 py-14 text-center"><CalendarCheck className="mx-auto h-7 w-7 text-ink/25" /><p className="mt-3 text-xs text-ink/40">Choose a day to see available times.</p></div>}<StepActions onBack={onBack} onNext={onNext} /></>;
}

function DetailsStep({ booking, update, processing, onBack, onSubmit, deposit }: { booking: BookingState; update: (patch: Partial<BookingState>) => void; processing: boolean; onBack: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void; deposit: number }) {
  return <form onSubmit={onSubmit}><StepHeading eyebrow="Final step" title="A few details, then you’re set" description="We’ll use these details for your confirmation and appointment reminders." /><div className="rounded-2xl border border-ink/10 bg-white p-5 sm:p-7"><div className="grid gap-4 sm:grid-cols-2"><BookingField label="First name" value={booking.firstName} onChange={(value) => update({ firstName: value })} /><BookingField label="Last name" value={booking.lastName} onChange={(value) => update({ lastName: value })} /><BookingField label="Email" type="email" value={booking.email} onChange={(value) => update({ email: value })} /><BookingField label="Mobile number" type="tel" value={booking.phone} onChange={(value) => update({ phone: value })} /></div><label className="mt-5 block"><span className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-ink/55">Notes for your artist <small className="normal-case tracking-normal text-ink/35">(optional)</small></span><textarea value={booking.notes} onChange={(event) => update({ notes: event.target.value })} placeholder="Tell us about allergies, accessibility needs or inspiration you’ll bring…" rows={4} className="w-full rounded-xl border border-ink/15 px-4 py-3 text-sm outline-none focus:border-rose-500" /></label><label className="mt-4 flex items-start gap-3 text-xs text-ink/60"><input type="checkbox" checked={booking.sms} onChange={(event) => update({ sms: event.target.checked })} className="mt-0.5 accent-ink" /> Send helpful appointment reminders by text.</label></div><div className="mt-5 rounded-2xl border border-ink/10 bg-white p-5"><div className="flex items-start gap-4"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-blush-100"><CreditCard className="h-5 w-5 text-rose-500" /></span><div className="flex-1"><h3 className="font-display text-xl">Secure your time with a {formatCurrency(deposit)} deposit</h3><p className="mt-1 text-[11px] leading-5 text-ink/50">Your deposit is applied to the service total. Remaining balance is due at the salon.</p><div className="mt-4 grid gap-3 sm:grid-cols-2"><BookingField label="Card number" value="4242 4242 4242 4242" onChange={() => {}} /><BookingField label="Expiry / CVC" value="12/29 · 123" onChange={() => {}} /></div></div></div></div><div className="mt-7 flex items-center justify-between border-t border-ink/10 pt-6"><button type="button" onClick={onBack} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-ink/50"><ArrowLeft className="h-4 w-4" />Back</button><button disabled={processing} className="flex min-h-12 items-center gap-2 rounded-full bg-ink px-6 text-[10px] font-bold uppercase tracking-wider text-white disabled:opacity-60">{processing ? "Securing your time…" : <><ShieldCheck className="h-4 w-4" />Confirm & pay deposit</>}</button></div><p className="mt-4 text-right text-[9px] text-ink/35">By confirming, you agree to our cancellation policy and terms.</p></form>;
}

function BookingField({ label, type = "text", value, onChange }: { label: string; type?: string; value: string; onChange: (value: string) => void }) {
  return <label><span className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-ink/55">{label}</span><input required type={type} value={value} onChange={(event) => onChange(event.target.value)} className="h-12 w-full rounded-xl border border-ink/15 px-4 text-sm outline-none focus:border-rose-500" /></label>;
}

function BookingSummary({ service, artist, addOns: selectedAddOns, date, time, total, duration, deposit }: { service?: (typeof services)[number]; artist?: (typeof artists)[number]; addOns: typeof addOns; date: string; time: string; total: number; duration: number; deposit: number }) {
  return <aside className="h-fit rounded-[1.8rem] border border-ink/10 bg-white p-6 shadow-card lg:sticky lg:top-6"><p className="eyebrow text-rose-500">Your appointment</p>{service ? <div className="mt-5 flex gap-3"><span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl"><Image src={service.image} alt="" fill className="object-cover" sizes="64px" /></span><div><h3 className="font-display text-xl">{service.name}</h3><p className="mt-1 text-[10px] text-ink/45">{service.duration} min · {formatCurrency(service.price)}</p></div></div> : <div className="mt-5 rounded-xl bg-cream p-4 text-xs text-ink/45">Choose a ritual to begin.</div>}<div className="mt-5 space-y-3 border-y border-ink/10 py-5 text-xs">{selectedAddOns.map((item) => <div key={item.id} className="flex justify-between"><span className="text-ink/55">+ {item.name}</span><span>{formatCurrency(item.price)}</span></div>)}<div className="flex gap-3"><UserRound className="h-4 w-4 text-rose-500" /><span>{artist?.name ?? "First available artist"}</span></div>{date ? <div className="flex gap-3"><CalendarCheck className="h-4 w-4 text-rose-500" /><span>{format(new Date(`${date}T12:00:00`), "EEEE, MMMM d")} {time ? `· ${time}` : ""}</span></div> : null}<div className="flex gap-3"><Clock3 className="h-4 w-4 text-rose-500" /><span>{duration || "—"} minutes total</span></div><div className="flex gap-3"><MapPin className="h-4 w-4 text-rose-500" /><span className="leading-5">{siteFacts.address}</span></div></div><div className="mt-5 flex items-end justify-between"><span className="text-xs text-ink/50">Service total</span><strong className="font-display text-3xl font-normal">{formatCurrency(total)}</strong></div>{total ? <p className="mt-2 text-right text-[9px] text-ink/40">{formatCurrency(deposit)} deposit today</p> : null}<div className="mt-5 rounded-xl bg-blush-100 p-4 text-[10px] leading-5 text-ink/55"><Gift className="mb-2 h-4 w-4 text-rose-500" /> Élan members earn {Math.round(total * 2)} points on this visit.</div></aside>;
}

function Confirmation({ booking, service, artist, addOnNames, total }: { booking: BookingState; service?: (typeof services)[number]; artist?: (typeof artists)[number]; addOnNames: string[]; total: number }) {
  const displayDate = booking.date ? format(new Date(`${booking.date}T12:00:00`), "EEEE, MMMM d, yyyy") : "Your selected date";
  return <div className="min-h-screen bg-cream"><div className="border-b border-ink/10 bg-white"><div className="container-shell flex h-20 items-center justify-between"><Link href="/" className="font-display text-2xl italic text-gold">Maison Élan</Link><span className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-green-700"><BadgeCheck className="h-4 w-4" /> Appointment confirmed</span></div></div><main className="container-shell py-14 sm:py-20"><div className="mx-auto max-w-3xl text-center"><span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-blush-200"><CalendarCheck className="h-9 w-9 text-rose-500" /></span><p className="eyebrow mt-8 text-rose-500">You’re all set · {booking.bookingId || "ME-284160"}</p><h1 className="display-title mt-4 text-6xl sm:text-7xl">We’ll see you beautifully soon.</h1><p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-ink/55">A confirmation has been sent to {booking.email || "your email"}. We’ll text a gentle reminder 24 hours before your visit.</p><div className="mt-10 overflow-hidden rounded-[2rem] border border-ink/10 bg-white text-left shadow-card"><div className="bg-ink p-7 text-white"><p className="eyebrow text-blush-300">Appointment details</p><h2 className="mt-3 font-display text-3xl">{service?.name ?? "Maison Élan ritual"}</h2></div><div className="grid gap-6 p-7 sm:grid-cols-2">{[[CalendarCheck,"Date & time",`${displayDate} · ${booking.time || "Selected time"}`],[UserRound,"Your artist",artist?.name ?? "First available artist"],[Sparkles,"Finishing details",addOnNames.length ? addOnNames.join(", ") : "No add-ons selected"],[CreditCard,"Payment",`${formatCurrency(Math.round(total*.25))} deposit paid · ${formatCurrency(total-Math.round(total*.25))} at salon`],[MapPin,"At the Maison",siteFacts.address],[Clock3,"Arrive", "Please arrive five minutes before your appointment"]].map(([Icon,label,value])=>{const C=Icon as typeof Sparkles;return <div key={label as string} className="flex gap-3"><C className="mt-1 h-4 w-4 shrink-0 text-rose-500"/><div><p className="text-[9px] font-bold uppercase tracking-wider text-ink/40">{label as string}</p><p className="mt-1 text-xs leading-5">{value as string}</p></div></div>})}</div></div><div className="mt-8 flex flex-wrap justify-center gap-3"><Link href="/account/appointments" className="rounded-full bg-ink px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-white">View my appointments</Link><a href={`data:text/calendar;charset=utf8,BEGIN:VCALENDAR%0AVERSION:2.0%0ABEGIN:VEVENT%0ASUMMARY:${encodeURIComponent(service?.name ?? "Maison Elan appointment")}%0ADTSTART:${booking.date?.replaceAll("-","")}T${booking.time?.startsWith("9")?"140000":"180000"}Z%0ALOCATION:${encodeURIComponent(siteFacts.address)}%0AEND:VEVENT%0AEND:VCALENDAR`} download="maison-elan-appointment.ics" className="rounded-full border border-ink/20 px-6 py-3 text-[10px] font-bold uppercase tracking-wider">Add to calendar</a></div><div className="mt-12 rounded-2xl bg-blush-200 p-6"><p className="font-display text-2xl">A small note before you arrive</p><p className="mt-2 text-xs leading-6 text-ink/55">For the cleanest, longest-lasting result, avoid applying hand cream or cuticle oil on the morning of your appointment.</p></div></div></main></div>;
}
