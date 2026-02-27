"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  Hammer,
  Search,
  Menu,
  User,
  LogOut,
  Heart,
  Settings,
  LayoutDashboard,
} from "lucide-react"
import { useUser } from "@/lib/hooks/use-user"
import { signOut } from "@/actions/auth"
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
  const { user, profile, loading } = useUser()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
    <header className="sticky top-0 z-50 w-full border-b border-[#584528] bg-[#0f0b04]">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Hammer className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg text-white hidden sm:inline-block tracking-wide">
            Meșteri de Tulcea
          </span>
          <span className="font-bold text-lg text-white sm:hidden tracking-wide">MdT</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium tracking-widest uppercase transition-colors hover:text-primary",
                pathname === link.href
                  ? "text-primary"
                  : "text-white/70"
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
            <Button variant="ghost" size="icon" className="hidden sm:flex text-white/70 hover:text-primary hover:bg-white/5">
              <Search className="h-5 w-5" />
              <span className="sr-only">Caută</span>
            </Button>
          </Link>

          {/* Auth section */}
          {loading ? (
            <div className="h-8 w-8 rounded-full bg-white/10 animate-pulse" />
          ) : user && profile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full hover:bg-white/10"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={profile.avatar_url || undefined}
                      alt={profile.full_name || "User"}
                    />
                    <AvatarFallback className="bg-primary text-white text-xs">
                      {getInitials(profile.full_name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-[#1a1208] border-[#584528]" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-white">
                      {profile.full_name || "Utilizator"}
                    </p>
                    <p className="text-xs leading-none text-white/50">
                      {profile.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-[#584528]" />
                {profile.role === "admin" && (
                  <DropdownMenuItem asChild className="text-white/80 focus:text-primary focus:bg-white/5">
                    <Link href="/admin">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Admin Panel
                    </Link>
                  </DropdownMenuItem>
                )}
                {profile.role === "mester" && (
                  <DropdownMenuItem asChild className="text-white/80 focus:text-primary focus:bg-white/5">
                    <Link href="/mester-cont">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Panou Meșter
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild className="text-white/80 focus:text-primary focus:bg-white/5">
                  <Link href="/cont">
                    <User className="mr-2 h-4 w-4" />
                    Contul meu
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="text-white/80 focus:text-primary focus:bg-white/5">
                  <Link href="/cont/favorite">
                    <Heart className="mr-2 h-4 w-4" />
                    Favorite
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="text-white/80 focus:text-primary focus:bg-white/5">
                  <Link href="/cont/setari">
                    <Settings className="mr-2 h-4 w-4" />
                    Setări
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#584528]" />
                <DropdownMenuItem
                  onClick={() => signOut()}
                  className="text-red-400 focus:text-red-400 focus:bg-white/5"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Deconectare
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-white/70 hover:text-primary hover:bg-white/5">
                  Autentificare
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-white tracking-wider uppercase text-xs">
                  Înregistrare
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-white/70 hover:text-primary hover:bg-white/5">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Meniu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-[#0f0b04] border-l border-[#584528]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 text-white">
                  <Hammer className="h-5 w-5 text-primary" />
                  Meșteri de Tulcea
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "text-base font-medium tracking-widest uppercase transition-colors hover:text-primary py-3 border-b border-[#584528]/30",
                      pathname === link.href
                        ? "text-primary"
                        : "text-white/70"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                {!user && (
                  <div className="pt-6 mt-2 flex flex-col gap-2">
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button variant="outline" className="w-full border-[#584528] text-white hover:bg-white/5 tracking-wider uppercase text-xs">
                        Autentificare
                      </Button>
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button className="w-full bg-primary hover:bg-primary/90 text-white tracking-wider uppercase text-xs">
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
