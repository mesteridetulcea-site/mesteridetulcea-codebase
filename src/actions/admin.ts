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
    .from("mester_profiles")
    .update({ approval_status: "approved" } as never)
    .eq("id", mesterId)

  if (error) {
    return { error: "Nu s-a putut aproba meșterul" }
  }

  await supabase.from("admin_logs").insert({
    admin_id: auth.userId!,
    action: "approve_mester",
    target_type: "mester",
    target_id: mesterId,
    notes: notes || null,
  } as never)

  revalidatePath("/admin/mesteri")
  return { success: true }
}

export async function rejectMester(mesterId: string, notes?: string) {
  const auth = await checkIsAdmin()
  if (!auth.isAdmin) return { error: auth.error }

  const supabase = await createAdminClient()

  const { error } = await supabase
    .from("mester_profiles")
    .update({ approval_status: "rejected" } as never)
    .eq("id", mesterId)

  if (error) {
    return { error: "Nu s-a putut respinge meșterul" }
  }

  await supabase.from("admin_logs").insert({
    admin_id: auth.userId!,
    action: "reject_mester",
    target_type: "mester",
    target_id: mesterId,
    notes: notes || null,
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

  await supabase.from("admin_logs").insert({
    admin_id: auth.userId!,
    action: "approve_photo",
    target_type: "mester_photo",
    target_id: photoId,
    notes: null,
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

  await supabase.from("admin_logs").insert({
    admin_id: auth.userId!,
    action: "reject_photo",
    target_type: "mester_photo",
    target_id: photoId,
    notes: null,
  } as never)

  revalidatePath("/admin/fotografii")
  return { success: true }
}

export async function createCategory(formData: FormData) {
  const auth = await checkIsAdmin()
  if (!auth.isAdmin) return { error: auth.error }

  const supabase = await createAdminClient()

  const name = formData.get("name") as string
  const icon = formData.get("icon") as string

  const slug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

  // Get max sort_order
  const { data: categories } = await supabase
    .from("categories")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1) as { data: { sort_order: number }[] | null }

  const nextSortOrder = (categories?.[0]?.sort_order || 0) + 1

  const { error } = await supabase.from("categories").insert({
    name,
    slug,
    icon: icon || null,
    sort_order: nextSortOrder,
  } as never)

  if (error) {
    return { error: "Nu s-a putut crea categoria" }
  }

  await supabase.from("admin_logs").insert({
    admin_id: auth.userId!,
    action: "create_category",
    target_type: "category",
    target_id: slug,
    notes: name,
  } as never)

  revalidatePath("/admin/categorii")
  return { success: true }
}

export async function updateCategory(categoryId: string, formData: FormData) {
  const auth = await checkIsAdmin()
  if (!auth.isAdmin) return { error: auth.error }

  const supabase = await createAdminClient()

  const name = formData.get("name") as string
  const icon = formData.get("icon") as string

  const { error } = await supabase
    .from("categories")
    .update({
      name,
      icon: icon || null,
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
    .from("mester_categories")
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

export async function getAdminMesters() {
  const auth = await checkIsAdmin()
  if (!auth.isAdmin) return { error: auth.error, data: null }

  const supabase = await createAdminClient()

  const { data, error } = await supabase
    .from("mester_profiles")
    .select(`
      id, display_name, approval_status, subscription_tier, is_featured, created_at,
      mester_categories(category:categories(name)),
      profile:profiles(email, full_name)
    `)
    .order("created_at", { ascending: false }) as {
      data: Array<{
        id: string
        display_name: string
        approval_status: string
        subscription_tier: string
        is_featured: boolean
        created_at: string
        mester_categories: { category: { name: string } | null }[]
        profile: { email: string; full_name: string | null } | null
      }> | null
      error: unknown
    }

  if (error) return { error: "Nu s-au putut încărca meșterii", data: null }

  return { error: null, data: data || [] }
}

export async function toggleMesterFeatured(mesterId: string) {
  const auth = await checkIsAdmin()
  if (!auth.isAdmin) return { error: auth.error }

  const supabase = await createAdminClient()

  const { data: mester } = await supabase
    .from("mester_profiles")
    .select("is_featured")
    .eq("id", mesterId)
    .single() as { data: { is_featured: boolean } | null }

  if (!mester) {
    return { error: "Meșterul nu a fost găsit" }
  }

  const newFeaturedStatus = !mester.is_featured
  const { error } = await supabase
    .from("mester_profiles")
    .update({ is_featured: newFeaturedStatus } as never)
    .eq("id", mesterId)

  if (error) {
    return { error: "Nu s-a putut actualiza statusul" }
  }

  revalidatePath("/admin/mesteri")
  return { success: true, isFeatured: newFeaturedStatus }
}
