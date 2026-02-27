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
import { ReviewsSection } from "@/components/mester/reviews-section"
import { WhatsAppButton } from "@/components/mester/whatsapp-button"
import { FavoriteButton } from "@/components/mester/favorite-button"
import { checkIsFavorited } from "@/actions/favorites"
import type { SubscriptionTier } from "@/types/database"

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getMester(slug: string) {
  const supabase = await createClient()

  const { data: mester } = await supabase
    .from("mesters")
    .select(
      `
      *,
      category:categories(*),
      profile:profiles(*)
    `
    )
    .eq("slug", slug)
    .eq("approval_status", "approved")
    .single()

  if (!mester) return null

  // Get photos
  const { data: photos } = await supabase
    .from("mester_photos")
    .select("*")
    .eq("mester_id", mester.id)
    .eq("approval_status", "approved")
    .order("order_index")

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
    .limit(10)

  // Increment view count
  await supabase
    .from("mesters")
    .update({ total_views: mester.total_views + 1 })
    .eq("id", mester.id)

  return {
    mester,
    photos: photos || [],
    reviews: reviews || [],
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: mester } = await supabase
    .from("mesters")
    .select("business_name, description, category:categories(name)")
    .eq("slug", slug)
    .single()

  if (!mester) {
    return { title: "Meșter negăsit" }
  }

  return {
    title: mester.business_name,
    description:
      mester.description ||
      `${mester.business_name} - ${mester.category?.name || "Meșter"} în Tulcea`,
  }
}

export default async function MesterProfilePage({ params }: PageProps) {
  const { slug } = await params
  const data = await getMester(slug)

  if (!data) {
    notFound()
  }

  const { mester, photos, reviews } = data
  const coverPhoto = photos.find((p) => p.is_cover) || photos[0]
  const isFavorited = await checkIsFavorited(mester.id)

  return (
    <div className="container py-8">
      {/* Back button */}
      <Link href="/mesteri">
        <Button variant="ghost" className="mb-6 -ml-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Înapoi la listă
        </Button>
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Hero section */}
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-xl overflow-hidden flex-shrink-0">
              {coverPhoto ? (
                <Image
                  src={coverPhoto.url}
                  alt={mester.business_name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <span className="text-4xl font-bold text-primary/30">
                    {mester.business_name[0]}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold">
                    {mester.business_name}
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    {mester.category?.name || "Servicii diverse"}
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
                    {mester.average_rating.toFixed(1)}
                  </span>
                  <span className="text-muted-foreground">
                    ({mester.total_reviews} recenzii)
                  </span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {mester.city}
                </div>
                {mester.experience_years && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {mester.experience_years} ani experiență
                  </div>
                )}
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  {mester.total_views} vizualizări
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {mester.description && (
            <Card>
              <CardHeader>
                <CardTitle>Despre</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-line">
                  {mester.description}
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
                Recenzii ({mester.total_reviews})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="photos" className="mt-6">
              <PhotoGallery photos={photos} />
            </TabsContent>
            <TabsContent value="reviews" className="mt-6">
              <ReviewsSection
                reviews={reviews}
                averageRating={mester.average_rating}
                totalReviews={mester.total_reviews}
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
                mesterName={mester.business_name}
              />
              <FavoriteButton mesterId={mester.id} initialFavorited={isFavorited} />
              <Separator />
              <div className="text-sm text-muted-foreground space-y-2">
                {mester.address && (
                  <p className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    {mester.address}, {mester.city}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
