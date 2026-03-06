"use client"

import { useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { getNotifications, markAsRead as markAsReadAction, markAllAsRead as markAllAsReadAction } from "@/actions/notifications"
import type { Notification } from "@/types/database"

export function useNotifications(userId: string | null) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read_at).length

  useEffect(() => {
    if (!userId) {
      setNotifications([])
      return
    }

    setLoading(true)
    getNotifications().then((data) => {
      setNotifications(data)
      setLoading(false)
    })

    const supabase = createClient()
    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setNotifications((prev) => [payload.new as Notification, ...prev].slice(0, 20))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  const markAsRead = useCallback(async (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notificationId ? { ...n, read_at: new Date().toISOString() } : n
      )
    )
    await markAsReadAction(notificationId)
  }, [])

  const markAllAsRead = useCallback(async () => {
    const now = new Date().toISOString()
    setNotifications((prev) => prev.map((n) => ({ ...n, read_at: n.read_at ?? now })))
    await markAllAsReadAction()
  }, [])

  return { notifications, unreadCount, loading, markAsRead, markAllAsRead }
}
