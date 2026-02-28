import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import BecomeMesterForm from "./form"

export default async function BecomeMesterPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?redirectTo=/devino-mester")
  }

  const { data: existing } = await supabase
    .from("mester_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single()

  if (existing) {
    redirect("/mester-cont")
  }

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("sort_order")

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <BecomeMesterForm categories={categories ?? []} />
      </main>
      <Footer />
    </div>
  )
}
