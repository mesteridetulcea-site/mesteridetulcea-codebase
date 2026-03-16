"use server"

import { createAdminClient } from "@/lib/supabase/server"

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"]
const MAX_AVATAR_SIZE = 2 * 1024 * 1024 // 2MB — matches the Supabase bucket limit

const EXT_TO_MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
}

function resolveContentType(file: File): string | null {
  if (ALLOWED_IMAGE_TYPES.includes(file.type)) return file.type
  const ext = file.name.split(".").pop()?.toLowerCase() ?? ""
  return EXT_TO_MIME[ext] ?? null
}

export async function uploadAvatar(
  userId: string,
  file: File
): Promise<string | null> {
  if (!file || file.size === 0) return null
  if (file.size > MAX_AVATAR_SIZE) return null

  const contentType = resolveContentType(file)
  if (!contentType) return null

  const ext = file.name.split(".").pop() ?? "jpg"
  const path = `${userId}/avatar.${ext}`

  const adminClient = await createAdminClient()

  const { error } = await adminClient.storage
    .from("avatars")
    .upload(path, file, { upsert: true, contentType })

  if (error) {
    console.error("Avatar upload error:", error)
    return null
  }

  const { data } = adminClient.storage.from("avatars").getPublicUrl(path)
  return `${data.publicUrl}?v=${Date.now()}`
}

export async function uploadCererePhoto(
  userId: string,
  cerereId: string,
  file: File
): Promise<string | null> {
  if (!file || file.size === 0) return null
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return null
  if (file.size > MAX_AVATAR_SIZE) return null

  const ext = file.name.split(".").pop() ?? "jpg"
  const path = `${userId}/${cerereId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const adminClient = await createAdminClient()

  const { error } = await adminClient.storage
    .from("cereri-photos")
    .upload(path, file, { upsert: false, contentType: file.type })

  if (error) {
    console.error("Cerere photo upload error:", error)
    return null
  }

  const { data } = adminClient.storage.from("cereri-photos").getPublicUrl(path)
  return data.publicUrl
}

export async function uploadDonationPhoto(
  userId: string,
  donationId: string,
  file: File
): Promise<{ url: string; storagePath: string } | null> {
  if (!file || file.size === 0) return null
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return null
  if (file.size > MAX_AVATAR_SIZE) return null

  const ext = file.name.split(".").pop() ?? "jpg"
  const path = `${userId}/${donationId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const adminClient = await createAdminClient()

  const { error } = await adminClient.storage
    .from("donation-photos")
    .upload(path, file, { upsert: false, contentType: file.type })

  if (error) {
    console.error("Donation photo upload error:", error)
    return null
  }

  const { data } = adminClient.storage.from("donation-photos").getPublicUrl(path)
  return { url: data.publicUrl, storagePath: path }
}

export async function uploadProjectPhoto(
  mesterId: string,
  projectId: string,
  file: File
): Promise<{ url: string; storagePath: string } | null> {
  if (!file || file.size === 0) return null
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return null
  if (file.size > MAX_AVATAR_SIZE) return null

  const ext = file.name.split(".").pop() ?? "jpg"
  const path = `${mesterId}/${projectId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const adminClient = await createAdminClient()

  const { error } = await adminClient.storage
    .from("project-photos")
    .upload(path, file, { upsert: false, contentType: file.type })

  if (error) {
    console.error("Project photo upload error:", error)
    return null
  }

  const { data } = adminClient.storage.from("project-photos").getPublicUrl(path)
  return { url: data.publicUrl, storagePath: path }
}
