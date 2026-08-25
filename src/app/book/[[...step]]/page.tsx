import type { Metadata } from "next";
import { BookingWizard } from "@/components/booking/booking-wizard";

export const metadata: Metadata = {
  title: "Book an Appointment",
  description: "Choose your Maison Élan service, artist and appointment time online.",
  robots: { index: false, follow: true },
};

const validSteps = new Set(["service", "add-ons", "technician", "date-time", "details", "confirmation"]);

export default async function BookPage({
  params,
  searchParams,
}: {
  params: Promise<{ step?: string[] }>;
  searchParams: Promise<{ service?: string; artist?: string }>;
}) {
  const resolvedParams = await params;
  const query = await searchParams;
  const candidate = resolvedParams.step?.[0] ?? "service";
  const step = (validSteps.has(candidate) ? candidate : "service") as
    | "service"
    | "add-ons"
    | "technician"
    | "date-time"
    | "details"
    | "confirmation";
  return <BookingWizard step={step} initialService={query.service} initialArtist={query.artist} />;
}
