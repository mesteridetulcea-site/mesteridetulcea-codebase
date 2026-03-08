"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils/cn"

interface CererePhoto {
  id: string
  url: string
  approval_status: string
}

interface CererePhotoCarouselProps {
  photos: CererePhoto[]
  isOwner: boolean
}

export function CererePhotoCarousel({ photos, isOwner }: CererePhotoCarouselProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  function prev() {
    setLightboxIndex((i) => (i === null ? 0 : i === 0 ? photos.length - 1 : i - 1))
  }

  function next() {
    setLightboxIndex((i) => (i === null ? 0 : i === photos.length - 1 ? 0 : i + 1))
  }

  const current = lightboxIndex !== null ? photos[lightboxIndex] : null

  return (
    <>
      {/* Photo grid — same pattern as /mester/[slug] PhotoGallery */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-[#584528]/12">
        {photos.map((photo, i) => (
          <button
            key={photo.id}
            onClick={() => setLightboxIndex(i)}
            className="relative aspect-square overflow-hidden group bg-[#f5eed8] cursor-zoom-in"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.url}
              alt={`Fotografie ${i + 1}`}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-200" />

            {/* Status badge — only for owner */}
            {isOwner && photo.approval_status !== "approved" && (
              <div
                className={cn(
                  "absolute top-2 left-2 font-condensed text-[9px] tracking-[0.16em] uppercase px-2 py-0.5",
                  photo.approval_status === "pending"
                    ? "bg-black/55 text-white/80"
                    : "bg-red-900/70 text-white/90"
                )}
              >
                {photo.approval_status === "pending" ? "În așteptare" : "Respinsă"}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox dialog */}
      <Dialog open={lightboxIndex !== null} onOpenChange={() => setLightboxIndex(null)}>
        <DialogContent className="max-w-5xl w-full p-0 bg-black/95 border-0 overflow-hidden">
          <DialogTitle className="sr-only">
            Fotografie {lightboxIndex !== null ? lightboxIndex + 1 : ""} din {photos.length}
          </DialogTitle>

          {current && (
            <div className="relative flex items-center justify-center" style={{ minHeight: "60vh" }}>

              {/* Close */}
              <button
                onClick={() => setLightboxIndex(null)}
                className="absolute top-4 right-4 z-20 w-9 h-9 bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors duration-200"
                aria-label="Închide"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Main image */}
              <div className="relative w-full aspect-[4/3] md:aspect-video">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={current.url}
                  alt={`Fotografie ${lightboxIndex! + 1}`}
                  className="absolute inset-0 w-full h-full object-contain"
                />

                {/* Status overlay in lightbox */}
                {isOwner && current.approval_status !== "approved" && (
                  <div
                    className={cn(
                      "absolute inset-0 flex items-end justify-start p-4 pointer-events-none",
                      current.approval_status === "pending"
                        ? "bg-black/20"
                        : "bg-red-900/25"
                    )}
                  >
                    <span
                      className={cn(
                        "font-condensed text-[10px] tracking-[0.18em] uppercase px-3 py-1",
                        current.approval_status === "pending"
                          ? "bg-black/55 text-white/80"
                          : "bg-red-900/70 text-white/90"
                      )}
                    >
                      {current.approval_status === "pending" ? "În așteptare aprobare" : "Fotografie respinsă"}
                    </span>
                  </div>
                )}
              </div>

              {/* Navigation */}
              {photos.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors duration-200"
                    aria-label="Anterioară"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={next}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors duration-200"
                    aria-label="Următoarea"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}

              {/* Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-condensed text-[11px] tracking-[0.2em] uppercase text-white/40">
                {lightboxIndex! + 1} / {photos.length}
              </div>
            </div>
          )}

          {/* Thumbnail strip */}
          {photos.length > 1 && (
            <div className="flex gap-1.5 p-3 bg-black overflow-x-auto">
              {photos.map((photo, i) => (
                <button
                  key={photo.id}
                  onClick={() => setLightboxIndex(i)}
                  className={cn(
                    "relative w-14 h-14 shrink-0 overflow-hidden transition-all duration-200",
                    i === lightboxIndex
                      ? "ring-2 ring-primary opacity-100"
                      : "opacity-40 hover:opacity-75"
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.url} alt="" className="absolute inset-0 w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
