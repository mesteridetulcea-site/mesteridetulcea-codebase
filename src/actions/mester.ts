"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { uploadAvatar } from "@/lib/utils/upload"
import { createNotification } from "@/actions/notifications"

export async function updateMesterProfile(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Trebuie să fii autentificat" }
  }

  const displayName = formData.get("businessName") as string
  const bio = formData.get("description") as string
  const yearsExperience = formData.get("experienceYears") as string
  const whatsappNumber = formData.get("whatsappNumber") as string
  const neighborhood = formData.get("address") as string
  const categoryId = formData.get("categoryId") as string
  const avatarFile = formData.get("avatar") as File | null

  // Get existing mester profile
  const { data: mester } = await supabase
    .from("mester_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single()

  if (!mester) {
    return { error: "Nu ai un profil de meșter" }
  }

  // Upload avatar if provided
  if (avatarFile && avatarFile.size > 0) {
    const avatarUrl = await uploadAvatar(user.id, avatarFile)
    if (avatarUrl) {
      await supabase
        .from("profiles")
        .update({ avatar_url: avatarUrl } as never)
        .eq("id", user.id)
    } else {
      return { error: "Imaginea de profil nu a putut fi încărcată. Acceptăm JPG, PNG, WebP până la 2MB." }
    }
  }

  const { error } = await supabase
    .from("mester_profiles")
    .update({
      display_name: displayName,
      bio: bio || null,
      years_experience: yearsExperience ? parseInt(yearsExperience) : null,
      whatsapp_number: whatsappNumber || null,
      neighborhood: neighborhood || null,
      updated_at: new Date().toISOString(),
    } as never)
    .eq("id", (mester as { id: string }).id)

  if (error) {
    return { error: "Nu s-a putut actualiza profilul" }
  }

  // Update category: replace existing entry
  if (categoryId) {
    await supabase
      .from("mester_categories")
      .delete()
      .eq("mester_id", (mester as { id: string }).id)

    await supabase.from("mester_categories").insert({
      mester_id: (mester as { id: string }).id,
      category_id: categoryId,
    } as never)
  }

  await createNotification({
    userId: user.id,
    type: "profil_actualizat",
    title: "Profilul tău a fost actualizat",
    message: "Modificările sunt acum vizibile pe profilul tău public.",
  })

  revalidatePath("/mester-cont")
  revalidatePath("/mester-cont/profil")
  revalidatePath("/cont/setari")
  return { success: true }
}

export async function updateClientProfile(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Trebuie să fii autentificat" }
  }

  const fullName = formData.get("fullName") as string
  const phone = formData.get("phone") as string
  const avatarFile = formData.get("avatar") as File | null

  let avatarUrl: string | undefined
  if (avatarFile && avatarFile.size > 0) {
    const url = await uploadAvatar(user.id, avatarFile)
    if (url) {
      avatarUrl = url
    } else {
      return { error: "Imaginea de profil nu a putut fi încărcată. Acceptăm JPG, PNG, WebP până la 2MB." }
    }
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName || null,
      phone: phone || null,
      ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
      updated_at: new Date().toISOString(),
    } as never)
    .eq("id", user.id)

  if (error) {
    return { error: "Nu s-a putut actualiza profilul" }
  }

  await createNotification({
    userId: user.id,
    type: "cont_actualizat",
    title: "Setările contului au fost salvate",
    message: "Datele tale au fost actualizate cu succes.",
  })

  revalidatePath("/cont")
  revalidatePath("/cont/setari")
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
    .from("mester_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single()

  if (existingMester) {
    return { error: "Ai deja un profil de meșter" }
  }

  const displayName = formData.get("businessName") as string
  const categoryId = formData.get("categoryId") as string
  const bio = formData.get("description") as string
  const yearsExperience = formData.get("experienceYears") as string
  const whatsappNumber = formData.get("whatsappNumber") as string
  const neighborhood = formData.get("address") as string

  const { data: newMester, error: mesterError } = await supabase
    .from("mester_profiles")
    .insert({
      user_id: user.id,
      display_name: displayName,
      bio: bio || null,
      years_experience: yearsExperience ? parseInt(yearsExperience) : null,
      whatsapp_number: whatsappNumber || null,
      neighborhood: neighborhood || null,
      city: "Tulcea",
      subscription_tier: "standard",
      approval_status: "pending",
      is_featured: false,
      avg_rating: 0,
      reviews_count: 0,
      views_count: 0,
    } as never)
    .select("id")
    .single()

  if (mesterError || !newMester) {
    console.error("Mester creation error:", mesterError)
    return { error: "Nu s-a putut crea profilul de meșter" }
  }

  // Insert category association
  if (categoryId) {
    await supabase.from("mester_categories").insert({
      mester_id: (newMester as { id: string }).id,
      category_id: categoryId,
    } as never)
  }

  // NOTE: Do NOT change profiles.role here.
  // Role is updated to "mester" only when the admin approves the profile.

  await createNotification({
    userId: user.id,
    type: "aplicatie_trimisa",
    title: "Aplicația ta a fost trimisă spre verificare",
    message: "Echipa noastră va verifica profilul tău și vei fi notificat prin email și în aplicație.",
    entityType: "mester_profile",
    entityId: (newMester as { id: string }).id,
  })

  revalidatePath("/", "layout")
  redirect("/mester-cont")
}

interface MesterProfileData {
  id: string
  user_id: string
  display_name: string
  bio: string | null
  years_experience: number | null
  subscription_tier: string
  approval_status: string
  rejection_reason: string | null
  is_featured: boolean
  avg_rating: number
  reviews_count: number
  views_count: number
  city: string
  neighborhood: string | null
  whatsapp_number: string | null
  created_at: string
  updated_at: string
  mester_categories: {
    category_id: string
    category: {
      id: string
      name: string
      slug: string
    } | null
  }[]
}

export async function getMesterProfile(): Promise<MesterProfileData | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: mester, error } = await supabase
    .from("mester_profiles")
    .select(
      `
      id, user_id, display_name, bio, years_experience, subscription_tier,
      approval_status, rejection_reason, is_featured, avg_rating, reviews_count, views_count,
      city, neighborhood, whatsapp_number, created_at, updated_at,
      mester_categories(category_id, category:categories(id, name, slug))
    `
    )
    .eq("user_id", user.id)
    .maybeSingle()

  if (error) {
    console.error("getMesterProfile error:", error)
    return null
  }

  return mester as MesterProfileData | null
}
