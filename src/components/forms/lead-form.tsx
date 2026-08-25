"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, CheckCircle2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

type Variant = "contact" | "group" | "career" | "review";

export function LeadForm({ variant = "contact" }: { variant?: Variant }) {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    window.setTimeout(() => { setSubmitting(false); setSent(true); }, 700);
  }

  if (sent) return <div className="rounded-[2rem] border border-green-800/15 bg-green-50 p-9 text-center"><CheckCircle2 className="mx-auto h-10 w-10 text-green-700" /><h3 className="mt-5 font-display text-3xl">Your note is in good hands.</h3><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-ink/55">{variant === "group" ? "Our private-events concierge will reply within one business day with ideas and availability." : variant === "career" ? "Thank you for introducing yourself. Our studio director will be in touch if there’s a beautiful fit." : variant === "review" ? "Thank you for taking a moment to share your experience. Your review is awaiting moderation." : "A member of our guest team will reply within one business day."}</p><button onClick={() => setSent(false)} className="mt-6 text-[10px] font-bold uppercase tracking-wider underline">Send another note</button></div>;

  return (
    <form onSubmit={submit} className="rounded-[2rem] border border-ink/10 bg-white p-6 shadow-card sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2"><Field label="First name" placeholder="First name" /><Field label="Last name" placeholder="Last name" /><Field label="Email address" type="email" placeholder="you@example.com" /><Field label="Mobile number" type="tel" placeholder="(214) 555-0000" />
        {variant === "group" ? <><Field label="Occasion" placeholder="Bridal, birthday, team…" /><Field label="Estimated guests" type="number" placeholder="8" min="2" /><Field label="Preferred date" type="date" /><Field label="Budget per guest" placeholder="$75–$150" /></> : null}
        {variant === "career" ? <><Field label="Role of interest" placeholder="Nail artist, host…" /><Field label="Years of experience" type="number" placeholder="4" /><label className="sm:col-span-2"><span className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-ink/55">Portfolio or résumé</span><span className="flex min-h-14 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-ink/25 bg-cream text-xs text-ink/50"><Upload className="h-4 w-4" /> Choose PDF or image<input type="file" className="sr-only" /></span></label></> : null}
        {variant === "review" ? <label className="sm:col-span-2"><span className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-ink/55">Your rating</span><select required className="h-12 w-full rounded-xl border border-ink/15 bg-white px-4 text-sm outline-none"><option value="">Choose rating</option><option>5 — Exceptional</option><option>4 — Beautiful</option><option>3 — Good</option><option>2 — Could be better</option><option>1 — Disappointing</option></select></label> : null}
      </div>
      <label className="mt-4 block"><span className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-ink/55">{variant === "group" ? "Tell us about your occasion" : variant === "career" ? "A little about you" : variant === "review" ? "Share your experience" : "How can we help?"}</span><textarea required rows={5} placeholder={variant === "group" ? "The date, atmosphere and any details already in mind…" : "Write your note here…"} className="w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm outline-none focus:border-rose-500" /></label>
      <label className="mt-4 flex items-start gap-3 text-[10px] leading-5 text-ink/50"><input required type="checkbox" className="mt-0.5 accent-ink" /> I agree to Maison Élan’s privacy policy and consent to being contacted about this request.</label>
      <Button disabled={submitting} type="submit" variant="secondary" size="lg" className="mt-6 w-full">{submitting ? "Sending your note…" : <>Send enquiry <ArrowRight className="h-4 w-4" /></>}</Button>
    </form>
  );
}

function Field({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return <label><span className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-ink/55">{label}</span><input required className="h-12 w-full rounded-xl border border-ink/15 bg-white px-4 text-sm outline-none focus:border-rose-500" {...props} /></label>;
}

