"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import type { SubscriptionTier, ApprovalStatus } from "@/types/database"

export async function toggleFavorite(mesterId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Trebuie să fii autentificat" }
  }

  // Check if already favorited
  const { data: existing } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("mester_id", mesterId)
    .single() as { data: { id: string } | null }

  if (existing) {
    // Remove favorite
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("id", existing.id)

    if (error) {
      return { error: "Nu s-a putut elimina din favorite" }
    }

    revalidatePath("/cont/favorite")
    return { isFavorited: false }
  } else {
    // Add favorite
    const { error } = await supabase.from("favorites").insert({
      user_id: user.id,
      mester_id: mesterId,
    } as never)

    if (error) {
      return { error: "Nu s-a putut adăuga la favorite" }
    }

    revalidatePath("/cont/favorite")
    return { isFavorited: true }
  }
}

interface FavoriteMester {
  id: string
  profile_id: string
  category_id: string
  business_name: string
  slug: string
  description: string | null
  experience_years: number | null
  subscription_tier: SubscriptionTier
  approval_status: ApprovalStatus
  is_featured: boolean
  average_rating: number
  total_reviews: number
  total_views: number
  city: string
  address: string | null
  whatsapp_number: string | null
  created_at: string
  updated_at: string
  category: {
    id: string
    name: string
    slug: string
  } | null
}

interface Favorite {
  id: string
  user_id: string
  mester_id: string
  created_at: string
  mester: FavoriteMester | null
}

export async function getFavorites(): Promise<Favorite[]> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data } = await supabase
    .from("favorites")
    .select(
      `
      *,
      mester:mesters(
        *,
        category:categories(*)
      )
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (data || []) as Favorite[]
}

export async function checkIsFavorited(mesterId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return false
  }

  const { data } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("mester_id", mesterId)
    .single()

  return !!data
}
