"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Loader2, Check, X, FolderOpen } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import {
  approvePhoto,
  rejectPhoto,
  approveCererePhoto,
  rejectCererePhoto,
  approveProjectPhoto,
  rejectProjectPhoto,
} from "@/actions/admin"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/lib/hooks/use-toast"

interface PhotoWithMester {
  id: string
  public_url: string
  caption: string | null
  created_at: string
  mester: { display_name: string } | null
}

interface ProjectPhotoWithProject {
  id: string
  url: string
  created_at: string
  project: {
    title: string
    mester: { display_name: string } | null
  } | null
}

interface CererePhotoWithCerere {
  id: string
  url: string
  created_at: string
  cerere: { title: string | null; original_message: string } | null
}

export default function AdminPhotosPage() {
  const [tab, setTab] = useState<"mesteri" | "cereri">("mesteri")
  const [mesterPhotos, setMesterPhotos] = useState<PhotoWithMester[]>([])
  const [projectPhotos, setProjectPhotos] = useState<ProjectPhotoWithProject[]>([])
  const [cererePhotos, setCererePhotos] = useState<CererePhotoWithCerere[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    loadAll()
  }, [])

  async function loadAll() {
    setLoading(true)
    const supabase = createClient()

    const [{ data: mp }, { data: pp }, { data: cp }] = await Promise.all([
      supabase
        .from("mester_photos")
        .select(`id, public_url, caption, created_at, mester:mester_profiles(display_name)`)
        .eq("approval_status", "pending")
        .order("created_at", { ascending: false }),
      supabase
        .from("project_photos")
        .select(`id, url, created_at, project:mester_projects(title, mester:mester_profiles(display_name))`)
        .eq("approval_status", "pending")
        .order("created_at", { ascending: false }),
      supabase
        .from("cerere_photos")
        .select(`id, url, created_at, cerere:service_requests(title, original_message)`)
        .eq("approval_status", "pending")
        .order("created_at", { ascending: false }),
    ])

    setMesterPhotos((mp as PhotoWithMester[]) || [])
    setProjectPhotos((pp as ProjectPhotoWithProject[]) || [])
    setCererePhotos((cp as CererePhotoWithCerere[]) || [])
    setLoading(false)
  }

  async function handle(
    photoId: string,
    action: (id: string) => Promise<{ error?: string | null; success?: boolean }>
  ) {
    setActionLoading(photoId)
    const result = await action(photoId)
    if (result.error) {
      toast({ title: "Eroare", description: result.error, variant: "destructive" })
    } else {
      toast({ title: "Acțiune efectuată!" })
      loadAll()
    }
    setActionLoading(null)
  }

  const mesterTabCount = mesterPhotos.length + projectPhotos.length
  const cerereTabCount = cererePhotos.length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Aprobare Fotografii</h1>
        <p className="text-muted-foreground">
          {tab === "mesteri" ? mesterTabCount : cerereTabCount} fotografii în așteptare
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b">
        <button
          onClick={() => setTab("mesteri")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            tab === "mesteri"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Meșteri
          {mesterTabCount > 0 && (
            <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5">
              {mesterTabCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab("cereri")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            tab === "cereri"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Cereri
          {cerereTabCount > 0 && (
            <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5">
              {cerereTabCount}
            </span>
          )}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : tab === "mesteri" ? (
        mesterTabCount === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Nu există fotografii în așteptare
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Profile photos */}
            {mesterPhotos.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Fotografii profil ({mesterPhotos.length})
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {mesterPhotos.map((photo) => {
                    const isLoading = actionLoading === photo.id
                    return (
                      <Card key={photo.id} className="overflow-hidden">
                        <div className="relative aspect-[4/3]">
                          <Image
                            src={photo.public_url}
                            alt={photo.caption || "Fotografie"}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <CardContent className="p-4">
                          <p className="font-medium text-sm truncate">
                            {photo.mester?.display_name || "Unknown"}
                          </p>
                          {photo.caption && (
                            <p className="text-xs text-muted-foreground truncate mt-1">{photo.caption}</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(photo.created_at).toLocaleDateString("ro-RO")}
                          </p>
                          <div className="flex gap-2 mt-3">
                            <Button size="sm" className="flex-1" onClick={() => handle(photo.id, approvePhoto)} disabled={isLoading}>
                              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Check className="h-4 w-4 mr-1" />Aprobă</>}
                            </Button>
                            <Button size="sm" variant="destructive" className="flex-1" onClick={() => handle(photo.id, rejectPhoto)} disabled={isLoading}>
                              <X className="h-4 w-4 mr-1" />Respinge
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Project photos */}
            {projectPhotos.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
                  <FolderOpen className="h-4 w-4" />
                  Fotografii proiecte ({projectPhotos.length})
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {projectPhotos.map((photo) => {
                    const isLoading = actionLoading === photo.id
                    return (
                      <Card key={photo.id} className="overflow-hidden">
                        <div className="relative aspect-[4/3] bg-muted">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={photo.url}
                            alt="Fotografie proiect"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardContent className="p-4">
                          <p className="font-medium text-sm truncate">
                            {photo.project?.mester?.display_name || "Unknown"}
                          </p>
                          <p className="text-xs text-muted-foreground truncate mt-0.5">
                            {photo.project?.title || "Proiect"}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(photo.created_at).toLocaleDateString("ro-RO")}
                          </p>
                          <div className="flex gap-2 mt-3">
                            <Button size="sm" className="flex-1" onClick={() => handle(photo.id, approveProjectPhoto)} disabled={isLoading}>
                              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Check className="h-4 w-4 mr-1" />Aprobă</>}
                            </Button>
                            <Button size="sm" variant="destructive" className="flex-1" onClick={() => handle(photo.id, rejectProjectPhoto)} disabled={isLoading}>
                              <X className="h-4 w-4 mr-1" />Respinge
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )
      ) : cererePhotos.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Nu există fotografii în așteptare
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {cererePhotos.map((photo) => {
            const isLoading = actionLoading === photo.id
            const title =
              photo.cerere?.title ||
              photo.cerere?.original_message?.slice(0, 40) ||
              "Cerere"
            return (
              <Card key={photo.id} className="overflow-hidden">
                <div className="relative aspect-[4/3] bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.url} alt="Fotografie cerere" className="w-full h-full object-cover" />
                </div>
                <CardContent className="p-4">
                  <p className="font-medium text-sm truncate">{title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(photo.created_at).toLocaleDateString("ro-RO")}
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" className="flex-1" onClick={() => handle(photo.id, approveCererePhoto)} disabled={isLoading}>
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Check className="h-4 w-4 mr-1" />Aprobă</>}
                    </Button>
                    <Button size="sm" variant="destructive" className="flex-1" onClick={() => handle(photo.id, rejectCererePhoto)} disabled={isLoading}>
                      <X className="h-4 w-4 mr-1" />Respinge
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
