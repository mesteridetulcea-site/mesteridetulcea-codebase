import { Badge } from "@/components/ui/badge"
import type { SubscriptionTier } from "@/types/database"

interface SubscriptionBadgeProps {
  tier: SubscriptionTier
  className?: string
}

export function SubscriptionBadge({ tier, className }: SubscriptionBadgeProps) {
  if (tier !== "premium") return null

  return (
    <Badge variant="premium" className={className}>
      Premium
    </Badge>
  )
}
