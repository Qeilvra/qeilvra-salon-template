import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/admin/", "/account/", "/checkout", "/book/confirmation"] }], sitemap: "https://maisonelan.example/sitemap.xml" };
}

