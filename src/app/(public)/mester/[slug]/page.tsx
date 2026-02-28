import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, MapPin, Clock, Star, Eye } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { SubscriptionBadge } from "@/components/mester/subscription-badge"
import { PhotoGallery } from "@/components/mester/photo-gallery"
import { ReviewsWithForm } from "@/components/mester/reviews-with-form"
import { WhatsAppButton } from "@/components/mester/whatsapp-button"
import { FavoriteButton } from "@/components/mester/favorite-button"
import { checkIsFavorited } from "@/actions/favorites"
import type { SubscriptionTier, ReviewWithUser } from "@/types/database"

// The route param is named "slug" but contains the mester id
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
  profile: { id: string; full_name: string | null; avatar_url: string | null } | null
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

interface ReviewData {
  id: string
  mester_id: string
  client_id: string
  rating: number
  body: string | null
  created_at: string
  updated_at: string
  profile: { full_name: string | null; avatar_url: string | null } | null
}

async function getMester(id: string) {
  const supabase = await createClient()

  const { data: mester } = await supabase
    .from("mester_profiles")
    .select(
      `
      *,
      mester_categories(category_id, category:categories(id, name, slug)),
      profile:profiles(id, full_name, avatar_url)
    `
    )
    .eq("id", id)
    .eq("approval_status", "approved")
    .single() as { data: MesterData | null }

  if (!mester) return null

  // Get photos
  const { data: photos } = await supabase
    .from("mester_photos")
    .select("*")
    .eq("mester_id", mester.id)
    .eq("approval_status", "approved")
    .order("sort_order") as { data: PhotoData[] | null }

  // Get reviews with user info
  const { data: reviews } = await supabase
    .from("reviews")
    .select(
      `
      *,
      profile:profiles(full_name, avatar_url)
    `
    )
    .eq("mester_id", mester.id)
    .order("created_at", { ascending: false })
    .limit(10) as { data: ReviewWithUser[] | null }

  // Increment view count
  await supabase
    .from("mester_profiles")
    .update({ views_count: mester.views_count + 1 } as never)
    .eq("id", mester.id)

  return {
    mester,
    photos: photos || [],
    reviews: reviews || [],
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { slug: id } = await params
  const supabase = await createClient()

  const { data: mester } = await supabase
    .from("mester_profiles")
    .select(`
      display_name, bio,
      mester_categories(category:categories(name))
    `)
    .eq("id", id)
    .single() as { data: { display_name: string; bio: string | null; mester_categories: { category: { name: string } | null }[] } | null }

  if (!mester) {
    return { title: "Meșter negăsit" }
  }

  const categoryName = mester.mester_categories?.[0]?.category?.name

  return {
    title: mester.display_name,
    description:
      mester.bio ||
      `${mester.display_name} - ${categoryName || "Meșter"} în Tulcea`,
  }
}

export default async function MesterProfilePage({ params }: PageProps) {
  const { slug: id } = await params
  const data = await getMester(id)

  if (!data) {
    notFound()
  }

  const { mester, photos, reviews } = data
  const coverPhoto = photos.find((p) => p.photo_type === "profile") || photos[0]
  const primaryCategory = mester.mester_categories?.[0]?.category
  const isFavorited = await checkIsFavorited(mester.id)

  return (
    <>
      <div className="bg-[#0f0b04] border-b border-[#584528] py-4">
        <div className="container">
          <Link
            href="/mesteri"
            className="inline-flex items-center text-white/55 hover:text-primary transition-colors text-sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Înapoi la meșteri
          </Link>
        </div>
      </div>

      <div className="container py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Hero section */}
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-xl overflow-hidden flex-shrink-0">
              {coverPhoto ? (
                <Image
                  src={coverPhoto.public_url}
                  alt={mester.display_name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <span className="text-4xl font-bold text-primary/30">
                    {mester.display_name[0]}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold">
                    {mester.display_name}
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    {primaryCategory?.name || "Servicii diverse"}
                  </p>
                </div>
                <SubscriptionBadge
                  tier={mester.subscription_tier as SubscriptionTier}
                />
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-medium">
                    {mester.avg_rating.toFixed(1)}
                  </span>
                  <span className="text-muted-foreground">
                    ({mester.reviews_count} recenzii)
                  </span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {mester.city}
                </div>
                {mester.years_experience && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {mester.years_experience} ani experiență
                  </div>
                )}
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  {mester.views_count} vizualizări
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {mester.bio && (
            <Card>
              <CardHeader>
                <CardTitle>Despre</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-line">
                  {mester.bio}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Tabs */}
          <Tabs defaultValue="photos" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="photos">
                Fotografii ({photos.length})
              </TabsTrigger>
              <TabsTrigger value="reviews">
                Recenzii ({mester.reviews_count})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="photos" className="mt-6">
              <PhotoGallery photos={photos} />
            </TabsContent>
            <TabsContent value="reviews" className="mt-6">
              <ReviewsWithForm
                mesterId={mester.id}
                reviews={reviews}
                averageRating={mester.avg_rating}
                totalReviews={mester.reviews_count}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="sticky top-24">
            <CardContent className="pt-6 space-y-4">
              <WhatsAppButton
                whatsappNumber={mester.whatsapp_number}
                mesterName={mester.display_name}
              />
              <FavoriteButton mesterId={mester.id} initialFavorited={isFavorited} />
              <Separator />
              <div className="text-sm text-muted-foreground space-y-2">
                {mester.neighborhood && (
                  <p className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    {mester.neighborhood}, {mester.city}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </>
  )
}
