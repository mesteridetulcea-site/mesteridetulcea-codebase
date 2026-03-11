"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Loader2, Check, X, FolderOpen, Upload } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import {
  approvePhoto,
  rejectPhoto,
  approveCererePhoto,
  rejectCererePhoto,
  approveProjectPhoto,
  rejectProjectPhoto,
} from "@/actions/admin"
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

const panel = {
  background: "white",
  border: "1px solid #e0c99a",
  borderRadius: "6px",
} as const

function ApproveBtn({ onClick, loading }: { onClick: () => void; loading: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex-1 flex items-center justify-center gap-1.5 h-9 font-condensed tracking-[0.1em] uppercase text-xs font-semibold transition-all duration-200 disabled:opacity-50"
      style={{
        background: "hsl(142 55% 42% / 0.1)",
        border: "1px solid hsl(142 55% 42% / 0.4)",
        color: "hsl(142 55% 42%)",
        borderRadius: "4px",
      }}
    >
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
      Aprobă
    </button>
  )
}

function RejectBtn({ onClick, loading }: { onClick: () => void; loading: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex-1 flex items-center justify-center gap-1.5 h-9 font-condensed tracking-[0.1em] uppercase text-xs font-semibold transition-all duration-200 disabled:opacity-50"
      style={{
        background: "hsl(0 62% 52% / 0.08)",
        border: "1px solid hsl(0 62% 52% / 0.35)",
        color: "hsl(0 62% 52%)",
        borderRadius: "4px",
      }}
    >
      <X className="h-3.5 w-3.5" />
      Respinge
    </button>
  )
}

export default function AdminPhotosPage() {
  const [tab, setTab]                       = useState<"mesteri" | "cereri">("mesteri")
  const [mesterPhotos, setMesterPhotos]     = useState<PhotoWithMester[]>([])
  const [projectPhotos, setProjectPhotos]   = useState<ProjectPhotoWithProject[]>([])
  const [cererePhotos, setCererePhotos]     = useState<CererePhotoWithCerere[]>([])
  const [loading, setLoading]               = useState(true)
  const [actionLoading, setActionLoading]   = useState<string | null>(null)

  useEffect(() => { loadAll() }, [])

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

  const tabList = [
    { key: "mesteri" as const, label: "Meșteri",  count: mesterTabCount },
    { key: "cereri"  as const, label: "Cereri",   count: cerereTabCount },
  ]

  return (
    <div>
      {/* Page header */}
      <div
        className="px-6 pt-8 pb-8 md:px-10 md:pt-10"
        style={{ borderBottom: "1px solid #e0c99a" }}
      >
        <p className="font-condensed tracking-[0.26em] uppercase text-xs text-primary/70 mb-2">
          Panou admin
        </p>
        <h1
          className="font-condensed text-[#1a0f05] leading-[1.1]"
          style={{ fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 600 }}
        >
          Aprobare fotografii
        </h1>
        <p className="text-sm text-[#8a6848] mt-2">
          {tab === "mesteri" ? mesterTabCount : cerereTabCount} fotografii în așteptare
        </p>
      </div>

      <div className="px-6 py-8 md:px-10 space-y-6">

        {/* Tabs */}
        <div
          className="flex gap-1"
          style={{ borderBottom: "1px solid #e0c99a" }}
        >
          {tabList.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="flex items-center gap-2 px-4 py-2.5 font-condensed tracking-[0.1em] uppercase text-xs font-semibold transition-all duration-200"
              style={{
                borderBottom: tab === t.key ? "2px solid hsl(38 68% 44%)" : "2px solid transparent",
                marginBottom: "-1px",
                color: tab === t.key ? "hsl(38 68% 44%)" : "#8a6848",
              }}
            >
              {t.label}
              {t.count > 0 && (
                <span
                  className="font-condensed text-[10px] px-1.5 py-0.5 leading-none"
                  style={{
                    background: tab === t.key ? "hsl(38 68% 44% / 0.15)" : "#f0e8d8",
                    color: tab === t.key ? "hsl(38 68% 44%)" : "#8a6848",
                    borderRadius: "4px",
                    border: tab === t.key ? "1px solid hsl(38 68% 44% / 0.35)" : "1px solid #e0c99a",
                  }}
                >
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : tab === "mesteri" ? (
          mesterTabCount === 0 ? (
            <div className="py-16 flex flex-col items-center gap-3" style={panel}>
              <Upload className="h-8 w-8 text-[#d4c0a0]" />
              <p className="font-condensed tracking-[0.14em] uppercase text-sm text-[#b8956a]">
                Nu există fotografii în așteptare
              </p>
            </div>
          ) : (
            <div className="space-y-8">

              {/* Profile photos */}
              {mesterPhotos.length > 0 && (
                <div>
                  <p className="font-condensed tracking-[0.22em] uppercase text-xs text-[#8a6848] mb-3">
                    Fotografii profil ({mesterPhotos.length})
                  </p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {mesterPhotos.map((photo) => {
                      const isLoading = actionLoading === photo.id
                      return (
                        <div key={photo.id} style={{ ...panel, overflow: "hidden" }}>
                          <div className="relative aspect-[4/3]" style={{ background: "#f0e8d8" }}>
                            <Image
                              src={photo.public_url}
                              alt={photo.caption || "Fotografie"}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="p-4">
                            <p className="font-condensed tracking-[0.06em] text-sm font-semibold text-[#1a0f05] truncate">
                              {photo.mester?.display_name || "Unknown"}
                            </p>
                            {photo.caption && (
                              <p className="text-xs text-[#8a6848] truncate mt-0.5">{photo.caption}</p>
                            )}
                            <p className="text-xs text-[#b8956a] mt-0.5">
                              {new Date(photo.created_at).toLocaleDateString("ro-RO")}
                            </p>
                            <div className="flex gap-2 mt-3">
                              <ApproveBtn onClick={() => handle(photo.id, approvePhoto)} loading={isLoading} />
                              <RejectBtn  onClick={() => handle(photo.id, rejectPhoto)}  loading={isLoading} />
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Project photos */}
              {projectPhotos.length > 0 && (
                <div>
                  <p className="font-condensed tracking-[0.22em] uppercase text-xs text-[#8a6848] mb-3 flex items-center gap-2">
                    <FolderOpen className="h-3.5 w-3.5" />
                    Fotografii proiecte ({projectPhotos.length})
                  </p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {projectPhotos.map((photo) => {
                      const isLoading = actionLoading === photo.id
                      return (
                        <div key={photo.id} style={{ ...panel, overflow: "hidden" }}>
                          <div className="relative aspect-[4/3]" style={{ background: "#f0e8d8" }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={photo.url}
                              alt="Fotografie proiect"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-4">
                            <p className="font-condensed tracking-[0.06em] text-sm font-semibold text-[#1a0f05] truncate">
                              {photo.project?.mester?.display_name || "Unknown"}
                            </p>
                            <p className="text-xs text-[#8a6848] truncate mt-0.5">
                              {photo.project?.title || "Proiect"}
                            </p>
                            <p className="text-xs text-[#b8956a] mt-0.5">
                              {new Date(photo.created_at).toLocaleDateString("ro-RO")}
                            </p>
                            <div className="flex gap-2 mt-3">
                              <ApproveBtn onClick={() => handle(photo.id, approveProjectPhoto)} loading={isLoading} />
                              <RejectBtn  onClick={() => handle(photo.id, rejectProjectPhoto)}  loading={isLoading} />
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

            </div>
          )
        ) : cererePhotos.length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-3" style={panel}>
            <Upload className="h-8 w-8 text-[#d4c0a0]" />
            <p className="font-condensed tracking-[0.14em] uppercase text-sm text-[#b8956a]">
              Nu există fotografii în așteptare
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {cererePhotos.map((photo) => {
              const isLoading = actionLoading === photo.id
              const title =
                photo.cerere?.title ||
                photo.cerere?.original_message?.slice(0, 40) ||
                "Cerere"
              return (
                <div key={photo.id} style={{ ...panel, overflow: "hidden" }}>
                  <div className="relative aspect-[4/3]" style={{ background: "#f0e8d8" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo.url} alt="Fotografie cerere" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <p className="font-condensed tracking-[0.06em] text-sm font-semibold text-[#1a0f05] truncate">{title}</p>
                    <p className="text-xs text-[#b8956a] mt-0.5">
                      {new Date(photo.created_at).toLocaleDateString("ro-RO")}
                    </p>
                    <div className="flex gap-2 mt-3">
                      <ApproveBtn onClick={() => handle(photo.id, approveCererePhoto)} loading={isLoading} />
                      <RejectBtn  onClick={() => handle(photo.id, rejectCererePhoto)}  loading={isLoading} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}
