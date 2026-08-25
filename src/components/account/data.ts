export type AppointmentStatus = "upcoming" | "completed" | "cancelled";

export type PortalAppointment = {
  id: string;
  status: AppointmentStatus;
  date: string;
  day: string;
  month: string;
  time: string;
  service: string;
  artist: string;
  duration: string;
  price: number;
  image: string;
  note?: string;
};

export const portalAppointments: PortalAppointment[] = [
  {
    id: "ME-2491",
    status: "upcoming",
    date: "Thursday, September 3, 2026",
    day: "03",
    month: "Sep",
    time: "11:00 AM",
    service: "Atelier Gel + Modern French",
    artist: "Mina Park",
    duration: "1 hr 20 min",
    price: 90,
    image: "/images/hero-luxury-manicure.png",
    note: "Soft almond shape, milky-pink base.",
  },
  {
    id: "ME-2568",
    status: "upcoming",
    date: "Saturday, September 26, 2026",
    day: "26",
    month: "Sep",
    time: "2:30 PM",
    service: "Velvet Pedicure",
    artist: "Sophie Laurent",
    duration: "1 hr",
    price: 68,
    image: "/images/spa-flatlay.png",
  },
  {
    id: "ME-2317",
    status: "completed",
    date: "Wednesday, July 29, 2026",
    day: "29",
    month: "Jul",
    time: "4:00 PM",
    service: "Signature Manicure",
    artist: "Nia James",
    duration: "45 min",
    price: 48,
    image: "/images/nail-art-editorial.png",
  },
  {
    id: "ME-2204",
    status: "completed",
    date: "Friday, June 19, 2026",
    day: "19",
    month: "Jun",
    time: "10:30 AM",
    service: "Atelier Gel",
    artist: "Mina Park",
    duration: "1 hr 5 min",
    price: 72,
    image: "/images/hero-luxury-manicure.png",
  },
  {
    id: "ME-2138",
    status: "cancelled",
    date: "Tuesday, May 26, 2026",
    day: "26",
    month: "May",
    time: "12:00 PM",
    service: "Renewal Hand Spa",
    artist: "Sophie Laurent",
    duration: "35 min",
    price: 42,
    image: "/images/spa-flatlay.png",
  },
];

export const savedLooks = [
  { id: 1, name: "Gilded French", style: "Minimal", image: "/images/hero-luxury-manicure.png", saved: "2 days ago" },
  { id: 2, name: "Petal Study", style: "Hand-painted", image: "/images/nail-art-editorial.png", saved: "1 week ago" },
  { id: 3, name: "Milk Bath Almond", style: "Quiet luxury", image: "/images/hero-luxury-manicure.png", saved: "2 weeks ago" },
  { id: 4, name: "Rose Quartz Chrome", style: "Chrome", image: "/images/nail-art-editorial.png", saved: "3 weeks ago" },
  { id: 5, name: "Barely Blush", style: "Natural", image: "/images/hero-luxury-manicure.png", saved: "1 month ago" },
  { id: 6, name: "Fine Gold Lines", style: "Editorial", image: "/images/nail-art-editorial.png", saved: "1 month ago" },
];

export const rewardActivity = [
  { id: 1, title: "Atelier Gel appointment", date: "Jul 29, 2026", points: 144, type: "earned" },
  { id: 2, title: "Birthday bonus", date: "Jul 12, 2026", points: 100, type: "earned" },
  { id: 3, title: "$10 service reward", date: "Jun 19, 2026", points: -500, type: "redeemed" },
  { id: 4, title: "Night Renewal Set", date: "Jun 4, 2026", points: 128, type: "earned" },
];

export const orders = [
  {
    id: "ME-8046",
    date: "August 12, 2026",
    status: "Delivered",
    total: 76,
    items: [
      { name: "Botanical Cuticle Elixir", quantity: 1, price: 32, image: "/images/spa-flatlay.png" },
      { name: "Soft Focus Polish", quantity: 2, price: 22, image: "/images/nail-art-editorial.png" },
    ],
  },
  {
    id: "ME-7719",
    date: "June 4, 2026",
    status: "Delivered",
    total: 64,
    items: [{ name: "Night Renewal Set", quantity: 1, price: 64, image: "/images/spa-flatlay.png" }],
  },
];

export const giftCards = [
  { id: "GC-ÉLAN-92J7", label: "A little luxury", balance: 85, original: 125, expires: "No expiration", color: "rose" },
  { id: "GC-ÉLAN-41K2", label: "Birthday ritual", balance: 20, original: 75, expires: "No expiration", color: "ink" },
];
