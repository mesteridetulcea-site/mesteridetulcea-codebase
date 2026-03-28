import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import Image from "next/image"
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

      {/* ── Dark hero band ── */}
      <section className="relative bg-[#0d0905] overflow-hidden -mt-[62px]" style={{ minHeight: 320 }}>

        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1516216628859-9bccecab13ca?q=80&w=1470&auto=format&fit=crop"
            alt=""
            fill
            priority
            className="object-cover object-center opacity-[0.14]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0905]/88 via-[#0d0905]/52 to-[#0d0905]/94" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0905]/80 via-transparent to-[#0d0905]/80" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 28%, rgba(13,9,5,0.80) 100%)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.042]"
          style={{
            backgroundImage: "linear-gradient(rgba(196,146,30,1) 1px, transparent 1px), linear-gradient(90deg, rgba(196,146,30,1) 1px, transparent 1px)",
            backgroundSize: "52px 52px",
            maskImage: "radial-gradient(ellipse 76% 78% at 50% 50%, black 20%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 76% 78% at 50% 50%, black 20%, transparent 100%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 55% at 50% 60%, rgba(196,146,30,0.065) 0%, transparent 70%)" }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/28 to-transparent" />

        <div className="container relative z-10 flex flex-col items-center text-center pt-[96px] pb-14">

          {/* Ornament */}
          <div className="flex items-center gap-5 mb-7">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/38" />
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-primary/58 rotate-45" />
              <div className="w-1 h-1 bg-primary/28 rotate-45" />
              <div className="w-1.5 h-1.5 bg-primary/58 rotate-45" />
            </div>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/38" />
          </div>

          <p className="font-condensed text-primary text-[11px] tracking-[0.32em] uppercase mb-4">
            Cont meșter
          </p>

          <h1
            className="font-display text-white leading-[1.06] tracking-tight"
            style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)", fontWeight: 600 }}
          >
            Devino{" "}
            <em className="text-primary" style={{ fontStyle: "italic" }}>meșter</em>{" "}
            în Tulcea
          </h1>

          <p className="mt-4 font-condensed text-[12px] tracking-[0.18em] uppercase text-white/55">
            Completează datele — profilul tău va fi verificat înainte de publicare
          </p>
        </div>
      </section>

      {/* ── White form section ── */}
      <main className="flex-1 bg-white">
        <div className="container py-12 max-w-2xl">
          <BecomeMesterForm categories={categories ?? []} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
