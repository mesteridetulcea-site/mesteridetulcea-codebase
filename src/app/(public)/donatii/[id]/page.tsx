import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Phone, Clock, Gift } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ro } from "date-fns/locale"
import { createClient } from "@/lib/supabase/server"
import { getDonationById } from "@/actions/donations"
import { CererePhotoCarousel } from "@/components/cerere/cerere-photo-carousel"
import { DonationActions } from "@/components/donation/donation-actions"

interface Props {
  params: Promise<{ id: string }>
}

export default async function DonatiePage({ params }: Props) {
  const { id } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const donation = await getDonationById(id, user?.id)
  if (!donation) notFound()

  const isOwner = user?.id === donation.user_id
  const pendingCount = isOwner
    ? donation.donation_photos.filter((p) => p.approval_status === "pending").length
    : 0

  return (
    <>
      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section className="relative bg-[#0d0905] overflow-hidden -mt-[62px]" style={{ minHeight: 280 }}>

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0905]/95 via-[#0d0905]/80 to-[#0d0905]/98" />

        {/* Gold grid */}
        <div className="absolute inset-0 opacity-[0.032]"
          style={{
            backgroundImage: "linear-gradient(rgba(196,146,30,1) 1px, transparent 1px), linear-gradient(90deg, rgba(196,146,30,1) 1px, transparent 1px)",
            backgroundSize: "52px 52px",
            maskImage: "radial-gradient(ellipse 76% 78% at 50% 50%, black 20%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 76% 78% at 50% 50%, black 20%, transparent 100%)",
          }}
        />

        {/* Bottom rule */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/28 to-transparent" />

        <div className="container relative z-10 pt-[90px] pb-10">

          {/* Back link */}
          <Link
            href="/donatii"
            className="inline-flex items-center gap-2 font-condensed text-[10px] tracking-[0.22em] uppercase text-white/32 hover:text-primary/70 transition-colors duration-200 mb-8"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Înapoi la donații
          </Link>

          {/* Ornament */}
          <div className="flex items-center gap-5 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/38" />
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-primary/58 rotate-45" />
              <div className="w-1 h-1 bg-primary/28 rotate-45" />
              <div className="w-1.5 h-1.5 bg-primary/58 rotate-45" />
            </div>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/38" />
          </div>

          {/* Status badges */}
          <div className="flex items-center gap-3 mb-4">
            {donation.status === "closed" ? (
              <span className="font-condensed text-[9px] tracking-[0.18em] uppercase px-2.5 py-1 bg-[#584528]/60 text-white/70">
                Donat
              </span>
            ) : (
              <span className="font-condensed text-[9px] tracking-[0.18em] uppercase px-2.5 py-1 bg-[#2d6a2d]/70 text-white/85">
                Disponibil
              </span>
            )}
            {isOwner && (
              <span className="font-condensed text-[9px] tracking-[0.18em] uppercase px-2.5 py-1 bg-primary/60 text-white/85">
                Donația ta
              </span>
            )}
            <time className="flex items-center gap-1.5 font-condensed text-[10px] tracking-[0.14em] uppercase text-white/25">
              <Clock className="h-3 w-3" />
              {formatDistanceToNow(new Date(donation.created_at), { addSuffix: true, locale: ro })}
            </time>
          </div>

          {/* Title */}
          <h1 className="font-display text-white/92 leading-tight"
            style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 600 }}>
            {donation.title}
          </h1>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CONTENT
      ══════════════════════════════════════════ */}
      <div className="bg-white">
        <div className="container py-12">
          <div className="grid lg:grid-cols-3 gap-8">

            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">

              {/* Description */}
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-4 h-px bg-primary/50" />
                  <span className="font-condensed text-[10px] tracking-[0.26em] uppercase text-[#584528]/55">
                    Descriere
                  </span>
                </div>
                <p className="text-[#3d2e14]/75 leading-relaxed whitespace-pre-wrap">
                  {donation.description}
                </p>
              </div>

              {/* Photos */}
              {donation.donation_photos.length > 0 && (
                <div>
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-px bg-primary/50" />
                      <span className="font-condensed text-[10px] tracking-[0.26em] uppercase text-[#584528]/55">
                        Fotografii
                      </span>
                    </div>
                    {pendingCount > 0 && (
                      <span className="font-condensed text-[9px] tracking-[0.16em] uppercase px-2 py-0.5 bg-black/[0.06] text-[#584528]/50">
                        {pendingCount} în așteptare aprobare
                      </span>
                    )}
                  </div>
                  <CererePhotoCarousel
                    photos={donation.donation_photos}
                    isOwner={isOwner}
                  />
                </div>
              )}

              {donation.donation_photos.length === 0 && (
                <div className="border border-dashed border-[#584528]/15 flex flex-col items-center justify-center py-12 gap-3">
                  <Gift className="h-8 w-8 text-[#584528]/18" />
                  <p className="font-condensed text-[10px] tracking-[0.18em] uppercase text-[#584528]/35">
                    Nicio fotografie
                  </p>
                </div>
              )}

              {/* Owner actions */}
              {isOwner && (
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-4 h-px bg-primary/50" />
                    <span className="font-condensed text-[10px] tracking-[0.26em] uppercase text-[#584528]/55">
                      Gestionează donația
                    </span>
                  </div>
                  <DonationActions donationId={donation.id} status={donation.status} redirectAfterDelete="/donatii" />
                </div>
              )}
            </div>

            {/* Sidebar — contact */}
            <div className="lg:col-span-1">
              <div className="bg-[#faf7f0] border border-[#584528]/12 p-6 sticky top-24">

                <div className="flex items-center gap-3 mb-5">
                  <div className="w-4 h-px bg-primary/50" />
                  <span className="font-condensed text-[10px] tracking-[0.26em] uppercase text-[#584528]/55">
                    Contact
                  </span>
                </div>

                {!isOwner ? (
                  <div className="space-y-4">
                    <p className="text-[#3d2e14]/60 text-sm leading-relaxed">
                      Contactează donatorul pentru a prelua obiectul.
                    </p>
                    <a
                      href={`tel:${donation.phone}`}
                      className="flex items-center gap-3 bg-primary/90 hover:bg-primary text-white px-5 py-3 transition-colors duration-200 w-full"
                    >
                      <Phone className="h-4 w-4 shrink-0" />
                      <span className="font-condensed tracking-wider text-sm">{donation.phone}</span>
                    </a>
                    <p className="font-condensed text-[9px] tracking-[0.16em] uppercase text-[#584528]/30 text-center">
                      Obiectul se ridică personal
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-[#3d2e14]/50 text-sm">
                      Acesta este telefonul tău afișat donatorilor:
                    </p>
                    <p className="font-condensed tracking-widest text-[#584528]/80 text-lg">
                      {donation.phone}
                    </p>
                  </div>
                )}

                {donation.status === "closed" && (
                  <div className="mt-4 border-t border-[#584528]/12 pt-4">
                    <p className="font-condensed text-[10px] tracking-[0.18em] uppercase text-[#584528]/40 text-center">
                      Acest obiect a fost deja donat
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}
