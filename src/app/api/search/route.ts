import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { normalizeText, calculateCategoryMatch, looksLikeServiceRequest } from "@/lib/utils/search"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")?.trim() || ""
  const limit = parseInt(searchParams.get("limit") || "10")

  if (!query || query.length < 2) {
    return NextResponse.json({ mesters: [], categories: [], isServiceRequest: false })
  }

  const supabase = await createClient()

  interface Category {
    id: string
    name: string
    slug: string
    keywords: string[] | null
    order_index: number
  }

  // Get all categories with keywords
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("order_index") as { data: Category[] | null }

  // Score each category
  const scoredCategories =
    categories
      ?.map((category) => ({
        ...category,
        score: calculateCategoryMatch(query, category.name, category.keywords),
      }))
      .filter((c) => c.score > 0)
      .sort((a, b) => b.score - a.score) || []

  const topCategory = scoredCategories[0]

  // Build mester query
  let mesterQuery = supabase
    .from("mesters")
    .select(
      `
      *,
      category:categories(*)
    `
    )
    .eq("approval_status", "approved")

  // If we found a matching category, filter by it
  if (topCategory) {
    mesterQuery = mesterQuery.eq("category_id", topCategory.id)
  } else {
    // Otherwise search by business name
    mesterQuery = mesterQuery.ilike("business_name", `%${query}%`)
  }

  interface Mester {
    id: string
    business_name: string
    slug: string
    subscription_tier: string
    average_rating: number
    total_reviews: number
    city: string
    description: string | null
    category: Category | null
  }

  // Order by tier then rating
  const { data: mesters } = await mesterQuery
    .order("subscription_tier", { ascending: false })
    .order("average_rating", { ascending: false })
    .limit(limit) as { data: Mester[] | null }

  // Get cover photos for mesters
  const mesterIds = mesters?.map((m) => m.id) || []
  const { data: photos } = await supabase
    .from("mester_photos")
    .select("mester_id, url")
    .in("mester_id", mesterIds)
    .eq("is_cover", true)
    .eq("approval_status", "approved") as { data: { mester_id: string; url: string }[] | null }

  const photoMap = Object.fromEntries(
    photos?.map((p) => [p.mester_id, p.url]) || []
  )

  // Add cover photo to each mester
  const mestersWithPhotos =
    mesters?.map((m) => ({
      ...m,
      coverPhoto: photoMap[m.id] || null,
    })) || []

  return NextResponse.json({
    mesters: mestersWithPhotos,
    categories: scoredCategories.slice(0, 5),
    matchedCategory: topCategory || null,
    isServiceRequest: looksLikeServiceRequest(query),
  })
}
