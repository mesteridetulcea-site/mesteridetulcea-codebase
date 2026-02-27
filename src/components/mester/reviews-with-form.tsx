"use client"

import { useState, useEffect } from "react"
import { useUser } from "@/lib/hooks/use-user"
import { ReviewForm } from "./review-form"
import { ReviewsSection } from "./reviews-section"
import { getUserReviewForMester } from "@/actions/reviews"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MessageSquarePlus, Loader2 } from "lucide-react"
import Link from "next/link"
import type { Review, ReviewWithUser } from "@/types/database"

interface ReviewsWithFormProps {
  mesterId: string
  reviews: ReviewWithUser[]
  averageRating: number
  totalReviews: number
}

export function ReviewsWithForm({
  mesterId,
  reviews,
  averageRating,
  totalReviews,
}: ReviewsWithFormProps) {
  const { user, loading: userLoading } = useUser()
  const [showForm, setShowForm] = useState(false)
  const [existingReview, setExistingReview] = useState<Review | null>(null)
  const [checkingReview, setCheckingReview] = useState(true)

  useEffect(() => {
    async function checkExistingReview() {
      if (!user) {
        setCheckingReview(false)
        return
      }

      const result = await getUserReviewForMester(mesterId)
      setExistingReview(result.review)
      setCheckingReview(false)
    }

    if (!userLoading) {
      checkExistingReview()
    }
  }, [user, userLoading, mesterId])

  function handleReviewSuccess() {
    setShowForm(false)
    // Refresh the page to show updated reviews
    window.location.reload()
  }

  const canReview = user && !existingReview

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Recenzii</h2>
        {!userLoading && !checkingReview && (
          <>
            {!user && (
              <Link href="/login">
                <Button variant="outline" size="sm">
                  <MessageSquarePlus className="h-4 w-4 mr-2" />
                  Lasă o recenzie
                </Button>
              </Link>
            )}
            {canReview && !showForm && (
              <Button variant="outline" size="sm" onClick={() => setShowForm(true)}>
                <MessageSquarePlus className="h-4 w-4 mr-2" />
                Lasă o recenzie
              </Button>
            )}
            {existingReview && !showForm && (
              <Button variant="outline" size="sm" onClick={() => setShowForm(true)}>
                Modifică recenzia
              </Button>
            )}
          </>
        )}
      </div>

      {/* Review Form */}
      {showForm && user && (
        <div className="mb-6">
          <ReviewForm
            mesterId={mesterId}
            existingReview={existingReview}
            onSuccess={handleReviewSuccess}
          />
          <Button
            variant="ghost"
            size="sm"
            className="mt-2"
            onClick={() => setShowForm(false)}
          >
            Anulează
          </Button>
        </div>
      )}

      {/* Loading state */}
      {(userLoading || checkingReview) && (
        <Card>
          <CardContent className="py-8 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      )}

      {/* Reviews Section */}
      {!userLoading && !checkingReview && (
        <ReviewsSection
          reviews={reviews}
          averageRating={averageRating}
          totalReviews={totalReviews}
        />
      )}
    </div>
  )
}
