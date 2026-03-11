"use client"

import { useState, useRef } from "react"
import { Loader2, Camera, User, Briefcase, MessageCircle, MapPin, Clock, FileText } from "lucide-react"
import { updateMesterProfile } from "@/actions/mester"
import { toast } from "@/lib/hooks/use-toast"
import type { Category } from "@/types/database"

interface MesterSettingsFormProps {
  avatarUrl: string | null
  categories: Category[]
  initialData: {
    businessName: string
    description: string
    experienceYears: string
    whatsappNumber: string
    address: string
    categoryId: string
  }
}

const inputCls =
  "w-full h-12 px-4 font-condensed tracking-[0.04em] text-[15px] text-[#1a0f05] placeholder:text-[#b8956a] outline-none transition-all duration-200 " +
  "bg-[#faf6ed] border border-[#d4c0a0] focus:border-[#c4921e] focus:bg-white"

const labelCls = "block font-condensed tracking-[0.18em] uppercase text-[#6b4f35] mb-2 text-[11px]"

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-5 pt-1">
      <div className="w-4 h-px bg-primary/40" />
      <span className="font-condensed tracking-[0.24em] uppercase text-[#8a6848]" style={{ fontSize: "11px" }}>
        {label}
      </span>
      <div className="flex-1 h-px bg-[#e0c99a]" />
    </div>
  )
}

export function MesterSettingsForm({ avatarUrl: initialAvatarUrl, categories, initialData }: MesterSettingsFormProps) {
  const [saving, setSaving]               = useState(false)
  const [avatarUrl, setAvatarUrl]         = useState<string | null>(initialAvatarUrl)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState(initialData)

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const form = new FormData()
    Object.entries(formData).forEach(([key, value]) => form.append(key, value))
    const file = fileInputRef.current?.files?.[0]
    if (file) form.append("avatar", file)
    const result = await updateMesterProfile(form)
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

  return (
    <form onSubmit={handleSubmit} className="space-y-0">

      {/* ── Avatar section ── */}
      <div
        className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-6"
        style={{ background: "white", border: "1px solid #e0c99a" }}
      >
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
            {avatarPreview ? "Imagine nouă selectată — salvează pentru a aplica" : "JPG, PNG sau WebP · maxim 2MB"}
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

      <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, #e0c99a 20%, #e0c99a 80%, transparent)" }} />

      {/* ── Identitate profesională ── */}
      <div
        className="p-6 space-y-5"
        style={{ background: "white", border: "1px solid #e0c99a", borderTop: "none" }}
      >
        <SectionDivider label="Identitate profesională" />

        {/* Nume firmă */}
        <div>
          <label htmlFor="businessName" className={labelCls} style={{ fontSize: "11px" }}>
            Nume firmă / Afacere <span className="text-primary">*</span>
          </label>
          <div className="relative">
            <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ width: "13px", height: "13px", color: "#b8956a" }} />
            <input
              id="businessName"
              required
              className={inputCls}
              style={{ paddingLeft: "36px" }}
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              placeholder="Numele afacerii tale"
            />
          </div>
        </div>

        {/* Categorie */}
        <div>
          <label htmlFor="categoryId" className={labelCls} style={{ fontSize: "11px" }}>
            Categorie <span className="text-primary">*</span>
          </label>
          <select
            id="categoryId"
            required
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            className={inputCls}
            style={{ appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23b8956a' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center" }}
          >
            <option value="">Selectează categoria</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Descriere */}
        <div>
          <label htmlFor="description" className={labelCls} style={{ fontSize: "11px" }}>
            Descriere servicii
          </label>
          <div className="relative">
            <FileText className="absolute left-3.5 top-3.5 pointer-events-none" style={{ width: "13px", height: "13px", color: "#b8956a" }} />
            <textarea
              id="description"
              rows={4}
              className={`${inputCls} resize-none`}
              style={{ paddingLeft: "36px", height: "auto", paddingTop: "10px" }}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descrie serviciile pe care le oferi, experiența ta, etc."
            />
          </div>
        </div>
      </div>

      <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, #e0c99a 20%, #e0c99a 80%, transparent)" }} />

      {/* ── Contact și locație ── */}
      <div
        className="p-6 space-y-5"
        style={{ background: "white", border: "1px solid #e0c99a", borderTop: "none" }}
      >
        <SectionDivider label="Contact și locație" />

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Experiență */}
          <div>
            <label htmlFor="experienceYears" className={labelCls} style={{ fontSize: "11px" }}>
              Ani de experiență
            </label>
            <div className="relative">
              <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ width: "13px", height: "13px", color: "#b8956a" }} />
              <input
                id="experienceYears"
                type="number"
                min="0"
                className={inputCls}
                style={{ paddingLeft: "36px" }}
                value={formData.experienceYears}
                onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                placeholder="0"
              />
            </div>
          </div>

          {/* WhatsApp */}
          <div>
            <label htmlFor="whatsappNumber" className={labelCls} style={{ fontSize: "11px" }}>
              Număr WhatsApp
            </label>
            <div className="relative">
              <MessageCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ width: "13px", height: "13px", color: "#b8956a" }} />
              <input
                id="whatsappNumber"
                type="tel"
                className={inputCls}
                style={{ paddingLeft: "36px" }}
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                placeholder="40712345678"
              />
            </div>
          </div>
        </div>

        {/* Adresă */}
        <div>
          <label htmlFor="address" className={labelCls} style={{ fontSize: "11px" }}>
            Adresă / Zonă
          </label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ width: "13px", height: "13px", color: "#b8956a" }} />
            <input
              id="address"
              className={inputCls}
              style={{ paddingLeft: "36px" }}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Strada, număr sau zonă"
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
