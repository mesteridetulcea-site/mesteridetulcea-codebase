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
    description: "Trimite mesaj direct pe WhatsApp meșterului ales. Fără intermediari.",
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

        {/* ── Header ── */}
        <div className="container px-4 md:px-8">
          <div className="flex flex-col items-center text-center mb-10 md:mb-16">
            <div className="flex items-center gap-5 mb-6">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/38" />
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-primary/55 rotate-45" />
                <div className="w-1 h-1 bg-primary/25 rotate-45" />
                <div className="w-1.5 h-1.5 bg-primary/55 rotate-45" />
              </div>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/38" />
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

        {/* ── Mobile: swipeable cards ── */}
        <div
          className="lg:hidden flex gap-3 overflow-x-auto pb-5"
          style={{
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            paddingLeft: "16px",
            paddingRight: "16px",
          }}
        >
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="relative shrink-0 flex flex-col p-6"
              style={{
                width: "72vw",
                maxWidth: "280px",
                scrollSnapAlign: "start",
                background: "white",
                border: "1px solid rgba(88,69,40,0.14)",
              }}
            >
              {/* Giant ghost numeral */}
              <div
                aria-hidden="true"
                className="font-display font-bold leading-none select-none pointer-events-none mb-1"
                style={{ fontSize: "56px", color: "rgba(196,146,30,0.18)", lineHeight: 1 }}
              >
                {step.num}
              </div>

              {/* Top accent */}
              <div style={{ width: "28px", height: "2px", background: "hsl(38 68% 44% / 0.5)", marginBottom: "16px", marginTop: "4px" }} />

              {/* Icon */}
              <div
                className="flex items-center justify-center mb-4"
                style={{ width: "38px", height: "38px", border: "1px solid hsl(38 68% 44% / 0.35)", background: "white" }}
              >
                <step.icon style={{ width: "15px", height: "15px", color: "hsl(38 68% 44%)" }} />
              </div>

              <h3 className="font-display text-[#1a0f05] mb-2 leading-snug" style={{ fontSize: "19px", fontWeight: 600 }}>
                {step.title}
              </h3>
              <p className="font-condensed tracking-wide text-[#6b4f35]" style={{ fontSize: "12px", lineHeight: "1.75" }}>
                {step.description}
              </p>

              {/* Step badge bottom */}
              <div className="mt-auto pt-5 flex items-center gap-2">
                <div style={{ width: "16px", height: "1px", background: "hsl(38 68% 44% / 0.3)" }} />
                <span className="font-condensed tracking-[0.18em] uppercase text-primary" style={{ fontSize: "9px" }}>
                  Pas {i + 1}
                </span>
              </div>
            </div>
          ))}
          <div className="shrink-0 w-1" aria-hidden="true" />
        </div>
        <p className="lg:hidden text-center font-condensed tracking-[0.18em] uppercase text-[#8a6848]/40 pb-2" style={{ fontSize: "9px" }}>
          ← →
        </p>


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
