"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Pencil, Loader2, Plus, X } from "lucide-react"
import { updateProject, addProjectPhoto, deleteProjectPhoto } from "@/actions/projects"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/lib/hooks/use-toast"
import type { ProjectPhoto } from "@/types/database"

interface ProjectEditDialogProps {
  projectId: string
  initialTitle: string
  initialDescription: string | null
  initialPhotos?: ProjectPhoto[]
}

export function ProjectEditDialog({
  projectId,
  initialTitle,
  initialDescription,
  initialPhotos = [],
}: ProjectEditDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(initialTitle)
  const [description, setDescription] = useState(initialDescription ?? "")
  const [photos, setPhotos] = useState<ProjectPhoto[]>(initialPhotos)
  const [saving, setSaving] = useState(false)
  const [deletingPhotoId, setDeletingPhotoId] = useState<string | null>(null)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const router = useRouter()

  // Reset state when dialog opens
  function handleOpenChange(isOpen: boolean) {
    if (isOpen) {
      setTitle(initialTitle)
      setDescription(initialDescription ?? "")
      setPhotos(initialPhotos.filter((p) => p.approval_status !== "rejected"))
    }
    setOpen(isOpen)
  }

  async function handleSave() {
    setSaving(true)
    const fd = new FormData()
    fd.append("title", title)
    fd.append("description", description)
    const result = await updateProject(projectId, fd)
    if (result.error) {
      toast({ title: "Eroare", description: result.error, variant: "destructive" })
    } else {
      toast({ title: "Proiect actualizat!" })
      setOpen(false)
      router.refresh()
    }
    setSaving(false)
  }

  async function handleDeletePhoto(photoId: string) {
    setDeletingPhotoId(photoId)
    const result = await deleteProjectPhoto(photoId)
    if (result.error) {
      toast({ title: "Eroare", description: result.error, variant: "destructive" })
    } else {
      setPhotos((prev) => prev.filter((p) => p.id !== photoId))
    }
    setDeletingPhotoId(null)
  }

  async function handleAddPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingPhoto(true)
    const result = await addProjectPhoto(projectId, file)
    if (result.error) {
      toast({ title: "Eroare", description: result.error, variant: "destructive" })
    } else {
      toast({ title: "Poză adăugată! Va apărea după aprobare." })
      // Refresh to get the new photo in the list
      router.refresh()
    }
    e.target.value = ""
    setUploadingPhoto(false)
  }

  const statusLabel = (status: string) => {
    if (status === "pending") return { text: "În așteptare", cls: "bg-amber-500/80" }
    if (status === "rejected") return { text: "Respinsă", cls: "bg-red-600/80" }
    return null
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="mr-2 h-4 w-4" />
          Editează
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editează proiect</DialogTitle>
        </DialogHeader>
        <div className="space-y-5 pt-2">
          <div className="space-y-1.5">
            <Label>Titlu *</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titlul proiectului"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Descriere</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrie lucrarea realizată, materiale folosite..."
              rows={4}
            />
          </div>

          {/* Photos */}
          <div className="space-y-2">
            <Label>Poze proiect</Label>
            <div className="grid grid-cols-4 gap-2">
              {photos.map((photo) => {
                const badge = statusLabel(photo.approval_status)
                const isDeleting = deletingPhotoId === photo.id
                return (
                  <div key={photo.id} className="relative group aspect-square bg-[#f5eed8] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.url}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {badge && (
                      <span className={`absolute bottom-0 left-0 right-0 text-white text-[9px] text-center py-0.5 ${badge.cls}`}>
                        {badge.text}
                      </span>
                    )}
                    <button
                      onClick={() => handleDeletePhoto(photo.id)}
                      disabled={isDeleting}
                      className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/60 hover:bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {isDeleting ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <X className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                )
              })}

              {/* Add photo tile */}
              <label className="aspect-square border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 flex items-center justify-center cursor-pointer transition-colors">
                {uploadingPhoto ? (
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                ) : (
                  <Plus className="h-5 w-5 text-muted-foreground" />
                )}
                <input
                  type="file"
                  className="sr-only"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleAddPhoto}
                  disabled={uploadingPhoto}
                />
              </label>
            </div>
            <p className="text-xs text-muted-foreground">Pozele noi necesită aprobare înainte de a fi vizibile public.</p>
          </div>

          <div className="flex gap-2 pt-1">
            <Button disabled={saving || !title.trim()} onClick={handleSave}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvează modificările
            </Button>
            <Button variant="ghost" onClick={() => setOpen(false)}>Anulează</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
