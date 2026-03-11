"use client"

import { useState, useRef } from "react"
import { Loader2, ImagePlus, X, FileText, Tag, AlignLeft } from "lucide-react"
import { createCerere } from "@/actions/cereri"
import { toast } from "@/lib/hooks/use-toast"
import type { Category } from "@/types/database"

interface CerereFormProps {
  categories: Category[]
}

const inputCls =
  "w-full h-12 px-4 font-condensed tracking-[0.04em] text-[15px] text-[#1a0f05] placeholder:text-[#b8956a] outline-none transition-all duration-200 " +
  "bg-[#faf6ed] border border-[#d4c0a0] focus:border-[#c4921e] focus:bg-white"

const labelCls = "block font-condensed tracking-[0.18em] uppercase text-[#6b4f35] mb-2 text-[11px]"

export function CerereForm({ categories }: CerereFormProps) {
  const [saving, setSaving]           = useState(false)
  const [categoryId, setCategoryId]   = useState("")
  const [previews, setPreviews]       = useState<string[]>([])
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handlePhotosChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    const valid = files.slice(0, 5 - selectedFiles.length)
    if (!valid.length) return
    const newPreviews = valid.map((f) => URL.createObjectURL(f))
    setSelectedFiles((prev) => [...prev, ...valid].slice(0, 5))
    setPreviews((prev) => [...prev, ...newPreviews].slice(0, 5))
    e.target.value = ""
  }

  function removePhoto(index: number) {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
    setPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    const data = new FormData(e.currentTarget)
    data.set("categoryId", categoryId)
    data.delete("photos")
    for (const file of selectedFiles) data.append("photos", file)
    const result = await createCerere(data)
    if (result?.error) {
      toast({ title: "Eroare", description: result.error, variant: "destructive" })
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-0">

      {/* ── Fields section ── */}
      <div style={{ background: "white", border: "1px solid #e0c99a" }}>

        {/* Top accent */}
        <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, #c4921e 40%, #c4921e 60%, transparent)" }} />

        <div className="p-6 space-y-5">

          {/* Section header */}
          <div className="flex items-center gap-3 mb-1">
            <div className="w-4 h-px bg-primary/40" />
            <span className="font-condensed tracking-[0.24em] uppercase text-[#8a6848]" style={{ fontSize: "11px" }}>
              Detalii cerere
            </span>
            <div className="flex-1 h-px bg-[#e0c99a]" />
          </div>

          {/* Titlu */}
          <div>
            <label htmlFor="title" className={labelCls}>
              Titlu <span className="text-primary">*</span>
            </label>
            <div className="relative">
              <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ width: "13px", height: "13px", color: "#b8956a" }} />
              <input
                id="title"
                name="title"
                required
                className={inputCls}
                style={{ paddingLeft: "36px" }}
                placeholder="Ex: Montaj instalație electrică"
              />
            </div>
          </div>

          {/* Descriere */}
          <div>
            <label htmlFor="original_message" className={labelCls}>
              Descriere <span className="text-primary">*</span>
            </label>
            <div className="relative">
              <AlignLeft className="absolute left-3.5 top-3.5 pointer-events-none" style={{ width: "13px", height: "13px", color: "#b8956a" }} />
              <textarea
                id="original_message"
                name="original_message"
                required
                rows={5}
                className={`${inputCls} resize-none`}
                style={{ paddingLeft: "36px", height: "auto", paddingTop: "10px" }}
                placeholder="Descrie problema sau lucrarea necesară cât mai detaliat..."
              />
            </div>
          </div>

          {/* Categorie */}
          <div>
            <label htmlFor="categoryId" className={labelCls}>
              Categorie <span className="text-primary">*</span>
            </label>
            <div className="relative">
              <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ width: "13px", height: "13px", color: "#b8956a" }} />
              <select
                id="categoryId"
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className={inputCls}
                style={{
                  paddingLeft: "36px",
                  appearance: "none",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23b8956a' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 14px center",
                }}
              >
                <option value="">Selectează categoria de meșteri</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, #e0c99a 20%, #e0c99a 80%, transparent)" }} />

      {/* ── Photos section ── */}
      <div style={{ background: "white", border: "1px solid #e0c99a", borderTop: "none" }}>
        <div className="p-6 space-y-4">

          <div className="flex items-center gap-3 mb-1">
            <div className="w-4 h-px bg-primary/40" />
            <span className="font-condensed tracking-[0.24em] uppercase text-[#8a6848]" style={{ fontSize: "11px" }}>
              Fotografii (opțional)
            </span>
            <div className="flex-1 h-px bg-[#e0c99a]" />
          </div>

          {/* Thumbnails */}
          {previews.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {previews.map((src, i) => (
                <div key={i} className="relative">
                  <div style={{ width: "72px", height: "72px", border: "1px solid #e0c99a", overflow: "hidden" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={`Poză ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="absolute -top-1.5 -right-1.5 flex items-center justify-center transition-colors duration-150"
                    style={{ width: "18px", height: "18px", background: "#1a0f05", color: "white" }}
                    aria-label="Șterge poza"
                  >
                    <X style={{ width: "9px", height: "9px" }} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload button */}
          {selectedFiles.length < 5 && (
            <>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 w-full transition-all duration-200"
                style={{
                  height: "52px",
                  border: "1px dashed #d4c0a0",
                  color: "#8a6848",
                  background: "#faf6ed",
                  fontSize: "12px",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#c4921e"; (e.currentTarget as HTMLButtonElement).style.color = "hsl(38 68% 44%)" }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#d4c0a0"; (e.currentTarget as HTMLButtonElement).style.color = "#8a6848" }}
              >
                <ImagePlus style={{ width: "14px", height: "14px" }} />
                <span className="font-condensed tracking-[0.16em] uppercase" style={{ fontSize: "11px" }}>
                  {selectedFiles.length === 0 ? "Adaugă fotografii" : `Adaugă mai multe (${selectedFiles.length}/5)`}
                </span>
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

          <p className="font-condensed tracking-wide text-[#b8956a]" style={{ fontSize: "11px" }}>
            JPG, PNG sau WebP · maxim 2MB per fotografie · până la 5 fotografii
          </p>

          <p className="font-condensed tracking-wide text-[#8a6848]" style={{ fontSize: "11px", lineHeight: "1.6" }}>
            Numărul tău de telefon va fi vizibil meșterilor care răspund la cererea ta.
          </p>
        </div>
      </div>

      {/* ── Submit button ── */}
      <div style={{ paddingTop: "16px" }}>
        <button
          type="submit"
          disabled={saving || !categoryId}
          className="w-full h-12 flex items-center justify-center gap-2.5 font-condensed tracking-[0.22em] uppercase font-semibold transition-all duration-200"
          style={{
            fontSize: "12px",
            background: saving || !categoryId ? "hsl(38 68% 44% / 0.45)" : "hsl(38 68% 44%)",
            color: "white",
            cursor: saving || !categoryId ? "not-allowed" : "pointer",
            boxShadow: saving || !categoryId ? "none" : "0 4px 20px hsl(38 68% 44% / 0.28)",
          }}
        >
          {saving ? (
            <>
              <Loader2 style={{ width: "14px", height: "14px" }} className="animate-spin" />
              Se trimite...
            </>
          ) : (
            "Trimite cererea"
          )}
        </button>
      </div>

    </form>
  )
}
