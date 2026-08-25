import type { Metadata } from "next";
import { AdminPage, adminSections } from "@/components/admin/admin-pages";

const titles: Record<string, string> = {
  appointments: "Appointments",
  categories: "Service Categories",
  customers: "Customers",
  services: "Services",
  staff: "Team & Availability",
  reviews: "Reviews",
  blog: "Journal",
  products: "Products",
  promotions: "Promotions",
  memberships: "Memberships",
  "gift-cards": "Gift Cards",
  reports: "Reports & Analytics",
  settings: "Settings",
};

type AdminRouteProps = { params: Promise<{ section?: string[] }> };

export async function generateMetadata({ params }: AdminRouteProps): Promise<Metadata> {
  const { section } = await params;
  const key = section?.[0];
  return { title: key ? titles[key] ?? "Admin" : "Overview" };
}

export function generateStaticParams() {
  return [{ section: [] }, ...adminSections.map((section) => ({ section: [section] }))];
}

export default async function AdminRoute({ params }: AdminRouteProps) {
  const { section } = await params;
  return <AdminPage section={section?.length === 1 ? section[0] : section?.join("/")} />;
}
