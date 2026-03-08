import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { getMesterCereri } from "@/actions/cereri"
import { getTransportCereri } from "@/actions/transport"
import { haversineKm, formatDistance } from "@/lib/utils/distance"
import { FileText, Phone, Clock, Tag, Image as ImageIcon, Truck, MapPin, Navigation } from "lucide-react"
import { FileText, Phone, Clock, Tag, Image as ImageIcon, ArrowUpRight } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ro } from "date-fns/locale"

export default async function MesterCereriPage() {
  const [cereri, transportCereri] = await Promise.all([
    getMesterCereri(),
    getTransportCereri(),
  ])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* ══════════════════════════════════════════════
          HERO — identic cu /cauta
      ══════════════════════════════════════════════ */}
      <section className="relative bg-[#0d0905] overflow-hidden -mt-[62px]" style={{ minHeight: 340 }}>

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

        {/* Dark overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0905]/88 via-[#0d0905]/52 to-[#0d0905]/94" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0905]/80 via-transparent to-[#0d0905]/80" />

        {/* Vignette */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 28%, rgba(13,9,5,0.80) 100%)" }}
        />

        {/* Gold grid */}
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
          style={{ background: "radial-gradient(ellipse 70% 55% at 50% 60%, rgba(196,146,30,0.065) 0%, transparent 70%)" }}
        />

        {/* Bottom rule */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/28 to-transparent" />

        {/* Content */}
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
          <p className="text-white/35 font-condensed tracking-[0.14em] text-sm ml-4">
            {cereri.length + transportCereri.length === 0
              ? "Nu există cereri active în categoria ta"
              : `${cereri.length + transportCereri.length} ${cereri.length + transportCereri.length === 1 ? "cerere activă" : "cereri active"} în categoria ta`}

          {/* Overline */}
          <p className="font-condensed text-primary text-[10px] tracking-[0.32em] uppercase mb-4">
            Tablou de bord
          </p>

          {/* Heading */}
          <h1 className="font-display text-white/92 leading-[1.06] tracking-tight"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.4rem)", fontWeight: 600 }}>
            Cereri{" "}
            <em className="text-primary" style={{ fontStyle: "italic" }}>active</em>{" "}
            în categoria ta
          </h1>

          {/* Count */}
          <p className="mt-4 font-condensed text-[11px] tracking-[0.22em] uppercase text-white/32">
            {cereri.length === 0
              ? "Nicio cerere momentan"
              : `${cereri.length} ${cereri.length === 1 ? "cerere" : "cereri"} disponibile`}
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="flex-1 bg-[#faf7f2] py-10">
        <div className="container max-w-4xl space-y-10">

          {/* ── Cereri normale ── */}
          {cereri.length > 0 && (
            <div className="space-y-6">
              {cereri.map((cerere) => {
                const approvedPhotos = cerere.cerere_photos?.filter(
                  (p) => p.approval_status === "approved"
                ) ?? []
      {/* ══════════════════════════════════════════════
          CONTENT — white bg, same as /cauta results
      ══════════════════════════════════════════════ */}
      <main className="flex-1 bg-white">
        <div className="container py-10 max-w-4xl">

          {cereri.length === 0 ? (
            /* Empty state — identic cu /cauta "niciun rezultat" */
            <div className="py-24 text-center">
              <div className="w-12 h-px bg-[#584528]/20 mx-auto mb-6" />
              <p className="font-display text-3xl text-[#584528]/28 italic mb-3">
                Nicio cerere activă
              </p>
              <p className="font-condensed text-xs tracking-[0.22em] uppercase text-[#584528]/38">
                Vei fi notificat când apare una în categoria ta
              </p>
              <div className="w-12 h-px bg-[#584528]/20 mx-auto mt-6" />
            </div>
          ) : (
            <>
              {/* Result count — același stil cu /cauta */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-6 h-px bg-primary/50" />
                <span className="font-condensed text-[11px] tracking-[0.22em] uppercase text-[#584528]/55">
                  {cereri.length} {cereri.length === 1 ? "cerere activă" : "cereri active"}
                </span>
              </div>

              {/* Cards — gap-px grid, same as /cauta mester grid */}
              <div className="flex flex-col gap-px bg-[#584528]/12">
                {cereri.map((cerere) => {
                  const approvedPhotos = cerere.cerere_photos?.filter(
                    (p) => p.approval_status === "approved"
                  ) ?? []

                  return (
                    <article key={cerere.id} className="bg-white group">
                      <div className="px-7 pt-6 pb-5">

                        {/* Category + time */}
                        <div className="flex items-center justify-between gap-4 mb-3">
                          {cerere.category ? (
                            <div className="flex items-center gap-1.5">
                              <Tag className="h-3 w-3 text-primary/50 shrink-0" />
                              <span className="font-condensed tracking-[0.20em] uppercase text-[10px] text-primary/70">
                                {cerere.category.name}
                              </span>
                            </div>
                          )}
                          <Link href={`/cereri/${cerere.id}`} className="hover:text-primary transition-colors">
                            <h2 className="font-condensed font-bold text-[#1a1208] tracking-wide text-xl leading-snug">
                              {cerere.title || "Cerere fără titlu"}
                            </h2>
                          </Link>
                        </div>
                        <time className="flex items-center gap-1.5 text-xs text-[#3d2e1a]/35 font-condensed tracking-wider shrink-0 mt-1">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(new Date(cerere.created_at), {
                            addSuffix: true,
                            locale: ro,
                          })}
                        </time>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="px-8 py-5">
                      <p className="text-[#3d2e1a]/70 leading-relaxed text-sm whitespace-pre-line">
                        {cerere.original_message}
                      </p>
                    </div>
                          ) : <div />}
                          <time className="flex items-center gap-1.5 font-condensed text-[10px] tracking-[0.14em] uppercase text-[#584528]/35 shrink-0">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(new Date(cerere.created_at), { addSuffix: true, locale: ro })}
                          </time>
                        </div>

                        {/* Title */}
                        <Link href={`/cereri/${cerere.id}`}>
                          <h2 className="font-display text-[#1a1208] group-hover:text-primary transition-colors duration-200 leading-tight mb-3"
                            style={{ fontSize: "clamp(1.15rem, 2vw, 1.45rem)", fontWeight: 500 }}>
                            {cerere.title || "Cerere fără titlu"}
                          </h2>
                        </Link>

                        {/* Message preview */}
                        <p className="text-[#3d2e14]/62 leading-relaxed text-sm line-clamp-2">
                          {cerere.original_message}
                        </p>

                        {/* Photo thumbnails */}
                        {approvedPhotos.length > 0 && (
                          <div className="flex items-center gap-3 mt-4">
                            <div className="flex items-center gap-1.5">
                              <ImageIcon className="h-3 w-3 text-[#584528]/35" />
                              <span className="font-condensed text-[9px] tracking-[0.18em] uppercase text-[#584528]/40">
                                {approvedPhotos.length} {approvedPhotos.length === 1 ? "foto" : "poze"}
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
                      </div>

                      {/* Card footer */}
                      <div className="px-7 py-3.5 border-t border-[#584528]/08 flex items-center justify-between">
                        <Link href={`/cereri/${cerere.id}`}
                          className="flex items-center gap-1.5 font-condensed text-[10px] tracking-[0.18em] uppercase text-[#584528]/38 hover:text-primary transition-colors duration-200">
                          Detalii <ArrowUpRight className="h-3 w-3" />
                        </Link>
                        <a href={`tel:${cerere.client_phone}`}
                          className="inline-flex items-center gap-2 font-condensed tracking-[0.16em] uppercase text-xs font-semibold text-white bg-primary hover:bg-primary/88 transition-colors duration-200 px-5 py-2.5">
                          <Phone className="h-3.5 w-3.5" />
                          {cerere.client_phone}
                        </a>
                      </div>
                    </article>
                  )
                })}
              </div>
            </>
          )}

          {/* ── Cereri transport ── */}
          {transportCereri.length > 0 && (
            <div>
              {/* Section header */}
              <div className="flex items-center gap-3 mb-5">
                <Truck className="h-4 w-4 text-primary/60" />
                <span className="font-condensed tracking-[0.22em] uppercase text-xs text-[#3d2e1a]/50">
                  Cereri transport ({transportCereri.length})
                </span>
                <div className="flex-1 h-px bg-[#e8dcc8]" />
              </div>

              <div className="space-y-4">
                {transportCereri.map((tr) => {
                  const distKm = haversineKm(tr.pickup_lat, tr.pickup_lng, tr.dropoff_lat, tr.dropoff_lng)
                  const dist = formatDistance(distKm)

                  return (
                    <Link key={tr.id} href={`/cereri/transport/${tr.id}`}>
                      <article className="bg-white border border-[#e8dcc8] hover:border-primary/40 hover:shadow-sm transition-all duration-200 overflow-hidden">
                        <div className="px-7 py-5">
                          {/* Route row */}
                          <div className="flex items-start gap-3 mb-3">
                            <div className="flex flex-col items-center gap-1 pt-0.5 shrink-0">
                              <MapPin className="h-3.5 w-3.5 text-green-600/70" />
                              <div className="w-px h-4 bg-[#e8dcc8]" />
                              <Navigation className="h-3.5 w-3.5 text-red-500/70" />
                            </div>
                            <div className="flex-1 min-w-0 space-y-1">
                              <p className="font-condensed text-sm text-[#1a1208] leading-snug line-clamp-1">
                                {tr.pickup_address}
                              </p>
                              <p className="font-condensed text-sm text-[#3d2e1a]/55 leading-snug line-clamp-1">
                                {tr.dropoff_address}
                              </p>
                            </div>
                            {/* Distance badge */}
                            <div className="shrink-0 font-condensed text-xs tracking-[0.14em] text-primary border border-primary/30 px-2.5 py-1">
                              {dist}
                            </div>
                          </div>

                          {tr.description && (
                            <p className="text-xs text-[#3d2e1a]/50 font-condensed leading-relaxed line-clamp-2 mb-3">
                              {tr.description}
                            </p>
                          )}

                          <div className="flex items-center justify-between">
                            <time className="flex items-center gap-1.5 text-[10px] text-[#3d2e1a]/30 font-condensed tracking-wide">
                              <Clock className="h-3 w-3" />
                              {formatDistanceToNow(new Date(tr.created_at), { addSuffix: true, locale: ro })}
                            </time>
                            <span className="font-condensed text-[10px] tracking-[0.16em] uppercase text-primary/60">
                              Vezi detalii →
                            </span>
                          </div>
                        </div>
                      </article>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {/* Empty state */}
          {cereri.length === 0 && transportCereri.length === 0 && (
            <div className="text-center py-20 border border-[#e8dcc8] bg-white">
              <div className="w-14 h-14 border border-[#c4921e]/20 flex items-center justify-center mx-auto mb-4">
                <FileText className="h-6 w-6 text-[#c4921e]/40" />
              </div>
              <p className="font-condensed tracking-[0.14em] text-[#3d2e1a]/50 text-sm uppercase">
                Momentan nu sunt cereri active în categoria ta
              </p>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  )
}
