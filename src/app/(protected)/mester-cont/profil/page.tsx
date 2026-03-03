"use client"

import { useState, useEffect, useRef } from "react"
import { Loader2, Camera, User } from "lucide-react"
import { getMesterProfile, updateMesterProfile } from "@/actions/mester"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "@/lib/hooks/use-toast"
import type { Category } from "@/types/database"

export default function MesterProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    businessName: "",
    description: "",
    experienceYears: "",
    whatsappNumber: "",
    address: "",
    categoryId: "",
  })

  useEffect(() => {
    async function loadData() {
      const supabase = createClient()

      // Load categories
      const { data: cats } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order")
      setCategories(cats || [])

      // Load current avatar from profiles
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("avatar_url")
          .eq("id", user.id)
          .single() as { data: { avatar_url: string | null } | null }
        setAvatarUrl(profile?.avatar_url ?? null)
      }

      // Load mester profile
      const mester = await getMesterProfile()
      if (mester) {
        const primaryCategory = mester.mester_categories?.[0]?.category_id || ""
        setFormData({
          businessName: mester.display_name || "",
          description: mester.bio || "",
          experienceYears: mester.years_experience?.toString() || "",
          whatsappNumber: mester.whatsapp_number || "",
          address: mester.neighborhood || "",
          categoryId: primaryCategory,
        })
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
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, value)
    })

    // Attach avatar file if selected
    const file = fileInputRef.current?.files?.[0]
    if (file) {
      form.append("avatar", file)
    }

    const result = await updateMesterProfile(form)

    if (result.error) {
      toast({
        title: "Eroare",
        description: result.error,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Salvat!",
        description: "Profilul a fost actualizat cu succes.",
      })
      // Update displayed avatar if a new one was uploaded
      if (avatarPreview) {
        setAvatarUrl(avatarPreview)
        setAvatarPreview(null)
        if (fileInputRef.current) fileInputRef.current.value = ""
      }
    }
    setSaving(false)
  }

  const displayedAvatar = avatarPreview ?? avatarUrl

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Profilul meu</h1>
        <p className="text-muted-foreground">
          Actualizează informațiile despre serviciile tale
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informații business</CardTitle>
          <CardDescription>
            Aceste informații vor fi afișate pe profilul tău public
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Avatar upload */}
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="relative group h-24 w-24 rounded-full overflow-hidden border-2 border-dashed border-border hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label="Schimbă poza de profil"
              >
                {displayedAvatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={displayedAvatar}
                    alt="Poza de profil"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full w-full bg-muted text-muted-foreground">
                    <User className="h-8 w-8" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="h-5 w-5 text-white" />
                </div>
              </button>
              <p className="text-xs text-muted-foreground">
                {avatarPreview ? "Imagine nouă selectată — salvează pentru a aplica" : "Apasă pentru a schimba poza (JPG, PNG, WebP · max 2MB)"}
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessName">Nume firmă/Afacere *</Label>
              <Input
                id="businessName"
                value={formData.businessName}
                onChange={(e) =>
                  setFormData({ ...formData, businessName: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryId">Categorie *</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) =>
                  setFormData({ ...formData, categoryId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selectează categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descriere</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Descrie serviciile pe care le oferi..."
                rows={4}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="experienceYears">Ani de experiență</Label>
                <Input
                  id="experienceYears"
                  type="number"
                  min="0"
                  value={formData.experienceYears}
                  onChange={(e) =>
                    setFormData({ ...formData, experienceYears: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsappNumber">Număr WhatsApp</Label>
                <Input
                  id="whatsappNumber"
                  type="tel"
                  placeholder="40712345678"
                  value={formData.whatsappNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, whatsappNumber: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Adresă / Zonă</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Strada, număr sau zonă"
              />
            </div>

            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Se salvează...
                </>
              ) : (
                "Salvează modificările"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
