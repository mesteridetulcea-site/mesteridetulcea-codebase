import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { MesterSidebar } from "@/components/dashboard/mester-sidebar"

export default async function MesterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?redirectTo=/mester-cont")
  }

  // Check if user has a mester profile
  const { data: mester } = await supabase
    .from("mester_profiles")
    .select("id, approval_status")
    .eq("user_id", user.id)
    .single()

  if (!mester) {
    redirect("/devino-mester")
  }

  return (
    <div className="flex h-screen">
      <aside className="hidden w-64 flex-shrink-0 md:block">
        <MesterSidebar />
      </aside>
      <main className="flex-1 overflow-auto bg-muted/10">
        <div className="container py-6">{children}</div>
      </main>
    </div>
  )
}
