import type { MetadataRoute } from "next";
import { artists, posts, products, services } from "@/lib/site-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://maisonelan.example";
  const staticRoutes = ["", "/about", "/services", "/pricing", "/gallery", "/team", "/reviews", "/membership", "/gift-cards", "/offers", "/shop", "/blog", "/faq", "/contact", "/group-bookings", "/careers", "/policies/privacy", "/policies/terms", "/policies/cancellation", "/policies/refunds"];
  return [
    ...staticRoutes.map((route) => ({ url: `${base}${route}`, lastModified: new Date(), changeFrequency: route === "" ? "weekly" as const : "monthly" as const, priority: route === "" ? 1 : .7 })),
    ...services.map((item) => ({ url: `${base}/services/${item.slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: .8 })),
    ...artists.map((item) => ({ url: `${base}/team/${item.slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: .6 })),
    ...products.map((item) => ({ url: `${base}/shop/${item.slug}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: .7 })),
    ...posts.map((item) => ({ url: `${base}/blog/${item.slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: .6 })),
  ];
}

