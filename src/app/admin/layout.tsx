import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

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

  // Check admin role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single() as { data: { role: string } | null }

  if (profile?.role !== "admin") {
    redirect("/")
  }

  return (
    <div className="flex h-screen">
      <aside className="hidden w-64 flex-shrink-0 md:block">
        <AdminSidebar />
      </aside>
      <main className="flex-1 overflow-auto bg-muted/10">
        <div className="container py-6">{children}</div>
      </main>
    </div>
  )
}
