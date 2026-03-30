import { Suspense } from "react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import type { MesterWithCategory } from "@/types/database"
import { MesterFilters } from "@/components/mester/mester-filters"
import { MesterCard } from "@/components/mester/mester-card"
import { ITEMS_PER_PAGE } from "@/lib/constants"
import { ChevronLeft, ChevronRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Meșteri în Tulcea",
  description:
    "Explorează lista completă de meșteri verificați din Tulcea. Electricieni, instalatori, zidari, zugravi și mulți alții, gata să te ajute.",
}

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

  // Exclude mesters whose user account is banned
  const { data: bannedUsers } = await supabase
    .from("profiles")
    .select("id")
    .eq("is_banned", true) as { data: { id: string }[] | null }
  const bannedUserIds = bannedUsers?.map((u) => u.id) ?? []

  let queryBuilder = supabase
    .from("mester_profiles")
    .select(`*, mester_categories(category_id, category:categories(*))`, { count: "exact" })
    .eq("approval_status", "approved")

  if (bannedUserIds.length > 0) {
    queryBuilder = queryBuilder.not("user_id", "in", `(${bannedUserIds.join(",")})`)
  }

  if (params.category) {
    const { data: categoryData } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", params.category)
      .single() as { data: { id: string } | null }

    if (categoryData) {
      const { data: mesterIds } = await supabase
        .from("mester_categories")
        .select("mester_id")
        .eq("category_id", categoryData.id) as { data: { mester_id: string }[] | null }

      if (mesterIds && mesterIds.length > 0) {
        queryBuilder = queryBuilder.in("id", mesterIds.map((m) => m.mester_id))
      } else {
        return { mesters: [], photoMap: new Map(), total: 0, totalPages: 0 }
      }
    }
  }

  if (params.query) {
    queryBuilder = queryBuilder.ilike("display_name", `%${params.query}%`)
  }

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

  const from = (params.page - 1) * ITEMS_PER_PAGE
  const to = from + ITEMS_PER_PAGE - 1
  queryBuilder = queryBuilder.range(from, to)

  const { data: mesters, count } = await queryBuilder

  const ids = (mesters as { id: string }[])?.map((m) => m.id) || []
  const { data: photos } = await supabase
    .from("mester_photos")
    .select("mester_id, public_url")
    .in("mester_id", ids)
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

/* ── Skeleton ── */
function MesterGridSkeleton() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#584528]/12">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white p-5 space-y-4">
          <div className="aspect-[4/3] bg-[#f0ebe2] animate-pulse" />
          <div className="space-y-2">
            <div className="h-5 bg-[#ede8de] animate-pulse w-2/3" />
            <div className="h-3 bg-[#f0ebe2] animate-pulse w-1/3" />
          </div>
          <div className="h-3 bg-[#f0ebe2] animate-pulse w-1/2" />
        </div>
      ))}
    </div>
  )
}

/* ── Grid ── */
async function MesterGrid({ searchParams }: PageProps) {
  const params = await searchParams
  const page = parseInt(params.pagina || "1")
  const { mesters, photoMap, total, totalPages } = await getMesters({
    category: params.categorie,
    sort: params.sortare,
    query: params.q,
    page,
  })

  function buildPageUrl(pageNum: number) {
    const urlParams = new URLSearchParams()
    if (params.categorie) urlParams.set("categorie", params.categorie)
    if (params.sortare) urlParams.set("sortare", params.sortare)
    if (params.q) urlParams.set("q", params.q)
    if (pageNum > 1) urlParams.set("pagina", pageNum.toString())
    const qs = urlParams.toString()
    return `/mesteri${qs ? `?${qs}` : ""}`
  }

  if (mesters.length === 0) {
    return (
      <div className="py-24 text-center">
        <div className="w-12 h-px bg-[#584528]/25 mx-auto mb-6" />
        <p className="font-display text-3xl text-[#584528]/30 italic mb-3">Niciun rezultat</p>
        <p className="font-condensed text-xs tracking-[0.22em] uppercase text-[#584528]/40">
          Încearcă să modifici filtrele
        </p>
        <div className="w-12 h-px bg-[#584528]/25 mx-auto mt-6" />
      </div>
    )
  }

  return (
    <div>
      {/* Result count */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-6 h-px bg-primary/50" />
          <span className="font-condensed text-[11px] tracking-[0.22em] uppercase text-[#584528]/55">
            {total} {total === 1 ? "meșter" : "meșteri"} găsiți
          </span>
        </div>
        {totalPages > 1 && (
          <span className="font-condensed text-[10px] tracking-[0.18em] uppercase text-[#584528]/35">
            Pag. {page}/{totalPages}
          </span>
        )}
      </div>

      {/* Gap-grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#584528]/12">
        {mesters.map((mester) => (
          <div key={mester.id} className="bg-white">
            <MesterCard mester={mester} coverPhoto={photoMap.get(mester.id)} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-0 mt-12 border-t border-[#584528]/12 pt-8">
          {page > 1 ? (
            <Link
              href={buildPageUrl(page - 1)}
              className="flex items-center gap-2 px-5 py-3 border border-[#584528]/18 font-condensed text-[11px] tracking-[0.18em] uppercase text-[#584528]/55 hover:border-primary/40 hover:text-primary hover:bg-primary/[0.04] transition-all duration-200"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Anterior
            </Link>
          ) : (
            <div className="flex items-center gap-2 px-5 py-3 border border-[#584528]/08 font-condensed text-[11px] tracking-[0.18em] uppercase text-[#584528]/20">
              <ChevronLeft className="h-3.5 w-3.5" /> Anterior
            </div>
          )}
          <div className="flex items-center border-y border-[#584528]/18">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => Math.abs(p - page) <= 2)
              .map((p) => (
                <Link
                  key={p}
                  href={buildPageUrl(p)}
                  className={`w-11 h-11 flex items-center justify-center font-condensed text-[11px] tracking-[0.12em] border-x border-[#584528]/08 transition-all duration-200 ${
                    p === page
                      ? "bg-primary text-white"
                      : "text-[#584528]/50 hover:text-primary hover:bg-primary/[0.06]"
                  }`}
                >
                  {p}
                </Link>
              ))}
          </div>
          {page < totalPages ? (
            <Link
              href={buildPageUrl(page + 1)}
              className="flex items-center gap-2 px-5 py-3 border border-[#584528]/18 font-condensed text-[11px] tracking-[0.18em] uppercase text-[#584528]/55 hover:border-primary/40 hover:text-primary hover:bg-primary/[0.04] transition-all duration-200"
            >
              Următor <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <div className="flex items-center gap-2 px-5 py-3 border border-[#584528]/08 font-condensed text-[11px] tracking-[0.18em] uppercase text-[#584528]/20">
              Următor <ChevronRight className="h-3.5 w-3.5" />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ── Page ── */
export default async function MesteriPage(props: PageProps) {
  const categories = await getCategories()

  return (
    <>
      {/* ═══════════════════════════════════════════════
          HERO — starts behind navbar (-mt-[62px])
          identical technique to homepage HeroSearch
      ═══════════════════════════════════════════════ */}
      <section className="relative bg-[#0d0905] overflow-hidden -mt-[62px]" style={{ minHeight: 420 }}>

        {/* Background photo */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1662582632158-7f0f6e9a617b?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt=""
            fill
            priority
            className="object-cover object-center opacity-[0.18]"
          />
        </div>

        {/* Dark gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0905]/85 via-[#0d0905]/50 to-[#0d0905]/92" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0905]/75 via-transparent to-[#0d0905]/75" />

        {/* Corner vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 30%, rgba(13,9,5,0.78) 100%)",
          }}
        />

        {/* Gold grid lines — identical to hero */}
        <div
          className="absolute inset-0 opacity-[0.042]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(196,146,30,1) 1px, transparent 1px), linear-gradient(90deg, rgba(196,146,30,1) 1px, transparent 1px)",
            backgroundSize: "52px 52px",
            maskImage: "radial-gradient(ellipse 78% 80% at 50% 50%, black 20%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 78% 80% at 50% 50%, black 20%, transparent 100%)",
          }}
        />

        {/* Center gold glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 70% 60% at 50% 60%, rgba(196,146,30,0.07) 0%, transparent 70%)",
          }}
        />

        {/* Ghost "MEȘTERI" text */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
          aria-hidden="true"
        >
          <span
            className="font-display font-bold leading-none tracking-tighter whitespace-nowrap"
            style={{ fontSize: "clamp(72px, 20vw, 240px)", color: "rgba(255,255,255,0.024)" }}
          >
           .
          </span>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        {/* Content — padded to clear navbar (62px) + own padding */}
        <div className="container relative z-10 flex flex-col items-center text-center pt-[96px] pb-14">

          {/* Ornament */}
          <div className="flex items-center gap-5 mb-8">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/40" />
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-primary/60 rotate-45" />
              <div className="w-1 h-1 bg-primary/30 rotate-45" />
              <div className="w-1.5 h-1.5 bg-primary/60 rotate-45" />
            </div>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/40" />
          </div>

          {/* Overline */}
          <p className="font-condensed text-primary text-[10px] tracking-[0.32em] uppercase mb-4">
            Catalog verificat
          </p>

          {/* Heading */}
          <h1
            className="font-display text-white/92 leading-[1.06] tracking-tight"
            style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.2rem)", fontWeight: 600 }}
          >
            Meșteri de{" "}
            <em className="text-primary" style={{ fontStyle: "italic" }}>
              încredere
            </em>{" "}
            în Tulcea
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-white/35 font-condensed tracking-[0.22em] text-xs uppercase">
            Electricieni &nbsp;·&nbsp; Instalatori &nbsp;·&nbsp; Zidari &nbsp;·&nbsp; Zugravi &nbsp;·&nbsp; Tâmplari
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          STICKY FILTER BAR
      ═══════════════════════════════════════════════ */}
      <div className="sticky top-[62px] z-40 bg-[#0d0905]/96 backdrop-blur-xl border-b border-[#3d2e14]">
        <div className="container py-3">
          <Suspense fallback={null}>
            <MesterFilters categories={categories} />
          </Suspense>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          CARDS — white bg, no gray/parchment
      ═══════════════════════════════════════════════ */}
      <div className="bg-white min-h-[60vh]">
        <div className="container py-10">
          <Suspense fallback={<MesterGridSkeleton />}>
            <MesterGrid searchParams={props.searchParams} />
          </Suspense>
        </div>
      </div>
    </>
  )
}
