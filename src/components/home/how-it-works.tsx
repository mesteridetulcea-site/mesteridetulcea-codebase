"use client"

import { useRef, useState, useEffect } from "react"
import { Search, UserCheck, MessageSquare, Star } from "lucide-react"

const steps = [
  {
    icon: Search,
    title: "Caută",
    description: "Spune-ne ce lucrare ai de făcut sau alege direct o categorie din cele disponibile.",
    num: "01",
  },
  {
    icon: UserCheck,
    title: "Alege",
    description: "Compară meșterii după recenzii, fotografii ale lucrărilor și experiență.",
    num: "02",
  },
  {
    icon: MessageSquare,
    title: "Contactează",
    description: "Trimite un mesaj direct pe WhatsApp meșterului ales. Fără intermediari.",
    num: "03",
  },
  {
    icon: Star,
    title: "Evaluează",
    description: "După finalizarea lucrării, lasă o recenzie sinceră pentru comunitate.",
    num: "04",
  },
]

export function HowItWorks() {
  const headerRef   = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const [headerVisible,   setHeaderVisible]   = useState(false)
  const [timelineVisible, setTimelineVisible] = useState(false)

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    if (headerRef.current) {
      const o = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) { setHeaderVisible(true); o.disconnect() } },
        { threshold: 0.3 }
      )
      o.observe(headerRef.current)
      observers.push(o)
    }

    if (timelineRef.current) {
      const o = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) { setTimelineVisible(true); o.disconnect() } },
        { threshold: 0.05 }
      )
      o.observe(timelineRef.current)
      observers.push(o)
    }

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  return (
    <section className="relative overflow-hidden py-16 md:py-28" style={{ background: "#faf6ed" }}>

      {/* Diagonal hatching */}
      <div
        className="absolute inset-0 opacity-[0.018] pointer-events-none"
        style={{
          backgroundImage: "repeating-linear-gradient(45deg, #584528 0, #584528 1px, transparent 0, transparent 50%)",
          backgroundSize: "14px 14px",
        }}
      />
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(196,146,30,0.25) 30%, rgba(196,146,30,0.25) 70%, transparent)" }} />
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(196,146,30,0.25) 30%, rgba(196,146,30,0.25) 70%, transparent)" }} />

      <div className="relative z-10">

        {/* ── Header — fade + slide up ── */}
        <div className="container px-4 md:px-8">
          <div
            ref={headerRef}
            className="flex flex-col items-center text-center mb-10 md:mb-16"
            style={{
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.7s ease, transform 0.7s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <div className="flex items-center gap-5 mb-6">
              <div
                className="h-px bg-gradient-to-r from-transparent to-primary/38"
                style={{
                  width: headerVisible ? "48px" : "0px",
                  transition: "width 0.6s ease 0.2s",
                }}
              />
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-primary/55 rotate-45" />
                <div className="w-1 h-1 bg-primary/25 rotate-45" />
                <div className="w-1.5 h-1.5 bg-primary/55 rotate-45" />
              </div>
              <div
                className="h-px bg-gradient-to-l from-transparent to-primary/38"
                style={{
                  width: headerVisible ? "48px" : "0px",
                  transition: "width 0.6s ease 0.2s",
                }}
              />
            </div>
            <p className="font-condensed text-primary text-[10px] tracking-[0.32em] uppercase mb-3">Simplu și rapid</p>
            <h2
              className="font-display text-[#1a0f05] leading-[1.06] tracking-tight"
              style={{ fontSize: "clamp(1.75rem, 5vw, 3.5rem)", fontWeight: 600 }}
            >
              Cum <em className="text-primary italic">funcționează</em>
            </h2>
          </div>
        </div>

        {/* ── Mobile: vertical connected timeline with entrance animations ── */}
        <div className="lg:hidden container px-4">
          <div ref={timelineRef} className="relative">

            {/* Vertical gold line — grows downward */}
            <div
              className="absolute"
              style={{
                left: "19px",
                top: "20px",
                width: "1px",
                transformOrigin: "top",
                height: timelineVisible ? "calc(100% - 40px)" : "0%",
                background: "linear-gradient(to bottom, rgba(160,112,32,0.55) 0%, rgba(160,112,32,0.12) 100%)",
                transition: `height 1.1s cubic-bezier(0.16,1,0.3,1) 150ms`,
              }}
            />

            <div className="flex flex-col">
              {steps.map((step, i) => (
                <div
                  key={step.title}
                  className="relative flex gap-5"
                  style={{
                    opacity: timelineVisible ? 1 : 0,
                    transform: timelineVisible ? "translateX(0)" : "translateX(-18px)",
                    transition: `opacity 0.6s ease ${i * 140 + 200}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 140 + 200}ms`,
                  }}
                >
                  {/* Left column: icon node — pops in */}
                  <div
                    className="relative z-10 shrink-0 flex flex-col items-center"
                    style={{ width: "40px" }}
                  >
                    <div
                      className="flex items-center justify-center"
                      style={{
                        width: "40px",
                        height: "40px",
                        background: "#faf6ed",
                        border: "1px solid rgba(160,112,32,0.55)",
                        marginTop: "4px",
                        transform: timelineVisible ? "scale(1)" : "scale(0.5)",
                        opacity: timelineVisible ? 1 : 0,
                        transition: `transform 0.4s cubic-bezier(0.34,1.56,0.64,1) ${i * 140 + 350}ms, opacity 0.3s ease ${i * 140 + 350}ms`,
                      }}
                    >
                      <step.icon style={{ width: "15px", height: "15px", color: "#a07828" }} />
                    </div>
                  </div>

                  {/* Right column: content card */}
                  <div
                    className="flex-1 mb-4"
                    style={{
                      background: "white",
                      border: "1px solid rgba(88,69,40,0.12)",
                      padding: "20px 20px 18px",
                    }}
                  >
                    {/* Ghost number */}
                    <div
                      aria-hidden="true"
                      className="font-display font-bold leading-none select-none pointer-events-none float-right -mt-1 -mr-1"
                      style={{ fontSize: "52px", color: "rgba(196,146,30,0.13)", lineHeight: 1 }}
                    >
                      {step.num}
                    </div>

                    <p className="font-condensed tracking-[0.24em] uppercase mb-1" style={{ fontSize: "9px", color: "rgba(160,112,32,0.55)" }}>
                      Pasul {i + 1}
                    </p>
                    <h3 className="font-display text-[#1a0f05] leading-snug mb-2" style={{ fontSize: "22px", fontWeight: 600 }}>
                      {step.title}
                    </h3>
                    <p className="font-condensed tracking-wide text-[#6b4f35]" style={{ fontSize: "13px", lineHeight: 1.75 }}>
                      {step.description}
                    </p>

                    {/* Connector arrow — fades in slightly after the card */}
                    {i < steps.length - 1 && (
                      <div
                        className="flex items-center gap-2 mt-4"
                        style={{
                          borderTop: "1px solid rgba(88,69,40,0.08)",
                          paddingTop: "12px",
                          opacity: timelineVisible ? 1 : 0,
                          transition: `opacity 0.5s ease ${i * 140 + 500}ms`,
                        }}
                      >
                        <div style={{ width: "20px", height: "1px", background: "rgba(160,112,32,0.3)" }} />
                        <div style={{ width: "5px", height: "5px", borderRight: "1px solid rgba(160,112,32,0.5)", borderBottom: "1px solid rgba(160,112,32,0.5)", transform: "rotate(-45deg)", marginLeft: "-6px" }} />
                        <span className="font-condensed tracking-[0.16em] uppercase" style={{ fontSize: "9px", color: "rgba(160,112,32,0.4)" }}>
                          următorul pas
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Desktop: 4-column horizontal ── */}
        <div className="container px-4 md:px-8">
          <div className="hidden lg:grid grid-cols-4 gap-0">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="relative group px-8 py-6"
                style={{ borderLeft: index > 0 ? "1px solid rgba(88,69,40,0.12)" : undefined }}
              >
                <div
                  className="absolute top-0 left-8"
                  style={{ width: "32px", height: "2px", background: "hsl(38 68% 44% / 0.5)" }}
                />
                <div
                  aria-hidden="true"
                  className="font-display font-bold leading-none select-none pointer-events-none"
                  style={{ fontSize: "clamp(72px, 8vw, 104px)", color: "rgba(196,146,30,0.13)", marginBottom: "-8px" }}
                >
                  {step.num}
                </div>
                <div
                  className="flex items-center justify-center mt-4 mb-5 transition-all duration-300 group-hover:bg-primary"
                  style={{ width: "42px", height: "42px", border: "1px solid hsl(38 68% 44% / 0.35)", background: "white" }}
                >
                  <step.icon
                    className="transition-colors duration-300 group-hover:text-white"
                    style={{ width: "16px", height: "16px", color: "hsl(38 68% 44%)" }}
                  />
                </div>
                <h3 className="font-display text-[#1a0f05] mb-2.5 leading-snug" style={{ fontSize: "clamp(18px, 1.8vw, 22px)", fontWeight: 600 }}>
                  {step.title}
                </h3>
                <p className="font-condensed tracking-wide text-[#6b4f35]" style={{ fontSize: "13px", lineHeight: "1.8" }}>
                  {step.description}
                </p>
                {index < steps.length - 1 && (
                  <div className="absolute top-[6.5rem] right-0 translate-x-1/2 z-10">
                    <div style={{ width: "6px", height: "6px", background: "hsl(38 68% 44% / 0.4)", transform: "rotate(45deg)" }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
