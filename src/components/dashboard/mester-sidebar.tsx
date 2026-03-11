"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  User,
  ImageIcon,
  CreditCard,
  BarChart3,
  Hammer,
  FolderOpen,
  ArrowLeft,
} from "lucide-react"
import { cn } from "@/lib/utils/cn"

const navLinks = [
  { title: "Dashboard",  short: "Panel",  href: "/mester-cont",           icon: LayoutDashboard },
  { title: "Profil",     short: "Profil", href: "/mester-cont/profil",     icon: User },
  { title: "Fotografii", short: "Foto",   href: "/mester-cont/fotografii", icon: ImageIcon },
  { title: "Proiecte",   short: "Proiec", href: "/mester-cont/proiecte",   icon: FolderOpen },
  { title: "Abonament",  short: "Abon",   href: "/mester-cont/abonament",  icon: CreditCard },
  { title: "Statistici", short: "Stats",  href: "/mester-cont/statistici", icon: BarChart3 },
]

/* ── Desktop sidebar ──────────────────────────────────────────────── */
export function MesterSidebar() {
  const pathname = usePathname()

  return (
    <div
      className="flex h-full flex-col"
      style={{ backgroundColor: "#130d06", borderRight: "1px solid #3d2918" }}
    >
      {/* Brand */}
      <div
        className="flex h-16 items-center gap-3 px-5 shrink-0"
        style={{ borderBottom: "1px solid #3d2918" }}
      >
        <div
          className="w-8 h-8 flex items-center justify-center shrink-0"
          style={{ border: "1px solid hsl(35 55% 32%)" }}
        >
          <Hammer className="h-4 w-4 text-primary" />
        </div>
        <div className="leading-none">
          <div className="font-display text-white text-base" style={{ fontWeight: 600, lineHeight: 1.1 }}>
            Panou
          </div>
          <div className="font-condensed text-primary tracking-[0.24em] uppercase text-[11px]">
            Meșter
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
        {navLinks.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative flex items-center gap-3 px-3 py-3 transition-all duration-200 group",
                isActive
                  ? "text-primary"
                  : "text-white/45 hover:text-white/80 hover:bg-white/[0.04]"
              )}
              style={isActive ? { backgroundColor: "hsl(38 68% 44% / 0.11)" } : {}}
            >
              {isActive && (
                <span
                  className="absolute left-0 top-2 bottom-2 w-[3px] bg-primary"
                  style={{ borderRadius: "0 2px 2px 0", boxShadow: "0 0 10px hsl(38 68% 44% / 0.6)" }}
                />
              )}
              <link.icon className="h-4 w-4 shrink-0 relative z-10" />
              <span className="font-condensed tracking-[0.1em] uppercase text-sm font-medium relative z-10">
                {link.title}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 shrink-0" style={{ borderTop: "1px solid #3d2918" }}>
        <Link
          href="/"
          className="flex items-center gap-2.5 px-3 py-2.5 text-white/25 hover:text-primary transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="font-condensed tracking-[0.1em] uppercase text-sm">
            Înapoi la site
          </span>
        </Link>
      </div>
    </div>
  )
}

/* ── Mobile bottom nav ────────────────────────────────────────────── */
export function MesterBottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-[100] flex items-stretch"
      style={{
        backgroundColor: "#130d06",
        borderTop: "1px solid #3d2918",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      {navLinks.map((link) => {
        const isActive = pathname === link.href
        return (
          <Link
            key={link.href}
            href={link.href}
            className="flex-1 flex flex-col items-center justify-center gap-1.5 min-w-0 transition-all duration-200"
            style={{
              color: isActive ? "hsl(38 68% 44%)" : "rgba(255,255,255,0.38)",
              paddingTop: "10px",
              paddingBottom: "10px",
            }}
          >
            {/* Pill wraps ONLY the icon */}
            <div
              className="flex items-center justify-center transition-all duration-200"
              style={{
                width: "44px",
                height: "32px",
                borderRadius: "8px",
                ...(isActive
                  ? {
                      background: "hsl(38 68% 44% / 0.15)",
                      border: "1px solid hsl(38 68% 44% / 0.4)",
                    }
                  : {}),
              }}
            >
              <link.icon style={{ width: "20px", height: "20px" }} />
            </div>

            {/* Label — always below the pill, never overlapped */}
            <span
              className="font-condensed tracking-wide uppercase leading-none"
              style={{ fontSize: "10px" }}
            >
              {link.short}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
