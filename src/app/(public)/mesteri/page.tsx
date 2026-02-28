import { Suspense } from "react"
import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import type { MesterWithCategory } from "@/types/database"

export const metadata: Metadata = {
  title: "Meșteri în Tulcea",
  description:
    "Explorează lista completă de meșteri verificați din Tulcea. Electricieni, instalatori, zidari, zugravi și mulți alții, gata să te ajute.",
}
import { MesterFilters } from "@/components/mester/mester-filters"
import { MesterCard } from "@/components/mester/mester-card"
import { Skeleton } from "@/components/ui/skeleton"
import { ITEMS_PER_PAGE } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PageProps {
  searchParams: Promise<{
    categorie?: string
    sortare?: string
    q?: string
    pagina?: string
  }>
}

interface Category {
  id: string
  name: string
  slug: string
  icon: string | null
  sort_order: number
  created_at: string
}

async function getCategories(): Promise<Category[]> {
  const supabase = await createClient()
  const { data } = await supabase.from("categories").select("*").order("sort_order")
  return (data || []) as Category[]
}

async function getMesters(params: {
  category?: string
  sort?: string
  query?: string
  page: number
}) {
  const supabase = await createClient()

  let queryBuilder = supabase
    .from("mester_profiles")
    .select(
      `
      *,
      mester_categories(category_id, category:categories(*))
    `,
      { count: "exact" }
    )
    .eq("approval_status", "approved")

  // Category filter via junction table
  if (params.category) {
    const { data: categoryData } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", params.category)
      .single() as { data: { id: string } | null }

    if (categoryData) {
      // Filter mesters that have this category in mester_categories
      const { data: mesterIds } = await supabase
        .from("mester_categories")
        .select("mester_id")
        .eq("category_id", categoryData.id) as { data: { mester_id: string }[] | null }

      if (mesterIds && mesterIds.length > 0) {
        queryBuilder = queryBuilder.in("id", mesterIds.map((m) => m.mester_id))
      } else {
        // No mesters in this category
        return { mesters: [], photoMap: new Map(), total: 0, totalPages: 0 }
      }
    }
  }

  // Search filter
  if (params.query) {
    queryBuilder = queryBuilder.ilike("display_name", `%${params.query}%`)
  }

  // Sorting
  switch (params.sort) {
    case "rating":
      queryBuilder = queryBuilder.order("avg_rating", { ascending: false })
      break
    case "recenzii":
      queryBuilder = queryBuilder.order("reviews_count", { ascending: false })
      break
    case "nou":
      queryBuilder = queryBuilder.order("created_at", { ascending: false })
      break
    default:
      queryBuilder = queryBuilder
        .order("subscription_tier", { ascending: false })
        .order("avg_rating", { ascending: false })
  }

  // Pagination
  const from = (params.page - 1) * ITEMS_PER_PAGE
  const to = from + ITEMS_PER_PAGE - 1
  queryBuilder = queryBuilder.range(from, to)

  const { data: mesters, count } = await queryBuilder

  // Get cover photos (profile type)
  const mesterIds = (mesters as { id: string }[])?.map((m) => m.id) || []
  const { data: photos } = await supabase
    .from("mester_photos")
    .select("mester_id, public_url")
    .in("mester_id", mesterIds)
    .eq("photo_type", "profile")
    .eq("approval_status", "approved") as { data: { mester_id: string; public_url: string }[] | null }

  const photoMap = new Map(photos?.map((p) => [p.mester_id, p.public_url]))

  return {
    mesters: (mesters || []) as MesterWithCategory[],
    photoMap,
    total: count || 0,
    totalPages: Math.ceil((count || 0) / ITEMS_PER_PAGE),
  }
}

function MesterGridSkeleton() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-[4/3] w-full" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  )
}

async function MesterGrid({ searchParams }: PageProps) {
  const params = await searchParams
  const page = parseInt(params.pagina || "1")
  const { mesters, photoMap, total, totalPages } = await getMesters({
    category: params.categorie,
    sort: params.sortare,
    query: params.q,
    page,
  })

  if (mesters.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">Nu am găsit meșteri</h3>
        <p className="text-muted-foreground">
          Încearcă să modifici filtrele sau să cauți altceva
        </p>
      </div>
    )
  }

  function buildPageUrl(pageNum: number) {
    const urlParams = new URLSearchParams()
    if (params.categorie) urlParams.set("categorie", params.categorie)
    if (params.sortare) urlParams.set("sortare", params.sortare)
    if (params.q) urlParams.set("q", params.q)
    if (pageNum > 1) urlParams.set("pagina", pageNum.toString())
    const queryString = urlParams.toString()
    return `/mesteri${queryString ? `?${queryString}` : ""}`
  }

  return (
    <>
      <p className="text-sm text-muted-foreground mb-6">
        {total} meșteri găsiți
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mesters.map((mester) => (
          <MesterCard
            key={mester.id}
            mester={mester}
            coverPhoto={photoMap.get(mester.id)}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          {page > 1 && (
            <Link href={buildPageUrl(page - 1)}>
              <Button variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
          )}
          <span className="text-sm text-muted-foreground">
            Pagina {page} din {totalPages}
          </span>
          {page < totalPages && (
            <Link href={buildPageUrl(page + 1)}>
              <Button variant="outline" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      )}
    </>
  )
}

export default async function MesteriPage(props: PageProps) {
  const categories = await getCategories()

  return (
    <>
      <div className="bg-[#0f0b04] border-b border-[#584528] py-10">
        <div className="container">
          <div className="flex items-center gap-4 mb-3">
            <div className="h-px w-10 bg-primary/40" />
            <span className="text-primary">★</span>
            <div className="h-px w-10 bg-primary/40" />
          </div>
          <h1 className="text-3xl font-bold text-white">Meșteri în Tulcea</h1>
          <p className="text-white/45 mt-2 italic">
            Găsește meșterul potrivit pentru lucrarea ta
          </p>
        </div>
      </div>

      <div className="container py-8">
        <Suspense fallback={null}>
          <MesterFilters categories={categories} />
        </Suspense>

        <Suspense fallback={<MesterGridSkeleton />}>
          <MesterGrid searchParams={props.searchParams} />
        </Suspense>
      </div>
    </>
  )
}
