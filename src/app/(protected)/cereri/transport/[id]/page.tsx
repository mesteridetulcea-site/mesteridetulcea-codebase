import { notFound } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav"
import { MapPin, Navigation, Clock, Truck, FileText, ExternalLink, Phone, CheckCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ro } from "date-fns/locale"
import { getTransportRequestById } from "@/actions/transport"
import { haversineKm, formatDistance, formatTravelTime } from "@/lib/utils/distance"
import { TransportRouteMapDynamic } from "@/components/transport/transport-route-map-dynamic"
import { createClient } from "@/lib/supabase/server"
import { FinalizeTransportButton } from "./finalize-button"

const sectionCls = "bg-white p-6 md:p-8"
const sectionStyle = { border: "1px solid #e0c99a" }
const labelCls = "font-condensed tracking-[0.22em] uppercase text-[#8a6848]"

export default async function TransportRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [request, supabase] = await Promise.all([getTransportRequestById(id), createClient()])
  const { data: { user } } = await supabase.auth.getUser()

  if (!request) notFound()

  const isOwner = user?.id === request.client_id
  const isOpen  = request.status === "open"

  const distKm = haversineKm(
    request.pickup_lat, request.pickup_lng,
    request.dropoff_lat, request.dropoff_lng
  )

  return (
    <div className="flex min-h-screen flex-col" style={{ background: "#faf6ed" }}>
      <Header />

      <main className="flex-1 pb-24 md:pb-0">

        {/* ── Hero ── */}
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
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 70% 60% at 50% 60%, rgba(196,146,30,0.07) 0%, transparent 70%)" }}
          />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/28 to-transparent" />

          <div className="container relative z-10 pt-[96px] pb-12 px-4 md:px-8">
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

            {/* Overline */}
            <div className="flex items-center gap-2 mb-3">
              <Truck style={{ width: "11px", height: "11px", color: "hsl(38 68% 44% / 0.7)" }} />
              <span className="font-condensed tracking-[0.28em] uppercase text-primary" style={{ fontSize: "10px" }}>
                Transport marfă
              </span>
              {/* Status pill */}
              <span
                className="ml-2 font-condensed tracking-[0.14em] uppercase"
                style={{
                  fontSize: "9px",
                  padding: "2px 8px",
                  border: isOpen ? "1px solid hsl(38 68% 44% / 0.5)" : "1px solid rgba(255,255,255,0.12)",
                  color: isOpen ? "hsl(38 68% 44%)" : "rgba(255,255,255,0.3)",
                  background: isOpen ? "hsl(38 68% 44% / 0.1)" : "transparent",
                }}
              >
                {isOpen ? "Activă" : "Încheiată"}
              </span>
            </div>

            {/* Route heading */}
            <h1
              className="font-display text-white/92 leading-[1.1] tracking-tight mb-4"
              style={{ fontSize: "clamp(1.4rem, 4vw, 2.6rem)", fontWeight: 600 }}
            >
              <span className="text-primary italic">{request.pickup_address.split(",")[0]}</span>
              <span className="text-white/30 mx-3">→</span>
              <span>{request.dropoff_address.split(",")[0]}</span>
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Clock style={{ width: "11px", height: "11px", color: "rgba(255,255,255,0.3)" }} />
                <span className="font-condensed tracking-wide text-white/30" style={{ fontSize: "11px" }}>
                  {formatDistanceToNow(new Date(request.created_at), { addSuffix: true, locale: ro })}
                </span>
              </div>
              <div style={{ width: "1px", height: "12px", background: "rgba(255,255,255,0.1)" }} />
              <span
                className="font-condensed tracking-[0.12em] font-semibold"
                style={{ fontSize: "11px", color: "hsl(38 68% 44% / 0.8)" }}
              >
                ~{formatDistance(distKm)} · {formatTravelTime(distKm)}
              </span>
              {isOwner && isOpen && (
                <>
                  <div style={{ width: "1px", height: "12px", background: "rgba(255,255,255,0.1)" }} />
                  <FinalizeTransportButton requestId={request.id} />
                </>
              )}
            </div>
          </div>
        </section>

        {/* ── Content ── */}
        <div className="container px-4 md:px-8 max-w-3xl mx-auto py-10 md:py-14 space-y-4">

          {/* Back link */}
          <Link
            href="/cont/cereri"
            className="inline-block font-condensed tracking-[0.16em] uppercase transition-colors duration-150 mb-2"
            style={{ fontSize: "11px", color: "#8a6848" }}
          >
            ← Înapoi la cereri
          </Link>

          {/* ── Route section ── */}
          <div className={sectionCls} style={sectionStyle}>
            {/* Top gold accent */}
            <div className="h-px mb-6" style={{ background: "linear-gradient(90deg, transparent, #c4921e 40%, #c4921e 60%, transparent)" }} />

            <p className={labelCls} style={{ fontSize: "10px", marginBottom: "20px" }}>Rută</p>

            <div className="flex items-start gap-5">
              {/* Visual connector */}
              <div className="flex flex-col items-center shrink-0 pt-1">
                <div
                  className="flex items-center justify-center"
                  style={{ width: "28px", height: "28px", background: "rgba(22,163,74,0.08)", border: "1px solid rgba(22,163,74,0.25)" }}
                >
                  <MapPin style={{ width: "12px", height: "12px", color: "#16a34a" }} />
                </div>
                <div className="w-px flex-1 my-1" style={{ background: "#e0c99a", minHeight: "28px" }} />
                <div
                  className="flex items-center justify-center"
                  style={{ width: "28px", height: "28px", background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.25)" }}
                >
                  <Navigation style={{ width: "12px", height: "12px", color: "#dc2626" }} />
                </div>
              </div>

              {/* Addresses */}
              <div className="flex-1 space-y-5">
                <div>
                  <p className={labelCls} style={{ fontSize: "9px", marginBottom: "4px" }}>Ridicare</p>
                  <p className="font-condensed tracking-wide text-[#1a0f05]" style={{ fontSize: "14px" }}>
                    {request.pickup_address}
                  </p>
                </div>
                <div>
                  <p className={labelCls} style={{ fontSize: "9px", marginBottom: "4px" }}>Livrare</p>
                  <p className="font-condensed tracking-wide text-[#1a0f05]" style={{ fontSize: "14px" }}>
                    {request.dropoff_address}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Google Maps button ── */}
          <a
            href={`https://www.google.com/maps/dir/?api=1&origin=${request.pickup_lat},${request.pickup_lng}&destination=${request.dropoff_lat},${request.dropoff_lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 w-full h-11 font-condensed tracking-[0.18em] uppercase font-semibold transition-all duration-200"
            style={{
              fontSize: "11px",
              border: "1px solid rgba(37,99,235,0.3)",
              color: "#2563eb",
              background: "rgba(37,99,235,0.04)",
            }}
          >
            <ExternalLink style={{ width: "13px", height: "13px" }} />
            Navighează ruta în Google Maps
          </a>

          {/* ── Map ── */}
          <div className={sectionCls} style={sectionStyle}>
            <p className={labelCls} style={{ fontSize: "10px", marginBottom: "16px" }}>Hartă rută</p>
            {/* isolation:isolate fixes Leaflet z-index bleeding over sticky navbar */}
            <div style={{ isolation: "isolate", position: "relative" }}>
              <TransportRouteMapDynamic
                pickupLat={request.pickup_lat}
                pickupLng={request.pickup_lng}
                dropoffLat={request.dropoff_lat}
                dropoffLng={request.dropoff_lng}
              />
            </div>
          </div>

          {/* ── Description ── */}
          {request.description && (
            <div className={sectionCls} style={sectionStyle}>
              <div className="flex items-center gap-2 mb-4">
                <FileText style={{ width: "13px", height: "13px", color: "hsl(38 68% 44% / 0.6)" }} />
                <p className={labelCls} style={{ fontSize: "10px" }}>Descriere marfă</p>
              </div>
              <p className="font-condensed tracking-wide text-[#4a3520] leading-relaxed whitespace-pre-line" style={{ fontSize: "13px", lineHeight: "1.8" }}>
                {request.description}
              </p>
            </div>
          )}

          {/* ── Contact ── */}
          <div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 md:p-8"
            style={{ background: "white", border: "1px solid #e0c99a" }}
          >
            <div>
              <p className={labelCls} style={{ fontSize: "10px", marginBottom: "4px" }}>Contact client</p>
              <p className="font-condensed tracking-wide text-[#8a6848]" style={{ fontSize: "12px" }}>
                Sună pentru a discuta detaliile transportului
              </p>
            </div>
            <a
              href={`tel:${request.phone}`}
              className="shrink-0 inline-flex items-center gap-2.5 h-11 px-6 font-condensed tracking-[0.18em] uppercase font-semibold transition-all duration-200"
              style={{
                fontSize: "12px",
                background: "hsl(38 68% 44%)",
                color: "white",
                boxShadow: "0 4px 20px hsl(38 68% 44% / 0.24)",
              }}
            >
              <Phone style={{ width: "13px", height: "13px" }} />
              {request.phone}
            </a>
          </div>

          {/* ── Status closed notice ── */}
          {!isOpen && (
            <div
              className="flex items-center gap-3 p-5"
              style={{ background: "white", border: "1px solid #e0c99a" }}
            >
              <CheckCircle style={{ width: "16px", height: "16px", color: "#8a6848", flexShrink: 0 }} />
              <p className="font-condensed tracking-wide text-[#8a6848]" style={{ fontSize: "12px" }}>
                Această cerere de transport a fost finalizată.
              </p>
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
