import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/signin",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/dashboard",
    "/dashboard/pricing",
    "/dashboard/settings",
    "/dashboard/entries",
    "/dashboard/journal",
  ];

  const now = new Date();
  return staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route.startsWith("/dashboard")
      ? "weekly"
      : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
