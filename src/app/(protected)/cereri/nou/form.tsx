"use client"

import { useState, useRef } from "react"
import { Loader2, ImagePlus, X } from "lucide-react"
import { createCerere } from "@/actions/cereri"
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/lib/hooks/use-toast"
import type { Category } from "@/types/database"

interface CerereFormProps {
  categories: Category[]
}

export function CerereForm({ categories }: CerereFormProps) {
  const [saving, setSaving] = useState(false)
  const [categoryId, setCategoryId] = useState("")
  const [previews, setPreviews] = useState<string[]>([])
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handlePhotosChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    const valid = files.slice(0, 5 - selectedFiles.length)
    if (!valid.length) return
    const newPreviews = valid.map((f) => URL.createObjectURL(f))
    setSelectedFiles((prev) => [...prev, ...valid].slice(0, 5))
    setPreviews((prev) => [...prev, ...newPreviews].slice(0, 5))
    // Reset input so same files can be re-selected if removed
    e.target.value = ""
  }

  function removePhoto(index: number) {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
    setPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)

    const formEl = e.currentTarget
    const data = new FormData(formEl)
    data.set("categoryId", categoryId)

    // Remove any photos the browser may have attached from the input
    data.delete("photos")
    for (const file of selectedFiles) {
      data.append("photos", file)
    }

    const result = await createCerere(data)

    // If we get here, there was an error (success redirects)
    if (result?.error) {
      toast({ title: "Eroare", description: result.error, variant: "destructive" })
      setSaving(false)
    }
  }

  return (
    <Card className="border-[#e8dcc8] rounded-none shadow-sm">
      <CardHeader>
        <CardTitle className="font-condensed tracking-wide">Detalii cerere</CardTitle>
        <CardDescription>
          Completează formularul — numărul tău de telefon va fi vizibil meșterilor
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">

          <div className="space-y-2">
            <Label htmlFor="title">Titlu *</Label>
            <Input
              id="title"
              name="title"
              required
              placeholder="Ex: Montaj instalație electrică"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="original_message">Descriere *</Label>
            <Textarea
              id="original_message"
              name="original_message"
              required
              rows={5}
              placeholder="Descrie problema sau lucrarea necesară cât mai detaliat..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryId">Categorie *</Label>
            <Select value={categoryId} onValueChange={setCategoryId} required>
              <SelectTrigger id="categoryId">
                <SelectValue placeholder="Selectează categoria de meșteri" />
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

          {/* Photos */}
          <div className="space-y-2">
            <Label>Poze (opțional, max 5)</Label>
            {previews.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {previews.map((src, i) => (
                  <div key={i} className="relative w-20 h-20 border border-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={`Poză ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      className="absolute top-0.5 right-0.5 bg-black/60 hover:bg-black/80 text-white p-0.5 rounded-full transition-colors"
                      aria-label="Șterge poza"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {selectedFiles.length < 5 && (
              <>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 border border-dashed border-border hover:border-primary px-4 py-3 text-sm text-muted-foreground hover:text-primary transition-colors duration-200 w-full justify-center"
                >
                  <ImagePlus className="h-4 w-4" />
                  {selectedFiles.length === 0 ? "Adaugă poze" : "Adaugă mai multe"}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="hidden"
                  onChange={handlePhotosChange}
                />
              </>
            )}
            <p className="text-xs text-muted-foreground">JPG, PNG, WebP · max 2MB per poză</p>
          </div>

          <Button
            type="submit"
            disabled={saving || !categoryId}
            className="w-full"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Se trimite...
              </>
            ) : (
              "Trimite cererea"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
