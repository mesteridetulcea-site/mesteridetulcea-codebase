"use client"

import { useState, useEffect, useRef } from "react"
import { Search, ShieldOff, ShieldCheck, User, Loader2 } from "lucide-react"
import { getAdminUsers, banUser, unbanUser } from "@/actions/admin"
import { toast } from "@/lib/hooks/use-toast"

interface UserRow {
  id: string
  full_name: string | null
  email: string
  role: string
  is_banned: boolean
  avatar_url: string | null
  created_at: string
}

type Tab = "toti" | "clienti" | "mesteri" | "suspendati"

const roleLabel: Record<string, string> = {
  client: "Client",
  mester: "Meșter",
  admin: "Admin",
}

const roleColor: Record<string, string> = {
  client: "#b8956a",
  mester: "hsl(38 68% 44%)",
  admin: "#6366f1",
}

export default function AdminUsersPage() {
  const [users, setUsers]             = useState<UserRow[]>([])
  const [loading, setLoading]         = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [search, setSearch]           = useState("")
  const [activeTab, setActiveTab]     = useState<Tab>("toti")
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    userId: string
    userName: string
    action: "ban" | "unban"
  }>({ open: false, userId: "", userName: "", action: "ban" })

  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => { loadUsers() }, [])

  async function loadUsers(q?: string) {
    setLoading(true)
    const result = await getAdminUsers(q)
    if (result.error) {
      toast({ title: "Eroare", description: result.error, variant: "destructive" })
    } else {
      setUsers((result.data as UserRow[]) || [])
    }
    setLoading(false)
  }

  function handleSearchChange(value: string) {
    setSearch(value)
    if (searchTimeout.current) clearTimeout(searchTimeout.current)
    searchTimeout.current = setTimeout(() => loadUsers(value || undefined), 400)
  }

  function openConfirm(user: UserRow, action: "ban" | "unban") {
    setConfirmDialog({
      open: true,
      userId: user.id,
      userName: user.full_name || user.email,
      action,
    })
  }

  async function handleConfirm() {
    const { userId, action } = confirmDialog
    setConfirmDialog((d) => ({ ...d, open: false }))
    setActionLoading(userId)
    const result = action === "ban" ? await banUser(userId) : await unbanUser(userId)
    if (result.error) {
      toast({ title: "Eroare", description: result.error, variant: "destructive" })
    } else {
      toast({
        title: action === "ban" ? "Utilizator suspendat" : "Suspendare ridicată",
      })
      loadUsers(search || undefined)
    }
    setActionLoading(null)
  }

  const filtered = users.filter((u) => {
    if (activeTab === "clienti") return u.role === "client" && !u.is_banned
    if (activeTab === "mesteri") return u.role === "mester"
    if (activeTab === "suspendati") return u.is_banned
    return true
  })

  const counts = {
    toti: users.length,
    clienti: users.filter((u) => u.role === "client" && !u.is_banned).length,
    mesteri: users.filter((u) => u.role === "mester").length,
    suspendati: users.filter((u) => u.is_banned).length,
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "toti",       label: "Toți" },
    { id: "clienti",    label: "Clienți" },
    { id: "mesteri",    label: "Meșteri" },
    { id: "suspendati", label: "Suspendați" },
  ]

  return (
    <div className="p-6 md:p-8 max-w-5xl">

      {/* Header */}
      <div className="mb-8">
        <p className="font-condensed tracking-[0.28em] uppercase text-xs mb-2" style={{ color: "hsl(38 68% 44%)" }}>
          Administrare
        </p>
        <h1 className="font-display font-semibold text-[#1a0f05] mb-1" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>
          Utilizatori
        </h1>
        <p className="font-condensed tracking-wide text-[#8a6848]" style={{ fontSize: "12px" }}>
          Gestionează toți utilizatorii platformei. Poți suspenda sau reactiva orice cont.
        </p>
      </div>

      {/* Search + tabs row */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search */}
        <div
          className="relative flex-1 max-w-sm"
          style={{ border: "1px solid #e0c99a", background: "white" }}
        >
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ width: "14px", height: "14px", color: "#c4a97a" }}
          />
          <input
            type="text"
            placeholder="Caută după nume sau email..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full h-10 pl-9 pr-3 font-condensed tracking-wide text-[13px] text-[#1a0f05] placeholder:text-[#c4a97a] bg-transparent outline-none"
          />
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 flex-wrap">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-1.5 px-3 h-10 font-condensed tracking-[0.1em] uppercase transition-all duration-150"
                style={{
                  fontSize: "11px",
                  background: isActive ? "hsl(38 68% 44% / 0.1)" : "transparent",
                  border: isActive ? "1px solid hsl(38 68% 44% / 0.4)" : "1px solid #e0c99a",
                  color: isActive ? "hsl(38 68% 44%)" : "#8a6848",
                }}
              >
                {tab.label}
                <span
                  className="font-condensed text-[10px]"
                  style={{
                    background: isActive ? "hsl(38 68% 44% / 0.2)" : "#f5ede0",
                    color: isActive ? "hsl(38 68% 44%)" : "#b8956a",
                    padding: "1px 6px",
                  }}
                >
                  {counts[tab.id]}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin" style={{ color: "hsl(38 68% 44%)" }} />
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="py-16 text-center"
          style={{ border: "1px solid #e0c99a", background: "white" }}
        >
          <p className="font-condensed tracking-[0.18em] uppercase text-[#c4a97a]" style={{ fontSize: "12px" }}>
            Niciun utilizator găsit
          </p>
        </div>
      ) : (
        <div style={{ border: "1px solid #e0c99a", background: "white" }}>
          {filtered.map((user, i) => (
            <div
              key={user.id}
              className="flex items-center gap-4 px-5 py-4 transition-colors duration-150"
              style={{
                borderTop: i === 0 ? "none" : "1px solid #f0e4cc",
                background: user.is_banned ? "rgba(239,68,68,0.03)" : "white",
              }}
            >
              {/* Avatar */}
              <div
                className="shrink-0 w-9 h-9 overflow-hidden flex items-center justify-center"
                style={{
                  border: user.is_banned ? "1px solid rgba(239,68,68,0.3)" : "1px solid #e0c99a",
                  background: "hsl(38 68% 44% / 0.06)",
                }}
              >
                {user.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User style={{ width: "16px", height: "16px", color: "#c4a97a" }} />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="font-condensed tracking-[0.06em] text-[#1a0f05] font-semibold truncate"
                    style={{ fontSize: "13px" }}
                  >
                    {user.full_name || "—"}
                  </span>
                  {/* Role badge */}
                  <span
                    className="font-condensed tracking-[0.14em] uppercase shrink-0"
                    style={{
                      fontSize: "9px",
                      color: roleColor[user.role] ?? "#8a6848",
                      border: `1px solid ${roleColor[user.role] ?? "#e0c99a"}22`,
                      background: `${roleColor[user.role] ?? "#e0c99a"}11`,
                      padding: "1px 6px",
                    }}
                  >
                    {roleLabel[user.role] ?? user.role}
                  </span>
                  {user.is_banned && (
                    <span
                      className="font-condensed tracking-[0.14em] uppercase shrink-0"
                      style={{
                        fontSize: "9px",
                        color: "#ef4444",
                        border: "1px solid rgba(239,68,68,0.25)",
                        background: "rgba(239,68,68,0.06)",
                        padding: "1px 6px",
                      }}
                    >
                      Suspendat
                    </span>
                  )}
                </div>
                <p className="text-[#8a6848] truncate" style={{ fontSize: "11px", fontFamily: "var(--font-barlow)" }}>
                  {user.email}
                </p>
              </div>

              {/* Date */}
              <span
                className="hidden sm:block shrink-0 font-condensed tracking-wide text-[#b8956a]"
                style={{ fontSize: "11px" }}
              >
                {new Date(user.created_at).toLocaleDateString("ro-RO", {
                  day: "2-digit", month: "short", year: "numeric",
                })}
              </span>

              {/* Action */}
              {user.role !== "admin" && (
                <button
                  disabled={actionLoading === user.id}
                  onClick={() => openConfirm(user, user.is_banned ? "unban" : "ban")}
                  className="shrink-0 flex items-center gap-1.5 px-3 h-8 font-condensed tracking-[0.1em] uppercase transition-all duration-150"
                  style={{
                    fontSize: "10px",
                    ...(user.is_banned
                      ? {
                          background: "rgba(34,197,94,0.08)",
                          border: "1px solid rgba(34,197,94,0.3)",
                          color: "rgb(22 163 74)",
                        }
                      : {
                          background: "rgba(239,68,68,0.06)",
                          border: "1px solid rgba(239,68,68,0.25)",
                          color: "rgb(239 68 68)",
                        }),
                    cursor: actionLoading === user.id ? "not-allowed" : "pointer",
                    opacity: actionLoading === user.id ? 0.5 : 1,
                  }}
                >
                  {actionLoading === user.id ? (
                    <Loader2 style={{ width: "12px", height: "12px" }} className="animate-spin" />
                  ) : user.is_banned ? (
                    <>
                      <ShieldCheck style={{ width: "12px", height: "12px" }} />
                      Reactivează
                    </>
                  ) : (
                    <>
                      <ShieldOff style={{ width: "12px", height: "12px" }} />
                      Suspendă
                    </>
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Confirm dialog */}
      {confirmDialog.open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "rgba(0,0,0,0.55)" }}
          onClick={() => setConfirmDialog((d) => ({ ...d, open: false }))}
        >
          <div
            className="w-full max-w-sm p-6"
            style={{ background: "white", border: "1px solid #e0c99a" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Gold top accent */}
            <div style={{ height: "2px", background: "linear-gradient(90deg, #c4921e 30%, transparent 100%)", marginBottom: "20px" }} />

            <p className="font-condensed tracking-[0.24em] uppercase mb-2" style={{ fontSize: "10px", color: "hsl(38 68% 44%)" }}>
              Confirmare
            </p>
            <h3 className="font-display font-semibold text-[#1a0f05] mb-3" style={{ fontSize: "17px" }}>
              {confirmDialog.action === "ban" ? "Suspendă utilizatorul?" : "Reactivează contul?"}
            </h3>
            <p className="font-condensed tracking-wide text-[#6b4f35] mb-6" style={{ fontSize: "12px", lineHeight: "1.7" }}>
              {confirmDialog.action === "ban"
                ? `„${confirmDialog.userName}" va fi suspendat și nu va mai putea accesa platforma.`
                : `„${confirmDialog.userName}" va putea accesa din nou platforma.`}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDialog((d) => ({ ...d, open: false }))}
                className="flex-1 h-10 font-condensed tracking-[0.16em] uppercase transition-colors duration-150"
                style={{ fontSize: "11px", border: "1px solid #e0c99a", color: "#8a6848", background: "white" }}
              >
                Anulează
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 h-10 font-condensed tracking-[0.16em] uppercase transition-colors duration-150"
                style={{
                  fontSize: "11px",
                  ...(confirmDialog.action === "ban"
                    ? { background: "rgba(239,68,68,0.9)", border: "none", color: "white" }
                    : { background: "hsl(38 68% 44%)", border: "none", color: "white" }),
                }}
              >
                {confirmDialog.action === "ban" ? "Suspendă" : "Reactivează"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
