"use client"

import { Hammer, ShieldOff } from "lucide-react"
import { signOut } from "@/actions/auth"

export default function BannedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0905] px-6 relative overflow-hidden">
      {/* Gold grid texture */}
      <div
        className="absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(196,146,30,1) 1px, transparent 1px), linear-gradient(90deg, rgba(196,146,30,1) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Gold center glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(196,146,30,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 text-center max-w-sm w-full">
        {/* Ornament */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/35" />
          <div className="w-1.5 h-1.5 bg-primary/65 rotate-45" />
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/35" />
        </div>

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Hammer className="h-4 w-4 text-primary/60" />
          <span className="font-condensed tracking-[0.2em] uppercase text-xs text-white/40">
            Meșteri de Tulcea
          </span>
        </div>

        {/* Icon */}
        <div
          className="w-16 h-16 flex items-center justify-center mx-auto mb-6"
          style={{
            border: "1px solid rgba(239,68,68,0.25)",
            background: "rgba(239,68,68,0.06)",
          }}
        >
          <ShieldOff className="h-7 w-7 text-red-400/70" />
        </div>

        {/* Overline */}
        <p className="font-condensed tracking-[0.28em] uppercase text-red-400/70 text-xs mb-3">
          Acces restricționat
        </p>

        {/* Headline */}
        <h1
          className="font-display text-white/90 mb-4 leading-tight"
          style={{ fontSize: "clamp(24px, 3vw, 34px)", fontWeight: 600 }}
        >
          Contul tău a fost{" "}
          <em className="text-red-400/80" style={{ fontStyle: "italic" }}>
            suspendat
          </em>
        </h1>

        {/* Body */}
        <p
          className="text-white/35 text-sm leading-relaxed mb-10"
          style={{ fontFamily: "var(--font-barlow)" }}
        >
          Contul tău a fost suspendat de un administrator al platformei.
          Dacă crezi că este o eroare, contactează-ne la{" "}
          <a
            href="mailto:contact@mesteritulea.ro"
            className="text-primary/60 hover:text-primary transition-colors duration-150"
          >
            contact@mesteritulea.ro
          </a>
          .
        </p>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex-1 h-px bg-white/[0.07]" />
          <div className="w-1 h-1 bg-white/15 rotate-45" />
          <div className="flex-1 h-px bg-white/[0.07]" />
        </div>

        {/* Sign out button */}
        <form action={signOut}>
          <button
            type="submit"
            className="w-full h-12 font-condensed tracking-[0.22em] uppercase text-sm transition-colors duration-200"
            style={{
              background: "hsl(38 68% 44% / 0.12)",
              border: "1px solid hsl(38 68% 44% / 0.3)",
              color: "hsl(38 68% 44% / 0.8)",
            }}
          >
            Deconectează-te
          </button>
        </form>
      </div>
    </div>
  )
}
