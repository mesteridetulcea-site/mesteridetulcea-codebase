"use client"

import { useState, useRef } from "react"
import { Loader2, Camera, User } from "lucide-react"
import { updateClientProfile } from "@/actions/mester"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/lib/hooks/use-toast"

interface ClientSettingsFormProps {
  avatarUrl: string | null
  initialData: {
    fullName: string
    phone: string
    email: string
  }
}

export function ClientSettingsForm({ avatarUrl: initialAvatarUrl, initialData }: ClientSettingsFormProps) {
  const [saving, setSaving] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialAvatarUrl)
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
    <Card>
      <CardHeader>
        <CardTitle>Informații cont</CardTitle>
        <CardDescription>
          Actualizează datele tale personale
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="relative group h-24 w-24 rounded-full overflow-hidden border-2 border-dashed border-border hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="Schimbă poza de profil"
            >
              {displayedAvatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={displayedAvatar} alt="Poza de profil" className="h-full w-full object-cover" />
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
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleAvatarChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName">Nume complet</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="Numele tău complet"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={initialData.email} disabled className="opacity-60" />
            <p className="text-xs text-muted-foreground">Adresa de email nu poate fi modificată din această pagină.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Număr de telefon</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="07xx xxx xxx"
            />
          </div>

          <Button type="submit" disabled={saving}>
            {saving ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Se salvează...</>) : "Salvează modificările"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
