import { notFound } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ArrowLeft, Phone, MapPin, Navigation, Clock, Truck, FileText, ExternalLink } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ro } from "date-fns/locale"
import { getTransportRequestById } from "@/actions/transport"
import { haversineKm, formatDistance } from "@/lib/utils/distance"
import { TransportRouteMapDynamic } from "@/components/transport/transport-route-map-dynamic"

export default async function TransportRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const request = await getTransportRequestById(id)

  if (!request) notFound()

  const distKm = haversineKm(
    request.pickup_lat,
    request.pickup_lng,
    request.dropoff_lat,
    request.dropoff_lng
  )

  return (
    <div className="flex min-h-screen flex-col bg-[#0f0b04]">
      <Header />

      {/* Dark header band */}
      <div className="bg-[#0f0b04] border-b border-[#584528]/40 py-10">
        <div className="container max-w-4xl">
          <Link
            href="/cereri"
            className="inline-flex items-center gap-2 font-condensed tracking-[0.16em] uppercase text-xs text-white/35 hover:text-white/60 transition-colors mb-6"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Înapoi la cereri
          </Link>

          <div className="flex items-center gap-2 mb-3">
            <Truck className="h-3.5 w-3.5 text-primary/60" />
            <span className="font-condensed tracking-[0.18em] uppercase text-[11px] text-primary/70">
              Transport marfă
            </span>
          </div>

          <h1
            className="font-condensed font-bold text-white/90 leading-tight mb-3"
            style={{ fontSize: "clamp(20px, 4vw, 32px)" }}
          >
            {request.pickup_address.split(",")[0]} → {request.dropoff_address.split(",")[0]}
          </h1>

          <div className="flex items-center gap-4 text-white/30 font-condensed tracking-wider text-xs">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3 w-3" />
              {formatDistanceToNow(new Date(request.created_at), { addSuffix: true, locale: ro })}
            </div>
            <div className="w-px h-3 bg-white/10" />
            <span className="text-primary/60 font-semibold">
              ~ {formatDistance(distKm)} (în linie dreaptă)
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 bg-[#faf7f2] py-10">
        <div className="container max-w-4xl space-y-6">

          {/* Route details */}
          <section className="bg-white border border-[#e8dcc8] p-8">
            <h2 className="font-condensed tracking-[0.16em] uppercase text-xs text-[#3d2e1a]/40 mb-5">
              Rută
            </h2>
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center gap-1 pt-0.5 shrink-0">
                <div className="w-7 h-7 bg-green-600/10 border border-green-600/25 flex items-center justify-center">
                  <MapPin className="h-3.5 w-3.5 text-green-600/70" />
                </div>
                <div className="w-px h-8 bg-[#e8dcc8]" />
                <div className="w-7 h-7 bg-red-500/10 border border-red-500/25 flex items-center justify-center">
                  <Navigation className="h-3.5 w-3.5 text-red-500/70" />
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <p className="font-condensed text-[10px] tracking-[0.20em] uppercase text-[#3d2e1a]/35 mb-1">
                    Ridicare
                  </p>
                  <p className="text-[#1a1208] text-sm leading-relaxed">{request.pickup_address}</p>
                </div>
                <div>
                  <p className="font-condensed text-[10px] tracking-[0.20em] uppercase text-[#3d2e1a]/35 mb-1">
                    Livrare
                  </p>
                  <p className="text-[#1a1208] text-sm leading-relaxed">{request.dropoff_address}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Google Maps route button */}
          <a
            href={`https://www.google.com/maps/dir/?api=1&origin=${request.pickup_lat},${request.pickup_lng}&destination=${request.dropoff_lat},${request.dropoff_lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 w-full py-3.5 border border-[#2563eb]/30 bg-[#2563eb]/5 hover:bg-[#2563eb]/10 transition-colors font-condensed tracking-[0.16em] uppercase text-sm font-semibold text-[#2563eb]"
          >
            <ExternalLink className="h-4 w-4" />
            Navighează ruta în Google Maps
          </a>

          {/* Map with route */}
          <section className="bg-white border border-[#e8dcc8] p-8">
            <h2 className="font-condensed tracking-[0.16em] uppercase text-xs text-[#3d2e1a]/40 mb-4">
              Hartă rută
            </h2>
            <TransportRouteMapDynamic
              pickupLat={request.pickup_lat}
              pickupLng={request.pickup_lng}
              dropoffLat={request.dropoff_lat}
              dropoffLng={request.dropoff_lng}
            />
          </section>

          {/* Description */}
          {request.description && (
            <section className="bg-white border border-[#e8dcc8] p-8">
              <h2 className="font-condensed tracking-[0.16em] uppercase text-xs text-[#3d2e1a]/40 mb-4">
                <FileText className="inline h-3 w-3 mr-1.5" />
                Descriere marfă
              </h2>
              <p className="text-[#3d2e1a]/75 leading-relaxed text-sm whitespace-pre-line">
                {request.description}
              </p>
            </section>
          )}

          {/* Contact */}
          <section className="bg-white border border-[#e8dcc8] p-8 flex items-center justify-between">
            <div>
              <h2 className="font-condensed tracking-[0.16em] uppercase text-xs text-[#3d2e1a]/40 mb-1">
                Contact client
              </h2>
              <p className="text-[#3d2e1a]/50 text-sm font-condensed">
                Sună pentru a discuta detaliile
              </p>
            </div>
            <a
              href={`tel:${request.phone}`}
              className="inline-flex items-center gap-2 font-condensed tracking-[0.18em] uppercase text-sm font-semibold text-white bg-primary hover:bg-primary/88 transition-colors duration-200 px-6 py-3"
            >
              <Phone className="h-4 w-4" />
              {request.phone}
            </a>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  )
}
