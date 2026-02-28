import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { MesterCard } from "@/components/mester/mester-card"
import type { MesterWithCategory } from "@/types/database"

async function getFeaturedMesters() {
  const supabase = await createClient()

  const { data: mesters } = await supabase
    .from("mester_profiles")
    .select(`
      *,
      mester_categories(category_id, category:categories(*))
    `)
    .eq("approval_status", "approved")
    .eq("is_featured", true)
    .order("subscription_tier", { ascending: false })
    .order("avg_rating", { ascending: false })
    .limit(4) as { data: MesterWithCategory[] | null }

  const mesterIds = mesters?.map((m) => m.id) || []
  const { data: photos } = await supabase
    .from("mester_photos")
    .select("mester_id, public_url")
    .in("mester_id", mesterIds)
    .eq("photo_type", "profile")
    .eq("approval_status", "approved") as { data: { mester_id: string; public_url: string }[] | null }

  const photoMap = new Map(photos?.map((p) => [p.mester_id, p.public_url]))

  return { mesters: mesters || [], photoMap }
}

export async function FeaturedMesters() {
  const { mesters, photoMap } = await getFeaturedMesters()

  if (mesters.length === 0) {
    return null
  }

  return (
    <section className="py-20 bg-[#faf8f4]">
      <div className="container">
        {/* Section header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div>
            <p className="font-condensed tracking-[0.28em] uppercase text-primary text-xs mb-2">
              Recomandat
            </p>
            <h2
              className="font-display text-foreground"
              style={{ fontSize: "clamp(30px, 4vw, 48px)" }}
            >
              Meșteri recomandați
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Cei mai apreciați meșteri din Tulcea
            </p>
          </div>
          <Link href="/mesteri" className="shrink-0">
            <Button
              variant="outline"
              className="border-[#584528]/25 hover:bg-primary hover:text-white hover:border-primary rounded-none font-condensed tracking-[0.14em] uppercase text-xs transition-all duration-200"
            >
              Toți meșterii
              <ArrowRight className="ml-2 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {mesters.map((mester) => (
            <MesterCard
              key={mester.id}
              mester={mester}
              coverPhoto={photoMap.get(mester.id)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
