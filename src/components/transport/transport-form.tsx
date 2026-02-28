"use client"

import { useState } from "react"
import { Loader2, MapPin, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { createTransportRequest } from "@/actions/transport"
import { toast } from "@/lib/hooks/use-toast"

interface TransportFormProps {
  pickupCoords: { lat: number; lng: number } | null
  dropoffCoords: { lat: number; lng: number } | null
  selectingMode: "pickup" | "dropoff" | null
  onSelectModeChange: (mode: "pickup" | "dropoff" | null) => void
}

export function TransportForm({
  pickupCoords,
  dropoffCoords,
  selectingMode,
  onSelectModeChange,
}: TransportFormProps) {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    // Add coordinates to form data
    if (pickupCoords) {
      formData.set("pickup_lat", pickupCoords.lat.toString())
      formData.set("pickup_lng", pickupCoords.lng.toString())
    }
    if (dropoffCoords) {
      formData.set("dropoff_lat", dropoffCoords.lat.toString())
      formData.set("dropoff_lng", dropoffCoords.lng.toString())
    }

    const result = await createTransportRequest(formData)

    if (result.error) {
      toast({
        title: "Eroare",
        description: result.error,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Cerere trimisă!",
        description: "Veți fi contactat în curând de un transportator.",
      })
      setSubmitted(true)
    }

    setLoading(false)
  }

  if (submitted) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Cerere trimisă cu succes!</h3>
          <p className="text-muted-foreground mb-6">
            Transportatorii din zona Tulcea au fost notificați. Veți fi contactat în curând.
          </p>
          <Button onClick={() => setSubmitted(false)} variant="outline">
            Trimite altă cerere
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Solicită Transport</CardTitle>
        <CardDescription>
          Completează detaliile pentru cererea de transport marfă
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Pickup Location */}
          <div className="space-y-2">
            <Label htmlFor="pickup_address">
              Adresa de ridicare *
            </Label>
            <div className="flex gap-2">
              <Input
                id="pickup_address"
                name="pickup_address"
                placeholder="Str. Pacii 15, Tulcea"
                required
                className="flex-1"
              />
              <Button
                type="button"
                variant={selectingMode === "pickup" ? "default" : "outline"}
                size="icon"
                onClick={() => onSelectModeChange(selectingMode === "pickup" ? null : "pickup")}
                title="Selectează pe hartă"
              >
                <MapPin className="h-4 w-4" />
              </Button>
            </div>
            {pickupCoords && (
              <p className="text-xs text-muted-foreground">
                Coordonate: {pickupCoords.lat.toFixed(5)}, {pickupCoords.lng.toFixed(5)}
              </p>
            )}
          </div>

          {/* Dropoff Location */}
          <div className="space-y-2">
            <Label htmlFor="dropoff_address">
              Adresa de livrare *
            </Label>
            <div className="flex gap-2">
              <Input
                id="dropoff_address"
                name="dropoff_address"
                placeholder="Str. Portului 42, Tulcea"
                required
                className="flex-1"
              />
              <Button
                type="button"
                variant={selectingMode === "dropoff" ? "default" : "outline"}
                size="icon"
                onClick={() => onSelectModeChange(selectingMode === "dropoff" ? null : "dropoff")}
                title="Selectează pe hartă"
              >
                <Navigation className="h-4 w-4" />
              </Button>
            </div>
            {dropoffCoords && (
              <p className="text-xs text-muted-foreground">
                Coordonate: {dropoffCoords.lat.toFixed(5)}, {dropoffCoords.lng.toFixed(5)}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Descriere marfă
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Ex: Mobilă, electronice, materiale de construcții..."
              rows={3}
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">
              Telefon de contact *
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="0740 123 456"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Se trimite...
              </>
            ) : (
              <>
                <MapPin className="h-4 w-4 mr-2" />
                Trimite cererea
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
