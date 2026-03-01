"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import {
  Search,
  Menu,
  User,
  LogOut,
  Heart,
  Settings,
  LayoutDashboard,
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils/cn"

const navLinks = [
  { href: "/mesteri", label: "Meșteri" },
  { href: "/cauta", label: "Caută" },
  { href: "/transport", label: "Transport" },
]

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, profile, loading } = useUser()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const getInitials = (name: string | null) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e8e0d4] bg-white shadow-sm">
      <div className="container flex h-16 items-center justify-between px-8 md:px-12">

        {/* Logo */}
        <Link href="/" className="group flex flex-col leading-none shrink-0">
          <span className="font-display italic font-light text-foreground/40 text-[10px] tracking-[0.2em] group-hover:text-primary/60 transition-colors duration-200">
            Meșteri de
          </span>
          <span className="font-condensed font-bold text-foreground text-[17px] tracking-[0.22em] uppercase group-hover:text-primary transition-colors duration-200">
            Tulcea
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-9">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "nav-link font-condensed text-xs tracking-[0.18em] uppercase transition-colors duration-200 pb-0.5",
                pathname === link.href
                  ? "text-primary nav-link-active"
                  : "text-foreground/50 hover:text-foreground/80"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Search button */}
          <Link href="/cauta">
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex text-foreground/40 hover:text-primary hover:bg-primary/5 rounded-none h-9 w-9"
            >
              <Search className="h-4 w-4" />
              <span className="sr-only">Caută</span>
            </Button>
          </Link>

          {/* Auth section */}
          {loading ? (
            <div className="h-8 w-8 bg-foreground/8 animate-pulse" />
          ) : user && profile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 hover:bg-foreground/5 rounded-none p-0"
                >
                  <Avatar className="h-8 w-8 rounded-none">
                    <AvatarImage
                      src={profile.avatar_url || undefined}
                      alt={profile.full_name || "User"}
                    />
                    <AvatarFallback className="bg-primary text-white text-xs rounded-none font-condensed tracking-wider">
                      {getInitials(profile.full_name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 bg-white border-[#e8e0d4] rounded-none shadow-lg"
                align="end"
                forceMount
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-0.5">
                    <p className="font-condensed text-sm font-medium tracking-wider text-foreground">
                      {profile.full_name || "Utilizator"}
                    </p>
                    <p className="text-xs text-foreground/40">
                      {profile.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-[#e8e0d4]" />
                {profile.role === "admin" && (
                  <DropdownMenuItem asChild className="text-foreground/65 focus:text-primary focus:bg-primary/5 rounded-none">
                    <Link href="/admin">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span className="font-condensed tracking-wide">Admin Panel</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                {profile.role === "mester" && (
                  <DropdownMenuItem asChild className="text-foreground/65 focus:text-primary focus:bg-primary/5 rounded-none">
                    <Link href="/mester-cont">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span className="font-condensed tracking-wide">Panou Meșter</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild className="text-foreground/65 focus:text-primary focus:bg-primary/5 rounded-none">
                  <Link href="/cont">
                    <User className="mr-2 h-4 w-4" />
                    <span className="font-condensed tracking-wide">Contul meu</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="text-foreground/65 focus:text-primary focus:bg-primary/5 rounded-none">
                  <Link href="/cont/favorite">
                    <Heart className="mr-2 h-4 w-4" />
                    <span className="font-condensed tracking-wide">Favorite</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="text-foreground/65 focus:text-primary focus:bg-primary/5 rounded-none">
                  <Link href="/cont/setari">
                    <Settings className="mr-2 h-4 w-4" />
                    <span className="font-condensed tracking-wide">Setări</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#e8e0d4]" />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-red-500/70 focus:text-red-500 focus:bg-red-50 rounded-none"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span className="font-condensed tracking-wide">Deconectare</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-foreground/50 hover:text-foreground hover:bg-foreground/5 rounded-none font-condensed tracking-[0.12em] uppercase text-xs"
                >
                  Autentificare
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/88 text-white rounded-none font-condensed tracking-[0.12em] uppercase text-xs"
                >
                  Înregistrare
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-foreground/45 hover:text-foreground hover:bg-foreground/5 rounded-none h-9 w-9"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Meniu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[280px] sm:w-[340px] bg-white border-l border-[#e8e0d4] rounded-none"
            >
              <SheetHeader className="pb-6 border-b border-[#e8e0d4]">
                <SheetTitle className="flex flex-col items-start gap-0.5">
                  <span className="font-display italic font-light text-foreground/35 text-[10px] tracking-[0.2em]">
                    Meșteri de
                  </span>
                  <span className="font-condensed font-bold text-foreground text-xl tracking-[0.22em] uppercase">
                    Tulcea
                  </span>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col mt-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "font-condensed text-sm tracking-[0.18em] uppercase transition-colors py-4 border-b border-[#e8e0d4]/70",
                      pathname === link.href
                        ? "text-primary"
                        : "text-foreground/50 hover:text-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                {!user && (
                  <div className="pt-8 flex flex-col gap-3">
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button
                        variant="outline"
                        className="w-full border-[#e8e0d4] text-foreground/70 hover:bg-foreground/5 rounded-none font-condensed tracking-[0.12em] uppercase text-xs"
                      >
                        Autentificare
                      </Button>
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button className="w-full bg-primary hover:bg-primary/88 text-white rounded-none font-condensed tracking-[0.12em] uppercase text-xs">
                        Înregistrare
                      </Button>
                    </Link>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
