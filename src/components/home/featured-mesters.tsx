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
    <section className="py-16 bg-white">
      <div className="container">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="h-px w-16 bg-[#584528]/35" />
            <span className="text-primary text-2xl">★</span>
            <div className="h-px w-16 bg-[#584528]/35" />
          </div>
          <h2 className="text-3xl font-bold tracking-wide">Meșteri recomandați</h2>
          <p className="mt-2 text-muted-foreground italic">
            Cei mai apreciați meșteri din Tulcea
          </p>
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

        <div className="mt-10 text-center">
          <Link href="/mesteri">
            <Button
              variant="outline"
              className="border-[#584528]/50 hover:bg-primary hover:text-white hover:border-primary tracking-widest uppercase text-xs"
            >
              Vezi toți meșterii
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
