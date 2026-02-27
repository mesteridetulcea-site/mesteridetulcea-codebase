"use server"

import { revalidatePath } from "next/cache"
import { createClient, createAdminClient } from "@/lib/supabase/server"

async function checkIsAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: "Nu ești autentificat", isAdmin: false, userId: null }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single<{ role: string }>()

  if (profile?.role !== "admin") {
    return { error: "Nu ai permisiuni de administrator", isAdmin: false, userId: null }
  }

  return { error: null, isAdmin: true, userId: user.id }
}

export async function approveMester(mesterId: string, notes?: string) {
  const auth = await checkIsAdmin()
  if (!auth.isAdmin) return { error: auth.error }

  const supabase = await createAdminClient()

  const { error } = await supabase
    .from("mesters")
    .update({ approval_status: "approved" } as never)
    .eq("id", mesterId)

  if (error) {
    return { error: "Nu s-a putut aproba meșterul" }
  }

  // Create audit log
  await supabase.from("audit_logs").insert({
    admin_id: auth.userId!,
    action: "approve_mester",
    entity_type: "mester",
    entity_id: mesterId,
    details: { notes },
  } as never)

  revalidatePath("/admin/mesteri")
  return { success: true }
}

export async function rejectMester(mesterId: string, notes?: string) {
  const auth = await checkIsAdmin()
  if (!auth.isAdmin) return { error: auth.error }

  const supabase = await createAdminClient()

  const { error } = await supabase
    .from("mesters")
    .update({ approval_status: "rejected" } as never)
    .eq("id", mesterId)

  if (error) {
    return { error: "Nu s-a putut respinge meșterul" }
  }

  // Create audit log
  await supabase.from("audit_logs").insert({
    admin_id: auth.userId!,
    action: "reject_mester",
    entity_type: "mester",
    entity_id: mesterId,
    details: { notes },
  } as never)

  revalidatePath("/admin/mesteri")
  return { success: true }
}

export async function approvePhoto(photoId: string) {
  const auth = await checkIsAdmin()
  if (!auth.isAdmin) return { error: auth.error }

  const supabase = await createAdminClient()

  const { error } = await supabase
    .from("mester_photos")
    .update({ approval_status: "approved" } as never)
    .eq("id", photoId)

  if (error) {
    return { error: "Nu s-a putut aproba fotografia" }
  }

  await supabase.from("audit_logs").insert({
    admin_id: auth.userId!,
    action: "approve_photo",
    entity_type: "mester_photo",
    entity_id: photoId,
    details: null,
  } as never)

  revalidatePath("/admin/fotografii")
  return { success: true }
}

export async function rejectPhoto(photoId: string) {
  const auth = await checkIsAdmin()
  if (!auth.isAdmin) return { error: auth.error }

  const supabase = await createAdminClient()

  const { error } = await supabase
    .from("mester_photos")
    .update({ approval_status: "rejected" } as never)
    .eq("id", photoId)

  if (error) {
    return { error: "Nu s-a putut respinge fotografia" }
  }

  await supabase.from("audit_logs").insert({
    admin_id: auth.userId!,
    action: "reject_photo",
    entity_type: "mester_photo",
    entity_id: photoId,
    details: null,
  } as never)

  revalidatePath("/admin/fotografii")
  return { success: true }
}

export async function createCategory(formData: FormData) {
  const auth = await checkIsAdmin()
  if (!auth.isAdmin) return { error: auth.error }

  const supabase = await createAdminClient()

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const icon = formData.get("icon") as string
  const keywordsStr = formData.get("keywords") as string

  const slug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

  const keywords = keywordsStr
    ? keywordsStr.split(",").map((k) => k.trim())
    : null

  // Get max order_index
  const { data: categories } = await supabase
    .from("categories")
    .select("order_index")
    .order("order_index", { ascending: false })
    .limit(1) as { data: { order_index: number }[] | null }

  const nextOrderIndex = (categories?.[0]?.order_index || 0) + 1

  const { error } = await supabase.from("categories").insert({
    name,
    slug,
    description: description || null,
    icon: icon || null,
    keywords,
    order_index: nextOrderIndex,
  } as never)

  if (error) {
    return { error: "Nu s-a putut crea categoria" }
  }

  await supabase.from("audit_logs").insert({
    admin_id: auth.userId!,
    action: "create_category",
    entity_type: "category",
    entity_id: slug,
    details: { name },
  } as never)

  revalidatePath("/admin/categorii")
  return { success: true }
}

export async function updateCategory(categoryId: string, formData: FormData) {
  const auth = await checkIsAdmin()
  if (!auth.isAdmin) return { error: auth.error }

  const supabase = await createAdminClient()

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const icon = formData.get("icon") as string
  const keywordsStr = formData.get("keywords") as string

  const keywords = keywordsStr
    ? keywordsStr.split(",").map((k) => k.trim())
    : null

  const { error } = await supabase
    .from("categories")
    .update({
      name,
      description: description || null,
      icon: icon || null,
      keywords,
    } as never)
    .eq("id", categoryId)

  if (error) {
    return { error: "Nu s-a putut actualiza categoria" }
  }

  revalidatePath("/admin/categorii")
  return { success: true }
}

export async function deleteCategory(categoryId: string) {
  const auth = await checkIsAdmin()
  if (!auth.isAdmin) return { error: auth.error }

  const supabase = await createAdminClient()

  // Check if category has mesters
  const { count } = await supabase
    .from("mesters")
    .select("*", { count: "exact", head: true })
    .eq("category_id", categoryId)

  if (count && count > 0) {
    return { error: "Nu poți șterge o categorie care are meșteri asociați" }
  }

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", categoryId)

  if (error) {
    return { error: "Nu s-a putut șterge categoria" }
  }

  revalidatePath("/admin/categorii")
  return { success: true }
}

export async function toggleMesterFeatured(mesterId: string) {
  const auth = await checkIsAdmin()
  if (!auth.isAdmin) return { error: auth.error }

  const supabase = await createAdminClient()

  // Get current status
  const { data: mester } = await supabase
    .from("mesters")
    .select("is_featured")
    .eq("id", mesterId)
    .single() as { data: { is_featured: boolean } | null }

  if (!mester) {
    return { error: "Meșterul nu a fost găsit" }
  }

  const newFeaturedStatus = !mester.is_featured
  const { error } = await supabase
    .from("mesters")
    .update({ is_featured: newFeaturedStatus } as never)
    .eq("id", mesterId)

  if (error) {
    return { error: "Nu s-a putut actualiza statusul" }
  }

  revalidatePath("/admin/mesteri")
  return { success: true, isFeatured: newFeaturedStatus }
}
