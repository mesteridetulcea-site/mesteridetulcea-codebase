"use client"

import { useState, useEffect, useRef } from "react"
import { Loader2, Camera, User } from "lucide-react"
import { getMesterProfile, updateMesterProfile } from "@/actions/mester"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/lib/hooks/use-toast"
import type { Category } from "@/types/database"

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

async function compressImage(file: File): Promise<File> {
  const MAX_WIDTH = 1920
  const QUALITY = 0.82
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const scale = img.width > MAX_WIDTH ? MAX_WIDTH / img.width : 1
      const canvas = document.createElement("canvas")
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      const ctx = canvas.getContext("2d")!
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      canvas.toBlob(
        (blob) => resolve(blob ? new File([blob], file.name.replace(/\.\w+$/, ".jpg"), { type: "image/jpeg" }) : file),
        "image/jpeg",
        QUALITY
      )
    }
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file) }
    img.src = url
  })
}

export default function MesterProfilePage() {
  const [loading, setLoading]             = useState(true)
  const [saving, setSaving]               = useState(false)
  const [categories, setCategories]       = useState<Category[]>([])
  const [avatarUrl, setAvatarUrl]         = useState<string | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const fileInputRef                      = useRef<HTMLInputElement>(null)
  const [categoryIds, setCategoryIds]     = useState<string[]>([])
  const [formData, setFormData]           = useState({
    businessName:    "",
    description:     "",
    experienceYears: "",
    whatsappNumber:  "",
    address:         "",
  })

  useEffect(() => {
    async function loadData() {
      const supabase = createClient()
      const { data: cats } = await supabase
        .from("categories").select("*").order("sort_order")
      setCategories(cats || [])

      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from("profiles").select("avatar_url").eq("id", user.id).single() as
          { data: { avatar_url: string | null } | null }
        setAvatarUrl(profile?.avatar_url ?? null)
      }

      const mester = await getMesterProfile()
      if (mester) {
        setFormData({
          businessName:    mester.display_name || "",
          description:     mester.bio || "",
          experienceYears: mester.years_experience?.toString() || "",
          whatsappNumber:  mester.whatsapp_number || "",
          address:         mester.neighborhood || "",
        })
        setCategoryIds(mester.mester_categories?.map((c) => c.category_id) || [])
      }
      setLoading(false)
    }
    loadData()
  }, [])

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const form = new FormData()
    Object.entries(formData).forEach(([k, v]) => form.append(k, v))
    categoryIds.forEach((id) => form.append("categoryId", id))
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
          Panou meșter
        </p>
        <h1
          className="font-condensed text-[#1a0f05] leading-[1.1]"
          style={{ fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 600 }}
        >
          Profilul meu
        </h1>
        <p className="text-sm text-[#8a6848] mt-2">
          Actualizează informațiile despre serviciile tale
        </p>
      </div>

      <div className="px-6 py-8 md:px-10">
        <div className="max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Avatar panel */}
            <div style={panel}>
              <div className="px-6 py-4" style={{ borderBottom: "1px solid #e0c99a" }}>
                <p className="font-condensed tracking-[0.14em] uppercase text-sm font-semibold text-[#3d2810]">
                  Fotografie profil
                </p>
              </div>
              <div className="px-6 py-6 flex flex-col items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="relative group h-24 w-24 overflow-hidden border-2 border-dashed hover:border-primary transition-colors focus:outline-none"
                  style={{ borderRadius: "50%", borderColor: "#d4c0a0" }}
                  aria-label="Schimbă poza de profil"
                >
                  {displayedAvatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={displayedAvatar} alt="Poza de profil" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full" style={{ background: "#f0e8d8" }}>
                      <User className="h-8 w-8 text-[#b8956a]" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="h-5 w-5 text-white" />
                  </div>
                </button>
                <p className="text-xs text-[#b8956a] text-center">
                  {avatarPreview
                    ? "Imagine nouă selectată — salvează pentru a aplica"
                    : "Apasă pentru a schimba · JPG, PNG, WebP · max 2 MB"}
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
            </div>

            {/* Business info panel */}
            <div style={panel}>
              <div className="px-6 py-4" style={{ borderBottom: "1px solid #e0c99a" }}>
                <p className="font-condensed tracking-[0.14em] uppercase text-sm font-semibold text-[#3d2810]">
                  Informații business
                </p>
                <p className="text-xs text-[#8a6848] mt-0.5">
                  Aceste informații vor fi afișate pe profilul tău public
                </p>
              </div>

              <div className="px-6 py-6 space-y-5">

                <div>
                  <FieldLabel>Nume firmă / Afacere *</FieldLabel>
                  <Input
                    className={inputCls}
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <FieldLabel>Calificări / Categorii *</FieldLabel>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {categories.map((cat) => {
                      const active = categoryIds.includes(cat.id)
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() =>
                            setCategoryIds(
                              active ? categoryIds.filter((x) => x !== cat.id) : [...categoryIds, cat.id]
                            )
                          }
                          className="font-condensed tracking-[0.1em] uppercase text-xs transition-colors duration-150 px-3 py-1.5"
                          style={{
                            border: `1px solid ${active ? "#a07828" : "#d4c0a0"}`,
                            background: active ? "rgba(160,112,32,0.1)" : "#faf6ed",
                            color: active ? "#7a5a18" : "#8a6848",
                            borderRadius: "4px",
                          }}
                        >
                          {cat.name}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <FieldLabel>Descriere</FieldLabel>
                  <Textarea
                    className="bg-[#faf6ed] border-[#d4c0a0] text-[#1a0f05] placeholder:text-[#b8956a] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary/60 rounded-[4px] resize-none text-sm"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descrie serviciile pe care le oferi..."
                    rows={4}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <FieldLabel>Ani de experiență</FieldLabel>
                    <Input
                      className={inputCls}
                      type="number"
                      min="0"
                      value={formData.experienceYears}
                      onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                    />
                  </div>
                  <div>
                    <FieldLabel>Număr WhatsApp</FieldLabel>
                    <Input
                      className={inputCls}
                      type="tel"
                      placeholder="40712345678"
                      value={formData.whatsappNumber}
                      onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <FieldLabel>Adresă / Zonă</FieldLabel>
                  <Input
                    className={inputCls}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Strada, număr sau zonă"
                  />
                </div>

                <div className="pt-4" style={{ borderTop: "1px solid #e0c99a" }}>
                  <Button
                    type="submit"
                    disabled={saving}
                    className="rounded-[4px] font-condensed tracking-[0.16em] uppercase text-sm font-semibold bg-primary hover:bg-primary/85 text-white h-11 px-8"
                  >
                    {saving ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Se salvează...</>
                    ) : (
                      "Salvează modificările"
                    )}
                  </Button>
                </div>

              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}
