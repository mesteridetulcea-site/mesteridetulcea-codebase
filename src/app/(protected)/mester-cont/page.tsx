import Link from "next/link"
import Image from "next/image"
import {
  Eye, Star, Heart,
  CheckCircle, Clock, XCircle,
  Camera, ExternalLink, ArrowRight, Pencil,
} from "lucide-react"
import { getMesterProfile } from "@/actions/mester"
import { SubscriptionBadge } from "@/components/mester/subscription-badge"
import type { SubscriptionTier } from "@/types/database"

/* ── Status config ───────────────────────────────────────────────── */
const statusConfig = {
  approved: {
    pill:      "Activ",
    heading:   "Profilul tău este activ",
    subtext:   "Apari în căutări și poți primi cereri direct de la clienți.",
    color:     "hsl(142 58% 42%)",
    glow:      "hsl(142 55% 9% / 0.85)",
    glowAlt:   "hsl(38 68% 18% / 0.35)",
    icon:      CheckCircle,
  },
  pending: {
    pill:      "În verificare",
    heading:   "Profilul tău e în așteptare",
    subtext:   "Un administrator va analiza profilul tău în curând.",
    color:     "hsl(38 80% 55%)",
    glow:      "hsl(38 70% 10% / 0.85)",
    glowAlt:   "hsl(38 68% 25% / 0.2)",
    icon:      Clock,
  },
  rejected: {
    pill:      "Respins",
    heading:   "Profilul tău a fost respins",
    subtext:   null, // filled from mester.rejection_reason
    color:     "hsl(0 62% 52%)",
    glow:      "hsl(0 55% 9% / 0.85)",
    glowAlt:   "hsl(0 40% 18% / 0.25)",
    icon:      XCircle,
  },
} as const

type ApprovalStatus = keyof typeof statusConfig

/* ── Dashboard ───────────────────────────────────────────────────── */
export default async function MesterDashboardPage() {
  const mester = await getMesterProfile()

  if (!mester) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="font-condensed tracking-widest uppercase text-sm text-white/30">
          Nu am putut încărca profilul.
        </p>
      </div>
    )
  }

  const status = statusConfig[mester.approval_status as ApprovalStatus] ?? statusConfig.pending
  const StatusIcon = status.icon
  const subtext =
    mester.approval_status === "rejected"
      ? (mester.rejection_reason || "Contactează suportul pentru mai multe detalii.")
      : status.subtext

  const stats = [
    { label: "Vizualizări",  value: mester.views_count,           icon: Eye },
    { label: "Rating mediu", value: mester.avg_rating.toFixed(1), icon: Star },
    { label: "Recenzii",     value: mester.reviews_count,         icon: Heart },
  ]

  const actions = [
    {
      href:        "/mester-cont/fotografii",
      icon:        Camera,
      title:       "Fotografii",
      description: "Adaugă fotografii cu lucrările tale pentru a atrage mai mulți clienți.",
      cta:         "Gestionează",
      external:    false,
    },
    {
      href:        `/mester/${mester.id}`,
      icon:        ExternalLink,
      title:       "Profil public",
      description: "Previzualizează cum arată profilul tău pentru potențialii clienți.",
      cta:         "Deschide",
      external:    true,
    },
  ]

  return (
    <div>
      {/* ── Page header ── */}
      <div
        className="px-6 pt-8 pb-8 md:px-10 md:pt-10"
        style={{ borderBottom: "1px solid #e0c99a" }}
      >
        {/* Gold ornament */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px flex-1 max-w-[44px]"
            style={{ background: "linear-gradient(to right, transparent, hsl(38 68% 44% / 0.5))" }} />
          <div className="flex items-center gap-1.5">
            <div className="w-1 h-1 rotate-45" style={{ background: "hsl(38 68% 44% / 0.5)" }} />
            <div className="w-1.5 h-1.5 rotate-45" style={{ background: "hsl(38 68% 44% / 0.75)" }} />
            <div className="w-1 h-1 rotate-45" style={{ background: "hsl(38 68% 44% / 0.5)" }} />
          </div>
          <div className="h-px flex-1 max-w-[44px]"
            style={{ background: "linear-gradient(to left, transparent, hsl(38 68% 44% / 0.5))" }} />
        </div>

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="font-condensed tracking-[0.26em] uppercase text-xs text-primary/70 mb-2">
              Panou de control
            </p>
            <h1
              className="font-condensed text-[#1a0f05] leading-[1.1]"
              style={{ fontSize: "clamp(28px, 4.5vw, 42px)", fontWeight: 600, letterSpacing: "0.03em" }}
            >
              Bun venit,{" "}
              <span className="text-primary">{mester.display_name}</span>
            </h1>
          </div>
          <div className="shrink-0 mt-1">
            <SubscriptionBadge tier={mester.subscription_tier as SubscriptionTier} />
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="px-6 py-8 md:px-10 space-y-8">

        {/* ══ STATUS HERO CARD ════════════════════════════════════════ */}
        <div
          className="relative overflow-hidden"
          style={{ borderRadius: "10px", border: `1px solid ${status.color}28`, minHeight: "220px", background: "#140e07" }}
        >
          {/* Layer 1 — photo background */}
          <Image
            src="https://images.unsplash.com/photo-1582942028403-745e7f4811e8?q=80&w=900&auto=format&fit=crop"
            alt=""
            fill
            className="object-cover object-center"
            style={{ opacity: 0.09 }}
            sizes="(max-width: 768px) 100vw, 800px"
          />

          {/* Layer 2 — status radial glow (bottom-left) */}
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse 90% 90% at -5% 105%, ${status.glow} 0%, transparent 58%), radial-gradient(ellipse 55% 55% at 105% -5%, ${status.glowAlt} 0%, transparent 55%)`,
            }}
          />

          {/* Layer 3 — gold grid lines */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(196,146,30,1) 1px, transparent 1px), linear-gradient(90deg, rgba(196,146,30,1) 1px, transparent 1px)",
              backgroundSize: "38px 38px",
              opacity: 0.038,
              maskImage: "radial-gradient(ellipse 80% 80% at 30% 60%, black 20%, transparent 100%)",
              WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 30% 60%, black 20%, transparent 100%)",
            }}
          />

          {/* Layer 4 — edge vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 35%, rgba(20,12,5,0.7) 100%)",
            }}
          />

          {/* Layer 5 — bottom accent line */}
          <div
            className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
            style={{
              background: `linear-gradient(to right, transparent, ${status.color}55, transparent)`,
            }}
          />

          {/* Decorative large icon — right side, very faint */}
          <div
            className="absolute pointer-events-none hidden sm:block"
            style={{
              right: "-10px",
              top: "50%",
              transform: "translateY(-50%)",
              color: status.color,
              opacity: 0.07,
            }}
          >
            <StatusIcon style={{ width: "180px", height: "180px" }} />
          </div>

          {/* ── Card content ── */}
          <div className="relative z-10 p-7 md:p-8 flex flex-col justify-between" style={{ minHeight: "220px" }}>

            {/* Top: pill + heading + subtext */}
            <div>
              {/* Status pill */}
              <div
                className="inline-flex items-center gap-2 px-3 py-1 mb-5"
                style={{
                  border: `1px solid ${status.color}50`,
                  background: `${status.color}14`,
                  borderRadius: "5px",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{
                    background: status.color,
                    boxShadow: `0 0 6px ${status.color}`,
                  }}
                />
                <span
                  className="font-condensed tracking-[0.22em] uppercase text-xs font-semibold"
                  style={{ color: status.color }}
                >
                  {status.pill}
                </span>
              </div>

              {/* Heading */}
              <h2
                className="font-condensed text-white mb-2 max-w-md"
                style={{ fontSize: "clamp(22px, 3.2vw, 30px)", fontWeight: 600, lineHeight: 1.15, letterSpacing: "0.04em" }}
              >
                {status.heading}
              </h2>

              {/* Subtext */}
              <p className="font-condensed text-white/50 max-w-sm leading-relaxed" style={{ fontSize: "14px", letterSpacing: "0.04em" }}>
                {subtext}
              </p>
            </div>

            {/* Bottom: action buttons */}
            <div className="flex flex-wrap items-center gap-3 mt-7">
              <Link
                href="/mester-cont/profil"
                className="inline-flex items-center gap-2 px-5 h-10 font-condensed tracking-[0.14em] uppercase text-xs font-semibold text-white/80 hover:text-white transition-all duration-200"
                style={{ border: "1px solid rgba(255,255,255,0.18)", borderRadius: "5px", background: "rgba(255,255,255,0.05)" }}
              >
                <Pencil className="h-3.5 w-3.5" />
                Editează profil
              </Link>

              {mester.approval_status === "approved" && (
                <Link
                  href={`/mester/${mester.id}`}
                  target="_blank"
                  className="inline-flex items-center gap-2 px-5 h-10 font-condensed tracking-[0.14em] uppercase text-xs font-semibold transition-all duration-200"
                  style={{
                    border: `1px solid ${status.color}55`,
                    borderRadius: "5px",
                    background: `${status.color}12`,
                    color: status.color,
                  }}
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Profil public
                </Link>
              )}
            </div>
          </div>
        </div>
        {/* ══ END STATUS HERO CARD ════════════════════════════════════ */}

        {/* Stats */}
        <div>
          <p className="font-condensed tracking-[0.24em] uppercase text-xs text-[#8a6848] mb-3">
            Statistici generale
          </p>
          <div
            className="grid grid-cols-3 gap-px"
            style={{ background: "#e0c99a", borderRadius: "6px", overflow: "hidden" }}
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="px-4 py-5 md:px-6 md:py-6"
                style={{ background: "#faf6ed" }}
              >
                <stat.icon className="h-4 w-4 text-primary/60 mb-3" />
                <div
                  className="font-display text-[#1a0f05] font-semibold mb-1"
                  style={{ fontSize: "clamp(30px, 4vw, 44px)", lineHeight: 1 }}
                >
                  {stat.value}
                </div>
                <p className="font-condensed tracking-[0.14em] uppercase text-xs text-[#8a6848]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div>
          <p className="font-condensed tracking-[0.24em] uppercase text-xs text-[#8a6848] mb-3">
            Acțiuni rapide
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {actions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                {...(action.external ? { target: "_blank" } : {})}
                className="group flex flex-col px-6 py-6 transition-all duration-200"
                style={{
                  background: "white",
                  border: "1px solid #e0c99a",
                  borderRadius: "6px",
                }}
              >
                <div
                  className="w-10 h-10 flex items-center justify-center mb-4 shrink-0 transition-all duration-200"
                  style={{ border: "1px solid #e0c99a", borderRadius: "6px", background: "#faf6ed" }}
                >
                  <action.icon className="h-4 w-4 text-primary/60 group-hover:text-primary transition-colors duration-200" />
                </div>
                <p className="font-condensed tracking-[0.1em] uppercase text-sm font-semibold text-[#3d2810] group-hover:text-[#1a0f05] transition-colors mb-2">
                  {action.title}
                </p>
                <p className="text-sm text-[#8a6848] leading-relaxed flex-1">
                  {action.description}
                </p>
                <div className="mt-4 flex items-center gap-2 text-primary/60 group-hover:text-primary transition-colors">
                  <span className="font-condensed tracking-[0.16em] uppercase text-xs">{action.cta}</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
