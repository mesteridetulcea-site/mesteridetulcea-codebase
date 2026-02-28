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
  const comment = formData.get("comment") as string

  if (!rating || rating < 1 || rating > 5) {
    return { error: "Rating-ul trebuie să fie între 1 și 5" }
  }

  // Check if user already reviewed this mester
  const { data: existingReview } = await supabase
    .from("reviews")
    .select("id")
    .eq("mester_id", mesterId)
    .eq("user_id", user.id)
    .single()

  if (existingReview) {
    return { error: "Ai lăsat deja o recenzie pentru acest meșter" }
  }

  const adminClient = await createAdminClient()

  // Create review
  const { error } = await adminClient.from("reviews").insert({
    mester_id: mesterId,
    user_id: user.id,
    rating,
    comment: comment || null,
  } as never)

  if (error) {
    console.error("Create review error:", error)
    return { error: "Nu s-a putut crea recenzia" }
  }

  // Update mester average rating
  await updateMesterRating(mesterId)

  // Get mester slug for revalidation
  const { data: mester } = await adminClient
    .from("mesters")
    .select("slug")
    .eq("id", mesterId)
    .single() as { data: { slug: string } | null }

  if (mester) {
    revalidatePath(`/mester/${mester.slug}`)
  }

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
  const comment = formData.get("comment") as string

  if (!rating || rating < 1 || rating > 5) {
    return { error: "Rating-ul trebuie să fie între 1 și 5" }
  }

  // Check ownership
  const { data: review } = await supabase
    .from("reviews")
    .select("mester_id")
    .eq("id", reviewId)
    .eq("user_id", user.id)
    .single() as { data: { mester_id: string } | null }

  if (!review) {
    return { error: "Nu ai permisiunea să modifici această recenzie" }
  }

  const adminClient = await createAdminClient()

  const { error } = await adminClient
    .from("reviews")
    .update({
      rating,
      comment: comment || null,
      updated_at: new Date().toISOString(),
    } as never)
    .eq("id", reviewId)

  if (error) {
    return { error: "Nu s-a putut actualiza recenzia" }
  }

  // Update mester average rating
  await updateMesterRating(review.mester_id)

  // Get mester slug for revalidation
  const { data: mester } = await adminClient
    .from("mesters")
    .select("slug")
    .eq("id", review.mester_id)
    .single() as { data: { slug: string } | null }

  if (mester) {
    revalidatePath(`/mester/${mester.slug}`)
  }

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
    .eq("user_id", user.id)
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

  // Update mester average rating
  await updateMesterRating(review.mester_id)

  // Get mester slug for revalidation
  const { data: mester } = await adminClient
    .from("mesters")
    .select("slug")
    .eq("id", review.mester_id)
    .single() as { data: { slug: string } | null }

  if (mester) {
    revalidatePath(`/mester/${mester.slug}`)
  }

  return { success: true }
}

async function updateMesterRating(mesterId: string) {
  const adminClient = await createAdminClient()

  // Calculate new average
  const { data: reviews } = await adminClient
    .from("reviews")
    .select("rating")
    .eq("mester_id", mesterId) as { data: { rating: number }[] | null }

  if (!reviews || reviews.length === 0) {
    // No reviews - reset to 0
    await adminClient
      .from("mesters")
      .update({
        average_rating: 0,
        total_reviews: 0,
      } as never)
      .eq("id", mesterId)
    return
  }

  const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0)
  const averageRating = Math.round((totalRating / reviews.length) * 10) / 10

  await adminClient
    .from("mesters")
    .update({
      average_rating: averageRating,
      total_reviews: reviews.length,
    } as never)
    .eq("id", mesterId)
}

export async function getReviewsForMester(mesterId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("reviews")
    .select(`
      id, rating, comment, created_at, updated_at,
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
    .eq("user_id", user.id)
    .single()

  return { review: data }
}
