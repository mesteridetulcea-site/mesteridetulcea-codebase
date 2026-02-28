import { Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import { ro } from "date-fns/locale"
import type { ReviewWithUser } from "@/types/database"

interface ReviewsSectionProps {
  reviews: ReviewWithUser[]
  averageRating: number
  totalReviews: number
}

export function ReviewsSection({
  reviews,
  averageRating,
  totalReviews,
}: ReviewsSectionProps) {
  const getInitials = (name: string | null) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="flex items-center gap-4">
        <div className="text-center">
          <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
          <div className="flex items-center gap-1 mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.round(averageRating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted"
                }`}
              />
            ))}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            {totalReviews} recenzii
          </div>
        </div>
      </div>

      {/* Reviews list */}
      {reviews.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              Nu există recenzii pentru acest meșter încă.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src={review.profile?.avatar_url || undefined} />
                    <AvatarFallback>
                      {getInitials(review.profile?.full_name ?? null)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {review.profile?.full_name || "Utilizator"}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < review.rating
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-muted"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(review.created_at), {
                              addSuffix: true,
                              locale: ro,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    {review.body && (
                      <p className="mt-3 text-sm text-muted-foreground">
                        {review.body}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
