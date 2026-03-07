"use client"

import dynamic from "next/dynamic"

const MapComponent = dynamic(
  () => import("./transport-route-map").then((m) => m.TransportRouteMap),
  {
    ssr: false,
    loading: () => (
      <div
        className="border border-[#e8dcc8] bg-[#f5eed8] flex items-center justify-center"
        style={{ height: 380 }}
      >
        <p className="font-condensed text-[11px] tracking-[0.22em] uppercase text-[#3d2e1a]/35 animate-pulse">
          Se încarcă harta...
        </p>
      </div>
    ),
  }
)

interface Props {
  pickupLat: number
  pickupLng: number
  dropoffLat: number
  dropoffLng: number
}

export function TransportRouteMapDynamic(props: Props) {
  return <MapComponent {...props} />
}
