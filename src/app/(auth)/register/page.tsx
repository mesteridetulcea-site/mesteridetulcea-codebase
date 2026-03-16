import Link from "next/link"
import Image from "next/image"
import { Hammer, Search, ArrowRight, CheckCircle, ArrowLeft } from "lucide-react"
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button"

const clientPerks = [
  "Găsești meșteri verificați rapid",
  "Recenzii autentice de la clienți reali",
  "Contact direct, fără intermediari",
]

const mesterPerks = [
  "Profil complet gratuit",
  "Clienți locali din Tulcea pe WhatsApp",
  "Fără comisioane ascunse",
]

export default function RegisterPage() {
  return (
    <div
      className="flex flex-col bg-[#0f0c07] relative overflow-y-auto lg:overflow-hidden min-h-screen lg:h-screen lg:flex-row [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >

      {/* ── LEFT PANEL — desktop only ── */}
      <div className="hidden lg:flex lg:w-[46%] relative flex-col overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1685631188070-e5d4c9b2df6d?q=80&w=1200&auto=format&fit=crop"
            alt=""
            fill
            priority
            className="object-cover object-center opacity-[0.20]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0905]/92 via-[#0d0905]/52 to-[#0d0905]/92" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0905]/88 via-transparent to-[#0d0905]/88" />
        <div
          className="absolute inset-0 opacity-[0.038]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(196,146,30,1) 1px, transparent 1px), linear-gradient(90deg, rgba(196,146,30,1) 1px, transparent 1px)",
            backgroundSize: "52px 52px",
          }}
        />
        <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent" />

        <div className="relative z-10 flex flex-col h-full px-14 py-11">
          <Link href="/" className="flex items-center gap-2.5 group w-fit">
            <Hammer className="h-5 w-5 text-primary" />
            <span className="font-condensed tracking-[0.2em] uppercase text-sm font-semibold text-white/75 group-hover:text-white/95 transition-colors duration-200">
              Meșteri de Tulcea
            </span>
          </Link>

          <div className="flex-1 flex flex-col justify-center max-w-[380px]">
            <div className="flex items-center gap-5 mb-10">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-primary/35" />
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-primary/65 rotate-45" />
                <div className="w-1 h-1 bg-primary/28 rotate-45" />
                <div className="w-1.5 h-1.5 bg-primary/65 rotate-45" />
              </div>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-primary/35" />
            </div>
            <p className="font-condensed tracking-[0.28em] uppercase text-primary text-xs mb-4">
              Platforma meșterilor locali
            </p>
            <h1
              className="font-display text-white leading-[1.06]"
              style={{ fontSize: "clamp(28px, 2.8vw, 48px)", fontWeight: 600 }}
            >
              Alătură-te<br />
              comunității de{" "}
              <em className="text-primary" style={{ fontStyle: "italic" }}>
                meșteri
              </em>
            </h1>
            <p className="mt-5 text-white/38 text-sm leading-relaxed" style={{ fontFamily: "var(--font-barlow)" }}>
              Creează un cont gratuit și conectează-te<br />cu cei mai buni meșteri din Tulcea.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs text-white/28 font-condensed tracking-[0.1em]">
              <div className="w-6 h-6 border border-primary/22 flex items-center justify-center">
                <Search className="h-3 w-3 text-primary/50" />
              </div>
              Găsire rapidă
            </div>
            <div className="flex items-center gap-2 text-xs text-white/28 font-condensed tracking-[0.1em]">
              <div className="w-6 h-6 border border-primary/22 flex items-center justify-center">
                <Hammer className="h-3 w-3 text-primary/50" />
              </div>
              50+ meșteri
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT / MOBILE FULL — form area ── */}
      <div className="flex-1 flex flex-col">

        {/* ── MOBILE HERO BAND ── */}
        <div className="lg:hidden relative h-[38vh] min-h-[220px] max-h-[280px] shrink-0 bg-[#0d0905]">

          {/* Photo */}
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1685631188070-e5d4c9b2df6d?q=60&w=600&auto=format&fit=crop"
              alt=""
              fill
              className="object-cover object-center opacity-[0.30]"
            />
          </div>

          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d0905]/75 via-[#0d0905]/20 to-[#0d0905]/88" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(196,146,30,1) 1px, transparent 1px), linear-gradient(90deg, rgba(196,146,30,1) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Top bar */}
          <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-5 pt-5">
            <Link href="/" className="flex items-center gap-2 group">
              <Hammer className="h-4 w-4 text-primary" />
              <span className="font-condensed tracking-[0.18em] uppercase text-xs font-semibold text-white/70 group-hover:text-white/90 transition-colors">
                Meșteri de Tulcea
              </span>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-1 font-condensed tracking-[0.12em] uppercase text-[11px] text-white/45 hover:text-white/80 transition-colors duration-150"
            >
              <ArrowLeft className="h-3 w-3" />
              Acasă
            </Link>
          </div>

          {/* Center text */}
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 pb-4 pointer-events-none">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-7 bg-gradient-to-r from-transparent to-primary/40" />
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 bg-primary/60 rotate-45" />
                <div className="w-1.5 h-1.5 bg-primary/80 rotate-45" />
                <div className="w-1 h-1 bg-primary/60 rotate-45" />
              </div>
              <div className="h-px w-7 bg-gradient-to-l from-transparent to-primary/40" />
            </div>
            <p className="font-condensed tracking-[0.26em] uppercase text-primary text-[10px] mb-2">
              Înregistrare
            </p>
            <h1
              className="font-display text-white text-center leading-[1.1]"
              style={{ fontSize: "clamp(24px, 7.5vw, 34px)", fontWeight: 600 }}
            >
              Alege tipul{" "}
              <em className="text-primary" style={{ fontStyle: "italic" }}>
                contului
              </em>
            </h1>
          </div>
        </div>

        {/* ── MOBILE BOTTOM SHEET + DESKTOP FORM ── */}
        <div className="flex-1 flex flex-col lg:items-center lg:justify-center lg:overflow-y-auto lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden">

          {/* Desktop gold grid */}
          <div
            className="hidden lg:block absolute inset-0 opacity-[0.016]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(196,146,30,1) 1px, transparent 1px), linear-gradient(90deg, rgba(196,146,30,1) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          {/* Mobile bottom sheet wrapper */}
          <div className="lg:hidden w-full -mt-10 relative z-10 flex-1 flex flex-col">

            {/* Pill */}
            <div className="flex justify-center pt-3 pb-0">
              <div style={{ width: "40px", height: "4px", borderRadius: "9999px", background: "rgba(255,255,255,0.22)" }} />
            </div>

            {/* Sheet card */}
            <div
              className="w-full mt-2 flex-1"
              style={{ borderRadius: "28px 28px 0 0", background: "#17130d", border: "1px solid rgba(160,112,32,0.22)", borderBottom: "none", boxShadow: "0 -8px 32px rgba(0,0,0,0.6)" }}
            >
              <div className="mx-6 mt-4 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

              <div className="px-5 pt-5 pb-12">

                {/* Header */}
                <div className="text-center mb-6">
                  <p className="font-condensed tracking-[0.26em] uppercase text-primary text-xs mb-1.5">
                    Cont nou
                  </p>
                  <h2
                    className="font-display text-white"
                    style={{ fontSize: "clamp(20px, 6vw, 26px)", fontWeight: 600 }}
                  >
                    Cum vrei să folosești platforma?
                  </h2>
                </div>

                {/* Role cards — stacked on mobile */}
                <div className="space-y-3 mb-6">

                  {/* Client */}
                  <Link
                    href="/register/client"
                    className="group flex items-center gap-4 p-4 border border-[#3a2c12] bg-[#0d0a06] hover:border-primary/45 hover:bg-[#13100a] transition-all duration-200"
                    style={{ borderRadius: "12px" }}
                  >
                    <div
                      className="w-12 h-12 border border-[#3a2c12] group-hover:border-primary/55 group-hover:bg-primary flex items-center justify-center shrink-0 transition-all duration-200"
                      style={{ borderRadius: "10px" }}
                    >
                      <Search className="h-5 w-5 text-primary group-hover:text-white transition-colors duration-200" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-condensed tracking-[0.16em] uppercase text-[10px] text-white/35 mb-0.5">
                        Cont client
                      </p>
                      <p className="font-display text-white text-lg leading-tight" style={{ fontWeight: 500 }}>
                        Caut meșteri
                      </p>
                      <p className="text-[11px] text-white/35 font-condensed mt-1 leading-snug">
                        Găsești, contactezi, recenzezi
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-white/25 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200 shrink-0" />
                  </Link>

                  {/* Mester */}
                  <Link
                    href="/register/mester"
                    className="group flex items-center gap-4 p-4 border border-primary/30 bg-[#110e07] hover:border-primary/60 hover:bg-[#160f06] transition-all duration-200 relative overflow-hidden"
                    style={{ borderRadius: "12px" }}
                  >
                    {/* Popular badge */}
                    <div className="absolute top-3 right-3">
                      <span
                        className="font-condensed tracking-[0.18em] uppercase text-[9px] bg-primary text-white px-2 py-[3px]"
                        style={{ borderRadius: "4px" }}
                      >
                        Popular
                      </span>
                    </div>
                    <div
                      className="w-12 h-12 border border-primary/35 group-hover:border-primary group-hover:bg-primary flex items-center justify-center shrink-0 transition-all duration-200"
                      style={{ borderRadius: "10px" }}
                    >
                      <Hammer className="h-5 w-5 text-primary group-hover:text-white transition-colors duration-200" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-condensed tracking-[0.16em] uppercase text-[10px] text-primary/55 mb-0.5">
                        Cont meșter
                      </p>
                      <p className="font-display text-white text-lg leading-tight" style={{ fontWeight: 500 }}>
                        Sunt meșter
                      </p>
                      <p className="text-[11px] text-white/35 font-condensed mt-1 leading-snug">
                        Profil gratuit, clienți locali
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-primary/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200 shrink-0 mt-5" />
                  </Link>

                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-px bg-white/[0.07]" />
                  <span className="font-condensed tracking-[0.2em] uppercase text-[11px] text-white/22">
                    sau continuă cu
                  </span>
                  <div className="flex-1 h-px bg-white/[0.07]" />
                </div>

                {/* Google */}
                <GoogleSignInButton />

                {/* Login link */}
                <p className="mt-6 text-center font-condensed tracking-[0.1em] text-sm text-white/32">
                  Ai deja cont?{" "}
                  <Link
                    href="/login"
                    className="text-primary/75 hover:text-primary transition-colors duration-150 underline underline-offset-2 decoration-primary/30"
                  >
                    Autentifică-te
                  </Link>
                </p>

              </div>
            </div>
          </div>

          {/* Desktop form (original layout) */}
          <div className="hidden lg:block relative z-10 w-full max-w-[560px] px-8 py-12">

            {/* Logo */}
            <div className="flex flex-col items-center mb-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-px w-10 bg-primary/35" />
                <span className="text-primary/65 text-sm">★</span>
                <div className="h-px w-10 bg-primary/35" />
              </div>
              <Link href="/" className="flex items-center gap-2.5 group">
                <Hammer className="h-5 w-5 text-primary" />
                <span className="font-condensed tracking-[0.2em] uppercase text-sm font-semibold text-white/75 group-hover:text-white/95 transition-colors duration-200">
                  Meșteri de Tulcea
                </span>
              </Link>
            </div>

            {/* Header */}
            <div className="text-center mb-9">
              <div className="flex items-center justify-center gap-3 mb-5">
                <div className="h-px w-10 bg-gradient-to-r from-transparent to-primary/35" />
                <div className="w-1.5 h-1.5 bg-primary/65 rotate-45" />
                <div className="h-px w-10 bg-gradient-to-l from-transparent to-primary/35" />
              </div>
              <p className="font-condensed tracking-[0.28em] uppercase text-primary text-xs mb-2.5">
                Înregistrare
              </p>
              <h1
                className="font-display text-white"
                style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 500 }}
              >
                Alege tipul contului
              </h1>
              <p className="mt-2 text-white/32 text-sm font-condensed tracking-wide">
                Selectează cum vrei să folosești platforma
              </p>
            </div>

            {/* Role cards */}
            <div className="grid grid-cols-2 gap-3 mb-7">

              <Link
                href="/register/client"
                className="group relative border border-[#3d2e14] bg-[#120e08]/80 hover:border-primary/45 hover:bg-[#160f08] transition-all duration-200 p-6 flex flex-col"
              >
                <div className="w-11 h-11 border border-[#3d2e14] group-hover:border-primary/55 group-hover:bg-primary flex items-center justify-center mb-5 transition-all duration-200">
                  <Search className="h-5 w-5 text-primary group-hover:text-white transition-colors duration-200" />
                </div>
                <p className="font-condensed tracking-[0.2em] uppercase text-[10px] text-white/32 mb-1">Cont client</p>
                <h2 className="font-display text-white mb-4" style={{ fontSize: "22px", fontWeight: 500 }}>
                  Caut meșteri
                </h2>
                <ul className="space-y-2 mb-6 flex-1">
                  {clientPerks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2 text-xs text-white/38 font-condensed tracking-wide">
                      <CheckCircle className="h-3 w-3 text-primary/45 mt-0.5 shrink-0" />
                      {perk}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between pt-4 border-t border-[#3d2e14] group-hover:border-primary/22 transition-colors duration-200">
                  <span className="font-condensed tracking-[0.16em] uppercase text-xs text-white/45 group-hover:text-white/70 transition-colors duration-200">
                    Înregistrare client
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-white/28 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200" />
                </div>
              </Link>

              <Link
                href="/register/mester"
                className="group relative border border-primary/28 bg-[#130f07]/80 hover:border-primary/55 hover:bg-[#170f06] transition-all duration-200 p-6 flex flex-col"
              >
                <div className="absolute top-0 right-5 -translate-y-1/2">
                  <span className="font-condensed tracking-[0.18em] uppercase text-[9px] bg-primary text-white px-2.5 py-[3px]">
                    Popular
                  </span>
                </div>
                <div className="w-11 h-11 border border-primary/32 group-hover:border-primary group-hover:bg-primary flex items-center justify-center mb-5 transition-all duration-200">
                  <Hammer className="h-5 w-5 text-primary group-hover:text-white transition-colors duration-200" />
                </div>
                <p className="font-condensed tracking-[0.2em] uppercase text-[10px] text-primary/58 mb-1">Cont meșter</p>
                <h2 className="font-display text-white mb-4" style={{ fontSize: "22px", fontWeight: 500 }}>
                  Sunt meșter
                </h2>
                <ul className="space-y-2 mb-6 flex-1">
                  {mesterPerks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2 text-xs text-white/38 font-condensed tracking-wide">
                      <CheckCircle className="h-3 w-3 text-primary/55 mt-0.5 shrink-0" />
                      {perk}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between pt-4 border-t border-primary/18 group-hover:border-primary/32 transition-colors duration-200">
                  <span className="font-condensed tracking-[0.16em] uppercase text-xs text-primary/60 group-hover:text-primary transition-colors duration-200">
                    Înregistrare meșter
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-primary/45 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200" />
                </div>
              </Link>

            </div>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-white/[0.07]" />
              <span className="font-condensed tracking-[0.22em] uppercase text-[10px] text-white/22">sau continuă cu</span>
              <div className="flex-1 h-px bg-white/[0.07]" />
            </div>

            <GoogleSignInButton />

            <p className="mt-7 text-center font-condensed tracking-[0.1em] text-xs text-white/28">
              Ai deja cont?{" "}
              <Link href="/login" className="text-primary/65 hover:text-primary transition-colors duration-150">
                Autentifică-te
              </Link>
            </p>

          </div>

        </div>
      </div>

    </div>
  )
}
