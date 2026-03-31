import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminSidebar, AdminBottomNav } from "@/components/admin/admin-sidebar"

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?redirectTo=/admin")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single() as { data: { role: string } | null }

  if (profile?.role !== "admin") {
    redirect("/")
  }

  return (
    <div style={{ background: "white", minHeight: "100dvh" }}>
      <div className="flex">
        {/* Desktop sidebar — dark, sticky */}
        <aside
          className="dark hidden md:block flex-shrink-0 sticky top-0 self-start"
          style={{ width: "224px", height: "100dvh" }}
        >
          <AdminSidebar />
        </aside>

        {/* Main content — white, scrolls naturally */}
        <main
          className="flex-1 min-w-0 min-h-dvh pb-24 md:pb-0"
          style={{ background: "white", borderLeft: "1px solid #e0c99a" }}
        >
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <AdminBottomNav />
    </div>
  )
}
