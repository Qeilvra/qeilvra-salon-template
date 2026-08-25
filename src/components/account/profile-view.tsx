"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Bell, Camera, Check, Home, LockKeyhole, Mail, MapPin, Plus, ShieldCheck, Trash2, UserRound } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { AccountPageHeader, FormError, PortalCard, fieldClass } from "@/components/account/portal-ui";
import { cn } from "@/lib/utils";

const profileSchema = z.object({
  firstName: z.string().min(2, "Please enter your first name."),
  lastName: z.string().min(2, "Please enter your last name."),
  email: z.string().email("Enter a valid email address."),
  phone: z.string().min(10, "Enter a valid phone number."),
  birthday: z.string().optional(),
  pronouns: z.string().optional(),
  notes: z.string().max(300, "Please keep this under 300 characters.").optional(),
});

const addressSchema = z.object({
  label: z.string().min(2, "Give this address a label."),
  address: z.string().min(5, "Enter your street address."),
  unit: z.string().optional(),
  city: z.string().min(2, "Enter your city."),
  state: z.string().length(2, "Use the 2-letter state code."),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/, "Enter a valid ZIP code."),
});

type ProfileValues = z.infer<typeof profileSchema>;
type AddressValues = z.infer<typeof addressSchema>;
type Tab = "personal" | "preferences" | "addresses" | "security";

const initialAddresses: (AddressValues & { id: number; primary?: boolean })[] = [
  { id: 1, label: "Home", address: "1842 Rosewood Lane", unit: "Apt 4B", city: "Dallas", state: "TX", zip: "75201", primary: true },
];

export function ProfileView() {
  const [tab, setTab] = useState<Tab>("personal");
  const [addresses, setAddresses] = useState(initialAddresses);
  const [addressOpen, setAddressOpen] = useState(false);
  const [preferences, setPreferences] = useState({ email: true, sms: true, reminders: true, offers: false });
  const photoRef = useRef<HTMLInputElement>(null);

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "Avery",
      lastName: "Morgan",
      email: "avery.morgan@example.com",
      phone: "(214) 555-0147",
      birthday: "1992-07-12",
      pronouns: "She / her",
      notes: "I prefer short almond nails and sheer, neutral shades.",
    },
  });

  const addressForm = useForm<AddressValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: { label: "", address: "", unit: "", city: "Dallas", state: "TX", zip: "" },
  });

  function saveProfile(values: ProfileValues) {
    toast.success("Profile updated", { description: `Thank you, ${values.firstName}. Your details are saved.` });
    profileForm.reset(values);
  }

  function addAddress(values: AddressValues) {
    setAddresses((current) => [...current, { ...values, id: Date.now() }]);
    addressForm.reset({ label: "", address: "", unit: "", city: "Dallas", state: "TX", zip: "" });
    setAddressOpen(false);
    toast.success("Address added", { description: `${values.label} is ready for future orders.` });
  }

  return (
    <div className="space-y-7">
      <AccountPageHeader eyebrow="Your details" title="Profile & preferences" description="Keep your contact details, care preferences, addresses, and privacy settings beautifully up to date." />

      <PortalCard className="overflow-hidden">
        <div className="bg-[linear-gradient(120deg,#171411,#3b2b26)] px-5 py-6 text-white sm:px-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="relative">
              <div className="grid h-20 w-20 place-items-center rounded-full border-4 border-white/15 bg-blush-300 font-display text-2xl text-ink">AM</div>
              <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={() => toast.success("New photo selected", { description: "Your profile photo has been updated." })} />
              <button onClick={() => photoRef.current?.click()} className="absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-full border-2 border-ink bg-white text-ink shadow-sm" aria-label="Change profile photo"><Camera className="h-3.5 w-3.5" /></button>
            </div>
            <div><p className="font-display text-3xl">Avery Morgan</p><div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-white/50"><span className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-blush-300" /> avery.morgan@example.com</span><span className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 text-blush-300" /> Verified client</span></div></div>
            <span className="sm:ml-auto inline-flex w-fit rounded-full border border-blush-300/25 bg-blush-300/10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.13em] text-blush-300">Atelier member</span>
          </div>
        </div>

        <div className="no-scrollbar flex gap-1 overflow-x-auto border-b border-ink/10 p-2">
          {([
            ["personal", "Personal details", UserRound],
            ["preferences", "Preferences", Bell],
            ["addresses", "Addresses", MapPin],
            ["security", "Security", LockKeyhole],
          ] as const).map(([value, label, Icon]) => (
            <button key={value} onClick={() => setTab(value)} className={cn("flex min-h-11 shrink-0 items-center gap-2 rounded-xl px-4 text-[10px] font-bold uppercase tracking-[0.1em]", tab === value ? "bg-ink text-white" : "text-ink/40 hover:bg-cream hover:text-ink")}><Icon className={cn("h-4 w-4", tab === value && "text-blush-300")} /> {label}</button>
          ))}
        </div>

        <div className="p-5 sm:p-7 lg:p-8">
          {tab === "personal" ? (
            <form onSubmit={profileForm.handleSubmit(saveProfile)} noValidate>
              <div><p className="eyebrow text-rose-500">Personal details</p><h2 className="mt-2 font-display text-2xl">How we know you</h2><p className="mt-2 text-xs leading-5 text-ink/45">Used for appointment confirmations, receipts, and your personal salon experience.</p></div>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <Field label="First name" error={profileForm.formState.errors.firstName?.message}><input className={fieldClass} {...profileForm.register("firstName")} /></Field>
                <Field label="Last name" error={profileForm.formState.errors.lastName?.message}><input className={fieldClass} {...profileForm.register("lastName")} /></Field>
                <Field label="Email address" error={profileForm.formState.errors.email?.message}><input type="email" className={fieldClass} {...profileForm.register("email")} /></Field>
                <Field label="Mobile number" error={profileForm.formState.errors.phone?.message}><input type="tel" className={fieldClass} {...profileForm.register("phone")} /></Field>
                <Field label="Birthday" hint="We’ll remember with a little birthday gift."><input type="date" className={fieldClass} {...profileForm.register("birthday")} /></Field>
                <Field label="Pronouns"><select className={fieldClass} {...profileForm.register("pronouns")}><option>She / her</option><option>He / him</option><option>They / them</option><option>Prefer not to say</option></select></Field>
                <div className="sm:col-span-2"><Field label="Care notes" hint="Anything that helps your artist personalize your visit." error={profileForm.formState.errors.notes?.message}><textarea rows={4} className={`${fieldClass} resize-none py-3`} {...profileForm.register("notes")} /></Field></div>
              </div>
              <div className="mt-7 flex items-center gap-4"><button disabled={!profileForm.formState.isDirty || profileForm.formState.isSubmitting} className="inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-6 text-[10px] font-bold uppercase tracking-[0.12em] text-white disabled:cursor-not-allowed disabled:opacity-35">Save changes</button>{profileForm.formState.isDirty ? <span className="text-[10px] text-amber-700">You have unsaved changes</span> : <span className="flex items-center gap-1.5 text-[10px] text-emerald-700"><Check className="h-3.5 w-3.5" /> All changes saved</span>}</div>
            </form>
          ) : null}

          {tab === "preferences" ? (
            <div>
              <div><p className="eyebrow text-rose-500">Communication</p><h2 className="mt-2 font-display text-2xl">How you hear from us</h2><p className="mt-2 text-xs leading-5 text-ink/45">Essential confirmations and receipts will always be sent.</p></div>
              <div className="mt-6 divide-y divide-ink/10 rounded-2xl border border-ink/10">
                {[
                  ["email", "Email updates", "Appointment care notes, receipts, and Maison news."],
                  ["sms", "Text messages", "Concise confirmations and schedule changes."],
                  ["reminders", "Appointment reminders", "A thoughtful reminder 48 and 3 hours ahead."],
                  ["offers", "Private offers", "Member events, seasonal edits, and limited rituals."],
                ].map(([key, title, text]) => {
                  const preference = key as keyof typeof preferences;
                  return <label key={key} className="flex cursor-pointer items-center gap-4 p-4 sm:p-5"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blush-100 text-rose-500"><Bell className="h-4 w-4" /></span><span className="min-w-0 flex-1"><span className="block text-xs font-semibold">{title}</span><span className="mt-1 block text-[11px] leading-5 text-ink/40">{text}</span></span><span className={cn("relative h-6 w-11 shrink-0 rounded-full transition", preferences[preference] ? "bg-ink" : "bg-ink/15")}><input type="checkbox" checked={preferences[preference]} onChange={() => { setPreferences((current) => ({ ...current, [preference]: !current[preference] })); toast.success("Preference updated"); }} className="sr-only" /><span className={cn("absolute top-1 h-4 w-4 rounded-full bg-white transition", preferences[preference] ? "left-6" : "left-1")} /></span></label>;
                })}
              </div>
            </div>
          ) : null}

          {tab === "addresses" ? (
            <div>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow text-rose-500">Saved addresses</p><h2 className="mt-2 font-display text-2xl">Where your edit arrives</h2><p className="mt-2 text-xs text-ink/45">Saved securely for faster product checkout.</p></div><button onClick={() => setAddressOpen((value) => !value)} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-ink/15 px-5 text-[9px] font-bold uppercase tracking-[0.12em] hover:border-ink"><Plus className="h-3.5 w-3.5" /> Add address</button></div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {addresses.map((address) => <div key={address.id} className="relative rounded-2xl border border-ink/10 bg-cream/50 p-5"><div className="flex items-start gap-4"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-rose-500"><Home className="h-4 w-4" /></span><div><div className="flex flex-wrap items-center gap-2"><p className="text-xs font-semibold">{address.label}</p>{address.primary ? <span className="rounded-full bg-emerald-50 px-2 py-1 text-[8px] font-bold uppercase text-emerald-700">Primary</span> : null}</div><p className="mt-2 text-[11px] leading-5 text-ink/50">{address.address}{address.unit ? `, ${address.unit}` : ""}<br />{address.city}, {address.state} {address.zip}</p></div></div><div className="mt-5 flex gap-4 border-t border-ink/10 pt-4"><button onClick={() => toast("Address editor opened", { description: `Editing ${address.label}.` })} className="text-[9px] font-bold uppercase tracking-[0.12em] text-rose-500">Edit</button>{!address.primary ? <button onClick={() => setAddresses((current) => current.filter((item) => item.id !== address.id))} className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.12em] text-red-600"><Trash2 className="h-3 w-3" /> Remove</button> : null}</div></div>)}
              </div>
              {addressOpen ? (
                <form onSubmit={addressForm.handleSubmit(addAddress)} noValidate className="mt-6 rounded-2xl border border-blush-300 bg-blush-50 p-5 sm:p-6">
                  <h3 className="font-display text-2xl">Add an address</h3><div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <Field label="Label" error={addressForm.formState.errors.label?.message}><input placeholder="Home or office" className={fieldClass} {...addressForm.register("label")} /></Field>
                    <Field label="Street address" error={addressForm.formState.errors.address?.message}><input className={fieldClass} {...addressForm.register("address")} /></Field>
                    <Field label="Apartment / suite"><input className={fieldClass} {...addressForm.register("unit")} /></Field>
                    <Field label="City" error={addressForm.formState.errors.city?.message}><input className={fieldClass} {...addressForm.register("city")} /></Field>
                    <Field label="State" error={addressForm.formState.errors.state?.message}><input maxLength={2} className={`${fieldClass} uppercase`} {...addressForm.register("state")} /></Field>
                    <Field label="ZIP code" error={addressForm.formState.errors.zip?.message}><input inputMode="numeric" className={fieldClass} {...addressForm.register("zip")} /></Field>
                  </div><div className="mt-5 flex gap-3"><button className="min-h-10 rounded-full bg-ink px-5 text-[9px] font-bold uppercase tracking-[0.12em] text-white">Save address</button><button type="button" onClick={() => setAddressOpen(false)} className="min-h-10 rounded-full border border-ink/15 px-5 text-[9px] font-bold uppercase tracking-[0.12em]">Cancel</button></div>
                </form>
              ) : null}
            </div>
          ) : null}

          {tab === "security" ? <SecurityPanel /> : null}
        </div>
      </PortalCard>
    </div>
  );
}

function SecurityPanel() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");

  function updatePassword(event: React.FormEvent) {
    event.preventDefault();
    if (current.length < 8) return toast.error("Enter your current password.");
    if (next.length < 8) return toast.error("New password must be at least 8 characters.");
    if (next !== confirm) return toast.error("New passwords do not match.");
    setCurrent(""); setNext(""); setConfirm("");
    toast.success("Password updated", { description: "Your account is protected with the new password." });
  }

  return (
    <div>
      <div><p className="eyebrow text-rose-500">Security</p><h2 className="mt-2 font-display text-2xl">Protect your Maison</h2><p className="mt-2 text-xs text-ink/45">Choose a unique password you don’t use elsewhere.</p></div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <form onSubmit={updatePassword} className="space-y-4"><Field label="Current password"><input required type="password" value={current} onChange={(event) => setCurrent(event.target.value)} className={fieldClass} /></Field><Field label="New password" hint="At least 8 characters."><input required type="password" value={next} onChange={(event) => setNext(event.target.value)} className={fieldClass} /></Field><Field label="Confirm new password"><input required type="password" value={confirm} onChange={(event) => setConfirm(event.target.value)} className={fieldClass} /></Field><button className="min-h-11 rounded-full bg-ink px-6 text-[10px] font-bold uppercase tracking-[0.12em] text-white">Update password</button></form>
        <div className="space-y-3"><div className="rounded-2xl border border-emerald-700/10 bg-emerald-50 p-5"><ShieldCheck className="h-5 w-5 text-emerald-700" /><p className="mt-3 text-xs font-semibold text-emerald-900">Account protected</p><p className="mt-1 text-[11px] leading-5 text-emerald-800/60">Email verified · Last sign-in today from Dallas, TX.</p></div><button onClick={() => toast.success("Reset link sent", { description: "Check avery.morgan@example.com." })} className="w-full rounded-2xl border border-ink/10 p-4 text-left"><p className="text-xs font-semibold">Sign out everywhere</p><p className="mt-1 text-[10px] text-ink/40">End all active sessions except this one.</p></button></div>
      </div>
    </div>
  );
}

function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-[11px] font-semibold text-ink/70">{label}</span>{children}{hint ? <span className="mt-1.5 block text-[10px] text-ink/35">{hint}</span> : null}<FormError>{error}</FormError></label>;
}
