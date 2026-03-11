import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getMesterProfile } from "@/actions/mester"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav"
import { MesterSettingsForm } from "@/components/settings/mester-settings-form"
import { ClientSettingsForm } from "@/components/settings/client-settings-form"
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
      <main className="flex-1 pb-24 md:pb-0">

        {/* ── Hero header ── */}
        <section
          className="relative overflow-hidden -mt-[62px]"
          style={{ background: "#0d0905", minHeight: "260px" }}
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
          {/* Radial gold glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 70% 60% at 50% 60%, rgba(196,146,30,0.07) 0%, transparent 70%)" }}
          />
          {/* Bottom line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/28 to-transparent" />

          <div className="container relative z-10 flex flex-col items-center text-center pt-[96px] pb-14 px-6">
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

            <p className="font-condensed text-primary text-[10px] tracking-[0.32em] uppercase mb-3">
              {isMester ? "Profil meșter" : "Contul meu"}
            </p>

            <h1
              className="font-display text-white/92 leading-[1.06] tracking-tight"
              style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)", fontWeight: 600 }}
            >
              {isMester ? (
                <>Setări <em className="text-primary italic">meșter</em></>
              ) : (
                <>Setări <em className="text-primary italic">cont</em></>
              )}
            </h1>

            <p className="mt-3 font-condensed tracking-[0.16em] uppercase text-white/28" style={{ fontSize: "10px" }}>
              {isMester ? "Actualizează informațiile profilului tău public" : "Actualizează datele tale personale"}
            </p>
          </div>
        </section>

        {/* ── Form content ── */}
        <div className="container px-4 md:px-8 lg:px-16 py-10 md:py-14 max-w-2xl mx-auto">
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

      <div className="hidden md:block">
        <Footer />
      </div>
      <MobileBottomNav />
    </div>
  )
}
