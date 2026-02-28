import { getMesterProfile } from "@/actions/mester"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, Star, Heart, TrendingUp } from "lucide-react"

async function getMesterStats() {
  const supabase = await createClient()
  const mester = await getMesterProfile()

  if (!mester) return null

  // Get reviews count by rating
  const { data: reviews } = await supabase
    .from("reviews")
    .select("rating")
    .eq("mester_id", mester.id) as { data: { rating: number }[] | null }

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews?.filter((r) => r.rating === rating).length || 0,
  }))

  // Get favorites count
  const { count: favoritesCount } = await supabase
    .from("favorites")
    .select("*", { count: "exact", head: true })
    .eq("mester_id", mester.id)

  return {
    mester,
    ratingDistribution,
    favoritesCount: favoritesCount || 0,
  }
}

export default async function StatisticsPage() {
  const data = await getMesterStats()

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Nu am putut încărca statisticile.</p>
      </div>
    )
  }

  const { mester, ratingDistribution, favoritesCount } = data

  const stats = [
    {
      title: "Total vizualizări",
      value: mester.views_count,
      icon: Eye,
      description: "De la înregistrare",
    },
    {
      title: "Rating mediu",
      value: mester.avg_rating.toFixed(1),
      icon: Star,
      description: `Din ${mester.reviews_count} recenzii`,
    },
    {
      title: "Salvări în favorite",
      value: favoritesCount,
      icon: Heart,
      description: "Clienți interesați",
    },
  ]

  const maxRatingCount = Math.max(...ratingDistribution.map((r) => r.count), 1)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Statistici</h1>
        <p className="text-muted-foreground">
          Urmărește performanța profilului tău
        </p>
      </div>

      {/* Main stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Rating distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Distribuția ratingurilor
          </CardTitle>
        </CardHeader>
        <CardContent>
          {mester.reviews_count === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nu ai primit încă recenzii.
            </p>
          ) : (
            <div className="space-y-3">
              {ratingDistribution.map(({ rating, count }) => (
                <div key={rating} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-12">
                    <span className="text-sm font-medium">{rating}</span>
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  </div>
                  <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden">
                    <div
                      className="h-full bg-amber-400 transition-all"
                      style={{
                        width: `${(count / maxRatingCount) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Sfaturi pentru mai multă vizibilitate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">1.</span>
              Adaugă fotografii de calitate cu lucrările tale
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">2.</span>
              Completează toate informațiile din profil
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">3.</span>
              Răspunde rapid la cererile clienților
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">4.</span>
              Cere clienților mulțumiți să lase recenzii
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">5.</span>
              Consideră upgrade la un plan superior pentru mai multă vizibilitate
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
