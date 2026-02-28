"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { applyAsMester } from "@/actions/mester"
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface Props {
  categories: { id: string; name: string }[]
}

export default function BecomeMesterForm({ categories }: Props) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [categoryId, setCategoryId] = useState("")

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)

    formData.set("categoryId", categoryId)

    const result = await applyAsMester(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
    // On success the server action redirects to /mester-cont
  }

  return (
    <Card className="w-full max-w-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Devino meșter</CardTitle>
        <CardDescription>
          Completează informațiile despre business-ul tău pentru a apărea în lista de meșteri din Tulcea
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-5">
          {/* Business info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Nume business</Label>
              <Input
                id="businessName"
                name="businessName"
                type="text"
                placeholder="ex. Instalații Ionescu"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryId">Categorie</Label>
              <Select onValueChange={setCategoryId} required>
                <SelectTrigger id="categoryId">
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
              <Label htmlFor="description">Descriere (opțional)</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Descrie serviciile tale, experiența, etc."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="experienceYears">Ani experiență</Label>
                <Input
                  id="experienceYears"
                  name="experienceYears"
                  type="number"
                  placeholder="ex. 10"
                  min={0}
                  max={60}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsappNumber">WhatsApp (opțional)</Label>
                <Input
                  id="whatsappNumber"
                  name="whatsappNumber"
                  type="tel"
                  placeholder="0712 345 678"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Adresă (opțional)</Label>
              <Input
                id="address"
                name="address"
                type="text"
                placeholder="Strada, nr., Tulcea"
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Se creează profilul...
              </>
            ) : (
              "Devino meșter"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="text-sm text-center text-muted-foreground">
        Profilul tău va fi verificat de un administrator înainte de a fi publicat.
      </CardFooter>
    </Card>
  )
}
