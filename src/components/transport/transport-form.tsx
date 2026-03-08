"use client"

import { useState, useEffect } from "react"
import { Loader2, MapPin, Navigation, CheckCircle, ArrowRight } from "lucide-react"
import { createTransportRequest } from "@/actions/transport"
import { toast } from "@/lib/hooks/use-toast"
import { cn } from "@/lib/utils/cn"

interface TransportFormProps {
  pickupCoords: { lat: number; lng: number } | null
  dropoffCoords: { lat: number; lng: number } | null
  selectingMode: "pickup" | "dropoff" | null
  onSelectModeChange: (mode: "pickup" | "dropoff" | null) => void
}

const fieldClass =
  "w-full h-11 px-4 bg-white border border-[#584528]/18 text-[#1a1208] placeholder:text-[#584528]/30 font-condensed text-[12px] tracking-[0.06em] outline-none focus:border-primary/50 transition-colors duration-200"

const labelClass =
  "block font-condensed text-[10px] tracking-[0.22em] uppercase text-[#584528]/55 mb-2"

async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=ro`,
      { headers: { "Accept-Language": "ro" } }
    )
    const data = await res.json()
    const a = data.address ?? {}
    const road = a.road ?? a.pedestrian ?? a.footway ?? ""
    const number = a.house_number ? ` ${a.house_number}` : ""
    const city = a.city ?? a.town ?? a.village ?? a.municipality ?? a.county ?? ""
    if (road && city) return `${road}${number}, ${city}`
    if (road) return `${road}${number}`
    return data.display_name ?? `${lat.toFixed(5)}, ${lng.toFixed(5)}`
  } catch {
    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`
  }
}

export function TransportForm({
  pickupCoords,
  dropoffCoords,
  selectingMode,
  onSelectModeChange,
}: TransportFormProps) {
  const [loading,        setLoading]        = useState(false)
  const [submitted,      setSubmitted]      = useState(false)
  const [pickupAddress,  setPickupAddress]  = useState("")
  const [dropoffAddress, setDropoffAddress] = useState("")

  useEffect(() => {
    if (!pickupCoords) return
    reverseGeocode(pickupCoords.lat, pickupCoords.lng).then(setPickupAddress)
  }, [pickupCoords])

  useEffect(() => {
    if (!dropoffCoords) return
    reverseGeocode(dropoffCoords.lat, dropoffCoords.lng).then(setDropoffAddress)
  }, [dropoffCoords])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    if (pickupCoords) {
      formData.set("pickup_lat",  pickupCoords.lat.toString())
      formData.set("pickup_lng",  pickupCoords.lng.toString())
    }
    if (dropoffCoords) {
      formData.set("dropoff_lat", dropoffCoords.lat.toString())
      formData.set("dropoff_lng", dropoffCoords.lng.toString())
    }

    const result = await createTransportRequest(formData)

    if (result.error) {
      toast({ title: "Eroare", description: result.error, variant: "destructive" })
    } else {
      toast({ title: "Cerere trimisă!", description: "Veți fi contactat în curând de un transportator." })
      setSubmitted(true)
    }
    setLoading(false)
  }

  /* ── Success state ── */
  if (submitted) {
    return (
      <div className="flex flex-col items-center text-center py-10">
        {/* Gold diamond check */}
        <div className="w-14 h-14 border border-primary/35 bg-primary/[0.06] flex items-center justify-center mb-6">
          <CheckCircle className="h-6 w-6 text-primary" />
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-px bg-primary/35" />
          <span className="font-condensed text-[9px] tracking-[0.28em] uppercase text-primary/60">
            Confirmat
          </span>
          <div className="w-8 h-px bg-primary/35" />
        </div>

        <h3 className="font-display text-2xl text-[#1a1208] mb-2">
          Cerere trimisă cu succes!
        </h3>
        <p className="font-condensed text-xs tracking-[0.10em] text-[#584528]/50 leading-relaxed mb-8 max-w-xs">
          Transportatorii din zona Tulcea au fost notificați. Veți fi contactat în curând.
        </p>

        <button
          onClick={() => { setSubmitted(false); setPickupAddress(""); setDropoffAddress("") }}
          className="flex items-center gap-2 px-6 py-3 border border-[#584528]/20 font-condensed text-[11px] tracking-[0.18em] uppercase text-[#584528]/55 hover:border-primary/40 hover:text-primary transition-all duration-200"
        >
          Trimite altă cerere
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    )
  }

  /* ── Form ── */
  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Pickup */}
      <div>
        <label htmlFor="pickup_address" className={labelClass}>
          Adresa de ridicare *
        </label>
        <div className="flex gap-2">
          <input
            id="pickup_address"
            name="pickup_address"
            placeholder="Str. Pacii 15, Tulcea"
            required
            value={pickupAddress}
            onChange={(e) => setPickupAddress(e.target.value)}
            className={cn(fieldClass, "flex-1")}
          />
          <button
            type="button"
            onClick={() => onSelectModeChange(selectingMode === "pickup" ? null : "pickup")}
            title="Selectează pe hartă"
            className={cn(
              "h-11 w-11 flex items-center justify-center border transition-all duration-200 shrink-0",
              selectingMode === "pickup"
                ? "bg-primary border-primary text-white"
                : "border-[#584528]/18 text-[#584528]/45 hover:border-primary/40 hover:text-primary"
            )}
          >
            <MapPin className="h-4 w-4" />
          </button>
        </div>
        {pickupCoords && (
          <p className="mt-1.5 font-condensed text-[10px] tracking-wide text-primary/60">
            ✓ Coordonate: {pickupCoords.lat.toFixed(5)}, {pickupCoords.lng.toFixed(5)}
          </p>
        )}
      </div>

      {/* Dropoff */}
      <div>
        <label htmlFor="dropoff_address" className={labelClass}>
          Adresa de livrare *
        </label>
        <div className="flex gap-2">
          <input
            id="dropoff_address"
            name="dropoff_address"
            placeholder="Str. Portului 42, Tulcea"
            required
            value={dropoffAddress}
            onChange={(e) => setDropoffAddress(e.target.value)}
            className={cn(fieldClass, "flex-1")}
          />
          <button
            type="button"
            onClick={() => onSelectModeChange(selectingMode === "dropoff" ? null : "dropoff")}
            title="Selectează pe hartă"
            className={cn(
              "h-11 w-11 flex items-center justify-center border transition-all duration-200 shrink-0",
              selectingMode === "dropoff"
                ? "bg-primary border-primary text-white"
                : "border-[#584528]/18 text-[#584528]/45 hover:border-primary/40 hover:text-primary"
            )}
          >
            <Navigation className="h-4 w-4" />
          </button>
        </div>
        {dropoffCoords && (
          <p className="mt-1.5 font-condensed text-[10px] tracking-wide text-primary/60">
            ✓ Coordonate: {dropoffCoords.lat.toFixed(5)}, {dropoffCoords.lng.toFixed(5)}
          </p>
        )}
      </div>

      {/* Thin gold divider */}
      <div className="h-px bg-[#584528]/08" />

      {/* Description */}
      <div>
        <label htmlFor="description" className={labelClass}>
          Descriere marfă
        </label>
        <textarea
          id="description"
          name="description"
          placeholder="Ex: mobilă, electronice, materiale de construcții..."
          rows={3}
          className="w-full px-4 py-3 bg-white border border-[#584528]/18 text-[#1a1208] placeholder:text-[#584528]/30 font-condensed text-[12px] tracking-[0.06em] outline-none focus:border-primary/50 transition-colors duration-200 resize-none"
        />
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className={labelClass}>
          Telefon de contact *
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          placeholder="0740 123 456"
          required
          className={fieldClass}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full h-12 bg-primary/90 hover:bg-primary text-white font-condensed tracking-[0.20em] uppercase text-sm font-semibold flex items-center justify-center gap-2.5 transition-colors duration-200 disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Se trimite...
          </>
        ) : (
          <>
            <MapPin className="h-4 w-4" />
            Trimite cererea
          </>
        )}
      </button>
    </form>
  )
}
