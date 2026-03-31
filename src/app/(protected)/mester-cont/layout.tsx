import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { MesterSidebar, MesterBottomNav } from "@/components/dashboard/mester-sidebar"

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

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

  const { data: mester } = await supabase
    .from("mester_profiles")
    .select("id, approval_status")
    .eq("user_id", user.id)
    .single()

  if (!mester) {
    redirect("/devino-mester")
  }

  return (
    <div style={{ background: "white", minHeight: "100dvh" }}>
      <div className="flex">
        {/* Desktop sidebar — dark, sticky */}
        <aside
          className="dark hidden md:block flex-shrink-0 sticky top-0 self-start"
          style={{ width: "224px", height: "100dvh" }}
        >
          <MesterSidebar />
        </aside>

        {/* Main content — white, scrolls naturally */}
        <main
          className="flex-1 min-w-0 min-h-dvh pb-24 md:pb-0"
          style={{ background: "white", borderLeft: "1px solid #e0c99a" }}
        >
          {children}
        </main>
      </div>

      {/* Mobile bottom nav — fixed to viewport, NOT inside overflow:hidden */}
      <MesterBottomNav />
    </div>
  )
}
