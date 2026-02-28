"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils/cn"

interface SearchResult {
  mesters: Array<{
    id: string
    display_name: string
    mester_categories: Array<{
      category: { name: string } | null
    }>
  }>
  categories: Array<{
    id: string
    name: string
    slug: string
    score: number
  }>
  matchedCategory: { id: string; name: string; slug: string } | null
  isServiceRequest: boolean
}

interface SearchInputProps {
  defaultValue?: string
  onSearch?: (query: string) => void
  autoFocus?: boolean
  className?: string
}

export function SearchInput({
  defaultValue = "",
  onSearch,
  autoFocus = false,
  className,
}: SearchInputProps) {
  const [query, setQuery] = useState(defaultValue)
  const [results, setResults] = useState<SearchResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (query.length < 2) {
      setResults(null)
      return
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=5`, {
          signal: controller.signal,
        })
        const data = await response.json()
        setResults(data)
        setShowDropdown(true)
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Search error:", error)
        }
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => {
      clearTimeout(timeoutId)
      controller.abort()
    }
  }, [query])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      setShowDropdown(false)
      if (onSearch) {
        onSearch(query.trim())
      } else {
        router.push(`/cauta?q=${encodeURIComponent(query.trim())}`)
      }
    }
  }

  function handleCategoryClick(slug: string) {
    setShowDropdown(false)
    router.push(`/mesteri?categorie=${slug}`)
  }

  function handleMesterClick(id: string) {
    setShowDropdown(false)
    router.push(`/mester/${id}`)
  }

  return (
    <div className={cn("relative", className)}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Ce lucrare ai de făcut? (ex: electrician, repară prize)"
            className="pl-10 pr-10 h-12"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results && setShowDropdown(true)}
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground animate-spin" />
          )}
        </div>
      </form>

      {showDropdown && results && (results.categories.length > 0 || results.mesters.length > 0) && (
        <div
          ref={dropdownRef}
          className="absolute z-50 top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-lg overflow-hidden"
        >
          {results.categories.length > 0 && (
            <div className="p-2 border-b">
              <p className="text-xs font-medium text-muted-foreground px-2 mb-1">
                Categorii
              </p>
              {results.categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.slug)}
                  className="w-full text-left px-3 py-2 rounded hover:bg-muted transition-colors"
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}

          {results.mesters.length > 0 && (
            <div className="p-2">
              <p className="text-xs font-medium text-muted-foreground px-2 mb-1">
                Meșteri
              </p>
              {results.mesters.map((mester) => {
                const categoryName = mester.mester_categories?.[0]?.category?.name
                return (
                  <button
                    key={mester.id}
                    onClick={() => handleMesterClick(mester.id)}
                    className="w-full text-left px-3 py-2 rounded hover:bg-muted transition-colors"
                  >
                    <span className="font-medium">{mester.display_name}</span>
                    {categoryName && (
                      <span className="text-sm text-muted-foreground ml-2">
                        {categoryName}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
