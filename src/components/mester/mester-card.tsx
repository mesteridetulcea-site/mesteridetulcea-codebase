import Link from "next/link"
import Image from "next/image"
import { Star, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { MesterWithCategory } from "@/types/database"
import type { SubscriptionTier } from "@/types/database"
import { SUBSCRIPTION_TIERS } from "@/lib/constants"

interface MesterCardProps {
  mester: MesterWithCategory
  coverPhoto?: string | null
}

export function MesterCard({ mester, coverPhoto }: MesterCardProps) {
  const tierConfig = SUBSCRIPTION_TIERS[mester.subscription_tier as SubscriptionTier]

  return (
    <div className="overflow-hidden group border border-[#584528]/20 hover:border-primary/50 hover:shadow-md transition-all bg-white">
      <Link href={`/mester/${mester.slug}`}>
        <div className="relative aspect-[4/3] bg-muted">
          {coverPhoto ? (
            <Image
              src={coverPhoto}
              alt={mester.business_name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
              <span className="text-4xl font-bold text-primary/30">
                {mester.business_name[0]}
              </span>
            </div>
          )}
          <Badge
            variant={mester.subscription_tier as SubscriptionTier}
            className="absolute top-3 right-3"
          >
            {tierConfig.label}
          </Badge>
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/mester/${mester.slug}`}>
          <h3 className="font-semibold text-lg hover:text-primary transition-colors line-clamp-1 tracking-wide">
            {mester.business_name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground mt-1 italic">
          {mester.category?.name || "Servicii diverse"}
        </p>

        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="text-sm font-medium">
              {mester.average_rating.toFixed(1)}
            </span>
            <span className="text-sm text-muted-foreground">
              ({mester.total_reviews})
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {mester.city}
          </div>
        </div>

        {mester.description && (
          <p className="text-sm text-muted-foreground mt-3 line-clamp-2 italic">
            {mester.description}
          </p>
        )}
      </div>

      <div className="p-4 pt-0">
        <Link href={`/mester/${mester.slug}`} className="w-full">
          <Button
            variant="outline"
            className="w-full border-[#584528]/35 hover:bg-primary hover:text-white hover:border-primary tracking-widest uppercase text-xs"
          >
            Vezi profilul
          </Button>
        </Link>
      </div>
    </div>
  )
}
