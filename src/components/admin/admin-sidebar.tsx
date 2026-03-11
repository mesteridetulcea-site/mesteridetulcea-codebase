"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Image,
  FolderTree,
  Hammer,
  ArrowLeft,
} from "lucide-react"

const navLinks = [
  { href: "/admin",           icon: LayoutDashboard, label: "Dashboard",  short: "Home" },
  { href: "/admin/mesteri",   icon: Users,           label: "Meșteri",    short: "Meșteri" },
  { href: "/admin/fotografii",icon: Image,           label: "Fotografii", short: "Foto" },
  { href: "/admin/categorii", icon: FolderTree,      label: "Categorii",  short: "Categ." },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "#130d06", borderRight: "1px solid #2a1a0e" }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-5 py-5"
        style={{ borderBottom: "1px solid #2a1a0e" }}
      >
        <div
          className="w-8 h-8 flex items-center justify-center shrink-0"
          style={{ background: "hsl(38 68% 44% / 0.15)", border: "1px solid hsl(38 68% 44% / 0.4)", borderRadius: "6px" }}
        >
          <Hammer className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="font-condensed tracking-[0.22em] uppercase text-xs text-primary font-semibold leading-none">
            Admin
          </p>
          <p className="font-condensed tracking-[0.12em] uppercase text-[10px] text-white/35 mt-0.5 leading-none">
            Panou control
          </p>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navLinks.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-3 py-2.5 transition-all duration-200"
              style={{
                borderRadius: "6px",
                background: isActive ? "hsl(38 68% 44% / 0.12)" : "transparent",
                border: isActive ? "1px solid hsl(38 68% 44% / 0.35)" : "1px solid transparent",
                color: isActive ? "hsl(38 68% 44%)" : "rgba(255,255,255,0.45)",
              }}
            >
              <link.icon style={{ width: "16px", height: "16px", flexShrink: 0 }} />
              <span className="font-condensed tracking-[0.1em] uppercase text-xs font-semibold">
                {link.label}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Back to site */}
      <div className="px-3 pb-5" style={{ borderTop: "1px solid #2a1a0e", paddingTop: "16px" }}>
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 transition-all duration-200"
          style={{
            borderRadius: "6px",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.35)",
          }}
        >
          <ArrowLeft style={{ width: "14px", height: "14px", flexShrink: 0 }} />
          <span className="font-condensed tracking-[0.1em] uppercase text-xs">
            Înapoi la site
          </span>
        </Link>
      </div>
    </div>
  )
}

export function AdminBottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-[100] flex items-stretch"
      style={{
        backgroundColor: "#130d06",
        borderTop: "1px solid #2a1a0e",
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
            <span
              className="font-condensed tracking-wide uppercase leading-none"
              style={{ fontSize: "10px" }}
            >
              {link.short}
            </span>
          </Link>
        )
      })}

      {/* Back to site */}
      <Link
        href="/"
        className="flex-1 flex flex-col items-center justify-center gap-1.5 min-w-0 transition-all duration-200"
        style={{ color: "rgba(255,255,255,0.28)", paddingTop: "10px", paddingBottom: "10px" }}
      >
        <div
          className="flex items-center justify-center"
          style={{ width: "44px", height: "32px", borderRadius: "8px" }}
        >
          <ArrowLeft style={{ width: "20px", height: "20px" }} />
        </div>
        <span
          className="font-condensed tracking-wide uppercase leading-none"
          style={{ fontSize: "10px" }}
        >
          Site
        </span>
      </Link>
    </nav>
  )
}
