"use client";

import { useMemo, useState } from "react";
import {
  Archive,
  BadgePercent,
  BarChart3,
  Check,
  CircleDollarSign,
  Clock3,
  Copy,
  CreditCard,
  Download,
  Eye,
  Gift,
  Heart,
  Image as ImageIcon,
  Mail,
  MoreHorizontal,
  Package,
  PenLine,
  Plus,
  Search,
  Send,
  ShoppingBag,
  Sparkles,
  Star,
  Tag,
  Trash2,
  TrendingUp,
  Truck,
  UserCheck,
  UsersRound,
  WalletCards,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { memberships, posts, products, reviews as publicReviews } from "@/lib/site-data";
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
  SelectField,
  StatusChip,
  TableCell,
  TableHead,
  TableShell,
  TextAreaField,
  Toggle,
  type StatusTone,
} from "../admin-ui";

type ReviewStatus = "Published" | "Pending" | "Flagged";
type ReviewRecord = { id: number; name: string; service: string; text: string; rating: number; date: string; artist: string; status: ReviewStatus; replied: boolean };

const reviewSeed: ReviewRecord[] = [
  ...publicReviews.map((review, index) => ({ ...review, id: index + 1, date: ["Aug 22, 2026", "Aug 21, 2026", "Aug 20, 2026"][index], artist: ["Amara Cole", "Sophie Laurent", "Mina Park"][index], status: "Published" as const, replied: index !== 2 })),
  { id: 4, name: "Nora W.", service: "Sculpted Extensions", text: "The shape is exactly what I hoped for and the whole appointment felt so considered. Mina is exceptional.", rating: 5, date: "Aug 23, 2026", artist: "Mina Park", status: "Pending", replied: false },
  { id: 5, name: "Jamie L.", service: "Signature Manicure", text: "Beautiful salon and lovely service. I waited a little longer than expected, but the result was worth it.", rating: 4, date: "Aug 22, 2026", artist: "Nia James", status: "Pending", replied: false },
  { id: 6, name: "Anonymous", service: "Atelier Gel", text: "This submission contains language that requires review before it can be shown publicly.", rating: 2, date: "Aug 19, 2026", artist: "Amara Cole", status: "Flagged", replied: false },
];

const reviewTone: Record<ReviewStatus, StatusTone> = { Published: "green", Pending: "amber", Flagged: "rose" };

export function ReviewsPage() {
  const [items, setItems] = useState(reviewSeed);
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [replying, setReplying] = useState<ReviewRecord | null>(null);
  const filtered = items.filter((review) => (filter === "All" || review.status === filter) && `${review.name} ${review.service} ${review.artist}`.toLowerCase().includes(query.toLowerCase()));
  const setStatus = (id: number, status: ReviewStatus) => {
    setItems((current) => current.map((item) => item.id === id ? { ...item, status } : item));
    toast.success(status === "Published" ? "Review published" : "Review updated");
  };
  return <div className="space-y-6">
    <PageHeader eyebrow="Reputation" title="Reviews" description="Moderate verified feedback, respond thoughtfully and monitor guest sentiment." actions={<AdminButton variant="secondary" onClick={() => toast.success("Reviews exported")}><Download className="h-4 w-4" />Export reviews</AdminButton>} />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><KpiCard label="Average rating" value="4.9" change="0.1" note="this month" icon={Star} tone="gold" /><KpiCard label="Total reviews" value="286" change="18 new" note="this month" icon={UsersRound} tone="ink" /><KpiCard label="Response rate" value="94%" change="6 awaiting" trend="neutral" icon={Mail} tone="blush" /><KpiCard label="Recommendation" value="98%" change="Verified guests" trend="neutral" icon={Heart} tone="cream" /></div>
    <Panel bodyClassName="p-0"><div className="flex flex-col gap-3 border-b border-stone-100 p-5 lg:flex-row lg:items-center lg:justify-between"><div className="flex flex-wrap gap-2">{["All", "Pending", "Published", "Flagged"].map((item) => <button key={item} onClick={() => setFilter(item)} className={`rounded-full px-3.5 py-2 text-[10px] font-semibold ${filter === item ? "bg-ink text-white" : "border border-stone-200 text-stone-500 hover:bg-stone-50"}`}>{item}{item === "Pending" ? ` (${items.filter((review) => review.status === "Pending").length})` : ""}</button>)}</div><SearchField value={query} onChange={setQuery} placeholder="Search reviews" className="w-full lg:w-64" /></div>
      <div className="divide-y divide-stone-100">{filtered.map((review) => <article key={review.id} className="p-5 sm:p-6"><div className="flex flex-col gap-4 md:flex-row md:items-start"><Avatar name={review.name} size="lg" /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-start justify-between gap-3"><div><div className="flex items-center gap-2"><h2 className="text-sm font-semibold">{review.name}</h2><StatusChip label={review.status} tone={reviewTone[review.status]} /></div><p className="mt-1 text-[10px] text-stone-400">{review.service} with {review.artist} · {review.date}</p></div><div className="flex gap-0.5">{Array.from({ length: 5 }, (_, index) => <Star key={index} className={`h-3.5 w-3.5 ${index < review.rating ? "fill-amber-400 text-amber-400" : "text-stone-200"}`} />)}</div></div><p className="mt-4 max-w-3xl text-xs leading-6 text-stone-600">“{review.text}”</p>{review.replied ? <div className="mt-4 rounded-xl border-l-2 border-blush-300 bg-blush-50 p-3"><p className="text-[10px] font-semibold">Maison Élan replied</p><p className="mt-1 text-[10px] leading-5 text-stone-500">Thank you for sharing your experience. It was such a pleasure to welcome you to the atelier.</p></div> : null}<div className="mt-4 flex flex-wrap gap-2">{review.status !== "Published" ? <AdminButton className="h-8 px-3" onClick={() => setStatus(review.id, "Published")}><Check className="h-3.5 w-3.5" />Approve</AdminButton> : null}<AdminButton variant="secondary" className="h-8 px-3" onClick={() => setReplying(review)}><PenLine className="h-3.5 w-3.5" />{review.replied ? "Edit response" : "Reply"}</AdminButton>{review.status !== "Flagged" ? <AdminButton variant="ghost" className="h-8 px-3" onClick={() => setStatus(review.id, "Flagged")}>Flag</AdminButton> : null}<AdminButton variant="ghost" className="ml-auto h-8 px-2 text-stone-400" onClick={() => { setItems((current) => current.filter((item) => item.id !== review.id)); toast("Review archived"); }}><Archive className="h-3.5 w-3.5" />Archive</AdminButton></div></div></div></article>)}</div>
    </Panel>
    <AdminModal open={!!replying} onClose={() => setReplying(null)} title="Reply to review" description={replying ? `${replying.name} · ${replying.service}` : ""} footer={<><AdminButton variant="secondary" onClick={() => setReplying(null)}>Cancel</AdminButton><AdminButton onClick={() => { if (replying) setItems((current) => current.map((item) => item.id === replying.id ? { ...item, replied: true } : item)); setReplying(null); toast.success("Response published"); }}><Send className="h-4 w-4" />Publish response</AdminButton></>}><TextAreaField label="Public response" defaultValue="Thank you for taking the time to share your experience. It was a pleasure to welcome you to Maison Élan, and we look forward to seeing you again soon." /></AdminModal>
  </div>;
}

type BlogStatus = "Published" | "Draft" | "Scheduled";
const blogSeed = [
  ...posts.map((post, index) => ({ ...post, author: ["Amara Cole", "Mina Park", "Olivia Bennett"][index], status: "Published" as BlogStatus, views: [1842, 1264, 918][index] })),
  { slug: "autumn-color-edit", title: "The autumn color edit: six enduring shades", category: "Color", date: "August 28, 2026", readTime: "4 min read", image: "/images/nail-art-editorial.png", excerpt: "Our considered edit for the season ahead.", author: "Amara Cole", status: "Scheduled" as BlogStatus, views: 0 },
  { slug: "cuticle-care-guide", title: "The Maison Élan guide to cuticle care", category: "Nail health", date: "Not scheduled", readTime: "6 min read", image: "/images/spa-flatlay.png", excerpt: "A simple ritual for healthy, polished-looking nails.", author: "Nia James", status: "Draft" as BlogStatus, views: 0 },
];
const blogTone: Record<BlogStatus, StatusTone> = { Published: "green", Draft: "slate", Scheduled: "blue" };

export function BlogPage() {
  const [query, setQuery] = useState(""); const [status, setStatus] = useState("All posts"); const [modalOpen, setModalOpen] = useState(false);
  const filtered = blogSeed.filter((post) => (status === "All posts" || post.status === status) && `${post.title} ${post.category} ${post.author}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="space-y-6"><PageHeader eyebrow="Content" title="Journal" description="Publish expert beauty guidance, seasonal stories and search-friendly salon content." actions={<AdminButton onClick={() => setModalOpen(true)}><Plus className="h-4 w-4" />New article</AdminButton>} />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><KpiCard label="Published posts" value="28" change="3 this month" trend="neutral" icon={PenLine} tone="ink" /><KpiCard label="Monthly readers" value="8.4k" change="21.6%" note="vs. July" icon={Eye} tone="blush" /><KpiCard label="Avg. read time" value="4m 48s" change="12 sec" note="increase" icon={Clock3} tone="gold" /><KpiCard label="Organic visits" value="62%" change="8.1%" note="this quarter" icon={TrendingUp} tone="cream" /></div>
    <Panel title="All articles" subtitle={`${filtered.length} posts shown`}><div className="mb-4 flex flex-col gap-3 sm:flex-row"><SearchField value={query} onChange={setQuery} placeholder="Search articles" className="flex-1" /><SelectField value={status} onChange={setStatus} className="sm:w-44"><option>All posts</option><option>Published</option><option>Scheduled</option><option>Draft</option></SelectField><AdminButton variant="secondary"><Tag className="h-4 w-4" />Categories</AdminButton></div>
      <TableShell><thead><tr><TableHead>Article</TableHead><TableHead>Status</TableHead><TableHead>Author</TableHead><TableHead>Publish date</TableHead><TableHead>Views</TableHead><TableHead></TableHead></tr></thead><tbody>{filtered.map((post) => <tr key={post.slug} className="hover:bg-stone-50/60"><TableCell><div className="flex items-center gap-3"><div className="h-12 w-16 overflow-hidden rounded-xl bg-cream"><img src={post.image} alt="" className="h-full w-full object-cover" /></div><div><p className="max-w-[330px] truncate font-semibold text-ink">{post.title}</p><p className="mt-1 text-[10px] text-stone-400">{post.category} · {post.readTime}</p></div></div></TableCell><TableCell><StatusChip label={post.status} tone={blogTone[post.status]} /></TableCell><TableCell><div className="flex items-center gap-2"><Avatar name={post.author} size="sm" /><span>{post.author}</span></div></TableCell><TableCell>{post.date}</TableCell><TableCell><span className="font-semibold text-ink">{post.views ? post.views.toLocaleString() : "—"}</span></TableCell><TableCell><div className="flex gap-1"><IconButton label="Preview article"><Eye className="h-3.5 w-3.5" /></IconButton><IconButton label="Article actions"><MoreHorizontal className="h-4 w-4" /></IconButton></div></TableCell></tr>)}</tbody></TableShell>
    </Panel>
    <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title="Create journal article" description="Start with the story essentials" footer={<><AdminButton variant="secondary" onClick={() => setModalOpen(false)}>Cancel</AdminButton><AdminButton onClick={() => { setModalOpen(false); toast.success("Draft article created"); }}>Continue to editor</AdminButton></>}><div className="space-y-4"><Field label="Article title" placeholder="A clear, useful title" /><div className="grid gap-4 sm:grid-cols-2"><SelectField label="Category" value="Nail health" onChange={() => undefined}><option>Nail health</option><option>Trends</option><option>Bridal</option><option>Color</option><option>Atelier</option></SelectField><SelectField label="Author" value="Amara Cole" onChange={() => undefined}><option>Amara Cole</option><option>Mina Park</option><option>Nia James</option><option>Olivia Bennett</option></SelectField></div><TextAreaField label="Excerpt" placeholder="A concise summary for previews and search results..." /></div></AdminModal>
  </div>;
}

type ProductRecord = (typeof products)[number] & { sku: string; stock: number; sold: number; status: "Active" | "Low stock" | "Draft" };
const productSeed: ProductRecord[] = products.map((product, index) => ({ ...product, sku: ["ME-CE-01", "ME-HV-02", "ME-GF-03", "ME-NR-04", "ME-SF-05", "ME-HR-06"][index], stock: [46, 28, 64, 7, 35, 12][index], sold: [84, 61, 42, 36, 29, 24][index], status: index === 3 ? "Low stock" : "Active" }));
const productTone: Record<ProductRecord["status"], StatusTone> = { Active: "green", "Low stock": "amber", Draft: "slate" };

export function ProductsPage() {
  const [query, setQuery] = useState(""); const [category, setCategory] = useState("All categories"); const [modalOpen, setModalOpen] = useState(false);
  const filtered = productSeed.filter((product) => (category === "All categories" || product.category === category) && `${product.name} ${product.sku}`.toLowerCase().includes(query.toLowerCase()));
  const categories = ["All categories", ...Array.from(new Set(products.map((product) => product.category)))];
  return <div className="space-y-6"><PageHeader eyebrow="Retail" title="Products" description="Manage salon retail, online inventory, merchandising and order readiness." actions={<><AdminButton variant="secondary" onClick={() => toast.success("Inventory exported")}><Download className="h-4 w-4" />Export</AdminButton><AdminButton onClick={() => setModalOpen(true)}><Plus className="h-4 w-4" />Add product</AdminButton></>} />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><KpiCard label="Retail revenue" value="$12,480" change="18.2%" note="this month" icon={CircleDollarSign} tone="blush" /><KpiCard label="Units sold" value="276" change="32 more" note="than July" icon={ShoppingBag} tone="ink" /><KpiCard label="Low stock" value="3" change="Reorder needed" trend="neutral" icon={Package} tone="gold" /><KpiCard label="Open orders" value="14" change="6 ready to ship" trend="neutral" icon={Truck} tone="cream" /></div>
    <Panel title="Product catalog" subtitle={`${filtered.length} products shown`}><div className="mb-4 flex flex-col gap-3 sm:flex-row"><SearchField value={query} onChange={setQuery} placeholder="Search products or SKU" className="flex-1" /><SelectField value={category} onChange={setCategory} className="sm:w-48">{categories.map((item) => <option key={item}>{item}</option>)}</SelectField><AdminButton variant="secondary"><Archive className="h-4 w-4" />Orders</AdminButton></div>
      <TableShell><thead><tr><TableHead>Product</TableHead><TableHead>Status</TableHead><TableHead>Price</TableHead><TableHead>Inventory</TableHead><TableHead>Sold</TableHead><TableHead>Revenue</TableHead><TableHead></TableHead></tr></thead><tbody>{filtered.map((product) => <tr key={product.slug} className="hover:bg-stone-50/60"><TableCell><div className="flex items-center gap-3"><div className="h-12 w-12 overflow-hidden rounded-xl bg-cream"><img src={product.image} alt="" className="h-full w-full object-cover" /></div><div><p className="font-semibold text-ink">{product.name}</p><p className="mt-1 text-[10px] text-stone-400">{product.category} · {product.sku}</p></div></div></TableCell><TableCell><StatusChip label={product.status} tone={productTone[product.status]} /></TableCell><TableCell><span className="font-semibold text-ink">{formatCurrency(product.price)}</span></TableCell><TableCell><p className={`font-semibold ${product.stock < 10 ? "text-amber-600" : "text-ink"}`}>{product.stock} units</p><div className="mt-1.5 w-20"><ProgressBar value={(product.stock / 70) * 100} tone={product.stock < 10 ? "gold" : "ink"} /></div></TableCell><TableCell>{product.sold}</TableCell><TableCell><span className="font-semibold text-ink">{formatCurrency(product.sold * product.price)}</span></TableCell><TableCell><IconButton label="Product actions"><MoreHorizontal className="h-4 w-4" /></IconButton></TableCell></tr>)}</tbody></TableShell>
    </Panel>
    <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title="Add a product" description="Create a retail or online shop item" footer={<><AdminButton variant="secondary" onClick={() => setModalOpen(false)}>Cancel</AdminButton><AdminButton onClick={() => { setModalOpen(false); toast.success("Product saved as draft"); }}>Save product</AdminButton></>}><div className="space-y-4"><button className="flex h-28 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-stone-50 text-stone-400 hover:border-blush-400 hover:text-blush-500"><ImageIcon className="h-5 w-5" /><span className="mt-2 text-[10px] font-semibold">Upload product imagery</span></button><Field label="Product name" placeholder="Product name" /><div className="grid gap-4 sm:grid-cols-3"><Field label="Price ($)" type="number" /><Field label="SKU" placeholder="ME-XX-00" /><Field label="Starting stock" type="number" /></div><TextAreaField label="Description" placeholder="Describe the ritual, formula and benefits..." /></div></AdminModal>
  </div>;
}

type Promotion = { code: string; name: string; discount: string; channel: string; redemptions: number; revenue: string; expires: string; active: boolean; limit: number };
const promotionSeed: Promotion[] = [
  { code: "WELCOME20", name: "First visit welcome", discount: "20% off", channel: "New clients", redemptions: 86, revenue: "$5,420", expires: "No expiry", active: true, limit: 150 },
  { code: "GELGLOW15", name: "Atelier Gel edit", discount: "$15 off", channel: "Email campaign", redemptions: 42, revenue: "$3,024", expires: "Aug 31, 2026", active: true, limit: 100 },
  { code: "BRIDAL10", name: "Bridal party privilege", discount: "10% off", channel: "Group bookings", redemptions: 18, revenue: "$2,880", expires: "Dec 31, 2026", active: true, limit: 80 },
  { code: "SUMMERGIFT", name: "Gift card bonus", discount: "$20 bonus", channel: "Gift cards", redemptions: 64, revenue: "$6,400", expires: "Aug 15, 2026", active: false, limit: 75 },
];

export function PromotionsPage() {
  const [promotions, setPromotions] = useState(promotionSeed); const [modalOpen, setModalOpen] = useState(false);
  return <div className="space-y-6"><PageHeader eyebrow="Growth" title="Promotions" description="Create considered offers that reward loyalty without diluting the brand." actions={<AdminButton onClick={() => setModalOpen(true)}><Plus className="h-4 w-4" />Create promotion</AdminButton>} />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><KpiCard label="Active promotions" value="3" change="2 ending soon" trend="neutral" icon={BadgePercent} tone="blush" /><KpiCard label="Promo revenue" value="$11.3k" change="16.8%" note="this month" icon={CircleDollarSign} tone="ink" /><KpiCard label="Redemptions" value="146" change="22.4%" note="vs. July" icon={Tag} tone="gold" /><KpiCard label="Avg. order lift" value="+$24" change="Campaign impact" trend="neutral" icon={TrendingUp} tone="cream" /></div>
    <div className="grid gap-5 lg:grid-cols-2">{promotions.map((promotion) => <article key={promotion.code} className="relative overflow-hidden rounded-2xl border border-stone-200 bg-white p-5 shadow-[0_8px_30px_rgba(42,32,26,.035)]"><div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-blush-100/70" /><div className="relative flex items-start justify-between gap-3"><div><div className="flex items-center gap-2"><StatusChip label={promotion.active ? "Active" : "Ended"} tone={promotion.active ? "green" : "slate"} /><span className="text-[10px] text-stone-400">{promotion.expires}</span></div><h2 className="mt-4 font-display text-2xl">{promotion.name}</h2><div className="mt-2 flex items-center gap-2"><code className="rounded-lg border border-dashed border-blush-300 bg-blush-50 px-2.5 py-1.5 text-[11px] font-bold tracking-wider text-blush-500">{promotion.code}</code><IconButton label="Copy code" onClick={() => { navigator.clipboard?.writeText(promotion.code); toast.success("Code copied"); }}><Copy className="h-3.5 w-3.5" /></IconButton></div></div><Toggle checked={promotion.active} onChange={(checked) => setPromotions((current) => current.map((item) => item.code === promotion.code ? { ...item, active: checked } : item))} /></div><div className="relative mt-5 grid grid-cols-3 divide-x divide-stone-100 border-y border-stone-100 py-4"><div><p className="text-[9px] text-stone-400">Offer</p><p className="mt-1 text-xs font-semibold">{promotion.discount}</p></div><div className="pl-4"><p className="text-[9px] text-stone-400">Redeemed</p><p className="mt-1 text-xs font-semibold">{promotion.redemptions}</p></div><div className="pl-4"><p className="text-[9px] text-stone-400">Revenue</p><p className="mt-1 text-xs font-semibold">{promotion.revenue}</p></div></div><div className="relative mt-4"><div className="mb-2 flex justify-between text-[10px]"><span className="text-stone-400">Usage limit</span><span className="font-semibold">{promotion.redemptions} / {promotion.limit}</span></div><ProgressBar value={(promotion.redemptions / promotion.limit) * 100} tone={promotion.active ? "blush" : "ink"} /></div><div className="relative mt-4 flex items-center justify-between"><span className="text-[10px] text-stone-400">Audience · {promotion.channel}</span><AdminButton variant="ghost" className="h-8 px-2">Edit offer</AdminButton></div></article>)}</div>
    <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title="Create a promotion" footer={<><AdminButton variant="secondary" onClick={() => setModalOpen(false)}>Save draft</AdminButton><AdminButton onClick={() => { setModalOpen(false); toast.success("Promotion activated"); }}>Activate promotion</AdminButton></>}><div className="space-y-4"><Field label="Promotion name" placeholder="Campaign name" /><div className="grid gap-4 sm:grid-cols-2"><Field label="Promo code" placeholder="ELEGANT20" /><SelectField label="Discount type" value="Percentage" onChange={() => undefined}><option>Percentage</option><option>Fixed amount</option><option>Complimentary add-on</option></SelectField><Field label="Discount value" type="number" /><Field label="Usage limit" type="number" /></div><div className="grid gap-4 sm:grid-cols-2"><Field label="Starts" type="date" /><Field label="Ends" type="date" /></div><Toggle checked={true} onChange={() => undefined} label="Available in online booking" description="Show the code field at checkout." /></div></AdminModal>
  </div>;
}

const memberSeed = [
  { name: "Sofia Alvarez", plan: "The Atelier", joined: "Jan 14, 2026", nextBilling: "Sep 14", visits: 16, value: "$1,428", status: "Active" },
  { name: "Maya Thompson", plan: "The Essential", joined: "Mar 2, 2026", nextBilling: "Sep 2", visits: 10, value: "$772", status: "Active" },
  { name: "Emma Brooks", plan: "The Ritual", joined: "Nov 18, 2025", nextBilling: "Aug 18", visits: 22, value: "$2,840", status: "Past due" },
  { name: "Ava Martinez", plan: "The Atelier", joined: "May 9, 2026", nextBilling: "Sep 9", visits: 7, value: "$714", status: "Active" },
  { name: "Nora Williams", plan: "The Essential", joined: "Aug 20, 2026", nextBilling: "Sep 20", visits: 1, value: "$69", status: "Trial" },
];

export function MembershipsPage() {
  const [modalOpen, setModalOpen] = useState(false); const [query, setQuery] = useState(""); const filtered = memberSeed.filter((member) => `${member.name} ${member.plan}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="space-y-6"><PageHeader eyebrow="Loyalty" title="Memberships" description="Manage recurring care plans, member benefits and subscription health." actions={<><AdminButton variant="secondary" onClick={() => toast.success("Member list exported")}><Download className="h-4 w-4" />Export</AdminButton><AdminButton onClick={() => setModalOpen(true)}><Plus className="h-4 w-4" />Add plan</AdminButton></>} />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><KpiCard label="Active members" value="186" change="12.7%" note="this quarter" icon={UsersRound} tone="ink" /><KpiCard label="Monthly recurring" value="$21.8k" change="8.4%" note="vs. July" icon={CircleDollarSign} tone="blush" /><KpiCard label="Member retention" value="92%" change="2.1%" note="last 90 days" icon={Heart} tone="gold" /><KpiCard label="Visits redeemed" value="164" change="88% utilization" trend="neutral" icon={UserCheck} tone="cream" /></div>
    <div className="grid gap-5 lg:grid-cols-3">{memberships.map((plan, index) => <article key={plan.name} className={`relative rounded-2xl border p-5 ${plan.featured ? "border-blush-300 bg-[#1b1815] text-white shadow-xl" : "border-stone-200 bg-white"}`}>{plan.featured ? <span className="absolute right-4 top-4 rounded-full bg-blush-300 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-ink">Popular</span> : null}<p className={`text-[10px] font-bold uppercase tracking-[.18em] ${plan.featured ? "text-blush-300" : "text-blush-500"}`}>{plan.name}</p><div className="mt-4 flex items-end gap-1"><span className="font-display text-4xl">${plan.price}</span><span className={`pb-1 text-[10px] ${plan.featured ? "text-white/45" : "text-stone-400"}`}>/ month</span></div><p className={`mt-3 text-xs leading-5 ${plan.featured ? "text-white/55" : "text-stone-500"}`}>{plan.description}</p><div className={`my-5 h-px ${plan.featured ? "bg-white/10" : "bg-stone-100"}`} /><div className="flex items-center justify-between"><div><p className="text-lg font-semibold">{[62, 86, 38][index]}</p><p className={`text-[9px] ${plan.featured ? "text-white/40" : "text-stone-400"}`}>Active members</p></div><div className="text-right"><p className="text-sm font-semibold">${[4278, 10234, 6422][index].toLocaleString()}</p><p className={`text-[9px] ${plan.featured ? "text-white/40" : "text-stone-400"}`}>Monthly revenue</p></div></div><button onClick={() => toast(`Editing ${plan.name}`)} className={`mt-5 w-full rounded-xl border py-2.5 text-[11px] font-semibold ${plan.featured ? "border-white/15 bg-white/5 hover:bg-white/10" : "border-stone-200 hover:bg-stone-50"}`}>Edit plan & benefits</button></article>)}</div>
    <Panel title="Member directory" subtitle="Subscription and usage details"><div className="mb-4"><SearchField value={query} onChange={setQuery} placeholder="Search members" className="max-w-sm" /></div><TableShell><thead><tr><TableHead>Member</TableHead><TableHead>Plan</TableHead><TableHead>Joined</TableHead><TableHead>Next billing</TableHead><TableHead>Visits</TableHead><TableHead>Lifetime value</TableHead><TableHead>Status</TableHead><TableHead></TableHead></tr></thead><tbody>{filtered.map((member) => <tr key={member.name}><TableCell><div className="flex items-center gap-2.5"><Avatar name={member.name} size="sm" /><span className="font-semibold text-ink">{member.name}</span></div></TableCell><TableCell>{member.plan}</TableCell><TableCell>{member.joined}</TableCell><TableCell>{member.nextBilling}</TableCell><TableCell>{member.visits}</TableCell><TableCell><span className="font-semibold text-ink">{member.value}</span></TableCell><TableCell><StatusChip label={member.status} tone={member.status === "Active" ? "green" : member.status === "Trial" ? "blue" : "rose"} /></TableCell><TableCell><IconButton label="Member actions"><MoreHorizontal className="h-4 w-4" /></IconButton></TableCell></tr>)}</tbody></TableShell></Panel>
    <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title="Create membership plan" footer={<><AdminButton variant="secondary" onClick={() => setModalOpen(false)}>Cancel</AdminButton><AdminButton onClick={() => { setModalOpen(false); toast.success("Membership plan created"); }}>Create plan</AdminButton></>}><div className="space-y-4"><Field label="Plan name" placeholder="The ..." /><div className="grid gap-4 sm:grid-cols-2"><Field label="Monthly price" type="number" /><Field label="Billing interval" value="Monthly" readOnly /></div><TextAreaField label="Member promise" placeholder="A concise description of this membership..." /><TextAreaField label="Included benefits" placeholder="Enter one benefit per line..." /></div></AdminModal>
  </div>;
}

const giftTransactions = [
  { id: "GC-8F42-K7P9", buyer: "Lena Carter", recipient: "Maya Thompson", amount: 150, balance: 150, issued: "Aug 23, 2026", status: "Scheduled" },
  { id: "GC-2A16-M4Q8", buyer: "Noah Reed", recipient: "Layla Reed", amount: 100, balance: 52, issued: "Aug 21, 2026", status: "Active" },
  { id: "GC-9C54-B2R1", buyer: "Emma Brooks", recipient: "Emma Brooks", amount: 250, balance: 0, issued: "Aug 18, 2026", status: "Redeemed" },
  { id: "GC-4D82-X6N3", buyer: "Ava Martinez", recipient: "Sofia Alvarez", amount: 200, balance: 200, issued: "Aug 16, 2026", status: "Active" },
  { id: "GC-7H31-P9L5", buyer: "Claire Wilson", recipient: "Nora Williams", amount: 75, balance: 75, issued: "Aug 14, 2026", status: "Active" },
];

export function GiftCardsPage() {
  const [query, setQuery] = useState(""); const [modalOpen, setModalOpen] = useState(false); const filtered = giftTransactions.filter((gift) => `${gift.id} ${gift.buyer} ${gift.recipient}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="space-y-6"><PageHeader eyebrow="Gifting" title="Gift cards" description="Issue, track and delight with beautifully presented digital salon credit." actions={<><AdminButton variant="secondary" onClick={() => toast.success("Gift card report exported")}><Download className="h-4 w-4" />Export</AdminButton><AdminButton onClick={() => setModalOpen(true)}><Plus className="h-4 w-4" />Issue gift card</AdminButton></>} />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><KpiCard label="Outstanding balance" value="$18,460" change="Across 142 cards" trend="neutral" icon={WalletCards} tone="ink" /><KpiCard label="Sold this month" value="$6,925" change="24.2%" note="vs. July" icon={Gift} tone="blush" /><KpiCard label="Redemptions" value="$4,180" change="61 cards used" trend="neutral" icon={CreditCard} tone="gold" /><KpiCard label="Average value" value="$116" change="8.8%" note="this quarter" icon={TrendingUp} tone="cream" /></div>
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_380px]"><Panel title="Gift card ledger" subtitle={`${filtered.length} recent gift cards`}><div className="mb-4 flex flex-col gap-3 sm:flex-row"><SearchField value={query} onChange={setQuery} placeholder="Search code, buyer or recipient" className="flex-1" /><SelectField value="All status" onChange={() => undefined} className="sm:w-36"><option>All status</option><option>Active</option><option>Scheduled</option><option>Redeemed</option></SelectField></div><TableShell><thead><tr><TableHead>Gift card</TableHead><TableHead>Recipient</TableHead><TableHead>Value</TableHead><TableHead>Balance</TableHead><TableHead>Issued</TableHead><TableHead>Status</TableHead><TableHead></TableHead></tr></thead><tbody>{filtered.map((gift) => <tr key={gift.id}><TableCell><p className="font-mono text-[10px] font-semibold text-ink">{gift.id}</p><p className="mt-1 text-[10px] text-stone-400">From {gift.buyer}</p></TableCell><TableCell><div className="flex items-center gap-2"><Avatar name={gift.recipient} size="sm" /><span className="font-semibold text-ink">{gift.recipient}</span></div></TableCell><TableCell><span className="font-semibold text-ink">{formatCurrency(gift.amount)}</span></TableCell><TableCell><span className={gift.balance === 0 ? "text-stone-400" : "font-semibold text-ink"}>{formatCurrency(gift.balance)}</span></TableCell><TableCell>{gift.issued}</TableCell><TableCell><StatusChip label={gift.status} tone={gift.status === "Active" ? "green" : gift.status === "Scheduled" ? "blue" : "slate"} /></TableCell><TableCell><IconButton label="Gift card actions"><MoreHorizontal className="h-4 w-4" /></IconButton></TableCell></tr>)}</tbody></TableShell></Panel>
      <Panel title="Gift card performance" subtitle="August 2026"><div className="rounded-2xl bg-gradient-to-br from-[#1b1815] to-[#302620] p-5 text-white"><div className="flex items-center justify-between"><Sparkles className="h-5 w-5 text-blush-300" /><span className="font-display text-lg">Maison Élan</span></div><p className="mt-12 text-[10px] uppercase tracking-[.2em] text-white/40">Gift card sales</p><p className="mt-2 font-display text-4xl">$6,925</p><p className="mt-5 text-[10px] text-white/45">A ritual worth giving</p></div><div className="mt-6 space-y-5"><div><div className="mb-2 flex justify-between text-[10px]"><span className="text-stone-400">Digital delivery</span><span className="font-semibold">78%</span></div><ProgressBar value={78} tone="blush" /></div><div><div className="mb-2 flex justify-between text-[10px]"><span className="text-stone-400">Purchased for others</span><span className="font-semibold">64%</span></div><ProgressBar value={64} tone="gold" /></div><div><div className="mb-2 flex justify-between text-[10px]"><span className="text-stone-400">Redeemed within 90 days</span><span className="font-semibold">71%</span></div><ProgressBar value={71} tone="ink" /></div></div><div className="mt-6 rounded-xl bg-blush-50 p-4"><p className="text-xs font-semibold">Seasonal opportunity</p><p className="mt-1 text-[10px] leading-5 text-stone-500">Gift card sales rise 2.4× in the six weeks before the holiday season.</p></div></Panel>
    </div>
    <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title="Issue a gift card" description="Send a personalized digital Maison Élan gift" footer={<><AdminButton variant="secondary" onClick={() => setModalOpen(false)}>Cancel</AdminButton><AdminButton onClick={() => { setModalOpen(false); toast.success("Gift card issued", { description: "Delivery confirmation was sent." }); }}><Send className="h-4 w-4" />Issue & send</AdminButton></>}><div className="space-y-4"><div className="grid gap-4 sm:grid-cols-2"><Field label="Recipient name" /><Field label="Recipient email" type="email" /><Field label="Gift value ($)" type="number" defaultValue="100" /><Field label="Delivery date" type="date" defaultValue="2026-08-23" /></div><TextAreaField label="Personal message" placeholder="A thoughtful note from the sender..." /><Toggle checked={true} onChange={() => undefined} label="Send a digital receipt" description="Email the buyer after successful issue." /></div></AdminModal>
  </div>;
}
