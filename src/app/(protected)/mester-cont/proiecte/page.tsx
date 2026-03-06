"use client"

import { useState, useEffect, useRef } from "react"
import { Loader2, Plus, Trash2, Camera, ChevronDown, ChevronUp, X, Pencil, Check } from "lucide-react"
import { getMesterProjects, createProject, updateProject, deleteProject, addProjectPhoto, deleteProjectPhoto } from "@/actions/projects"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/lib/hooks/use-toast"
import type { ProjectWithPhotos } from "@/types/database"

export default function ProiectePage() {
  const [projects, setProjects] = useState<ProjectWithPhotos[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editDesc, setEditDesc] = useState("")
  const [savingEdit, setSavingEdit] = useState(false)
  const [uploadingPhotoFor, setUploadingPhotoFor] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    loadProjects()
  }, [])

  async function loadProjects() {
    const data = await getMesterProjects()
    setProjects(data)
    setLoading(false)
  }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    const formData = new FormData(e.currentTarget)
    const result = await createProject(formData)
    if (result.error) {
      toast({ title: "Eroare", description: result.error, variant: "destructive" })
    } else {
      toast({ title: "Proiect creat!" })
      formRef.current?.reset()
      setShowForm(false)
      loadProjects()
    }
    setSubmitting(false)
  }

  function startEdit(project: ProjectWithPhotos) {
    setEditingId(project.id)
    setEditTitle(project.title)
    setEditDesc(project.description ?? "")
    setExpandedId(project.id)
  }

  async function handleUpdate(projectId: string) {
    setSavingEdit(true)
    const fd = new FormData()
    fd.append("title", editTitle)
    fd.append("description", editDesc)
    const result = await updateProject(projectId, fd)
    if (result.error) {
      toast({ title: "Eroare", description: result.error, variant: "destructive" })
    } else {
      toast({ title: "Proiect actualizat!" })
      setEditingId(null)
      loadProjects()
    }
    setSavingEdit(false)
  }

  async function handleDelete(projectId: string) {
    if (!confirm("Ești sigur că vrei să ștergi acest proiect? Toate pozele vor fi șterse.")) return
    const result = await deleteProject(projectId)
    if (result.error) {
      toast({ title: "Eroare", description: result.error, variant: "destructive" })
    } else {
      toast({ title: "Proiect șters" })
      loadProjects()
    }
  }

  async function handleAddPhoto(projectId: string, file: File) {
    setUploadingPhotoFor(projectId)
    const result = await addProjectPhoto(projectId, file)
    if (result.error) {
      toast({ title: "Eroare", description: result.error, variant: "destructive" })
    } else {
      toast({ title: "Poză adăugată!" })
      loadProjects()
    }
    setUploadingPhotoFor(null)
  }

  async function handleDeletePhoto(photoId: string) {
    if (!confirm("Ștergi această poză?")) return
    const result = await deleteProjectPhoto(photoId)
    if (result.error) {
      toast({ title: "Eroare", description: result.error, variant: "destructive" })
    } else {
      loadProjects()
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Proiecte realizate</h1>
          <p className="text-muted-foreground">Adaugă proiectele tale pentru a le arăta potențialilor clienți</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          Proiect nou
        </Button>
      </div>

      {/* Create form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Proiect nou</CardTitle>
          </CardHeader>
          <CardContent>
            <form ref={formRef} onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titlu *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Ex: Instalație electrică completă casă P+1"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descriere (opțional)</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Descrie lucrarea realizată, materiale folosite, detalii tehnice..."
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="photos">Poze (opțional, max 10)</Label>
                <Input
                  id="photos"
                  name="photos"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                />
                <p className="text-xs text-muted-foreground">Max 2MB per poză. JPEG, PNG, WebP.</p>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Se salvează...</>
                  ) : (
                    "Salvează proiect"
                  )}
                </Button>
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                  Anulează
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Projects list */}
      {projects.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Camera className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>Nu ai niciun proiect adăugat.</p>
            <p className="text-sm mt-1">Adaugă primul tău proiect pentru a-l afișa pe profil.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => {
            const isExpanded = expandedId === project.id
            const photoCount = project.project_photos?.length ?? 0

            return (
              <Card key={project.id}>
                <CardContent className="p-4">
                  {/* Header row */}
                  <div className="flex items-center justify-between gap-4">
                    <button
                      className="flex-1 flex items-center gap-3 text-left"
                      onClick={() => setExpandedId(isExpanded ? null : project.id)}
                    >
                      {/* Cover thumb */}
                      <div className="w-14 h-14 shrink-0 bg-[#f5eed8] overflow-hidden">
                        {project.project_photos?.[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={project.project_photos[0].url}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Camera className="h-5 w-5 text-primary/30" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium truncate">{project.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {photoCount} {photoCount === 1 ? "poză" : "poze"}
                        </p>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                      )}
                    </button>

                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEdit(project)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(project.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="mt-4 space-y-4 border-t pt-4">
                      {editingId === project.id ? (
                        <div className="space-y-3">
                          <div className="space-y-1.5">
                            <Label>Titlu</Label>
                            <Input
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label>Descriere</Label>
                            <Textarea
                              value={editDesc}
                              onChange={(e) => setEditDesc(e.target.value)}
                              rows={3}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" disabled={savingEdit || !editTitle.trim()} onClick={() => handleUpdate(project.id)}>
                              {savingEdit ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <Check className="mr-2 h-3.5 w-3.5" />}
                              Salvează
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Anulează</Button>
                          </div>
                        </div>
                      ) : (
                        project.description && (
                          <p className="text-sm text-muted-foreground">{project.description}</p>
                        )
                      )}

                      {/* Photos grid */}
                      <div>
                        <p className="text-sm font-medium mb-2">Poze proiect</p>
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                          {project.project_photos?.map((photo) => (
                            <div key={photo.id} className="relative group aspect-square bg-[#f5eed8] overflow-hidden">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={photo.url}
                                alt="Poză proiect"
                                className="w-full h-full object-cover"
                              />
                              <button
                                onClick={() => handleDeletePhoto(photo.id)}
                                className="absolute top-0.5 right-0.5 bg-black/60 hover:bg-red-600 text-white p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}

                          {/* Add photo button */}
                          <label className="aspect-square border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 flex items-center justify-center cursor-pointer transition-colors">
                            {uploadingPhotoFor === project.id ? (
                              <Loader2 className="h-5 w-5 animate-spin text-primary" />
                            ) : (
                              <Plus className="h-5 w-5 text-muted-foreground" />
                            )}
                            <input
                              type="file"
                              className="sr-only"
                              accept="image/jpeg,image/png,image/webp"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) handleAddPhoto(project.id, file)
                                e.target.value = ""
                              }}
                              disabled={uploadingPhotoFor !== null}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
