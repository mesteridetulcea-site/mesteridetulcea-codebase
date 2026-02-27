"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export async function uploadPhoto(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Trebuie să fii autentificat" }
  }

  // Get mester profile
  const { data: mester } = await supabase
    .from("mesters")
    .select("id")
    .eq("profile_id", user.id)
    .single() as { data: { id: string } | null }

  if (!mester) {
    return { error: "Nu ai un profil de meșter" }
  }

  const file = formData.get("file") as File
  const caption = formData.get("caption") as string
  const isCover = formData.get("isCover") === "true"

  if (!file) {
    return { error: "Nicio imagine selectată" }
  }

  // Generate unique filename
  const fileExt = file.name.split(".").pop()
  const fileName = `${mester.id}/${Date.now()}.${fileExt}`

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from("mester-photos")
    .upload(fileName, file)

  if (uploadError) {
    console.error("Upload error:", uploadError)
    return { error: "Nu s-a putut încărca imaginea" }
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("mester-photos").getPublicUrl(fileName)

  // Get current max order_index
  const { data: photos } = await supabase
    .from("mester_photos")
    .select("order_index")
    .eq("mester_id", mester.id)
    .order("order_index", { ascending: false })
    .limit(1) as { data: { order_index: number }[] | null }

  const nextOrderIndex = (photos?.[0]?.order_index || 0) + 1

  // If setting as cover, unset other covers
  if (isCover) {
    await supabase
      .from("mester_photos")
      .update({ is_cover: false } as never)
      .eq("mester_id", mester.id)
  }

  // Create photo record
  const { error: insertError } = await supabase.from("mester_photos").insert({
    mester_id: mester.id,
    url: publicUrl,
    caption: caption || null,
    is_cover: isCover,
    approval_status: "pending",
    order_index: nextOrderIndex,
  } as never)

  if (insertError) {
    console.error("Insert error:", insertError)
    return { error: "Nu s-a putut salva fotografia" }
  }

  revalidatePath("/mester-cont/fotografii")
  return { success: true }
}

export async function deletePhoto(photoId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Trebuie să fii autentificat" }
  }

  // Get mester profile
  const { data: mester } = await supabase
    .from("mesters")
    .select("id")
    .eq("profile_id", user.id)
    .single() as { data: { id: string } | null }

  if (!mester) {
    return { error: "Nu ai un profil de meșter" }
  }

  // Verify photo belongs to mester
  const { data: photo } = await supabase
    .from("mester_photos")
    .select("*")
    .eq("id", photoId)
    .eq("mester_id", mester.id)
    .single() as { data: { url: string } | null }

  if (!photo) {
    return { error: "Fotografia nu a fost găsită" }
  }

  // Delete from storage (extract path from URL)
  const urlParts = photo.url.split("/mester-photos/")
  if (urlParts.length > 1) {
    await supabase.storage.from("mester-photos").remove([urlParts[1]])
  }

  // Delete record
  const { error } = await supabase
    .from("mester_photos")
    .delete()
    .eq("id", photoId)

  if (error) {
    return { error: "Nu s-a putut șterge fotografia" }
  }

  revalidatePath("/mester-cont/fotografii")
  return { success: true }
}

export async function setPhotoCover(photoId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Trebuie să fii autentificat" }
  }

  // Get mester profile
  const { data: mester } = await supabase
    .from("mesters")
    .select("id")
    .eq("profile_id", user.id)
    .single() as { data: { id: string } | null }

  if (!mester) {
    return { error: "Nu ai un profil de meșter" }
  }

  // Unset all covers
  await supabase
    .from("mester_photos")
    .update({ is_cover: false } as never)
    .eq("mester_id", mester.id)

  // Set new cover
  const { error } = await supabase
    .from("mester_photos")
    .update({ is_cover: true } as never)
    .eq("id", photoId)
    .eq("mester_id", mester.id)

  if (error) {
    return { error: "Nu s-a putut seta fotografia de copertă" }
  }

  revalidatePath("/mester-cont/fotografii")
  return { success: true }
}

export async function getMesterPhotos() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  const { data: mester } = await supabase
    .from("mesters")
    .select("id")
    .eq("profile_id", user.id)
    .single() as { data: { id: string } | null }

  if (!mester) return []

  const { data: photos } = await supabase
    .from("mester_photos")
    .select("*")
    .eq("mester_id", mester.id)
    .order("order_index")

  return photos || []
}
