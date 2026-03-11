"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useRef, useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { Search, X, SlidersHorizontal } from "lucide-react"
import type { Category } from "@/types/database"

interface MesterFiltersProps {
  categories: Category[]
}

const SORT_OPTIONS = [
  { value: "recomandat", label: "Recomandat" },
  { value: "rating",     label: "Rating"     },
  { value: "recenzii",   label: "Recenzii"   },
  { value: "nou",        label: "Nou"        },
]

export function MesterFilters({ categories }: MesterFiltersProps) {
  const router       = useRouter()
  const searchParams = useSearchParams()

  const currentCategory = searchParams.get("categorie") || ""
  const currentSort     = searchParams.get("sortare")   || "recomandat"
  const currentQuery    = searchParams.get("q")         || ""

  const [sheetOpen, setSheetOpen]   = useState(false)
  const [closing, setClosing]       = useState(false)
  const [animated, setAnimated]     = useState(false)
  const [dragY, setDragY]           = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const sheetRef  = useRef<HTMLDivElement>(null)
  const startYRef = useRef(0)
  const inputRef  = useRef<HTMLInputElement>(null)

  const [draftCategory, setDraftCategory] = useState(currentCategory)
  const [draftSort, setDraftSort]         = useState(currentSort)
  const [draftQuery, setDraftQuery]       = useState(currentQuery)

  // Sync draft when URL changes
  useEffect(() => {
    setDraftCategory(currentCategory)
    setDraftSort(currentSort)
    setDraftQuery(currentQuery)
  }, [currentCategory, currentSort, currentQuery])

  // Lock body scroll
  useEffect(() => {
    if (sheetOpen) {
      document.body.style.overflow    = "hidden"
      document.body.style.touchAction = "none"
    } else {
      document.body.style.overflow    = ""
      document.body.style.touchAction = ""
    }
    return () => {
      document.body.style.overflow    = ""
      document.body.style.touchAction = ""
    }
  }, [sheetOpen])

  function openSheet() {
    setDraftCategory(currentCategory)
    setDraftSort(currentSort)
    setDraftQuery(currentQuery)
    setDragY(0)
    setClosing(false)
    setAnimated(false)
    setSheetOpen(true)
  }

  function closeSheet() {
    setClosing(true)
    setTimeout(() => {
      setSheetOpen(false)
      setClosing(false)
      setDragY(0)
    }, 240)
  }

  function onTouchStart(e: React.TouchEvent) {
    startYRef.current = e.touches[0].clientY
    setIsDragging(true)
  }

  function onTouchMove(e: React.TouchEvent) {
    const delta = e.touches[0].clientY - startYRef.current
    if (delta > 0) setDragY(delta)
  }

  function onTouchEnd() {
    setIsDragging(false)
    const sheetHeight = sheetRef.current?.offsetHeight ?? 400
    if (dragY > sheetHeight * 0.3 || dragY > 120) {
      closeSheet()
    } else {
      setDragY(0)
    }
  }

  function applyFilters() {
    const params = new URLSearchParams()
    if (draftCategory) params.set("categorie", draftCategory)
    if (draftSort && draftSort !== "recomandat") params.set("sortare", draftSort)
    if (draftQuery.trim()) params.set("q", draftQuery.trim())
    const qs = params.toString()
    router.push(`/mesteri${qs ? `?${qs}` : ""}`)
    closeSheet()
  }

  function resetDraft() {
    setDraftCategory("")
    setDraftSort("recomandat")
    setDraftQuery("")
    if (inputRef.current) inputRef.current.value = ""
  }

  function clearAllAndNavigate() {
    router.push("/mesteri")
  }

  const activeCatName = categories.find(c => c.slug === currentCategory)?.name
  const activeCount   = (currentCategory ? 1 : 0) + (currentQuery ? 1 : 0) + (currentSort !== "recomandat" ? 1 : 0)
  const draftCount    = (draftCategory ? 1 : 0) + (draftQuery.trim() ? 1 : 0) + (draftSort !== "recomandat" ? 1 : 0)

  // After open animation completes, lock transform so re-renders don't replay it
  const panelTransform = isDragging
    ? `translateY(${dragY}px)`
    : closing
      ? "translateY(110%)"
      : animated ? "translateY(0)" : undefined

  const panelTransition = isDragging
    ? "none"
    : closing
      ? "transform 0.22s cubic-bezier(0.4, 0, 1, 1)"
      : "none"

  const panelAnimation = (!isDragging && !closing && !animated)
    ? "filterSheetUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards"
    : "none"

  return (
    <>
      {/* ══════════════════════════════════════════
          DESKTOP — inline search + sort + categories
      ══════════════════════════════════════════ */}
      <div className="hidden md:flex flex-col gap-3">
        {/* Row 1: search + sort */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/25 pointer-events-none" />
            <input
              type="text"
              placeholder="Caută meșter..."
              defaultValue={currentQuery}
              onChange={(e) => {
                clearTimeout((window as { _filterTimer?: ReturnType<typeof setTimeout> })._filterTimer)
                ;(window as { _filterTimer?: ReturnType<typeof setTimeout> })._filterTimer = setTimeout(() => {
                  const params = new URLSearchParams(searchParams.toString())
                  if (e.target.value) params.set("q", e.target.value); else params.delete("q")
                  params.delete("pagina")
                  router.push(`/mesteri?${params.toString()}`)
                }, 320)
              }}
              className="w-full h-9 bg-white/[0.06] border border-white/[0.09] pl-9 pr-4 text-white/75 placeholder:text-white/22 font-condensed text-[12px] tracking-[0.08em] outline-none focus:border-primary/45 focus:bg-white/[0.09] transition-all duration-200"
            />
          </div>
          <div className="flex items-center border border-white/[0.08] bg-white/[0.025]">
            {SORT_OPTIONS.map((opt, i) => (
              <button
                key={opt.value}
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString())
                  if (opt.value === "recomandat") params.delete("sortare"); else params.set("sortare", opt.value)
                  params.delete("pagina")
                  router.push(`/mesteri?${params.toString()}`)
                }}
                className={`h-9 px-4 font-condensed text-[10px] tracking-[0.18em] uppercase transition-all duration-150${i < SORT_OPTIONS.length - 1 ? " border-r border-white/[0.06]" : ""}${currentSort === opt.value ? " bg-primary/15 text-primary" : " text-white/30 hover:text-white/65 hover:bg-white/[0.05]"}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {(currentCategory || currentQuery) && (
            <button
              onClick={() => router.push("/mesteri")}
              className="h-9 w-9 flex items-center justify-center border border-white/[0.09] text-white/30 hover:text-red-400/70 hover:border-red-400/25 transition-all duration-150"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        {/* Row 2: category pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
          {[{ id: "__all__", slug: "", name: "Toate", icon: null }, ...categories].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString())
                if (cat.slug && currentCategory !== cat.slug) params.set("categorie", cat.slug); else params.delete("categorie")
                params.delete("pagina")
                router.push(`/mesteri?${params.toString()}`)
              }}
              className={`shrink-0 h-7 px-3.5 font-condensed text-[10px] tracking-[0.18em] uppercase border transition-all duration-150 whitespace-nowrap${currentCategory === cat.slug ? " bg-primary/20 border-primary/40 text-primary" : " border-white/[0.09] text-white/30 hover:text-white/60 hover:border-white/20 hover:bg-white/[0.05]"}`}
            >
              {cat.icon && <span className="mr-1.5">{cat.icon}</span>}
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          MOBILE — slim bar + bottom sheet
      ══════════════════════════════════════════ */}
      <div className="md:hidden flex items-center gap-2 min-h-[44px]">
        <div className="flex-1 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {activeCatName && (
            <span
              className="shrink-0 inline-flex items-center gap-1.5 h-7 px-3 font-condensed tracking-[0.14em] uppercase"
              style={{ fontSize: "10px", background: "hsl(38 68% 44% / 0.15)", border: "1px solid hsl(38 68% 44% / 0.45)", color: "hsl(38 68% 44%)" }}
            >
              {activeCatName}
              <button onClick={clearAllAndNavigate} className="opacity-60 hover:opacity-100 transition-opacity" aria-label="Șterge filtru">
                <X style={{ width: "9px", height: "9px" }} />
              </button>
            </span>
          )}
          {currentQuery && (
            <span
              className="shrink-0 inline-flex items-center gap-1.5 h-7 px-3 font-condensed tracking-[0.14em] uppercase"
              style={{ fontSize: "10px", background: "hsl(38 68% 44% / 0.15)", border: "1px solid hsl(38 68% 44% / 0.45)", color: "hsl(38 68% 44%)" }}
            >
              &ldquo;{currentQuery}&rdquo;
              <button onClick={clearAllAndNavigate} className="opacity-60 hover:opacity-100 transition-opacity" aria-label="Șterge căutare">
                <X style={{ width: "9px", height: "9px" }} />
              </button>
            </span>
          )}
          {currentSort !== "recomandat" && (
            <span
              className="shrink-0 inline-flex items-center gap-1.5 h-7 px-3 font-condensed tracking-[0.14em] uppercase"
              style={{ fontSize: "10px", background: "hsl(38 68% 44% / 0.15)", border: "1px solid hsl(38 68% 44% / 0.45)", color: "hsl(38 68% 44%)" }}
            >
              {SORT_OPTIONS.find(s => s.value === currentSort)?.label}
              <button onClick={clearAllAndNavigate} className="opacity-60 hover:opacity-100 transition-opacity" aria-label="Șterge sortare">
                <X style={{ width: "9px", height: "9px" }} />
              </button>
            </span>
          )}
          {activeCount === 0 && (
            <span className="font-condensed tracking-[0.18em] uppercase text-white/22" style={{ fontSize: "10px" }}>
              Toți meșterii
            </span>
          )}
        </div>

        <button
          onClick={openSheet}
          className="shrink-0 inline-flex items-center gap-2 h-9 px-4 font-condensed tracking-[0.16em] uppercase transition-all duration-200"
          style={{
            fontSize: "11px",
            border: activeCount > 0 ? "1px solid hsl(38 68% 44% / 0.55)" : "1px solid rgba(255,255,255,0.1)",
            color: activeCount > 0 ? "hsl(38 68% 44%)" : "rgba(255,255,255,0.5)",
            background: activeCount > 0 ? "hsl(38 68% 44% / 0.1)" : "rgba(255,255,255,0.04)",
          }}
        >
          <SlidersHorizontal style={{ width: "12px", height: "12px" }} />
          Filtrează
          {activeCount > 0 && (
            <span
              className="flex items-center justify-center font-condensed font-bold"
              style={{ width: "16px", height: "16px", background: "hsl(38 68% 44%)", color: "white", fontSize: "9px", borderRadius: "2px" }}
            >
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* ── Bottom sheet — mobile only, portal to body ── */}
      {sheetOpen && typeof document !== "undefined" && createPortal(
        <>
          {/* Keyframes injected inline */}
          <style>{`
            @keyframes filterSheetUp {
              from { transform: translateY(110%); }
              to   { transform: translateY(0);    }
            }
            @keyframes filterBackdropIn {
              from { opacity: 0; }
              to   { opacity: 1; }
            }
          `}</style>

          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[60]"
            style={{
              background: "rgba(5,3,1,0.72)",
              animation: closing ? "none" : "filterBackdropIn 0.2s ease forwards",
              opacity: closing ? 0 : undefined,
              transition: closing ? "opacity 0.22s ease" : "none",
            }}
            onClick={closeSheet}
          />

          {/* Sheet panel */}
          <div
            ref={sheetRef}
            className="fixed left-0 right-0 z-[70] flex flex-col"
            style={{
              bottom: 0,
              background: "#130d06",
              border: "1px solid rgba(196,146,30,0.18)",
              borderBottom: "none",
              borderRadius: "18px 18px 0 0",
              paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)",
              maxHeight: "90dvh",
              willChange: "transform",
              transform: panelTransform,
              transition: panelTransition,
              animation: panelAnimation,
            }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onAnimationEnd={() => setAnimated(true)}
          >
            {/* Drag handle */}
            <div
              className="flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing sticky top-0 z-10"
              style={{ background: "#130d06", borderRadius: "18px 18px 0 0" }}
            >
              <div style={{ width: "40px", height: "4px", borderRadius: "2px", background: "rgba(255,255,255,0.15)" }} />
            </div>

            {/* Header */}
            <div
              className="flex items-center justify-between px-5 pt-3 pb-4 sticky top-[28px] z-10"
              style={{ background: "#130d06" }}
            >
              <div className="flex items-center gap-2.5">
                <SlidersHorizontal style={{ width: "13px", height: "13px", color: "hsl(38 68% 44%)" }} />
                <span className="font-condensed tracking-[0.22em] uppercase text-white/75" style={{ fontSize: "12px" }}>
                  Filtrează meșteri
                </span>
              </div>
              <button
                onClick={closeSheet}
                className="flex items-center justify-center transition-colors duration-150 text-white/30 hover:text-white/70"
              >
                <X style={{ width: "18px", height: "18px" }} />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-5 pb-4 space-y-6">

              <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(196,146,30,0.3) 30%, rgba(196,146,30,0.3) 70%, transparent)" }} />

              {/* Search */}
              <div>
                <p className="font-condensed tracking-[0.22em] uppercase text-white/30 mb-3" style={{ fontSize: "10px" }}>
                  Caută după nume
                </p>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ width: "13px", height: "13px", color: "rgba(255,255,255,0.2)" }} />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Caută meșter..."
                    value={draftQuery}
                    onChange={(e) => setDraftQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                    className="w-full h-11 bg-white/[0.05] border border-white/[0.09] pl-10 pr-10 text-white/80 placeholder:text-white/22 font-condensed tracking-wide outline-none transition-all duration-200 focus:border-primary/45 focus:bg-white/[0.08]"
                    style={{ fontSize: "13px", borderRadius: "10px" }}
                  />
                  {draftQuery && (
                    <button
                      type="button"
                      onClick={() => { setDraftQuery(""); if (inputRef.current) inputRef.current.focus() }}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/55 transition-colors"
                    >
                      <X style={{ width: "12px", height: "12px" }} />
                    </button>
                  )}
                </div>
              </div>

              {/* Sort */}
              <div>
                <p className="font-condensed tracking-[0.22em] uppercase text-white/30 mb-3" style={{ fontSize: "10px" }}>
                  Sortare
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {SORT_OPTIONS.map((opt) => {
                    const active = draftSort === opt.value
                    return (
                      <button
                        key={opt.value}
                        onClick={() => setDraftSort(opt.value)}
                        className="h-11 font-condensed tracking-[0.16em] uppercase transition-all duration-150"
                        style={{
                          fontSize: "11px",
                          borderRadius: "10px",
                          border: active ? "1px solid hsl(38 68% 44% / 0.6)" : "1px solid rgba(255,255,255,0.08)",
                          background: active ? "hsl(38 68% 44% / 0.15)" : "rgba(255,255,255,0.03)",
                          color: active ? "hsl(38 68% 44%)" : "rgba(255,255,255,0.4)",
                        }}
                      >
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Category */}
              <div>
                <p className="font-condensed tracking-[0.22em] uppercase text-white/30 mb-3" style={{ fontSize: "10px" }}>
                  Categorie
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[{ id: "__all__", slug: "", name: "Toate", icon: null }, ...categories].map((cat) => {
                    const active = draftCategory === cat.slug
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setDraftCategory(cat.slug)}
                        className="h-11 font-condensed tracking-[0.14em] uppercase transition-all duration-150 flex items-center justify-center gap-1.5 px-2"
                        style={{
                          fontSize: "11px",
                          borderRadius: "10px",
                          border: active ? "1px solid hsl(38 68% 44% / 0.6)" : "1px solid rgba(255,255,255,0.08)",
                          background: active ? "hsl(38 68% 44% / 0.15)" : "rgba(255,255,255,0.03)",
                          color: active ? "hsl(38 68% 44%)" : "rgba(255,255,255,0.4)",
                        }}
                      >
                        {cat.icon && <span style={{ fontSize: "13px" }}>{cat.icon}</span>}
                        <span className="truncate">{cat.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              className="px-5 pt-3 flex items-center gap-3"
              style={{ borderTop: "1px solid rgba(196,146,30,0.12)" }}
            >
              <button
                onClick={resetDraft}
                disabled={draftCount === 0}
                className="flex-1 h-12 font-condensed tracking-[0.18em] uppercase transition-all duration-150"
                style={{
                  fontSize: "11px",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: draftCount === 0 ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.45)",
                  background: "transparent",
                  cursor: draftCount === 0 ? "not-allowed" : "pointer",
                }}
              >
                Resetează
              </button>
              <button
                onClick={applyFilters}
                className="flex-[2] h-12 font-condensed tracking-[0.18em] uppercase font-semibold transition-all duration-150"
                style={{
                  fontSize: "12px",
                  borderRadius: "10px",
                  background: "hsl(38 68% 44%)",
                  color: "white",
                  boxShadow: "0 4px 20px hsl(38 68% 44% / 0.28)",
                }}
              >
                {draftCount > 0 ? `Aplică (${draftCount})` : "Aplică filtrele"}
              </button>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  )
}
