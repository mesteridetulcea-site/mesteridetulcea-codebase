"use client"

import { useState, useEffect } from "react"
import { Loader2, Check, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { approveCererePhoto, rejectCererePhoto } from "@/actions/admin"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/lib/hooks/use-toast"

interface CererePhotoWithCerere {
  id: string
  url: string
  created_at: string
  cerere: {
    title: string | null
    original_message: string
  } | null
}

export default function AdminCererePhotosPage() {
  const [photos, setPhotos] = useState<CererePhotoWithCerere[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    loadPhotos()
  }, [])

  async function loadPhotos() {
    const supabase = createClient()
    const { data } = await supabase
      .from("cerere_photos")
      .select(`
        id, url, created_at,
        cerere:service_requests(title, original_message)
      `)
      .eq("approval_status", "pending")
      .order("created_at", { ascending: false })

    setPhotos((data as CererePhotoWithCerere[]) || [])
    setLoading(false)
  }

  async function handleApprove(photoId: string) {
    setActionLoading(photoId)
    const result = await approveCererePhoto(photoId)
    if (result.error) {
      toast({ title: "Eroare", description: result.error, variant: "destructive" })
    } else {
      toast({ title: "Fotografie aprobată!" })
      loadPhotos()
    }
    setActionLoading(null)
  }

  async function handleReject(photoId: string) {
    setActionLoading(photoId)
    const result = await rejectCererePhoto(photoId)
    if (result.error) {
      toast({ title: "Eroare", description: result.error, variant: "destructive" })
    } else {
      toast({ title: "Fotografie respinsă" })
      loadPhotos()
    }
    setActionLoading(null)
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Fotografii Cereri</h1>
        <p className="text-muted-foreground">
          {photos.length} fotografii în așteptare
        </p>
      </div>

      {photos.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Nu există fotografii în așteptare
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {photos.map((photo) => {
            const isLoading = actionLoading === photo.id
            const title = photo.cerere?.title || photo.cerere?.original_message?.slice(0, 40) || "Cerere"

            return (
              <Card key={photo.id} className="overflow-hidden">
                <div className="relative aspect-[4/3] bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.url}
                    alt="Fotografie cerere"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <p className="font-medium text-sm truncate">{title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(photo.created_at).toLocaleDateString("ro-RO")}
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => handleApprove(photo.id)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          Aprobă
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex-1"
                      onClick={() => handleReject(photo.id)}
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Respinge
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
