"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const form = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, value)
    })

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
    }
    setSaving(false)
  }

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
