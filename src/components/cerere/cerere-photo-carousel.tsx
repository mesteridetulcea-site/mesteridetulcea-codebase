"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
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
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent((i) => (i === 0 ? photos.length - 1 : i - 1))
  const next = () => setCurrent((i) => (i === photos.length - 1 ? 0 : i + 1))

  const photo = photos[current]

  return (
    <div className="space-y-3">
      {/* Main slide */}
      <div className="relative overflow-hidden border border-[#e8dcc8] bg-[#f5eed8]" style={{ aspectRatio: "16/9" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={photo.id}
          src={photo.url}
          alt="Fotografie cerere"
          className="w-full h-full object-contain transition-opacity duration-200"
        />

        {/* Status overlay */}
        {isOwner && photo.approval_status === "pending" && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center pointer-events-none">
            <span className="font-condensed tracking-[0.14em] uppercase text-[10px] text-white/80 bg-black/50 px-3 py-1">
              În așteptare
            </span>
          </div>
        )}
        {isOwner && photo.approval_status === "rejected" && (
          <div className="absolute inset-0 bg-red-900/40 flex items-center justify-center pointer-events-none">
            <span className="font-condensed tracking-[0.14em] uppercase text-[10px] text-white/80 bg-red-900/60 px-3 py-1">
              Respinsă
            </span>
          </div>
        )}

        {/* Nav arrows — only when multiple photos */}
        {photos.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/45 hover:bg-black/65 flex items-center justify-center transition-colors duration-200"
              aria-label="Înapoi"
            >
              <ChevronLeft className="h-4 w-4 text-white/80" />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/45 hover:bg-black/65 flex items-center justify-center transition-colors duration-200"
              aria-label="Înainte"
            >
              <ChevronRight className="h-4 w-4 text-white/80" />
            </button>

            {/* Counter */}
            <div className="absolute bottom-2 right-3 font-condensed text-[10px] tracking-[0.14em] text-white/70 bg-black/45 px-2 py-0.5">
              {current + 1} / {photos.length}
            </div>
          </>
        )}

        {/* Open full size */}
        <a
          href={photo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-2 left-3 font-condensed text-[10px] tracking-[0.14em] uppercase text-white/55 hover:text-white/85 bg-black/40 px-2 py-0.5 transition-colors duration-200"
        >
          Vezi original
        </a>
      </div>

      {/* Thumbnails */}
      {photos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {photos.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setCurrent(i)}
              className={cn(
                "shrink-0 w-16 h-16 overflow-hidden border-2 transition-all duration-200",
                i === current
                  ? "border-primary opacity-100"
                  : "border-transparent opacity-50 hover:opacity-75"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
