"use client"

import { useState } from "react"
import { Star, Trash2, Loader2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { formatDistanceToNow } from "date-fns"
import { ro } from "date-fns/locale"
import { adminRejectReview } from "@/actions/admin"
import { deleteReview } from "@/actions/reviews"
import { toast } from "@/lib/hooks/use-toast"
import { useUser } from "@/lib/hooks/use-user"
import type { ReviewWithUser } from "@/types/database"

interface ReviewsSectionProps {
  reviews: ReviewWithUser[]
  averageRating: number
  totalReviews: number
  isAdmin?: boolean
  onReviewRejected?: () => void
  onReviewDeleted?: () => void
}

export function ReviewsSection({
  reviews,
  averageRating,
  totalReviews,
  isAdmin = false,
  onReviewRejected,
  onReviewDeleted,
}: ReviewsSectionProps) {
  const { user } = useUser()
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [confirmRejectId, setConfirmRejectId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const getInitials = (name: string | null) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  async function handleRejectConfirm() {
    if (!confirmRejectId) return
    setRejectingId(confirmRejectId)
    setConfirmRejectId(null)
    const result = await adminRejectReview(confirmRejectId)
    setRejectingId(null)
    if (result.error) {
      toast({ title: "Eroare", description: result.error, variant: "destructive" })
    } else {
      toast({ title: "Recenzie eliminată" })
      onReviewRejected?.()
    }
  }

  async function handleDeleteConfirm() {
    if (!confirmDeleteId) return
    setDeletingId(confirmDeleteId)
    setConfirmDeleteId(null)
    const result = await deleteReview(confirmDeleteId)
    setDeletingId(null)
    if (result.error) {
      toast({ title: "Eroare", description: result.error, variant: "destructive" })
    } else {
      toast({ title: "Recenzie ștearsă" })
      onReviewDeleted?.()
    }
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
          {reviews.map((review) => {
            const isOwnReview = !isAdmin && !!user && user.id === review.client_id
            const actionId = rejectingId === review.id || deletingId === review.id

            return (
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
                      <div className="flex items-start justify-between gap-2">
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

                        {/* Admin reject button */}
                        {isAdmin && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
                            onClick={() => setConfirmRejectId(review.id)}
                            disabled={!!actionId}
                          >
                            {rejectingId === review.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        )}

                        {/* Owner delete button */}
                        {isOwnReview && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
                            onClick={() => setConfirmDeleteId(review.id)}
                            disabled={!!actionId}
                          >
                            {deletingId === review.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </div>

                      {review.title && (
                        <p className="mt-3 text-sm font-medium">{review.title}</p>
                      )}
                      {review.body && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {review.body}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Admin: confirm reject dialog */}
      <Dialog open={!!confirmRejectId} onOpenChange={(open) => !open && setConfirmRejectId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Elimină recenzia</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-2">
            Ești sigur că vrei să elimini această recenzie? Statusul va fi schimbat în
            &quot;respins&quot; și nu va mai fi vizibil public.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmRejectId(null)}>
              Anulează
            </Button>
            <Button variant="destructive" onClick={handleRejectConfirm}>
              Elimină
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User: confirm delete dialog */}
      <Dialog open={!!confirmDeleteId} onOpenChange={(open) => !open && setConfirmDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Șterge recenzia</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-2">
            Ești sigur că vrei să ștergi recenzia ta? Odată ștearsă, poți lăsa o nouă recenzie.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteId(null)}>
              Anulează
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Șterge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
