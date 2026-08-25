import type { LucideIcon } from "lucide-react";
import {
  BadgePercent,
  CalendarDays,
  CircleHelp,
  Contact,
  Gift,
  Heart,
  Images,
  LayoutDashboard,
  Megaphone,
  Newspaper,
  Package,
  Settings,
  ShoppingBag,
  Sparkles,
  Star,
  Tags,
  UserRound,
  UsersRound,
  WalletCards,
} from "lucide-react";

export type Service = {
  slug: string;
  name: string;
  category: string;
  description: string;
  longDescription: string;
  price: number;
  duration: number;
  image: string;
  featured?: boolean;
  benefits: string[];
};

export const navItems = [
  { label: "Services", href: "/services" },
  { label: "Lookbook", href: "/gallery" },
  { label: "Our artists", href: "/team" },
  { label: "Membership", href: "/membership" },
  { label: "Journal", href: "/blog" },
  { label: "Shop", href: "/shop" },
];

export const services: Service[] = [
  {
    slug: "signature-manicure",
    name: "Signature Manicure",
    category: "Manicure",
    description: "Meticulous shaping, cuticle care, massage and your perfect polish.",
    longDescription:
      "Our modern classic pairs precise natural-nail care with a restorative botanical ritual. Every detail is tailored to your nail health, lifestyle and preferred finish.",
    price: 48,
    duration: 45,
    image: "/images/nail-art-editorial.png",
    featured: true,
    benefits: ["Detailed cuticle care", "Botanical hand ritual", "Long-wear polish"],
  },
  {
    slug: "velvet-pedicure",
    name: "Velvet Pedicure",
    category: "Pedicure",
    description: "A restorative soak, refined grooming and cloud-soft hydration.",
    longDescription:
      "Settle into our quiet pedicure lounge for a mineral soak, precise grooming, smoothing treatment and slow massage finished in the shade of your choice.",
    price: 68,
    duration: 60,
    image: "/images/spa-flatlay.png",
    featured: true,
    benefits: ["Mineral soak", "Callus smoothing", "Extended massage"],
  },
  {
    slug: "atelier-gel",
    name: "Atelier Gel",
    category: "Gel",
    description: "Flawless, high-shine color with a delicate structured finish.",
    longDescription:
      "Our signature structured-gel technique creates an elegant apex and glass-like shine while preserving the integrity of the natural nail.",
    price: 72,
    duration: 65,
    image: "/images/hero-luxury-manicure.png",
    featured: true,
    benefits: ["Structured base", "Up to three weeks wear", "Gentle removal guidance"],
  },
  {
    slug: "sculpted-extensions",
    name: "Sculpted Extensions",
    category: "Extensions",
    description: "Lightweight custom length and shape, sculpted for your hands.",
    longDescription:
      "Bespoke extensions are hand-sculpted to flatter your fingers, then balanced and finished with your choice of sheer, color or art.",
    price: 118,
    duration: 105,
    image: "/images/nail-art-editorial.png",
    featured: true,
    benefits: ["Custom architecture", "Refined, slim profile", "Personalized shape"],
  },
  {
    slug: "editorial-nail-art",
    name: "Editorial Nail Art",
    category: "Nail art",
    description: "Wearable art, from fine gold details to custom hand-painted sets.",
    longDescription:
      "Bring a reference or let our artists design for you. We translate your mood into a cohesive, elevated set with techniques chosen for balance and wearability.",
    price: 35,
    duration: 30,
    image: "/images/nail-art-editorial.png",
    benefits: ["Artist consultation", "Custom palette", "Fine-detail work"],
  },
  {
    slug: "renewal-hand-spa",
    name: "Renewal Hand Spa",
    category: "Spa ritual",
    description: "A deeply nourishing reset for hardworking hands and nails.",
    longDescription:
      "A sensorial treatment featuring gentle exfoliation, a warm treatment mask and tension-releasing massage, designed to restore softness and glow.",
    price: 42,
    duration: 35,
    image: "/images/spa-flatlay.png",
    benefits: ["Softening exfoliation", "Warm treatment mask", "Aromatherapy massage"],
  },
  {
    slug: "bridal-preview",
    name: "Bridal Preview",
    category: "Occasion",
    description: "A considered trial and color story for your wedding celebrations.",
    longDescription:
      "Meet your artist, explore shapes and finishes, and perfect a lasting look that feels beautiful in person and in every photograph.",
    price: 95,
    duration: 90,
    image: "/images/hero-luxury-manicure.png",
    benefits: ["Private consultation", "Shade curation", "Wedding-day care plan"],
  },
  {
    slug: "gentlemans-detail",
    name: "The Detail",
    category: "Grooming",
    description: "Discreet, polish-free hand and nail care with a refined finish.",
    longDescription:
      "Clean shaping, complete cuticle work, natural buffing and non-greasy hydration for quietly impeccable hands.",
    price: 46,
    duration: 40,
    image: "/images/spa-flatlay.png",
    benefits: ["Natural finish", "Intensive grooming", "Fast-absorbing hydration"],
  },
];

export const addOns = [
  { id: "french", name: "Modern French", description: "Classic or tonal micro-tip", price: 18, duration: 15 },
  { id: "repair", name: "Nail repair", description: "Silk or structured repair", price: 9, duration: 10 },
  { id: "chrome", name: "Glazed chrome", description: "Pearlescent powder finish", price: 16, duration: 10 },
  { id: "massage", name: "Extended massage", description: "Ten extra restorative minutes", price: 20, duration: 10 },
];

export const artists = [
  {
    slug: "amara-cole",
    name: "Amara Cole",
    role: "Founder & master artist",
    specialties: ["Structured gel", "Editorial art"],
    rating: 4.98,
    experience: "12 years",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=85",
    quote: "Beautiful work begins with listening.",
  },
  {
    slug: "mina-park",
    name: "Mina Park",
    role: "Senior nail artist",
    specialties: ["Fine-line art", "Extensions"],
    rating: 4.96,
    experience: "8 years",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=85",
    quote: "The smallest details create the whole feeling.",
  },
  {
    slug: "sophie-laurent",
    name: "Sophie Laurent",
    role: "Wellness specialist",
    specialties: ["Pedicure", "Spa rituals"],
    rating: 4.95,
    experience: "7 years",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=85",
    quote: "A treatment should change the pace of your day.",
  },
  {
    slug: "nia-james",
    name: "Nia James",
    role: "Nail artist",
    specialties: ["Natural nails", "Minimal art"],
    rating: 4.93,
    experience: "5 years",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=900&q=85",
    quote: "Healthy nails are always the foundation.",
  },
];

export const reviews = [
  {
    name: "Elena M.",
    service: "Atelier Gel",
    text: "The most considered salon experience I’ve had. My nails are immaculate, the space is serene, and every detail feels special.",
    rating: 5,
  },
  {
    name: "Camille R.",
    service: "Velvet Pedicure",
    text: "From the warm welcome to the beautiful finish, it felt more like a private ritual than an appointment. Already rebooked.",
    rating: 5,
  },
  {
    name: "Priya S.",
    service: "Editorial Nail Art",
    text: "Mina understood my reference instantly and made it feel so refined. The fine-line detail is extraordinary.",
    rating: 5,
  },
];

export const products = [
  { slug: "cuticle-elixir", name: "Botanical Cuticle Elixir", category: "Nail care", price: 32, rating: 4.9, image: "/images/spa-flatlay.png", badge: "Bestseller", description: "A fast-absorbing blend of jojoba, squalane and vitamin E for supple cuticles." },
  { slug: "hand-veil", name: "Cashmere Hand Veil", category: "Hand care", price: 38, rating: 4.8, image: "/images/spa-flatlay.png", badge: "New", description: "Silky ceramide hand cream with a soft neroli finish and no residue." },
  { slug: "glass-file", name: "Precision Glass File", category: "Tools", price: 24, rating: 4.9, image: "/images/nail-art-editorial.png", description: "A fine-grit Czech glass file for smooth, sealed natural-nail edges." },
  { slug: "night-renewal", name: "Night Renewal Set", category: "Ritual sets", price: 64, rating: 5, image: "/images/spa-flatlay.png", badge: "Limited", description: "Our elixir, hand veil and cotton gloves in a keepsake blush pouch." },
  { slug: "soft-focus-polish", name: "Soft Focus Polish", category: "Color", price: 22, rating: 4.7, image: "/images/nail-art-editorial.png", description: "A buildable milky blush lacquer with a glossy salon-grade finish." },
  { slug: "home-ritual", name: "At-Home Ritual Kit", category: "Ritual sets", price: 78, rating: 4.9, image: "/images/spa-flatlay.png", description: "Everything for a beautifully edited weekly natural-nail ritual." },
];

export const posts = [
  {
    slug: "quiet-luxury-nails",
    title: "The new language of quiet-luxury nails",
    category: "Trends",
    date: "August 14, 2026",
    readTime: "5 min read",
    image: "/images/nail-art-editorial.png",
    excerpt: "Sheer color, immaculate detail and the shapes defining a more considered kind of manicure.",
  },
  {
    slug: "make-gel-last-longer",
    title: "How to make your gel manicure last beautifully",
    category: "Nail health",
    date: "August 4, 2026",
    readTime: "6 min read",
    image: "/images/hero-luxury-manicure.png",
    excerpt: "Our artists share the small, practical habits that protect shine and support nail health.",
  },
  {
    slug: "bridal-nail-timeline",
    title: "Your calm, considered bridal nail timeline",
    category: "Bridal",
    date: "July 22, 2026",
    readTime: "7 min read",
    image: "/images/salon-interior.png",
    excerpt: "From the first preview to wedding morning: a simple plan for effortless hands and feet.",
  },
];

export const memberships = [
  { name: "The Essential", price: 69, description: "A monthly ritual for consistently polished hands.", features: ["1 Signature Manicure", "10% retail savings", "Priority waitlist", "Birthday add-on"] },
  { name: "The Atelier", price: 119, description: "Our most-loved membership for gel devotees.", features: ["1 Atelier Gel service", "$15 monthly art credit", "15% retail savings", "Priority booking"], featured: true },
  { name: "The Ritual", price: 169, description: "Unhurried care for hands, feet and everything between.", features: ["1 manicure + 1 pedicure", "One monthly add-on", "15% retail savings", "Guest pass each quarter"] },
];

export type AdminNavItem = { label: string; href: string; icon: LucideIcon };

export const adminNav: AdminNavItem[] = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Appointments", href: "/admin/appointments", icon: CalendarDays },
  { label: "Customers", href: "/admin/customers", icon: UsersRound },
  { label: "Services", href: "/admin/services", icon: Sparkles },
  { label: "Categories", href: "/admin/categories", icon: Tags },
  { label: "Team", href: "/admin/staff", icon: UserRound },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
  { label: "Journal", href: "/admin/blog", icon: Newspaper },
  { label: "Promotions", href: "/admin/promotions", icon: BadgePercent },
  { label: "Memberships", href: "/admin/memberships", icon: Heart },
  { label: "Gift cards", href: "/admin/gift-cards", icon: Gift },
  { label: "Reports", href: "/admin/reports", icon: WalletCards },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export const accountNav = [
  { label: "Overview", href: "/account", icon: LayoutDashboard },
  { label: "Appointments", href: "/account/appointments", icon: CalendarDays },
  { label: "Saved looks", href: "/account/wishlist", icon: Images },
  { label: "Rewards", href: "/account/rewards", icon: Star },
  { label: "Orders", href: "/account/orders", icon: ShoppingBag },
  { label: "Gift cards", href: "/account/gift-cards", icon: Gift },
  { label: "Profile", href: "/account/profile", icon: Contact },
  { label: "Help", href: "/faq", icon: CircleHelp },
];

export const siteFacts = {
  phone: "(214) 555-0198",
  email: "hello@maisonelan.com",
  address: "123 Beauty Street, Dallas, TX 75001",
  hours: "Mon–Sat 9:00 AM–8:00 PM · Sun 10:00 AM–5:00 PM",
};

