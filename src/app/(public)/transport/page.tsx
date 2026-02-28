"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Truck } from "lucide-react"
import { TransportForm } from "@/components/transport/transport-form"
import { Skeleton } from "@/components/ui/skeleton"

// Dynamic import for Leaflet map (no SSR)
const TransportMap = dynamic(
  () => import("@/components/transport/transport-map").then((mod) => mod.TransportMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[400px] w-full rounded-lg border bg-muted animate-pulse flex items-center justify-center">
        <p className="text-muted-foreground">Se încarcă harta...</p>
      </div>
    ),
  }
)

export default function TransportPage() {
  const [pickupCoords, setPickupCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [dropoffCoords, setDropoffCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [selectingMode, setSelectingMode] = useState<"pickup" | "dropoff" | null>(null)

  function handlePickupSelect(coords: { lat: number; lng: number }) {
    setPickupCoords(coords)
    setSelectingMode(null)
  }

  function handleDropoffSelect(coords: { lat: number; lng: number }) {
    setDropoffCoords(coords)
    setSelectingMode(null)
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="max-w-2xl mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Truck className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Transport Marfă Tulcea</h1>
        </div>
        <p className="text-muted-foreground">
          Ai nevoie să transporți materiale, mobilă sau alte obiecte în zona Tulcea?
          Completează formularul și vei fi contactat de transportatorii disponibili din zonă.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Map Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Selectează locațiile pe hartă</h2>
          <TransportMap
            pickupCoords={pickupCoords}
            dropoffCoords={dropoffCoords}
            onPickupSelect={handlePickupSelect}
            onDropoffSelect={handleDropoffSelect}
            selectingMode={selectingMode}
          />
          <p className="text-sm text-muted-foreground">
            Apasă butonul de lângă câmpul de adresă pentru a selecta punctul direct pe hartă.
          </p>
        </div>

        {/* Form Section */}
        <div>
          <TransportForm
            pickupCoords={pickupCoords}
            dropoffCoords={dropoffCoords}
            selectingMode={selectingMode}
            onSelectModeChange={setSelectingMode}
          />
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-12 grid sm:grid-cols-3 gap-6">
        <div className="text-center p-6 rounded-lg border bg-card">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🚚</span>
          </div>
          <h3 className="font-semibold mb-2">Transportatori Locali</h3>
          <p className="text-sm text-muted-foreground">
            Colaborăm cu transportatori verificați din zona Tulcea
          </p>
        </div>
        <div className="text-center p-6 rounded-lg border bg-card">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📦</span>
          </div>
          <h3 className="font-semibold mb-2">Orice Tip de Marfă</h3>
          <p className="text-sm text-muted-foreground">
            Mobilă, electronice, materiale de construcții, și altele
          </p>
        </div>
        <div className="text-center p-6 rounded-lg border bg-card">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">💬</span>
          </div>
          <h3 className="font-semibold mb-2">Răspuns Rapid</h3>
          <p className="text-sm text-muted-foreground">
            Primești oferte de la transportatori în cel mai scurt timp
          </p>
        </div>
      </div>
    </div>
  )
}
