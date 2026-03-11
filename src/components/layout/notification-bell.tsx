"use client"

import { Bell, MessageSquare, CheckCircle, XCircle, Star, Image, CheckCheck, ClipboardList, UserPlus, User, Upload, Send, Settings } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { useNotifications } from "@/lib/hooks/use-notifications"
import type { Notification, NotificationType } from "@/types/database"
import { cn } from "@/lib/utils/cn"

export function getIcon(type: NotificationType) {
  switch (type) {
    // Primit de la alții
    case "cerere_noua":
      return <MessageSquare className="h-3.5 w-3.5 shrink-0 text-blue-400" />
    case "profil_aprobat":
      return <CheckCircle className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
    case "profil_respins":
      return <XCircle className="h-3.5 w-3.5 shrink-0 text-red-400" />
    case "poza_aprobata":
      return <CheckCircle className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
    case "poza_respinsa":
      return <XCircle className="h-3.5 w-3.5 shrink-0 text-red-400" />
    case "review_nou":
      return <Star className="h-3.5 w-3.5 shrink-0 text-primary" />
    // Confirmări pentru propriile acțiuni
    case "cerere_postata":
      return <ClipboardList className="h-3.5 w-3.5 shrink-0 text-primary" />
    case "cerere_inchisa":
      return <CheckCircle className="h-3.5 w-3.5 shrink-0 text-white/40" />
    case "aplicatie_trimisa":
      return <UserPlus className="h-3.5 w-3.5 shrink-0 text-primary" />
    case "profil_actualizat":
      return <User className="h-3.5 w-3.5 shrink-0 text-primary" />
    case "poza_incarcata":
      return <Upload className="h-3.5 w-3.5 shrink-0 text-primary" />
    case "review_trimis":
      return <Send className="h-3.5 w-3.5 shrink-0 text-primary" />
    case "cont_actualizat":
      return <Settings className="h-3.5 w-3.5 shrink-0 text-primary" />
  }
}

export function timeAgo(dateStr: string): string {
  const now = Date.now()
  const diff = Math.floor((now - new Date(dateStr).getTime()) / 1000)

  if (diff < 60) return "acum"
  if (diff < 3600) return `${Math.floor(diff / 60)}m`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`
  if (diff < 2592000) return `${Math.floor(diff / 86400)}z`
  return `${Math.floor(diff / 2592000)}l`
}

function NotificationItem({
  notification,
  onRead,
}: {
  notification: Notification
  onRead: (id: string) => void
}) {
  const isUnread = !notification.read_at

  return (
    <button
      onClick={() => !notification.read_at && onRead(notification.id)}
      className={cn(
        "w-full text-left flex gap-2.5 px-3 py-2.5 transition-colors duration-150",
        isUnread
          ? "bg-primary/[0.06] hover:bg-primary/[0.10]"
          : "hover:bg-white/[0.04]"
      )}
    >
      <div className={cn("mt-0.5", isUnread ? "text-primary" : "text-white/30")}>
        {getIcon(notification.type)}
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn("font-condensed text-[11px] tracking-[0.06em] leading-tight truncate", isUnread ? "text-white/85" : "text-white/45")}>
          {notification.title}
        </p>
        {notification.message && (
          <p className="text-[10px] text-white/30 mt-0.5 leading-tight line-clamp-2">
            {notification.message}
          </p>
        )}
      </div>
      <span className="text-[9px] text-white/22 font-condensed tracking-wide shrink-0 mt-0.5">
        {timeAgo(notification.created_at)}
      </span>
      {isUnread && (
        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
      )}
    </button>
  )
}

export function NotificationBell({ userId }: { userId: string | null }) {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications(userId)

  if (!userId) return null

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative flex items-center justify-center h-9 w-9 text-white/28 hover:text-primary hover:bg-white/[0.07] transition-all duration-200 outline-none">
          <Bell className="h-[14px] w-[14px]" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 min-w-[14px] h-[14px] bg-primary text-white text-[8px] font-condensed font-bold tracking-wide flex items-center justify-center px-0.5 leading-none">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
          <span className="sr-only">Notificări</span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-80 p-0 bg-[#0e0b07]/97 backdrop-blur-2xl border-white/[0.09] rounded-none shadow-[0_16px_48px_rgba(0,0,0,0.65)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2.5 border-b border-white/[0.07]">
          <span className="font-condensed text-[11px] tracking-[0.20em] uppercase text-white/50">
            Notificări
          </span>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1 text-[9px] font-condensed tracking-wide text-white/30 hover:text-primary transition-colors duration-150"
            >
              <CheckCheck className="h-3 w-3" />
              Marchează toate
            </button>
          )}
        </div>

        {/* List */}
        <div className="max-h-[360px] overflow-y-auto">
          {loading ? (
            <div className="flex flex-col gap-px py-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="px-3 py-2.5 flex gap-2.5">
                  <div className="h-3.5 w-3.5 bg-white/[0.07] animate-pulse shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-2.5 bg-white/[0.07] animate-pulse w-3/4" />
                    <div className="h-2 bg-white/[0.05] animate-pulse w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="px-3 py-8 text-center">
              <Bell className="h-6 w-6 text-white/10 mx-auto mb-2" />
              <p className="font-condensed text-[10px] tracking-[0.14em] uppercase text-white/22">
                Nicio notificare
              </p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-white/[0.04]">
              {notifications.map((n) => (
                <NotificationItem key={n.id} notification={n} onRead={markAsRead} />
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
