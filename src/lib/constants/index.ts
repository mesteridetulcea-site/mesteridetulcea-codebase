import type { SubscriptionTier } from "@/types/database"

export const SUBSCRIPTION_TIERS: Record<
  SubscriptionTier,
  {
    label: string
    color: string
    bgColor: string
    borderColor: string
    order: number
  }
> = {
  ucenic: {
    label: "Ucenic",
    color: "text-gray-700",
    bgColor: "bg-gray-100",
    borderColor: "border-gray-300",
    order: 1,
  },
  mester: {
    label: "Mester",
    color: "text-blue-700",
    bgColor: "bg-blue-100",
    borderColor: "border-blue-300",
    order: 2,
  },
  master: {
    label: "Master",
    color: "text-amber-700",
    bgColor: "bg-amber-100",
    borderColor: "border-amber-300",
    order: 3,
  },
  premium: {
    label: "Premium",
    color: "text-purple-700",
    bgColor: "bg-purple-100",
    borderColor: "border-purple-300",
    order: 4,
  },
}

export const APPROVAL_STATUS_LABELS = {
  pending: "În așteptare",
  approved: "Aprobat",
  rejected: "Respins",
}

export const USER_ROLE_LABELS = {
  client: "Client",
  mester: "Meșter",
  admin: "Administrator",
}

export const APP_NAME = "Meșteri de Tulcea"
export const APP_DESCRIPTION =
  "Găsește meșteri de încredere în Tulcea pentru orice lucrare ai nevoie"

export const DEFAULT_CITY = "Tulcea"

export const ITEMS_PER_PAGE = 12
