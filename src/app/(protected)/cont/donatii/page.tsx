import Link from "next/link"
import { Gift, Clock, ImageIcon, Plus, ArrowLeft } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ro } from "date-fns/locale"
import { createClient } from "@/lib/supabase/server"
import { getUserDonations } from "@/actions/donations"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav"
import { DonationAddButton } from "@/components/donation/donation-add-button"
import { DonationActions } from "@/components/donation/donation-actions"

export default async function ContDonatiiPage() {
  const donations = await getUserDonations()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from("profiles")
    .select("phone")
    .eq("id", user!.id)
    .single() as { data: { phone: string | null } | null }

  let hasPhone = !!(profile?.phone?.trim())
  if (!hasPhone) {
    const { data: mp } = await supabase
      .from("mester_profiles")
      .select("whatsapp_number")
      .eq("user_id", user!.id)
      .single() as { data: { whatsapp_number: string | null } | null }
    hasPhone = !!(mp?.whatsapp_number?.trim())
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1 pb-24 md:pb-0">

        {/* ── Hero ── */}
        <section className="relative bg-[#0d0905] overflow-hidden -mt-[62px]" style={{ minHeight: 280 }}>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d0905]/95 via-[#0d0905]/80 to-[#0d0905]/98" />
          <div className="absolute inset-0 opacity-[0.032]"
            style={{
              backgroundImage: "linear-gradient(rgba(196,146,30,1) 1px, transparent 1px), linear-gradient(90deg, rgba(196,146,30,1) 1px, transparent 1px)",
              backgroundSize: "52px 52px",
              maskImage: "radial-gradient(ellipse 76% 78% at 50% 50%, black 20%, transparent 100%)",
              WebkitMaskImage: "radial-gradient(ellipse 76% 78% at 50% 50%, black 20%, transparent 100%)",
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/28 to-transparent" />

          <div className="container relative z-10 pt-[90px] pb-10">
            <Link
              href="/donatii"
              className="inline-flex items-center gap-2 font-condensed text-[10px] tracking-[0.22em] uppercase text-white/32 hover:text-primary/70 transition-colors duration-200 mb-8"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Toate donațiile
            </Link>

            <div className="flex items-center gap-5 mb-6">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/38" />
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-primary/58 rotate-45" />
                <div className="w-1 h-1 bg-primary/28 rotate-45" />
                <div className="w-1.5 h-1.5 bg-primary/58 rotate-45" />
              </div>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/38" />
            </div>

            <p className="font-condensed text-primary text-[10px] tracking-[0.32em] uppercase mb-4">
              Contul meu
            </p>
            <h1 className="font-display text-white/92 leading-tight"
              style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 600 }}>
              Donațiile mele
            </h1>
          </div>
        </section>

        {/* ── Content ── */}
        <div className="container py-10">

          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-6 h-px bg-primary/50" />
              <span className="font-condensed text-[11px] tracking-[0.22em] uppercase text-[#584528]/55">
                {donations.length === 0
                  ? "Nicio donație"
                  : `${donations.length} ${donations.length === 1 ? "donație" : "donații"}`}
              </span>
            </div>

            <DonationAddButton isLoggedIn={true} hasPhone={hasPhone} />
          </div>

          {donations.length === 0 ? (
            <div className="py-20 text-center">
              <div className="flex items-center gap-4 justify-center mb-6">
                <div className="h-px w-16 bg-[#584528]/12" />
                <div className="w-1.5 h-1.5 bg-[#584528]/20 rotate-45" />
                <div className="h-px w-16 bg-[#584528]/12" />
              </div>
              <Gift className="h-10 w-10 text-[#584528]/18 mx-auto mb-4" />
              <p className="font-condensed text-sm tracking-[0.18em] uppercase text-[#584528]/40">
                Nu ai postat nicio donație
              </p>
              <p className="font-condensed text-xs tracking-[0.14em] uppercase text-[#584528]/25 mt-2">
                Donează obiecte comunității din Tulcea
              </p>
              <div className="flex items-center gap-4 justify-center mt-6">
                <div className="h-px w-16 bg-[#584528]/12" />
                <div className="w-1.5 h-1.5 bg-[#584528]/20 rotate-45" />
                <div className="h-px w-16 bg-[#584528]/12" />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-px bg-[#584528]/12">
              {donations.map((donation) => {
                const pendingPhotos = donation.donation_photos.filter(
                  (p) => p.approval_status === "pending"
                )
                const approvedPhotos = donation.donation_photos.filter(
                  (p) => p.approval_status === "approved"
                )

                return (
                  <article key={donation.id} className="bg-white group">
                    <div className="px-7 pt-6 pb-5">

                      {/* Status + time */}
                      <div className="flex items-center justify-between gap-4 mb-3">
                        <div className="flex items-center gap-2">
                          {donation.status === "closed" ? (
                            <span className="font-condensed text-[9px] tracking-[0.16em] uppercase px-2 py-0.5 bg-[#584528]/15 text-[#584528]/60">
                              Donat
                            </span>
                          ) : (
                            <span className="font-condensed text-[9px] tracking-[0.16em] uppercase px-2 py-0.5 bg-green-100 text-green-700/70">
                              Disponibil
                            </span>
                          )}
                          {pendingPhotos.length > 0 && (
                            <span className="font-condensed text-[9px] tracking-[0.14em] uppercase px-2 py-0.5 bg-black/[0.05] text-[#584528]/45">
                              {pendingPhotos.length} poze în așteptare
                            </span>
                          )}
                        </div>
                        <time className="flex items-center gap-1.5 font-condensed text-[10px] tracking-[0.14em] uppercase text-[#584528]/35 shrink-0">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(new Date(donation.created_at), { addSuffix: true, locale: ro })}
                        </time>
                      </div>

                      {/* Title */}
                      <Link href={`/donatii/${donation.id}`}>
                        <h2 className="font-display text-[#1a1208] group-hover:text-primary transition-colors duration-200 leading-tight mb-3"
                          style={{ fontSize: "clamp(1.1rem, 2vw, 1.35rem)", fontWeight: 500 }}>
                          {donation.title}
                        </h2>
                      </Link>

                      {/* Description preview */}
                      <p className="text-[#3d2e14]/60 leading-relaxed text-sm line-clamp-2">
                        {donation.description}
                      </p>

                      {/* Photo thumbnails */}
                      {donation.donation_photos.length > 0 && (
                        <div className="flex items-center gap-3 mt-4">
                          <div className="flex items-center gap-1.5">
                            <ImageIcon className="h-3 w-3 text-[#584528]/35" />
                            <span className="font-condensed text-[9px] tracking-[0.18em] uppercase text-[#584528]/40">
                              {donation.donation_photos.length} {donation.donation_photos.length === 1 ? "foto" : "poze"}
                              {approvedPhotos.length < donation.donation_photos.length && (
                                <span className="text-[#584528]/28 ml-1">
                                  ({approvedPhotos.length} aprobate)
                                </span>
                              )}
                            </span>
                          </div>
                          <div className="flex gap-1.5">
                            {approvedPhotos.slice(0, 3).map((photo) => (
                              <div key={photo.id} className="w-10 h-10 overflow-hidden border border-[#584528]/10 shrink-0">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={photo.url} alt="" className="w-full h-full object-cover" />
                              </div>
                            ))}
                            {approvedPhotos.length > 3 && (
                              <div className="w-10 h-10 border border-[#584528]/10 bg-[#f5eed8] flex items-center justify-center shrink-0">
                                <span className="font-condensed text-[9px] text-[#584528]/45">+{approvedPhotos.length - 3}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex flex-col gap-4 mt-5 pt-4 border-t border-[#584528]/08">
                        <Link
                          href={`/donatii/${donation.id}`}
                          className="font-condensed text-[10px] tracking-[0.20em] uppercase text-[#584528]/55 hover:text-primary transition-colors duration-200 self-start"
                        >
                          Detalii →
                        </Link>
                        <DonationActions donationId={donation.id} status={donation.status} />
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
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
