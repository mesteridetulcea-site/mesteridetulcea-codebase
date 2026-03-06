"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Camera, FolderOpen, Plus, X, Loader2, Pencil } from "lucide-react"
import { createProject, updateProject, addProjectPhoto, deleteProjectPhoto } from "@/actions/projects"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/lib/hooks/use-toast"
import type { ProjectWithPhotos } from "@/types/database"

interface ProjectsSectionProps {
  projects: ProjectWithPhotos[]
  mesterId: string
  isOwner?: boolean
}

export function ProjectsSection({ projects: initialProjects, mesterId, isOwner = false }: ProjectsSectionProps) {
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [previews, setPreviews] = useState<string[]>([])
  const [editingProject, setEditingProject] = useState<ProjectWithPhotos | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editDesc, setEditDesc] = useState("")
  const [editPhotos, setEditPhotos] = useState<ProjectWithPhotos["project_photos"]>([])
  const [savingEdit, setSavingEdit] = useState(false)
  const [deletingPhotoId, setDeletingPhotoId] = useState<string | null>(null)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    const formData = new FormData(e.currentTarget)
    const result = await createProject(formData)
    if (result.error) {
      toast({ title: "Eroare", description: result.error, variant: "destructive" })
    } else {
      toast({ title: "Proiect adăugat!" })
      formRef.current?.reset()
      setPreviews([])
      setShowForm(false)
      router.refresh()
    }
    setSubmitting(false)
  }

  function openEdit(project: ProjectWithPhotos) {
    setEditTitle(project.title)
    setEditDesc(project.description ?? "")
    setEditPhotos(project.project_photos ?? [])
    setEditingProject(project)
  }

  async function handleUpdate() {
    if (!editingProject) return
    setSavingEdit(true)
    const fd = new FormData()
    fd.append("title", editTitle)
    fd.append("description", editDesc)
    const result = await updateProject(editingProject.id, fd)
    if (result.error) {
      toast({ title: "Eroare", description: result.error, variant: "destructive" })
    } else {
      toast({ title: "Proiect actualizat!" })
      setEditingProject(null)
      router.refresh()
    }
    setSavingEdit(false)
  }

  async function handleDeleteEditPhoto(photoId: string) {
    setDeletingPhotoId(photoId)
    const result = await deleteProjectPhoto(photoId)
    if (result.error) {
      toast({ title: "Eroare", description: result.error, variant: "destructive" })
    } else {
      setEditPhotos((prev) => prev.filter((p) => p.id !== photoId))
    }
    setDeletingPhotoId(null)
  }

  async function handleAddEditPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    if (!editingProject) return
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingPhoto(true)
    const result = await addProjectPhoto(editingProject.id, file)
    if (result.error) {
      toast({ title: "Eroare", description: result.error, variant: "destructive" })
    } else {
      toast({ title: "Poză adăugată! Va apărea după aprobare." })
    }
    e.target.value = ""
    setUploadingPhoto(false)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, 10)
    const urls = files.map((f) => URL.createObjectURL(f))
    setPreviews(urls)
  }

  return (
    <div className="space-y-4">
      {/* Edit dialog */}
      <Dialog open={!!editingProject} onOpenChange={(open) => { if (!open) { setEditingProject(null) } }}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editează proiect</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label>Titlu *</Label>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Titlul proiectului"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Descriere</Label>
              <Textarea
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                placeholder="Descrie lucrarea realizată, materiale folosite..."
                rows={4}
              />
            </div>

            {/* Photos */}
            <div className="space-y-2">
              <Label>Poze proiect</Label>
              <div className="grid grid-cols-4 gap-2">
                {editPhotos.map((photo) => {
                  const isDeleting = deletingPhotoId === photo.id
                  return (
                    <div key={photo.id} className="relative group aspect-square bg-[#f5eed8] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photo.url} alt="" className="absolute inset-0 w-full h-full object-cover" />
                      <button
                        onClick={() => handleDeleteEditPhoto(photo.id)}
                        disabled={isDeleting}
                        className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/60 hover:bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {isDeleting ? <Loader2 className="h-3 w-3 animate-spin" /> : <X className="h-3 w-3" />}
                      </button>
                    </div>
                  )
                })}
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
                    onChange={handleAddEditPhoto}
                    disabled={uploadingPhoto}
                  />
                </label>
              </div>
              <p className="text-xs text-muted-foreground">Pozele noi necesită aprobare înainte de a fi vizibile.</p>
            </div>

            <div className="flex gap-2 pt-1">
              <Button disabled={savingEdit || !editTitle.trim()} onClick={handleUpdate}>
                {savingEdit && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvează modificările
              </Button>
              <Button variant="ghost" onClick={() => setEditingProject(null)}>Anulează</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Owner toolbar */}
      {isOwner && !showForm && (
        <div className="flex justify-end">
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 font-condensed tracking-[0.16em] uppercase text-xs text-primary hover:text-primary/80 border border-primary/45 hover:border-primary hover:bg-primary/5 px-4 py-2 transition-colors duration-200"
          >
            <Plus className="h-3.5 w-3.5" />
            Adaugă proiect
          </button>
        </div>
      )}

      {/* Inline create form */}
      {isOwner && showForm && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Proiect nou</CardTitle>
              <button onClick={() => { setShowForm(false); setPreviews([]) }} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <form ref={formRef} onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="proj-title">Titlu *</Label>
                <Input
                  id="proj-title"
                  name="title"
                  placeholder="Ex: Instalație electrică completă casă P+1"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="proj-desc">Descriere (opțional)</Label>
                <Textarea
                  id="proj-desc"
                  name="description"
                  placeholder="Descrie lucrarea realizată, materiale folosite..."
                  rows={3}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="proj-photos">Poze (opțional, max 10, 2MB/poză)</Label>
                <Input
                  id="proj-photos"
                  name="photos"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handleFileChange}
                />
              </div>

              {previews.length > 0 && (
                <div className="grid grid-cols-5 gap-2">
                  {previews.map((src, i) => (
                    <div key={i} className="relative aspect-square overflow-hidden bg-[#f5eed8]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <Button type="submit" disabled={submitting} size="sm">
                  {submitting ? (
                    <><Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />Se salvează...</>
                  ) : "Salvează proiect"}
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => { setShowForm(false); setPreviews([]) }}>
                  Anulează
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Projects grid */}
      {initialProjects.length === 0 && !showForm ? (
        <div className="py-12 text-center text-muted-foreground">
          <FolderOpen className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p>Nu există proiecte adăugate încă.</p>
        </div>
      ) : initialProjects.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-6">
          {initialProjects.map((project) => {
            const coverPhoto = project.project_photos?.[0]
            const photoCount = project.project_photos?.length ?? 0

            return (
              <div key={project.id} className="relative group/card">
                <Link
                  href={`/mester/${mesterId}/proiect/${project.id}`}
                  className="group block overflow-hidden border border-[#584528]/12 hover:border-primary/40 hover:shadow-xl transition-all duration-300 bg-white"
                >
                  <div className="relative aspect-[4/3] bg-[#f5eed8] overflow-hidden">
                    {coverPhoto ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={coverPhoto.url}
                        alt={project.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Camera className="h-12 w-12 text-primary/20" />
                      </div>
                    )}
                    {photoCount > 0 && (
                      <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/60 text-white text-xs px-2 py-1 font-condensed">
                        <Camera className="h-3 w-3" />
                        {photoCount}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-base font-medium group-hover:text-primary transition-colors duration-200 line-clamp-1">
                      {project.title}
                    </h3>
                    {project.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                        {project.description}
                      </p>
                    )}
                  </div>
                </Link>
                {isOwner && (
                  <button
                    onClick={() => openEdit(project)}
                    className="absolute top-2 right-2 w-7 h-7 bg-black/50 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-200"
                    aria-label="Editează proiect"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
