"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck2,
  CalendarClock,
  Check,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  MoreHorizontal,
  ShoppingBag,
  Sparkles,
  Star,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";
import { artists } from "@/lib/site-data";
import { AdminButton, Avatar, IconButton, KpiCard, PageHeader, Panel, ProgressBar, StatusChip } from "../admin-ui";

const revenue = [
  { day: "Mon", revenue: 3240, appointments: 24 },
  { day: "Tue", revenue: 2880, appointments: 21 },
  { day: "Wed", revenue: 4120, appointments: 29 },
  { day: "Thu", revenue: 3760, appointments: 27 },
  { day: "Fri", revenue: 5240, appointments: 38 },
  { day: "Sat", revenue: 6180, appointments: 44 },
  { day: "Sun", revenue: 2940, appointments: 19 },
];

const schedule = [
  { time: "9:00", meridiem: "AM", client: "Sofia Alvarez", service: "Atelier Gel", artist: artists[0], status: "Checked in", tone: "green" as const },
  { time: "10:15", meridiem: "AM", client: "Maya Thompson", service: "Velvet Pedicure", artist: artists[2], status: "Confirmed", tone: "blue" as const },
  { time: "11:30", meridiem: "AM", client: "Claire Wilson", service: "Sculpted Extensions", artist: artists[1], status: "Arriving soon", tone: "amber" as const },
  { time: "1:00", meridiem: "PM", client: "Layla Reed", service: "Signature Manicure", artist: artists[3], status: "Confirmed", tone: "blue" as const },
  { time: "2:30", meridiem: "PM", client: "Isla Bennett", service: "Editorial Nail Art", artist: artists[1], status: "Confirmed", tone: "blue" as const },
];

const topServices = [
  { name: "Atelier Gel", bookings: 86, revenue: "$6,192", percent: 92 },
  { name: "Velvet Pedicure", bookings: 71, revenue: "$4,828", percent: 76 },
  { name: "Signature Manicure", bookings: 64, revenue: "$3,072", percent: 68 },
  { name: "Sculpted Extensions", bookings: 38, revenue: "$4,484", percent: 45 },
];

const activity = [
  { icon: CalendarCheck2, title: "New appointment", detail: "Sofia booked Atelier Gel with Amara", time: "4 min ago", color: "bg-blush-100 text-blush-500" },
  { icon: Star, title: "New 5-star review", detail: "Priya praised Mina’s fine-line artwork", time: "18 min ago", color: "bg-amber-50 text-amber-600" },
  { icon: ShoppingBag, title: "Shop order #ME-1842", detail: "Night Renewal Set · $64.00", time: "42 min ago", color: "bg-violet-50 text-violet-600" },
  { icon: Check, title: "Appointment completed", detail: "Velvet Pedicure · Camille R.", time: "1 hr ago", color: "bg-emerald-50 text-emerald-600" },
];

export function OverviewPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Salon command"
        title="Good morning, Olivia"
        description="Here’s what is happening at Maison Élan today. Your studio is 86% booked with a strong afternoon ahead."
        actions={<><AdminButton variant="secondary" onClick={() => toast.success("Daily report exported")}>Export report</AdminButton><AdminButton onClick={() => toast("Quick booking opened", { description: "Booking creation will appear in the appointments workspace." })}><CalendarCheck2 className="h-4 w-4" />New appointment</AdminButton></>}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <KpiCard label="Today’s revenue" value="$4,860" change="12.8%" note="vs. last Sunday" icon={CircleDollarSign} tone="blush" />
        <KpiCard label="Appointments" value="32" change="5 more" note="than last week" icon={CalendarCheck2} tone="ink" />
        <KpiCard label="New customers" value="8" change="18.4%" note="this month" icon={UsersRound} tone="cream" />
        <KpiCard label="Avg. ticket" value="$152" change="4.2%" note="this week" icon={TrendingUp} tone="gold" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(330px,.85fr)]">
        <Panel
          title="Revenue overview"
          subtitle="$28,360 total revenue · August 17–23"
          action={<select aria-label="Revenue period" className="h-8 rounded-lg border border-stone-200 bg-white px-2 text-[10px] font-semibold text-stone-600"><option>This week</option><option>Last 30 days</option><option>This quarter</option></select>}
          bodyClassName="pb-3"
        >
          <div className="mb-4 flex flex-wrap gap-6">
            <div><p className="text-[10px] text-stone-400">Gross revenue</p><p className="mt-1 text-lg font-semibold">$28,360</p></div>
            <div><p className="text-[10px] text-stone-400">Service revenue</p><p className="mt-1 text-lg font-semibold">$24,180</p></div>
            <div><p className="text-[10px] text-stone-400">Retail revenue</p><p className="mt-1 text-lg font-semibold">$4,180</p></div>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenue} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c97c7a" stopOpacity={0.28} /><stop offset="100%" stopColor="#c97c7a" stopOpacity={0.01} /></linearGradient>
                </defs>
                <CartesianGrid stroke="#eee9e4" strokeDasharray="3 4" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#a8a29e", fontSize: 10 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#a8a29e", fontSize: 10 }} tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip cursor={{ stroke: "#e7d7cf", strokeWidth: 1 }} contentStyle={{ border: "1px solid #eee9e4", borderRadius: 12, boxShadow: "0 12px 28px rgba(30,20,15,.09)", fontSize: 11 }} formatter={(value) => [`$${Number(value).toLocaleString()}`, "Revenue"]} />
                <Area type="monotone" dataKey="revenue" stroke="#c97c7a" strokeWidth={2.5} fill="url(#revenueFill)" activeDot={{ r: 4, strokeWidth: 2, fill: "white" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Studio pulse" subtitle="Live capacity and performance">
          <div className="rounded-2xl bg-[#1c1916] p-5 text-white">
            <div className="flex items-center justify-between"><span className="text-xs text-white/55">Today’s capacity</span><span className="text-sm font-semibold">86%</span></div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[86%] rounded-full bg-blush-300" /></div>
            <div className="mt-4 grid grid-cols-3 divide-x divide-white/10 text-center">
              <div><p className="text-lg font-semibold">32</p><p className="mt-1 text-[9px] text-white/40">Booked</p></div>
              <div><p className="text-lg font-semibold">5</p><p className="mt-1 text-[9px] text-white/40">Open slots</p></div>
              <div><p className="text-lg font-semibold">4</p><p className="mt-1 text-[9px] text-white/40">Artists</p></div>
            </div>
          </div>
          <div className="mt-5 space-y-4">
            <div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600"><Clock3 className="h-4 w-4" /></span><div className="flex-1"><p className="text-xs font-semibold">On-time starts</p><p className="text-[10px] text-stone-400">95% of today’s appointments</p></div><span className="text-xs font-semibold">95%</span></div>
            <div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-blush-100 text-blush-500"><CalendarClock className="h-4 w-4" /></span><div className="flex-1"><p className="text-xs font-semibold">Rebooking rate</p><p className="text-[10px] text-stone-400">30-day rolling average</p></div><span className="text-xs font-semibold">72%</span></div>
            <div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-50 text-amber-600"><Star className="h-4 w-4" /></span><div className="flex-1"><p className="text-xs font-semibold">Client rating</p><p className="text-[10px] text-stone-400">From 286 verified visits</p></div><span className="text-xs font-semibold">4.9</span></div>
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(330px,.8fr)]">
        <Panel title="Today’s appointments" subtitle="Next five visits" action={<Link href="/admin/appointments" className="inline-flex items-center gap-1 text-[11px] font-semibold text-blush-500 hover:text-ink">View schedule <ArrowRight className="h-3.5 w-3.5" /></Link>} bodyClassName="p-0">
          <div className="divide-y divide-stone-100">
            {schedule.map((appointment) => (
              <div key={`${appointment.time}-${appointment.client}`} className="grid grid-cols-[48px_minmax(0,1fr)] items-center gap-x-3 gap-y-2 px-4 py-3.5 hover:bg-stone-50/60 sm:grid-cols-[58px_minmax(0,1fr)_150px_auto] sm:gap-3 sm:px-5">
                <div><p className="text-xs font-semibold text-ink">{appointment.time}</p><p className="text-[9px] text-stone-400">{appointment.meridiem}</p></div>
                <div className="flex min-w-0 items-center gap-3"><Avatar name={appointment.client} size="sm" /><div className="min-w-0"><p className="truncate text-xs font-semibold">{appointment.client}</p><p className="mt-0.5 truncate text-[10px] text-stone-400">{appointment.service}</p></div></div>
                <div className="hidden items-center gap-2 sm:flex"><Avatar name={appointment.artist.name} image={appointment.artist.image} size="sm" /><span className="truncate text-[10px] text-stone-500">{appointment.artist.name}</span></div>
                <div className="col-start-2 row-start-2 flex items-center gap-2 sm:col-start-auto sm:row-start-auto"><StatusChip label={appointment.status} tone={appointment.tone} /><IconButton label="Appointment actions" className="hidden sm:inline-flex"><MoreHorizontal className="h-4 w-4" /></IconButton></div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Recent activity" subtitle="Across your business" action={<IconButton label="Activity options"><MoreHorizontal className="h-4 w-4" /></IconButton>}>
          <div className="space-y-5">
            {activity.map((item) => {
              const Icon = item.icon;
              return <div key={item.detail} className="flex gap-3"><span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${item.color}`}><Icon className="h-4 w-4" /></span><div className="min-w-0 flex-1"><p className="text-xs font-semibold">{item.title}</p><p className="mt-0.5 text-[10px] leading-4 text-stone-400">{item.detail}</p><p className="mt-1 text-[9px] text-stone-300">{item.time}</p></div><ChevronRight className="mt-2 h-3.5 w-3.5 text-stone-300" /></div>;
            })}
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Top services" subtitle="By bookings this month" action={<Link href="/admin/services" className="text-[11px] font-semibold text-blush-500">Manage services</Link>}>
          <div className="space-y-5">
            {topServices.map((service, index) => <div key={service.name}><div className="mb-2 flex items-center gap-3"><span className="grid h-7 w-7 place-items-center rounded-lg bg-stone-100 text-[10px] font-semibold text-stone-500">0{index + 1}</span><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold">{service.name}</p><p className="text-[10px] text-stone-400">{service.bookings} bookings</p></div><p className="text-xs font-semibold">{service.revenue}</p></div><ProgressBar value={service.percent} tone={index === 0 ? "blush" : "ink"} /></div>)}
          </div>
        </Panel>

        <Panel title="Team today" subtitle="Availability and utilization" action={<Link href="/admin/staff" className="text-[11px] font-semibold text-blush-500">Full roster</Link>}>
          <div className="grid gap-3 sm:grid-cols-2">
            {artists.map((artist, index) => <div key={artist.slug} className="rounded-xl border border-stone-100 bg-stone-50/60 p-3"><div className="flex items-center gap-3"><div className="relative"><Avatar name={artist.name} image={artist.image} /><span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" /></div><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold">{artist.name}</p><p className="mt-0.5 text-[10px] text-stone-400">{[7, 6, 8, 5][index]} appointments</p></div><span className="text-[10px] font-semibold text-stone-500">{[88, 76, 94, 68][index]}%</span></div><div className="mt-3"><ProgressBar value={[88, 76, 94, 68][index]} tone={index === 2 ? "blush" : "ink"} /></div></div>)}
          </div>
        </Panel>
      </div>
    </div>
  );
}
