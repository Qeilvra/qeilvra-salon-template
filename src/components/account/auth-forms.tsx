"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ArrowRight, Check, Eye, EyeOff, KeyRound, LockKeyhole, Mail, MailCheck, Phone, UserRound } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { FormError, fieldClass } from "@/components/account/portal-ui";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  remember: z.boolean(),
});

const registerSchema = z.object({
  firstName: z.string().min(2, "Enter your first name."),
  lastName: z.string().min(2, "Enter your last name."),
  email: z.string().email("Enter a valid email address."),
  phone: z.string().min(10, "Enter a valid mobile number."),
  password: z.string().min(8, "Use at least 8 characters.").regex(/[A-Z]/, "Add one uppercase letter.").regex(/[0-9]/, "Add one number."),
  confirmPassword: z.string(),
  terms: z.boolean().refine(Boolean, "Please accept the terms to continue."),
}).refine((values) => values.password === values.confirmPassword, { message: "Passwords do not match.", path: ["confirmPassword"] });

const forgotSchema = z.object({ email: z.string().email("Enter a valid email address.") });

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;
type ForgotValues = z.infer<typeof forgotSchema>;

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<LoginValues>({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "", remember: true } });

  function submit(values: LoginValues) {
    toast.success("Welcome back", { description: values.remember ? "Your Maison will remember this device." : "You’re signed in securely." });
    router.push("/account");
  }

  return (
    <div>
      <AuthHeading eyebrow="Welcome back" title="Enter your Maison" description="Your appointments, rewards, and favorite details are waiting." />
      <form onSubmit={form.handleSubmit(submit)} noValidate className="mt-8 space-y-4">
        <AuthField label="Email address" error={form.formState.errors.email?.message} icon={Mail}><input autoComplete="email" type="email" placeholder="you@example.com" className={`${fieldClass} pl-11`} {...form.register("email")} /></AuthField>
        <AuthField label="Password" error={form.formState.errors.password?.message} icon={LockKeyhole}><div className="relative"><input autoComplete="current-password" type={showPassword ? "text" : "password"} placeholder="Your password" className={`${fieldClass} pl-11 pr-11`} {...form.register("password")} /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-ink/35 hover:bg-cream" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></AuthField>
        <div className="flex items-center justify-between gap-4 pt-1"><label className="flex cursor-pointer items-center gap-2 text-[11px] text-ink/50"><input type="checkbox" className="h-4 w-4 rounded accent-[#c97c7a]" {...form.register("remember")} /> Remember me</label><Link href="/auth/forgot-password" className="text-[11px] font-semibold text-rose-500 hover:text-ink">Forgot password?</Link></div>
        <button disabled={form.formState.isSubmitting} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-ink px-6 text-[10px] font-bold uppercase tracking-[0.13em] text-white hover:-translate-y-0.5 hover:bg-black disabled:opacity-50">Sign in <ArrowRight className="h-4 w-4 text-blush-300" /></button>
      </form>
      <SocialDivider />
      <SocialButtons />
      <p className="mt-8 text-center text-xs text-ink/45">New to Maison Élan? <Link href="/auth/register" className="font-semibold text-rose-500 hover:text-ink">Create your account</Link></p>
    </div>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<RegisterValues>({ resolver: zodResolver(registerSchema), defaultValues: { firstName: "", lastName: "", email: "", phone: "", password: "", confirmPassword: "", terms: false } });
  const password = form.watch("password");

  function submit(values: RegisterValues) {
    toast.success("Welcome to the Maison", { description: `Your account is ready, ${values.firstName}.` });
    router.push("/account");
  }

  return (
    <div>
      <AuthHeading eyebrow="Join the Maison" title="Create your account" description="Book faster, collect rewards, and make every visit more personal." />
      <form onSubmit={form.handleSubmit(submit)} noValidate className="mt-7 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2"><AuthField label="First name" error={form.formState.errors.firstName?.message} icon={UserRound}><input autoComplete="given-name" className={`${fieldClass} pl-11`} {...form.register("firstName")} /></AuthField><AuthField label="Last name" error={form.formState.errors.lastName?.message}><input autoComplete="family-name" className={fieldClass} {...form.register("lastName")} /></AuthField></div>
        <AuthField label="Email address" error={form.formState.errors.email?.message} icon={Mail}><input autoComplete="email" type="email" className={`${fieldClass} pl-11`} {...form.register("email")} /></AuthField>
        <AuthField label="Mobile number" error={form.formState.errors.phone?.message} icon={Phone}><input autoComplete="tel" type="tel" placeholder="(214) 555-0000" className={`${fieldClass} pl-11`} {...form.register("phone")} /></AuthField>
        <AuthField label="Create a password" error={form.formState.errors.password?.message} icon={LockKeyhole}><div className="relative"><input autoComplete="new-password" type={showPassword ? "text" : "password"} className={`${fieldClass} pl-11 pr-11`} {...form.register("password")} /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-ink/35" aria-label="Toggle password visibility">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></AuthField>
        {password ? <div className="grid grid-cols-3 gap-2">{[["8+ characters", password.length >= 8], ["Uppercase", /[A-Z]/.test(password)], ["One number", /[0-9]/.test(password)]].map(([label, valid]) => <span key={String(label)} className={cn("flex items-center gap-1.5 text-[9px]", valid ? "text-emerald-700" : "text-ink/30")}><Check className="h-3 w-3" /> {label}</span>)}</div> : null}
        <AuthField label="Confirm password" error={form.formState.errors.confirmPassword?.message} icon={KeyRound}><input autoComplete="new-password" type="password" className={`${fieldClass} pl-11`} {...form.register("confirmPassword")} /></AuthField>
        <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-cream/70 p-4 text-[11px] leading-5 text-ink/50"><input type="checkbox" className="mt-0.5 h-4 w-4 shrink-0 accent-[#c97c7a]" {...form.register("terms")} /><span>I agree to the <Link href="/policies/terms" className="font-semibold text-rose-500">Terms</Link> and <Link href="/policies/privacy" className="font-semibold text-rose-500">Privacy Policy</Link>.</span></label><FormError>{form.formState.errors.terms?.message}</FormError>
        <button disabled={form.formState.isSubmitting} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-ink px-6 text-[10px] font-bold uppercase tracking-[0.13em] text-white hover:-translate-y-0.5 hover:bg-black">Create account <ArrowRight className="h-4 w-4 text-blush-300" /></button>
      </form>
      <p className="mt-7 text-center text-xs text-ink/45">Already have an account? <Link href="/auth/login" className="font-semibold text-rose-500 hover:text-ink">Sign in</Link></p>
    </div>
  );
}

export function ForgotPasswordForm() {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const form = useForm<ForgotValues>({ resolver: zodResolver(forgotSchema), defaultValues: { email: "" } });

  function submit(values: ForgotValues) {
    setSentTo(values.email);
    toast.success("Reset link sent", { description: "It should arrive within a minute or two." });
  }

  if (sentTo) {
    return (
      <div className="text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-blush-100 text-rose-500"><MailCheck className="h-7 w-7" /></span>
        <p className="eyebrow mt-7 text-rose-500">Check your inbox</p><h1 className="mt-3 font-display text-4xl sm:text-5xl">A reset link is on its way.</h1><p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-ink/50">We sent password reset instructions to <span className="font-semibold text-ink">{sentTo}</span>.</p>
        <div className="mt-8 rounded-2xl bg-cream p-4 text-left text-[11px] leading-5 text-ink/45">The link expires in 30 minutes. If you don’t see it, check spam or request another email.</div>
        <button onClick={() => setSentTo(null)} className="mt-6 min-h-11 w-full rounded-full border border-ink/15 px-5 text-[10px] font-bold uppercase tracking-[0.12em] hover:border-ink">Send again</button>
        <Link href="/auth/login" className="mt-5 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-rose-500"><ArrowRight className="h-3.5 w-3.5 rotate-180" /> Back to sign in</Link>
      </div>
    );
  }

  return (
    <div>
      <span className="grid h-12 w-12 place-items-center rounded-full bg-blush-100 text-rose-500"><KeyRound className="h-5 w-5" /></span>
      <AuthHeading eyebrow="Password help" title="Let’s get you back in." description="Enter the email linked to your account and we’ll send a secure reset link." className="mt-6" />
      <form onSubmit={form.handleSubmit(submit)} noValidate className="mt-8">
        <AuthField label="Email address" error={form.formState.errors.email?.message} icon={Mail}><input autoFocus autoComplete="email" type="email" placeholder="you@example.com" className={`${fieldClass} pl-11`} {...form.register("email")} /></AuthField>
        <button className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-ink px-6 text-[10px] font-bold uppercase tracking-[0.13em] text-white hover:bg-black">Send reset link <ArrowRight className="h-4 w-4 text-blush-300" /></button>
      </form>
      <p className="mt-7 text-center text-xs text-ink/45">Remembered it? <Link href="/auth/login" className="font-semibold text-rose-500">Back to sign in</Link></p>
    </div>
  );
}

function AuthHeading({ eyebrow, title, description, className }: { eyebrow: string; title: string; description: string; className?: string }) {
  return <div className={className}><p className="eyebrow text-rose-500">{eyebrow}</p><h1 className="mt-3 font-display text-4xl tracking-[-0.035em] sm:text-5xl">{title}</h1><p className="mt-4 max-w-md text-sm leading-6 text-ink/50">{description}</p></div>;
}

function AuthField({ label, error, icon: Icon, children }: { label: string; error?: string; icon?: typeof Mail; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-[11px] font-semibold text-ink/65">{label}</span><div className="relative">{Icon ? <Icon className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-ink/30" /> : null}{children}</div><FormError>{error}</FormError></label>;
}

function SocialDivider() {
  return <div className="my-6 flex items-center gap-3"><span className="h-px flex-1 bg-ink/10" /><span className="text-[9px] font-bold uppercase tracking-[0.13em] text-ink/25">or continue with</span><span className="h-px flex-1 bg-ink/10" /></div>;
}

function SocialButtons() {
  return <div className="grid grid-cols-2 gap-3"><button onClick={() => toast("Google sign-in", { description: "Secure OAuth connection would open here." })} className="min-h-11 rounded-full border border-ink/15 text-[10px] font-semibold hover:border-ink hover:bg-cream">Google</button><button onClick={() => toast("Apple sign-in", { description: "Secure Apple connection would open here." })} className="min-h-11 rounded-full border border-ink/15 text-[10px] font-semibold hover:border-ink hover:bg-cream">Apple</button></div>;
}
