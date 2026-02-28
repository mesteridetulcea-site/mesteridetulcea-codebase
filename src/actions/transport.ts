"use server"

import { revalidatePath } from "next/cache"
import { createClient, createAdminClient } from "@/lib/supabase/server"

export async function createTransportRequest(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pickupAddress = formData.get("pickup_address") as string
  const pickupLat = parseFloat(formData.get("pickup_lat") as string)
  const pickupLng = parseFloat(formData.get("pickup_lng") as string)
  const dropoffAddress = formData.get("dropoff_address") as string
  const dropoffLat = parseFloat(formData.get("dropoff_lat") as string)
  const dropoffLng = parseFloat(formData.get("dropoff_lng") as string)
  const description = formData.get("description") as string
  const phone = formData.get("phone") as string

  if (!pickupAddress || !dropoffAddress) {
    return { error: "Adresele de ridicare și livrare sunt obligatorii" }
  }

  if (!phone) {
    return { error: "Numărul de telefon este obligatoriu" }
  }

  const adminClient = await createAdminClient()

  // Default to Tulcea city center if no coordinates
  const defaultLat = 45.1667
  const defaultLng = 28.8000

  const { data, error } = await adminClient
    .from("transport_requests")
    .insert({
      user_id: user?.id || null,
      pickup_address: pickupAddress,
      pickup_lat: isNaN(pickupLat) ? defaultLat : pickupLat,
      pickup_lng: isNaN(pickupLng) ? defaultLng : pickupLng,
      dropoff_address: dropoffAddress,
      dropoff_lat: isNaN(dropoffLat) ? defaultLat : dropoffLat,
      dropoff_lng: isNaN(dropoffLng) ? defaultLng : dropoffLng,
      description: description || null,
      phone: phone,
      status: "pending",
    } as never)
    .select()
    .single<{ id: string }>()

  if (error) {
    console.error("Transport request error:", error)
    return { error: "Nu s-a putut crea cererea de transport" }
  }

  revalidatePath("/transport")
  return { success: true, requestId: data.id }
}

export async function getTransportRequests() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Nu ești autentificat", requests: [] }
  }

  const { data, error } = await supabase
    .from("transport_requests")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    return { error: "Nu s-au putut încărca cererile", requests: [] }
  }

  return { requests: data }
}

export async function cancelTransportRequest(requestId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Nu ești autentificat" }
  }

  const { error } = await supabase
    .from("transport_requests")
    .update({ status: "cancelled" } as never)
    .eq("id", requestId)
    .eq("user_id", user.id)

  if (error) {
    return { error: "Nu s-a putut anula cererea" }
  }

  revalidatePath("/transport")
  revalidatePath("/cont/cereri")
  return { success: true }
}
