import type { Metadata } from "next";
import { AppointmentsView } from "@/components/account/appointments-view";

export const metadata: Metadata = { title: "My Appointments" };

export default function AppointmentsPage() {
  return <AppointmentsView />;
}
