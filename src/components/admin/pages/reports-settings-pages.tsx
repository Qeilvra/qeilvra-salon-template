"use client";

import { useState } from "react";
import {
  AreaChart as AreaChartIcon,
  Bell,
  Building2,
  CalendarClock,
  Check,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  CreditCard,
  Download,
  ExternalLink,
  Globe2,
  KeyRound,
  Link2,
  LockKeyhole,
  Mail,
  MapPin,
  MessageSquareText,
  Percent,
  ReceiptText,
  Save,
  Settings2,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  TrendingUp,
  UserCheck,
  UsersRound,
  WalletCards,
  Webhook,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { artists, siteFacts } from "@/lib/site-data";
import { cn } from "@/lib/utils";
import {
  AdminButton,
  Avatar,
  Field,
  KpiCard,
  PageHeader,
  Panel,
  ProgressBar,
  SelectField,
  StatusChip,
  TableCell,
  TableHead,
  TableShell,
  TextAreaField,
  Toggle,
} from "../admin-ui";

const monthlyRevenue = [
  { month: "Mar", services: 70400, retail: 9300, memberships: 15800 },
  { month: "Apr", services: 75800, retail: 10100, memberships: 16900 },
  { month: "May", services: 81200, retail: 11200, memberships: 18000 },
  { month: "Jun", services: 79400, retail: 10800, memberships: 19200 },
  { month: "Jul", services: 87600, retail: 12100, memberships: 20400 },
  { month: "Aug", services: 94820, retail: 12480, memberships: 21840 },
];

const bookingsTrend = [
  { week: "W1", bookings: 118, newClients: 24 },
  { week: "W2", bookings: 132, newClients: 28 },
  { week: "W3", bookings: 127, newClients: 22 },
  { week: "W4", bookings: 146, newClients: 31 },
  { week: "W5", bookings: 154, newClients: 34 },
  { week: "W6", bookings: 168, newClients: 38 },
  { week: "W7", bookings: 176, newClients: 41 },
  { week: "W8", bookings: 184, newClients: 44 },
];

const revenueMix = [
  { name: "Services", value: 94820, color: "#c97c7a" },
  { name: "Memberships", value: 21840, color: "#171411" },
  { name: "Retail", value: 12480, color: "#b88a4a" },
  { name: "Gift cards", value: 6925, color: "#eebdb8" },
];

const servicePerformance = [
  { service: "Atelier Gel", bookings: 286, revenue: "$20,592", avg: "$72", growth: "+18.4%", capacity: 92 },
  { service: "Velvet Pedicure", bookings: 224, revenue: "$15,232", avg: "$68", growth: "+12.1%", capacity: 84 },
  { service: "Signature Manicure", bookings: 196, revenue: "$9,408", avg: "$48", growth: "+8.8%", capacity: 76 },
  { service: "Sculpted Extensions", bookings: 112, revenue: "$13,216", avg: "$118", growth: "+22.6%", capacity: 68 },
  { service: "Editorial Nail Art", bookings: 104, revenue: "$6,968", avg: "$67", growth: "+16.2%", capacity: 61 },
];

export function ReportsPage() {
  const [period, setPeriod] = useState("Last 6 months");
  return <div className="space-y-6">
    <PageHeader eyebrow="Intelligence" title="Reports & analytics" description="Understand revenue, demand, retention and the work that moves Maison Élan forward." actions={<><SelectField value={period} onChange={setPeriod} className="w-40"><option>Last 30 days</option><option>Last 6 months</option><option>This year</option></SelectField><AdminButton onClick={() => toast.success("Analytics report exported", { description: `${period} · PDF and CSV prepared.` })}><Download className="h-4 w-4" />Export report</AdminButton></>} />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><KpiCard label="Gross revenue" value="$136.1k" change="15.8%" note="vs. prior period" icon={CircleDollarSign} tone="ink" /><KpiCard label="Appointments" value="1,126" change="12.4%" note="vs. prior period" icon={CalendarClock} tone="blush" /><KpiCard label="Net client growth" value="+184" change="22.1%" note="vs. prior period" icon={UsersRound} tone="gold" /><KpiCard label="Retention rate" value="74.2%" change="3.6%" note="vs. prior period" icon={UserCheck} tone="cream" /></div>
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,.75fr)]">
      <Panel title="Revenue by stream" subtitle="March – August 2026" action={<div className="hidden items-center gap-3 text-[9px] text-stone-500 sm:flex"><span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-blush-500" />Services</span><span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-ink" />Memberships</span><span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-gold" />Retail</span></div>}>
        <div className="h-[300px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={monthlyRevenue} margin={{ top: 10, right: 5, left: -14, bottom: 0 }} barGap={2}><CartesianGrid vertical={false} stroke="#eee9e4" strokeDasharray="3 4" /><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#a8a29e" }} dy={10} /><YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#a8a29e" }} tickFormatter={(value) => `$${value / 1000}k`} /><Tooltip cursor={{ fill: "#faf7f4" }} contentStyle={{ border: "1px solid #eee9e4", borderRadius: 12, boxShadow: "0 12px 28px rgba(30,20,15,.09)", fontSize: 11 }} formatter={(value) => `$${Number(value).toLocaleString()}`} /><Bar dataKey="services" stackId="revenue" fill="#c97c7a" radius={[0, 0, 0, 0]} /><Bar dataKey="memberships" stackId="revenue" fill="#171411" /><Bar dataKey="retail" stackId="revenue" fill="#b88a4a" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer></div>
      </Panel>
      <Panel title="Revenue mix" subtitle="$136,065 in August">
        <div className="relative mx-auto h-[210px] max-w-[260px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={revenueMix} dataKey="value" nameKey="name" innerRadius={62} outerRadius={88} paddingAngle={3} stroke="none">{revenueMix.map((item) => <Cell key={item.name} fill={item.color} />)}</Pie><Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} contentStyle={{ border: "1px solid #eee9e4", borderRadius: 12, fontSize: 11 }} /></PieChart></ResponsiveContainer><div className="pointer-events-none absolute inset-0 grid place-items-center text-center"><div><p className="text-[9px] uppercase tracking-wider text-stone-400">Total</p><p className="mt-1 text-xl font-semibold">$136k</p></div></div></div>
        <div className="grid grid-cols-2 gap-3">{revenueMix.map((item) => <div key={item.name} className="rounded-xl bg-stone-50 p-3"><div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} /><span className="text-[9px] text-stone-400">{item.name}</span></div><p className="mt-1.5 text-xs font-semibold">${(item.value / 1000).toFixed(1)}k</p></div>)}</div>
      </Panel>
    </div>
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,.9fr)]">
      <Panel title="Booking demand" subtitle="Eight-week trend"><div className="h-[250px]"><ResponsiveContainer width="100%" height="100%"><AreaChart data={bookingsTrend} margin={{ top: 10, right: 5, left: -28, bottom: 0 }}><defs><linearGradient id="bookingsFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#171411" stopOpacity={0.18} /><stop offset="100%" stopColor="#171411" stopOpacity={0} /></linearGradient></defs><CartesianGrid vertical={false} stroke="#eee9e4" strokeDasharray="3 4" /><XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#a8a29e" }} dy={10} /><YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#a8a29e" }} /><Tooltip contentStyle={{ border: "1px solid #eee9e4", borderRadius: 12, fontSize: 11 }} /><Area type="monotone" dataKey="bookings" stroke="#171411" strokeWidth={2.3} fill="url(#bookingsFill)" /><Area type="monotone" dataKey="newClients" stroke="#c97c7a" strokeWidth={2} fill="transparent" /></AreaChart></ResponsiveContainer></div><div className="mt-4 flex gap-6 border-t border-stone-100 pt-4 text-[10px]"><span className="flex items-center gap-2 text-stone-500"><i className="h-0.5 w-5 bg-ink" />All bookings</span><span className="flex items-center gap-2 text-stone-500"><i className="h-0.5 w-5 bg-blush-500" />New-client bookings</span></div></Panel>
      <Panel title="Performance signals" subtitle="Compared with prior period"><div className="space-y-5">{[
        { label: "Average ticket", value: "$121", change: "+4.8%", icon: ReceiptText, tone: "bg-blush-100 text-blush-500" },
        { label: "Rebooking rate", value: "72%", change: "+3.2%", icon: CalendarClock, tone: "bg-violet-50 text-violet-600" },
        { label: "Retail attachment", value: "18.6%", change: "+1.8%", icon: WalletCards, tone: "bg-amber-50 text-amber-600" },
        { label: "No-show rate", value: "2.8%", change: "-0.6%", icon: Clock3, tone: "bg-emerald-50 text-emerald-600" },
      ].map((signal) => { const Icon = signal.icon; return <div key={signal.label} className="flex items-center gap-3"><span className={`grid h-10 w-10 place-items-center rounded-xl ${signal.tone}`}><Icon className="h-4 w-4" /></span><div className="flex-1"><p className="text-[10px] text-stone-400">{signal.label}</p><p className="mt-0.5 text-sm font-semibold">{signal.value}</p></div><StatusChip label={signal.change} tone="green" dot={false} /></div>; })}</div></Panel>
    </div>
    <Panel title="Service performance" subtitle="Bookings, revenue and capacity utilization"><TableShell><thead><tr><TableHead>Service</TableHead><TableHead>Bookings</TableHead><TableHead>Revenue</TableHead><TableHead>Avg. ticket</TableHead><TableHead>Growth</TableHead><TableHead>Capacity</TableHead></tr></thead><tbody>{servicePerformance.map((service) => <tr key={service.service}><TableCell><span className="font-semibold text-ink">{service.service}</span></TableCell><TableCell>{service.bookings}</TableCell><TableCell><span className="font-semibold text-ink">{service.revenue}</span></TableCell><TableCell>{service.avg}</TableCell><TableCell><span className="font-semibold text-emerald-600">{service.growth}</span></TableCell><TableCell><div className="flex items-center gap-3"><div className="w-24"><ProgressBar value={service.capacity} tone={service.capacity > 85 ? "blush" : "ink"} /></div><span className="text-[10px] font-semibold">{service.capacity}%</span></div></TableCell></tr>)}</tbody></TableShell></Panel>
    <Panel title="Team performance" subtitle="August 2026"><div className="grid gap-4 lg:grid-cols-4">{artists.map((artist, index) => <div key={artist.slug} className="rounded-xl border border-stone-100 bg-stone-50/60 p-4"><div className="flex items-center gap-3"><Avatar name={artist.name} image={artist.image} /><div><p className="text-xs font-semibold">{artist.name}</p><p className="mt-0.5 text-[9px] text-stone-400">{[286, 242, 264, 198][index]} services</p></div></div><div className="mt-4 grid grid-cols-2 gap-2"><div><p className="text-[9px] text-stone-400">Revenue</p><p className="mt-1 text-xs font-semibold">{["$27.4k", "$24.1k", "$22.8k", "$16.7k"][index]}</p></div><div><p className="text-[9px] text-stone-400">Rating</p><p className="mt-1 text-xs font-semibold">{artist.rating} <Star className="inline h-2.5 w-2.5 fill-amber-400 text-amber-400" /></p></div></div></div>)}</div></Panel>
  </div>;
}

const settingTabs = [
  { id: "business", label: "Business profile", icon: Building2 },
  { id: "booking", label: "Booking rules", icon: CalendarClock },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "integrations", label: "Integrations", icon: Link2 },
  { id: "security", label: "Security & roles", icon: ShieldCheck },
];

export function SettingsPage() {
  const [tab, setTab] = useState("business");
  const save = () => toast.success("Settings saved", { description: "Your changes are live across Maison Élan." });
  return <div className="space-y-6"><PageHeader eyebrow="Configuration" title="Settings" description="Control the salon profile, booking policies, payments and connected services." actions={<AdminButton onClick={save}><Save className="h-4 w-4" />Save changes</AdminButton>} />
    <div className="grid gap-6 xl:grid-cols-[240px_minmax(0,1fr)]">
      <label className="block md:hidden"><span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-stone-500">Settings section</span><select value={tab} onChange={(event) => setTab(event.target.value)} className="h-11 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm font-semibold text-ink focus:border-blush-400 focus:outline-none">{settingTabs.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
      <Panel bodyClassName="p-2" className="hidden h-fit md:block"><nav className="space-y-1" aria-label="Settings sections">{settingTabs.map((item) => { const Icon = item.icon; return <button key={item.id} onClick={() => setTab(item.id)} className={cn("flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-xs font-medium md:min-h-0", tab === item.id ? "bg-ink text-white" : "text-stone-500 hover:bg-stone-50 hover:text-ink")}><Icon className={cn("h-4 w-4", tab === item.id ? "text-blush-300" : "text-stone-400")} /><span className="flex-1">{item.label}</span><ChevronRight className="h-3.5 w-3.5 opacity-40" /></button>; })}</nav></Panel>
      <div>{tab === "business" ? <BusinessSettings /> : tab === "booking" ? <BookingSettings /> : tab === "notifications" ? <NotificationSettings /> : tab === "payments" ? <PaymentSettings /> : tab === "integrations" ? <IntegrationSettings /> : <SecuritySettings />}</div>
    </div>
  </div>;
}

function SettingsSection({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return <Panel title={title} subtitle={description} bodyClassName="p-5 md:p-6">{children}</Panel>;
}

function BusinessSettings() {
  const [online, setOnline] = useState(true);
  return <div className="space-y-5"><SettingsSection title="Business profile" description="Public-facing salon details used across booking, receipts and email."><div className="flex flex-col gap-5 sm:flex-row"><button className="grid h-24 w-24 shrink-0 place-items-center rounded-2xl border border-dashed border-stone-300 bg-cream text-center text-stone-400 hover:border-blush-400"><div><Sparkles className="mx-auto h-5 w-5" /><span className="mt-1 block text-[8px] font-semibold">Change logo</span></div></button><div className="grid flex-1 gap-4 sm:grid-cols-2"><Field label="Business name" defaultValue="Maison Élan Nail Atelier" /><Field label="Public email" defaultValue={siteFacts.email} /><Field label="Phone number" defaultValue={siteFacts.phone} /><Field label="Website" defaultValue="https://maisonelan.com" /></div></div><div className="mt-5"><TextAreaField label="Business description" defaultValue="A modern nail atelier in Dallas for impeccable manicures, sculpted gel, refined nail art and restorative spa rituals." /></div></SettingsSection>
    <SettingsSection title="Location" description="Your primary studio address and regional settings."><div className="grid gap-4 sm:grid-cols-2"><div className="sm:col-span-2"><Field label="Street address" defaultValue="123 Beauty Street" /></div><Field label="City" defaultValue="Dallas" /><Field label="State" defaultValue="Texas" /><Field label="ZIP code" defaultValue="75001" /><SelectField label="Time zone" value="America/Chicago" onChange={() => undefined}><option value="America/Chicago">Central Time (US & Canada)</option><option value="America/New_York">Eastern Time</option><option value="America/Los_Angeles">Pacific Time</option></SelectField></div></SettingsSection>
    <SettingsSection title="Online status" description="Control whether customers can place new bookings."><Toggle checked={online} onChange={setOnline} label="Accept online bookings" description="Turning this off keeps existing bookings but prevents new online appointments." />{!online ? <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-[11px] text-amber-700">Online booking is paused. Public booking pages will show your contact details.</div> : null}</SettingsSection>
  </div>;
}

function BookingSettings() {
  const [deposit, setDeposit] = useState(true); const [waitlist, setWaitlist] = useState(true); const [autoConfirm, setAutoConfirm] = useState(true); const [sameDay, setSameDay] = useState(true);
  return <div className="space-y-5"><SettingsSection title="Scheduling rules" description="Define the booking window and calendar behavior."><div className="grid gap-4 sm:grid-cols-2"><SelectField label="Booking interval" value="15 minutes" onChange={() => undefined}><option>10 minutes</option><option>15 minutes</option><option>30 minutes</option></SelectField><SelectField label="Clients can book" value="90 days ahead" onChange={() => undefined}><option>30 days ahead</option><option>60 days ahead</option><option>90 days ahead</option></SelectField><SelectField label="Minimum notice" value="2 hours" onChange={() => undefined}><option>1 hour</option><option>2 hours</option><option>24 hours</option></SelectField><SelectField label="Default buffer" value="10 minutes" onChange={() => undefined}><option>No buffer</option><option>10 minutes</option><option>15 minutes</option></SelectField></div><div className="mt-5 space-y-5 border-t border-stone-100 pt-5"><Toggle checked={autoConfirm} onChange={setAutoConfirm} label="Automatically confirm appointments" description="Bookings with a successful deposit are confirmed immediately." /><Toggle checked={sameDay} onChange={setSameDay} label="Allow same-day bookings" description="Open available appointments up to the minimum-notice window." /><Toggle checked={waitlist} onChange={setWaitlist} label="Enable smart waitlist" description="Notify clients when a matching cancellation opens." /></div></SettingsSection>
    <SettingsSection title="Deposits & cancellation" description="Protect salon time with clear client-facing rules."><Toggle checked={deposit} onChange={setDeposit} label="Require booking deposit" description="Collect a deposit at online checkout for selected services." />{deposit ? <div className="mt-5 grid gap-4 sm:grid-cols-2"><SelectField label="Deposit calculation" value="Percentage" onChange={() => undefined}><option>Percentage</option><option>Fixed amount</option></SelectField><Field label="Deposit amount" defaultValue="25%" /></div> : null}<div className="mt-5 grid gap-4 sm:grid-cols-2"><SelectField label="Free cancellation window" value="24 hours" onChange={() => undefined}><option>12 hours</option><option>24 hours</option><option>48 hours</option></SelectField><SelectField label="Late cancellation fee" value="100% of deposit" onChange={() => undefined}><option>Keep deposit</option><option>50% of service</option><option>100% of service</option></SelectField></div><div className="mt-5"><TextAreaField label="Cancellation policy summary" defaultValue="Appointments may be rescheduled or cancelled without charge up to 24 hours before the scheduled start time. Late cancellations and no-shows forfeit the booking deposit." /></div></SettingsSection>
  </div>;
}

function NotificationSettings() {
  const [settings, setSettings] = useState({ confirmationEmail: true, confirmationSms: true, reminder24: true, reminder2: false, followup: true, review: true, staff: true, digest: true });
  const update = (key: keyof typeof settings, value: boolean) => setSettings((current) => ({ ...current, [key]: value }));
  return <div className="space-y-5"><SettingsSection title="Client notifications" description="Transactional messages sent throughout the appointment journey."><div className="divide-y divide-stone-100">{[
    { key: "confirmationEmail" as const, label: "Email confirmation", description: "Immediately after a booking is created", icon: Mail },
    { key: "confirmationSms" as const, label: "SMS confirmation", description: "Short booking summary and manage link", icon: Smartphone },
    { key: "reminder24" as const, label: "24-hour reminder", description: "Email and SMS the day before", icon: Clock3 },
    { key: "reminder2" as const, label: "2-hour reminder", description: "Final SMS before the appointment", icon: Bell },
    { key: "followup" as const, label: "Aftercare follow-up", description: "Service-specific care guidance after the visit", icon: Sparkles },
    { key: "review" as const, label: "Review request", description: "Invite verified feedback two hours after completion", icon: Star },
  ].map((item) => { const Icon = item.icon; return <div key={item.key} className="flex items-center gap-3 py-4 first:pt-0 last:pb-0"><span className="grid h-9 w-9 place-items-center rounded-xl bg-stone-100 text-stone-500"><Icon className="h-4 w-4" /></span><div className="min-w-0 flex-1"><p className="text-xs font-semibold">{item.label}</p><p className="mt-0.5 text-[10px] text-stone-400">{item.description}</p></div><Toggle checked={settings[item.key]} onChange={(value) => update(item.key, value)} /></div>; })}</div></SettingsSection>
    <SettingsSection title="Team notifications" description="Operational alerts for administrators and technicians."><div className="space-y-5"><Toggle checked={settings.staff} onChange={(value) => update("staff", value)} label="New and changed appointments" description="Notify the assigned technician and front desk." /><Toggle checked={settings.digest} onChange={(value) => update("digest", value)} label="Daily operations digest" description="Send the next day’s schedule at 7:00 PM." /></div></SettingsSection>
    <SettingsSection title="Message sender" description="Names clients see in email and SMS."><div className="grid gap-4 sm:grid-cols-2"><Field label="Email sender name" defaultValue="Maison Élan" /><Field label="Reply-to email" defaultValue="care@maisonelan.com" /><Field label="SMS sender" defaultValue="MaisonElan" /><SelectField label="Default language" value="English (US)" onChange={() => undefined}><option>English (US)</option><option>Spanish</option></SelectField></div></SettingsSection>
  </div>;
}

function PaymentSettings() {
  const [tips, setTips] = useState(true); const [tax, setTax] = useState(true);
  return <div className="space-y-5"><SettingsSection title="Payment processor" description="Secure online and in-salon payment collection."><div className="flex flex-col gap-4 rounded-2xl border border-stone-200 bg-stone-50 p-4 sm:flex-row sm:items-center"><span className="grid h-12 w-12 place-items-center rounded-xl bg-[#635bff] font-bold text-white">S</span><div className="flex-1"><div className="flex items-center gap-2"><p className="text-sm font-semibold">Stripe</p><StatusChip label="Connected" tone="green" /></div><p className="mt-1 text-[10px] text-stone-400">Account ending ··4821 · Live mode</p></div><AdminButton variant="secondary" onClick={() => toast("Stripe dashboard would open in a new window")}>Manage <ExternalLink className="h-3.5 w-3.5" /></AdminButton></div><div className="mt-5 grid gap-4 sm:grid-cols-3"><div className="rounded-xl border border-stone-100 p-3"><p className="text-[9px] text-stone-400">Next payout</p><p className="mt-1 text-sm font-semibold">$4,824.60</p><p className="mt-1 text-[9px] text-stone-400">Aug 25, 2026</p></div><div className="rounded-xl border border-stone-100 p-3"><p className="text-[9px] text-stone-400">Processing</p><p className="mt-1 text-sm font-semibold">$1,268.00</p><p className="mt-1 text-[9px] text-stone-400">14 transactions</p></div><div className="rounded-xl border border-stone-100 p-3"><p className="text-[9px] text-stone-400">Disputes</p><p className="mt-1 text-sm font-semibold">$0.00</p><p className="mt-1 text-[9px] text-emerald-600">All clear</p></div></div></SettingsSection>
    <SettingsSection title="Checkout preferences" description="Accepted methods, gratuity and taxes."><div className="space-y-5"><Toggle checked={tips} onChange={setTips} label="Prompt for gratuity" description="Show 18%, 20%, 25% and custom options at checkout." /><Toggle checked={tax} onChange={setTax} label="Collect sales tax on retail" description="Apply the configured Texas retail sales tax to products." /></div><div className="mt-5 grid gap-4 border-t border-stone-100 pt-5 sm:grid-cols-2"><Field label="Retail sales tax" defaultValue="8.25%" /><SelectField label="Business currency" value="USD — US Dollar" onChange={() => undefined}><option>USD — US Dollar</option></SelectField></div></SettingsSection>
    <SettingsSection title="Accepted methods" description="Payment options offered at online and front-desk checkout."><div className="grid gap-3 sm:grid-cols-2">{["Visa / Mastercard", "American Express", "Apple Pay / Google Pay", "Maison Élan gift cards"].map((method) => <div key={method} className="flex items-center gap-3 rounded-xl border border-stone-100 p-3"><span className="grid h-8 w-8 place-items-center rounded-lg bg-stone-100"><CreditCard className="h-3.5 w-3.5" /></span><span className="flex-1 text-[11px] font-semibold">{method}</span><Check className="h-4 w-4 text-emerald-600" /></div>)}</div></SettingsSection>
  </div>;
}

const integrations = [
  { name: "Stripe", description: "Payments, deposits and payouts", icon: CreditCard, connected: true, color: "bg-violet-100 text-violet-700" },
  { name: "Twilio", description: "SMS reminders and client messages", icon: MessageSquareText, connected: true, color: "bg-rose-100 text-rose-700" },
  { name: "SendGrid", description: "Transactional and marketing email", icon: Mail, connected: true, color: "bg-sky-100 text-sky-700" },
  { name: "Google Calendar", description: "Team calendar synchronization", icon: CalendarClock, connected: false, color: "bg-emerald-100 text-emerald-700" },
  { name: "Instagram", description: "Lookbook and social proof feed", icon: ImageIconFallback, connected: true, color: "bg-blush-100 text-blush-500" },
  { name: "Google Business", description: "Reviews and local listing", icon: MapPin, connected: false, color: "bg-amber-100 text-amber-700" },
];

function ImageIconFallback({ className }: { className?: string }) { return <Globe2 className={className} />; }

function IntegrationSettings() {
  const [connected, setConnected] = useState<Record<string, boolean>>(Object.fromEntries(integrations.map((item) => [item.name, item.connected])));
  return <div className="space-y-5"><SettingsSection title="Connected apps" description="Services that extend your booking and marketing workflow."><div className="grid gap-3 sm:grid-cols-2">{integrations.map((item) => { const Icon = item.icon; const active = connected[item.name]; return <div key={item.name} className="rounded-2xl border border-stone-200 p-4"><div className="flex items-start gap-3"><span className={`grid h-10 w-10 place-items-center rounded-xl ${item.color}`}><Icon className="h-4 w-4" /></span><div className="min-w-0 flex-1"><p className="text-xs font-semibold">{item.name}</p><p className="mt-1 text-[10px] leading-4 text-stone-400">{item.description}</p></div></div><div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3"><StatusChip label={active ? "Connected" : "Not connected"} tone={active ? "green" : "slate"} /><button onClick={() => { setConnected((current) => ({ ...current, [item.name]: !active })); toast(active ? `${item.name} disconnected` : `${item.name} connected`); }} className="text-[10px] font-semibold text-blush-500 hover:text-ink">{active ? "Manage" : "Connect"}</button></div></div>; })}</div></SettingsSection>
    <SettingsSection title="Developer webhooks" description="Send real-time booking events to your own systems."><div className="rounded-xl border border-stone-200 p-4"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-stone-100"><Webhook className="h-4 w-4" /></span><div className="flex-1"><p className="text-xs font-semibold">Production endpoint</p><p className="mt-1 break-all font-mono text-[9px] text-stone-400">https://api.maisonelan.com/webhooks/salon</p></div><StatusChip label="Healthy" tone="green" /></div></div><AdminButton variant="secondary" className="mt-4"><Settings2 className="h-4 w-4" />Configure webhooks</AdminButton></SettingsSection>
  </div>;
}

function SecuritySettings() {
  const [twoFactor, setTwoFactor] = useState(true); const [sessionAlerts, setSessionAlerts] = useState(true);
  return <div className="space-y-5"><SettingsSection title="Account security" description="Protect administrative access and sensitive client information."><div className="space-y-5"><Toggle checked={twoFactor} onChange={setTwoFactor} label="Require two-factor authentication" description="All administrators verify new device sign-ins." /><Toggle checked={sessionAlerts} onChange={setSessionAlerts} label="New sign-in alerts" description="Email account owners when a new device accesses Salon Command." /></div><div className="mt-5 grid gap-3 border-t border-stone-100 pt-5 sm:grid-cols-2"><AdminButton variant="secondary"><KeyRound className="h-4 w-4" />Change password</AdminButton><AdminButton variant="secondary"><LockKeyhole className="h-4 w-4" />Review active sessions</AdminButton></div></SettingsSection>
    <SettingsSection title="Admin roles" description="Access levels for each part of Salon Command."><div className="divide-y divide-stone-100">{[
      { role: "Owner", people: "1 person", access: "Full business access" },
      { role: "Administrator", people: "2 people", access: "Operations, clients and reports" },
      { role: "Front desk", people: "3 people", access: "Bookings and client profiles" },
      { role: "Technician", people: "4 people", access: "Own schedule and clients" },
    ].map((role) => <button key={role.role} className="flex w-full items-center gap-3 py-4 text-left first:pt-0 last:pb-0"><span className="grid h-9 w-9 place-items-center rounded-xl bg-stone-100"><UsersRound className="h-4 w-4 text-stone-500" /></span><div className="flex-1"><p className="text-xs font-semibold">{role.role} <span className="ml-1 font-normal text-stone-400">· {role.people}</span></p><p className="mt-0.5 text-[10px] text-stone-400">{role.access}</p></div><ChevronRight className="h-4 w-4 text-stone-300" /></button>)}</div></SettingsSection>
    <SettingsSection title="Privacy & data" description="Data retention and account activity."><div className="grid gap-3 sm:grid-cols-2"><AdminButton variant="secondary"><Download className="h-4 w-4" />Export business data</AdminButton><AdminButton variant="secondary"><ShieldCheck className="h-4 w-4" />View audit log</AdminButton></div></SettingsSection>
  </div>;
}
