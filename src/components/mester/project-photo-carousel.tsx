"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { ProjectPhoto } from "@/types/database"

interface ProjectPhotoCarouselProps {
  photos: ProjectPhoto[]
  title: string
}

export function ProjectPhotoCarousel({ photos, title }: ProjectPhotoCarouselProps) {
  const [current, setCurrent] = useState(0)

  if (photos.length === 0) return null

  function prev() {
    setCurrent((c) => (c === 0 ? photos.length - 1 : c - 1))
  }

  function next() {
    setCurrent((c) => (c === photos.length - 1 ? 0 : c + 1))
  }

  return (
    <div className="flex gap-3">
      {/* Main image + arrows */}
      <div className="flex-1 relative aspect-[4/3] bg-[#f5eed8] overflow-hidden group">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photos[current].url}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {photos.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors duration-200"
              aria-label="Anterioare"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors duration-200"
              aria-label="Următoarea"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {photos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
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
              onClick={() => setCurrent(i)}
              className={`relative aspect-square overflow-hidden shrink-0 transition-all duration-200 ${
                i === current
                  ? "ring-2 ring-primary ring-offset-1"
                  : "opacity-60 hover:opacity-100"
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
  )
}
