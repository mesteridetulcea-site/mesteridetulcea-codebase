"use client"

import { useState, useEffect, useRef } from "react"
import {
  Loader2, Plus, Trash2, Camera, ChevronDown, ChevronUp,
  X, Pencil, Check,
} from "lucide-react"
import { compressImage } from "@/lib/utils/compress-image"
import {
  getMesterProjects, createProject, updateProject,
  deleteProject, addProjectPhoto, deleteProjectPhoto,
} from "@/actions/projects"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/lib/hooks/use-toast"
import type { ProjectWithPhotos } from "@/types/database"

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


export default function ProiectePage() {
  const [projects, setProjects]             = useState<ProjectWithPhotos[]>([])
  const [loading, setLoading]               = useState(true)
  const [showForm, setShowForm]             = useState(false)
  const [submitting, setSubmitting]         = useState(false)
  const [expandedId, setExpandedId]         = useState<string | null>(null)
  const [editingId, setEditingId]           = useState<string | null>(null)
  const [editTitle, setEditTitle]           = useState("")
  const [editDesc, setEditDesc]             = useState("")
  const [savingEdit, setSavingEdit]         = useState(false)
  const [uploadingFor, setUploadingFor]     = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => { loadProjects() }, [])

  async function loadProjects() {
    const data = await getMesterProjects()
    setProjects(data)
    setLoading(false)
  }

  async function handleCreate(e: { currentTarget: HTMLFormElement; preventDefault(): void }) {
    e.preventDefault()
    setSubmitting(true)
    const raw = new FormData(e.currentTarget)
    const formData = new FormData()
    formData.set("title", raw.get("title") as string)
    formData.set("description", raw.get("description") as string)
    const files = raw.getAll("photos") as File[]
    await Promise.all(files.filter(f => f.size > 0).map(async (f) => {
      formData.append("photos", await compressImage(f))
    }))
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
    setUploadingFor(projectId)
    const compressed = await compressImage(file)
    const result = await addProjectPhoto(projectId, compressed)
    if (result.error) {
      toast({ title: "Eroare", description: result.error, variant: "destructive" })
    } else {
      toast({ title: "Poză adăugată!" })
      loadProjects()
    }
    setUploadingFor(null)
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
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div>
      {/* Page header */}
      <div
        className="px-6 pt-8 pb-8 md:px-10 md:pt-10 flex items-start justify-between gap-4"
        style={{ borderBottom: "1px solid #e0c99a" }}
      >
        <div>
          <p className="font-condensed tracking-[0.26em] uppercase text-xs text-primary/70 mb-2">
            Panou meșter
          </p>
          <h1
            className="font-condensed text-[#1a0f05] leading-[1.1]"
            style={{ fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 600 }}
          >
            Proiecte realizate
          </h1>
          <p className="text-sm text-[#8a6848] mt-2">
            Adaugă proiectele tale pentru a le arăta potențialilor clienți
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-2.5 shrink-0 mt-2 font-condensed tracking-[0.14em] uppercase text-sm font-semibold transition-all duration-200"
          style={{
            border: "1px solid hsl(38 68% 44% / 0.5)",
            color: "hsl(38 68% 44%)",
            borderRadius: "6px",
          }}
        >
          <Plus className="h-4 w-4" />
          Proiect nou
        </button>
      </div>

      <div className="px-6 py-8 md:px-10 space-y-5">

        {/* Create form */}
        {showForm && (
          <div style={panel}>
            <div className="px-6 py-4" style={{ borderBottom: "1px solid #e0c99a" }}>
              <p className="font-condensed tracking-[0.14em] uppercase text-sm font-semibold text-[#3d2810]">
                Proiect nou
              </p>
            </div>
            <div className="px-6 py-6">
              <form ref={formRef} onSubmit={handleCreate} className="space-y-4">
                <div>
                  <FieldLabel>Titlu *</FieldLabel>
                  <Input
                    className={inputCls}
                    name="title"
                    placeholder="Ex: Instalație electrică completă casă P+1"
                    required
                  />
                </div>
                <div>
                  <FieldLabel>Descriere (opțional)</FieldLabel>
                  <Textarea
                    className="bg-[#faf6ed] border-[#d4c0a0] text-[#1a0f05] placeholder:text-[#b8956a] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary/60 rounded-[4px] resize-none text-sm"
                    name="description"
                    placeholder="Descrie lucrarea realizată..."
                    rows={3}
                  />
                </div>
                <div>
                  <FieldLabel>Poze (opțional · max 3)</FieldLabel>
                  <Input
                    className={inputCls + " file:text-[#8a6848] file:bg-transparent file:border-0 file:font-condensed file:text-xs cursor-pointer"}
                    name="photos"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                  />
                </div>
                <div className="flex gap-3 pt-3" style={{ borderTop: "1px solid #e0c99a" }}>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="rounded-[4px] font-condensed tracking-[0.16em] uppercase text-sm font-semibold bg-primary hover:bg-primary/85 text-white h-11 px-6"
                  >
                    {submitting
                      ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Se salvează...</>
                      : "Salvează proiect"}
                  </Button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-5 h-11 font-condensed tracking-[0.14em] uppercase text-sm text-[#8a6848] hover:text-[#3d2810] transition-colors duration-200"
                  >
                    Anulează
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Projects list */}
        {projects.length === 0 && !showForm ? (
          <div
            className="py-16 flex flex-col items-center gap-3"
            style={panel}
          >
            <Camera className="h-8 w-8 text-[#d4c0a0]" />
            <p className="font-condensed tracking-[0.14em] uppercase text-sm text-[#b8956a]">
              Nu ai niciun proiect adăugat
            </p>
            <p className="text-sm text-[#b8956a]">Adaugă primul tău proiect pentru a-l afișa pe profil.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {projects.map((project) => {
              const isExpanded = expandedId === project.id
              const photoCount = project.project_photos?.length ?? 0

              return (
                <div key={project.id} style={panel}>
                  {/* Header row */}
                  <div className="flex items-center gap-3 px-4 py-4">
                    <button
                      className="flex-1 flex items-center gap-3 text-left min-w-0"
                      onClick={() => setExpandedId(isExpanded ? null : project.id)}
                    >
                      {/* Thumb */}
                      <div
                        className="w-12 h-12 shrink-0 overflow-hidden"
                        style={{ background: "#f0e8d8", borderRadius: "4px" }}
                      >
                        {project.project_photos?.[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={project.project_photos[0].url}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Camera className="h-4 w-4 text-primary/25" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-[#1a0f05] truncate">
                          {project.title}
                        </p>
                        <p className="font-condensed tracking-wide uppercase text-xs text-[#8a6848] mt-0.5">
                          {photoCount} {photoCount === 1 ? "poză" : "poze"}
                        </p>
                      </div>
                      {isExpanded
                        ? <ChevronUp className="h-4 w-4 text-[#b8956a] shrink-0" />
                        : <ChevronDown className="h-4 w-4 text-[#b8956a] shrink-0" />}
                    </button>

                    <div className="flex gap-1.5 shrink-0">
                      <button
                        onClick={() => startEdit(project)}
                        className="w-9 h-9 flex items-center justify-center text-[#8a6848] hover:text-primary transition-colors duration-200"
                        style={{ border: "1px solid #e0c99a", borderRadius: "4px" }}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="w-9 h-9 flex items-center justify-center text-[#8a6848] hover:text-red-500 transition-colors duration-200"
                        style={{ border: "1px solid #e0c99a", borderRadius: "4px" }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded content */}
                  {isExpanded && (
                    <div className="px-4 pb-5" style={{ borderTop: "1px solid #e0c99a" }}>
                      <div className="pt-5 space-y-5">

                        {editingId === project.id ? (
                          <div className="space-y-3">
                            <div>
                              <FieldLabel>Titlu</FieldLabel>
                              <Input
                                className={inputCls}
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                              />
                            </div>
                            <div>
                              <FieldLabel>Descriere</FieldLabel>
                              <Textarea
                                className="bg-[#faf6ed] border-[#d4c0a0] text-[#1a0f05] placeholder:text-[#b8956a] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary/60 rounded-[4px] resize-none text-sm"
                                value={editDesc}
                                onChange={(e) => setEditDesc(e.target.value)}
                                rows={3}
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                disabled={savingEdit || !editTitle.trim()}
                                onClick={() => handleUpdate(project.id)}
                                className="rounded-[4px] font-condensed tracking-[0.14em] uppercase text-xs font-semibold bg-primary hover:bg-primary/85 text-white h-9 px-5"
                              >
                                {savingEdit
                                  ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  : <><Check className="mr-1.5 h-3.5 w-3.5" />Salvează</>}
                              </Button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="px-4 h-9 font-condensed tracking-[0.12em] uppercase text-xs text-[#8a6848] hover:text-[#3d2810] transition-colors"
                              >
                                Anulează
                              </button>
                            </div>
                          </div>
                        ) : (
                          project.description && (
                            <p className="text-sm text-[#8a6848] leading-relaxed">{project.description}</p>
                          )
                        )}

                        {/* Photos mini-grid */}
                        <div>
                          <p className="font-condensed tracking-[0.16em] uppercase text-xs text-[#8a6848] mb-2.5">
                            Poze proiect
                          </p>
                          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                            {project.project_photos?.map((photo) => (
                              <div
                                key={photo.id}
                                className="relative group aspect-square overflow-hidden"
                                style={{ background: "#f0e8d8", borderRadius: "4px" }}
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={photo.url}
                                  alt="Poză proiect"
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  onClick={() => handleDeletePhoto(photo.id)}
                                  className="absolute top-0.5 right-0.5 w-5 h-5 flex items-center justify-center bg-black/75 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-all duration-150"
                                  style={{ borderRadius: "3px" }}
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                            {/* Add photo */}
                            <label
                              className="aspect-square flex items-center justify-center cursor-pointer transition-colors duration-200 hover:border-primary/50"
                              style={{
                                border: "1px dashed #d4c0a0",
                                borderRadius: "4px",
                              }}
                            >
                              {uploadingFor === project.id
                                ? <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                : <Plus className="h-4 w-4 text-[#b8956a]" />}
                              <input
                                type="file"
                                className="sr-only"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  if (file) handleAddPhoto(project.id, file)
                                  e.target.value = ""
                                }}
                                disabled={uploadingFor !== null}
                              />
                            </label>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}
