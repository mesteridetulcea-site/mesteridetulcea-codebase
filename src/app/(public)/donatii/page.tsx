import Image from "next/image"
import { Gift } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { getDonations } from "@/actions/donations"
import { DonationCard } from "@/components/donation/donation-card"
import { DonationAddButton } from "@/components/donation/donation-add-button"

export default async function DonatiiPage() {
  // Fetch donations
  const donations = await getDonations()

  // Check auth + phone for the add button
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let hasPhone = false
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("phone")
      .eq("id", user.id)
      .single() as { data: { phone: string | null } | null }
    hasPhone = !!(profile?.phone?.trim())

    if (!hasPhone) {
      const { data: mp } = await supabase
        .from("mester_profiles")
        .select("whatsapp_number")
        .eq("user_id", user.id)
        .single() as { data: { whatsapp_number: string | null } | null }
      hasPhone = !!(mp?.whatsapp_number?.trim())
    }
  }

  return (
    <>
      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section className="relative bg-[#0d0905] overflow-hidden -mt-[62px]" style={{ minHeight: 360 }}>

        {/* Background photo */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1472&auto=format&fit=crop"
            alt=""
            fill
            priority
            className="object-cover object-center opacity-[0.15]"
          />
        </div>

        {/* Dark overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0905]/90 via-[#0d0905]/55 to-[#0d0905]/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0905]/78 via-transparent to-[#0d0905]/78" />

        {/* Vignette */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 28%, rgba(13,9,5,0.82) 100%)" }} />

        {/* Gold grid lines */}
        <div className="absolute inset-0 opacity-[0.042]"
          style={{
            backgroundImage: "linear-gradient(rgba(196,146,30,1) 1px, transparent 1px), linear-gradient(90deg, rgba(196,146,30,1) 1px, transparent 1px)",
            backgroundSize: "52px 52px",
            maskImage: "radial-gradient(ellipse 76% 78% at 50% 50%, black 20%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 76% 78% at 50% 50%, black 20%, transparent 100%)",
          }}
        />

        {/* Gold glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 65% 55% at 50% 60%, rgba(196,146,30,0.065) 0%, transparent 70%)" }} />

        {/* Ghost text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden" aria-hidden="true">
          <span className="font-display font-bold leading-none tracking-tighter whitespace-nowrap"
            style={{ fontSize: "clamp(56px, 16vw, 200px)", color: "rgba(255,255,255,0.022)" }}>
            
          </span>
        </div>

        {/* Bottom rule */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/28 to-transparent" />

        {/* Content */}
        <div className="container relative z-10 pt-[100px] pb-14">

          {/* Ornament */}
          <div className="flex items-center gap-5 mb-8">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/38" />
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-primary/58 rotate-45" />
              <div className="w-1 h-1 bg-primary/28 rotate-45" />
              <div className="w-1.5 h-1.5 bg-primary/58 rotate-45" />
            </div>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/38" />
          </div>

          {/* Overline */}
          <p className="font-condensed text-primary text-[10px] tracking-[0.32em] uppercase mb-4">
            Comunitatea Tulcea
          </p>

          {/* Heading */}
          <h1 className="font-display text-white/92 leading-[1.05]"
            style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)", fontWeight: 600 }}>
            Donații{" "}
            <em className="text-primary" style={{ fontStyle: "italic" }}>gratuite</em>
          </h1>

          {/* Subtitle */}
          <p className="mt-4 font-condensed text-white/32 tracking-[0.16em] text-xs uppercase max-w-lg">
            Obiecte donate de locuitorii din Tulcea · Frigidere · Mobilă · Electronice
          </p>

          {/* Stats strip */}
          <div className="flex items-center gap-6 mt-8">
            <div className="flex items-center gap-2">
              <span className="w-[3px] h-[3px] bg-primary rotate-45 inline-block" />
              <span className="font-condensed text-white/28 text-[11px] tracking-[0.16em] uppercase">
                {donations.length} {donations.length === 1 ? "donație disponibilă" : "donații disponibile"}
              </span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <span className="w-[3px] h-[3px] bg-primary rotate-45 inline-block" />
              <span className="font-condensed text-white/28 text-[11px] tracking-[0.16em] uppercase">
                100% gratuit
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CONTENT
      ══════════════════════════════════════════ */}
      <div className="bg-white">
        <div className="container py-8 md:py-12 pb-24 md:pb-12">

          {/* Header row */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-6 h-px bg-primary/50" />
              <span className="font-condensed text-[11px] tracking-[0.22em] uppercase text-[#584528]/55">
                {donations.length === 0
                  ? "Nicio donație disponibilă"
                  : `${donations.length} ${donations.length === 1 ? "donație" : "donații"}`}
              </span>
            </div>

            <DonationAddButton
              isLoggedIn={!!user}
              hasPhone={hasPhone}
            />
          </div>

          {donations.length === 0 ? (
            /* Empty state */
            <div className="py-24 text-center">
              <div className="flex items-center gap-4 justify-center mb-6">
                <div className="h-px w-20 bg-[#584528]/12" />
                <div className="w-1.5 h-1.5 bg-[#584528]/20 rotate-45" />
                <div className="h-px w-20 bg-[#584528]/12" />
              </div>
              <Gift className="h-10 w-10 text-[#584528]/18 mx-auto mb-4" />
              <p className="font-condensed text-sm tracking-[0.18em] uppercase text-[#584528]/40">
                Nicio donație momentan
              </p>
              <p className="font-condensed text-xs tracking-[0.16em] uppercase text-[#584528]/25 mt-2">
                Fii primul care donează ceva comunității
              </p>
              <div className="flex items-center gap-4 justify-center mt-6">
                <div className="h-px w-20 bg-[#584528]/12" />
                <div className="w-1.5 h-1.5 bg-[#584528]/20 rotate-45" />
                <div className="h-px w-20 bg-[#584528]/12" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-[#584528]/08">
              {donations.map((donation) => (
                <DonationCard
                  key={donation.id}
                  donation={donation}
                  currentUserId={user?.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
