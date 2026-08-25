import { notFound } from "next/navigation";
import { BlogPage, GiftCardsPage, MembershipsPage, ProductsPage, PromotionsPage, ReviewsPage } from "./pages/content-commerce-pages";
import { AppointmentsPage, CategoriesPage, CustomersPage, ServicesPage, StaffPage } from "./pages/operations-pages";
import { OverviewPage } from "./pages/overview-page";
import { ReportsPage, SettingsPage } from "./pages/reports-settings-pages";

const pages = {
  appointments: AppointmentsPage,
  categories: CategoriesPage,
  customers: CustomersPage,
  services: ServicesPage,
  staff: StaffPage,
  reviews: ReviewsPage,
  blog: BlogPage,
  products: ProductsPage,
  promotions: PromotionsPage,
  memberships: MembershipsPage,
  "gift-cards": GiftCardsPage,
  reports: ReportsPage,
  settings: SettingsPage,
} as const;

export type AdminSection = keyof typeof pages;

export function AdminPage({ section }: { section?: string }) {
  if (!section) return <OverviewPage />;
  if (!(section in pages)) notFound();
  const Page = pages[section as AdminSection];
  return <Page />;
}

export const adminSections = Object.keys(pages);
