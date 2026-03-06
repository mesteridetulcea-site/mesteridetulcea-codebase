"use server"

import { revalidatePath } from "next/cache"
import { createClient, createAdminClient } from "@/lib/supabase/server"
import { createNotification } from "@/actions/notifications"

export async function createReview(mesterId: string, formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Trebuie să fii autentificat pentru a lăsa o recenzie" }
  }

  // Prevent mester from reviewing their own profile
  const { data: ownProfile } = await supabase
    .from("mester_profiles")
    .select("id")
    .eq("id", mesterId)
    .eq("user_id", user.id)
    .single()

  if (ownProfile) {
    return { error: "Nu poți lăsa o recenzie pe propriul profil" }
  }

  const rating = parseInt(formData.get("rating") as string)
  const title = formData.get("title") as string
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
    title: title || null,
    body: body || null,
    approval_status: "approved",
  } as never)

  if (error) {
    console.error("Create review error:", error)
    return { error: "Nu s-a putut crea recenzia" }
  }

  // Notify the mester
  const { data: mesterData } = await adminClient
    .from("mester_profiles")
    .select("user_id")
    .eq("id", mesterId)
    .single() as { data: { user_id: string } | null }

  if (mesterData?.user_id) {
    await createNotification({
      userId: mesterData.user_id,
      type: "review_nou",
      title: "Recenzie nouă pe profilul tău",
      message: `Rating: ${rating}/5${title ? ` — ${title}` : ""}`,
      entityType: "review",
      entityId: mesterId,
    })
  }

  // Confirm to reviewer
  await createNotification({
    userId: user.id,
    type: "review_trimis",
    title: "Recenzia ta a fost trimisă",
    message: `Ai lăsat o recenzie de ${rating}/5 stele.`,
    entityType: "review",
    entityId: mesterId,
  })

  revalidatePath(`/mester/${mesterId}`)
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
