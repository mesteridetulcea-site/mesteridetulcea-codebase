"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, X, Expand } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import type { ProjectPhoto } from "@/types/database"

interface ProjectPhotoCarouselProps {
  photos: ProjectPhoto[]
  title: string
}

export function ProjectPhotoCarousel({ photos, title }: ProjectPhotoCarouselProps) {
  const [current, setCurrent] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  if (photos.length === 0) return null

  function prev() {
    setCurrent((c) => (c === 0 ? photos.length - 1 : c - 1))
  }

  function next() {
    setCurrent((c) => (c === photos.length - 1 ? 0 : c + 1))
  }

  function openLightbox(index: number) {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  function lightboxPrev() {
    setLightboxIndex((i) => (i === 0 ? photos.length - 1 : i - 1))
  }

  function lightboxNext() {
    setLightboxIndex((i) => (i === photos.length - 1 ? 0 : i + 1))
  }

  return (
    <>
      <div className="flex gap-3">
        {/* Main image */}
        <div className="flex-1 relative aspect-[4/3] bg-[#f5eed8] overflow-hidden group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photos[current].url}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover cursor-zoom-in"
            onClick={() => openLightbox(current)}
          />

          {/* Expand hint overlay on hover */}
          <div
            className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 flex items-center justify-center cursor-zoom-in"
            onClick={() => openLightbox(current)}
          >
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-10 h-10 bg-black/50 flex items-center justify-center">
              <Expand className="h-4 w-4 text-white" />
            </div>
          </div>

          {/* Prev / Next arrows */}
          {photos.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev() }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors duration-200 z-10"
                aria-label="Anterioară"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next() }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors duration-200 z-10"
                aria-label="Următoarea"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              {/* Dot indicators */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {photos.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setCurrent(i) }}
                    className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
                      i === current ? "bg-white" : "bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Thumbnails column */}
        {photos.length > 1 && (
          <div className="flex flex-col gap-2 w-20 sm:w-24 overflow-y-auto max-h-[calc(75vw*3/4)] shrink-0">
            {photos.map((photo, i) => (
              <button
                key={photo.id}
                onClick={() => { setCurrent(i); openLightbox(i) }}
                className={`relative aspect-square overflow-hidden shrink-0 transition-all duration-200 ${
                  i === current
                    ? "ring-2 ring-primary ring-offset-1"
                    : "opacity-55 hover:opacity-100"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt={`${title} ${i + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox dialog */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-5xl w-full p-0 bg-black/95 border-0 overflow-hidden">
          <DialogTitle className="sr-only">
            {title} — fotografie {lightboxIndex + 1} din {photos.length}
          </DialogTitle>

          <div className="relative flex items-center justify-center" style={{ minHeight: "60vh" }}>
            {/* Close button */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 z-20 w-9 h-9 bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors duration-200"
              aria-label="Închide"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Main lightbox image */}
            <div className="relative w-full aspect-[4/3] md:aspect-video">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photos[lightboxIndex].url}
                alt={`${title} ${lightboxIndex + 1}`}
                className="absolute inset-0 w-full h-full object-contain"
              />
            </div>

            {/* Navigation */}
            {photos.length > 1 && (
              <>
                <button
                  onClick={lightboxPrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors duration-200"
                  aria-label="Anterioară"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={lightboxNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors duration-200"
                  aria-label="Următoarea"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-condensed text-[11px] tracking-[0.2em] uppercase text-white/40">
              {lightboxIndex + 1} / {photos.length}
            </div>
          </div>

          {/* Thumbnail strip */}
          {photos.length > 1 && (
            <div className="flex gap-1.5 p-3 bg-black overflow-x-auto">
              {photos.map((photo, i) => (
                <button
                  key={photo.id}
                  onClick={() => setLightboxIndex(i)}
                  className={`relative w-14 h-14 shrink-0 overflow-hidden transition-all duration-200 ${
                    i === lightboxIndex
                      ? "ring-2 ring-primary opacity-100"
                      : "opacity-40 hover:opacity-75"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.url}
                    alt={`${title} ${i + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
