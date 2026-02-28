"use client"

import { useEffect, useRef, useState } from "react"
import type { Map as LeafletMap, LatLng, Marker } from "leaflet"

interface TransportMapProps {
  pickupCoords: { lat: number; lng: number } | null
  dropoffCoords: { lat: number; lng: number } | null
  onPickupSelect: (coords: { lat: number; lng: number }) => void
  onDropoffSelect: (coords: { lat: number; lng: number }) => void
  selectingMode: "pickup" | "dropoff" | null
}

// Tulcea city center
const TULCEA_CENTER: [number, number] = [45.1667, 28.8000]
const DEFAULT_ZOOM = 13

export function TransportMap({
  pickupCoords,
  dropoffCoords,
  onPickupSelect,
  onDropoffSelect,
  selectingMode,
}: TransportMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<LeafletMap | null>(null)
  const pickupMarkerRef = useRef<Marker | null>(null)
  const dropoffMarkerRef = useRef<Marker | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    // Check if map is already initialized on this container (React strict mode)
    const container = mapContainerRef.current as HTMLDivElement & { _leaflet_id?: number }
    if (container._leaflet_id) return

    // Dynamic import of Leaflet
    import("leaflet").then((L) => {
      // Fix Leaflet default icon issue
      delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      })

      const map = L.map(mapContainerRef.current!).setView(TULCEA_CENTER, DEFAULT_ZOOM)

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map)

      // Custom icons
      const pickupIcon = L.divIcon({
        html: `<div class="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full shadow-lg border-2 border-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>`,
        className: "custom-marker",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      })

      const dropoffIcon = L.divIcon({
        html: `<div class="flex items-center justify-center w-8 h-8 bg-red-500 text-white rounded-full shadow-lg border-2 border-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>`,
        className: "custom-marker",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      })

      // Handle map clicks
      map.on("click", (e: { latlng: LatLng }) => {
        const coords = { lat: e.latlng.lat, lng: e.latlng.lng }

        // This will be handled by parent through selectingMode
        if (selectingMode === "pickup") {
          onPickupSelect(coords)
        } else if (selectingMode === "dropoff") {
          onDropoffSelect(coords)
        }
      })

      mapRef.current = map
      setIsLoaded(true)

      // Store icons for marker updates
      ;(map as unknown as { pickupIcon: L.DivIcon; dropoffIcon: L.DivIcon }).pickupIcon = pickupIcon
      ;(map as unknown as { pickupIcon: L.DivIcon; dropoffIcon: L.DivIcon }).dropoffIcon = dropoffIcon
    })

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  // Handle click event updates
  useEffect(() => {
    if (!mapRef.current) return

    mapRef.current.off("click")
    mapRef.current.on("click", (e: { latlng: LatLng }) => {
      const coords = { lat: e.latlng.lat, lng: e.latlng.lng }

      if (selectingMode === "pickup") {
        onPickupSelect(coords)
      } else if (selectingMode === "dropoff") {
        onDropoffSelect(coords)
      }
    })
  }, [selectingMode, onPickupSelect, onDropoffSelect])

  // Update pickup marker
  useEffect(() => {
    if (!mapRef.current || !isLoaded) return

    import("leaflet").then((L) => {
      if (pickupMarkerRef.current) {
        pickupMarkerRef.current.remove()
        pickupMarkerRef.current = null
      }

      if (pickupCoords) {
        const map = mapRef.current as unknown as { pickupIcon: L.DivIcon }
        pickupMarkerRef.current = L.marker([pickupCoords.lat, pickupCoords.lng], {
          icon: map.pickupIcon,
        })
          .addTo(mapRef.current!)
          .bindPopup("Punct de ridicare")
      }
    })
  }, [pickupCoords, isLoaded])

  // Update dropoff marker
  useEffect(() => {
    if (!mapRef.current || !isLoaded) return

    import("leaflet").then((L) => {
      if (dropoffMarkerRef.current) {
        dropoffMarkerRef.current.remove()
        dropoffMarkerRef.current = null
      }

      if (dropoffCoords) {
        const map = mapRef.current as unknown as { dropoffIcon: L.DivIcon }
        dropoffMarkerRef.current = L.marker([dropoffCoords.lat, dropoffCoords.lng], {
          icon: map.dropoffIcon,
        })
          .addTo(mapRef.current!)
          .bindPopup("Punct de livrare")
      }
    })
  }, [dropoffCoords, isLoaded])

  // Fit bounds when both markers are set
  useEffect(() => {
    if (!mapRef.current || !pickupCoords || !dropoffCoords) return

    import("leaflet").then((L) => {
      const bounds = L.latLngBounds(
        [pickupCoords.lat, pickupCoords.lng],
        [dropoffCoords.lat, dropoffCoords.lng]
      )
      mapRef.current!.fitBounds(bounds, { padding: [50, 50] })
    })
  }, [pickupCoords, dropoffCoords])

  return (
    <div className="relative">
      <div
        ref={mapContainerRef}
        className="h-[400px] w-full rounded-lg border"
        style={{ zIndex: 0 }}
      />
      {selectingMode && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-background/95 backdrop-blur px-4 py-2 rounded-full shadow-lg border text-sm font-medium z-10">
          {selectingMode === "pickup"
            ? "Apasă pe hartă pentru a selecta punctul de ridicare"
            : "Apasă pe hartă pentru a selecta punctul de livrare"}
        </div>
      )}
      <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur p-3 rounded-lg shadow-lg border text-xs space-y-1 z-10">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span>Punct ridicare</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span>Punct livrare</span>
        </div>
      </div>
    </div>
  )
}
