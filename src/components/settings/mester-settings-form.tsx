"use client"

import { useState, useRef, useEffect } from "react"
import { compressImage } from "@/lib/utils/compress-image"

import { Loader2, Camera, User, Briefcase, MessageCircle, MapPin, Clock, FileText, Lock, Plus } from "lucide-react"
import Link from "next/link"
import { updateMesterProfile } from "@/actions/mester"
import { createClient } from "@/lib/supabase/client"
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
    categoryIds: string[]
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
  // locked = categories from DB, cannot be removed — loaded fresh client-side
  const [lockedCategoryIds, setLockedCategoryIds] = useState<string[]>(initialData.categoryIds)
  // extra = newly added categories this session
  const [extraCategoryIds, setExtraCategoryIds] = useState<string[]>([])

  // Load current categories fresh from DB (avoids RLS / cache issues with server props)
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      const { data: mesterRow } = await supabase
        .from("mester_profiles")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle() as { data: { id: string } | null }
      if (!mesterRow) return
      const { data: cats } = await supabase
        .from("mester_categories")
        .select("category_id")
        .eq("mester_id", mesterRow.id) as { data: { category_id: string }[] | null }
      if (cats && cats.length > 0) {
        setLockedCategoryIds(cats.map((c) => c.category_id))
      }
    })
  }, [])
  const [formData, setFormData] = useState({
    businessName: initialData.businessName,
    description: initialData.description,
    experienceYears: initialData.experienceYears,
    whatsappNumber: initialData.whatsappNumber,
    address: initialData.address,
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
    Object.entries(formData).forEach(([key, value]) => form.append(key, value))
    ;[...lockedCategoryIds, ...extraCategoryIds].forEach((id) => form.append("categoryId", id))
    const file = fileInputRef.current?.files?.[0]
    if (file) form.append("avatar", await compressImage(file))
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

        {/* Categorii */}
        <div>
          <p className={labelCls} style={{ fontSize: "11px" }}>Calificări / Categorii</p>

          {/* Locked categories */}
          {lockedCategoryIds.length > 0 && (
            <div className="mb-3">
              <div className="flex flex-wrap gap-2 mb-2">
                {lockedCategoryIds.map((id) => {
                  const cat = categories.find((c) => c.id === id)
                  return cat ? (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1.5 font-condensed tracking-[0.12em] uppercase px-3 py-1.5"
                      style={{ fontSize: "11px", border: "1px solid #d4c0a0", background: "#f5eed8", color: "#7a5a18" }}
                    >
                      <Lock style={{ width: "9px", height: "9px", color: "#b8956a" }} />
                      {cat.name}
                    </span>
                  ) : null
                })}
              </div>
              {/* Info message */}
              <div
                className="flex items-start gap-2.5 px-3 py-2.5"
                style={{ background: "rgba(160,112,32,0.06)", border: "1px solid rgba(160,112,32,0.18)" }}
              >
                <Lock style={{ width: "11px", height: "11px", color: "#a07828", marginTop: "2px", flexShrink: 0 }} />
                <p className="font-condensed tracking-wide leading-relaxed" style={{ fontSize: "11px", color: "#8a6848" }}>
                  Categoriile principale pot fi modificate doar prin contact direct.{" "}
                  <a href="mailto:contact@mesteridetulcea.ro?subject=Modificare%20categorii%20profil" className="underline underline-offset-2" style={{ color: "#a07828" }}>
                    Trimite un email
                  </a>
                  .
                </p>
              </div>
            </div>
          )}

          {/* Addable categories */}
          {categories.filter((c) => !lockedCategoryIds.includes(c.id)).length > 0 && (
            <div>
              <p className="font-condensed tracking-[0.16em] uppercase mb-2" style={{ fontSize: "10px", color: "#b8956a" }}>
                <Plus style={{ display: "inline", width: "9px", height: "9px", marginRight: "4px", verticalAlign: "middle" }} />
                Adaugă calificări suplimentare
              </p>
              <div className="flex flex-wrap gap-2">
                {categories
                  .filter((c) => !lockedCategoryIds.includes(c.id))
                  .map((cat) => {
                    const active = extraCategoryIds.includes(cat.id)
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() =>
                          setExtraCategoryIds(
                            active ? extraCategoryIds.filter((x) => x !== cat.id) : [...extraCategoryIds, cat.id]
                          )
                        }
                        className="font-condensed tracking-[0.12em] uppercase transition-colors duration-150 px-3 py-1.5"
                        style={{
                          fontSize: "11px",
                          border: `1px solid ${active ? "#a07828" : "#d4c0a0"}`,
                          background: active ? "rgba(160,112,32,0.1)" : "transparent",
                          color: active ? "#7a5a18" : "#b8956a",
                          cursor: "pointer",
                        }}
                      >
                        {active ? "✓ " : ""}{cat.name}
                      </button>
                    )
                  })}
              </div>
            </div>
          )}
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
                placeholder="40758065244"
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
