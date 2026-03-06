"use server"

import { revalidatePath } from "next/cache"
import { createClient, createAdminClient } from "@/lib/supabase/server"
import type { Notification, NotificationType } from "@/types/database"

type CreateNotificationParams = {
  userId: string
  type: NotificationType
  title: string
  message?: string
  entityType?: string
  entityId?: string
}

export async function createNotification({
  userId,
  type,
  title,
  message,
  entityType,
  entityId,
}: CreateNotificationParams): Promise<void> {
  const supabase = await createAdminClient()
  await supabase.from("notifications").insert({
    user_id: userId,
    type,
    title,
    message: message ?? null,
    entity_type: entityType ?? null,
    entity_id: entityId ?? null,
  } as never)
}

export async function getNotifications(): Promise<Notification[]> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  const { data } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20)

  return (data ?? []) as Notification[]
}

export async function markAsRead(notificationId: string): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: "Neautentificat" }

  const { error } = await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() } as never)
    .eq("id", notificationId)
    .eq("user_id", user.id)

  if (error) return { error: "Nu s-a putut marca notificarea" }
  return { success: true }
}

export async function markAllAsRead(): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: "Neautentificat" }

  const { error } = await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() } as never)
    .eq("user_id", user.id)
    .is("read_at", null)

  if (error) return { error: "Nu s-au putut marca notificările" }

  revalidatePath("/")
  return { success: true }
}
