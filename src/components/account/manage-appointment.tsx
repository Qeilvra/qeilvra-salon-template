"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  CalendarCheck,
  CalendarDays,
  Check,
  Clock3,
  MapPin,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { portalAppointments } from "@/components/account/data";
import { PortalCard, StatusPill } from "@/components/account/portal-ui";
import { cn } from "@/lib/utils";

const dates = [
  { day: "Thu", date: "03", month: "Sep", full: "Thursday, September 3" },
  { day: "Fri", date: "04", month: "Sep", full: "Friday, September 4" },
  { day: "Sat", date: "05", month: "Sep", full: "Saturday, September 5" },
  { day: "Mon", date: "07", month: "Sep", full: "Monday, September 7" },
  { day: "Tue", date: "08", month: "Sep", full: "Tuesday, September 8" },
  { day: "Wed", date: "09", month: "Sep", full: "Wednesday, September 9" },
];

const times = ["9:30 AM", "10:15 AM", "11:00 AM", "12:30 PM", "2:00 PM", "3:45 PM", "5:15 PM"];

export function ManageAppointment() {
  const searchParams = useSearchParams();
  const requestedId = searchParams.get("id");
  const appointment = useMemo(() => portalAppointments.find((item) => item.id === requestedId && item.status === "upcoming") ?? portalAppointments[0], [requestedId]);
  const [mode, setMode] = useState<"reschedule" | "cancel">("reschedule");
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState("11:00 AM");
  const [reason, setReason] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [rescheduled, setRescheduled] = useState(false);

  function confirmReschedule() {
    setRescheduled(true);
    toast.success("Appointment rescheduled", { description: `${dates[selectedDate].full} at ${selectedTime}. A confirmation is on its way.` });
  }

  function cancelAppointment() {
    if (!reason) {
      toast.error("Please select a reason", { description: "This helps us take better care of your future visits." });
      return;
    }
    if (!acknowledged) {
      toast.error("Please review the cancellation policy");
      return;
    }
    setCancelled(true);
    toast.success("Appointment cancelled", { description: "Your confirmation has been sent by email." });
  }

  if (cancelled) {
    return (
      <div className="mx-auto max-w-2xl py-6 sm:py-12">
        <PortalCard className="p-7 text-center sm:p-12">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-blush-100 text-rose-500"><CalendarCheck className="h-7 w-7" /></span>
          <p className="eyebrow mt-6 text-rose-500">Cancellation confirmed</p>
          <h1 className="mt-3 font-display text-4xl">Your time has been released.</h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-ink/50">We’re sorry to miss you. Appointment {appointment.id} has been cancelled and no fee was charged.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/book" className="inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-6 text-[10px] font-bold uppercase tracking-[0.12em] text-white">Find another time</Link>
            <Link href="/account/appointments" className="inline-flex min-h-11 items-center justify-center rounded-full border border-ink/15 px-6 text-[10px] font-bold uppercase tracking-[0.12em]">Back to appointments</Link>
          </div>
        </PortalCard>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <div>
        <Link href="/account/appointments" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.13em] text-ink/45 hover:text-rose-500"><ArrowLeft className="h-3.5 w-3.5" /> Back to appointments</Link>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="eyebrow text-rose-500">Appointment {appointment.id}</p><h1 className="mt-2 font-display text-4xl sm:text-5xl">Manage your visit</h1></div>
          <StatusPill tone="success">Confirmed</StatusPill>
        </div>
      </div>

      <PortalCard className="p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div><p className="font-display text-2xl">{appointment.service}</p><p className="mt-1 text-xs text-ink/45">{appointment.date} · {appointment.time}</p></div>
          <div className="grid gap-3 text-[11px] text-ink/55 sm:grid-cols-3 lg:min-w-[520px]">
            <span className="flex items-center gap-2 rounded-xl bg-cream px-3 py-2.5"><UserRound className="h-4 w-4 text-rose-500" /> {appointment.artist}</span>
            <span className="flex items-center gap-2 rounded-xl bg-cream px-3 py-2.5"><Clock3 className="h-4 w-4 text-rose-500" /> {appointment.duration}</span>
            <span className="flex items-center gap-2 rounded-xl bg-cream px-3 py-2.5"><MapPin className="h-4 w-4 text-rose-500" /> Dallas atelier</span>
          </div>
        </div>
      </PortalCard>

      <div className="grid gap-6 xl:grid-cols-[1fr_330px]">
        <PortalCard className="overflow-hidden">
          <div className="grid grid-cols-2 border-b border-ink/10 bg-cream/60 p-1.5">
            <button onClick={() => setMode("reschedule")} className={cn("min-h-11 rounded-xl text-[10px] font-bold uppercase tracking-[0.12em]", mode === "reschedule" ? "bg-white text-ink shadow-sm" : "text-ink/40")}>Reschedule</button>
            <button onClick={() => setMode("cancel")} className={cn("min-h-11 rounded-xl text-[10px] font-bold uppercase tracking-[0.12em]", mode === "cancel" ? "bg-white text-rose-500 shadow-sm" : "text-ink/40")}>Cancel appointment</button>
          </div>

          {mode === "reschedule" ? (
            <div className="p-5 sm:p-7">
              {rescheduled ? (
                <div className="mb-6 flex gap-3 rounded-2xl border border-emerald-700/10 bg-emerald-50 p-4 text-emerald-800"><Check className="mt-0.5 h-5 w-5 shrink-0" /><div><p className="text-sm font-semibold">Your new time is confirmed.</p><p className="mt-1 text-xs text-emerald-700/70">{dates[selectedDate].full} at {selectedTime}</p></div></div>
              ) : null}
              <div className="flex items-center justify-between"><div><p className="eyebrow text-rose-500">Step one</p><h2 className="mt-2 font-display text-2xl">Choose a new date</h2></div><CalendarDays className="h-5 w-5 text-gold" /></div>
              <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto pb-1">
                {dates.map((date, index) => (
                  <button key={date.full} onClick={() => setSelectedDate(index)} className={cn("min-w-[78px] rounded-2xl border px-3 py-3 text-center", selectedDate === index ? "border-ink bg-ink text-white" : "border-ink/10 bg-white hover:border-blush-300")}>
                    <span className="block text-[9px] font-bold uppercase tracking-[0.12em] opacity-50">{date.day}</span><span className="mt-1 block font-display text-2xl">{date.date}</span><span className={cn("block text-[9px] uppercase", selectedDate === index ? "text-blush-300" : "text-rose-500")}>{date.month}</span>
                  </button>
                ))}
              </div>

              <div className="mt-8 border-t border-ink/10 pt-7"><p className="eyebrow text-rose-500">Step two</p><h2 className="mt-2 font-display text-2xl">Select a time with {appointment.artist.split(" ")[0]}</h2></div>
              <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                {times.map((time) => <button key={time} onClick={() => setSelectedTime(time)} className={cn("min-h-11 rounded-xl border text-[11px] font-semibold", selectedTime === time ? "border-rose-500 bg-blush-100 text-ink" : "border-ink/10 hover:border-blush-300")}>{time}</button>)}
              </div>
              <button onClick={confirmReschedule} className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-ink px-6 text-[10px] font-bold uppercase tracking-[0.13em] text-white hover:bg-black sm:w-auto"><CalendarCheck className="h-4 w-4 text-blush-300" /> Confirm new time</button>
            </div>
          ) : (
            <div className="p-5 sm:p-7">
              <div className="flex gap-4 rounded-2xl border border-amber-700/10 bg-amber-50 p-4"><AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" /><div><p className="text-sm font-semibold text-amber-900">Before you cancel</p><p className="mt-1 text-xs leading-5 text-amber-800/65">You can reschedule without a fee until 24 hours before your appointment.</p></div></div>
              <label className="mt-6 block text-xs font-semibold">What changed?</label>
              <select value={reason} onChange={(event) => setReason(event.target.value)} className="mt-2 min-h-12 w-full rounded-2xl border border-ink/10 bg-white px-4 text-sm outline-none focus:border-rose-500">
                <option value="">Select a reason</option><option>Schedule conflict</option><option>Feeling unwell</option><option>Booked by mistake</option><option>Prefer a different service</option><option>Other</option>
              </select>
              <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-2xl border border-ink/10 p-4 text-xs leading-5 text-ink/55">
                <input type="checkbox" checked={acknowledged} onChange={(event) => setAcknowledged(event.target.checked)} className="mt-0.5 h-4 w-4 accent-[#c97c7a]" />
                <span>I understand that cancellations within 24 hours may forfeit the booking deposit under the cancellation policy.</span>
              </label>
              <button onClick={cancelAppointment} className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full border border-red-700/30 bg-red-50 px-6 text-[10px] font-bold uppercase tracking-[0.13em] text-red-700 hover:bg-red-100 sm:w-auto">Cancel appointment</button>
            </div>
          )}
        </PortalCard>

        <div className="space-y-5">
          <PortalCard className="p-5">
            <p className="eyebrow text-rose-500">New appointment</p>
            <div className="mt-4 space-y-4 text-xs">
              <div className="flex items-start gap-3"><CalendarDays className="mt-0.5 h-4 w-4 text-rose-500" /><div><p className="font-semibold">{dates[selectedDate].full}</p><p className="mt-1 text-ink/40">2026</p></div></div>
              <div className="flex items-start gap-3"><Clock3 className="mt-0.5 h-4 w-4 text-rose-500" /><div><p className="font-semibold">{selectedTime}</p><p className="mt-1 text-ink/40">{appointment.duration}</p></div></div>
              <div className="border-t border-ink/10 pt-4"><div className="flex justify-between"><span className="text-ink/45">Service total</span><span className="font-semibold">${appointment.price}</span></div><div className="mt-2 flex justify-between"><span className="text-ink/45">Change fee</span><span className="font-semibold text-emerald-700">$0</span></div></div>
            </div>
          </PortalCard>
          <PortalCard className="p-5">
            <ShieldCheck className="h-5 w-5 text-gold" /><p className="mt-3 font-display text-xl">Plans change. We understand.</p><p className="mt-2 text-[11px] leading-5 text-ink/45">Changes made more than 24 hours ahead are always complimentary. Questions? Call our concierge.</p>
          </PortalCard>
        </div>
      </div>
    </div>
  );
}
