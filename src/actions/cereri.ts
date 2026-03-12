"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient, createAdminClient } from "@/lib/supabase/server"
import { uploadCererePhoto } from "@/lib/utils/upload"
import { createNotification } from "@/actions/notifications"

export async function createCerere(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Trebuie să fii autentificat" }
  }

  // Check that user has a phone number set
  const { data: profile } = await supabase
    .from("profiles")
    .select("phone")
    .eq("id", user.id)
    .single() as { data: { phone: string | null } | null }

  if (!profile?.phone?.trim()) {
    return {
      error:
        "Trebuie să adaugi un număr de telefon în setările contului înainte de a posta o cerere.",
    }
  }

  const title = (formData.get("title") as string)?.trim()
  const originalMessage = (formData.get("original_message") as string)?.trim()
  const categoryId = formData.get("categoryId") as string

  if (!title) return { error: "Titlul este obligatoriu" }
  if (!originalMessage) return { error: "Descrierea este obligatorie" }
  if (!categoryId) return { error: "Categoria este obligatorie" }

  // Insert the cerere
  const { data: cerere, error: insertError } = await supabase
    .from("service_requests")
    .insert({
      client_id: user.id,
      title,
      original_message: originalMessage,
      detected_category_id: categoryId,
      status: "open",
      client_phone: profile.phone,
    } as never)
    .select("id")
    .single() as { data: { id: string } | null; error: unknown }

  if (insertError || !cerere) {
    console.error("createCerere insert error:", insertError)
    return { error: "Nu s-a putut crea cererea. Încearcă din nou." }
  }

  // Upload photos if provided (max 5) — stored in cerere_photos pending admin approval
  const photoFiles = formData.getAll("photos") as File[]
  const validPhotos = photoFiles
    .filter((f) => f instanceof File && f.size > 0)
    .slice(0, 5)

  for (const file of validPhotos) {
    const url = await uploadCererePhoto(user.id, cerere.id, file)
    if (url) {
      await supabase
        .from("cerere_photos")
        .insert({ cerere_id: cerere.id, url, approval_status: "pending" } as never)
    }
  }

  // Confirm to the client that their cerere was posted
  await createNotification({
    userId: user.id,
    type: "cerere_postata",
    title: "Cererea ta a fost postată",
    message: title,
    entityType: "cerere",
    entityId: cerere.id,
  })

  // Notify mesters in the same category
  const adminClient = await createAdminClient()
  const { data: mesterCategories } = await adminClient
    .from("mester_categories")
    .select("mester_id, mester_profiles!inner(user_id)")
    .eq("category_id", categoryId) as {
      data: { mester_id: string; mester_profiles: { user_id: string } }[] | null
    }

  for (const mc of mesterCategories ?? []) {
    await createNotification({
      userId: mc.mester_profiles.user_id,
      type: "cerere_noua",
      title: "Cerere nouă disponibilă",
      message: title,
      entityType: "cerere",
      entityId: cerere.id,
    })
  }

  revalidatePath("/cont/cereri")
  redirect("/cont/cereri")
}

export type CerereWithCategory = {
  id: string
  title: string | null
  original_message: string
  detected_category_id: string | null
  client_phone: string | null
  status: string | null
  created_at: string
  category: { name: string } | null
  cerere_photos: { id: string; url: string; approval_status: string }[]
}

export async function getMesterCereri(): Promise<CerereWithCategory[]> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  // Get mester profile and their primary category
  const { data: mester } = await supabase
    .from("mester_profiles")
    .select("id, mester_categories(category_id)")
    .eq("user_id", user.id)
    .maybeSingle() as { data: { id: string; mester_categories: { category_id: string }[] } | null }

  if (!mester) redirect("/devino-mester")

  const primaryCategoryId =
    (mester.mester_categories as { category_id: string }[])?.[0]?.category_id

  if (!primaryCategoryId) return []

  // Exclude requests from banned clients
  const { data: bannedUsers } = await supabase
    .from("profiles")
    .select("id")
    .eq("is_banned", true) as { data: { id: string }[] | null }
  const bannedClientIds = bannedUsers?.map((u) => u.id) ?? []

  let cerereQuery = supabase
    .from("service_requests")
    .select("id, title, original_message, detected_category_id, client_phone, status, created_at, category:categories(name), cerere_photos(id, url, approval_status)")
    .eq("detected_category_id", primaryCategoryId)
    .eq("status", "open")
    .order("created_at", { ascending: false })

  if (bannedClientIds.length > 0) {
    cerereQuery = cerereQuery.not("client_id", "in", `(${bannedClientIds.join(",")})`)
  }

  const { data } = await cerereQuery
  return (data || []) as CerereWithCategory[]
}

export async function closeCerere(id: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: "Neautentificat" }

  const { error } = await supabase
    .from("service_requests")
    .update({ status: "closed" } as never)
    .eq("id", id)
    .eq("client_id", user.id)

  if (error) return { error: "Nu s-a putut actualiza cererea" }

  await createNotification({
    userId: user.id,
    type: "cerere_inchisa",
    title: "Cererea ta a fost închisă",
    message: "Cererea nu mai este vizibilă pentru meșteri.",
    entityType: "cerere",
    entityId: id,
  })

  revalidatePath("/cont/cereri")
  return { success: true }
}

export async function deleteCerere(id: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: "Neautentificat" }

  const { error } = await supabase
    .from("service_requests")
    .delete()
    .eq("id", id)
    .eq("client_id", user.id)

  if (error) return { error: "Nu s-a putut șterge cererea" }

  revalidatePath("/cont/cereri")
  return { success: true }
}
