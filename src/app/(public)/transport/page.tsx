"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import Link from "next/link"
import { Truck, Package, MessageSquare, MapPin, ClipboardList } from "lucide-react"
import { TransportForm } from "@/components/transport/transport-form"

const TransportMap = dynamic(
  () => import("@/components/transport/transport-map").then((mod) => mod.TransportMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full bg-[#0d0905] border border-[#3d2e14] flex flex-col items-center justify-center gap-3" style={{ height: 420 }}>
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(196,146,30,1) 1px, transparent 1px), linear-gradient(90deg, rgba(196,146,30,1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <MapPin className="h-6 w-6 text-primary/40 animate-pulse relative z-10" />
        <p className="font-condensed text-[11px] tracking-[0.22em] uppercase text-white/30 relative z-10">
          Se încarcă harta...
        </p>
      </div>
    ),
  }
)

const FEATURES = [
  {
    icon: Truck,
    title: "Transportatori locali",
    desc: "Colaborăm cu transportatori verificați din zona Tulcea",
    num: "01",
  },
  {
    icon: Package,
    title: "Orice tip de marfă",
    desc: "Mobilă, electronice, materiale de construcții și altele",
    num: "02",
  },
  {
    icon: MessageSquare,
    title: "Răspuns rapid",
    desc: "Primești oferte de la transportatori în cel mai scurt timp",
    num: "03",
  },
]

export default function TransportPage() {
  const [pickupCoords,  setPickupCoords]  = useState<{ lat: number; lng: number } | null>(null)
  const [dropoffCoords, setDropoffCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [selectingMode, setSelectingMode] = useState<"pickup" | "dropoff" | null>(null)

  return (
    <>
      {/* ══════════════════════════════════════════
          HERO — same pattern as /mesteri & /cauta
      ══════════════════════════════════════════ */}
      <section className="relative bg-[#0d0905] overflow-hidden -mt-[62px]" style={{ minHeight: 400 }}>

        {/* Background photo — truck / logistics */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1587293852726-70cdb56c2866?q=80&w=1472&auto=format&fit=crop"
            alt=""
            fill
            priority
            className="object-cover object-center opacity-[0.17]"
          />
        </div>

        {/* Dark overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0905]/88 via-[#0d0905]/52 to-[#0d0905]/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0905]/78 via-transparent to-[#0d0905]/78" />

        {/* Vignette */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 28%, rgba(13,9,5,0.82) 100%)" }} />

        {/* Gold grid lines */}
        <div className="absolute inset-0 opacity-[0.042]"
          style={{
            backgroundImage: "linear-gradient(rgba(196,146,30,1) 1px, transparent 1px), linear-gradient(90deg, rgba(196,146,30,1) 1px, transparent 1px)",
            backgroundSize: "52px 52px",
            maskImage: "radial-gradient(ellipse 76% 78% at 50% 50%, black 20%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 76% 78% at 50% 50%, black 20%, transparent 100%)",
          }}
        />

        {/* Gold glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 65% 55% at 50% 60%, rgba(196,146,30,0.065) 0%, transparent 70%)" }} />

        {/* Ghost "TRANSPORT" text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden" aria-hidden="true">
          <span className="font-display font-bold leading-none tracking-tighter whitespace-nowrap"
            style={{ fontSize: "clamp(56px, 16vw, 200px)", color: "rgba(255,255,255,0.022)" }}>
            
          </span>
        </div>

        {/* Bottom rule */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/28 to-transparent" />

        {/* Content */}
        <div className="container relative z-10 pt-[100px] pb-14">

          {/* Ornament */}
          <div className="flex items-center gap-5 mb-8">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/38" />
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-primary/58 rotate-45" />
              <div className="w-1 h-1 bg-primary/28 rotate-45" />
              <div className="w-1.5 h-1.5 bg-primary/58 rotate-45" />
            </div>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/38" />
          </div>

          {/* Overline */}
          <p className="font-condensed text-primary text-[10px] tracking-[0.32em] uppercase mb-4">
            Servicii de transport
          </p>

          {/* Heading */}
          <h1 className="font-display text-white/92 leading-[1.05]"
            style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)", fontWeight: 600 }}>
            Transport marfă{" "}
            <em className="text-primary" style={{ fontStyle: "italic" }}>Tulcea</em>
          </h1>

          {/* Subtitle */}
          <p className="mt-4 font-condensed text-white/32 tracking-[0.16em] text-xs uppercase max-w-lg">
            Mobilă · Electronice · Materiale de construcții · Orice marfă
          </p>

          {/* Stats strip */}
          <div className="flex items-center gap-6 mt-8">
            <div className="flex items-center gap-2">
              <span className="w-[3px] h-[3px] bg-primary rotate-45 inline-block" />
              <span className="font-condensed text-white/28 text-[11px] tracking-[0.16em] uppercase">
                Transportatori verificați
              </span>
            </div>
            <div className="w-px h-3 bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <span className="w-[3px] h-[3px] bg-primary rotate-45 inline-block" />
              <span className="font-condensed text-white/28 text-[11px] tracking-[0.16em] uppercase">
                Tulcea & împrejurimi
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          MAIN CONTENT — white bg
      ══════════════════════════════════════════ */}
      <div className="bg-white">
        <div className="container py-12">

          <div className="grid lg:grid-cols-2 gap-px bg-[#584528]/10">

            {/* Map column */}
            <div className="bg-white p-8 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-4 h-px bg-primary/50" />
                <span className="font-condensed text-[10px] tracking-[0.26em] uppercase text-[#584528]/55">
                  Selectează pe hartă
                </span>
              </div>
              <div className="relative overflow-hidden border border-[#584528]/12">
                <TransportMap
                  pickupCoords={pickupCoords}
                  dropoffCoords={dropoffCoords}
                  onPickupSelect={(c) => { setPickupCoords(c); setSelectingMode(null) }}
                  onDropoffSelect={(c) => { setDropoffCoords(c); setSelectingMode(null) }}
                  selectingMode={selectingMode}
                />
              </div>
              <p className="font-condensed text-[10px] tracking-[0.14em] text-[#584528]/38">
                Apasă butonul de lângă câmpul de adresă pentru a selecta punctul direct pe hartă.
              </p>
            </div>

            {/* Form column */}
            <div className="bg-white p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-px bg-primary/50" />
                  <span className="font-condensed text-[10px] tracking-[0.26em] uppercase text-[#584528]/55">
                    Detalii cerere
                  </span>
                </div>
                <Link
                  href="/cont/cereri"
                  className="inline-flex items-center gap-1.5 font-condensed text-[10px] tracking-[0.18em] uppercase text-[#584528]/45 hover:text-primary border border-[#584528]/15 hover:border-primary/35 px-3 py-1.5 transition-all duration-200"
                >
                  <ClipboardList className="h-3 w-3" />
                  Cererile mele
                </Link>
              </div>
              <TransportForm
                pickupCoords={pickupCoords}
                dropoffCoords={dropoffCoords}
                selectingMode={selectingMode}
                onSelectModeChange={setSelectingMode}
              />
            </div>
          </div>

          {/* ── Features strip ── */}
          <div className="mt-px grid sm:grid-cols-3 gap-px bg-[#584528]/10">
            {FEATURES.map((f) => {
              const Icon = f.icon
              return (
                <div key={f.num} className="bg-white p-8 relative group">
                  {/* Giant numeral */}
                  <span className="absolute top-4 right-5 font-display font-bold text-6xl text-[#584528]/[0.04] leading-none select-none">
                    {f.num}
                  </span>
                  {/* Icon */}
                  <div className="w-10 h-10 border border-[#584528]/18 group-hover:border-primary/35 flex items-center justify-center mb-5 transition-colors duration-200">
                    <Icon className="h-4.5 w-4.5 text-[#584528]/45 group-hover:text-primary transition-colors duration-200" style={{ width: 18, height: 18 }} />
                  </div>
                  {/* Text */}
                  <h3 className="font-display text-lg text-[#1a1208] mb-2">{f.title}</h3>
                  <p className="font-condensed text-xs tracking-[0.08em] text-[#584528]/50 leading-relaxed">{f.desc}</p>
                  {/* Bottom accent */}
                  <div className="absolute bottom-0 left-8 w-8 h-px bg-primary/0 group-hover:bg-primary/40 transition-all duration-300" />
                </div>
              )
            })}
          </div>

        </div>
      </div>
    </>
  )
}
