"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  Shield,
  Star,
  Users,
  ChevronDown,
} from "lucide-react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const popularSearches = [
  { label: "Electricieni", slug: "electrician" },
  { label: "Instalatori", slug: "instalator" },
  { label: "Zidari", slug: "zidar" },
  { label: "Zugravii", slug: "zugrav" },
]

export function HeroSearch() {
  const [query, setQuery] = useState("")
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/cauta?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <section className="relative bg-[#0d0905] min-h-[88vh] flex flex-col justify-center overflow-hidden">

      {/* ── Background photo ── */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1685631188070-e5d4c9b2df6d?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt=""
          fill
          priority
          className="object-cover object-center opacity-[0.22]"
        />
      </div>

      {/* ── Dark gradient overlays ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d0905]/90 via-[#0d0905]/55 to-[#0d0905]/90" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0d0905]/55 via-transparent to-[#0d0905]/55" />

      {/* ── Gold grid lines ── */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(196,146,30,1) 1px, transparent 1px), linear-gradient(90deg, rgba(196,146,30,1) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
        }}
      />

      {/* ── Center radial glow ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 50% 50%, rgba(196,146,30,0.08) 0%, transparent 70%)",
        }}
      />

      {/* ── Bottom accent line ── */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent" />

      {/* ── Main content ── */}
      <div className="container relative z-10 py-28 md:py-40">
        <div className="mx-auto max-w-3xl text-center">

          {/* Ornament */}
          <div className="flex items-center justify-center gap-5 mb-10">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-primary/45" />
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-primary/65 rotate-45" />
              <div className="w-1 h-1 bg-primary/30 rotate-45" />
              <div className="w-1.5 h-1.5 bg-primary/65 rotate-45" />
            </div>
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-primary/45" />
          </div>

          {/* Main headline */}
          <h1
            className="font-display text-white leading-[1.06] tracking-tight"
            style={{ fontSize: "clamp(40px, 7vw, 84px)", fontWeight: 600 }}
          >
            Găsește meșteri de{" "}
            <em className="text-primary" style={{ fontStyle: "italic", fontWeight: 600 }}>
              încredere
            </em>{" "}
            în Tulcea
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-white/40 font-condensed tracking-[0.2em] text-sm uppercase">
            Electricieni &nbsp;·&nbsp; Instalatori &nbsp;·&nbsp; Zidari &nbsp;·&nbsp;
            Zugravii &nbsp;·&nbsp; Tâmplari
          </p>

          {/* Search form */}
          <form onSubmit={handleSubmit} className="mt-12 mx-auto max-w-2xl">
            <div className="flex border border-[#4a3820] focus-within:border-primary/65 transition-colors duration-300 shadow-[0_0_50px_rgba(196,146,30,0.08)]">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25 pointer-events-none" />
                <Input
                  type="text"
                  placeholder="Ce lucrare ai de făcut?"
                  className="h-14 pl-12 bg-white/[0.06] border-0 text-white placeholder:text-white/25 font-condensed tracking-wide rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                className="h-14 px-8 rounded-none bg-primary hover:bg-primary/88 text-white font-condensed tracking-[0.2em] uppercase text-sm font-semibold transition-colors duration-200 shrink-0"
              >
                Caută
              </Button>
            </div>
          </form>

          {/* Popular searches */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
            <span className="text-white/25 font-condensed tracking-[0.18em] text-xs uppercase">
              Populare
            </span>
            {popularSearches.map((item, i) => (
              <span key={item.slug} className="flex items-center gap-3">
                {i > 0 && <span className="text-white/15 text-xs">·</span>}
                <button
                  onClick={() =>
                    router.push(`/mesteri?categorie=${item.slug}`)
                  }
                  className="text-primary/55 hover:text-primary font-condensed tracking-wider text-sm transition-colors duration-200"
                >
                  {item.label}
                </button>
              </span>
            ))}
          </div>

          {/* Trust badges */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-5 md:gap-8">
            <div className="flex items-center gap-2 text-xs text-white/35 font-condensed tracking-[0.12em]">
              <div className="w-7 h-7 border border-primary/28 flex items-center justify-center shrink-0">
                <Shield className="h-3.5 w-3.5 text-primary/60" />
              </div>
              Meșteri verificați
            </div>
            <div className="flex items-center gap-2 text-xs text-white/35 font-condensed tracking-[0.12em]">
              <div className="w-7 h-7 border border-primary/28 flex items-center justify-center shrink-0">
                <Star className="h-3.5 w-3.5 text-primary/60" />
              </div>
              Recenzii autentice
            </div>
            <div className="flex items-center gap-2 text-xs text-white/35 font-condensed tracking-[0.12em]">
              <div className="w-7 h-7 border border-primary/28 flex items-center justify-center shrink-0">
                <Users className="h-3.5 w-3.5 text-primary/60" />
              </div>
              Contact direct
            </div>
          </div>
        </div>
      </div>

      {/* ── Scroll cue ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-10 animate-bounce">
        <ChevronDown className="h-4 w-4 text-primary/35" />
      </div>
    </section>
  )
}
