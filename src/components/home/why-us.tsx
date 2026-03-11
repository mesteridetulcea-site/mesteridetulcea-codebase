import { ShieldCheck, MessageSquare, Star, MapPin } from "lucide-react"

const benefits = [
  {
    icon: ShieldCheck,
    title: "Meșteri verificați",
    description: "Fiecare meșter este evaluat și aprobat manual înainte de listare. Fără surprize neplăcute.",
    accent: "Verificare manuală",
  },
  {
    icon: MessageSquare,
    title: "Contact direct",
    description: "Vorbești direct cu meșterul pe WhatsApp. Fără intermediari, fără comisioane, fără birocrație.",
    accent: "WhatsApp direct",
  },
  {
    icon: Star,
    title: "Recenzii autentice",
    description: "Toate recenziile sunt lăsate de clienți reali, verificați. Transparență totală.",
    accent: "Clienți reali",
  },
  {
    icon: MapPin,
    title: "Meșteri locali",
    description: "Conectăm exclusiv meșteri din Tulcea și zona limitrofă. Răspuns rapid, prezență locală.",
    accent: "Tulcea & zonă",
  },
]

export function WhyUs() {
  return (
    <section className="relative overflow-hidden py-16 md:py-28" style={{ background: "#0d0905" }}>

      {/* Gold grid */}
      <div
        className="absolute inset-0 opacity-[0.032]"
        style={{
          backgroundImage: "linear-gradient(rgba(196,146,30,1) 1px, transparent 1px), linear-gradient(90deg, rgba(196,146,30,1) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
          maskImage: "radial-gradient(ellipse 90% 90% at 50% 50%, black 20%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 90% 90% at 50% 50%, black 20%, transparent 100%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 65% at 50% 50%, rgba(196,146,30,0.055) 0%, transparent 70%)" }}
      />

      <div className="relative z-10">

        {/* ── Header ── */}
        <div className="container px-4 md:px-8">
          <div className="flex flex-col items-center text-center mb-10 md:mb-16">
            <div className="flex items-center gap-5 mb-6">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/38" />
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-primary/58 rotate-45" />
                <div className="w-1 h-1 bg-primary/28 rotate-45" />
                <div className="w-1.5 h-1.5 bg-primary/58 rotate-45" />
              </div>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/38" />
            </div>
            <p className="font-condensed text-primary text-[10px] tracking-[0.32em] uppercase mb-3">De ce noi</p>
            <h2
              className="font-display text-white/90 leading-[1.06] tracking-tight"
              style={{ fontSize: "clamp(1.75rem, 5vw, 3.5rem)", fontWeight: 600 }}
            >
              De ce <em className="text-primary italic">Meșteri de Tulcea</em>?
            </h2>
            <p className="mt-3 font-condensed tracking-wide text-white/32 max-w-sm" style={{ fontSize: "13px", lineHeight: "1.8" }}>
              Platforma care pune calitatea și încrederea pe primul loc, de fiecare dată.
            </p>
          </div>
        </div>

        {/* ── Mobile: swipeable cards ── */}
        <div
          className="sm:hidden flex gap-3 overflow-x-auto pb-5"
          style={{
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            paddingLeft: "16px",
            paddingRight: "16px",
          }}
        >
          {benefits.map((b, i) => (
            <div
              key={b.title}
              className="relative shrink-0 flex flex-col p-6"
              style={{
                width: "72vw",
                maxWidth: "280px",
                scrollSnapAlign: "start",
                background: "#110c06",
                border: "1px solid rgba(196,146,30,0.14)",
              }}
            >
              {/* Ghost numeral */}
              <span
                aria-hidden="true"
                className="absolute top-4 right-4 font-display font-bold leading-none select-none pointer-events-none"
                style={{ fontSize: "52px", color: "rgba(196,146,30,0.07)" }}
              >
                0{i + 1}
              </span>

              {/* Icon */}
              <div
                className="flex items-center justify-center mb-5"
                style={{ width: "40px", height: "40px", border: "1px solid hsl(38 68% 44% / 0.32)" }}
              >
                <b.icon style={{ width: "16px", height: "16px", color: "hsl(38 68% 44%)" }} />
              </div>

              <p className="font-condensed tracking-[0.2em] uppercase text-primary mb-2" style={{ fontSize: "9px" }}>
                {b.accent}
              </p>
              <h3 className="font-display text-white/88 mb-3 leading-snug" style={{ fontSize: "19px", fontWeight: 600 }}>
                {b.title}
              </h3>
              <p className="font-condensed tracking-wide text-white/38" style={{ fontSize: "12px", lineHeight: "1.75" }}>
                {b.description}
              </p>

              {/* Bottom gold accent */}
              <div className="mt-auto pt-5">
                <div style={{ width: "24px", height: "1px", background: "hsl(38 68% 44% / 0.35)" }} />
              </div>
            </div>
          ))}
          {/* Trailing spacer so last card doesn't sit flush against edge */}
          <div className="shrink-0 w-1" aria-hidden="true" />
        </div>
        <p className="sm:hidden text-center font-condensed tracking-[0.18em] uppercase text-white/20 pb-2" style={{ fontSize: "9px" }}>
          ← →
        </p>


        {/* ── Desktop: 2×2 gap-grid ── */}
        <div className="container px-4 md:px-8">
          <div className="hidden sm:grid sm:grid-cols-2 gap-px" style={{ background: "rgba(196,146,30,0.14)" }}>
            {benefits.map((b, i) => (
              <div key={b.title} className="relative p-8 md:p-10 group" style={{ background: "#110c06" }}>
                <span
                  aria-hidden="true"
                  className="absolute top-5 right-6 font-display font-bold leading-none select-none pointer-events-none"
                  style={{ fontSize: "clamp(64px, 7vw, 96px)", color: "rgba(196,146,30,0.055)" }}
                >
                  0{i + 1}
                </span>
                <div
                  className="flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-primary"
                  style={{ width: "44px", height: "44px", border: "1px solid hsl(38 68% 44% / 0.32)" }}
                >
                  <b.icon
                    className="transition-colors duration-300 group-hover:text-white"
                    style={{ width: "18px", height: "18px", color: "hsl(38 68% 44%)" }}
                  />
                </div>
                <p className="font-condensed tracking-[0.22em] uppercase text-primary mb-2" style={{ fontSize: "10px" }}>
                  {b.accent}
                </p>
                <h3 className="font-display text-white/88 mb-3 leading-snug" style={{ fontSize: "clamp(18px, 2vw, 23px)", fontWeight: 600 }}>
                  {b.title}
                </h3>
                <p className="font-condensed tracking-wide text-white/38" style={{ fontSize: "13px", lineHeight: "1.8" }}>
                  {b.description}
                </p>
                <div
                  className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: "linear-gradient(90deg, transparent, hsl(38 68% 44% / 0.5), transparent)" }}
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
