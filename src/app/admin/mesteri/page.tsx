"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Loader2, Check, X, Star, ExternalLink, Search } from "lucide-react"
import { approveMester, rejectMester, toggleMesterFeatured, getAdminMesters } from "@/actions/admin"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/lib/hooks/use-toast"
import type { ApprovalStatus, SubscriptionTier } from "@/types/database"
import { SUBSCRIPTION_TIERS } from "@/lib/constants"

interface MesterWithDetails {
  id: string
  display_name: string
  approval_status: ApprovalStatus
  subscription_tier: SubscriptionTier
  is_featured: boolean
  created_at: string
  mester_categories: { category: { name: string } | null }[]
  profile: { email: string; full_name: string | null } | null
}

const panel = {
  background: "white",
  border: "1px solid #e0c99a",
  borderRadius: "6px",
} as const

const tierColors: Record<string, string> = {
  ucenic:  "#b8956a",
  mester:  "hsl(38 68% 44%)",
  master:  "hsl(38 80% 42%)",
  premium: "hsl(38 90% 38%)",
}

export default function AdminMestersPage() {
  const [mesters, setMesters]               = useState<MesterWithDetails[]>([])
  const [loading, setLoading]               = useState(true)
  const [actionLoading, setActionLoading]   = useState<string | null>(null)
  const [activeTab, setActiveTab]           = useState<"pending" | "approved" | "rejected">("pending")
  const [search, setSearch]                 = useState("")
  const [rejectDialog, setRejectDialog]     = useState<{ open: boolean; mesterId: string; mesterName: string }>({ open: false, mesterId: "", mesterName: "" })
  const [rejectReason, setRejectReason]     = useState("")

  useEffect(() => { loadMesters() }, [])

  async function loadMesters() {
    setLoading(true)
    const result = await getAdminMesters()
    if (result.error) {
      toast({ title: "Eroare", description: result.error, variant: "destructive" })
    } else {
      setMesters((result.data as MesterWithDetails[]) || [])
    }
    setLoading(false)
  }

  async function handleApprove(mesterId: string) {
    setActionLoading(mesterId)
    const result = await approveMester(mesterId)
    if (result.error) {
      toast({ title: "Eroare", description: result.error, variant: "destructive" })
    } else {
      toast({ title: "Meșter aprobat!" })
      loadMesters()
    }
    setActionLoading(null)
  }

  function openRejectDialog(mesterId: string, mesterName: string) {
    setRejectReason("")
    setRejectDialog({ open: true, mesterId, mesterName })
  }

  async function handleRejectConfirm() {
    const { mesterId } = rejectDialog
    setRejectDialog((d) => ({ ...d, open: false }))
    setActionLoading(mesterId)
    const result = await rejectMester(mesterId, rejectReason || undefined)
    if (result.error) {
      toast({ title: "Eroare", description: result.error, variant: "destructive" })
    } else {
      toast({ title: "Meșter respins" })
      loadMesters()
    }
    setActionLoading(null)
  }

  async function handleToggleFeatured(mesterId: string) {
    setActionLoading(mesterId)
    const result = await toggleMesterFeatured(mesterId)
    if (result.error) {
      toast({ title: "Eroare", description: result.error, variant: "destructive" })
    } else {
      toast({ title: result.isFeatured ? "Meșter promovat!" : "Promovare eliminată" })
      loadMesters()
    }
    setActionLoading(null)
  }

  const q = search.trim().toLowerCase()

  function filterBySearch(list: MesterWithDetails[]) {
    if (!q) return list
    return list.filter((m) =>
      m.display_name.toLowerCase().includes(q) ||
      (m.profile?.email ?? "").toLowerCase().includes(q) ||
      (m.mester_categories?.[0]?.category?.name ?? "").toLowerCase().includes(q)
    )
  }

  const pendingMesters  = filterBySearch(mesters.filter((m) => m.approval_status === "pending"))
  const approvedMesters = filterBySearch(mesters.filter((m) => m.approval_status === "approved"))
  const rejectedMesters = filterBySearch(mesters.filter((m) => m.approval_status === "rejected"))

  const tabList = [
    { key: "pending",  label: "În așteptare", count: pendingMesters.length },
    { key: "approved", label: "Aprobați",     count: approvedMesters.length },
    { key: "rejected", label: "Respinși",     count: rejectedMesters.length },
  ] as const

  const visibleMesters =
    activeTab === "pending"  ? pendingMesters  :
    activeTab === "approved" ? approvedMesters :
    rejectedMesters

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
          Panou admin
        </p>
        <h1
          className="font-condensed text-[#1a0f05] leading-[1.1]"
          style={{ fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 600 }}
        >
          Gestionare meșteri
        </h1>
        <p className="text-sm text-[#8a6848] mt-2">
          Aprobă sau respinge cererile de înregistrare
        </p>
      </div>

      <div className="px-6 py-8 md:px-10 space-y-6">

        {/* Search */}
        <div className="relative max-w-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none"
            style={{ color: "#b8956a" }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Caută după nume, email sau categorie…"
            className="w-full h-10 pl-9 pr-4 text-sm outline-none transition-colors"
            style={{
              background: "#faf6ed",
              border: "1px solid #d4c0a0",
              borderRadius: "6px",
              color: "#1a0f05",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "hsl(38 68% 44% / 0.6)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#d4c0a0")}
          />
        </div>

        {/* Tabs */}
        <div
          className="flex gap-1"
          style={{ borderBottom: "1px solid #e0c99a" }}
        >
          {tabList.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex items-center gap-2 px-4 py-2.5 font-condensed tracking-[0.1em] uppercase text-xs font-semibold transition-all duration-200"
              style={{
                borderBottom: activeTab === tab.key ? "2px solid hsl(38 68% 44%)" : "2px solid transparent",
                marginBottom: "-1px",
                color: activeTab === tab.key ? "hsl(38 68% 44%)" : "#8a6848",
              }}
            >
              {tab.label}
              {tab.count > 0 && (
                <span
                  className="font-condensed text-[10px] px-1.5 py-0.5 leading-none"
                  style={{
                    background: activeTab === tab.key ? "hsl(38 68% 44% / 0.15)" : "#f0e8d8",
                    color: activeTab === tab.key ? "hsl(38 68% 44%)" : "#8a6848",
                    borderRadius: "4px",
                    border: activeTab === tab.key ? "1px solid hsl(38 68% 44% / 0.35)" : "1px solid #e0c99a",
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Mester list */}
        {visibleMesters.length === 0 ? (
          <div
            className="py-16 flex flex-col items-center gap-3"
            style={panel}
          >
            <p className="font-condensed tracking-[0.14em] uppercase text-sm text-[#b8956a]">
              {q ? `Niciun rezultat pentru „${search}"` : "Nu există meșteri în această categorie"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {visibleMesters.map((mester) => {
              const isLoadingCard = actionLoading === mester.id
              const isPending     = mester.approval_status === "pending"
              const categoryName  = mester.mester_categories?.[0]?.category?.name
              const tierColor     = tierColors[mester.subscription_tier] || "#b8956a"

              return (
                <div key={mester.id} style={panel}>
                  <div className="px-5 py-4 flex items-start justify-between gap-4 flex-wrap">

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
                        <h3 className="font-condensed tracking-[0.06em] text-[#1a0f05] font-semibold" style={{ fontSize: "16px" }}>
                          {mester.display_name}
                        </h3>
                        {/* Tier badge */}
                        <span
                          className="font-condensed tracking-[0.16em] uppercase text-[10px] px-2 py-0.5"
                          style={{
                            color: tierColor,
                            background: `${tierColor}14`,
                            border: `1px solid ${tierColor}40`,
                            borderRadius: "4px",
                          }}
                        >
                          {SUBSCRIPTION_TIERS[mester.subscription_tier].label}
                        </span>
                        {mester.is_featured && (
                          <span
                            className="font-condensed tracking-[0.14em] uppercase text-[10px] px-2 py-0.5"
                            style={{
                              color: "hsl(38 80% 42%)",
                              background: "hsl(38 80% 42% / 0.12)",
                              border: "1px solid hsl(38 80% 42% / 0.4)",
                              borderRadius: "4px",
                            }}
                          >
                            Promovat
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[#8a6848]">
                        {categoryName || "Fără categorie"} · {mester.profile?.email || "—"}
                      </p>
                      <p className="text-xs text-[#b8956a] mt-0.5">
                        Înregistrat la {new Date(mester.created_at).toLocaleDateString("ro-RO")}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                      <Link
                        href={`/mester/${mester.id}`}
                        target="_blank"
                        className="flex items-center gap-1.5 px-3 h-9 font-condensed tracking-[0.1em] uppercase text-xs text-[#8a6848] hover:text-[#3d2810] transition-colors"
                        style={{ border: "1px solid #e0c99a", borderRadius: "4px" }}
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Profil
                      </Link>

                      {isPending ? (
                        <>
                          <button
                            onClick={() => handleApprove(mester.id)}
                            disabled={isLoadingCard}
                            className="flex items-center gap-1.5 px-4 h-9 font-condensed tracking-[0.1em] uppercase text-xs font-semibold transition-all duration-200 disabled:opacity-50"
                            style={{
                              background: "hsl(142 55% 42% / 0.12)",
                              border: "1px solid hsl(142 55% 42% / 0.45)",
                              color: "hsl(142 55% 42%)",
                              borderRadius: "4px",
                            }}
                          >
                            {isLoadingCard
                              ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              : <Check className="h-3.5 w-3.5" />}
                            Aprobă
                          </button>
                          <button
                            onClick={() => openRejectDialog(mester.id, mester.display_name)}
                            disabled={isLoadingCard}
                            className="flex items-center gap-1.5 px-4 h-9 font-condensed tracking-[0.1em] uppercase text-xs font-semibold transition-all duration-200 disabled:opacity-50"
                            style={{
                              background: "hsl(0 62% 52% / 0.1)",
                              border: "1px solid hsl(0 62% 52% / 0.4)",
                              color: "hsl(0 62% 52%)",
                              borderRadius: "4px",
                            }}
                          >
                            <X className="h-3.5 w-3.5" />
                            Respinge
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleToggleFeatured(mester.id)}
                          disabled={isLoadingCard}
                          className="flex items-center gap-1.5 px-4 h-9 font-condensed tracking-[0.1em] uppercase text-xs font-semibold transition-all duration-200 disabled:opacity-50"
                          style={{
                            background: mester.is_featured ? "hsl(38 68% 44% / 0.12)" : "#faf6ed",
                            border: mester.is_featured ? "1px solid hsl(38 68% 44% / 0.4)" : "1px solid #e0c99a",
                            color: mester.is_featured ? "hsl(38 68% 44%)" : "#8a6848",
                            borderRadius: "4px",
                          }}
                        >
                          {isLoadingCard
                            ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            : <Star className={`h-3.5 w-3.5 ${mester.is_featured ? "fill-current" : ""}`} />}
                          {mester.is_featured ? "Nepromovat" : "Promovează"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

      </div>

      {/* Reject dialog — inline overlay */}
      {rejectDialog.open && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ background: "rgba(10,6,2,0.6)" }}
        >
          <div
            className="w-full max-w-md"
            style={{ background: "white", border: "1px solid #e0c99a", borderRadius: "8px" }}
          >
            <div className="px-6 py-5" style={{ borderBottom: "1px solid #e0c99a" }}>
              <p className="font-condensed tracking-[0.14em] uppercase text-sm font-semibold text-[#3d2810]">
                Respinge meșter
              </p>
            </div>
            <div className="px-6 py-5 space-y-4">
              <p className="text-sm text-[#8a6848]">
                Ești sigur că vrei să respingi cererea lui{" "}
                <span className="font-semibold text-[#3d2810]">{rejectDialog.mesterName}</span>?
              </p>
              <div>
                <p className="font-condensed tracking-[0.14em] uppercase text-xs text-[#8a6848] mb-1.5">
                  Motiv (opțional)
                </p>
                <Textarea
                  className="bg-[#faf6ed] border-[#d4c0a0] text-[#1a0f05] placeholder:text-[#b8956a] focus-visible:ring-0 focus-visible:ring-offset-0 rounded-[4px] resize-none text-sm"
                  placeholder="Explică de ce cererea a fost respinsă..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <div
              className="px-6 py-4 flex gap-3 justify-end"
              style={{ borderTop: "1px solid #e0c99a" }}
            >
              <button
                onClick={() => setRejectDialog((d) => ({ ...d, open: false }))}
                className="px-5 h-10 font-condensed tracking-[0.12em] uppercase text-xs text-[#8a6848] hover:text-[#3d2810] transition-colors"
                style={{ border: "1px solid #e0c99a", borderRadius: "4px" }}
              >
                Anulează
              </button>
              <button
                onClick={handleRejectConfirm}
                className="px-5 h-10 font-condensed tracking-[0.12em] uppercase text-xs font-semibold transition-all duration-200"
                style={{
                  background: "hsl(0 62% 52% / 0.1)",
                  border: "1px solid hsl(0 62% 52% / 0.4)",
                  color: "hsl(0 62% 52%)",
                  borderRadius: "4px",
                }}
              >
                Respinge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
