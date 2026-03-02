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
import type { ReviewWithUser } from "@/types/database"

interface ReviewsWithFormProps {
  mesterId: string
  reviews: ReviewWithUser[]
  averageRating: number
  totalReviews: number
  isAdmin?: boolean
}

export function ReviewsWithForm({
  mesterId,
  reviews,
  averageRating,
  totalReviews,
  isAdmin = false,
}: ReviewsWithFormProps) {
  const { user, loading: userLoading } = useUser()
  const [showForm, setShowForm] = useState(false)
  const [hasExistingReview, setHasExistingReview] = useState(false)
  const [checkingReview, setCheckingReview] = useState(true)

  useEffect(() => {
    async function checkExistingReview() {
      if (!user) {
        setCheckingReview(false)
        return
      }

      const result = await getUserReviewForMester(mesterId)
      setHasExistingReview(!!result.review)
      setCheckingReview(false)
    }

    if (!userLoading) {
      checkExistingReview()
    }
  }, [user, userLoading, mesterId])

  function handleReviewSuccess() {
    setShowForm(false)
    window.location.reload()
  }

  const canReview = user && !hasExistingReview

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
          </>
        )}
      </div>

      {/* Review Form */}
      {showForm && user && (
        <div className="mb-6">
          <ReviewForm
            mesterId={mesterId}
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
          isAdmin={isAdmin}
          onReviewRejected={() => window.location.reload()}
          onReviewDeleted={() => window.location.reload()}
        />
      )}
    </div>
  )
}
