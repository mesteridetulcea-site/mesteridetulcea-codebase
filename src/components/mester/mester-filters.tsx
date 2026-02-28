"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import type { Category } from "@/types/database"

interface MesterFiltersProps {
  categories: Category[]
}

export function MesterFilters({ categories }: MesterFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentCategory = searchParams.get("categorie") || "all"
  const currentSort = searchParams.get("sortare") || "recomandat"
  const currentQuery = searchParams.get("q") || ""

  function updateFilters(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    // Handle "all" as clearing the filter
    if (value && value !== "all") {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete("pagina") // Reset pagination when filters change
    router.push(`/mesteri?${params.toString()}`)
  }

  function clearFilters() {
    router.push("/mesteri")
  }

  const hasActiveFilters = (currentCategory && currentCategory !== "all") || currentQuery

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Caută meșter..."
          defaultValue={currentQuery}
          className="pl-9"
          onChange={(e) => {
            const value = e.target.value
            // Debounce search
            const timeout = setTimeout(() => {
              updateFilters("q", value)
            }, 300)
            return () => clearTimeout(timeout)
          }}
        />
      </div>

      <Select value={currentCategory} onValueChange={(v) => updateFilters("categorie", v)}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Toate categoriile" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toate categoriile</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.slug}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={currentSort} onValueChange={(v) => updateFilters("sortare", v)}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Sortare" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="recomandat">Recomandat</SelectItem>
          <SelectItem value="rating">Rating</SelectItem>
          <SelectItem value="recenzii">Recenzii</SelectItem>
          <SelectItem value="nou">Cel mai nou</SelectItem>
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button variant="ghost" onClick={clearFilters}>
          Resetează
        </Button>
      )}
    </div>
  )
}
