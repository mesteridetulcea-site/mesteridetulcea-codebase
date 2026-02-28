"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Loader2, Upload, Trash2, Star, Clock, CheckCircle } from "lucide-react"
import { getMesterPhotos, uploadPhoto, deletePhoto, setPhotoCover } from "@/actions/photos"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/lib/hooks/use-toast"
import type { MesterPhoto } from "@/types/database"

const approvalConfig = {
  pending: {
    label: "În așteptare",
    icon: Clock,
    className: "bg-amber-100 text-amber-800",
  },
  approved: {
    label: "Aprobată",
    icon: CheckCircle,
    className: "bg-green-100 text-green-800",
  },
  rejected: {
    label: "Respinsă",
    icon: Trash2,
    className: "bg-red-100 text-red-800",
  },
}

export default function MesterPhotosPage() {
  const [photos, setPhotos] = useState<MesterPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [caption, setCaption] = useState("")
  const [isCover, setIsCover] = useState(false)

  useEffect(() => {
    loadPhotos()
  }, [])

  async function loadPhotos() {
    const data = await getMesterPhotos()
    setPhotos(data)
    setLoading(false)
  }

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const fileInput = form.querySelector('input[type="file"]') as HTMLInputElement
    const file = fileInput?.files?.[0]

    if (!file) {
      toast({
        title: "Eroare",
        description: "Selectează o imagine",
        variant: "destructive",
      })
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)
    formData.append("caption", caption)
    formData.append("isCover", isCover.toString())

    const result = await uploadPhoto(formData)

    if (result.error) {
      toast({
        title: "Eroare",
        description: result.error,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Succes",
        description: "Fotografia a fost încărcată și așteaptă aprobare.",
      })
      setCaption("")
      setIsCover(false)
      form.reset()
      loadPhotos()
    }
    setUploading(false)
  }

  async function handleDelete(photoId: string) {
    if (!confirm("Ești sigur că vrei să ștergi această fotografie?")) return

    const result = await deletePhoto(photoId)
    if (result.error) {
      toast({
        title: "Eroare",
        description: result.error,
        variant: "destructive",
      })
    } else {
      toast({ title: "Fotografie ștearsă" })
      loadPhotos()
    }
  }

  async function handleSetCover(photoId: string) {
    const result = await setPhotoCover(photoId)
    if (result.error) {
      toast({
        title: "Eroare",
        description: result.error,
        variant: "destructive",
      })
    } else {
      toast({ title: "Fotografie de copertă setată" })
      loadPhotos()
    }
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
        <h1 className="text-3xl font-bold">Fotografii</h1>
        <p className="text-muted-foreground">
          Adaugă fotografii cu lucrările tale
        </p>
      </div>

      {/* Upload form */}
      <Card>
        <CardHeader>
          <CardTitle>Adaugă fotografie</CardTitle>
          <CardDescription>
            Fotografiile vor fi vizibile după aprobare de către un administrator
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="photo">Imagine</Label>
              <Input
                id="photo"
                type="file"
                accept="image/*"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="caption">Descriere (opțional)</Label>
              <Input
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Ex: Instalație electrică finalizată"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isCover"
                checked={isCover}
                onCheckedChange={(checked) => setIsCover(checked as boolean)}
              />
              <Label htmlFor="isCover" className="text-sm">
                Setează ca fotografie de copertă
              </Label>
            </div>
            <Button type="submit" disabled={uploading}>
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Se încarcă...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Încarcă fotografie
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Photos grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Fotografiile tale ({photos.length})
        </h2>

        {photos.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                Nu ai încărcat nicio fotografie încă.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {photos.map((photo) => {
              const status = approvalConfig[photo.approval_status as keyof typeof approvalConfig]
              const StatusIcon = status.icon

              return (
                <Card key={photo.id} className="overflow-hidden">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={photo.url}
                      alt={photo.caption || "Fotografie"}
                      fill
                      className="object-cover"
                    />
                    {photo.is_cover && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-primary">
                          <Star className="mr-1 h-3 w-3" />
                          Copertă
                        </Badge>
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge className={status.className}>
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {status.label}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    {photo.caption && (
                      <p className="text-sm text-muted-foreground mb-3">
                        {photo.caption}
                      </p>
                    )}
                    <div className="flex gap-2">
                      {!photo.is_cover && photo.approval_status === "approved" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetCover(photo.id)}
                        >
                          <Star className="mr-1 h-3 w-3" />
                          Copertă
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(photo.id)}
                      >
                        <Trash2 className="mr-1 h-3 w-3" />
                        Șterge
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
