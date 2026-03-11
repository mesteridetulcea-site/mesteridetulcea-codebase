import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, MapPin, Clock, Star, Eye } from "lucide-react"
import { createClient, createAdminClient } from "@/lib/supabase/server"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SubscriptionBadge } from "@/components/mester/subscription-badge"
import { PhotoGallery } from "@/components/mester/photo-gallery"
import { ReviewsWithForm } from "@/components/mester/reviews-with-form"
import { WhatsAppButton } from "@/components/mester/whatsapp-button"
import { FavoriteButton } from "@/components/mester/favorite-button"
import { checkIsFavorited } from "@/actions/favorites"
import { getProjectsForMester } from "@/actions/projects"
import { ProjectsSection } from "@/components/mester/projects-section"
import type { SubscriptionTier, ReviewWithUser } from "@/types/database"

export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{ slug: string }>
}

interface MesterData {
  id: string
  user_id: string
  display_name: string
  bio: string | null
  years_experience: number | null
  subscription_tier: string
  approval_status: string
  is_featured: boolean
  avg_rating: number
  reviews_count: number
  views_count: number
  city: string
  neighborhood: string | null
  whatsapp_number: string | null
  created_at: string
  updated_at: string
  mester_categories: {
    category_id: string
    category: { id: string; name: string; slug: string } | null
  }[]
}

interface PhotoData {
  id: string
  mester_id: string
  storage_path: string
  public_url: string
  photo_type: "profile" | "work" | "certificate"
  caption: string | null
  approval_status: "pending" | "approved" | "rejected"
  sort_order: number
  created_at: string
}

async function getMester(id: string) {
  const regularClient = await createClient()

  const { data: { user } } = await regularClient.auth.getUser()
  let isAdmin = false
  if (user) {
    const { data: roleData } = await regularClient
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single() as { data: { role: string } | null }
    isAdmin = roleData?.role === "admin"
  }
  const currentUserId = user?.id ?? null

  const supabase = isAdmin ? await createAdminClient() : regularClient

  const baseQuery = supabase
    .from("mester_profiles")
    .select(`*, mester_categories(category_id, category:categories(id, name, slug))`)
    .eq("id", id)

  const { data: mester } = await (isAdmin
    ? baseQuery
    : baseQuery.eq("approval_status", "approved")
  ).single() as { data: MesterData | null }

  if (!mester) return null

  const { data: photos } = await supabase
    .from("mester_photos")
    .select("*")
    .eq("mester_id", mester.id)
    .eq("approval_status", "approved")
    .order("sort_order") as { data: PhotoData[] | null }

  const adminClient2 = await createAdminClient()
  const reviewsBase = supabase
    .from("reviews")
    .select("*")
    .eq("mester_id", mester.id)
    .order("created_at", { ascending: false })
    .limit(10)
  const { data: rawReviews } = await (isAdmin
    ? reviewsBase.neq("approval_status", "rejected")
    : reviewsBase.eq("approval_status", "approved")
  ) as { data: Omit<ReviewWithUser, "profile">[] | null }

  let reviews: ReviewWithUser[] = []
  if (rawReviews && rawReviews.length > 0) {
    const clientIds = [...new Set(rawReviews.map((r) => r.client_id))]
    const { data: profiles } = await adminClient2
      .from("profiles")
      .select("id, full_name, avatar_url")
      .in("id", clientIds) as { data: { id: string; full_name: string | null; avatar_url: string | null }[] | null }
    const profileMap = new Map(profiles?.map((p) => [p.id, p]) ?? [])
    reviews = rawReviews.map((review) => ({
      ...review,
      profile: profileMap.has(review.client_id)
        ? { full_name: profileMap.get(review.client_id)!.full_name, avatar_url: profileMap.get(review.client_id)!.avatar_url }
        : null,
    }))
  }

  if (!isAdmin) {
    await regularClient
      .from("mester_profiles")
      .update({ views_count: mester.views_count + 1 } as never)
      .eq("id", mester.id)
  }

  return { mester, photos: photos || [], reviews, isAdmin, isOwner: currentUserId === mester.user_id }
}

export async function generateMetadata({ params }: PageProps) {
  const { slug: id } = await params
  const supabase = await createClient()

  const { data: mester } = await supabase
    .from("mester_profiles")
    .select(`display_name, bio, mester_categories(category:categories(name))`)
    .eq("id", id)
    .single() as { data: { display_name: string; bio: string | null; mester_categories: { category: { name: string } | null }[] } | null }

  if (!mester) return { title: "Meșter negăsit" }

  const categoryName = mester.mester_categories?.[0]?.category?.name
  return {
    title: mester.display_name,
    description: mester.bio || `${mester.display_name} - ${categoryName || "Meșter"} în Tulcea`,
  }
}

const tabTriggerClass =
  "relative font-condensed text-[11px] tracking-[0.22em] uppercase pb-3 px-0 " +
  "bg-transparent border-0 rounded-none shadow-none " +
  "text-[#584528]/40 hover:text-[#584528]/70 " +
  "data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none " +
  "border-b-2 border-transparent -mb-px data-[state=active]:border-primary " +
  "transition-colors duration-200"

export default async function MesterProfilePage({ params }: PageProps) {
  const { slug: id } = await params
  const data = await getMester(id)
  if (!data) notFound()

  const { mester, photos, reviews, isAdmin, isOwner } = data
  const coverPhoto = photos.find((p) => p.photo_type === "profile") || photos[0]
  const primaryCategory = mester.mester_categories?.[0]?.category
  const [isFavorited, projects] = await Promise.all([
    checkIsFavorited(mester.id),
    getProjectsForMester(mester.id),
  ])

  const nameParts = mester.display_name.trim().split(/\s+/)
  const firstName = nameParts[0]
  const restName = nameParts.slice(1).join(" ")

  return (
    <>
      {/* ═══════════════════════════════════════════════
          HERO — dark identity band, pulled behind navbar
          Contains: back link, photo, name, meta, CTA
          Goal: user sees everything important above fold
      ═══════════════════════════════════════════════ */}
      <section className="relative bg-[#0d0905] -mt-[62px] overflow-hidden">

        {/* Subtle atmospheric texture — very low opacity */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=60&w=1400&auto=format&fit=crop"
            alt=""
            fill
            priority
            className="object-cover object-center opacity-[0.07]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0905]/95 via-[#0d0905]/80 to-[#0d0905]" />

        {/* Gold grid — same as /mesteri */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(196,146,30,1) 1px, transparent 1px), linear-gradient(90deg, rgba(196,146,30,1) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        <div className="container relative z-10">

          {/* ── Top nav strip ── */}
          <div className="pt-[82px] pb-7 flex items-center justify-between">
            <Link
              href="/mesteri"
              className="inline-flex items-center gap-2 text-white/28 hover:text-primary transition-colors duration-200"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="font-condensed text-[10px] tracking-[0.22em] uppercase">
                Înapoi la meșteri
              </span>
            </Link>
            <SubscriptionBadge tier={mester.subscription_tier as SubscriptionTier} />
          </div>

          {/* ── Profile identity row ── */}
          {/*
            Mobile:  photo centered on top, text + CTA below
            Desktop: photo left, info + CTA right — everything above fold
          */}
          <div className="flex flex-col sm:flex-row gap-6 lg:gap-10 pb-10 items-start">

            {/* Square profile photo */}
            <div className="flex-shrink-0 mx-auto sm:mx-0">
              <div className="relative w-40 h-40 lg:w-52 lg:h-52 border border-primary/25 bg-[#161009]">
                {/* Inner shadow for depth */}
                <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] z-10 pointer-events-none" />

                {coverPhoto ? (
                  <Image
                    src={coverPhoto.public_url}
                    alt={mester.display_name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                    <div
                      className="absolute inset-0 opacity-[0.05]"
                      style={{
                        backgroundImage:
                          "linear-gradient(rgba(196,146,30,1) 1px, transparent 1px), linear-gradient(90deg, rgba(196,146,30,1) 1px, transparent 1px)",
                        backgroundSize: "18px 18px",
                      }}
                    />
                    <span className="font-display text-5xl lg:text-6xl font-light text-primary/35 relative z-10">
                      {firstName[0]}
                    </span>
                    <span className="font-condensed text-[9px] tracking-[0.22em] uppercase text-primary/20 relative z-10">
                      {primaryCategory?.name || "Meșter"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Name, meta, CTA — all above the fold */}
            <div className="flex-1 text-center sm:text-left space-y-4">

              {/* Category overline */}
              <p className="font-condensed text-[11px] tracking-[0.30em] uppercase text-primary">
                {primaryCategory?.name || "Meșter"}
              </p>

              {/* Name */}
              <h1
                className="font-display text-white leading-[1.06] tracking-tight"
                style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)", fontWeight: 600 }}
              >
                {firstName}
                {restName && (
                  <>
                    {" "}
                    <em className="text-primary" style={{ fontStyle: "italic" }}>
                      {restName}
                    </em>
                  </>
                )}
              </h1>

              {/* Trust meta: rating · city · exp */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-2">
                {/* Stars */}
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.round(mester.avg_rating)
                          ? "fill-primary text-primary"
                          : "fill-transparent text-primary/25"
                      }`}
                    />
                  ))}
                  <span className="font-condensed text-sm tracking-[0.1em] text-white/80 ml-1">
                    {mester.avg_rating.toFixed(1)}
                  </span>
                  <span className="font-condensed text-sm text-white/45">
                    ({mester.reviews_count} recenzii)
                  </span>
                </div>

                <span className="text-white/20 hidden sm:block">·</span>

                <div className="flex items-center gap-1.5 font-condensed text-sm tracking-[0.08em] text-white/60">
                  <MapPin className="h-3.5 w-3.5 text-white/40 shrink-0" />
                  {mester.neighborhood ? `${mester.neighborhood}, ${mester.city}` : mester.city}
                </div>

                {mester.years_experience && (
                  <>
                    <span className="text-white/20 hidden sm:block">·</span>
                    <div className="flex items-center gap-1.5 font-condensed text-sm tracking-[0.08em] text-white/60">
                      <Clock className="h-3.5 w-3.5 text-white/40 shrink-0" />
                      {mester.years_experience} ani experiență
                    </div>
                  </>
                )}

                <span className="text-white/20 hidden sm:block">·</span>

                <div className="flex items-center gap-1.5 font-condensed text-sm tracking-[0.08em] text-white/40">
                  <Eye className="h-3.5 w-3.5 text-white/30 shrink-0" />
                  {mester.views_count} vizualizări
                </div>
              </div>

              {/* Primary CTAs — visible above fold, no scroll needed */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <div className="sm:w-64">
                  <WhatsAppButton
                    whatsappNumber={mester.whatsapp_number}
                    mesterName={mester.display_name}
                  />
                </div>
                <div className="sm:w-auto">
                  <FavoriteButton mesterId={mester.id} initialFavorited={isFavorited} />
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CONTENT — white background
          Left: bio + tabs    Right: stats sidebar
      ═══════════════════════════════════════════════ */}
      <div className="bg-white">
        <div className="container py-12">
          <div className="grid lg:grid-cols-3 gap-12">

            {/* ── Left: Bio + Tabs ── */}
            <div className="lg:col-span-2 space-y-10">

              {mester.bio && (
                <div>
                  <p className="font-condensed text-[11px] tracking-[0.28em] uppercase text-primary mb-3">
                    Despre
                  </p>
                  <p className="text-[#3d2e14]/75 leading-relaxed text-base">
                    {mester.bio}
                  </p>
                </div>
              )}

              <div className="w-full h-px bg-[#584528]/14" />

              {/* Tabs */}
              <Tabs
                defaultValue={projects.length > 0 ? "proiecte" : "photos"}
                className="w-full"
              >
                <TabsList className="flex gap-8 bg-transparent p-0 border-b border-[#584528]/14 rounded-none h-auto justify-start">
                  <TabsTrigger value="proiecte" className={tabTriggerClass}>
                    Proiecte&nbsp;<span className="opacity-40">({projects.length})</span>
                  </TabsTrigger>
                  <TabsTrigger value="photos" className={tabTriggerClass}>
                    Fotografii&nbsp;<span className="opacity-40">({photos.length})</span>
                  </TabsTrigger>
                  <TabsTrigger value="reviews" className={tabTriggerClass}>
                    Recenzii&nbsp;<span className="opacity-40">({mester.reviews_count})</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="proiecte" className="mt-8">
                  <ProjectsSection projects={projects} mesterId={mester.id} isOwner={isOwner} />
                </TabsContent>
                <TabsContent value="photos" className="mt-8">
                  <PhotoGallery photos={photos} />
                </TabsContent>
                <TabsContent value="reviews" className="mt-8">
                  <ReviewsWithForm
                    mesterId={mester.id}
                    reviews={reviews}
                    averageRating={mester.avg_rating}
                    totalReviews={mester.reviews_count}
                    isAdmin={isAdmin}
                  />
                </TabsContent>
              </Tabs>
            </div>

            {/* ── Right: Info sidebar ── */}
            <div>
              <div className="sticky top-24 space-y-4">

                {/* Stats card — parchment, blends with white page */}
                <div className="bg-[#f5eed8] border border-[#584528]/14 p-5">
                  <p className="font-condensed text-[10px] tracking-[0.28em] uppercase text-primary mb-4">
                    Statistici
                  </p>

                  {/* Gap-grid stats */}
                  <div className="grid grid-cols-2 gap-px bg-[#584528]/12">
                    <div className="bg-[#f5eed8] p-4 text-center">
                      <p className="font-display text-2xl text-[#3d2e14] font-light leading-none">
                        {mester.avg_rating.toFixed(1)}
                      </p>
                      <div className="flex justify-center gap-0.5 mt-1.5 mb-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-2.5 w-2.5 ${
                              i < Math.round(mester.avg_rating)
                                ? "fill-primary text-primary"
                                : "fill-transparent text-primary/25"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="font-condensed text-[9px] tracking-[0.18em] uppercase text-[#584528]/50">
                        Rating
                      </p>
                    </div>

                    <div className="bg-[#f5eed8] p-4 text-center">
                      <p className="font-display text-2xl text-[#3d2e14] font-light leading-none">
                        {mester.reviews_count}
                      </p>
                      <p className="font-condensed text-[9px] tracking-[0.18em] uppercase text-[#584528]/50 mt-2">
                        Recenzii
                      </p>
                    </div>

                    <div className="bg-[#f5eed8] p-4 text-center">
                      <p className="font-display text-2xl text-[#3d2e14] font-light leading-none">
                        {mester.views_count}
                      </p>
                      <p className="font-condensed text-[9px] tracking-[0.18em] uppercase text-[#584528]/50 mt-2">
                        Vizualizări
                      </p>
                    </div>

                    <div className="bg-[#f5eed8] p-4 text-center">
                      <p className="font-display text-2xl text-[#3d2e14] font-light leading-none">
                        {mester.years_experience ?? "—"}
                      </p>
                      <p className="font-condensed text-[9px] tracking-[0.18em] uppercase text-[#584528]/50 mt-2">
                        Ani exp.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Location card */}
                {(mester.neighborhood || mester.city) && (
                  <div className="bg-[#f5eed8] border border-[#584528]/14 p-5">
                    <p className="font-condensed text-[10px] tracking-[0.28em] uppercase text-primary mb-3">
                      Locație
                    </p>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-primary/40 mt-0.5 shrink-0" />
                      <span className="font-condensed text-sm tracking-[0.08em] text-[#3d2e14]/65 leading-relaxed">
                        {mester.neighborhood ? `${mester.neighborhood}, ` : ""}
                        {mester.city}
                      </span>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}
