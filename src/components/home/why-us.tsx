"use client"

import { useRef, useState, useEffect } from "react"
import { ShieldCheck, MessageSquare, Star, MapPin } from "lucide-react"

const benefits = [
  {
    icon: ShieldCheck,
    title: "Meșteri verificați",
    description: "Fiecare meșter este evaluat și aprobat manual înainte de listare. Fără surprize neplăcute — doar profesioniști de încredere.",
    num: "01",
  },
  {
    icon: MessageSquare,
    title: "Contact direct",
    description: "Comunici direct cu meșterul tău ales. Simplu, rapid, fără pași în plus sau formalități inutile.",
    num: "02",
  },
  {
    icon: Star,
    title: "Recenzii autentice",
    description: "Toate recenziile sunt lăsate de clienți reali. Transparență totală — știi exact la ce să te aștepți.",
    num: "03",
  },
  {
    icon: MapPin,
    title: "Meșteri locali",
    description: "Conectăm exclusiv meșteri din Tulcea și zona limitrofă. Prezență locală, răspuns rapid, fără drumuri lungi.",
    num: "04",
  },
]

export function WhyUs() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headerRef  = useRef<HTMLDivElement>(null)
  const [sectionVisible, setSectionVisible] = useState(false)
  const [headerVisible,  setHeaderVisible]  = useState(false)

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    if (headerRef.current) {
      const o = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) { setHeaderVisible(true); o.disconnect() } },
        { threshold: 0.2 }
      )
      o.observe(headerRef.current)
      observers.push(o)
    }

    if (sectionRef.current) {
      const o = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) { setSectionVisible(true); o.disconnect() } },
        { threshold: 0.08 }
      )
      o.observe(sectionRef.current)
      observers.push(o)
    }

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  return (
    <section style={{ background: "#f9f5ec" }}>

      {/* Top separator */}
      <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(160,112,32,0.35), transparent)" }} />

      <div className="container px-4 md:px-8 py-16 md:py-24">

        {/* Section header — fade + slide up */}
        <div
          ref={headerRef}
          className="text-center mb-12 md:mb-16"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "translateY(0)" : "translateY(22px)",
            transition: "opacity 0.7s ease, transform 0.7s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <p className="font-condensed tracking-[0.32em] uppercase text-xs mb-4" style={{ color: "#a07828" }}>
            De ce noi
          </p>
          <h2
            className="font-display leading-[1.06]"
            style={{ fontSize: "clamp(32px, 5vw, 54px)", fontWeight: 600, color: "#0d0905" }}
          >
            De ce{" "}
            <em style={{ color: "#a07828", fontStyle: "italic" }}>Meșteri</em>
            {" "}de Tulcea?
          </h2>
          <div className="mx-auto mt-5" style={{ width: "48px", height: "1px", background: "rgba(160,112,32,0.45)" }} />
          <p className="font-condensed tracking-wide mt-5 mx-auto" style={{ fontSize: "16px", color: "rgba(13,9,5,0.5)", maxWidth: "460px", lineHeight: 1.7 }}>
            Platforma care pune calitatea și încrederea pe primul loc.
          </p>
        </div>

        {/* ── Mobile: dark snap-scroll cards with staggered entrance ── */}
        <div
          ref={sectionRef}
          className="md:hidden -mx-4 overflow-x-auto flex pb-6"
          style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none", WebkitOverflowScrolling: "touch" as never }}
        >
          {benefits.map((b, i) => (
            <div
              key={b.title + "-m"}
              className="shrink-0 relative overflow-hidden flex flex-col"
              style={{
                width: "78vw",
                maxWidth: "320px",
                scrollSnapAlign: "start",
                marginLeft: i === 0 ? "16px" : "10px",
                marginRight: i === benefits.length - 1 ? "16px" : "0",
                background: "#0d0905",
                border: "1px solid rgba(160,112,32,0.22)",
                padding: "32px 24px 28px",
                /* entrance animation */
                opacity: sectionVisible ? 1 : 0,
                transform: sectionVisible ? "translateY(0) scale(1)" : "translateY(32px) scale(0.97)",
                transition: `opacity 0.65s ease ${i * 110}ms, transform 0.65s cubic-bezier(0.16,1,0.3,1) ${i * 110}ms`,
              }}
            >
              {/* Ghost number backdrop */}
              <div
                className="absolute -bottom-3 -right-1 font-display font-bold select-none leading-none pointer-events-none"
                style={{ fontSize: "130px", color: "rgba(160,112,32,0.07)", lineHeight: 1 }}
              >
                {b.num}
              </div>
              {/* Top accent line — grows in */}
              <div
                style={{
                  width: sectionVisible ? "32px" : "0px",
                  height: "2px",
                  background: "rgba(160,112,32,0.6)",
                  marginBottom: "24px",
                  transition: `width 0.5s ease ${i * 110 + 300}ms`,
                }}
              />
              {/* Icon */}
              <div
                className="flex items-center justify-center mb-5"
                style={{
                  width: "52px",
                  height: "52px",
                  border: "1px solid rgba(160,112,32,0.32)",
                  background: "rgba(160,112,32,0.06)",
                  opacity: sectionVisible ? 1 : 0,
                  transform: sectionVisible ? "scale(1)" : "scale(0.7)",
                  transition: `opacity 0.45s ease ${i * 110 + 250}ms, transform 0.45s cubic-bezier(0.34,1.56,0.64,1) ${i * 110 + 250}ms`,
                }}
              >
                <b.icon style={{ width: "22px", height: "22px", color: "#a07828" }} />
              </div>
              {/* Num label */}
              <p className="font-condensed tracking-[0.28em] uppercase mb-1.5" style={{ fontSize: "9px", color: "rgba(160,112,32,0.5)" }}>{b.num}</p>
              {/* Title */}
              <h3 className="font-display text-white leading-snug mb-3" style={{ fontSize: "clamp(22px, 6vw, 28px)", fontWeight: 600 }}>
                {b.title}
              </h3>
              {/* Description */}
              <p className="font-condensed tracking-wide" style={{ fontSize: "13px", color: "rgba(255,255,255,0.42)", lineHeight: 1.8 }}>
                {b.description}
              </p>
              {/* Bottom ornament */}
              <div className="flex items-center gap-2 mt-6">
                <div className="w-1.5 h-1.5 rotate-45 shrink-0" style={{ background: "rgba(160,112,32,0.45)" }} />
                <div className="flex-1 h-px" style={{ background: "rgba(160,112,32,0.12)" }} />
              </div>
            </div>
          ))}
        </div>
        {/* Scroll hint dots — fade in last */}
        <div
          className="md:hidden flex justify-center gap-1.5 mb-6"
          style={{
            opacity: sectionVisible ? 1 : 0,
            transition: "opacity 0.5s ease 500ms",
          }}
        >
          {benefits.map((b) => (
            <div key={b.num} className="w-1.5 h-1.5 rotate-45" style={{ background: "rgba(160,112,32,0.25)" }} />
          ))}
        </div>

        {/* ── Desktop: 2×2 card grid ── */}
        <div className="hidden md:grid md:grid-cols-2 gap-px" style={{ background: "rgba(160,112,32,0.18)" }}>
          {benefits.map((b) => (
            <div
              key={b.title}
              className="group relative overflow-hidden"
              style={{ background: "#fdfaf3", padding: "48px 44px 44px" }}
            >
              {/* Ghost number — full height backdrop */}
              <div
                className="absolute -bottom-4 -right-2 font-display font-bold select-none leading-none pointer-events-none"
                style={{
                  fontSize: "clamp(120px, 14vw, 190px)",
                  color: "rgba(160,112,32,0.065)",
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                {b.num}
              </div>

              {/* Top gold bar on hover */}
              <div
                className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: "rgba(160,112,32,0.6)" }}
              />

              {/* Icon */}
              <div
                className="flex items-center justify-center mb-8 transition-colors duration-300 group-hover:bg-[rgba(160,112,32,0.1)]"
                style={{
                  width: "72px",
                  height: "72px",
                  border: "1px solid rgba(160,112,32,0.3)",
                }}
              >
                <b.icon style={{ width: "28px", height: "28px", color: "#a07828" }} />
              </div>

              {/* Title */}
              <h3
                className="font-display relative mb-4 leading-snug"
                style={{ fontSize: "clamp(24px, 2.6vw, 34px)", fontWeight: 600, color: "#0d0905" }}
              >
                {b.title}
              </h3>

              {/* Description */}
              <p
                className="font-condensed tracking-wide relative"
                style={{ fontSize: "16px", color: "rgba(13,9,5,0.55)", lineHeight: 1.8 }}
              >
                {b.description}
              </p>

              {/* Bottom ornament */}
              <div className="flex items-center gap-2 mt-8 relative">
                <div className="w-1.5 h-1.5 rotate-45 shrink-0" style={{ background: "rgba(160,112,32,0.4)" }} />
                <div className="flex-1 h-px" style={{ background: "rgba(160,112,32,0.15)" }} />
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Bottom separator */}
      <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(160,112,32,0.35), transparent)" }} />

    </section>
  )
}
