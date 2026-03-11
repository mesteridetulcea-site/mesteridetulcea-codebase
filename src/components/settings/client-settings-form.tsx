"use client"

import { useState, useRef } from "react"
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
  "w-full h-12 px-4 font-condensed tracking-[0.04em] text-[15px] text-[#1a0f05] placeholder:text-[#b8956a] outline-none transition-all duration-200 " +
  "bg-[#faf6ed] border border-[#d4c0a0] focus:border-[#c4921e] focus:bg-white"

const labelCls = "block font-condensed tracking-[0.18em] uppercase text-[#6b4f35] mb-2 text-[11px]"

export function ClientSettingsForm({ avatarUrl: initialAvatarUrl, initialData }: ClientSettingsFormProps) {
  const [saving, setSaving]             = useState(false)
  const [avatarUrl, setAvatarUrl]       = useState<string | null>(initialAvatarUrl)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    fullName: initialData.fullName,
    phone: initialData.phone,
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
    if (file) form.append("avatar", file)
    const result = await updateClientProfile(form)
    if (result.error) {
      toast({ title: "Eroare", description: result.error, variant: "destructive" })
    } else {
      toast({ title: "Salvat!", description: "Profilul a fost actualizat cu succes." })
      if (avatarPreview) {
        setAvatarUrl(avatarPreview)
        setAvatarPreview(null)
        if (fileInputRef.current) fileInputRef.current.value = ""
      }
    }
    setSaving(false)
  }

  const displayedAvatar = avatarPreview ?? avatarUrl

  return (
    <form onSubmit={handleSubmit} className="space-y-0">

      {/* ── Avatar section ── */}
      <div
        className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-6 mb-0"
        style={{ background: "white", border: "1px solid #e0c99a" }}
      >
        {/* Avatar square */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="relative shrink-0 group overflow-hidden transition-all duration-200"
          style={{
            width: "88px", height: "88px",
            border: "1px solid #c4921e",
            background: "hsl(38 68% 44% / 0.07)",
          }}
          aria-label="Schimbă poza de profil"
        >
          {displayedAvatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={displayedAvatar} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User style={{ width: "28px", height: "28px", color: "hsl(38 68% 44% / 0.5)" }} />
            </div>
          )}
          <div className="absolute inset-0 bg-[#0d0905]/55 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <Camera style={{ width: "18px", height: "18px", color: "white" }} />
          </div>
        </button>

        <div className="text-center sm:text-left">
          <p className="font-condensed tracking-[0.18em] uppercase text-[#1a0f05] font-semibold" style={{ fontSize: "13px" }}>
            Fotografie profil
          </p>
          <p className="font-condensed tracking-wide text-[#8a6848] mt-1" style={{ fontSize: "11px", lineHeight: "1.6" }}>
            {avatarPreview
              ? "Imagine nouă selectată — salvează pentru a aplica"
              : "JPG, PNG sau WebP · maxim 2MB"}
          </p>
          {avatarPreview && (
            <button
              type="button"
              onClick={() => { setAvatarPreview(null); if (fileInputRef.current) fileInputRef.current.value = "" }}
              className="mt-2 font-condensed tracking-[0.14em] uppercase transition-colors duration-150"
              style={{ fontSize: "10px", color: "#b8956a" }}
            >
              Anulează
            </button>
          )}
        </div>
        <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleAvatarChange} />
      </div>

      {/* ── Divider ── */}
      <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, #e0c99a 20%, #e0c99a 80%, transparent)" }} />

      {/* ── Fields section ── */}
      <div
        className="p-6 space-y-5"
        style={{ background: "white", border: "1px solid #e0c99a", borderTop: "none" }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-4 h-px bg-primary/40" />
          <span className="font-condensed tracking-[0.24em] uppercase text-[#8a6848]" style={{ fontSize: "11px" }}>
            Informații personale
          </span>
          <div className="flex-1 h-px bg-[#e0c99a]" />
        </div>

        {/* Nume */}
        <div>
          <label htmlFor="fullName" className={labelCls} style={{ fontSize: "11px" }}>
            Nume complet
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ width: "13px", height: "13px", color: "#b8956a" }} />
            <input
              id="fullName"
              className={inputCls}
              style={{ paddingLeft: "36px" }}
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="Numele tău complet"
            />
          </div>
        </div>

        {/* Email — readonly */}
        <div>
          <label htmlFor="email" className={labelCls} style={{ fontSize: "11px" }}>
            Adresă email
            <span className="ml-2 normal-case tracking-normal text-[#b8956a]" style={{ fontSize: "11px" }}>(nu poate fi modificat)</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ width: "13px", height: "13px", color: "#d4c0a0" }} />
            <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ width: "11px", height: "11px", color: "#d4c0a0" }} />
            <input
              id="email"
              value={initialData.email}
              disabled
              className={inputCls}
              style={{ paddingLeft: "36px", paddingRight: "36px", opacity: 0.5, cursor: "not-allowed" }}
            />
          </div>
        </div>

        {/* Telefon */}
        <div>
          <label htmlFor="phone" className={labelCls} style={{ fontSize: "11px" }}>
            Număr de telefon
          </label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ width: "13px", height: "13px", color: "#b8956a" }} />
            <input
              id="phone"
              type="tel"
              className={inputCls}
              style={{ paddingLeft: "36px" }}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="07xx xxx xxx"
            />
          </div>
        </div>
      </div>

      {/* ── Save button ── */}
      <div style={{ paddingTop: "16px" }}>
        <button
          type="submit"
          disabled={saving}
          className="w-full h-12 flex items-center justify-center gap-2.5 font-condensed tracking-[0.22em] uppercase font-semibold transition-all duration-200"
          style={{
            fontSize: "12px",
            background: saving ? "hsl(38 68% 44% / 0.6)" : "hsl(38 68% 44%)",
            color: "white",
            cursor: saving ? "not-allowed" : "pointer",
            boxShadow: saving ? "none" : "0 4px 20px hsl(38 68% 44% / 0.28)",
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
      </div>

    </form>
  )
}
