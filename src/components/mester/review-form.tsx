"use client"

import { useState } from "react"
import { Star, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createReview, updateReview } from "@/actions/reviews"
import { toast } from "@/lib/hooks/use-toast"
import type { Review } from "@/types/database"

interface ReviewFormProps {
  mesterId: string
  existingReview?: Review | null
  onSuccess?: () => void
}

export function ReviewForm({ mesterId, existingReview, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(existingReview?.rating || 0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (rating === 0) {
      toast({
        title: "Eroare",
        description: "Te rugăm să selectezi un rating",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    const formData = new FormData(e.currentTarget)
    formData.set("rating", rating.toString())

    let result
    if (existingReview) {
      result = await updateReview(existingReview.id, formData)
    } else {
      result = await createReview(mesterId, formData)
    }

    if (result.error) {
      toast({
        title: "Eroare",
        description: result.error,
        variant: "destructive",
      })
    } else {
      toast({
        title: existingReview ? "Recenzie actualizată!" : "Recenzie adăugată!",
        description: "Mulțumim pentru feedback-ul tău.",
      })
      onSuccess?.()
    }

    setLoading(false)
  }

  const displayRating = hoveredRating || rating

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {existingReview ? "Modifică recenzia" : "Lasă o recenzie"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star Rating */}
          <div className="space-y-2">
            <Label>Rating *</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-1 hover:scale-110 transition-transform"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={`h-8 w-8 transition-colors ${
                      star <= displayRating
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>
            {displayRating > 0 && (
              <p className="text-sm text-muted-foreground">
                {displayRating === 1 && "Slab"}
                {displayRating === 2 && "Acceptabil"}
                {displayRating === 3 && "Bun"}
                {displayRating === 4 && "Foarte bun"}
                {displayRating === 5 && "Excelent"}
              </p>
            )}
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment">Comentariu (opțional)</Label>
            <Textarea
              id="comment"
              name="comment"
              placeholder="Spune-ne mai multe despre experiența ta..."
              defaultValue={existingReview?.comment || ""}
              rows={4}
            />
          </div>

          <Button type="submit" disabled={loading || rating === 0}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Se salvează...
              </>
            ) : existingReview ? (
              "Actualizează recenzia"
            ) : (
              "Trimite recenzia"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
