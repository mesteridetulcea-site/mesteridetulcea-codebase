"use client"

import { useState, useEffect } from "react"
import { Loader2, Upload, Trash2, Star, Clock, CheckCircle, XCircle } from "lucide-react"
import { getMesterPhotos, uploadPhoto, deletePhoto, setPhotoCover } from "@/actions/photos"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/lib/hooks/use-toast"
import type { MesterPhoto } from "@/types/database"

const panel = {
  background: "white",
  border: "1px solid #e0c99a",
  borderRadius: "6px",
} as const

const inputCls =
  "bg-[#faf6ed] border-[#d4c0a0] text-[#1a0f05] placeholder:text-[#b8956a] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary/60 rounded-[4px] h-11 text-sm"

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-condensed tracking-[0.16em] uppercase text-xs text-[#8a6848] mb-1.5 font-medium">
      {children}
    </p>
  )
}

const statusConfig = {
  pending:  { label: "În așteptare", icon: Clock,       color: "hsl(38 80% 55%)" },
  approved: { label: "Aprobată",     icon: CheckCircle, color: "hsl(142 55% 42%)" },
  rejected: { label: "Respinsă",     icon: XCircle,     color: "hsl(0 65% 52%)" },
}

export default function MesterPhotosPage() {
  const [photos, setPhotos]       = useState<MesterPhoto[]>([])
  const [loading, setLoading]     = useState(true)
  const [uploading, setUploading] = useState(false)
  const [caption, setCaption]     = useState("")
  const [isCover, setIsCover]     = useState(false)

  useEffect(() => { loadPhotos() }, [])

  async function loadPhotos() {
    const data = await getMesterPhotos()
    setPhotos(data)
    setLoading(false)
  }

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form      = e.currentTarget
    const fileInput = form.querySelector('input[type="file"]') as HTMLInputElement
    const file      = fileInput?.files?.[0]
    if (!file) {
      toast({ title: "Eroare", description: "Selectează o imagine", variant: "destructive" })
      return
    }
    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)
    formData.append("caption", caption)
    formData.append("isCover", isCover.toString())
    const result = await uploadPhoto(formData)
    if (result.error) {
      toast({ title: "Eroare", description: result.error, variant: "destructive" })
    } else {
      toast({ title: "Succes", description: "Fotografia a fost încărcată și așteaptă aprobare." })
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
      toast({ title: "Eroare", description: result.error, variant: "destructive" })
    } else {
      toast({ title: "Fotografie ștearsă" })
      loadPhotos()
    }
  }

  async function handleSetCover(photoId: string) {
    const result = await setPhotoCover(photoId)
    if (result.error) {
      toast({ title: "Eroare", description: result.error, variant: "destructive" })
    } else {
      toast({ title: "Fotografie de copertă setată" })
      loadPhotos()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div>
      {/* Page header */}
      <div
        className="px-6 pt-8 pb-8 md:px-10 md:pt-10"
        style={{ borderBottom: "1px solid #e0c99a" }}
      >
        <p className="font-condensed tracking-[0.26em] uppercase text-xs text-primary/70 mb-2">
          Panou meșter
        </p>
        <h1
          className="font-condensed text-[#1a0f05] leading-[1.1]"
          style={{ fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 600 }}
        >
          Fotografii
        </h1>
        <p className="text-sm text-[#8a6848] mt-2">
          Adaugă fotografii cu lucrările tale
        </p>
      </div>

      <div className="px-6 py-8 md:px-10 space-y-8">

        {/* Upload panel */}
        <div style={panel}>
          <div className="px-6 py-4" style={{ borderBottom: "1px solid #e0c99a" }}>
            <p className="font-condensed tracking-[0.14em] uppercase text-sm font-semibold text-[#3d2810]">
              Adaugă fotografie
            </p>
            <p className="text-xs text-[#8a6848] mt-0.5">
              Fotografiile vor fi vizibile după aprobare de către un administrator
            </p>
          </div>
          <div className="px-6 py-6">
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <FieldLabel>Imagine</FieldLabel>
                <Input
                  type="file"
                  accept="image/*"
                  required
                  className={inputCls + " file:text-[#8a6848] file:bg-transparent file:border-0 file:font-condensed file:text-xs cursor-pointer"}
                />
              </div>
              <div>
                <FieldLabel>Descriere (opțional)</FieldLabel>
                <Input
                  className={inputCls}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Ex: Instalație electrică finalizată"
                />
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="isCover"
                  checked={isCover}
                  onCheckedChange={(checked) => setIsCover(checked as boolean)}
                  className="border-[#3a2812] data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <label
                  htmlFor="isCover"
                  className="font-condensed tracking-[0.12em] uppercase text-xs text-[#8a6848] cursor-pointer"
                >
                  Setează ca fotografie de copertă
                </label>
              </div>
              <div className="pt-3" style={{ borderTop: "1px solid #e0c99a" }}>
                <Button
                  type="submit"
                  disabled={uploading}
                  className="rounded-[4px] font-condensed tracking-[0.16em] uppercase text-sm font-semibold bg-primary hover:bg-primary/85 text-white h-11 px-7"
                >
                  {uploading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Se încarcă...</>
                  ) : (
                    <><Upload className="mr-2 h-4 w-4" />Încarcă fotografie</>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Photos grid */}
        <div>
          <p className="font-condensed tracking-[0.24em] uppercase text-xs text-[#8a6848] mb-3">
            Fotografiile tale ({photos.length})
          </p>

          {photos.length === 0 ? (
            <div
              className="py-16 flex flex-col items-center gap-3"
              style={panel}
            >
              <Upload className="h-8 w-8 text-[#d4c0a0]" />
              <p className="font-condensed tracking-[0.14em] uppercase text-sm text-[#b8956a]">
                Nu ai încărcat nicio fotografie încă
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {photos.map((photo) => {
                const status     = statusConfig[photo.approval_status as keyof typeof statusConfig]
                const StatusIcon = status?.icon ?? Clock
                const isCoverPhoto = photo.photo_type === "profile"

                return (
                  <div key={photo.id} style={{ ...panel, overflow: "hidden" }}>
                    {/* Image */}
                    <div className="relative aspect-video overflow-hidden" style={{ background: "#f0e8d8" }}>
                      {photo.public_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={photo.public_url}
                          alt={photo.caption || "Fotografie"}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.currentTarget.style.display = "none" }}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full font-condensed tracking-widest uppercase text-xs text-[#b8956a]">
                          Fără imagine
                        </div>
                      )}

                      {/* Cover badge */}
                      {isCoverPhoto && (
                        <div
                          className="absolute top-2 left-2 flex items-center gap-1.5 px-2.5 py-1"
                          style={{
                            background: "rgba(13,9,5,0.85)",
                            border: "1px solid hsl(38 68% 44% / 0.6)",
                            borderRadius: "4px",
                          }}
                        >
                          <Star className="h-3 w-3 text-primary" />
                          <span className="font-condensed tracking-wider uppercase text-[10px] text-primary">
                            Copertă
                          </span>
                        </div>
                      )}

                      {/* Status badge */}
                      {status && (
                        <div
                          className="absolute top-2 right-2 flex items-center gap-1.5 px-2.5 py-1"
                          style={{
                            background: "rgba(13,9,5,0.85)",
                            border: `1px solid ${status.color}55`,
                            borderRadius: "4px",
                          }}
                        >
                          <StatusIcon className="h-3 w-3" style={{ color: status.color }} />
                          <span
                            className="font-condensed tracking-wider uppercase text-[10px]"
                            style={{ color: status.color }}
                          >
                            {status.label}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Caption + actions */}
                    <div
                      className="px-4 py-3 flex items-center justify-between gap-2"
                      style={{ borderTop: "1px solid #e0c99a" }}
                    >
                      {photo.caption && (
                        <p className="text-xs text-[#8a6848] truncate flex-1 min-w-0">
                          {photo.caption}
                        </p>
                      )}
                      <div className="flex gap-2 ml-auto shrink-0">
                        {!isCoverPhoto && photo.approval_status === "approved" && (
                          <button
                            onClick={() => handleSetCover(photo.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-[#8a6848] hover:text-primary transition-colors duration-200"
                            style={{ border: "1px solid #e0c99a", borderRadius: "4px", fontSize: "11px" }}
                          >
                            <Star className="h-3 w-3" />
                            <span className="font-condensed tracking-wide uppercase text-[10px]">Copertă</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(photo.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-[#8a6848] hover:text-red-500 transition-colors duration-200"
                          style={{ border: "1px solid #e0c99a", borderRadius: "4px" }}
                        >
                          <Trash2 className="h-3 w-3" />
                          <span className="font-condensed tracking-wide uppercase text-[10px]">Șterge</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
