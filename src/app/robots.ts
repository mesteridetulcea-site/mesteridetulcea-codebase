import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mesteridetulcea.ro"
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/", "/cont/", "/mester-cont/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
