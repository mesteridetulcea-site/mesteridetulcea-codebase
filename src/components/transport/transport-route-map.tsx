"use client"

import { useEffect, useState, useRef } from "react"
import { MapContainer, TileLayer, Polyline, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

interface TransportRouteMapProps {
  pickupLat: number
  pickupLng: number
  dropoffLat: number
  dropoffLng: number
}

interface RouteData {
  coords: [number, number][]
  distanceKm: number
  durationMin: number
}

function FitBounds({ coords }: { coords: [number, number][] }) {
  const map = useMap()
  useEffect(() => {
    if (coords.length >= 2) {
      const bounds = L.latLngBounds(coords.map(([lat, lng]) => L.latLng(lat, lng)))
      map.fitBounds(bounds, { padding: [48, 48] })
    }
  }, [map, coords])
  return null
}

function Markers({
  pickup,
  dropoff,
}: {
  pickup: [number, number]
  dropoff: [number, number]
}) {
  const map = useMap()

  useEffect(() => {
    const pickupIcon = L.divIcon({
      className: "",
      html: `<div style="width:28px;height:28px;background:#16a34a;border:2px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      </div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    })
    const dropoffIcon = L.divIcon({
      className: "",
      html: `<div style="width:28px;height:28px;background:#dc2626;border:2px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
      </div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 28],
    })

    const m1 = L.marker(pickup, { icon: pickupIcon }).addTo(map).bindPopup("Punct de ridicare")
    const m2 = L.marker(dropoff, { icon: dropoffIcon }).addTo(map).bindPopup("Punct de livrare")

    return () => {
      map.removeLayer(m1)
      map.removeLayer(m2)
    }
  }, [map, pickup, dropoff])

  return null
}

export function TransportRouteMap({
  pickupLat,
  pickupLng,
  dropoffLat,
  dropoffLng,
}: TransportRouteMapProps) {
  const [route, setRoute] = useState<RouteData | null>(null)
  const [loading, setLoading] = useState(true)
  const fetched = useRef(false)

  useEffect(() => {
    if (fetched.current) return
    fetched.current = true

    fetch(
      `https://router.project-osrm.org/route/v1/driving/${pickupLng},${pickupLat};${dropoffLng},${dropoffLat}?overview=full&geometries=geojson`
    )
      .then((r) => r.json())
      .then((data) => {
        if (data.routes?.[0]) {
          const r = data.routes[0]
          // GeoJSON coords are [lng, lat] — swap to [lat, lng] for Leaflet
          const coords: [number, number][] = r.geometry.coordinates.map(
            ([lng, lat]: [number, number]) => [lat, lng]
          )
          setRoute({
            coords,
            distanceKm: r.distance / 1000,
            durationMin: Math.round(r.duration / 60),
          })
        }
      })
      .catch(() => {
        // fallback: straight line
        setRoute({
          coords: [[pickupLat, pickupLng], [dropoffLat, dropoffLng]],
          distanceKm: 0,
          durationMin: 0,
        })
      })
      .finally(() => setLoading(false))
  }, [pickupLat, pickupLng, dropoffLat, dropoffLng])

  const center: [number, number] = [
    (pickupLat + dropoffLat) / 2,
    (pickupLng + dropoffLng) / 2,
  ]

  return (
    <div className="space-y-3">
      {/* Route info bar */}
      {!loading && route && route.distanceKm > 0 && (
        <div className="flex items-center gap-6 px-4 py-3 bg-white border border-[#e8dcc8]">
          <div className="flex items-center gap-2">
            <span className="font-condensed text-[10px] tracking-[0.20em] uppercase text-[#3d2e1a]/40">
              Distanță rutieră
            </span>
            <span className="font-condensed font-bold text-primary text-sm tracking-wide">
              {route.distanceKm.toFixed(1)} km
            </span>
          </div>
          <div className="w-px h-4 bg-[#e8dcc8]" />
          <div className="flex items-center gap-2">
            <span className="font-condensed text-[10px] tracking-[0.20em] uppercase text-[#3d2e1a]/40">
              Durată estimată
            </span>
            <span className="font-condensed font-bold text-[#3d2e1a]/70 text-sm tracking-wide">
              {route.durationMin} min
            </span>
          </div>
        </div>
      )}

      {/* Map */}
      <div className="relative border border-[#e8dcc8] overflow-hidden" style={{ height: 380 }}>
        {loading && (
          <div className="absolute inset-0 bg-[#f5eed8] flex items-center justify-center z-10">
            <p className="font-condensed text-[11px] tracking-[0.22em] uppercase text-[#3d2e1a]/40 animate-pulse">
              Se calculează ruta...
            </p>
          </div>
        )}
        <MapContainer
          center={center}
          zoom={12}
          style={{ width: "100%", height: "100%" }}
          zoomControl={true}
          scrollWheelZoom={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          {route && (
            <>
              <Polyline
                positions={route.coords}
                pathOptions={{ color: "#2563eb", weight: 4, opacity: 0.85 }}
              />
              <FitBounds coords={route.coords} />
            </>
          )}
          <Markers
            pickup={[pickupLat, pickupLng]}
            dropoff={[dropoffLat, dropoffLng]}
          />
        </MapContainer>
      </div>
    </div>
  )
}
