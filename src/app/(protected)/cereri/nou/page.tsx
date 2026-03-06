import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CerereForm } from "./form"
import type { Category } from "@/types/database"

export default async function NoaCererePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login?redirectTo=/cereri/nou")

  // Check phone — redirect to settings if missing
  const { data: profile } = await supabase
    .from("profiles")
    .select("phone, role")
    .eq("id", user.id)
    .single() as { data: { phone: string | null; role: string } | null }

  if (!profile?.phone?.trim()) {
    redirect("/cont/setari?required=phone")
  }

  // Mesters and admins can't post cereri
  if (profile.role === "mester" || profile.role === "admin") {
    redirect("/")
  }

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order")

  return (
    <div className="flex min-h-screen flex-col bg-[#0f0b04]">
      <Header />

      {/* Dark header band */}
      <div className="bg-[#0f0b04] border-b border-[#584528]/40 py-10">
        <div className="container">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-px h-8 bg-primary/50" />
            <h1 className="font-condensed text-2xl font-bold tracking-[0.12em] uppercase text-white/88">
              Cerere nouă
            </h1>
          </div>
          <p className="text-white/35 font-condensed tracking-[0.14em] text-sm ml-4">
            Descrie problema ta și meșterii din categoria potrivită vor putea să te contacteze
          </p>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 bg-[#faf7f2] py-10">
        <div className="container max-w-xl">
          <CerereForm categories={(categories || []) as Category[]} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
