"use server"

import { revalidatePath, unstable_noStore as noStore } from "next/cache"
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
    .select("client_id")
    .eq("client_id", user.id)
    .eq("mester_id", mesterId)
    .maybeSingle() as { data: { client_id: string } | null }

  if (existing) {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("client_id", user.id)
      .eq("mester_id", mesterId)

    if (error) {
      return { error: "Nu s-a putut elimina din favorite" }
    }

    revalidatePath("/cont/favorite")
    revalidatePath(`/mester/${mesterId}`)
    return { isFavorited: false }
  } else {
    const { error } = await supabase.from("favorites").insert({
      client_id: user.id,
      mester_id: mesterId,
    } as never)

    if (error) {
      return { error: "Nu s-a putut adăuga la favorite" }
    }

    revalidatePath("/cont/favorite")
    revalidatePath(`/mester/${mesterId}`)
    return { isFavorited: true }
  }
}

interface FavoriteMesterCategory {
  category_id: string
  category: {
    id: string
    name: string
    slug: string
  } | null
}

interface FavoriteMester {
  id: string
  user_id: string
  display_name: string
  bio: string | null
  years_experience: number | null
  subscription_tier: SubscriptionTier
  approval_status: ApprovalStatus
  is_featured: boolean
  avg_rating: number
  reviews_count: number
  views_count: number
  city: string
  neighborhood: string | null
  whatsapp_number: string | null
  created_at: string
  updated_at: string
  mester_categories: FavoriteMesterCategory[]
}

interface Favorite {
  id: string
  client_id: string
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
      mester:mester_profiles(
        *,
        mester_categories(category_id, category:categories(id, name, slug))
      )
    `
    )
    .eq("client_id", user.id)
    .order("created_at", { ascending: false })

  return (data || []) as Favorite[]
}

export async function checkIsFavorited(mesterId: string) {
  noStore()
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return false
  }

  const { data } = await supabase
    .from("favorites")
    .select("client_id")
    .eq("client_id", user.id)
    .eq("mester_id", mesterId)
    .maybeSingle()

  return !!data
}
