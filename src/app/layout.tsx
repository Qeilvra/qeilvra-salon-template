import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import { ShopProvider } from "@/components/shop/shop-provider";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://maisonelan.example"),
  title: {
    default: "Maison Élan | Nail Atelier & Spa",
    template: "%s | Maison Élan",
  },
  description:
    "A modern nail atelier in Dallas for impeccable manicures, sculpted gel, refined nail art and restorative spa rituals.",
  keywords: ["luxury nail salon", "Dallas manicure", "gel nails", "nail art", "pedicure"],
  openGraph: {
    title: "Maison Élan Nail Atelier",
    description: "Nail care, elevated to an art form.",
    images: ["/images/hero-luxury-manicure.png"],
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#171411",
  colorScheme: "light",
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <ShopProvider>{children}</ShopProvider>
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
