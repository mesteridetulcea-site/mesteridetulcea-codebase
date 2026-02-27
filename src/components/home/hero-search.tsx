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
    <section className="relative bg-[#0f0b04] py-20 md:py-32 overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a1208]/60 via-transparent to-[#0f0b04]/80 pointer-events-none" />

      <div className="container relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          {/* Gold ornament */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-16 bg-primary/50" />
            <span className="text-primary text-2xl">★</span>
            <div className="h-px w-16 bg-primary/50" />
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl leading-tight">
            Găsește meșteri de{" "}
            <span className="text-primary italic">încredere</span>
            <br className="hidden sm:block" />
            {" "}în Tulcea
          </h1>

          <p className="mt-6 text-base text-white/55 md:text-lg italic leading-relaxed">
            Conectăm locuitorii din Tulcea cu cei mai buni meșteri locali.
            <br className="hidden sm:block" />
            Electricieni, instalatori, zidari și mulți alții — toți la un click distanță.
          </p>

          <form onSubmit={handleSubmit} className="mt-10">
            <div className="flex flex-col sm:flex-row gap-3 mx-auto max-w-xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/35" />
                <Input
                  type="text"
                  placeholder="Ce lucrare ai de făcut?"
                  className="pl-10 h-12 bg-white/8 border-[#584528] text-white placeholder:text-white/35 focus:border-primary focus:ring-primary"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="h-12 px-8 bg-primary hover:bg-primary/90 text-white tracking-widest uppercase text-sm font-semibold"
              >
                Caută
              </Button>
            </div>
          </form>

          <div className="mt-6 flex flex-wrap justify-center gap-x-3 gap-y-2 text-sm text-white/40">
            <span>Populare:</span>
            <button
              onClick={() => router.push("/mesteri?categorie=electrician")}
              className="text-primary/70 hover:text-primary transition-colors"
            >
              Electricieni
            </button>
            <span>·</span>
            <button
              onClick={() => router.push("/mesteri?categorie=instalator")}
              className="text-primary/70 hover:text-primary transition-colors"
            >
              Instalatori
            </button>
            <span>·</span>
            <button
              onClick={() => router.push("/mesteri?categorie=zidar")}
              className="text-primary/70 hover:text-primary transition-colors"
            >
              Zidari
            </button>
            <span>·</span>
            <button
              onClick={() => router.push("/mesteri?categorie=zugrav")}
              className="text-primary/70 hover:text-primary transition-colors"
            >
              Zugravii
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
