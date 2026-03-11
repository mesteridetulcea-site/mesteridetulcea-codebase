"use client"

import { useState, useEffect, useTransition } from "react"
import Link from "next/link"
import { FileText, Plus, Trash2, CheckCircle, Clock, Truck, MapPin, Navigation, X, Loader2 } from "lucide-react"
import { closeCerere, deleteCerere } from "@/actions/cereri"
import { cancelTransportRequest, closeTransportRequest } from "@/actions/transport"
import { createClient } from "@/lib/supabase/client"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav"
import { toast } from "@/lib/hooks/use-toast"
import { formatDistanceToNow } from "date-fns"
import { ro } from "date-fns/locale"
import { haversineKm, formatDistance, formatTravelTime } from "@/lib/utils/distance"

interface CererePhoto {
  id: string
  url: string
  approval_status: string
}

interface Cerere {
  kind: "cerere"
  id: string
  title: string | null
  original_message: string
  status: string | null
  client_phone: string | null
  created_at: string
  category: { name: string } | null
  cerere_photos: CererePhoto[]
}

interface TransportItem {
  kind: "transport"
  id: string
  pickup_address: string
  pickup_lat: number
  pickup_lng: number
  dropoff_address: string
  dropoff_lat: number
  dropoff_lng: number
  description: string | null
  status: string
  created_at: string
}

type Item = Cerere | TransportItem

interface ConfirmState {
  type: "close-cerere" | "delete-cerere" | "close-transport" | "cancel-transport"
  id: string
}

function ConfirmDialog({
  confirm,
  isPending,
  onConfirm,
  onCancel,
}: {
  confirm: ConfirmState
  isPending: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  const config = {
    "close-cerere":     { title: "Marchezi cererea ca finalizată?", desc: "Cererea va fi închisă și nu va mai fi activă.", action: "Finalizează", danger: false },
    "delete-cerere":    { title: "Șterge cererea definitiv?",        desc: "Cererea va fi ștearsă și nu va mai fi vizibilă meșterilor.", action: "Șterge", danger: true },
    "close-transport":  { title: "Marchezi transportul ca finalizat?", desc: "Cererea de transport va fi marcată ca finalizată.", action: "Finalizează", danger: false },
    "cancel-transport": { title: "Anulezi cererea de transport?",    desc: "Cererea va fi anulată și ștearsă definitiv.", action: "Anulează cererea", danger: true },
  }[confirm.type]

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-[#0d0905]/70 backdrop-blur-[2px]" onClick={onCancel} />
      <div
        className="relative w-full sm:max-w-sm mx-4 sm:mx-auto"
        style={{ background: "white", border: "1px solid #e0c99a", boxShadow: "0 24px 80px rgba(13,9,5,0.32)" }}
      >
        {/* Top accent */}
        <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, #c4921e 40%, #c4921e 60%, transparent)" }} />

        <div className="p-6">
          <div className="flex items-start justify-between gap-3 mb-3">
            <p className="font-display text-[#1a0f05] leading-snug" style={{ fontSize: "18px", fontWeight: 600 }}>
              {config.title}
            </p>
            <button onClick={onCancel} className="shrink-0 mt-0.5 text-[#b8956a] hover:text-[#1a0f05] transition-colors">
              <X style={{ width: "16px", height: "16px" }} />
            </button>
          </div>
          <p className="font-condensed tracking-wide text-[#6b4f35] mb-6" style={{ fontSize: "13px" }}>
            {config.desc}
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              className="flex-1 h-10 font-condensed tracking-[0.16em] uppercase transition-colors duration-200"
              style={{ fontSize: "11px", border: "1px solid #d4c0a0", color: "#6b4f35", background: "#faf6ed" }}
            >
              Înapoi
            </button>
            <button
              onClick={onConfirm}
              disabled={isPending}
              className="flex-1 h-10 font-condensed tracking-[0.16em] uppercase font-semibold transition-all duration-200 flex items-center justify-center gap-2"
              style={{
                fontSize: "11px",
                background: config.danger ? "#b91c1c" : "hsl(38 68% 44%)",
                color: "white",
                opacity: isPending ? 0.6 : 1,
                cursor: isPending ? "not-allowed" : "pointer",
              }}
            >
              {isPending ? <Loader2 style={{ width: "12px", height: "12px" }} className="animate-spin" /> : null}
              {config.action}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatusPill({ status, kind }: { status: string | null; kind: "cerere" | "transport" }) {
  const isActive = kind === "transport" ? status === "open" : status === "open"
  return (
    <span
      className="inline-flex items-center gap-1.5 font-condensed tracking-[0.14em] uppercase"
      style={{
        fontSize: "10px",
        padding: "3px 9px",
        border: isActive ? "1px solid hsl(38 68% 44% / 0.55)" : "1px solid #d4c0a0",
        color: isActive ? "hsl(38 68% 44%)" : "#8a6848",
        background: isActive ? "hsl(38 68% 44% / 0.07)" : "transparent",
      }}
    >
      {isActive ? (
        <><Clock style={{ width: "9px", height: "9px" }} />Activă</>
      ) : (
        <><CheckCircle style={{ width: "9px", height: "9px" }} />Încheiată</>
      )}
    </span>
  )
}

export default function CereriPage() {
  const [items, setItems]       = useState<Item[]>([])
  const [loading, setLoading]   = useState(true)
  const [isPending, startTransition] = useTransition()
  const [role, setRole]         = useState<string | null>(null)
  const [confirm, setConfirm]   = useState<ConfirmState | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single() as { data: { role: string } | null }
      setRole(profile?.role ?? null)

      const [cereriRes, transportRes] = await Promise.all([
        supabase
          .from("service_requests")
          .select("id, title, original_message, status, client_phone, created_at, category:categories(name), cerere_photos(id, url, approval_status)")
          .eq("client_id", user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("transport_requests")
          .select("id, pickup_address, pickup_lat, pickup_lng, dropoff_address, dropoff_lat, dropoff_lng, description, status, created_at")
          .eq("client_id", user.id)
          .order("created_at", { ascending: false }),
      ])

      const cereri: Cerere[]         = ((cereriRes.data   || []) as Omit<Cerere, "kind">[]).map(c => ({ ...c, kind: "cerere" }))
      const transport: TransportItem[] = ((transportRes.data || []) as Omit<TransportItem, "kind">[]).map(t => ({ ...t, kind: "transport" }))
      const merged = [...cereri, ...transport].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      setItems(merged)
      setLoading(false)
    }
    load()
  }, [])

  function handleConfirm() {
    if (!confirm) return
    const { type, id } = confirm
    setConfirm(null)
    startTransition(async () => {
      if (type === "close-cerere") {
        const r = await closeCerere(id)
        if (r.error) toast({ title: "Eroare", description: r.error, variant: "destructive" })
        else { setItems(p => p.map(c => c.id === id ? { ...c, status: "incheiata" } : c)); toast({ title: "Cerere încheiată" }) }
      } else if (type === "delete-cerere") {
        const r = await deleteCerere(id)
        if (r.error) toast({ title: "Eroare", description: r.error, variant: "destructive" })
        else { setItems(p => p.filter(c => c.id !== id)); toast({ title: "Cerere ștearsă" }) }
      } else if (type === "close-transport") {
        const r = await closeTransportRequest(id)
        if (r?.error) toast({ title: "Eroare", description: r.error, variant: "destructive" })
        else { setItems(p => p.map(c => c.id === id ? { ...c, status: "closed" } : c)); toast({ title: "Transport finalizat" }) }
      } else if (type === "cancel-transport") {
        const r = await cancelTransportRequest(id)
        if (r?.error) toast({ title: "Eroare", description: r.error, variant: "destructive" })
        else { setItems(p => p.filter(c => c.id !== id)); toast({ title: "Transport anulat" }) }
      }
    })
  }

  const activeCount  = items.filter(i => (i.kind === "transport" ? i.status === "open" : i.status === "open")).length
  const newHref      = role === "mester" || role === "admin" ? "/transport" : "/cereri/nou"

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
          {/* Center glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 70% 60% at 50% 60%, rgba(196,146,30,0.07) 0%, transparent 70%)" }}
          />
          {/* Bottom line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/28 to-transparent" />

          <div className="container relative z-10 flex flex-col items-center text-center pt-[96px] pb-14 px-6">
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
              Contul meu
            </p>

            <h1
              className="font-display text-white/92 leading-[1.06] tracking-tight"
              style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)", fontWeight: 600 }}
            >
              Cererile <em className="text-primary italic">mele</em>
            </h1>

            {!loading && (
              <p className="mt-3 font-condensed tracking-[0.16em] uppercase text-white/28" style={{ fontSize: "10px" }}>
                {items.length === 0
                  ? "Nicio cerere postată încă"
                  : `${items.length} ${items.length === 1 ? "cerere" : "cereri"} · ${activeCount} ${activeCount === 1 ? "activă" : "active"}`}
              </p>
            )}
          </div>
        </section>

        {/* ── Content ── */}
        <div className="container px-4 md:px-8 lg:px-16 py-10 md:py-14 max-w-3xl mx-auto">

          {/* Top bar */}
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/"
              className="font-condensed tracking-[0.16em] uppercase transition-colors duration-150"
              style={{ fontSize: "11px", color: "#8a6848" }}
            >
              ← Acasă
            </Link>
            <Link
              href={newHref}
              className="inline-flex items-center gap-2 h-10 px-5 font-condensed tracking-[0.18em] uppercase font-semibold transition-all duration-200"
              style={{
                fontSize: "11px",
                background: "hsl(38 68% 44%)",
                color: "white",
                boxShadow: "0 4px 20px hsl(38 68% 44% / 0.24)",
              }}
            >
              <Plus style={{ width: "12px", height: "12px" }} />
              Cerere nouă
            </Link>
          </div>

          {/* Loading skeletons */}
          {loading && (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-28 animate-pulse" style={{ background: "white", border: "1px solid #e0c99a" }} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && items.length === 0 && (
            <div className="py-16 flex flex-col items-center text-center" style={{ border: "1px solid #e0c99a", background: "white" }}>
              {/* Ornament */}
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px w-10 bg-gradient-to-r from-transparent to-primary/30" />
                <div className="flex items-center gap-1.5">
                  <div className="w-1 h-1 bg-primary/40 rotate-45" />
                  <div className="w-1.5 h-1.5 bg-primary/60 rotate-45" />
                  <div className="w-1 h-1 bg-primary/40 rotate-45" />
                </div>
                <div className="h-px w-10 bg-gradient-to-l from-transparent to-primary/30" />
              </div>

              <div
                className="w-14 h-14 flex items-center justify-center mb-6"
                style={{ border: "1px solid #e0c99a", background: "hsl(38 68% 44% / 0.06)" }}
              >
                <FileText style={{ width: "22px", height: "22px", color: "hsl(38 68% 44% / 0.55)" }} />
              </div>

              <h2 className="font-display text-[#1a0f05] mb-2" style={{ fontSize: "22px", fontWeight: 600 }}>
                Nicio cerere <em className="text-primary italic">postată</em>
              </h2>
              <p className="font-condensed tracking-wide text-[#8a6848] mb-8 max-w-xs" style={{ fontSize: "13px", lineHeight: "1.7" }}>
                Postează o cerere și meșterii din categoria potrivită te vor contacta direct.
              </p>
              <Link
                href="/cereri/nou"
                className="inline-flex items-center gap-2 h-11 px-8 font-condensed tracking-[0.18em] uppercase font-semibold transition-all duration-200"
                style={{ fontSize: "11px", background: "hsl(38 68% 44%)", color: "white", boxShadow: "0 4px 20px hsl(38 68% 44% / 0.24)" }}
              >
                <Plus style={{ width: "12px", height: "12px" }} />
                Creează prima cerere
              </Link>
            </div>
          )}

          {/* Items list */}
          {!loading && items.length > 0 && (
            <div className="space-y-3">
              {items.map((item, idx) => {
                if (item.kind === "transport") {
                  const isActive = item.status === "open"
                  const distKm = (item.pickup_lat && item.pickup_lng && item.dropoff_lat && item.dropoff_lng)
                    ? haversineKm(item.pickup_lat, item.pickup_lng, item.dropoff_lat, item.dropoff_lng)
                    : null

                  return (
                    <div
                      key={`t-${item.id}`}
                      className="animate-fade-in-up"
                      style={{
                        background: "white",
                        border: "1px solid #e0c99a",
                        animationDelay: `${idx * 50}ms`,
                      }}
                    >
                      <div className="p-5">
                        {/* Top row */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-2">
                            <div
                              className="flex items-center justify-center shrink-0"
                              style={{ width: "28px", height: "28px", border: "1px solid #e0c99a", background: "hsl(38 68% 44% / 0.06)" }}
                            >
                              <Truck style={{ width: "12px", height: "12px", color: "hsl(38 68% 44% / 0.7)" }} />
                            </div>
                            <span className="font-condensed tracking-[0.18em] uppercase text-[#8a6848]" style={{ fontSize: "10px" }}>
                              Transport marfă
                            </span>
                          </div>
                          <StatusPill status={item.status} kind="transport" />
                        </div>

                        {/* Route */}
                        <Link href={`/cereri/transport/${item.id}`} className="block group mb-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <div className="flex items-center gap-1.5">
                              <MapPin style={{ width: "11px", height: "11px", color: "#22c55e" }} />
                              <span className="font-condensed tracking-wide text-[#1a0f05] group-hover:text-primary transition-colors" style={{ fontSize: "13px" }}>
                                {item.pickup_address.split(",")[0]}
                              </span>
                            </div>
                            <span className="text-[#d4c0a0] font-condensed" style={{ fontSize: "11px" }}>→</span>
                            <div className="flex items-center gap-1.5">
                              <Navigation style={{ width: "11px", height: "11px", color: "#ef4444" }} />
                              <span className="font-condensed tracking-wide text-[#1a0f05] group-hover:text-primary transition-colors" style={{ fontSize: "13px" }}>
                                {item.dropoff_address.split(",")[0]}
                              </span>
                            </div>
                            {distKm !== null && (
                              <span
                                className="font-condensed tracking-[0.1em]"
                                style={{ fontSize: "10px", color: "hsl(38 68% 44%)", border: "1px solid hsl(38 68% 44% / 0.3)", padding: "2px 7px" }}
                              >
                                {formatDistance(distKm)} · {formatTravelTime(distKm)}
                              </span>
                            )}
                          </div>
                        </Link>

                        {item.description && (
                          <p className="font-condensed tracking-wide text-[#6b4f35] line-clamp-2 mb-3" style={{ fontSize: "12px", lineHeight: "1.6" }}>
                            {item.description}
                          </p>
                        )}

                        {/* Footer row */}
                        <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid #f0e6d0" }}>
                          <span className="font-condensed tracking-wide text-[#b8956a]" style={{ fontSize: "11px" }}>
                            {formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: ro })}
                          </span>
                          {isActive && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setConfirm({ type: "close-transport", id: item.id })}
                                disabled={isPending}
                                className="inline-flex items-center gap-1.5 h-7 px-3 font-condensed tracking-[0.14em] uppercase transition-colors duration-150"
                                style={{ fontSize: "10px", border: "1px solid #d4c0a0", color: "#6b4f35", background: "#faf6ed" }}
                              >
                                <CheckCircle style={{ width: "10px", height: "10px" }} />
                                Finalizată
                              </button>
                              <button
                                onClick={() => setConfirm({ type: "cancel-transport", id: item.id })}
                                disabled={isPending}
                                className="flex items-center justify-center transition-colors duration-150 hover:text-red-600"
                                style={{ width: "28px", height: "28px", border: "1px solid #e0c99a", color: "#b8956a" }}
                                title="Anulează cererea"
                              >
                                <Trash2 style={{ width: "11px", height: "11px" }} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                }

                // Regular cerere
                const isActive = item.status === "open"

                return (
                  <div
                    key={`c-${item.id}`}
                    className="animate-fade-in-up"
                    style={{
                      background: "white",
                      border: "1px solid #e0c99a",
                      animationDelay: `${idx * 50}ms`,
                    }}
                  >
                    <div className="p-5">
                      {/* Top row */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="flex items-center justify-center shrink-0"
                            style={{ width: "28px", height: "28px", border: "1px solid #e0c99a", background: "hsl(38 68% 44% / 0.06)" }}
                          >
                            <FileText style={{ width: "12px", height: "12px", color: "hsl(38 68% 44% / 0.7)" }} />
                          </div>
                          {item.category && (
                            <span className="font-condensed tracking-[0.18em] uppercase text-[#8a6848]" style={{ fontSize: "10px" }}>
                              {item.category.name}
                            </span>
                          )}
                        </div>
                        <StatusPill status={item.status} kind="cerere" />
                      </div>

                      {/* Title */}
                      <Link href={`/cereri/${item.id}`} className="block group mb-2">
                        <p className="font-display text-[#1a0f05] group-hover:text-primary transition-colors leading-snug" style={{ fontSize: "17px", fontWeight: 600 }}>
                          {item.title || item.original_message.slice(0, 72)}
                        </p>
                      </Link>

                      {item.title && (
                        <p className="font-condensed tracking-wide text-[#6b4f35] line-clamp-2 mb-3" style={{ fontSize: "12px", lineHeight: "1.6" }}>
                          {item.original_message}
                        </p>
                      )}

                      {/* Photos */}
                      {item.cerere_photos && item.cerere_photos.length > 0 && (
                        <div className="flex gap-1.5 flex-wrap mb-3">
                          {item.cerere_photos.slice(0, 4).map((photo) => (
                            <div key={photo.id} className="relative">
                              <a href={photo.url} target="_blank" rel="noopener noreferrer"
                                className="block overflow-hidden"
                                style={{ width: "52px", height: "52px", border: "1px solid #e0c99a" }}
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={photo.url} alt="Poză cerere" className="w-full h-full object-cover" />
                              </a>
                              {photo.approval_status === "pending" && (
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border border-white" title="În așteptare aprobare" />
                              )}
                              {photo.approval_status === "rejected" && (
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white" title="Respinsă" />
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Footer row */}
                      <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid #f0e6d0" }}>
                        <span className="font-condensed tracking-wide text-[#b8956a]" style={{ fontSize: "11px" }}>
                          {formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: ro })}
                          {item.client_phone && (
                            <span className="ml-2 text-[#d4c0a0]">· {item.client_phone}</span>
                          )}
                        </span>
                        <div className="flex items-center gap-2">
                          {isActive && (
                            <button
                              onClick={() => setConfirm({ type: "close-cerere", id: item.id })}
                              disabled={isPending}
                              className="inline-flex items-center gap-1.5 h-7 px-3 font-condensed tracking-[0.14em] uppercase transition-colors duration-150"
                              style={{ fontSize: "10px", border: "1px solid #d4c0a0", color: "#6b4f35", background: "#faf6ed" }}
                            >
                              <CheckCircle style={{ width: "10px", height: "10px" }} />
                              Finalizată
                            </button>
                          )}
                          <button
                            onClick={() => setConfirm({ type: "delete-cerere", id: item.id })}
                            disabled={isPending}
                            className="flex items-center justify-center transition-colors duration-150 hover:text-red-600"
                            style={{ width: "28px", height: "28px", border: "1px solid #e0c99a", color: "#b8956a" }}
                            title="Șterge cererea"
                          >
                            <Trash2 style={{ width: "11px", height: "11px" }} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
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

      {/* Confirm dialog */}
      {confirm && (
        <ConfirmDialog
          confirm={confirm}
          isPending={isPending}
          onConfirm={handleConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  )
}
