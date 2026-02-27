import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { MesterCard } from "@/components/mester/mester-card"

async function getFeaturedMesters() {
  const supabase = await createClient()

  const { data: mesters } = await supabase
    .from("mesters")
    .select(`
      *,
      category:categories(*)
    `)
    .eq("approval_status", "approved")
    .eq("is_featured", true)
    .order("subscription_tier", { ascending: false })
    .order("average_rating", { ascending: false })
    .limit(4)

  // Get cover photos for each mester
  const mesterIds = mesters?.map((m) => m.id) || []
  const { data: photos } = await supabase
    .from("mester_photos")
    .select("mester_id, url")
    .in("mester_id", mesterIds)
    .eq("is_cover", true)
    .eq("approval_status", "approved")

  const photoMap = new Map(photos?.map((p) => [p.mester_id, p.url]))

  return { mesters: mesters || [], photoMap }
}

export async function FeaturedMesters() {
  const { mesters, photoMap } = await getFeaturedMesters()

  if (mesters.length === 0) {
    return null
  }

  return (
    <section className="py-16">
      <div className="container">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold">Meșteri recomandați</h2>
            <p className="mt-2 text-muted-foreground">
              Cei mai apreciați meșteri din Tulcea
            </p>
          </div>
          <Link href="/mesteri">
            <Button variant="outline" className="hidden sm:flex">
              Vezi toți meșterii
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mesters.map((mester) => (
            <MesterCard
              key={mester.id}
              mester={mester}
              coverPhoto={photoMap.get(mester.id)}
            />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/mesteri">
            <Button variant="outline">
              Vezi toți meșterii
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
