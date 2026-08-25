import type { Metadata } from "next";
import { RegisterForm } from "@/components/account/auth-forms";

export const metadata: Metadata = { title: "Create Account" };

export default function RegisterPage() {
  return <RegisterForm />;
}
