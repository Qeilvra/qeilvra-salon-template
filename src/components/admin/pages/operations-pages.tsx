"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck2,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Download,
  Filter,
  Grid2X2,
  List,
  Mail,
  MoreHorizontal,
  Phone,
  Plus,
  Scissors,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  Tags,
  UserCheck,
  UserRound,
  UsersRound,
  WalletCards,
} from "lucide-react";
import { toast } from "sonner";
import { artists, services } from "@/lib/site-data";
import { formatCurrency } from "@/lib/utils";
import {
  AdminButton,
  AdminModal,
  Avatar,
  Field,
  IconButton,
  KpiCard,
  PageHeader,
  Panel,
  ProgressBar,
  SearchField,
  Segmented,
  SelectField,
  StatusChip,
  TableCell,
  TableHead,
  TableShell,
  TextAreaField,
  Toggle,
  type StatusTone,
} from "../admin-ui";

type AppointmentStatus = "Confirmed" | "Checked in" | "Completed" | "Pending" | "Cancelled";

type Appointment = {
  id: string;
  time: string;
  date: string;
  client: string;
  phone: string;
  service: string;
  artist: string;
  duration: string;
  amount: number;
  status: AppointmentStatus;
};

const appointments: Appointment[] = [
  { id: "ME-2418", time: "9:00 AM", date: "Aug 23", client: "Sofia Alvarez", phone: "(214) 555-0109", service: "Atelier Gel", artist: "Amara Cole", duration: "65 min", amount: 72, status: "Checked in" },
  { id: "ME-2419", time: "10:15 AM", date: "Aug 23", client: "Maya Thompson", phone: "(214) 555-0172", service: "Velvet Pedicure", artist: "Sophie Laurent", duration: "60 min", amount: 68, status: "Confirmed" },
  { id: "ME-2420", time: "11:30 AM", date: "Aug 23", client: "Claire Wilson", phone: "(469) 555-0144", service: "Sculpted Extensions", artist: "Mina Park", duration: "105 min", amount: 134, status: "Confirmed" },
  { id: "ME-2421", time: "1:00 PM", date: "Aug 23", client: "Layla Reed", phone: "(972) 555-0118", service: "Signature Manicure", artist: "Nia James", duration: "45 min", amount: 48, status: "Pending" },
  { id: "ME-2422", time: "2:30 PM", date: "Aug 23", client: "Isla Bennett", phone: "(214) 555-0131", service: "Editorial Nail Art", artist: "Mina Park", duration: "95 min", amount: 107, status: "Confirmed" },
  { id: "ME-2416", time: "4:15 PM", date: "Aug 22", client: "Emma Brooks", phone: "(214) 555-0165", service: "Atelier Gel", artist: "Amara Cole", duration: "65 min", amount: 72, status: "Completed" },
  { id: "ME-2414", time: "3:00 PM", date: "Aug 22", client: "Ava Martinez", phone: "(469) 555-0127", service: "Velvet Pedicure", artist: "Sophie Laurent", duration: "60 min", amount: 68, status: "Cancelled" },
];

const statusTone: Record<AppointmentStatus, StatusTone> = {
  Confirmed: "blue",
  "Checked in": "green",
  Completed: "slate",
  Pending: "amber",
  Cancelled: "rose",
};

const calendarDays = [
  { day: "Mon", date: "17", items: [{ start: 9.5, span: 1.1, name: "Sofia A.", service: "Atelier Gel", artist: "Amara", tone: "bg-blush-100 border-blush-200 text-blush-500" }, { start: 12.5, span: 1.5, name: "Nora W.", service: "Extensions", artist: "Mina", tone: "bg-violet-50 border-violet-200 text-violet-700" }] },
  { day: "Tue", date: "18", items: [{ start: 10, span: 1, name: "Maya T.", service: "Pedicure", artist: "Sophie", tone: "bg-amber-50 border-amber-200 text-amber-700" }, { start: 14, span: 1.1, name: "Emma B.", service: "Atelier Gel", artist: "Amara", tone: "bg-blush-100 border-blush-200 text-blush-500" }] },
  { day: "Wed", date: "19", items: [{ start: 9, span: 0.8, name: "Layla R.", service: "Manicure", artist: "Nia", tone: "bg-emerald-50 border-emerald-200 text-emerald-700" }, { start: 11, span: 1.7, name: "Claire W.", service: "Extensions", artist: "Mina", tone: "bg-violet-50 border-violet-200 text-violet-700" }, { start: 15, span: 1, name: "Ava M.", service: "Pedicure", artist: "Sophie", tone: "bg-amber-50 border-amber-200 text-amber-700" }] },
  { day: "Thu", date: "20", items: [{ start: 10.5, span: 1.2, name: "Isla B.", service: "Nail Art", artist: "Mina", tone: "bg-sky-50 border-sky-200 text-sky-700" }, { start: 13.5, span: 1, name: "Priya S.", service: "Atelier Gel", artist: "Amara", tone: "bg-blush-100 border-blush-200 text-blush-500" }] },
  { day: "Fri", date: "21", items: [{ start: 9, span: 1, name: "Elena M.", service: "Atelier Gel", artist: "Amara", tone: "bg-blush-100 border-blush-200 text-blush-500" }, { start: 11.5, span: 1, name: "Camille R.", service: "Pedicure", artist: "Sophie", tone: "bg-amber-50 border-amber-200 text-amber-700" }, { start: 14.5, span: 1.3, name: "Leah K.", service: "Nail Art", artist: "Nia", tone: "bg-sky-50 border-sky-200 text-sky-700" }] },
  { day: "Sat", date: "22", items: [{ start: 9.5, span: 1.6, name: "Olivia C.", service: "Extensions", artist: "Mina", tone: "bg-violet-50 border-violet-200 text-violet-700" }, { start: 12, span: 1, name: "Zoe P.", service: "Manicure", artist: "Nia", tone: "bg-emerald-50 border-emerald-200 text-emerald-700" }, { start: 15.5, span: 1, name: "Mia L.", service: "Atelier Gel", artist: "Amara", tone: "bg-blush-100 border-blush-200 text-blush-500" }] },
];

export function AppointmentsPage() {
  const [view, setView] = useState("calendar");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [records, setRecords] = useState(appointments);

  useEffect(() => {
    if (window.matchMedia("(max-width: 767px)").matches) setView("list");
  }, []);

  const filtered = records.filter((item) => {
    const matchSearch = `${item.client} ${item.service} ${item.artist} ${item.id}`.toLowerCase().includes(query.toLowerCase());
    return matchSearch && (status === "All" || item.status === status);
  });

  const createAppointment = () => {
    setRecords((current) => [{ id: `ME-${2420 + current.length}`, time: "3:30 PM", date: "Aug 24", client: "New guest", phone: "(214) 555-0198", service: "Signature Manicure", artist: "First available", duration: "45 min", amount: 48, status: "Pending" }, ...current]);
    setModalOpen(false);
    toast.success("Appointment created", { description: "A confirmation is ready to send to the client." });
  };

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Operations" title="Appointments" description="Run the salon day, manage bookings and spot availability at a glance." actions={<><AdminButton variant="secondary" onClick={() => toast.success("Schedule exported") }><Download className="h-4 w-4" />Export</AdminButton><AdminButton onClick={() => setModalOpen(true)}><Plus className="h-4 w-4" />New appointment</AdminButton></>} />
    <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <KpiCard label="Today’s bookings" value="32" change="86%" note="capacity" icon={CalendarCheck2} tone="ink" />
        <KpiCard label="Confirmed" value="27" change="84%" note="of bookings" icon={Check} tone="blush" />
        <KpiCard label="Pending" value="3" change="Needs action" trend="neutral" icon={Clock3} tone="gold" />
        <KpiCard label="Open slots" value="5" change="Next at 3:45" trend="neutral" icon={CalendarDays} tone="cream" />
      </div>

      <Panel bodyClassName="p-0">
        <div className="flex flex-col gap-3 border-b border-stone-100 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1"><IconButton label="Previous week"><ArrowLeft className="h-4 w-4" /></IconButton><IconButton label="Next week"><ArrowRight className="h-4 w-4" /></IconButton></div>
            <button className="h-9 min-h-11 rounded-xl border border-stone-200 bg-white px-3 text-xs font-semibold md:min-h-0">Aug 17 – 23, 2026 <ChevronDown className="ml-1 inline h-3.5 w-3.5" /></button>
            <AdminButton variant="ghost" className="h-9 px-3">Today</AdminButton>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {view === "list" ? <SearchField value={query} onChange={setQuery} placeholder="Search appointments" className="w-full sm:w-56" /> : null}
            <Segmented options={[{ label: "Calendar", value: "calendar", icon: Grid2X2 }, { label: "List", value: "list", icon: List }]} value={view} onChange={setView} />
          </div>
        </div>
        {view === "calendar" ? <CalendarView /> : (
          <div className="p-5">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {(["All", "Confirmed", "Checked in", "Pending", "Completed", "Cancelled"] as const).map((item) => <button key={item} onClick={() => setStatus(item)} className={`min-h-11 rounded-full px-3 py-1.5 text-[10px] font-semibold md:min-h-0 ${status === item ? "bg-ink text-white" : "border border-stone-200 bg-white text-stone-500"}`}>{item}</button>)}
            </div>
            <div className="space-y-3 md:hidden">{filtered.map((item) => <article key={`mobile-${item.id}`} className="rounded-2xl border border-stone-200 bg-white p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate text-sm font-semibold text-ink">{item.client}</p><p className="mt-1 text-[10px] text-stone-400">{item.id} · {item.phone}</p></div><StatusChip label={item.status} tone={statusTone[item.status]} /></div><div className="mt-4 rounded-xl bg-stone-50 p-3"><p className="font-display text-lg text-ink">{item.service}</p><p className="mt-1 text-[10px] text-stone-500">{item.date} · {item.time} · {item.duration}</p><p className="mt-1 text-[10px] text-stone-500">with {item.artist}</p></div><div className="mt-3 flex items-center justify-between"><span className="text-sm font-semibold">{formatCurrency(item.amount)}</span><div className="flex gap-2"><AdminButton variant="secondary" className="px-3">View</AdminButton><IconButton label="Appointment actions"><MoreHorizontal className="h-4 w-4" /></IconButton></div></div></article>)}</div>
            <div className="hidden md:block"><TableShell><thead><tr><TableHead>Appointment</TableHead><TableHead>Client</TableHead><TableHead>Service</TableHead><TableHead>Artist</TableHead><TableHead>Payment</TableHead><TableHead>Status</TableHead><TableHead></TableHead></tr></thead><tbody>
              {filtered.map((item) => <tr key={item.id} className="group hover:bg-stone-50/60"><TableCell><p className="font-semibold text-ink">{item.date} · {item.time}</p><p className="mt-1 text-[10px] text-stone-400">{item.id}</p></TableCell><TableCell><div className="flex items-center gap-2.5"><Avatar name={item.client} size="sm" /><div><p className="font-semibold text-ink">{item.client}</p><p className="mt-0.5 text-[10px] text-stone-400">{item.phone}</p></div></div></TableCell><TableCell><p className="font-medium text-ink">{item.service}</p><p className="mt-0.5 text-[10px] text-stone-400">{item.duration}</p></TableCell><TableCell>{item.artist}</TableCell><TableCell><p className="font-semibold text-ink">{formatCurrency(item.amount)}</p><span className="text-[10px] text-emerald-600">Deposit paid</span></TableCell><TableCell><StatusChip label={item.status} tone={statusTone[item.status]} /></TableCell><TableCell><IconButton label="Appointment actions"><MoreHorizontal className="h-4 w-4" /></IconButton></TableCell></tr>)}
            </tbody></TableShell></div>
          </div>
        )}
      </Panel>

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title="New appointment" description="Create a salon booking on the client’s behalf" footer={<><AdminButton variant="secondary" onClick={() => setModalOpen(false)}>Cancel</AdminButton><AdminButton onClick={createAppointment}>Create appointment</AdminButton></>}>
        <div className="grid gap-4 sm:grid-cols-2"><Field label="Client name" placeholder="Search or add client" /><Field label="Phone number" placeholder="(214) 555-0000" /><SelectField label="Service" value="Signature Manicure" onChange={() => undefined}>{services.map((service) => <option key={service.slug}>{service.name}</option>)}</SelectField><SelectField label="Technician" value="First available" onChange={() => undefined}><option>First available</option>{artists.map((artist) => <option key={artist.slug}>{artist.name}</option>)}</SelectField><Field label="Date" type="date" defaultValue="2026-08-24" /><Field label="Start time" type="time" defaultValue="15:30" /><div className="sm:col-span-2"><TextAreaField label="Booking notes" placeholder="Preferences, allergies or occasion details..." /></div></div>
      </AdminModal>
    </div>
  );
}

function CalendarView() {
  const startHour = 9;
  const endHour = 18;
  const hourHeight = 78;
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[980px]">
        <div className="grid grid-cols-[66px_repeat(6,1fr)] border-b border-stone-100">
          <div className="border-r border-stone-100 p-3 text-center text-[9px] uppercase tracking-wider text-stone-400">CDT</div>
          {calendarDays.map((day, index) => <div key={day.day} className={`border-r border-stone-100 p-3 text-center last:border-r-0 ${index === 5 ? "bg-blush-50" : ""}`}><p className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">{day.day}</p><p className={`mx-auto mt-1 grid h-7 w-7 place-items-center rounded-full text-xs font-semibold ${index === 5 ? "bg-ink text-white" : "text-ink"}`}>{day.date}</p></div>)}
        </div>
        <div className="grid grid-cols-[66px_repeat(6,1fr)]">
          <div className="border-r border-stone-100">
            {Array.from({ length: endHour - startHour + 1 }, (_, index) => <div key={index} className="relative border-b border-stone-100 px-2 text-right text-[9px] text-stone-400" style={{ height: hourHeight }}><span className="relative -top-1.5">{index + startHour > 12 ? index + startHour - 12 : index + startHour}:00 {index + startHour >= 12 ? "PM" : "AM"}</span></div>)}
          </div>
          {calendarDays.map((day, dayIndex) => <div key={day.day} className={`relative border-r border-stone-100 last:border-r-0 ${dayIndex === 5 ? "bg-blush-50/40" : ""}`} style={{ height: (endHour - startHour + 1) * hourHeight }}>
            {Array.from({ length: endHour - startHour + 1 }, (_, index) => <div key={index} className="border-b border-stone-100" style={{ height: hourHeight }} />)}
            {day.items.map((item) => <button key={`${item.start}-${item.name}`} className={`absolute left-1.5 right-1.5 overflow-hidden rounded-lg border p-2 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${item.tone}`} style={{ top: (item.start - startHour) * hourHeight + 4, height: Math.max(48, item.span * hourHeight - 7) }}><p className="truncate text-[10px] font-bold">{item.name}</p><p className="mt-1 truncate text-[9px] opacity-80">{item.service}</p><p className="mt-1 truncate text-[8px] opacity-60">with {item.artist}</p></button>)}
          </div>)}
        </div>
      </div>
    </div>
  );
}

export function ServicesPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All categories");
  const [modalOpen, setModalOpen] = useState(false);
  const [inactive, setInactive] = useState<string[]>(["bridal-preview"]);
  const categories = ["All categories", ...Array.from(new Set(services.map((service) => service.category)))];
  const filtered = services.filter((service) => (category === "All categories" || service.category === category) && `${service.name} ${service.category}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="space-y-6">
    <PageHeader eyebrow="Service menu" title="Services" description="Curate treatments, pricing, durations and online-booking visibility." actions={<><AdminButton variant="secondary"><SlidersHorizontal className="h-4 w-4" />Reorder menu</AdminButton><AdminButton onClick={() => setModalOpen(true)}><Plus className="h-4 w-4" />Add service</AdminButton></>} />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><KpiCard label="Active services" value="24" change="3 categories" trend="neutral" icon={Sparkles} tone="blush" /><KpiCard label="Avg. service price" value="$74" change="3.8%" note="this quarter" icon={WalletCards} tone="gold" /><KpiCard label="Most booked" value="Atelier Gel" change="86 bookings" trend="neutral" icon={Star} tone="ink" /><KpiCard label="Menu utilization" value="91%" change="Healthy" trend="neutral" icon={Scissors} tone="cream" /></div>
    <Panel title="Service menu" subtitle={`${filtered.length} treatments shown`} bodyClassName="pt-4">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row"><SearchField value={query} onChange={setQuery} placeholder="Search services" className="flex-1" /><SelectField value={category} onChange={setCategory} className="sm:w-48">{categories.map((item) => <option key={item}>{item}</option>)}</SelectField><AdminButton variant="secondary"><Filter className="h-3.5 w-3.5" />More filters</AdminButton></div>
      <TableShell><thead><tr><TableHead>Service</TableHead><TableHead>Category</TableHead><TableHead>Duration</TableHead><TableHead>Price</TableHead><TableHead>Bookings</TableHead><TableHead>Online</TableHead><TableHead></TableHead></tr></thead><tbody>{filtered.map((service, index) => { const enabled = !inactive.includes(service.slug); return <tr key={service.slug} className="hover:bg-stone-50/60"><TableCell><div className="flex items-center gap-3"><div className="h-11 w-12 overflow-hidden rounded-xl bg-cream"><img src={service.image} alt="" className="h-full w-full object-cover" /></div><div className="max-md:min-w-0"><p className="font-semibold text-ink">{service.name}</p><p className="mt-0.5 max-w-[180px] truncate text-[10px] text-stone-400 md:max-w-[280px]">{service.description}</p></div></div></TableCell><TableCell><StatusChip label={service.category} dot={false} tone="slate" /></TableCell><TableCell>{service.duration} min</TableCell><TableCell><span className="font-semibold text-ink">{formatCurrency(service.price)}</span></TableCell><TableCell><p className="font-semibold text-ink">{[86, 71, 64, 38, 42, 29, 11, 25][index]}</p><p className="mt-0.5 text-[10px] text-stone-400">this month</p></TableCell><TableCell><Toggle checked={enabled} onChange={(checked) => setInactive((items) => checked ? items.filter((slug) => slug !== service.slug) : [...items, service.slug])} /></TableCell><TableCell><IconButton label="Service actions" onClick={() => toast(`Editing ${service.name}`)}><MoreHorizontal className="h-4 w-4" /></IconButton></TableCell></tr>; })}</tbody></TableShell>
    </Panel>
    <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title="Create a service" description="Add a treatment to your salon menu" footer={<><AdminButton variant="secondary" onClick={() => setModalOpen(false)}>Cancel</AdminButton><AdminButton onClick={() => { setModalOpen(false); toast.success("Service saved as draft"); }}>Save service</AdminButton></>}><div className="space-y-4"><Field label="Service name" placeholder="e.g. Rose Quartz Manicure" /><div className="grid gap-4 sm:grid-cols-3"><SelectField label="Category" value="Manicure" onChange={() => undefined}>{categories.slice(1).map((item) => <option key={item}>{item}</option>)}</SelectField><Field label="Duration (min)" type="number" defaultValue="45" /><Field label="Price ($)" type="number" defaultValue="55" /></div><TextAreaField label="Description" placeholder="Describe the experience and result..." /><Toggle checked={true} onChange={() => undefined} label="Available for online booking" description="Clients can select this service in the booking flow." /></div></AdminModal>
  </div>;
}

const categoryData = [
  { name: "Manicure", services: 5, bookings: 126, revenue: "$8,460", color: "from-rose-100 to-blush-50", icon: Sparkles },
  { name: "Pedicure", services: 4, bookings: 92, revenue: "$6,920", color: "from-amber-100 to-amber-50", icon: Scissors },
  { name: "Gel & Extensions", services: 6, bookings: 143, revenue: "$14,280", color: "from-violet-100 to-violet-50", icon: Star },
  { name: "Nail Art", services: 4, bookings: 74, revenue: "$4,180", color: "from-sky-100 to-sky-50", icon: Sparkles },
  { name: "Spa Rituals", services: 3, bookings: 51, revenue: "$3,120", color: "from-emerald-100 to-emerald-50", icon: Scissors },
  { name: "Occasion", services: 2, bookings: 18, revenue: "$2,760", color: "from-stone-200 to-stone-50", icon: UsersRound },
];

export function CategoriesPage() {
  const [categories, setCategories] = useState(categoryData);
  const [modalOpen, setModalOpen] = useState(false);
  return <div className="space-y-6"><PageHeader eyebrow="Service menu" title="Categories" description="Organize your treatment menu into clear, bookable collections." actions={<AdminButton onClick={() => setModalOpen(true)}><Plus className="h-4 w-4" />New category</AdminButton>} />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{categories.map((category, index) => { const Icon = category.icon; return <article key={category.name} className="group rounded-2xl border border-stone-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(42,32,26,.035)]"><div className="flex items-start justify-between"><span className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${category.color} text-stone-700`}><Icon className="h-5 w-5" /></span><IconButton label="Category options"><MoreHorizontal className="h-4 w-4" /></IconButton></div><h2 className="mt-5 font-display text-2xl">{category.name}</h2><p className="mt-1 text-xs text-stone-400">{category.services} active services</p><div className="mt-5 grid grid-cols-2 border-t border-stone-100 pt-4"><div><p className="text-[10px] text-stone-400">Bookings</p><p className="mt-1 text-sm font-semibold">{category.bookings}</p></div><div><p className="text-[10px] text-stone-400">Revenue</p><p className="mt-1 text-sm font-semibold">{category.revenue}</p></div></div><button onClick={() => toast(`Opening ${category.name} services`)} className="mt-4 flex w-full items-center justify-between rounded-xl bg-stone-50 px-3 py-2.5 text-[11px] font-semibold text-stone-600 hover:bg-ink hover:text-white">Manage category <ArrowRight className="h-3.5 w-3.5" /></button></article>; })}</div>
    <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title="New service category" footer={<><AdminButton variant="secondary" onClick={() => setModalOpen(false)}>Cancel</AdminButton><AdminButton onClick={() => { setCategories([...categories, { name: "New Collection", services: 0, bookings: 0, revenue: "$0", color: "from-blush-100 to-white", icon: Tags }]); setModalOpen(false); toast.success("Category created"); }}>Create category</AdminButton></>}><div className="space-y-4"><Field label="Category name" placeholder="e.g. Seasonal Rituals" /><TextAreaField label="Description" placeholder="A short client-facing category description" /><Field label="Display order" type="number" defaultValue={categories.length + 1} /></div></AdminModal>
  </div>;
}

export function StaffPage() {
  const [active, setActive] = useState<Record<string, boolean>>(Object.fromEntries(artists.map((artist) => [artist.slug, true])));
  const [modalOpen, setModalOpen] = useState(false);
  return <div className="space-y-6"><PageHeader eyebrow="People" title="Team & availability" description="Manage artists, working hours, services and booking capacity." actions={<><AdminButton variant="secondary"><CalendarDays className="h-4 w-4" />Time off</AdminButton><AdminButton onClick={() => setModalOpen(true)}><Plus className="h-4 w-4" />Add team member</AdminButton></>} />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><KpiCard label="Active artists" value="4" change="All scheduled" trend="neutral" icon={UserCheck} tone="ink" /><KpiCard label="Team utilization" value="82%" change="6.4%" note="this month" icon={UsersRound} tone="blush" /><KpiCard label="Average rating" value="4.96" change="286 reviews" trend="neutral" icon={Star} tone="gold" /><KpiCard label="Open hours" value="164h" change="This week" trend="neutral" icon={Clock3} tone="cream" /></div>
    <div className="grid gap-5 xl:grid-cols-2">{artists.map((artist, index) => <Panel key={artist.slug} bodyClassName="p-5"><div className="flex items-start gap-4"><div className="relative"><Avatar name={artist.name} image={artist.image} size="lg" /><span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" /></div><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><div><h2 className="text-sm font-semibold">{artist.name}</h2><p className="mt-1 text-[10px] text-stone-400">{artist.role}</p></div><IconButton label="Team member actions"><MoreHorizontal className="h-4 w-4" /></IconButton></div><div className="mt-2 flex flex-wrap gap-1.5">{artist.specialties.map((specialty) => <StatusChip key={specialty} label={specialty} dot={false} tone="slate" />)}</div></div></div><div className="mt-5 grid grid-cols-3 divide-x divide-stone-100 rounded-xl bg-stone-50 py-3 text-center"><div><p className="text-sm font-semibold">{[34, 29, 32, 24][index]}</p><p className="mt-0.5 text-[9px] text-stone-400">Bookings</p></div><div><p className="text-sm font-semibold">{[88, 76, 94, 68][index]}%</p><p className="mt-0.5 text-[9px] text-stone-400">Utilization</p></div><div><p className="text-sm font-semibold">{artist.rating}</p><p className="mt-0.5 text-[9px] text-stone-400">Rating</p></div></div><div className="mt-5"><div className="mb-2 flex justify-between text-[10px]"><span className="font-semibold text-stone-600">This week</span><span className="text-stone-400">{[36, 32, 38, 28][index]} / 40 hours</span></div><ProgressBar value={[90, 80, 95, 70][index]} tone={index === 2 ? "blush" : "ink"} /></div><div className="mt-4 flex flex-col items-stretch gap-3 border-t border-stone-100 pt-4 md:flex-row md:items-center md:justify-between md:gap-0"><div className="grid grid-cols-7 gap-1 md:flex">{["M", "T", "W", "T", "F", "S", "S"].map((day, dayIndex) => <span key={`${day}-${dayIndex}`} className={`grid h-8 w-full place-items-center rounded-lg text-[9px] font-semibold md:h-7 md:w-7 ${dayIndex < 6 && !(index === 2 && dayIndex === 1) ? "bg-blush-100 text-blush-500" : "bg-stone-100 text-stone-300"}`}>{day}</span>)}</div><div className="flex min-h-11 items-center justify-between md:block md:min-h-0"><span className="text-[11px] font-semibold text-stone-500 md:hidden">Accepting online bookings</span><Toggle checked={active[artist.slug]} onChange={(checked) => setActive((value) => ({ ...value, [artist.slug]: checked }))} /></div></div></Panel>)}</div>
    <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title="Add team member" description="Invite a technician to Maison Élan" footer={<><AdminButton variant="secondary" onClick={() => setModalOpen(false)}>Cancel</AdminButton><AdminButton onClick={() => { setModalOpen(false); toast.success("Invitation sent"); }}>Send invitation</AdminButton></>}><div className="grid gap-4 sm:grid-cols-2"><Field label="First name" placeholder="First name" /><Field label="Last name" placeholder="Last name" /><div className="sm:col-span-2"><Field label="Email address" type="email" placeholder="artist@example.com" /></div><SelectField label="Role" value="Nail artist" onChange={() => undefined}><option>Nail artist</option><option>Senior nail artist</option><option>Wellness specialist</option><option>Reception</option></SelectField><Field label="Weekly hours" type="number" defaultValue="40" /></div></AdminModal>
  </div>;
}

type Customer = { name: string; email: string; phone: string; visits: number; lastVisit: string; spend: number; points: number; segment: "VIP" | "Member" | "Regular" | "New" };
const customers: Customer[] = [
  { name: "Sofia Alvarez", email: "sofia.a@example.com", phone: "(214) 555-0109", visits: 18, lastVisit: "Today", spend: 1640, points: 820, segment: "VIP" },
  { name: "Maya Thompson", email: "maya.t@example.com", phone: "(214) 555-0172", visits: 11, lastVisit: "Today", spend: 948, points: 474, segment: "Member" },
  { name: "Claire Wilson", email: "claire@example.com", phone: "(469) 555-0144", visits: 7, lastVisit: "Today", spend: 814, points: 407, segment: "Regular" },
  { name: "Layla Reed", email: "layla.r@example.com", phone: "(972) 555-0118", visits: 4, lastVisit: "Aug 16", spend: 326, points: 163, segment: "Regular" },
  { name: "Isla Bennett", email: "isla.b@example.com", phone: "(214) 555-0131", visits: 1, lastVisit: "Aug 14", spend: 107, points: 54, segment: "New" },
  { name: "Emma Brooks", email: "emma.b@example.com", phone: "(214) 555-0165", visits: 14, lastVisit: "Aug 12", spend: 1288, points: 644, segment: "VIP" },
  { name: "Ava Martinez", email: "ava.m@example.com", phone: "(469) 555-0127", visits: 9, lastVisit: "Aug 8", spend: 692, points: 346, segment: "Member" },
];
const segmentTone: Record<Customer["segment"], StatusTone> = { VIP: "violet", Member: "rose", Regular: "slate", New: "green" };

export function CustomersPage() {
  const [query, setQuery] = useState(""); const [segment, setSegment] = useState("All clients"); const [modalOpen, setModalOpen] = useState(false);
  const filtered = customers.filter((customer) => `${customer.name} ${customer.email} ${customer.phone}`.toLowerCase().includes(query.toLowerCase()) && (segment === "All clients" || customer.segment === segment));
  return <div className="space-y-6"><PageHeader eyebrow="Clienteling" title="Customers" description="Know your guests, their preferences, loyalty and complete salon history." actions={<><AdminButton variant="secondary" onClick={() => toast.success("Customer list exported")}><Download className="h-4 w-4" />Export</AdminButton><AdminButton onClick={() => setModalOpen(true)}><Plus className="h-4 w-4" />Add customer</AdminButton></>} />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><KpiCard label="Total customers" value="1,284" change="8.2%" note="this quarter" icon={UsersRound} tone="ink" /><KpiCard label="New this month" value="86" change="14.5%" note="vs. July" icon={UserRound} tone="blush" /><KpiCard label="Repeat rate" value="74%" change="3.1%" note="last 90 days" icon={UserCheck} tone="gold" /><KpiCard label="Client value" value="$684" change="Avg. lifetime" trend="neutral" icon={WalletCards} tone="cream" /></div>
    <Panel title="Client directory" subtitle={`${filtered.length} of 1,284 clients`}><div className="mb-4 flex flex-col gap-3 sm:flex-row"><SearchField value={query} onChange={setQuery} placeholder="Search name, email or phone" className="flex-1" /><SelectField value={segment} onChange={setSegment} className="sm:w-44">{["All clients", "VIP", "Member", "Regular", "New"].map((item) => <option key={item}>{item}</option>)}</SelectField><AdminButton variant="secondary"><Filter className="h-4 w-4" />Filters</AdminButton></div>
      <TableShell><thead><tr><TableHead>Customer</TableHead><TableHead>Segment</TableHead><TableHead>Visits</TableHead><TableHead>Last visit</TableHead><TableHead>Total spend</TableHead><TableHead>Loyalty</TableHead><TableHead></TableHead></tr></thead><tbody>{filtered.map((customer) => <tr key={customer.email} className="hover:bg-stone-50/60"><TableCell><div className="flex items-center gap-3"><Avatar name={customer.name} /><div><p className="font-semibold text-ink">{customer.name}</p><p className="mt-1 text-[10px] text-stone-400">{customer.email}</p><p className="mt-0.5 text-[10px] text-stone-400">{customer.phone}</p></div></div></TableCell><TableCell><StatusChip label={customer.segment} tone={segmentTone[customer.segment]} /></TableCell><TableCell><span className="font-semibold text-ink">{customer.visits}</span></TableCell><TableCell>{customer.lastVisit}</TableCell><TableCell><span className="font-semibold text-ink">{formatCurrency(customer.spend)}</span></TableCell><TableCell><p className="font-semibold text-ink">{customer.points}</p><p className="mt-0.5 text-[10px] text-stone-400">points</p></TableCell><TableCell><div className="flex gap-1"><IconButton label="Email customer"><Mail className="h-3.5 w-3.5" /></IconButton><IconButton label="Call customer"><Phone className="h-3.5 w-3.5" /></IconButton><IconButton label="Customer actions"><MoreHorizontal className="h-4 w-4" /></IconButton></div></TableCell></tr>)}</tbody></TableShell>
    </Panel>
    <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title="Add customer" footer={<><AdminButton variant="secondary" onClick={() => setModalOpen(false)}>Cancel</AdminButton><AdminButton onClick={() => { setModalOpen(false); toast.success("Customer profile created"); }}>Create customer</AdminButton></>}><div className="grid gap-4 sm:grid-cols-2"><Field label="First name" /><Field label="Last name" /><div className="sm:col-span-2"><Field label="Email" type="email" /></div><Field label="Phone" type="tel" /><SelectField label="Client segment" value="Regular" onChange={() => undefined}><option>Regular</option><option>VIP</option><option>Member</option></SelectField><div className="sm:col-span-2"><TextAreaField label="Client notes" placeholder="Preferences, allergies, nail history..." /></div></div></AdminModal>
  </div>;
}
