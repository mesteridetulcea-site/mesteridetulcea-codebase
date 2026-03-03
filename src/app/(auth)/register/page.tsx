import Link from "next/link"
import { Hammer, Search, ArrowRight, CheckCircle } from "lucide-react"
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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">

      {/* Gold grid texture */}
      <div
        className="absolute inset-0 opacity-[0.022]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(196,146,30,1) 1px, transparent 1px), linear-gradient(90deg, rgba(196,146,30,1) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Center gold glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(196,146,30,0.055) 0%, transparent 70%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-[640px]">

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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-7">

          {/* Client card */}
          <Link
            href="/register/client"
            className="group relative border border-[#3d2e14] bg-[#120e08]/80 hover:border-primary/45 hover:bg-[#160f08] transition-all duration-200 p-6 flex flex-col"
          >
            <div className="w-11 h-11 border border-[#3d2e14] group-hover:border-primary/55 group-hover:bg-primary flex items-center justify-center mb-5 transition-all duration-200">
              <Search className="h-5 w-5 text-primary group-hover:text-white transition-colors duration-200" />
            </div>
            <p className="font-condensed tracking-[0.2em] uppercase text-[10px] text-white/32 mb-1">
              Cont client
            </p>
            <h2
              className="font-display text-white mb-4"
              style={{ fontSize: "22px", fontWeight: 500 }}
            >
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

          {/* Meșter card */}
          <Link
            href="/register/mester"
            className="group relative border border-primary/28 bg-[#130f07]/80 hover:border-primary/55 hover:bg-[#170f06] transition-all duration-200 p-6 flex flex-col"
          >
            {/* Popular badge */}
            <div className="absolute top-0 right-5 -translate-y-1/2">
              <span className="font-condensed tracking-[0.18em] uppercase text-[9px] bg-primary text-white px-2.5 py-[3px]">
                Popular
              </span>
            </div>
            <div className="w-11 h-11 border border-primary/32 group-hover:border-primary group-hover:bg-primary flex items-center justify-center mb-5 transition-all duration-200">
              <Hammer className="h-5 w-5 text-primary group-hover:text-white transition-colors duration-200" />
            </div>
            <p className="font-condensed tracking-[0.2em] uppercase text-[10px] text-primary/58 mb-1">
              Cont meșter
            </p>
            <h2
              className="font-display text-white mb-4"
              style={{ fontSize: "22px", fontWeight: 500 }}
            >
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

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-white/[0.07]" />
          <span className="font-condensed tracking-[0.22em] uppercase text-[10px] text-white/22">
            sau continuă cu
          </span>
          <div className="flex-1 h-px bg-white/[0.07]" />
        </div>

        {/* Google */}
        <GoogleSignInButton />

        {/* Login link */}
        <p className="mt-7 text-center font-condensed tracking-[0.1em] text-xs text-white/28">
          Ai deja cont?{" "}
          <Link href="/login" className="text-primary/65 hover:text-primary transition-colors duration-150">
            Autentifică-te
          </Link>
        </p>

      </div>
    </div>
  )
}
