"use client"

import { useState, useRef } from "react"
import { compressImage } from "@/lib/utils/compress-image"

import { Loader2, Camera, User, Mail, Phone, Lock } from "lucide-react"
import { updateClientProfile } from "@/actions/mester"
import { toast } from "@/lib/hooks/use-toast"

interface ClientSettingsFormProps {
  avatarUrl: string | null
  initialData: {
    fullName: string
    phone: string
    email: string
  }
}

const inputCls =
  "w-full h-[52px] px-4 font-condensed tracking-[0.04em] text-[15px] text-[#1a0f05] placeholder:text-[#c4a97a] outline-none transition-all duration-200 " +
  "bg-[#faf6ed] border border-[#d4c0a0] focus:border-[#c4921e] focus:bg-white"

const labelCls = "block font-condensed tracking-[0.18em] uppercase text-[#6b4f35] mb-2 text-[11px]"

export function ClientSettingsForm({ avatarUrl: initialAvatarUrl, initialData }: ClientSettingsFormProps) {
  const [saving, setSaving]               = useState(false)
  const [avatarUrl, setAvatarUrl]         = useState<string | null>(initialAvatarUrl)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    fullName: initialData.fullName,
    phone:    initialData.phone,
  })

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const form = new FormData()
    form.append("fullName", formData.fullName)
    form.append("phone", formData.phone)
    const file = fileInputRef.current?.files?.[0]
    if (file) form.append("avatar", await compressImage(file))
    const result = await updateClientProfile(form)
    if (result.error) {
      toast({ title: "Eroare", description: result.error, variant: "destructive" })
    } else {
      toast({ title: "Salvat!", description: "Profilul a fost actualizat cu succes." })
      if (avatarPreview) {
        setAvatarUrl(avatarPreview)
        setAvatarPreview(null)
        if (fileInputRef.current) fileInputRef.current.value = ""
        window.dispatchEvent(new Event("profile-updated"))
      }
    }
    setSaving(false)
  }

  const displayedAvatar = avatarPreview ?? avatarUrl

  const SaveBtn = ({ full }: { full?: boolean }) => (
    <button
      type="submit"
      disabled={saving}
      className={`${full ? "w-full" : ""} h-[52px] flex items-center justify-center gap-2.5 font-condensed tracking-[0.22em] uppercase font-semibold transition-all duration-200`}
      style={{
        fontSize: "12px",
        background: saving ? "hsl(38 68% 44% / 0.6)" : "hsl(38 68% 44%)",
        color: "white",
        cursor: saving ? "not-allowed" : "pointer",
        boxShadow: saving ? "none" : "0 4px 24px hsl(38 68% 44% / 0.3)",
        minWidth: full ? undefined : "200px",
      }}
    >
      {saving ? (
        <>
          <Loader2 style={{ width: "14px", height: "14px" }} className="animate-spin" />
          Se salvează...
        </>
      ) : (
        "Salvează modificările"
      )}
    </button>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* ── Avatar card ── */}
      <div style={{ background: "white", border: "1px solid #e0c99a" }}>
        {/* Gold top accent */}
        <div style={{ height: "2px", background: "linear-gradient(90deg, #c4921e 30%, transparent 100%)" }} />

        <div className="p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar clickable square */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="relative shrink-0 group overflow-hidden transition-all duration-200"
            style={{
              width: "110px", height: "110px",
              border: "2px solid #c4921e",
              background: "hsl(38 68% 44% / 0.06)",
            }}
            aria-label="Schimbă poza de profil"
          >
            {displayedAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={displayedAvatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User style={{ width: "32px", height: "32px", color: "hsl(38 68% 44% / 0.45)" }} />
              </div>
            )}
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-[#0d0905]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-1.5">
              <Camera style={{ width: "18px", height: "18px", color: "white" }} />
              <span className="font-condensed tracking-[0.14em] uppercase text-white" style={{ fontSize: "9px" }}>Schimbă</span>
            </div>
          </button>

          <div className="flex-1 text-center sm:text-left">
            <p className="font-condensed tracking-[0.18em] uppercase text-[#1a0f05] font-semibold mb-1" style={{ fontSize: "13px" }}>
              Fotografie profil
            </p>
            <p className="font-condensed tracking-wide text-[#8a6848]" style={{ fontSize: "11px", lineHeight: "1.7" }}>
              {avatarPreview
                ? "Imagine nouă selectată — salvează pentru a aplica modificările"
                : "Apasă pe imagine pentru a o schimba. Formate acceptate: JPG, PNG, WebP · max 2 MB"}
            </p>
            {avatarPreview && (
              <button
                type="button"
                onClick={() => {
                  setAvatarPreview(null)
                  if (fileInputRef.current) fileInputRef.current.value = ""
                }}
                className="mt-2.5 font-condensed tracking-[0.14em] uppercase transition-colors duration-150"
                style={{ fontSize: "10px", color: "#b8956a" }}
              >
                × Anulează imaginea
              </button>
            )}
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleAvatarChange}
        />
      </div>

      {/* ── Informații personale ── */}
      <div style={{ background: "white", border: "1px solid #e0c99a" }}>
        {/* Gold top accent */}
        <div style={{ height: "2px", background: "linear-gradient(90deg, #c4921e 30%, transparent 100%)" }} />

        <div className="p-6 space-y-5">
          {/* Section header */}
          <div className="flex items-baseline gap-3 mb-6">
            <span
              className="font-display font-bold text-primary/[0.15] leading-none select-none"
              style={{ fontSize: "48px" }}
            >01</span>
            <div>
              <p className="font-condensed tracking-[0.24em] uppercase text-[#6b4f35]" style={{ fontSize: "11px" }}>
                Informații personale
              </p>
              <div className="mt-1 w-8 h-px bg-primary/30" />
            </div>
          </div>

          {/* Nume */}
          <div>
            <label htmlFor="fullName" className={labelCls}>
              Nume complet
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ width: "13px", height: "13px", color: "#b8956a" }} />
              <input
                id="fullName"
                className={inputCls}
                style={{ paddingLeft: "38px" }}
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Numele tău complet"
              />
            </div>
          </div>

          {/* Email — readonly */}
          <div>
            <label htmlFor="email" className={labelCls}>
              Adresă email
              <span className="ml-2 normal-case tracking-normal text-[#b8956a]" style={{ fontSize: "10px" }}>
                (nu poate fi modificat)
              </span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ width: "13px", height: "13px", color: "#d4c0a0" }} />
              <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ width: "11px", height: "11px", color: "#d4c0a0" }} />
              <input
                id="email"
                value={initialData.email}
                disabled
                className={inputCls}
                style={{ paddingLeft: "38px", paddingRight: "38px", opacity: 0.45, cursor: "not-allowed" }}
              />
            </div>
          </div>

          {/* Telefon */}
          <div>
            <label htmlFor="phone" className={labelCls}>
              Număr de telefon
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ width: "13px", height: "13px", color: "#b8956a" }} />
              <input
                id="phone"
                type="tel"
                className={inputCls}
                style={{ paddingLeft: "38px" }}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="07xx xxx xxx"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Desktop save button ── */}
      <div className="hidden md:block pt-2">
        <SaveBtn full />
      </div>

      {/* ── Mobile fixed save button (above bottom nav) ── */}
      <div
        className="md:hidden fixed inset-x-0 z-30 px-4 pt-3 pb-[72px]"
        style={{
          bottom: 0,
          background: "linear-gradient(to top, #faf6ed 50%, rgba(250,246,237,0.85) 80%, transparent 100%)",
          pointerEvents: "none",
        }}
      >
        <div style={{ pointerEvents: "auto" }}>
          <SaveBtn full />
        </div>
      </div>

    </form>
  )
}
