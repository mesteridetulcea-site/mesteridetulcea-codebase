"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export async function updateMesterProfile(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Trebuie să fii autentificat" }
  }

  const businessName = formData.get("businessName") as string
  const description = formData.get("description") as string
  const experienceYears = formData.get("experienceYears") as string
  const whatsappNumber = formData.get("whatsappNumber") as string
  const address = formData.get("address") as string
  const categoryId = formData.get("categoryId") as string

  // Get existing mester profile
  const { data: mester } = await supabase
    .from("mesters")
    .select("id")
    .eq("profile_id", user.id)
    .single()

  if (!mester) {
    return { error: "Nu ai un profil de meșter" }
  }

  const { error } = await supabase
    .from("mesters")
    .update({
      business_name: businessName,
      description,
      experience_years: experienceYears ? parseInt(experienceYears) : null,
      whatsapp_number: whatsappNumber || null,
      address: address || null,
      category_id: categoryId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", mester.id)

  if (error) {
    return { error: "Nu s-a putut actualiza profilul" }
  }

  revalidatePath("/mester-cont")
  return { success: true }
}

export async function applyAsMester(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Trebuie să fii autentificat" }
  }

  // Check if already a mester
  const { data: existingMester } = await supabase
    .from("mesters")
    .select("id")
    .eq("profile_id", user.id)
    .single()

  if (existingMester) {
    return { error: "Ai deja un profil de meșter" }
  }

  const businessName = formData.get("businessName") as string
  const categoryId = formData.get("categoryId") as string
  const description = formData.get("description") as string
  const experienceYears = formData.get("experienceYears") as string
  const whatsappNumber = formData.get("whatsappNumber") as string
  const address = formData.get("address") as string

  // Generate slug
  const slug = businessName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

  // Check if slug exists
  const { data: existingSlug } = await supabase
    .from("mesters")
    .select("id")
    .eq("slug", slug)
    .single()

  const finalSlug = existingSlug ? `${slug}-${Date.now()}` : slug

  const { error: mesterError } = await supabase.from("mesters").insert({
    profile_id: user.id,
    business_name: businessName,
    slug: finalSlug,
    category_id: categoryId,
    description,
    experience_years: experienceYears ? parseInt(experienceYears) : null,
    whatsapp_number: whatsappNumber || null,
    address: address || null,
    city: "Tulcea",
    subscription_tier: "ucenic",
    approval_status: "pending",
    is_featured: false,
    average_rating: 0,
    total_reviews: 0,
    total_views: 0,
  })

  if (mesterError) {
    console.error("Mester creation error:", mesterError)
    return { error: "Nu s-a putut crea profilul de meșter" }
  }

  // Update profile role
  await supabase
    .from("profiles")
    .update({ role: "mester" })
    .eq("id", user.id)

  revalidatePath("/", "layout")
  redirect("/mester-cont")
}

export async function getMesterProfile() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: mester } = await supabase
    .from("mesters")
    .select(
      `
      *,
      category:categories(*),
      profile:profiles(*)
    `
    )
    .eq("profile_id", user.id)
    .single()

  return mester
}
