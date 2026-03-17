import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getMesterProfile } from "@/actions/mester"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav"
import { MesterSettingsForm } from "@/components/settings/mester-settings-form"
import { ClientSettingsForm } from "@/components/settings/client-settings-form"
import { Settings } from "lucide-react"
import type { Category } from "@/types/database"

async function getPageData() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
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
    <div className="flex min-h-screen flex-col" style={{ background: "#faf6ed" }}>
      <Header />
      <main className="flex-1 pb-32 md:pb-0">

        {/* ── Hero ── */}
        <section
          className="relative overflow-hidden -mt-[62px]"
          style={{ background: "#0d0905", minHeight: "240px" }}
        >
          {/* Gold grid */}
          <div
            className="absolute inset-0 opacity-[0.038]"
            style={{
              backgroundImage: "linear-gradient(rgba(196,146,30,1) 1px, transparent 1px), linear-gradient(90deg, rgba(196,146,30,1) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
              maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%)",
              WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%)",
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 70% 60% at 50% 60%, rgba(196,146,30,0.07) 0%, transparent 70%)" }}
          />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/28 to-transparent" />

          <div className="container relative z-10 pt-[96px] pb-12 px-4 md:px-8">
            {/* Ornament */}
            <div className="flex items-center gap-5 mb-7">
              <div className="h-px w-14 bg-gradient-to-r from-transparent to-primary/38" />
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-primary/58 rotate-45" />
                <div className="w-1 h-1 bg-primary/28 rotate-45" />
                <div className="w-1.5 h-1.5 bg-primary/58 rotate-45" />
              </div>
              <div className="h-px w-14 bg-gradient-to-l from-transparent to-primary/38" />
            </div>

            {/* Overline */}
            <div className="flex items-center gap-2 mb-3">
              <Settings style={{ width: "11px", height: "11px", color: "hsl(38 68% 44% / 0.7)" }} />
              <span className="font-condensed tracking-[0.28em] uppercase text-primary" style={{ fontSize: "10px" }}>
                {isMester ? "Profil meșter" : "Contul meu"}
              </span>
            </div>

            <h1
              className="font-display text-white/92 leading-[1.06] tracking-tight mb-3"
              style={{ fontSize: "clamp(1.7rem, 4vw, 2.8rem)", fontWeight: 600 }}
            >
              {isMester ? (
                <>Setări <em className="text-primary italic">meșter</em></>
              ) : (
                <>Setări <em className="text-primary italic">cont</em></>
              )}
            </h1>

            <p className="font-condensed tracking-wide text-white/28" style={{ fontSize: "12px" }}>
              {isMester
                ? "Actualizează informațiile profilului tău public"
                : "Actualizează datele tale personale"}
            </p>
          </div>
        </section>

        {/* ── Content ── */}
        <div className="container px-4 md:px-8 max-w-2xl mx-auto py-10 md:py-14">

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
                categoryIds: mester.mester_categories?.map((c) => c.category_id) || [],
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

      <div className="hidden md:block">
        <Footer />
      </div>
      <MobileBottomNav />
    </div>
  )
}
