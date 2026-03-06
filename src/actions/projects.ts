"use server"

import { revalidatePath } from "next/cache"
import { createClient, createAdminClient } from "@/lib/supabase/server"
import { uploadProjectPhoto } from "@/lib/utils/upload"
import type { ProjectWithPhotos } from "@/types/database"

type MesterId = { id: string }
type SortOrderRow = { sort_order: number }

export async function getProjectsForMester(mesterId: string): Promise<ProjectWithPhotos[]> {
  const supabase = await createClient()

  const { data } = await supabase
    .from("mester_projects")
    .select(`*, project_photos(id, url, storage_path, sort_order, created_at, approval_status)`)
    .eq("mester_id", mesterId)
    .order("sort_order")
    .order("created_at", { ascending: false })

  const projects = (data as ProjectWithPhotos[]) || []
  return projects.map((p) => ({
    ...p,
    project_photos: p.project_photos.filter((ph) => ph.approval_status === "approved"),
  }))
}

export async function getMesterProjects(): Promise<ProjectWithPhotos[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const mesterRes = await supabase
    .from("mester_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single()
  const mester = mesterRes.data as MesterId | null

  if (!mester) return []

  const { data } = await supabase
    .from("mester_projects")
    .select(`*, project_photos(id, url, storage_path, sort_order, created_at, approval_status)`)
    .eq("mester_id", mester.id)
    .order("sort_order")
    .order("created_at", { ascending: false })

  return (data as ProjectWithPhotos[]) || []
}

export async function createProject(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Trebuie să fii autentificat" }

  const mesterRes = await supabase
    .from("mester_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single()
  const mester = mesterRes.data as MesterId | null

  if (!mester) return { error: "Nu ai un profil de meșter" }

  const title = (formData.get("title") as string)?.trim()
  const description = (formData.get("description") as string)?.trim() || null

  if (!title) return { error: "Titlul este obligatoriu" }

  // Get max sort_order
  const existingRes = await supabase
    .from("mester_projects")
    .select("sort_order")
    .eq("mester_id", mester.id)
    .order("sort_order", { ascending: false })
    .limit(1)
  const existing = existingRes.data as SortOrderRow[] | null

  const nextSortOrder = (existing?.[0]?.sort_order ?? -1) + 1

  const adminClient = await createAdminClient()
  const { data: project, error } = await adminClient
    .from("mester_projects")
    .insert({ mester_id: mester.id, title, description, sort_order: nextSortOrder } as never)
    .select("id")
    .single() as { data: { id: string } | null; error: unknown }

  if (error || !project) {
    console.error("Create project error:", error)
    return { error: "Nu s-a putut crea proiectul" }
  }

  // Upload photos
  const files = formData.getAll("photos") as File[]
  const validFiles = files.filter((f) => f && f.size > 0).slice(0, 10)

  for (let i = 0; i < validFiles.length; i++) {
    const result = await uploadProjectPhoto(mester.id, project.id, validFiles[i])
    if (result) {
      await adminClient.from("project_photos").insert({
        project_id: project.id,
        storage_path: result.storagePath,
        url: result.url,
        sort_order: i,
      } as never)
    }
  }

  revalidatePath("/mester-cont/proiecte")
  revalidatePath(`/mester/${mester.id}`)
  return { success: true, projectId: project.id }
}

export async function updateProject(projectId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Trebuie să fii autentificat" }

  const title = (formData.get("title") as string)?.trim()
  const description = (formData.get("description") as string)?.trim() || null

  if (!title) return { error: "Titlul este obligatoriu" }

  const mesterRes = await supabase
    .from("mester_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single()
  const mester = mesterRes.data as MesterId | null

  if (!mester) return { error: "Nu ai un profil de meșter" }

  const adminClient = await createAdminClient()
  const { error } = await adminClient
    .from("mester_projects")
    .update({ title, description } as never)
    .eq("id", projectId)
    .eq("mester_id", mester.id)

  if (error) return { error: "Nu s-a putut actualiza proiectul" }

  revalidatePath("/mester-cont/proiecte")
  revalidatePath(`/mester/${mester.id}`)
  return { success: true }
}

export async function deleteProject(projectId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Trebuie să fii autentificat" }

  const mesterRes = await supabase
    .from("mester_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single()
  const mester = mesterRes.data as MesterId | null

  if (!mester) return { error: "Nu ai un profil de meșter" }

  const adminClient = await createAdminClient()

  // Get photos for storage cleanup
  const { data: photos } = await adminClient
    .from("project_photos")
    .select("storage_path")
    .eq("project_id", projectId) as { data: { storage_path: string }[] | null }

  // Delete from storage
  if (photos && photos.length > 0) {
    await adminClient.storage
      .from("project-photos")
      .remove(photos.map((p) => p.storage_path))
  }

  // Delete project (cascade deletes project_photos rows)
  const { error } = await adminClient
    .from("mester_projects")
    .delete()
    .eq("id", projectId)
    .eq("mester_id", mester.id)

  if (error) return { error: "Nu s-a putut șterge proiectul" }

  revalidatePath("/mester-cont/proiecte")
  revalidatePath(`/mester/${mester.id}`)
  return { success: true }
}

export async function addProjectPhoto(projectId: string, file: File) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Trebuie să fii autentificat" }

  const mesterRes = await supabase
    .from("mester_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single()
  const mester = mesterRes.data as MesterId | null

  if (!mester) return { error: "Nu ai un profil de meșter" }

  // Verify project ownership
  const projectRes = await supabase
    .from("mester_projects")
    .select("id")
    .eq("id", projectId)
    .eq("mester_id", mester.id)
    .single()
  const project = projectRes.data as MesterId | null

  if (!project) return { error: "Proiect negăsit" }

  const result = await uploadProjectPhoto(mester.id, projectId, file)
  if (!result) return { error: "Nu s-a putut încărca poza" }

  const adminClient = await createAdminClient()
  const maxOrderRes = await adminClient
    .from("project_photos")
    .select("sort_order")
    .eq("project_id", projectId)
    .order("sort_order", { ascending: false })
    .limit(1)
  const maxOrder = maxOrderRes.data as SortOrderRow[] | null

  const nextSortOrder = (maxOrder?.[0]?.sort_order ?? -1) + 1

  await adminClient.from("project_photos").insert({
    project_id: projectId,
    storage_path: result.storagePath,
    url: result.url,
    sort_order: nextSortOrder,
  } as never)

  revalidatePath("/mester-cont/proiecte")
  revalidatePath(`/mester/${mester.id}`)
  return { success: true }
}

export async function deleteProjectPhoto(photoId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Trebuie să fii autentificat" }

  const adminClient = await createAdminClient()

  const { data: photo } = await adminClient
    .from("project_photos")
    .select(`storage_path, project:mester_projects(mester_id)`)
    .eq("id", photoId)
    .single() as { data: { storage_path: string; project: { mester_id: string } | null } | null }

  if (!photo) return { error: "Poza nu există" }

  const mesterRes = await supabase
    .from("mester_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single()
  const mester = mesterRes.data as MesterId | null

  if (!mester || photo.project?.mester_id !== mester.id) {
    return { error: "Nu ai permisiunea de a șterge această poză" }
  }

  await adminClient.storage.from("project-photos").remove([photo.storage_path])
  await adminClient.from("project_photos").delete().eq("id", photoId)

  revalidatePath("/mester-cont/proiecte")
  revalidatePath(`/mester/${mester.id}`)
  return { success: true }
}
