import Link from "next/link"
import { ArrowLeft, Heart } from "lucide-react"
import { getFavorites } from "@/actions/favorites"
import { Button } from "@/components/ui/button"
import { MesterCard } from "@/components/mester/mester-card"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { createClient } from "@/lib/supabase/server"
import type { MesterWithCategory } from "@/types/database"

async function getFavoritesWithPhotos() {
  const favorites = await getFavorites()

  if (favorites.length === 0) return { favorites: [], photoMap: new Map() }

  const supabase = await createClient()
  const mesterIds = favorites.map((f) => f.mester?.id).filter(Boolean)

  const { data: photos } = (await supabase
    .from("mester_photos")
    .select("mester_id, public_url")
    .in("mester_id", mesterIds)
    .eq("photo_type", "profile")
    .eq("approval_status", "approved")) as { data: { mester_id: string; public_url: string }[] | null }

  const photoMap = new Map(photos?.map((p) => [p.mester_id, p.public_url]))

  return { favorites, photoMap }
}

export default async function FavoritesPage() {
  const { favorites, photoMap } = await getFavoritesWithPhotos()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="max-w-6xl mx-auto">
          <Link href="/cont/setari">
            <Button variant="ghost" className="mb-6 -ml-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Înapoi la setări
            </Button>
          </Link>

          <div className="flex items-center gap-3 mb-8">
            <Heart className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Meșterii mei favoriți</h1>
              <p className="text-muted-foreground">
                {favorites.length} meșteri salvați
              </p>
            </div>
          </div>

          {favorites.length === 0 ? (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Nu ai meșteri salvați
              </h3>
              <p className="text-muted-foreground mb-4">
                Salvează meșterii care îți plac pentru a-i găsi mai ușor
              </p>
              <Link href="/mesteri">
                <Button>Explorează meșteri</Button>
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites
                .filter((favorite) => favorite.mester)
                .map((favorite) => (
                  <MesterCard
                    key={favorite.id ?? favorite.mester_id}
                    mester={favorite.mester as MesterWithCategory}
                    coverPhoto={photoMap.get(favorite.mester!.id)}
                  />
                ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
