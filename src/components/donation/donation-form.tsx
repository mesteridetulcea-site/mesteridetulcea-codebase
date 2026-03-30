"use client"

import { useState, useRef, useTransition } from "react"
import { compressImage } from "@/lib/utils/compress-image"
import { useRouter } from "next/navigation"
import { X, Upload, ImageIcon, Plus, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { createDonation } from "@/actions/donations"

interface DonationFormProps {
  open: boolean
  onClose: () => void
  isLoggedIn: boolean
  hasPhone: boolean
}

export function DonationForm({ open, onClose, isLoggedIn, hasPhone }: DonationFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    const remaining = 5 - previews.length
    const toAdd = files.slice(0, remaining)

    const newPreviews = toAdd.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }))
    setPreviews((prev) => [...prev, ...newPreviews])
    // Reset input so same file can be re-selected
    e.target.value = ""
  }

  function removePhoto(index: number) {
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index].url)
      return prev.filter((_, i) => i !== index)
    })
  }

  function handleClose() {
    previews.forEach((p) => URL.revokeObjectURL(p.url))
    setPreviews([])
    setError(null)
    onClose()
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)
    await Promise.all(previews.map(async (p, i) => {
      formData.append(`photo_${i}`, await compressImage(p.file))
    }))

    startTransition(async () => {
      const result = await createDonation(formData)
      if (result.error) {
        setError(result.error)
        return
      }
      handleClose()
      router.refresh()
    })
  }

  // Not logged in
  if (!isLoggedIn) {
    return (
      <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
        <DialogContent className="max-w-md bg-[#0e0b07] border-white/[0.09] rounded-none p-0">
          <DialogHeader className="px-8 pt-8 pb-2">
            <DialogTitle className="font-display text-white" style={{ fontSize: "1.4rem", fontWeight: 500 }}>
              Postează o donație
            </DialogTitle>
          </DialogHeader>
          <div className="px-8 pb-8 space-y-5">
            <p className="text-white/55 text-sm leading-relaxed">
              Trebuie să fii autentificat pentru a posta o donație.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => router.push("/login")}
                className="bg-primary hover:bg-primary/90 text-white rounded-none font-condensed tracking-wider"
              >
                Conectează-te
              </Button>
              <Button
                variant="ghost"
                onClick={handleClose}
                className="text-white/40 hover:text-white/70 rounded-none font-condensed"
              >
                Renunță
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // No phone
  if (!hasPhone) {
    return (
      <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
        <DialogContent className="max-w-md bg-[#0e0b07] border-white/[0.09] rounded-none p-0">
          <DialogHeader className="px-8 pt-8 pb-2">
            <DialogTitle className="font-display text-white" style={{ fontSize: "1.4rem", fontWeight: 500 }}>
              Număr de telefon lipsă
            </DialogTitle>
          </DialogHeader>
          <div className="px-8 pb-8 space-y-5">
            <p className="text-white/55 text-sm leading-relaxed">
              Trebuie să adaugi un număr de telefon în setările contului înainte de a posta o donație. Altfel, oamenii nu te pot contacta.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => { handleClose(); router.push("/cont/setari") }}
                className="bg-primary hover:bg-primary/90 text-white rounded-none font-condensed tracking-wider"
              >
                Setări cont
              </Button>
              <Button
                variant="ghost"
                onClick={handleClose}
                className="text-white/40 hover:text-white/70 rounded-none font-condensed"
              >
                Renunță
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-w-lg bg-[#0e0b07] border-white/[0.09] rounded-none p-0 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="px-8 pt-8 pb-4 border-b border-white/[0.07]">
          <DialogTitle className="font-display text-white" style={{ fontSize: "1.4rem", fontWeight: 500 }}>
            Postează o donație
          </DialogTitle>
          <p className="text-white/40 text-sm font-condensed tracking-wide mt-1">
            Adaugă un obiect pe care îl donezi gratuit
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">

          {/* Title */}
          <div className="space-y-2">
            <label className="font-condensed text-[11px] tracking-[0.20em] uppercase text-white/45 block">
              Titlu <span className="text-primary">*</span>
            </label>
            <input
              name="title"
              required
              maxLength={120}
              placeholder="ex: Frigider Samsung, canapea 3 locuri..."
              className="w-full bg-white/[0.04] border border-white/[0.10] text-white/85 placeholder:text-white/20 font-condensed tracking-wide text-sm px-4 py-3 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="font-condensed text-[11px] tracking-[0.20em] uppercase text-white/45 block">
              Descriere <span className="text-primary">*</span>
            </label>
            <textarea
              name="description"
              required
              rows={4}
              maxLength={1000}
              placeholder="Descrie obiectul, starea lui, dimensiuni, unde poate fi ridicat..."
              className="w-full bg-white/[0.04] border border-white/[0.10] text-white/85 placeholder:text-white/20 font-condensed tracking-wide text-sm px-4 py-3 focus:outline-none focus:border-primary/50 transition-colors resize-none"
            />
          </div>

          {/* Photos */}
          <div className="space-y-3">
            <label className="font-condensed text-[11px] tracking-[0.20em] uppercase text-white/45 block">
              Fotografii <span className="text-white/25">(max. 5, necesită aprobare)</span>
            </label>

            {/* Previews */}
            {previews.length > 0 && (
              <div className="grid grid-cols-5 gap-2">
                {previews.map((p, i) => (
                  <div key={i} className="relative aspect-square overflow-hidden bg-white/[0.06]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.url} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      className="absolute top-1 right-1 w-5 h-5 bg-black/70 text-white flex items-center justify-center hover:bg-black/90 transition-colors"
                      aria-label="Șterge"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add button */}
            {previews.length < 5 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 border border-dashed border-white/[0.15] hover:border-primary/40 text-white/35 hover:text-primary/70 px-4 py-3 w-full justify-center font-condensed text-[11px] tracking-[0.18em] uppercase transition-colors duration-200"
              >
                <Plus className="h-4 w-4" />
                Adaugă {previews.length === 0 ? "fotografii" : "mai multe"} ({previews.length}/5)
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="border border-red-500/30 bg-red-500/10 px-4 py-3">
              <p className="text-red-400/90 text-sm font-condensed">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={isPending}
              className="bg-primary hover:bg-primary/90 text-white rounded-none font-condensed tracking-wider flex-1"
            >
              {isPending ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Se postează...</>
              ) : (
                <><Upload className="h-4 w-4 mr-2" /> Postează donația</>
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              disabled={isPending}
              className="text-white/40 hover:text-white/70 rounded-none font-condensed"
            >
              Anulează
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
