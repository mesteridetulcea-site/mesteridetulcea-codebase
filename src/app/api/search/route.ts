import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { calculateCategoryMatch, looksLikeServiceRequest } from "@/lib/utils/search"

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
    icon: string | null
    sort_order: number
  }

  // Get all categories
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order") as { data: Category[] | null }

  // Score each category by name match (no keywords column in real DB)
  const scoredCategories =
    categories
      ?.map((category) => ({
        ...category,
        score: calculateCategoryMatch(query, category.name, null),
      }))
      .filter((c) => c.score > 0)
      .sort((a, b) => b.score - a.score) || []

  const topCategory = scoredCategories[0]

  interface MesterResult {
    id: string
    display_name: string
    subscription_tier: string
    avg_rating: number
    reviews_count: number
    city: string
    bio: string | null
    mester_categories: {
      category_id: string
      category: Category | null
    }[]
  }

  let mesters: MesterResult[] = []

  if (topCategory) {
    // Get mester ids in this category
    const { data: categoryMesters } = await supabase
      .from("mester_categories")
      .select("mester_id")
      .eq("category_id", topCategory.id) as { data: { mester_id: string }[] | null }

    if (categoryMesters && categoryMesters.length > 0) {
      const ids = categoryMesters.map((m) => m.mester_id)

      const { data } = await supabase
        .from("mester_profiles")
        .select(`
          id, display_name, subscription_tier, avg_rating, reviews_count, city, bio,
          mester_categories(category_id, category:categories(*))
        `)
        .eq("approval_status", "approved")
        .in("id", ids)
        .order("subscription_tier", { ascending: false })
        .order("avg_rating", { ascending: false })
        .limit(limit) as { data: MesterResult[] | null }

      mesters = data || []
    }
  } else {
    // Search by display_name
    const { data } = await supabase
      .from("mester_profiles")
      .select(`
        id, display_name, subscription_tier, avg_rating, reviews_count, city, bio,
        mester_categories(category_id, category:categories(*))
      `)
      .eq("approval_status", "approved")
      .ilike("display_name", `%${query}%`)
      .order("subscription_tier", { ascending: false })
      .order("avg_rating", { ascending: false })
      .limit(limit) as { data: MesterResult[] | null }

    mesters = data || []
  }

  // Get cover photos
  const mesterIds = mesters.map((m) => m.id)
  const { data: photos } = await supabase
    .from("mester_photos")
    .select("mester_id, public_url")
    .in("mester_id", mesterIds)
    .eq("photo_type", "profile")
    .eq("approval_status", "approved") as { data: { mester_id: string; public_url: string }[] | null }

  const photoMap = Object.fromEntries(
    photos?.map((p) => [p.mester_id, p.public_url]) || []
  )

  const mestersWithPhotos = mesters.map((m) => ({
    ...m,
    coverPhoto: photoMap[m.id] || null,
  }))

  return NextResponse.json({
    mesters: mestersWithPhotos,
    categories: scoredCategories.slice(0, 5),
    matchedCategory: topCategory || null,
    isServiceRequest: looksLikeServiceRequest(query),
  })
}
