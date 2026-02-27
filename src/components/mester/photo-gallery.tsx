"use client"

import { useState } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import type { MesterPhoto } from "@/types/database"

interface PhotoGalleryProps {
  photos: MesterPhoto[]
}

export function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  if (photos.length === 0) {
    return (
      <div className="bg-muted rounded-lg p-8 text-center">
        <p className="text-muted-foreground">
          Acest meșter nu a adăugat fotografii încă.
        </p>
      </div>
    )
  }

  function goNext() {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % photos.length)
    }
  }

  function goPrev() {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + photos.length) % photos.length)
    }
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            onClick={() => setSelectedIndex(index)}
            className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
          >
            <Image
              src={photo.url}
              alt={photo.caption || `Fotografie ${index + 1}`}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
            {photo.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                <p className="text-white text-sm line-clamp-1">{photo.caption}</p>
              </div>
            )}
          </button>
        ))}
      </div>

      <Dialog
        open={selectedIndex !== null}
        onOpenChange={() => setSelectedIndex(null)}
      >
        <DialogContent className="max-w-4xl p-0 bg-black/95">
          <DialogTitle className="sr-only">
            Vizualizare fotografie
          </DialogTitle>
          {selectedIndex !== null && (
            <div className="relative">
              <div className="relative aspect-[4/3] md:aspect-video">
                <Image
                  src={photos[selectedIndex].url}
                  alt={photos[selectedIndex].caption || "Fotografie"}
                  fill
                  className="object-contain"
                />
              </div>

              {photos[selectedIndex].caption && (
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <p className="text-white">{photos[selectedIndex].caption}</p>
                </div>
              )}

              {photos.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                    onClick={goPrev}
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                    onClick={goNext}
                  >
                    <ChevronRight className="h-8 w-8" />
                  </Button>
                </>
              )}

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
                {selectedIndex + 1} / {photos.length}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
