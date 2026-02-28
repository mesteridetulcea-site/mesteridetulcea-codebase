import Link from "next/link"
import Image from "next/image"
import { ArrowRight, CheckCircle, Hammer, Star, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

const perks = [
  "Profil complet gratuit",
  "Clienți locali din Tulcea",
  "Fără comisioane ascunse",
]

export function CtaSection() {
  return (
    <section className="relative bg-[#0d0905] py-24 md:py-32 overflow-hidden">
      {/* Background photo */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1920&q=65&auto=format&fit=crop"
          alt=""
          fill
          className="object-cover object-center opacity-[0.1]"
        />
      </div>

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0d0905]/95 via-[#0d0905]/80 to-[#0d0905]/95" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d0905]/90 via-transparent to-[#0d0905]/90" />

      {/* Diagonal hatching */}
      <div
        className="absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(196,146,30,1) 0px, rgba(196,146,30,1) 1px, transparent 1px, transparent 10px)",
        }}
      />

      {/* Floating icons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <Hammer className="absolute top-[15%] left-[4%] h-20 w-20 text-primary/[0.04] rotate-[-18deg]" />
        <Zap className="absolute bottom-[20%] right-[5%] h-16 w-16 text-primary/[0.04] rotate-[12deg]" />
        <Star className="absolute top-[60%] left-[15%] h-10 w-10 text-primary/[0.03] rotate-[5deg]" />
        <Hammer className="absolute top-[25%] right-[18%] h-8 w-8 text-primary/[0.025] rotate-[25deg]" />
      </div>

      {/* Border lines top/bottom */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="container relative z-10">
        <div className="mx-auto max-w-2xl text-center">
          {/* Ornament */}
          <div className="flex items-center justify-center gap-5 mb-10">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/35" />
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-primary/55 rotate-45" />
              <div className="w-1 h-1 bg-primary/25 rotate-45" />
              <div className="w-1.5 h-1.5 bg-primary/55 rotate-45" />
            </div>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/35" />
          </div>

          {/* Label */}
          <p className="font-condensed tracking-[0.28em] uppercase text-primary text-xs mb-4">
            Pentru meșteri
          </p>

          {/* Headline */}
          <h2
            className="font-display text-white leading-tight"
            style={{ fontSize: "clamp(32px, 5vw, 62px)", fontWeight: 600 }}
          >
            Ești meșter în{" "}
            <em className="italic text-primary" style={{ fontStyle: "italic" }}>
              Tulcea?
            </em>
          </h2>

          <p className="mt-4 text-white/45 text-base leading-relaxed max-w-lg mx-auto">
            Conectează-te cu sute de clienți locali. Înregistrează-te gratuit
            și primește solicitări direct pe WhatsApp.
          </p>

          {/* CTA Button */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button
                size="lg"
                className="rounded-none bg-primary hover:bg-primary/85 text-white font-condensed tracking-[0.2em] uppercase text-sm h-13 px-10 transition-colors duration-200"
              >
                Creează-ți profilul gratuit
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/mesteri">
              <Button
                variant="outline"
                size="lg"
                className="rounded-none border-primary/45 text-white hover:bg-primary/12 hover:border-primary font-condensed tracking-[0.2em] uppercase text-sm h-13 px-8 transition-all duration-200"
              >
                Vezi exemplu profil
              </Button>
            </Link>
          </div>

          {/* Perks */}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-5">
            {perks.map((perk) => (
              <div
                key={perk}
                className="flex items-center gap-2 text-xs text-white/30 font-condensed tracking-[0.1em]"
              >
                <CheckCircle className="h-3.5 w-3.5 text-primary/50 shrink-0" />
                {perk}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
