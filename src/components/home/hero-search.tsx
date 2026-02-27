"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

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
    <section className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-background py-16 md:py-24">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Găsește meșteri de{" "}
            <span className="text-primary">încredere</span> în Tulcea
          </h1>
          <p className="mt-6 text-lg text-muted-foreground md:text-xl">
            Conectăm locuitorii din Tulcea cu cei mai buni meșteri locali.
            Electricieni, instalatori, zidari și mulți alții - toți la un click
            distanță.
          </p>

          <form onSubmit={handleSubmit} className="mt-10">
            <div className="flex flex-col sm:flex-row gap-3 mx-auto max-w-xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Ce lucrare ai de făcut? (ex: instalator, electrician)"
                  className="pl-10 h-12"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <Button type="submit" size="lg" className="h-12 px-8">
                Caută meșteri
              </Button>
            </div>
          </form>

          <div className="mt-6 flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
            <span>Căutări populare:</span>
            <button
              onClick={() => router.push("/mesteri?categorie=electrician")}
              className="text-primary hover:underline"
            >
              Electricieni
            </button>
            <span>•</span>
            <button
              onClick={() => router.push("/mesteri?categorie=instalator")}
              className="text-primary hover:underline"
            >
              Instalatori
            </button>
            <span>•</span>
            <button
              onClick={() => router.push("/mesteri?categorie=zidar")}
              className="text-primary hover:underline"
            >
              Zidari
            </button>
            <span>•</span>
            <button
              onClick={() => router.push("/mesteri?categorie=zugrav")}
              className="text-primary hover:underline"
            >
              Zugravii
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
