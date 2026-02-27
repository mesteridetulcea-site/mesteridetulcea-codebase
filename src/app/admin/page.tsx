import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Image, Star, FileText } from "lucide-react"

async function getStats() {
  const supabase = await createClient()

  const [
    { count: totalMesters },
    { count: pendingMesters },
    { count: pendingPhotos },
    { count: totalReviews },
  ] = await Promise.all([
    supabase
      .from("mesters")
      .select("*", { count: "exact", head: true }),
    supabase
      .from("mesters")
      .select("*", { count: "exact", head: true })
      .eq("approval_status", "pending"),
    supabase
      .from("mester_photos")
      .select("*", { count: "exact", head: true })
      .eq("approval_status", "pending"),
    supabase
      .from("reviews")
      .select("*", { count: "exact", head: true }),
  ])

  return {
    totalMesters: totalMesters || 0,
    pendingMesters: pendingMesters || 0,
    pendingPhotos: pendingPhotos || 0,
    totalReviews: totalReviews || 0,
  }
}

export default async function AdminDashboardPage() {
  const stats = await getStats()

  const cards = [
    {
      title: "Total Meșteri",
      value: stats.totalMesters,
      description: "Meșteri înregistrați",
      icon: Users,
    },
    {
      title: "Meșteri în așteptare",
      value: stats.pendingMesters,
      description: "Necesită aprobare",
      icon: Users,
      highlight: stats.pendingMesters > 0,
    },
    {
      title: "Fotografii în așteptare",
      value: stats.pendingPhotos,
      description: "Necesită aprobare",
      icon: Image,
      highlight: stats.pendingPhotos > 0,
    },
    {
      title: "Total Recenzii",
      value: stats.totalReviews,
      description: "Recenzii lăsate",
      icon: Star,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Admin</h1>
        <p className="text-muted-foreground">
          Bun venit în panoul de administrare
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card
            key={card.title}
            className={card.highlight ? "border-primary" : ""}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Activitate recentă
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Nu există activitate recentă de afișat.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Acțiuni rapide
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {stats.pendingMesters > 0 && (
                <span className="block">
                  Ai {stats.pendingMesters} meșteri care așteaptă aprobare.
                </span>
              )}
              {stats.pendingPhotos > 0 && (
                <span className="block">
                  Ai {stats.pendingPhotos} fotografii care așteaptă aprobare.
                </span>
              )}
              {stats.pendingMesters === 0 && stats.pendingPhotos === 0 && (
                <span>Nu există elemente în așteptare.</span>
              )}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
