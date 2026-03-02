"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Image,
  FolderTree,
  Hammer,
} from "lucide-react"
import { cn } from "@/lib/utils/cn"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

const sidebarLinks = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Meșteri",
    href: "/admin/mesteri",
    icon: Users,
  },
  {
    title: "Fotografii",
    href: "/admin/fotografii",
    icon: Image,
  },
  {
    title: "Categorii",
    href: "/admin/categorii",
    icon: FolderTree,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col border-r bg-muted/30">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/admin" className="flex items-center gap-2">
          <Hammer className="h-6 w-6 text-primary" />
          <span className="font-bold">Panou Admin</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {sidebarLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button
                variant={pathname === link.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  pathname === link.href && "bg-secondary"
                )}
              >
                <link.icon className="mr-2 h-4 w-4" />
                {link.title}
              </Button>
            </Link>
          ))}
        </nav>
      </ScrollArea>
      <div className="border-t p-4">
        <Link href="/">
          <Button variant="outline" className="w-full">
            Înapoi la site
          </Button>
        </Link>
      </div>
    </div>
  )
}
