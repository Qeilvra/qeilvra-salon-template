import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/account/auth-forms";

export const metadata: Metadata = { title: "Reset Password" };

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
