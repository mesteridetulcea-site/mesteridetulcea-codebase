import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { getMesterProfile } from "@/actions/mester"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { MesterSettingsForm } from "@/components/settings/mester-settings-form"
import { ClientSettingsForm } from "@/components/settings/client-settings-form"
import type { Category } from "@/types/database"

async function getPageData() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, phone, avatar_url")
    .eq("id", user.id)
    .single() as { data: { full_name: string | null; email: string; phone: string | null; avatar_url: string | null } | null }

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order") as { data: Category[] | null }

  const mester = await getMesterProfile()

  return { profile, categories: categories || [], mester }
}

export default async function SetariPage() {
  const { profile, categories, mester } = await getPageData()
  const isMester = !!mester

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors text-sm mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Înapoi acasă
            </Link>
            <h1 className="text-3xl font-bold">Setări</h1>
            <p className="text-muted-foreground">
              {isMester ? "Actualizează informațiile profilului tău de meșter" : "Actualizează datele contului tău"}
            </p>
          </div>

          {isMester ? (
            <MesterSettingsForm
              avatarUrl={profile?.avatar_url ?? null}
              categories={categories}
              initialData={{
                businessName: mester.display_name || "",
                description: mester.bio || "",
                experienceYears: mester.years_experience?.toString() || "",
                whatsappNumber: mester.whatsapp_number || "",
                address: mester.neighborhood || "",
                categoryId: mester.mester_categories?.[0]?.category_id || "",
              }}
            />
          ) : (
            <ClientSettingsForm
              avatarUrl={profile?.avatar_url ?? null}
              initialData={{
                fullName: profile?.full_name || "",
                phone: profile?.phone || "",
                email: profile?.email || "",
              }}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
