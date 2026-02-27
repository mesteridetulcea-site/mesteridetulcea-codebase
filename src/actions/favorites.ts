"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

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
    .single()

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
    })

    if (error) {
      return { error: "Nu s-a putut adăuga la favorite" }
    }

    revalidatePath("/cont/favorite")
    return { isFavorited: true }
  }
}

export async function getFavorites() {
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

  return data || []
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
