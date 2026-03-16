"use server"

import { revalidatePath } from "next/cache"
import { createClient, createAdminClient } from "@/lib/supabase/server"
import { uploadDonationPhoto } from "@/lib/utils/upload"
import { createNotification } from "@/actions/notifications"
import type { DonationWithPhotos } from "@/types/database"

export async function createDonation(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Trebuie să fii autentificat pentru a posta o donație." }
  }

  // Verifică că utilizatorul are număr de telefon (profiles.phone sau mester_profiles.whatsapp_number)
  const { data: profile } = await supabase
    .from("profiles")
    .select("phone")
    .eq("id", user.id)
    .single() as { data: { phone: string | null } | null }

  let phoneToUse = profile?.phone?.trim() || null

  if (!phoneToUse) {
    const { data: mesterProfile } = await supabase
      .from("mester_profiles")
      .select("whatsapp_number")
      .eq("user_id", user.id)
      .single() as { data: { whatsapp_number: string | null } | null }
    phoneToUse = mesterProfile?.whatsapp_number?.trim() || null
  }

  if (!phoneToUse) {
    return {
      error:
        "Trebuie să adaugi un număr de telefon în setările contului înainte de a posta o donație.",
    }
  }

  const title = (formData.get("title") as string)?.trim()
  const description = (formData.get("description") as string)?.trim()

  if (!title) return { error: "Titlul este obligatoriu" }
  if (!description) return { error: "Descrierea este obligatorie" }

  const adminClient = await createAdminClient()

  // Inserează donația
  const { data: donation, error: insertError } = await adminClient
    .from("donations")
    .insert({
      user_id: user.id,
      title,
      description,
      phone: phoneToUse,
      status: "active",
    } as never)
    .select()
    .single() as { data: { id: string } | null; error: unknown }

  if (insertError || !donation) {
    console.error("Donation insert error:", insertError)
    return { error: "Eroare la postarea donației. Încearcă din nou." }
  }

  // Upload poze (max 5)
  const photos: File[] = []
  for (let i = 0; i < 5; i++) {
    const file = formData.get(`photo_${i}`) as File | null
    if (file && file.size > 0) photos.push(file)
  }

  for (const photo of photos) {
    const result = await uploadDonationPhoto(user.id, donation.id, photo)
    if (result) {
      await adminClient.from("donation_photos").insert({
        donation_id: donation.id,
        url: result.url,
        storage_path: result.storagePath,
        approval_status: "pending",
      } as never)
    }
  }

  // Notificare pentru utilizator
  await createNotification({
    userId: user.id,
    type: "donatie_postata",
    title: "Donație postată",
    message: `Donația „${title}" a fost publicată. Pozele vor fi vizibile după aprobare.`,
    entityType: "donation",
    entityId: donation.id,
  })

  revalidatePath("/donatii")
  return { success: true, donationId: donation.id }
}

export async function getDonations(): Promise<DonationWithPhotos[]> {
  const adminClient = await createAdminClient()

  const { data, error } = await adminClient
    .from("donations")
    .select(`
      *,
      donation_photos (*)
    `)
    .eq("status", "active")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("getDonations error:", error)
    return []
  }

  return (data ?? []) as DonationWithPhotos[]
}

export async function getDonationById(
  id: string,
  viewerUserId?: string
): Promise<DonationWithPhotos | null> {
  const adminClient = await createAdminClient()

  const { data, error } = await adminClient
    .from("donations")
    .select(`
      *,
      donation_photos (*)
    `)
    .eq("id", id)
    .single()

  if (error || !data) return null

  const donation = data as DonationWithPhotos

  // Non-owner vede doar pozele aprobate
  if (viewerUserId !== donation.user_id) {
    donation.donation_photos = donation.donation_photos.filter(
      (p) => p.approval_status === "approved"
    )
  }

  return donation
}

export async function getUserDonations(): Promise<DonationWithPhotos[]> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  const adminClient = await createAdminClient()

  const { data, error } = await adminClient
    .from("donations")
    .select(`
      *,
      donation_photos (*)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("getUserDonations error:", error)
    return []
  }

  return (data ?? []) as DonationWithPhotos[]
}

export async function closeDonation(id: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: "Trebuie să fii autentificat." }

  const { error } = await supabase
    .from("donations")
    .update({ status: "closed", updated_at: new Date().toISOString() } as never)
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) return { error: "Eroare la actualizarea donației." }

  revalidatePath("/donatii")
  revalidatePath(`/donatii/${id}`)
  revalidatePath("/cont/donatii")
  return { success: true }
}

export async function deleteDonation(id: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: "Trebuie să fii autentificat." }

  const adminClient = await createAdminClient()

  // Obține pozele pentru a le șterge din storage
  const { data: photos } = await adminClient
    .from("donation_photos")
    .select("storage_path")
    .eq("donation_id", id) as { data: { storage_path: string | null }[] | null }

  if (photos && photos.length > 0) {
    const paths = photos
      .map((p) => p.storage_path)
      .filter(Boolean) as string[]
    if (paths.length > 0) {
      await adminClient.storage.from("donation-photos").remove(paths)
    }
  }

  // Verifică ownership și șterge
  const { error } = await adminClient
    .from("donations")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) return { error: "Eroare la ștergerea donației." }

  revalidatePath("/donatii")
  revalidatePath("/cont/donatii")
  return { success: true }
}
