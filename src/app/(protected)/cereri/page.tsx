import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { getMesterCereri } from "@/actions/cereri"
import { getTransportCereri } from "@/actions/transport"
import { haversineKm, formatDistance } from "@/lib/utils/distance"
import { FileText, Phone, Clock, Tag, Image as ImageIcon, Truck, MapPin, Navigation } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ro } from "date-fns/locale"

export default async function MesterCereriPage() {
  const [cereri, transportCereri] = await Promise.all([
    getMesterCereri(),
    getTransportCereri(),
  ])

  return (
    <div className="flex min-h-screen flex-col bg-[#0f0b04]">
      <Header />

      {/* Dark header band */}
      <div className="bg-[#0f0b04] border-b border-[#584528]/40 py-10">
        <div className="container">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-px h-8 bg-primary/50" />
            <h1 className="font-condensed text-2xl font-bold tracking-[0.12em] uppercase text-white/88">
              Cereri active
            </h1>
          </div>
          <p className="text-white/35 font-condensed tracking-[0.14em] text-sm ml-4">
            {cereri.length + transportCereri.length === 0
              ? "Nu există cereri active în categoria ta"
              : `${cereri.length + transportCereri.length} ${cereri.length + transportCereri.length === 1 ? "cerere activă" : "cereri active"} în categoria ta`}
          </p>
        </div>
      </div>

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

                return (
                  <article
                    key={cerere.id}
                    className="bg-white border border-[#e8dcc8] shadow-sm overflow-hidden"
                  >
                    {/* Card header */}
                    <div className="px-8 pt-7 pb-5 border-b border-[#f0e8d8]">
                      <div className="flex items-start justify-between gap-6">
                        <div className="flex-1 min-w-0">
                          {cerere.category && (
                            <div className="flex items-center gap-1.5 mb-2.5">
                              <Tag className="h-3 w-3 text-[#c4921e]/60" />
                              <span className="font-condensed tracking-[0.18em] uppercase text-[10px] text-[#c4921e]/70">
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

                    {/* Approved photos */}
                    {approvedPhotos.length > 0 && (
                      <div className="px-8 pb-5">
                        <div className="flex items-center gap-1.5 mb-3">
                          <ImageIcon className="h-3 w-3 text-[#3d2e1a]/40" />
                          <span className="font-condensed tracking-[0.16em] uppercase text-[10px] text-[#3d2e1a]/40">
                            {approvedPhotos.length} {approvedPhotos.length === 1 ? "poză" : "poze"}
                          </span>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {approvedPhotos.map((photo) => (
                            <a
                              key={photo.id}
                              href={photo.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block w-24 h-24 overflow-hidden border border-[#e8dcc8] hover:border-primary/40 transition-colors"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={photo.url}
                                alt="Poză cerere"
                                className="w-full h-full object-cover"
                              />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Contact footer */}
                    <div className="px-8 py-4 bg-[#faf7f2] border-t border-[#f0e8d8] flex items-center justify-between">
                      <span className="text-xs text-[#3d2e1a]/35 font-condensed tracking-wide">
                        Contact client
                      </span>
                      <a
                        href={`tel:${cerere.client_phone}`}
                        className="inline-flex items-center gap-2 font-condensed tracking-[0.16em] uppercase text-sm font-semibold text-white bg-primary hover:bg-primary/88 transition-colors duration-200 px-5 py-2.5"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        {cerere.client_phone}
                      </a>
                    </div>
                  </article>
                )
              })}
            </div>
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
