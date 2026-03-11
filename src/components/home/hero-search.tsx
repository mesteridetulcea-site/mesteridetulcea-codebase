"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  Search, Shield, Star, Users, ChevronDown,
  LayoutDashboard, ArrowRight, Loader2,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useUser } from "@/lib/hooks/use-user"

interface SearchApiResult {
  mesters: Array<{ id: string; display_name: string; mester_categories?: { category?: { name: string } | null }[] }>
  categories: Array<{ id: string; name: string; slug: string }>
}

const POPULAR = [
  { label: "Electricieni", slug: "electrician" },
  { label: "Instalatori", slug: "instalator"  },
  { label: "Zidari",       slug: "zidar"       },
  { label: "Zugravii",     slug: "zugrav"      },
]

export function HeroSearch() {
  const router = useRouter()
  const { profile, hasMesterProfile } = useUser()

  const [inputValue,      setInputValue]      = useState("")
  const [suggestions,     setSuggestions]     = useState<SearchApiResult | null>(null)
  const [showDropdown,    setShowDropdown]    = useState(false)
  const [acLoading,       setAcLoading]       = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef    = useRef<HTMLInputElement>(null)

  /* click outside → close dropdown */
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current   && !inputRef.current.contains(e.target as Node)
      ) setShowDropdown(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  /* autocomplete while typing */
  useEffect(() => {
    if (inputValue.length < 2) { setSuggestions(null); setShowDropdown(false); return }
    const ctrl = new AbortController()
    const t = setTimeout(async () => {
      setAcLoading(true)
      try {
        const res  = await fetch(`/api/search?q=${encodeURIComponent(inputValue)}&limit=5`, { signal: ctrl.signal })
        const data = await res.json()
        setSuggestions(data)
        setShowDropdown(true)
      } catch { /* ignore abort */ }
      finally { setAcLoading(false) }
    }, 280)
    return () => { clearTimeout(t); ctrl.abort() }
  }, [inputValue])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const q = inputValue.trim()
    if (!q) return
    setShowDropdown(false)
    router.push(`/cauta?q=${encodeURIComponent(q)}`)
  }

  function pickCategory(slug: string) {
    setShowDropdown(false)
    router.push(`/mesteri?categorie=${slug}`)
  }

  function pickMester(id: string) {
    setShowDropdown(false)
    router.push(`/mester/${id}`)
  }

  return (
    <section className="relative bg-[#0d0905] min-h-[88vh] flex flex-col justify-center overflow-hidden -mt-[62px]">

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

      <div className="absolute inset-0 bg-gradient-to-b from-[#0d0905]/90 via-[#0d0905]/55 to-[#0d0905]/90" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0d0905]/82 via-transparent to-[#0d0905]/82" />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 38%, rgba(13,9,5,0.72) 100%)" }}
      />

      <div
        className="absolute inset-0 opacity-[0.042]"
        style={{
          backgroundImage: "linear-gradient(rgba(196,146,30,1) 1px, transparent 1px), linear-gradient(90deg, rgba(196,146,30,1) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
          maskImage: "radial-gradient(ellipse 68% 72% at 50% 50%, black 20%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 68% 72% at 50% 50%, black 20%, transparent 100%)",
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 55% at 50% 50%, rgba(196,146,30,0.08) 0%, transparent 70%)" }}
      />

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent" />

      {/* ── Content ── */}
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

          {/* Headline */}
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

          <p className="mt-6 text-white/40 font-condensed tracking-[0.2em] text-sm uppercase">
            Electricieni &nbsp;·&nbsp; Instalatori &nbsp;·&nbsp; Zidari &nbsp;·&nbsp;
            Zugravii &nbsp;·&nbsp; Tâmplari
          </p>

          {/* ── Search bar — identic cu /cauta ── */}
          <form onSubmit={handleSubmit} className="mt-12 mx-auto max-w-2xl relative">
            <div className="flex border border-[#4a3820] focus-within:border-primary/60 transition-colors duration-300 shadow-[0_0_50px_rgba(196,146,30,0.07)]">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25 pointer-events-none" />
                {acLoading && (
                  <Loader2 className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/20 animate-spin" />
                )}
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Ce lucrare ai de făcut? (ex: repară prize, zugravit)"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onFocus={() => suggestions && setShowDropdown(true)}
                  className="w-full h-14 pl-11 pr-4 bg-white/[0.055] text-white placeholder:text-white/22 font-condensed tracking-wide text-[13px] outline-none border-0"
                />
              </div>
              <button
                type="submit"
                className="h-14 px-8 bg-primary hover:bg-primary/88 text-white font-condensed tracking-[0.20em] uppercase text-sm font-semibold transition-colors duration-200 shrink-0 flex items-center gap-2"
              >
                Caută
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Autocomplete dropdown */}
            {showDropdown && suggestions && (suggestions.categories.length > 0 || suggestions.mesters.length > 0) && (
              <div
                ref={dropdownRef}
                className="absolute top-full left-0 right-0 mt-px bg-[#0e0b07]/98 border border-[#3d2e14] shadow-[0_16px_48px_rgba(0,0,0,0.65)] z-50"
              >
                {suggestions.categories.length > 0 && (
                  <div className="border-b border-white/[0.06]">
                    <p className="font-condensed text-[9px] tracking-[0.22em] uppercase text-white/25 px-4 pt-3 pb-1">
                      Categorii
                    </p>
                    {suggestions.categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => pickCategory(cat.slug)}
                        className="w-full text-left px-4 py-2.5 font-condensed text-[12px] tracking-[0.08em] text-white/55 hover:text-primary hover:bg-white/[0.04] transition-colors duration-150"
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                )}
                {suggestions.mesters.length > 0 && (
                  <div>
                    <p className="font-condensed text-[9px] tracking-[0.22em] uppercase text-white/25 px-4 pt-3 pb-1">
                      Meșteri
                    </p>
                    {suggestions.mesters.map((m) => {
                      const catName = m.mester_categories?.[0]?.category?.name
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => pickMester(m.id)}
                          className="w-full text-left px-4 py-2.5 flex items-center justify-between font-condensed text-[12px] tracking-[0.08em] text-white/55 hover:text-primary hover:bg-white/[0.04] transition-colors duration-150"
                        >
                          <span>{m.display_name}</span>
                          {catName && <span className="text-white/25 text-[10px]">{catName}</span>}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </form>

          {/* Popular searches */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
            <span className="text-white/22 font-condensed tracking-[0.18em] text-[10px] uppercase">
              Popular
            </span>
            {POPULAR.map((item, i) => (
              <span key={item.slug} className="flex items-center gap-3">
                {i > 0 && <span className="text-white/12">·</span>}
                <button
                  onClick={() => router.push(`/mesteri?categorie=${item.slug}`)}
                  className="text-primary/50 hover:text-primary font-condensed tracking-wider text-sm transition-colors duration-200"
                >
                  {item.label}
                </button>
              </span>
            ))}
          </div>

          {/* Role-based CTA */}
          <div className="mt-6">
            {profile?.role === "admin" ? (
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 font-condensed tracking-[0.18em] uppercase text-xs text-primary hover:text-primary/80 transition-colors duration-200 border border-primary/45 hover:border-primary hover:bg-primary/10 px-5 py-2.5"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                Panou Admin
              </Link>
            ) : hasMesterProfile || profile?.role === "mester" ? (
              <Link
                href="/mester-cont"
                className="inline-flex items-center gap-2 font-condensed tracking-[0.18em] uppercase text-xs text-primary hover:text-primary/80 transition-colors duration-200 border border-primary/45 hover:border-primary hover:bg-primary/10 px-5 py-2.5"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                Panou Meșter
              </Link>
            ) : profile ? (
              <div className="flex flex-col items-center gap-3">
                <Link
                  href="/cereri/nou"
                  className="inline-flex items-center gap-2.5 bg-primary hover:bg-primary/88 text-white font-condensed tracking-[0.2em] uppercase text-sm px-8 py-3 transition-colors duration-200"
                >
                  Creează o cerere
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : null}
          </div>

          {/* Trust badges */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-5 md:gap-8">
            {[
              { icon: Shield, label: "Meșteri verificați" },
              { icon: Star,   label: "Recenzii autentice" },
              { icon: Users,  label: "Contact direct"     },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-xs text-white/35 font-condensed tracking-[0.12em]">
                <div className="w-7 h-7 border border-primary/28 flex items-center justify-center shrink-0">
                  <Icon className="h-3.5 w-3.5 text-primary/60" />
                </div>
                {label}
              </div>
            ))}
          </div>

          {!profile && (
            <div className="mt-6">
              <Link
                href="/devino-mester"
                className="inline-flex items-center gap-2 font-condensed tracking-[0.18em] uppercase text-xs text-primary hover:text-primary/80 transition-colors duration-200 border border-primary/45 hover:border-primary hover:bg-primary/10 px-5 py-2.5"
              >
                Ești meșter? Înregistrează-te →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-10 animate-bounce">
        <ChevronDown className="h-4 w-4 text-primary/35" />
      </div>
    </section>
  )
}
