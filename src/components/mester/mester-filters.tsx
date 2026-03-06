"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useRef } from "react"
import { Search, X, SlidersHorizontal } from "lucide-react"
import type { Category } from "@/types/database"
import { cn } from "@/lib/utils/cn"

interface MesterFiltersProps {
  categories: Category[]
}

const SORT_OPTIONS = [
  { value: "recomandat", label: "Recomandat" },
  { value: "rating",     label: "Rating" },
  { value: "recenzii",   label: "Recenzii" },
  { value: "nou",        label: "Nou" },
]

export function MesterFilters({ categories }: MesterFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const inputRef = useRef<HTMLInputElement>(null)

  const currentCategory = searchParams.get("categorie") || ""
  const currentSort     = searchParams.get("sortare") || "recomandat"
  const currentQuery    = searchParams.get("q") || ""

  const hasActiveFilters = currentCategory || currentQuery

  function updateFilters(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete("pagina")
    router.push(`/mesteri?${params.toString()}`)
  }

  function clearFilters() {
    if (inputRef.current) inputRef.current.value = ""
    router.push("/mesteri")
  }

  let searchTimer: ReturnType<typeof setTimeout>
  function handleSearch(value: string) {
    clearTimeout(searchTimer)
    searchTimer = setTimeout(() => {
      updateFilters("q", value)
    }, 320)
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Row 1: search + sort + clear */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/25 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Caută meșter..."
            defaultValue={currentQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full h-9 bg-white/[0.06] border border-white/[0.09] pl-9 pr-4 text-white/75 placeholder:text-white/22 font-condensed text-[12px] tracking-[0.08em] outline-none focus:border-primary/45 focus:bg-white/[0.09] transition-all duration-200"
          />
        </div>

        {/* Sort pills */}
        <div className="hidden sm:flex items-center border border-white/[0.08] bg-white/[0.025]">
          {SORT_OPTIONS.map((opt, i) => (
            <button
              key={opt.value}
              onClick={() => updateFilters("sortare", opt.value === "recomandat" ? "" : opt.value)}
              className={cn(
                "h-9 px-4 font-condensed text-[10px] tracking-[0.18em] uppercase transition-all duration-150",
                i < SORT_OPTIONS.length - 1 && "border-r border-white/[0.06]",
                currentSort === opt.value
                  ? "bg-primary/15 text-primary"
                  : "text-white/30 hover:text-white/65 hover:bg-white/[0.05]"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Mobile sort — icon trigger */}
        <div className="sm:hidden">
          <select
            value={currentSort}
            onChange={(e) => updateFilters("sortare", e.target.value === "recomandat" ? "" : e.target.value)}
            className="h-9 px-3 bg-white/[0.06] border border-white/[0.09] text-white/60 font-condensed text-[11px] tracking-wide outline-none focus:border-primary/40"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#0d0905]">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Clear — only when filters active */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="h-9 w-9 flex items-center justify-center border border-white/[0.09] text-white/30 hover:text-red-400/70 hover:border-red-400/25 transition-all duration-150"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Row 2: category pills — horizontal scroll */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
        <button
          onClick={() => updateFilters("categorie", "")}
          className={cn(
            "shrink-0 h-7 px-3.5 font-condensed text-[10px] tracking-[0.18em] uppercase border transition-all duration-150",
            !currentCategory
              ? "bg-primary/20 border-primary/40 text-primary"
              : "border-white/[0.09] text-white/30 hover:text-white/60 hover:border-white/20 hover:bg-white/[0.05]"
          )}
        >
          Toate
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => updateFilters("categorie", currentCategory === cat.slug ? "" : cat.slug)}
            className={cn(
              "shrink-0 h-7 px-3.5 font-condensed text-[10px] tracking-[0.18em] uppercase border transition-all duration-150 whitespace-nowrap",
              currentCategory === cat.slug
                ? "bg-primary/20 border-primary/40 text-primary"
                : "border-white/[0.09] text-white/30 hover:text-white/60 hover:border-white/20 hover:bg-white/[0.05]"
            )}
          >
            {cat.icon && <span className="mr-1.5">{cat.icon}</span>}
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  )
}
