"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { CalendarDays, ChevronRight, Clock3, MapPin, RotateCcw, Star } from "lucide-react";
import { toast } from "sonner";
import { portalAppointments, type AppointmentStatus, type PortalAppointment } from "@/components/account/data";
import { AccountPageHeader, PortalCard, StatusPill } from "@/components/account/portal-ui";
import { cn } from "@/lib/utils";

type Filter = "upcoming" | "completed" | "cancelled";

export function AppointmentsView() {
  const [filter, setFilter] = useState<Filter>("upcoming");
  const filtered = useMemo(() => portalAppointments.filter((appointment) => appointment.status === filter), [filter]);

  return (
    <div className="space-y-7">
      <AccountPageHeader
        eyebrow="Your visits"
        title="Appointments"
        description="View upcoming rituals, revisit past appointments, or make a thoughtful change to your schedule."
        action={<Link href="/book" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 text-[10px] font-bold uppercase tracking-[0.13em] text-white hover:-translate-y-0.5 hover:bg-black"><CalendarDays className="h-4 w-4 text-blush-300" /> Book another</Link>}
      />

      <div className="flex max-w-full gap-1 overflow-x-auto rounded-2xl border border-ink/10 bg-white p-1.5 sm:w-fit">
        {(["upcoming", "completed", "cancelled"] as Filter[]).map((item) => {
          const count = portalAppointments.filter((appointment) => appointment.status === item).length;
          return (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={cn(
                "flex min-h-10 shrink-0 items-center gap-2 rounded-xl px-4 text-[10px] font-bold uppercase tracking-[0.11em]",
                filter === item ? "bg-ink text-white shadow-sm" : "text-ink/45 hover:bg-cream hover:text-ink",
              )}
            >
              {item}<span className={cn("grid h-5 min-w-5 place-items-center rounded-full px-1 text-[9px]", filter === item ? "bg-white/15 text-blush-300" : "bg-cream")}>{count}</span>
            </button>
          );
        })}
      </div>

      <div className="space-y-4">
        {filtered.map((appointment) => <AppointmentCard key={appointment.id} appointment={appointment} />)}
      </div>

      <PortalCard className="flex flex-col items-start justify-between gap-4 bg-blush-100/55 p-5 sm:flex-row sm:items-center sm:p-6">
        <div>
          <p className="font-display text-xl">Need a little help?</p>
          <p className="mt-1 text-xs leading-5 text-ink/50">Our concierge can help with timing, artist recommendations, or group bookings.</p>
        </div>
        <a href="tel:+12145550198" className="inline-flex min-h-10 shrink-0 items-center rounded-full border border-ink/15 px-5 text-[10px] font-bold uppercase tracking-[0.12em] hover:border-ink">Call concierge</a>
      </PortalCard>
    </div>
  );
}

function AppointmentCard({ appointment }: { appointment: PortalAppointment }) {
  const statusTone: Record<AppointmentStatus, "success" | "neutral" | "rose"> = {
    upcoming: "success",
    completed: "neutral",
    cancelled: "rose",
  };

  return (
    <PortalCard className="overflow-hidden">
      <div className="grid md:grid-cols-[150px_1fr]">
        <div className="relative min-h-[132px] overflow-hidden md:min-h-full">
          <Image src={appointment.image} alt={appointment.service} fill className={cn("object-cover", appointment.status === "cancelled" && "grayscale opacity-70")} sizes="(max-width: 768px) 100vw, 150px" />
          <div className="absolute left-4 top-4 rounded-2xl bg-white/95 px-3 py-2 text-center shadow-sm">
            <span className="block font-display text-2xl leading-none">{appointment.day}</span>
            <span className="mt-1 block text-[8px] font-bold uppercase tracking-[0.15em] text-rose-500">{appointment.month}</span>
          </div>
        </div>
        <div className="p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2"><StatusPill tone={statusTone[appointment.status]}>{appointment.status}</StatusPill><span className="text-[10px] text-ink/35">#{appointment.id}</span></div>
              <h2 className="mt-3 font-display text-2xl sm:text-3xl">{appointment.service}</h2>
              <p className="mt-1 text-xs text-ink/50">with <span className="font-semibold text-ink/70">{appointment.artist}</span></p>
            </div>
            <p className="font-display text-2xl">${appointment.price}</p>
          </div>
          <div className="mt-5 grid gap-3 border-y border-ink/10 py-4 text-[11px] text-ink/55 sm:grid-cols-3">
            <span className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-rose-500" /> {appointment.date}</span>
            <span className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-rose-500" /> {appointment.time} · {appointment.duration}</span>
            <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-rose-500" /> Dallas atelier</span>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            {appointment.status === "upcoming" ? (
              <>
                <Link href={`/account/appointments/manage?id=${appointment.id}`} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 text-[10px] font-bold uppercase tracking-[0.12em] text-white hover:bg-black">Manage appointment <ChevronRight className="h-3.5 w-3.5" /></Link>
                <button onClick={() => toast.success("Added to your calendar", { description: `${appointment.date} at ${appointment.time}` })} className="inline-flex min-h-11 items-center rounded-full border border-ink/15 px-5 text-[10px] font-bold uppercase tracking-[0.12em] hover:border-ink">Add to calendar</button>
              </>
            ) : appointment.status === "completed" ? (
              <>
                <button onClick={() => toast.success("Perfect choice", { description: `${appointment.service} has been added to a new booking.` })} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-ink px-5 text-[10px] font-bold uppercase tracking-[0.12em] text-white hover:bg-black"><RotateCcw className="h-3.5 w-3.5" /> Book again</button>
                <button onClick={() => toast("Thank you for sharing", { description: "The review form is ready for your notes." })} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-ink/15 px-5 text-[10px] font-bold uppercase tracking-[0.12em] hover:border-ink"><Star className="h-3.5 w-3.5" /> Leave a review</button>
              </>
            ) : (
              <button onClick={() => toast.success("Let’s find a better time", { description: "Your previous service has been added to booking." })} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-ink/15 px-5 text-[10px] font-bold uppercase tracking-[0.12em] hover:border-ink"><RotateCcw className="h-3.5 w-3.5" /> Book again</button>
            )}
            <button onClick={() => toast("Receipt ready", { description: `Receipt ${appointment.id} would download securely.` })} className="ml-auto text-[10px] font-bold uppercase tracking-[0.11em] text-ink/40 hover:text-rose-500">View receipt</button>
          </div>
        </div>
      </div>
    </PortalCard>
  );
}
