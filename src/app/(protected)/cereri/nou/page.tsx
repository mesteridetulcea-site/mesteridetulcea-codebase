import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav"
import { CerereForm } from "./form"
import type { Category } from "@/types/database"

export default async function NoaCererePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login?redirectTo=/cereri/nou")

  const { data: profile } = await supabase
    .from("profiles")
    .select("phone, role")
    .eq("id", user.id)
    .single() as { data: { phone: string | null; role: string } | null }

  if (!profile?.phone?.trim()) redirect("/cont/setari?required=phone")
  if (profile.role === "mester" || profile.role === "admin") redirect("/")

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order")

  return (
    <div className="flex min-h-screen flex-col" style={{ background: "#faf6ed" }}>
      <Header />

      <main className="flex-1 pb-24 md:pb-0">

        {/* ── Hero ── */}
        <section
          className="relative overflow-hidden -mt-[62px]"
          style={{ background: "#0d0905", minHeight: "248px" }}
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

          <div className="container relative z-10 flex flex-col items-center text-center pt-[96px] pb-12 px-6">
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
              Cererile mele
            </p>

            <h1
              className="font-display text-white/92 leading-[1.06] tracking-tight"
              style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)", fontWeight: 600 }}
            >
              Cerere <em className="text-primary italic">nouă</em>
            </h1>

            <p className="mt-3 font-condensed tracking-[0.16em] uppercase text-white/28" style={{ fontSize: "10px" }}>
              Descrie lucrarea și meșterii potriviți te vor contacta direct
            </p>
          </div>
        </section>

        {/* ── Form ── */}
        <div className="container px-4 md:px-8 lg:px-16 py-10 md:py-14 max-w-xl mx-auto">
          <div className="mb-6">
            <a
              href="/cont/cereri"
              className="font-condensed tracking-[0.16em] uppercase transition-colors duration-150"
              style={{ fontSize: "11px", color: "#8a6848" }}
            >
              ← Înapoi la cereri
            </a>
          </div>
          <CerereForm categories={(categories || []) as Category[]} />

          {/* Devino Meșter CTA */}
          <div
            className="mt-10 px-5 py-5 flex flex-col sm:flex-row sm:items-center gap-4"
            style={{ border: "1px solid #e0c99a", background: "#fdf9f0" }}
          >
            <div className="flex-1">
              <p className="font-condensed tracking-[0.12em] uppercase text-xs text-[#8a6848] mb-1">
                Ești meșter?
              </p>
              <p className="text-sm text-[#584528]/80 leading-relaxed">
                Înregistrează-te ca meșter și primești cereri direct pe telefon.
              </p>
            </div>
            <Link
              href="/devino-mester"
              className="shrink-0 font-condensed tracking-[0.18em] uppercase text-xs px-5 py-2.5 transition-colors duration-150"
              style={{
                background: "#0d0905",
                color: "#c4921e",
                border: "1px solid #584528",
              }}
            >
              Devino Meșter →
            </Link>
          </div>
        </div>

      </main>

      <div className="hidden md:block">
        <Footer />
      </div>
      <MobileBottomNav />
    </div>
  )
}
