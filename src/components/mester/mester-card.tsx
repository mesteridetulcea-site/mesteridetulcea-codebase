import Link from "next/link"
import Image from "next/image"
import { Star, MapPin, ArrowUpRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
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
    <div className="overflow-hidden group bg-white border border-[#584528]/12 hover:border-primary/40 hover:shadow-xl transition-all duration-300">
      {/* Image area */}
      <Link href={`/mester/${mester.slug}`}>
        <div className="relative aspect-[4/3] bg-[#f5eed8] overflow-hidden">
          {coverPhoto ? (
            <>
              <Image
                src={coverPhoto}
                alt={mester.business_name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Bottom gradient for legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 relative">
              {/* Decorative background pattern */}
              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(196,146,30,1) 1px, transparent 1px), linear-gradient(90deg, rgba(196,146,30,1) 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />
              <span className="font-display text-6xl font-light text-primary/25 relative z-10">
                {mester.business_name.charAt(0)}
              </span>
              <span className="font-condensed text-xs tracking-[0.2em] uppercase text-primary/20 relative z-10">
                {mester.category?.name || "Meșter"}
              </span>
            </div>
          )}

          {/* Tier badge */}
          <Badge
            variant={mester.subscription_tier as SubscriptionTier}
            className="absolute top-3 left-3 rounded-none text-xs"
          >
            {tierConfig.label}
          </Badge>

          {/* Visit icon overlay on hover */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="w-7 h-7 bg-primary/90 flex items-center justify-center">
              <ArrowUpRight className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-5">
        <Link href={`/mester/${mester.slug}`}>
          <h3 className="font-display text-lg font-medium hover:text-primary transition-colors duration-200 line-clamp-1 leading-snug">
            {mester.business_name}
          </h3>
        </Link>
        <p className="font-condensed text-xs tracking-[0.14em] uppercase text-muted-foreground mt-0.5">
          {mester.category?.name || "Servicii diverse"}
        </p>

        {/* Meta row */}
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1.5">
            <Star className="h-3.5 w-3.5 fill-primary text-primary shrink-0" />
            <span className="text-sm font-medium">
              {mester.average_rating.toFixed(1)}
            </span>
            <span className="text-xs text-muted-foreground">
              ({mester.total_reviews})
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground font-condensed tracking-wide">
            <MapPin className="h-3 w-3 shrink-0" />
            {mester.city}
          </div>
        </div>

        {mester.description && (
          <p className="text-sm text-muted-foreground mt-3 line-clamp-2 leading-relaxed">
            {mester.description}
          </p>
        )}
      </div>

      {/* Footer CTA */}
      <div className="px-5 pb-5">
        <Link href={`/mester/${mester.slug}`} className="w-full">
          <div className="w-full border border-[#584528]/18 group-hover:border-primary/40 group-hover:bg-primary/5 flex items-center justify-center gap-2 py-2.5 transition-all duration-200">
            <span className="font-condensed tracking-[0.14em] uppercase text-xs text-foreground/55 group-hover:text-primary transition-colors duration-200">
              Vezi profilul
            </span>
            <ArrowUpRight className="h-3.5 w-3.5 text-foreground/30 group-hover:text-primary transition-colors duration-200" />
          </div>
        </Link>
      </div>
    </div>
  )
}
