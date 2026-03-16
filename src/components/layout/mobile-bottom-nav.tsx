"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Users, Search, Truck, Heart, Settings, LogOut, LayoutDashboard, ClipboardList, User, Bell, CheckCheck, Gift } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useUser } from "@/lib/hooks/use-user"
import { useNotifications } from "@/lib/hooks/use-notifications"
import { createClient } from "@/lib/supabase/client"
import { getIcon, timeAgo } from "@/components/layout/notification-bell"

export function MobileBottomNav() {
  const pathname = usePathname()
  const router   = useRouter()
  const { user, profile, hasMesterProfile, mesterProfileId } = useUser()
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications(user?.id ?? null)

  const [sheetOpen, setSheetOpen]   = useState(false)
  const [closing, setClosing]       = useState(false)
  const [animated, setAnimated]     = useState(false)
  const [dragY, setDragY]           = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [showAllNotifs, setShowAllNotifs] = useState(false)
  const startYRef = useRef(0)
  const sheetRef  = useRef<HTMLDivElement>(null)

  // Lock body scroll while sheet is open
  useEffect(() => {
    if (sheetOpen) {
      document.body.style.overflow = "hidden"
      document.body.style.touchAction = "none"
    } else {
      document.body.style.overflow = ""
      document.body.style.touchAction = ""
    }
    return () => {
      document.body.style.overflow = ""
      document.body.style.touchAction = ""
    }
  }, [sheetOpen])

  function openSheet() {
    setDragY(0)
    setClosing(false)
    setAnimated(false)
    setShowAllNotifs(false)
    setSheetOpen(true)
  }

  function closeSheet() {
    setClosing(true)
    setTimeout(() => {
      setSheetOpen(false)
      setClosing(false)
      setDragY(0)
    }, 240)
  }

  function onTouchStart(e: React.TouchEvent) {
    startYRef.current = e.touches[0].clientY
    setIsDragging(true)
  }

  function onTouchMove(e: React.TouchEvent) {
    const delta = e.touches[0].clientY - startYRef.current
    if (delta > 0) setDragY(delta)
  }

  function onTouchEnd() {
    setIsDragging(false)
    const sheetHeight = sheetRef.current?.offsetHeight ?? 400
    if (dragY > sheetHeight * 0.3 || dragY > 120) {
      closeSheet()
    } else {
      setDragY(0)
    }
  }

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    closeSheet()
    router.push("/")
    router.refresh()
  }

  const isContActive = (pathname.startsWith("/cont") && !pathname.startsWith("/cont/favorite")) || pathname.startsWith("/mester-cont")

  const navItems = [
    { href: "/mesteri",   icon: Users,    label: "Meșteri",   matchExact: false },
    { href: "/cauta",     icon: Search,   label: "Caută",     matchExact: false },
    { href: "/donatii",   icon: Gift,     label: "Donații",   matchExact: false },
    { href: "/transport", icon: Truck,    label: "Transport", matchExact: false },
    ...(user ? [{ href: "/cont/favorite", icon: Heart, label: "Favorite", matchExact: false }] : []),
  ]

  const visibleNotifs = showAllNotifs ? notifications : notifications.slice(0, 3)

  return (
    <>
      {/* Bottom tab bar */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-stretch"
        style={{
          backgroundColor: "#0d0905",
          borderTop: "1px solid rgba(196,146,30,0.15)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        {navItems.map((item) => {
          const isActive = item.matchExact
            ? pathname === item.href
            : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center justify-center gap-1.5 min-w-0 transition-all duration-200"
              style={{
                color: isActive ? "hsl(38 68% 44%)" : "rgba(255,255,255,0.32)",
                paddingTop: "10px",
                paddingBottom: "10px",
              }}
            >
              <div
                className="flex items-center justify-center transition-all duration-200"
                style={{
                  width: "42px", height: "30px", borderRadius: "8px",
                  ...(isActive ? { background: "hsl(38 68% 44% / 0.14)", border: "1px solid hsl(38 68% 44% / 0.38)" } : {}),
                }}
              >
                <item.icon style={{ width: "18px", height: "18px" }} />
              </div>
              <span className="font-condensed tracking-wide uppercase leading-none" style={{ fontSize: "9px" }}>
                {item.label}
              </span>
            </Link>
          )
        })}

        {/* Cont tab */}
        {user ? (
          <button
            onClick={openSheet}
            className="flex-1 flex flex-col items-center justify-center gap-1.5 min-w-0 transition-all duration-200"
            style={{
              color: isContActive ? "hsl(38 68% 44%)" : "rgba(255,255,255,0.32)",
              paddingTop: "10px",
              paddingBottom: "10px",
            }}
          >
            <div
              className="relative flex items-center justify-center overflow-hidden transition-all duration-200"
              style={{
                width: "42px", height: "30px", borderRadius: "8px",
                ...(isContActive ? { background: "hsl(38 68% 44% / 0.14)", border: "1px solid hsl(38 68% 44% / 0.38)" } : {}),
              }}
            >
              {profile?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatar_url} alt="" style={{ width: "22px", height: "22px", borderRadius: "50%", objectFit: "cover" }} />
              ) : (
                <Settings style={{ width: "18px", height: "18px" }} />
              )}
              {/* Unread notifications badge on tab */}
              {unreadCount > 0 && (
                <span
                  className="absolute flex items-center justify-center font-condensed font-bold leading-none"
                  style={{
                    top: "1px", right: "2px",
                    minWidth: "13px", height: "13px",
                    background: "hsl(38 68% 44%)",
                    color: "white",
                    fontSize: "7px",
                    borderRadius: "3px",
                    padding: "0 2px",
                  }}
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </div>
            <span className="font-condensed tracking-wide uppercase leading-none" style={{ fontSize: "9px" }}>Cont</span>
          </button>
        ) : (
          <Link
            href="/login"
            className="flex-1 flex flex-col items-center justify-center gap-1.5 min-w-0 transition-all duration-200"
            style={{
              color: pathname === "/login" ? "hsl(38 68% 44%)" : "rgba(255,255,255,0.32)",
              paddingTop: "10px",
              paddingBottom: "10px",
            }}
          >
            <div className="flex items-center justify-center" style={{ width: "42px", height: "30px", borderRadius: "8px" }}>
              <Settings style={{ width: "18px", height: "18px" }} />
            </div>
            <span className="font-condensed tracking-wide uppercase leading-none" style={{ fontSize: "9px" }}>Cont</span>
          </Link>
        )}
      </nav>

      {/* Bottom sheet */}
      {sheetOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 z-[60]"
            style={{
              background: "rgba(5,3,1,0.72)",
              animation: closing ? "none" : "contBackdropIn 0.2s ease forwards",
              opacity: closing ? 0 : undefined,
              transition: closing ? "opacity 0.22s ease" : "none",
            }}
            onClick={closeSheet}
          />

          {/* Keyframes */}
          <style>{`
            @keyframes contSheetUp {
              from { transform: translateY(110%); }
              to   { transform: translateY(0);    }
            }
            @keyframes contBackdropIn {
              from { opacity: 0; }
              to   { opacity: 1; }
            }
          `}</style>

          {/* Sheet panel */}
          <div
            ref={sheetRef}
            className="md:hidden fixed left-0 right-0 z-[70]"
            style={{
              bottom: 0,
              background: "#130d06",
              border: "1px solid rgba(196,146,30,0.18)",
              borderBottom: "none",
              borderRadius: "18px 18px 0 0",
              paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 20px)",
              maxHeight: "90dvh",
              overflowY: "auto",
              willChange: "transform",
              transform: isDragging
                ? `translateY(${dragY}px)`
                : closing ? "translateY(110%)"
                : animated ? "translateY(0)"
                : undefined,
              transition: isDragging ? "none" : closing ? "transform 0.22s cubic-bezier(0.4, 0, 1, 1)" : "none",
              animation: (!isDragging && !closing && !animated)
                ? "contSheetUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards"
                : "none",
            }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onAnimationEnd={() => setAnimated(true)}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing sticky top-0 z-10" style={{ background: "#130d06" }}>
              <div style={{ width: "40px", height: "4px", borderRadius: "2px", background: "rgba(255,255,255,0.15)" }} />
            </div>

            {/* User info card */}
            <div
              className="mx-4 mb-4 flex items-center gap-3 px-4 py-3"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(196,146,30,0.14)", borderRadius: "12px" }}
            >
              <div
                className="shrink-0 flex items-center justify-center overflow-hidden"
                style={{
                  width: "48px", height: "48px", borderRadius: "50%",
                  border: "1px solid rgba(196,146,30,0.35)",
                  background: "hsl(38 68% 44% / 0.14)",
                }}
              >
                {profile?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.avatar_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <User style={{ width: "20px", height: "20px", color: "hsl(38 68% 44% / 0.8)" }} />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-condensed tracking-[0.08em] text-sm font-semibold text-white/85 truncate">
                  {profile?.full_name || "Utilizator"}
                </p>
                <p className="text-xs text-white/35 truncate mt-0.5">
                  {profile?.email || user?.email}
                </p>
              </div>
            </div>

            {/* ── Notificări section ── */}
            {(notifications.length > 0 || loading) && (
              <div className="mx-4 mb-4">
                {/* Section header */}
                <div className="flex items-center justify-between mb-2 px-1">
                  <div className="flex items-center gap-2">
                    <Bell style={{ width: "12px", height: "12px", color: "rgba(255,255,255,0.3)" }} />
                    <span className="font-condensed tracking-[0.18em] uppercase text-white/35" style={{ fontSize: "9px" }}>
                      Notificări
                    </span>
                    {unreadCount > 0 && (
                      <span
                        className="font-condensed font-bold leading-none flex items-center justify-center"
                        style={{
                          minWidth: "16px", height: "16px",
                          background: "hsl(38 68% 44%)",
                          color: "white",
                          fontSize: "8px",
                          borderRadius: "4px",
                          padding: "0 3px",
                        }}
                      >
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="flex items-center gap-1 transition-colors duration-150"
                      style={{ color: "rgba(255,255,255,0.22)" }}
                    >
                      <CheckCheck style={{ width: "11px", height: "11px" }} />
                      <span className="font-condensed tracking-wide" style={{ fontSize: "9px" }}>Toate citite</span>
                    </button>
                  )}
                </div>

                {/* Notifications list */}
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(196,146,30,0.1)", borderRadius: "10px", overflow: "hidden" }}>
                  {loading ? (
                    <div className="px-3 py-3 space-y-2.5">
                      {[1, 2].map((i) => (
                        <div key={i} className="flex gap-2.5">
                          <div className="h-3.5 w-3.5 bg-white/[0.07] animate-pulse shrink-0 mt-0.5 rounded" />
                          <div className="flex-1 space-y-1.5">
                            <div className="h-2.5 bg-white/[0.07] animate-pulse w-3/4 rounded" />
                            <div className="h-2 bg-white/[0.05] animate-pulse w-1/2 rounded" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      {visibleNotifs.map((n, idx) => {
                        const isUnread = !n.read_at
                        return (
                          <button
                            key={n.id}
                            onClick={() => isUnread && markAsRead(n.id)}
                            className="w-full text-left flex gap-2.5 px-3 py-2.5 transition-colors duration-150"
                            style={{
                              background: isUnread ? "hsl(38 68% 44% / 0.06)" : "transparent",
                              borderTop: idx > 0 ? "1px solid rgba(255,255,255,0.04)" : "none",
                            }}
                          >
                            <div className="mt-0.5" style={{ color: isUnread ? "hsl(38 68% 44%)" : "rgba(255,255,255,0.3)" }}>
                              {getIcon(n.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className="font-condensed tracking-[0.06em] leading-tight truncate"
                                style={{ fontSize: "11px", color: isUnread ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.45)" }}
                              >
                                {n.title}
                              </p>
                              {n.message && (
                                <p className="leading-tight line-clamp-2 mt-0.5" style={{ fontSize: "10px", color: "rgba(255,255,255,0.28)" }}>
                                  {n.message}
                                </p>
                              )}
                            </div>
                            <div className="flex flex-col items-end gap-1.5 shrink-0">
                              <span className="font-condensed tracking-wide" style={{ fontSize: "9px", color: "rgba(255,255,255,0.22)" }}>
                                {timeAgo(n.created_at)}
                              </span>
                              {isUnread && (
                                <span className="h-1.5 w-1.5 rounded-full" style={{ background: "hsl(38 68% 44%)" }} />
                              )}
                            </div>
                          </button>
                        )
                      })}

                      {/* Show more / less */}
                      {notifications.length > 3 && (
                        <button
                          onClick={() => setShowAllNotifs((v) => !v)}
                          className="w-full py-2 font-condensed tracking-[0.14em] uppercase transition-colors duration-150"
                          style={{
                            fontSize: "9px",
                            color: "rgba(255,255,255,0.25)",
                            borderTop: "1px solid rgba(255,255,255,0.04)",
                          }}
                        >
                          {showAllNotifs ? "Mai puțin" : `+ ${notifications.length - 3} mai multe`}
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Links */}
            <div className="mx-4 mb-3 space-y-0.5">
              {profile?.role === "admin" && (
                <SheetLink href="/admin" icon={LayoutDashboard} label="Panou Admin" onClose={closeSheet} />
              )}
              {hasMesterProfile && profile?.role !== "admin" && (
                <SheetLink href="/mester-cont" icon={LayoutDashboard} label="Panou Meșter" onClose={closeSheet} />
              )}
              {mesterProfileId && (
                <SheetLink href={`/mester/${mesterProfileId}`} icon={User} label="Profil public" onClose={closeSheet} />
              )}
              {profile?.role === "client" && !hasMesterProfile && (
                <SheetLink href="/cont/cereri" icon={ClipboardList} label="Cererile mele" onClose={closeSheet} />
              )}
              <SheetLink href="/cont/setari" icon={Settings} label="Setări cont" onClose={closeSheet} />
            </div>

            {/* Logout */}
            <div className="mx-4" style={{ borderTop: "1px solid rgba(196,146,30,0.1)", paddingTop: "12px" }}>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 h-11 font-condensed tracking-[0.14em] uppercase text-sm font-semibold transition-all duration-200"
                style={{
                  background: "rgba(220,38,38,0.08)",
                  border: "1px solid rgba(220,38,38,0.22)",
                  borderRadius: "10px",
                  color: "rgba(248,113,113,0.85)",
                }}
              >
                <LogOut style={{ width: "15px", height: "15px" }} />
                Deconectare
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}

function SheetLink({
  href, icon: Icon, label, onClose,
}: {
  href: string
  icon: React.ComponentType<{ style?: React.CSSProperties }>
  label: string
  onClose: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClose}
      className="flex items-center gap-3 px-4 py-3 transition-colors active:bg-white/[0.04]"
      style={{ borderRadius: "8px" }}
    >
      <Icon style={{ width: "16px", height: "16px", color: "rgba(255,255,255,0.38)", flexShrink: 0 }} />
      <span className="font-condensed tracking-[0.1em] uppercase text-xs text-white/55">{label}</span>
    </Link>
  )
}
