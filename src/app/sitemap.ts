import type { MetadataRoute } from "next"
import { createClient } from "@/lib/supabase/server"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://mesteridetulcea.ro").replace(/\/$/, "")

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/mesteri`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/cauta`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/despre`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/intrebari-frecvente`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/donatii`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${baseUrl}/termeni`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/confidentialitate`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ]

  // Dynamic mester profile pages
  const supabase = await createClient()
  const { data: mesters } = await supabase
    .from("mester_profiles")
    .select("id, updated_at")
    .eq("approval_status", "approved") as { data: { id: string; updated_at: string }[] | null }

  const mesterRoutes: MetadataRoute.Sitemap = (mesters || []).map((m) => ({
    url: `${baseUrl}/mester/${m.id}`,
    lastModified: new Date(m.updated_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  return [...staticRoutes, ...mesterRoutes]
}
