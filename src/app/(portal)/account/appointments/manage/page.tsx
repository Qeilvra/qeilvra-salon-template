import type { Metadata } from "next";
import { Suspense } from "react";
import { ManageAppointment } from "@/components/account/manage-appointment";

export const metadata: Metadata = { title: "Manage Appointment" };

export default function ManageAppointmentPage() {
  return <Suspense fallback={<div className="h-96 animate-pulse rounded-[26px] bg-white" />}><ManageAppointment /></Suspense>;
}
