"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Loader2, Send, CheckCircle } from "lucide-react"
import { SearchInput } from "@/components/search/search-input"
import { MesterCard } from "@/components/mester/mester-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useUser } from "@/lib/hooks/use-user"
import { toast } from "@/lib/hooks/use-toast"

interface SearchResult {
  mesters: Array<{
    id: string
    business_name: string
    slug: string
    subscription_tier: string
    average_rating: number
    total_reviews: number
    description: string | null
    city: string
    category: { id: string; name: string; slug: string } | null
    coverPhoto: string | null
  }>
  categories: Array<{
    id: string
    name: string
    slug: string
  }>
  matchedCategory: { id: string; name: string; slug: string } | null
  isServiceRequest: boolean
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useUser()

  const initialQuery = searchParams.get("q") || ""
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<SearchResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isNotifying, setIsNotifying] = useState(false)
  const [notificationSent, setNotificationSent] = useState(false)

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery)
    }
  }, [initialQuery])

  async function performSearch(searchQuery: string) {
    if (!searchQuery.trim()) return

    setIsLoading(true)
    setNotificationSent(false)
    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}&limit=12`
      )
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error("Search error:", error)
      toast({
        title: "Eroare",
        description: "Nu am putut efectua căutarea. Încearcă din nou.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  function handleSearch(newQuery: string) {
    setQuery(newQuery)
    router.push(`/cauta?q=${encodeURIComponent(newQuery)}`, { scroll: false })
    performSearch(newQuery)
  }

  async function handleNotifyMesters() {
    if (!results?.matchedCategory) return

    setIsNotifying(true)
    try {
      const response = await fetch("/api/email/notify-mesters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          categoryId: results.matchedCategory.id,
          userId: user?.id || null,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setNotificationSent(true)
        toast({
          title: "Meșteri notificați!",
          description: `Am trimis cererea ta către ${data.notifiedCount} meșteri din zona ta.`,
        })
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Notification error:", error)
      toast({
        title: "Eroare",
        description: "Nu am putut trimite notificările. Încearcă din nou.",
        variant: "destructive",
      })
    } finally {
      setIsNotifying(false)
    }
  }

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-center mb-6">
          Caută servicii sau meșteri
        </h1>
        <SearchInput
          defaultValue={query}
          onSearch={handleSearch}
          autoFocus={!initialQuery}
          className="w-full"
        />
      </div>

      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {!isLoading && results && (
        <div className="space-y-8">
          {/* Service request notification option */}
          {results.isServiceRequest && results.matchedCategory && (
            <Card className="border-primary bg-primary/5">
              <CardContent className="py-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold">
                      Pare că ai o cerere specifică!
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Vrei să trimitem cererea ta direct către cei mai buni
                      meșteri din categoria{" "}
                      <strong>{results.matchedCategory.name}</strong>?
                    </p>
                  </div>
                  {notificationSent ? (
                    <Button disabled variant="outline" className="gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Cerere trimisă
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNotifyMesters}
                      disabled={isNotifying}
                      className="gap-2"
                    >
                      {isNotifying ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      Trimite cererea
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results count */}
          {results.mesters.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                {results.mesters.length} rezultate
                {results.matchedCategory && (
                  <span>
                    {" "}
                    în categoria{" "}
                    <strong>{results.matchedCategory.name}</strong>
                  </span>
                )}
              </p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {results.mesters.map((mester) => (
                  <MesterCard
                    key={mester.id}
                    mester={mester as any}
                    coverPhoto={mester.coverPhoto}
                  />
                ))}
              </div>
            </div>
          )}

          {/* No results */}
          {results.mesters.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">
                Nu am găsit rezultate
              </h3>
              <p className="text-muted-foreground">
                Încearcă să cauți altceva sau să folosești un alt cuvânt cheie
              </p>
            </div>
          )}
        </div>
      )}

      {!isLoading && !results && (
        <div className="text-center py-12 text-muted-foreground">
          <p>Introdu un termen de căutare pentru a găsi meșteri</p>
        </div>
      )}
    </div>
  )
}
