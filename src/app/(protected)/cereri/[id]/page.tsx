import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Image from "next/image"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ArrowLeft, Phone, Tag, Clock } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { ro } from "date-fns/locale"
import { CererePhotoCarousel } from "@/components/cerere/cerere-photo-carousel"

interface CererePhoto {
  id: string
  url: string
  approval_status: string
}

interface CerereDetail {
  id: string
  title: string | null
  original_message: string
  client_phone: string | null
  status: string | null
  created_at: string
  client_id: string | null
  category: { name: string } | null
  cerere_photos: CererePhoto[]
}

export default async function CerereDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: cerere } = await supabase
    .from("service_requests")
    .select(
      "id, title, original_message, client_phone, status, created_at, client_id, category:categories(name), cerere_photos(id, url, approval_status)"
    )
    .eq("id", id)
    .single()

  if (!cerere) notFound()

  const isOwner = user?.id === (cerere as CerereDetail).client_id

  const photos = ((cerere as CerereDetail).cerere_photos ?? []).filter(
    (p) => isOwner || p.approval_status === "approved"
  )

  const c = cerere as CerereDetail
  const pendingCount = photos.filter((p) => p.approval_status === "pending").length

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* ══════════════════════════════════════════════
          HERO — identic cu /cauta
      ══════════════════════════════════════════════ */}
      <section className="relative bg-[#0d0905] overflow-hidden -mt-[62px]" style={{ minHeight: 300 }}>

        {/* Background photo */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1470&auto=format&fit=crop"
            alt=""
            fill
            priority
            className="object-cover object-center opacity-[0.14]"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0905]/88 via-[#0d0905]/52 to-[#0d0905]/94" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0905]/80 via-transparent to-[#0d0905]/80" />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 28%, rgba(13,9,5,0.80) 100%)" }}
        />
        <div className="absolute inset-0 opacity-[0.042]"
          style={{
            backgroundImage: "linear-gradient(rgba(196,146,30,1) 1px, transparent 1px), linear-gradient(90deg, rgba(196,146,30,1) 1px, transparent 1px)",
            backgroundSize: "52px 52px",
            maskImage: "radial-gradient(ellipse 76% 78% at 50% 50%, black 20%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 76% 78% at 50% 50%, black 20%, transparent 100%)",
          }}
        />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 55% at 50% 60%, rgba(196,146,30,0.065) 0%, transparent 70%)" }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/28 to-transparent" />

        <div className="container relative z-10 max-w-3xl pt-[96px] pb-12">

          {/* Back link */}
          <Link
            href={isOwner ? "/cont/cereri" : "/cereri"}
            className="inline-flex items-center gap-2 font-condensed tracking-[0.18em] uppercase text-[10px] text-white/28 hover:text-primary transition-colors duration-200 mb-8"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {isOwner ? "Cererile mele" : "Cereri active"}
          </Link>

          {/* Ornament */}
          <div className="flex items-center gap-4 mb-5">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-primary/38" />
            <div className="flex items-center gap-1.5">
              <div className="w-1 h-1 bg-primary/50 rotate-45" />
              <div className="w-1.5 h-1.5 bg-primary/68 rotate-45" />
              <div className="w-1 h-1 bg-primary/50 rotate-45" />
            </div>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-primary/38" />
          </div>

          {/* Category + time + status */}
          <div className="flex flex-wrap items-center gap-3 mb-3">
            {c.category && (
              <>
                <div className="flex items-center gap-1.5">
                  <Tag className="h-3 w-3 text-primary/55 shrink-0" />
                  <span className="font-condensed tracking-[0.22em] uppercase text-[10px] text-primary/75">
                    {c.category.name}
                  </span>
                </div>
                <span className="text-white/15">·</span>
              </>
            )}
            <div className="flex items-center gap-1.5 font-condensed tracking-[0.14em] uppercase text-[10px] text-white/28">
              <Clock className="h-3 w-3" />
              {formatDistanceToNow(new Date(c.created_at), { addSuffix: true, locale: ro })}
            </div>
            {c.status === "closed" && (
              <span className="px-2 py-0.5 border border-white/10 font-condensed text-[9px] tracking-[0.18em] uppercase text-white/25">
                Încheiată
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="font-display text-white/92 leading-[1.06] tracking-tight"
            style={{ fontSize: "clamp(1.7rem, 3.5vw, 2.8rem)", fontWeight: 600 }}>
            {c.title || "Cerere"}
          </h1>

        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CONTENT — white bg, same as /cauta
      ══════════════════════════════════════════════ */}
      <main className="flex-1 bg-white">
        <div className="container max-w-3xl py-10">
          <div className="flex flex-col gap-px bg-[#584528]/10">

            {/* Description */}
            <section className="bg-white px-8 py-7">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-px bg-primary/45" />
                <p className="font-condensed text-[10px] tracking-[0.28em] uppercase text-[#584528]/55">
                  Descriere cerere
                </p>
              </div>
              <p className="text-[#3d2e14]/70 leading-relaxed text-[15px] whitespace-pre-line">
                {c.original_message}
              </p>
            </section>

            {/* Photos */}
            {photos.length > 0 && (
              <section className="bg-white px-8 py-7">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-px bg-primary/45" />
                    <p className="font-condensed text-[10px] tracking-[0.28em] uppercase text-[#584528]/55">
                      Fotografii
                    </p>
                  </div>
                  {isOwner && pendingCount > 0 && (
                    <span className="font-condensed text-[9px] tracking-[0.16em] uppercase text-primary/55 border border-primary/20 px-2 py-0.5">
                      {pendingCount} în așteptare
                    </span>
                  )}
                </div>
                <CererePhotoCarousel photos={photos} isOwner={isOwner} />
              </section>
            )}

            {/* Contact — only for mesters */}
            {!isOwner && c.client_phone && (
              <section className="bg-white px-8 py-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-6 h-px bg-primary/45" />
                    <p className="font-condensed text-[10px] tracking-[0.28em] uppercase text-[#584528]/55">
                      Contact client
                    </p>
                  </div>
                  <p className="font-condensed text-sm tracking-wide text-[#584528]/45 mt-2">
                    Sună pentru a discuta detaliile lucrării
                  </p>
                </div>
                <a
                  href={`tel:${c.client_phone}`}
                  className="inline-flex items-center gap-3 font-condensed tracking-[0.18em] uppercase text-sm font-semibold text-white bg-primary hover:bg-primary/88 transition-colors duration-200 px-7 py-3.5 shrink-0"
                >
                  <Phone className="h-4 w-4" />
                  {c.client_phone}
                </a>
              </section>
            )}

          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
