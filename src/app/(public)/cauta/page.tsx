"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Loader2, Send, Search, ArrowRight } from "lucide-react"
import { MesterCard } from "@/components/mester/mester-card"
import { useUser } from "@/lib/hooks/use-user"
import { toast } from "@/lib/hooks/use-toast"
import type { MesterWithCategory } from "@/types/database"

interface SearchApiResult {
  mesters: Array<MesterWithCategory & { coverPhoto: string | null }>
  categories: Array<{ id: string; name: string; slug: string; score?: number }>
  matchedCategory: { id: string; name: string; slug: string } | null
  isServiceRequest: boolean
}

const POPULAR = [
  { label: "Electricieni",  slug: "electrician" },
  { label: "Instalatori",   slug: "instalator"  },
  { label: "Zidari",        slug: "zidar"        },
  { label: "Zugravii",      slug: "zugrav"       },
  { label: "Tâmplari",      slug: "tamplar"      },
]

export default function SearchPage() {
  const searchParams  = useSearchParams()
  const router        = useRouter()
  useUser()

  const initialQuery = searchParams.get("q") || ""

  const [query,            setQuery]            = useState(initialQuery)
  const [inputValue,       setInputValue]       = useState(initialQuery)
  const [results,          setResults]          = useState<SearchApiResult | null>(null)
  const [isLoading,        setIsLoading]        = useState(false)

  /* autocomplete */
  const [suggestions,   setSuggestions]   = useState<SearchApiResult | null>(null)
  const [showDropdown,  setShowDropdown]  = useState(false)
  const [acLoading,     setAcLoading]     = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef    = useRef<HTMLInputElement>(null)

  /* run search on initial query */
  useEffect(() => {
    if (initialQuery) performSearch(initialQuery)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery])

  /* click outside to close dropdown */
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
    if (inputValue.length < 2) { setSuggestions(null); return }
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

  async function performSearch(q: string) {
    if (!q.trim()) return
    setIsLoading(true)
    setShowDropdown(false)
    try {
      const res  = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=12`)
      const data = await res.json()
      setResults(data)
    } catch {
      toast({ title: "Eroare", description: "Nu am putut efectua căutarea.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const q = inputValue.trim()
    if (!q) return
    setQuery(q)
    router.push(`/cauta?q=${encodeURIComponent(q)}`, { scroll: false })
    performSearch(q)
  }

  function pickCategory(slug: string) {
    setShowDropdown(false)
    router.push(`/mesteri?categorie=${slug}`)
  }

  function pickMester(id: string) {
    setShowDropdown(false)
    router.push(`/mester/${id}`)
  }


  const hasResults = results && results.mesters.length > 0

  return (
    <>
      {/* ══════════════════════════════════════════════════
          HERO — behind navbar, photo + gold grid (same as /mesteri)
      ══════════════════════════════════════════════════ */}
      <section className="relative bg-[#0d0905] -mt-[62px]" style={{ minHeight: 460 }}>

        {/* Background photo */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1516382799247-87df95d790b7?q=80&w=1474&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt=""
            fill
            priority
            className="object-cover object-center opacity-[0.16]"
          />
        </div>

        {/* Dark overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0905]/88 via-[#0d0905]/52 to-[#0d0905]/94" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0905]/80 via-transparent to-[#0d0905]/80" />

        {/* Vignette */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 28%, rgba(13,9,5,0.80) 100%)" }} />

        {/* Gold grid lines */}
        <div className="absolute inset-0 opacity-[0.042]"
          style={{
            backgroundImage: "linear-gradient(rgba(196,146,30,1) 1px, transparent 1px), linear-gradient(90deg, rgba(196,146,30,1) 1px, transparent 1px)",
            backgroundSize: "52px 52px",
            maskImage: "radial-gradient(ellipse 76% 78% at 50% 50%, black 20%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 76% 78% at 50% 50%, black 20%, transparent 100%)",
          }}
        />

        {/* Gold glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 55% at 50% 60%, rgba(196,146,30,0.07) 0%, transparent 70%)" }} />

        {/* Ghost "CAUTĂ" text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden" aria-hidden="true">
          <span className="font-display font-bold leading-none tracking-tighter whitespace-nowrap"
            style={{ fontSize: "clamp(72px, 20vw, 240px)", color: "rgba(255,255,255,0.022)" }}>
            
          </span>
        </div>

        {/* Bottom rule */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/28 to-transparent" />

        {/* Content */}
        <div className="container relative z-10 flex flex-col items-center text-center pt-[100px] pb-16">

          {/* Ornament */}
          <div className="flex items-center gap-5 mb-8">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/38" />
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-primary/58 rotate-45" />
              <div className="w-1 h-1 bg-primary/28 rotate-45" />
              <div className="w-1.5 h-1.5 bg-primary/58 rotate-45" />
            </div>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/38" />
          </div>

          {/* Overline */}
          <p className="font-condensed text-primary text-[10px] tracking-[0.32em] uppercase mb-4">
            Căutare
          </p>

          {/* Heading */}
          <h1 className="font-display text-white/92 leading-[1.06] tracking-tight"
            style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)", fontWeight: 600 }}>
            Găsește{" "}
            <em className="text-primary" style={{ fontStyle: "italic" }}>meșterul potrivit</em>{" "}
            pentru lucrarea ta
          </h1>

          {/* Search form */}
          <form onSubmit={handleSubmit} className="mt-10 w-full max-w-2xl mx-auto relative z-10">
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
                className="absolute top-full left-0 right-0 mt-px bg-[#0e0b07]/98 border border-[#3d2e14] shadow-[0_16px_48px_rgba(0,0,0,0.65)] z-[100]"
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
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          RESULTS AREA — white bg, no gray
      ══════════════════════════════════════════════════ */}
      <div className="bg-white min-h-[40vh]">
        <div className="container py-10">

          {/* Loading */}
          {isLoading && (
            <div className="flex flex-col items-center gap-4 py-20">
              <div className="relative">
                <div className="w-10 h-10 border border-[#584528]/20 flex items-center justify-center">
                  <Loader2 className="h-5 w-5 text-primary animate-spin" />
                </div>
              </div>
              <p className="font-condensed text-[11px] tracking-[0.22em] uppercase text-[#584528]/40">
                Se caută...
              </p>
            </div>
          )}

          {!isLoading && results && (
            <div className="space-y-8">

              {/* Service request banner */}
              {results.isServiceRequest && results.matchedCategory && (
                <div className="border border-primary/25 bg-primary/[0.04] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  style={{ boxShadow: "inset 0 0 0 1px rgba(196,146,30,0.08)" }}>
                  <div>
                    {/* Gold accent bar */}
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-4 h-px bg-primary/60" />
                      <span className="font-condensed text-[9px] tracking-[0.26em] uppercase text-primary/70">
                        Cerere detectată
                      </span>
                    </div>
                    <p className="font-display text-lg text-[#1a1208]">
                      Ai o cerere pentru{" "}
                      <span className="text-primary italic">{results.matchedCategory.name}</span>
                    </p>
                    <p className="font-condensed text-xs tracking-wide text-[#584528]/55 mt-1">
                      Vrei să trimitem cererea ta direct către meșterii din această categorie?
                    </p>
                  </div>

                  <button
                    onClick={() => router.push(`/cereri/nou?q=${encodeURIComponent(query)}`)}
                    className="shrink-0 flex items-center gap-2 px-5 py-3 bg-primary/90 hover:bg-primary text-white font-condensed text-[11px] tracking-[0.18em] uppercase transition-colors duration-200"
                  >
                    <Send className="h-4 w-4" />
                    Trimite cererea
                  </button>
                </div>
              )}

              {/* Results count + category label */}
              {results.mesters.length > 0 && (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-px bg-primary/50" />
                    <span className="font-condensed text-[11px] tracking-[0.22em] uppercase text-[#584528]/55">
                      {results.mesters.length} {results.mesters.length === 1 ? "rezultat" : "rezultate"}
                      {results.matchedCategory && (
                        <> · {results.matchedCategory.name}</>
                      )}
                    </span>
                  </div>

                  {/* Gap-grid */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#584528]/12">
                    {results.mesters.map((mester) => (
                      <div key={mester.id} className="bg-white">
                        <MesterCard mester={mester} coverPhoto={mester.coverPhoto} />
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* No results */}
              {results.mesters.length === 0 && (
                <div className="py-20 text-center">
                  <div className="w-12 h-px bg-[#584528]/20 mx-auto mb-6" />
                  <p className="font-display text-3xl text-[#584528]/28 italic mb-3">
                    Niciun rezultat
                  </p>
                  <p className="font-condensed text-xs tracking-[0.22em] uppercase text-[#584528]/38">
                    Încearcă alt termen sau explorează categoriile
                  </p>
                  <div className="w-12 h-px bg-[#584528]/20 mx-auto mt-6" />
                  <button
                    onClick={() => router.push("/mesteri")}
                    className="mt-8 inline-flex items-center gap-2 px-6 py-3 border border-[#584528]/20 font-condensed text-[11px] tracking-[0.20em] uppercase text-[#584528]/55 hover:border-primary/40 hover:text-primary transition-all duration-200"
                  >
                    Explorează toți meșterii <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Empty state — no search yet */}
          {!isLoading && !results && (
            <div className="py-24 text-center">
              <div className="w-12 h-px bg-[#584528]/18 mx-auto mb-8" />
              <p className="font-display text-4xl text-[#584528]/18 italic mb-3">
                Ce cauți?
              </p>
              <p className="font-condensed text-xs tracking-[0.22em] uppercase text-[#584528]/30 mb-10">
                Descrie lucrarea și găsim meșterii potriviți
              </p>

              {/* Popular categories as cards */}
              <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg mx-auto">
                {POPULAR.map((item) => (
                  <button
                    key={item.slug}
                    onClick={() => router.push(`/mesteri?categorie=${item.slug}`)}
                    className="px-4 py-2 border border-[#584528]/14 font-condensed text-[11px] tracking-[0.16em] uppercase text-[#584528]/45 hover:border-primary/35 hover:text-primary hover:bg-primary/[0.04] transition-all duration-200"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="w-12 h-px bg-[#584528]/18 mx-auto mt-8" />
            </div>
          )}

        </div>
      </div>
    </>
  )
}
