"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { createNotification } from "@/actions/notifications"

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
    .from("mester_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single() as { data: { id: string } | null }

  if (!mester) {
    return { error: "Nu ai un profil de meșter" }
  }

  const file = formData.get("file") as File
  const caption = formData.get("caption") as string
  const isProfile = formData.get("isCover") === "true"

  if (!file) {
    return { error: "Nicio imagine selectată" }
  }

  const fileExt = file.name.split(".").pop()
  const storagePath = `${mester.id}/${Date.now()}.${fileExt}`

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from("mester-photos")
    .upload(storagePath, file)

  if (uploadError) {
    console.error("Upload error:", uploadError)
    return { error: "Nu s-a putut încărca imaginea" }
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("mester-photos").getPublicUrl(storagePath)

  // Get current max sort_order
  const { data: photos } = await supabase
    .from("mester_photos")
    .select("sort_order")
    .eq("mester_id", mester.id)
    .order("sort_order", { ascending: false })
    .limit(1) as { data: { sort_order: number }[] | null }

  const nextSortOrder = (photos?.[0]?.sort_order || 0) + 1

  // If setting as profile photo, unset existing profile photos
  if (isProfile) {
    await supabase
      .from("mester_photos")
      .update({ photo_type: "work" } as never)
      .eq("mester_id", mester.id)
      .eq("photo_type", "profile")
  }

  // Create photo record
  const { error: insertError } = await supabase.from("mester_photos").insert({
    mester_id: mester.id,
    storage_path: storagePath,
    public_url: publicUrl,
    photo_type: isProfile ? "profile" : "work",
    caption: caption || null,
    approval_status: "pending",
    sort_order: nextSortOrder,
  } as never)

  if (insertError) {
    console.error("Insert error:", insertError)
    return { error: "Nu s-a putut salva fotografia" }
  }

  await createNotification({
    userId: user.id,
    type: "poza_incarcata",
    title: "Fotografia ta a fost trimisă spre aprobare",
    message: "Va fi vizibilă pe profil după verificarea de către echipa noastră.",
  })

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
    .from("mester_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single() as { data: { id: string } | null }

  if (!mester) {
    return { error: "Nu ai un profil de meșter" }
  }

  // Verify photo belongs to mester
  const { data: photo } = await supabase
    .from("mester_photos")
    .select("storage_path")
    .eq("id", photoId)
    .eq("mester_id", mester.id)
    .single() as { data: { storage_path: string } | null }

  if (!photo) {
    return { error: "Fotografia nu a fost găsită" }
  }

  // Delete from storage
  await supabase.storage.from("mester-photos").remove([photo.storage_path])

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
    .from("mester_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single() as { data: { id: string } | null }

  if (!mester) {
    return { error: "Nu ai un profil de meșter" }
  }

  // Unset all profile photos
  await supabase
    .from("mester_photos")
    .update({ photo_type: "work" } as never)
    .eq("mester_id", mester.id)
    .eq("photo_type", "profile")

  // Set new profile photo
  const { error } = await supabase
    .from("mester_photos")
    .update({ photo_type: "profile" } as never)
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
    .from("mester_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single() as { data: { id: string } | null }

  if (!mester) return []

  const { data: photos } = await supabase
    .from("mester_photos")
    .select("*")
    .eq("mester_id", mester.id)
    .order("sort_order")

  return photos || []
}
