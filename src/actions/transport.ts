"use server"

import { revalidatePath } from "next/cache"
import { createClient, createAdminClient } from "@/lib/supabase/server"
import { createNotification } from "@/actions/notifications"
import { redirect } from "next/navigation"

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

  const defaultLat = 45.1667
  const defaultLng = 28.8000

  const { data, error } = await adminClient
    .from("transport_requests")
    .insert({
      client_id: user?.id || null,
      pickup_address: pickupAddress,
      pickup_lat: isNaN(pickupLat) ? defaultLat : pickupLat,
      pickup_lng: isNaN(pickupLng) ? defaultLng : pickupLng,
      dropoff_address: dropoffAddress,
      dropoff_lat: isNaN(dropoffLat) ? defaultLat : dropoffLat,
      dropoff_lng: isNaN(dropoffLng) ? defaultLng : dropoffLng,
      description: description || null,
      phone: phone,
      status: "open",
    } as never)
    .select()
    .single<{ id: string }>()

  if (error) {
    console.error("Transport request error:", error)
    return { error: "Nu s-a putut crea cererea de transport" }
  }

  // Notifică meșterii cu categoria transport
  const { data: transportCategory } = await adminClient
    .from("categories")
    .select("id")
    .eq("slug", "transport")
    .single() as { data: { id: string } | null }

  if (transportCategory) {
    const { data: mesterCategories } = await adminClient
      .from("mester_categories")
      .select("mester_id, mester_profiles!inner(user_id)")
      .eq("category_id", transportCategory.id) as {
        data: { mester_id: string; mester_profiles: { user_id: string } }[] | null
      }

    for (const mc of mesterCategories ?? []) {
      await createNotification({
        userId: mc.mester_profiles.user_id,
        type: "cerere_noua",
        title: "Cerere nouă de transport",
        message: `${pickupAddress} → ${dropoffAddress}`,
        entityType: "transport",
        entityId: data.id,
      })
    }
  }

  revalidatePath("/transport")
  return { success: true, requestId: data.id }
}

export type TransportRequest = {
  id: string
  client_id: string | null
  pickup_address: string
  pickup_lat: number
  pickup_lng: number
  dropoff_address: string
  dropoff_lat: number
  dropoff_lng: number
  description: string | null
  phone: string
  status: string
  created_at: string
  updated_at: string
}

export async function getTransportCereri(): Promise<TransportRequest[]> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  // Verifică dacă mesterul are categoria transport
  const { data: mester } = await supabase
    .from("mester_profiles")
    .select("id, mester_categories(category_id, categories!inner(slug))")
    .eq("user_id", user.id)
    .maybeSingle() as {
      data: {
        id: string
        mester_categories: { category_id: string; categories: { slug: string } }[]
      } | null
    }

  if (!mester) return []

  const hasTransport = mester.mester_categories.some(
    (mc) => mc.categories?.slug === "transport"
  )

  if (!hasTransport) return []

  const adminClient = await createAdminClient()
  const { data } = await adminClient
    .from("transport_requests")
    .select("id, client_id, pickup_address, pickup_lat, pickup_lng, dropoff_address, dropoff_lat, dropoff_lng, description, phone, status, created_at, updated_at")
    .eq("status", "open")
    .order("created_at", { ascending: false })

  return (data || []) as TransportRequest[]
}

export async function getTransportRequestById(id: string): Promise<TransportRequest | null> {
  const adminClient = await createAdminClient()
  const { data } = await adminClient
    .from("transport_requests")
    .select("id, client_id, pickup_address, pickup_lat, pickup_lng, dropoff_address, dropoff_lat, dropoff_lng, description, phone, status, created_at, updated_at")
    .eq("id", id)
    .single()

  return data as TransportRequest | null
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
    .eq("client_id", user.id)
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
    .eq("client_id", user.id)

  if (error) {
    return { error: "Nu s-a putut anula cererea" }
  }

  revalidatePath("/transport")
  revalidatePath("/cont/cereri")
  return { success: true }
}
