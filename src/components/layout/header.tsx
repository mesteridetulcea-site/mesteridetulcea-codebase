"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import {
  Search,
  User,
  LogOut,
  Heart,
  Settings,
  LayoutDashboard,
  ChevronDown,
  ClipboardList,
  Truck,
} from "lucide-react"
import { useUser } from "@/lib/hooks/use-user"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils/cn"
import { NotificationBell } from "@/components/layout/notification-bell"

const staticNavLinks = [
  { href: "/mesteri", label: "Meșteri" },
  { href: "/cauta", label: "Caută" },
  { href: "/transport", label: "Transport" },
]

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, profile, hasMesterProfile, mesterProfileId, loading } = useUser()

  const navLinks = [
    ...staticNavLinks,
    ...(hasMesterProfile ? [{ href: "/cereri", label: "Cereri" }] : []),
  ]
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Transparent only on the home page before scroll
  const isHomePage = pathname === "/"
  const isTransparent = isHomePage && !scrolled

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 72)
    }
    // Set initial state immediately
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const getInitials = (name: string | null) => {
    if (!name) return "U"
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
  }

  return (
    <header
      style={{
        transform: mounted ? "translateY(0)" : "translateY(-110%)",
        opacity: mounted ? 1 : 0,
        transition:
          "transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.45s ease, background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
      }}
      className={cn(
        "sticky top-0 z-50 w-full backdrop-blur-2xl backdrop-saturate-150",
        isTransparent
          ? "bg-[#0d0905]/14 border-b border-white/[0.03] shadow-none"
          : "bg-[#0a0804]/86 border-b border-white/[0.08] shadow-[0_8px_40px_rgba(0,0,0,0.48),inset_0_-1px_0_rgba(196,146,30,0.05)]"
      )}
    >
      {/* Gold top line — only when opaque */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(196,146,30,0.38) 20%, rgba(196,146,30,0.38) 80%, transparent)",
          opacity: isTransparent ? 0 : 1,
          transition: "opacity 0.35s ease",
        }}
      />

      <div className="container grid h-[62px] grid-cols-[1fr_auto_1fr] items-center px-8 md:px-16 lg:px-20">

        {/* ── Logo ── */}
        <Link href="/" className="group flex flex-col leading-none shrink-0">
          <span className="font-display italic font-light text-white/30 text-[9px] tracking-[0.26em] group-hover:text-primary/65 transition-colors duration-300">
            Meșteri de
          </span>
          <span className="font-condensed font-bold text-white/88 text-[16px] tracking-[0.28em] uppercase group-hover:text-primary transition-colors duration-300">
            Tulcea
          </span>
        </Link>

        {/* ── Desktop nav — pill group with shared border ── */}
        <nav className="hidden md:flex items-center">
          <div className="flex items-center border border-white/[0.08] bg-white/[0.025]">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative font-condensed text-[11px] tracking-[0.22em] uppercase transition-all duration-200 px-5 py-[10px]",
                  i < navLinks.length - 1 && "border-r border-white/[0.06]",
                  pathname === link.href
                    ? "text-primary bg-primary/[0.08]"
                    : "text-white/40 hover:text-white/80 hover:bg-white/[0.05]"
                )}
              >
                {link.label}
                {/* Active dot indicator */}
                {pathname === link.href && (
                  <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-[3px] h-[3px] bg-primary rotate-45 inline-block" />
                )}
              </Link>
            ))}
          </div>
        </nav>

        {/* ── Right side ── */}
        <div className="flex items-center gap-0.5 justify-end">

          {/* Search icon */}
          <Link href="/cauta">
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex text-white/28 hover:text-primary hover:bg-white/[0.07] rounded-none h-9 w-9 transition-all duration-200"
            >
              <Search className="h-[14px] w-[14px]" />
              <span className="sr-only">Caută</span>
            </Button>
          </Link>

          {/* Notification bell — desktop only (mobile uses bottom sheet) */}
          {user && (
            <div className="hidden md:block">
              <NotificationBell userId={user.id} />
            </div>
          )}

          {/* Separator */}
          <div className="hidden md:block w-px h-4 bg-white/[0.1] mx-2" />

          {/* Auth section — hidden on mobile (bottom nav handles it) */}
          {loading ? (
            <div className="hidden md:block h-7 w-14 bg-white/[0.07] animate-pulse" />
          ) : user && profile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="hidden md:flex items-center gap-1.5 px-2 py-1.5 hover:bg-white/[0.07] transition-colors duration-200 outline-none group">
                  <Avatar className="h-9 w-9 rounded-none">
                    <AvatarImage
                      src={profile.avatar_url || undefined}
                      alt={profile.full_name || "User"}
                    />
                    <AvatarFallback className="bg-primary/70 text-white text-[10px] rounded-none font-condensed tracking-wider border border-primary/25">
                      {getInitials(profile.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-2.5 w-2.5 text-white/25 group-hover:text-white/50 transition-colors duration-200" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 bg-[#0e0b07]/95 backdrop-blur-2xl border-white/[0.09] rounded-none shadow-[0_16px_48px_rgba(0,0,0,0.65)]"
                align="end"
                forceMount
              >
                <DropdownMenuLabel className="font-normal py-3">
                  <div className="flex flex-col space-y-0.5">
                    <p className="font-condensed text-sm font-medium tracking-wider text-white/80">
                      {profile.full_name || "Utilizator"}
                    </p>
                    <p className="text-xs text-white/28">{profile.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/[0.07]" />
                {profile.role === "admin" && (
                  <DropdownMenuItem asChild className="text-white/50 focus:text-primary focus:bg-primary/10 rounded-none">
                    <Link href="/admin">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span className="font-condensed tracking-wide">Panou Admin</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                {(profile.role === "mester" || hasMesterProfile) && profile.role !== "admin" && (
                  <DropdownMenuItem asChild className="text-white/50 focus:text-primary focus:bg-primary/10 rounded-none">
                    <Link href="/mester-cont">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span className="font-condensed tracking-wide">Panou Meșter</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                {(profile.role === "mester" || hasMesterProfile) && profile.role !== "admin" && (
                  <DropdownMenuItem asChild className="text-white/50 focus:text-primary focus:bg-primary/10 rounded-none">
                    <Link href="/cont/cereri">
                      <Truck className="mr-2 h-4 w-4" />
                      <span className="font-condensed tracking-wide">Cereri transport</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild className="text-white/50 focus:text-primary focus:bg-primary/10 rounded-none">
                  <Link href="/cont/favorite">
                    <Heart className="mr-2 h-4 w-4" />
                    <span className="font-condensed tracking-wide">Favorite</span>
                  </Link>
                </DropdownMenuItem>
                {profile.role === "client" && !hasMesterProfile && (
                  <DropdownMenuItem asChild className="text-white/50 focus:text-primary focus:bg-primary/10 rounded-none">
                    <Link href="/cont/cereri">
                      <ClipboardList className="mr-2 h-4 w-4" />
                      <span className="font-condensed tracking-wide">Cererile mele</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                {mesterProfileId && (
                  <DropdownMenuItem asChild className="text-white/50 focus:text-primary focus:bg-primary/10 rounded-none">
                    <Link href={`/mester/${mesterProfileId}`}>
                      <User className="mr-2 h-4 w-4" />
                      <span className="font-condensed tracking-wide">Profil public</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild className="text-white/50 focus:text-primary focus:bg-primary/10 rounded-none">
                  <Link href="/cont/setari">
                    <Settings className="mr-2 h-4 w-4" />
                    <span className="font-condensed tracking-wide">Setări</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/[0.07]" />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-red-400/60 focus:text-red-400 focus:bg-red-500/10 rounded-none"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span className="font-condensed tracking-wide">Deconectare</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/36 hover:text-white/76 hover:bg-white/[0.07] rounded-none font-condensed tracking-[0.15em] uppercase text-[11px] h-8 px-3 transition-all duration-200"
                >
                  Autentificare
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="bg-primary/82 hover:bg-primary text-white rounded-none font-condensed tracking-[0.15em] uppercase text-[11px] h-8 px-4 border border-primary/35 transition-all duration-200"
                  style={{
                    boxShadow: "0 0 20px rgba(196,146,30,0.22), inset 0 1px 0 rgba(255,255,255,0.09)",
                  }}
                >
                  Înregistrare
                </Button>
              </Link>
            </div>
          )}

        </div>
      </div>
    </header>
  )
}
