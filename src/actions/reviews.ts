"use server"

import { revalidatePath } from "next/cache"
import { createClient, createAdminClient } from "@/lib/supabase/server"

export async function createReview(mesterId: string, formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Trebuie să fii autentificat pentru a lăsa o recenzie" }
  }

  const rating = parseInt(formData.get("rating") as string)
  const body = formData.get("comment") as string

  if (!rating || rating < 1 || rating > 5) {
    return { error: "Rating-ul trebuie să fie între 1 și 5" }
  }

  // Check if user already reviewed this mester
  const { data: existingReview } = await supabase
    .from("reviews")
    .select("id")
    .eq("mester_id", mesterId)
    .eq("client_id", user.id)
    .single()

  if (existingReview) {
    return { error: "Ai lăsat deja o recenzie pentru acest meșter" }
  }

  const adminClient = await createAdminClient()

  const { error } = await adminClient.from("reviews").insert({
    mester_id: mesterId,
    client_id: user.id,
    rating,
    body: body || null,
  } as never)

  if (error) {
    console.error("Create review error:", error)
    return { error: "Nu s-a putut crea recenzia" }
  }

  revalidatePath(`/mester/${mesterId}`)
  return { success: true }
}

export async function updateReview(reviewId: string, formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Trebuie să fii autentificat" }
  }

  const rating = parseInt(formData.get("rating") as string)
  const body = formData.get("comment") as string

  if (!rating || rating < 1 || rating > 5) {
    return { error: "Rating-ul trebuie să fie între 1 și 5" }
  }

  // Check ownership
  const { data: review } = await supabase
    .from("reviews")
    .select("mester_id")
    .eq("id", reviewId)
    .eq("client_id", user.id)
    .single() as { data: { mester_id: string } | null }

  if (!review) {
    return { error: "Nu ai permisiunea să modifici această recenzie" }
  }

  const adminClient = await createAdminClient()

  const { error } = await adminClient
    .from("reviews")
    .update({
      rating,
      body: body || null,
      updated_at: new Date().toISOString(),
    } as never)
    .eq("id", reviewId)

  if (error) {
    return { error: "Nu s-a putut actualiza recenzia" }
  }

  revalidatePath(`/mester/${review.mester_id}`)
  return { success: true }
}

export async function deleteReview(reviewId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Trebuie să fii autentificat" }
  }

  // Check ownership
  const { data: review } = await supabase
    .from("reviews")
    .select("mester_id")
    .eq("id", reviewId)
    .eq("client_id", user.id)
    .single() as { data: { mester_id: string } | null }

  if (!review) {
    return { error: "Nu ai permisiunea să ștergi această recenzie" }
  }

  const adminClient = await createAdminClient()

  const { error } = await adminClient
    .from("reviews")
    .delete()
    .eq("id", reviewId)

  if (error) {
    return { error: "Nu s-a putut șterge recenzia" }
  }

  revalidatePath(`/mester/${review.mester_id}`)
  return { success: true }
}

export async function getReviewsForMester(mesterId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("reviews")
    .select(`
      id, rating, body, created_at, updated_at,
      profile:profiles(full_name, avatar_url)
    `)
    .eq("mester_id", mesterId)
    .order("created_at", { ascending: false })

  if (error) {
    return { error: "Nu s-au putut încărca recenziile", reviews: [] }
  }

  return { reviews: data }
}

export async function getUserReviewForMester(mesterId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { review: null }
  }

  const { data } = await supabase
    .from("reviews")
    .select("*")
    .eq("mester_id", mesterId)
    .eq("client_id", user.id)
    .single()

  return { review: data }
}
