import { Badge } from "@/components/ui/badge"
import type { SubscriptionTier } from "@/types/database"
import { SUBSCRIPTION_TIERS } from "@/lib/constants"

interface SubscriptionBadgeProps {
  tier: SubscriptionTier
  className?: string
}

export function SubscriptionBadge({ tier, className }: SubscriptionBadgeProps) {
  const config = SUBSCRIPTION_TIERS[tier]

  return (
    <Badge variant={tier} className={className}>
      {config.label}
    </Badge>
  )
}
