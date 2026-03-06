"use server"

import { revalidatePath } from "next/cache"
import { createClient, createAdminClient } from "@/lib/supabase/server"
import { createNotification } from "@/actions/notifications"

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

  // Get the user_id for this mester so we can update their profile role
  const { data: mesterProfile } = await supabase
    .from("mester_profiles")
    .select("user_id")
    .eq("id", mesterId)
    .single() as { data: { user_id: string } | null }

  const { error } = await supabase
    .from("mester_profiles")
    .update({
      approval_status: "approved",
      approved_by: auth.userId,
      approved_at: new Date().toISOString(),
    } as never)
    .eq("id", mesterId)

  if (error) {
    return { error: "Nu s-a putut aproba meșterul" }
  }

  // Update the user's role to "mester" now that they're approved
  if (mesterProfile?.user_id) {
    await supabase
      .from("profiles")
      .update({ role: "mester" } as never)
      .eq("id", mesterProfile.user_id)
  }

  await supabase.from("admin_logs").insert({
    admin_id: auth.userId!,
    action: "approve_mester",
    target_type: "mester",
    target_id: mesterId,
    notes: notes || null,
  } as never)

  if (mesterProfile?.user_id) {
    await createNotification({
      userId: mesterProfile.user_id,
      type: "profil_aprobat",
      title: "Profilul tău a fost aprobat",
      message: "Contul tău de meșter este acum activ și vizibil pe platformă.",
      entityType: "mester_profile",
      entityId: mesterId,
    })
  }

  revalidatePath("/admin/mesteri")
  return { success: true }
}

export async function rejectMester(mesterId: string, notes?: string) {
  const auth = await checkIsAdmin()
  if (!auth.isAdmin) return { error: auth.error }

  const supabase = await createAdminClient()

  const { data: mesterProfile } = await supabase
    .from("mester_profiles")
    .select("user_id")
    .eq("id", mesterId)
    .single() as { data: { user_id: string } | null }

  const { error } = await supabase
    .from("mester_profiles")
    .update({
      approval_status: "rejected",
      rejection_reason: notes || null,
    } as never)
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

  if (mesterProfile?.user_id) {
    await createNotification({
      userId: mesterProfile.user_id,
      type: "profil_respins",
      title: "Profilul tău a fost respins",
      message: notes || "Profilul tău necesită modificări. Te rugăm să contactezi suportul.",
      entityType: "mester_profile",
      entityId: mesterId,
    })
  }

  revalidatePath("/admin/mesteri")
  return { success: true }
}

export async function approvePhoto(photoId: string) {
  const auth = await checkIsAdmin()
  if (!auth.isAdmin) return { error: auth.error }

  const supabase = await createAdminClient()

  const { data: photo } = await supabase
    .from("mester_photos")
    .select("mester_id, mester_profiles!inner(user_id)")
    .eq("id", photoId)
    .single() as { data: { mester_id: string; mester_profiles: { user_id: string } } | null }

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

  if (photo?.mester_profiles?.user_id) {
    await createNotification({
      userId: photo.mester_profiles.user_id,
      type: "poza_aprobata",
      title: "Fotografia ta a fost aprobată",
      message: "Fotografia este acum vizibilă pe profilul tău public.",
      entityType: "photo",
      entityId: photoId,
    })
  }

  revalidatePath("/admin/fotografii")
  return { success: true }
}

export async function rejectPhoto(photoId: string) {
  const auth = await checkIsAdmin()
  if (!auth.isAdmin) return { error: auth.error }

  const supabase = await createAdminClient()

  const { data: photo } = await supabase
    .from("mester_photos")
    .select("mester_id, mester_profiles!inner(user_id)")
    .eq("id", photoId)
    .single() as { data: { mester_id: string; mester_profiles: { user_id: string } } | null }

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

  if (photo?.mester_profiles?.user_id) {
    await createNotification({
      userId: photo.mester_profiles.user_id,
      type: "poza_respinsa",
      title: "Fotografia ta a fost respinsă",
      message: "Fotografia nu respectă ghidurile platformei.",
      entityType: "photo",
      entityId: photoId,
    })
  }

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

  const { data: mesters, error } = await supabase
    .from("mester_profiles")
    .select(`
      id, user_id, display_name, approval_status, subscription_tier, is_featured, created_at,
      mester_categories(category:categories(name))
    `)
    .order("created_at", { ascending: false }) as {
      data: Array<{
        id: string
        user_id: string
        display_name: string
        approval_status: string
        subscription_tier: string
        is_featured: boolean
        created_at: string
        mester_categories: { category: { name: string } | null }[]
      }> | null
      error: unknown
    }

  if (error) return { error: "Nu s-au putut încărca meșterii", data: null }
  if (!mesters || mesters.length === 0) return { error: null, data: [] }

  const userIds = mesters.map((m) => m.user_id)
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, email, full_name")
    .in("id", userIds) as {
      data: Array<{ id: string; email: string; full_name: string | null }> | null
    }

  const profileMap = new Map((profiles || []).map((p) => [p.id, p]))

  const result = mesters.map((m) => ({
    ...m,
    profile: profileMap.get(m.user_id) ?? null,
  }))

  return { error: null, data: result }
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

export async function adminRejectReview(reviewId: string) {
  const auth = await checkIsAdmin()
  if (!auth.isAdmin) return { error: auth.error }

  const supabase = await createAdminClient()

  const { data: review } = await supabase
    .from("reviews")
    .select("mester_id")
    .eq("id", reviewId)
    .single() as { data: { mester_id: string } | null }

  if (!review) return { error: "Recenzia nu a fost găsită" }

  const { error } = await supabase
    .from("reviews")
    .update({ approval_status: "rejected" } as never)
    .eq("id", reviewId)

  if (error) return { error: "Nu s-a putut respinge recenzia" }

  await supabase.from("admin_logs").insert({
    admin_id: auth.userId!,
    action: "reject_review",
    target_type: "review",
    target_id: reviewId,
    notes: null,
  } as never)

  revalidatePath(`/mester/${review.mester_id}`)
  return { success: true }
}

export async function approveCererePhoto(photoId: string) {
  const auth = await checkIsAdmin()
  if (!auth.isAdmin) return { error: auth.error }

  const supabase = await createAdminClient()

  const { data: cererePhoto } = await supabase
    .from("cerere_photos")
    .select("cerere_id, cerere:service_requests(client_id)")
    .eq("id", photoId)
    .single() as { data: { cerere_id: string; cerere: { client_id: string | null } | null } | null }

  const { error } = await supabase
    .from("cerere_photos")
    .update({ approval_status: "approved" } as never)
    .eq("id", photoId)

  if (error) return { error: "Nu s-a putut aproba fotografia" }

  if (cererePhoto?.cerere?.client_id) {
    await createNotification({
      userId: cererePhoto.cerere.client_id,
      type: "poza_aprobata",
      title: "Fotografia ta a fost aprobată",
      message: "Fotografia adăugată la cererea ta este acum vizibilă.",
      entityType: "cerere_photo",
      entityId: photoId,
    })
  }

  revalidatePath("/admin/fotografii")
  return { success: true }
}

export async function rejectCererePhoto(photoId: string) {
  const auth = await checkIsAdmin()
  if (!auth.isAdmin) return { error: auth.error }

  const supabase = await createAdminClient()

  const { data: cererePhoto } = await supabase
    .from("cerere_photos")
    .select("cerere_id, cerere:service_requests(client_id)")
    .eq("id", photoId)
    .single() as { data: { cerere_id: string; cerere: { client_id: string | null } | null } | null }

  const { error } = await supabase
    .from("cerere_photos")
    .update({ approval_status: "rejected" } as never)
    .eq("id", photoId)

  if (error) return { error: "Nu s-a putut respinge fotografia" }

  if (cererePhoto?.cerere?.client_id) {
    await createNotification({
      userId: cererePhoto.cerere.client_id,
      type: "poza_respinsa",
      title: "Fotografia ta a fost respinsă",
      message: "Fotografia nu respectă ghidurile platformei.",
      entityType: "cerere_photo",
      entityId: photoId,
    })
  }

  revalidatePath("/admin/fotografii")
  return { success: true }
}

export async function approveProjectPhoto(photoId: string) {
  const auth = await checkIsAdmin()
  if (!auth.isAdmin) return { error: auth.error }

  const supabase = await createAdminClient()

  const { data: projectPhoto } = await supabase
    .from("project_photos")
    .select("project_id, project:mester_projects(title, mester:mester_profiles(user_id))")
    .eq("id", photoId)
    .single() as {
      data: {
        project_id: string
        project: { title: string; mester: { user_id: string } | null } | null
      } | null
    }

  const { error } = await supabase
    .from("project_photos")
    .update({ approval_status: "approved" } as never)
    .eq("id", photoId)

  if (error) return { error: "Nu s-a putut aproba fotografia" }

  if (projectPhoto?.project?.mester?.user_id) {
    await createNotification({
      userId: projectPhoto.project.mester.user_id,
      type: "poza_aprobata",
      title: "Fotografia din proiect a fost aprobată",
      message: `Fotografia adăugată la proiectul „${projectPhoto.project.title}" este acum vizibilă.`,
      entityType: "project_photo",
      entityId: photoId,
    })
  }

  revalidatePath("/admin/fotografii")
  return { success: true }
}

export async function rejectProjectPhoto(photoId: string) {
  const auth = await checkIsAdmin()
  if (!auth.isAdmin) return { error: auth.error }

  const supabase = await createAdminClient()

  const { data: projectPhoto } = await supabase
    .from("project_photos")
    .select("project_id, project:mester_projects(title, mester:mester_profiles(user_id))")
    .eq("id", photoId)
    .single() as {
      data: {
        project_id: string
        project: { title: string; mester: { user_id: string } | null } | null
      } | null
    }

  const { error } = await supabase
    .from("project_photos")
    .update({ approval_status: "rejected" } as never)
    .eq("id", photoId)

  if (error) return { error: "Nu s-a putut respinge fotografia" }

  if (projectPhoto?.project?.mester?.user_id) {
    await createNotification({
      userId: projectPhoto.project.mester.user_id,
      type: "poza_respinsa",
      title: "Fotografia din proiect a fost respinsă",
      message: `Fotografia adăugată la proiectul „${projectPhoto.project.title}" nu respectă ghidurile platformei.`,
      entityType: "project_photo",
      entityId: photoId,
    })
  }

  revalidatePath("/admin/fotografii")
  return { success: true }
}
