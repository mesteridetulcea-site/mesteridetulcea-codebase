import { getMesterProfile } from "@/actions/mester"
import { createClient } from "@/lib/supabase/server"
import { Eye, Star, Heart, TrendingUp } from "lucide-react"

const panel = {
  background: "white",
  border: "1px solid #e0c99a",
  borderRadius: "6px",
} as const

async function getMesterStats() {
  const supabase = await createClient()
  const mester   = await getMesterProfile()
  if (!mester) return null

  const { data: reviews } = await supabase
    .from("reviews")
    .select("rating")
    .eq("mester_id", mester.id) as { data: { rating: number }[] | null }

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews?.filter((r) => r.rating === rating).length || 0,
  }))

  const { count: favoritesCount } = await supabase
    .from("favorites")
    .select("*", { count: "exact", head: true })
    .eq("mester_id", mester.id)

  return { mester, ratingDistribution, favoritesCount: favoritesCount || 0 }
}

export default async function StatisticsPage() {
  const data = await getMesterStats()

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="font-condensed tracking-widest uppercase text-sm text-white/30">
          Nu am putut încărca statisticile.
        </p>
      </div>
    )
  }

  const { mester, ratingDistribution, favoritesCount } = data

  const stats = [
    { label: "Total vizualizări", value: mester.views_count,           sub: "De la înregistrare",          icon: Eye },
    { label: "Rating mediu",      value: mester.avg_rating.toFixed(1), sub: `Din ${mester.reviews_count} recenzii`, icon: Star },
    { label: "Salvări favorite",  value: favoritesCount,               sub: "Clienți interesați",           icon: Heart },
  ]

  const maxRatingCount = Math.max(...ratingDistribution.map((r) => r.count), 1)

  const tips = [
    "Adaugă fotografii de calitate cu lucrările tale",
    "Completează toate informațiile din profil",
    "Răspunde rapid la cererile clienților",
    "Cere clienților mulțumiți să lase recenzii",
    "Consideră upgrade la un plan superior pentru mai multă vizibilitate",
  ]

  return (
    <div>
      {/* Page header */}
      <div
        className="px-6 pt-8 pb-8 md:px-10 md:pt-10"
        style={{ borderBottom: "1px solid #e0c99a" }}
      >
        <p className="font-condensed tracking-[0.26em] uppercase text-xs text-primary/70 mb-2">
          Panou meșter
        </p>
        <h1
          className="font-condensed text-[#1a0f05] leading-[1.1]"
          style={{ fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 600 }}
        >
          Statistici
        </h1>
        <p className="text-sm text-[#8a6848] mt-2">
          Urmărește performanța profilului tău
        </p>
      </div>

      <div className="px-6 py-8 md:px-10 space-y-6">

        {/* Stats */}
        <div>
          <p className="font-condensed tracking-[0.24em] uppercase text-xs text-[#8a6848] mb-3">
            Metrici principale
          </p>
          <div
            className="grid grid-cols-3 gap-px"
            style={{ background: "#e0c99a", borderRadius: "6px", overflow: "hidden" }}
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="px-4 py-5 md:px-6 md:py-7 flex flex-col"
                style={{ background: "#faf6ed" }}
              >
                <stat.icon className="h-4 w-4 text-primary/60 mb-3" />
                <div
                  className="font-display text-[#1a0f05] font-semibold mb-1"
                  style={{ fontSize: "clamp(28px, 4vw, 42px)", lineHeight: 1 }}
                >
                  {stat.value}
                </div>
                <p className="font-condensed tracking-[0.12em] uppercase text-xs text-[#8a6848] mb-1">
                  {stat.label}
                </p>
                <p className="text-xs text-[#b8956a] mt-auto">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Rating distribution */}
        <div style={panel}>
          <div
            className="px-6 py-4 flex items-center gap-2.5"
            style={{ borderBottom: "1px solid #e0c99a" }}
          >
            <Star className="h-4 w-4 text-primary/55" />
            <p className="font-condensed tracking-[0.14em] uppercase text-sm font-semibold text-[#3d2810]">
              Distribuția ratingurilor
            </p>
          </div>
          <div className="px-6 py-6">
            {mester.reviews_count === 0 ? (
              <div className="py-8 text-center">
                <p className="font-condensed tracking-[0.14em] uppercase text-sm text-[#b8956a]">
                  Nu ai primit încă recenzii
                </p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {ratingDistribution.map(({ rating, count }) => (
                  <div key={rating} className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 w-10 shrink-0">
                      <span className="font-condensed text-sm font-semibold text-[#3d2810]">{rating}</span>
                      <Star className="h-3 w-3 fill-primary text-primary shrink-0" />
                    </div>
                    <div
                      className="flex-1 h-2 overflow-hidden"
                      style={{ background: "#f0e8d8", borderRadius: "2px" }}
                    >
                      <div
                        className="h-full bg-primary transition-all duration-700"
                        style={{
                          width: `${(count / maxRatingCount) * 100}%`,
                          borderRadius: "2px",
                        }}
                      />
                    </div>
                    <span className="font-condensed text-sm text-[#8a6848] w-6 text-right shrink-0">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tips */}
        <div style={panel}>
          <div
            className="px-6 py-4 flex items-center gap-2.5"
            style={{ borderBottom: "1px solid #e0c99a" }}
          >
            <TrendingUp className="h-4 w-4 text-primary/55" />
            <p className="font-condensed tracking-[0.14em] uppercase text-sm font-semibold text-[#3d2810]">
              Sfaturi pentru mai multă vizibilitate
            </p>
          </div>
          <div className="px-6 py-6">
            <ul className="space-y-4">
              {tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span
                    className="font-display text-primary/70 shrink-0 font-semibold"
                    style={{ fontSize: "20px", lineHeight: 1.2 }}
                  >
                    {i + 1}.
                  </span>
                  <span className="text-sm text-[#8a6848] leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  )
}
