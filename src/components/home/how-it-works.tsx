import { Search, UserCheck, MessageSquare, Star, ArrowRight } from "lucide-react"

const steps = [
  {
    icon: Search,
    title: "Caută",
    description:
      "Spune-ne ce lucrare ai de făcut sau alege direct o categorie din cele disponibile.",
    badge: "Pas 1",
  },
  {
    icon: UserCheck,
    title: "Alege",
    description:
      "Compară meșterii după recenzii, fotografii ale lucrărilor și experiență.",
    badge: "Pas 2",
  },
  {
    icon: MessageSquare,
    title: "Contactează",
    description:
      "Trimite mesaj direct pe WhatsApp meșterului ales. Fără intermediari.",
    badge: "Pas 3",
  },
  {
    icon: Star,
    title: "Evaluează",
    description:
      "După finalizarea lucrării, lasă o recenzie sinceră pentru comunitate.",
    badge: "Pas 4",
  },
]

export function HowItWorks() {
  return (
    <section className="py-20 bg-[#f5ede0]">
      <div className="container">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="font-condensed tracking-[0.28em] uppercase text-primary text-xs mb-3">
            Simplu și rapid
          </p>
          <h2
            className="font-display text-foreground"
            style={{ fontSize: "clamp(30px, 4vw, 48px)" }}
          >
            Cum funcționează
          </h2>
        </div>

        {/* Steps */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">
          {steps.map((step, index) => (
            <div key={step.title} className="relative group">
              {/* Decorative giant numeral */}
              <div
                aria-hidden="true"
                className="font-display font-bold text-foreground/[0.055] select-none absolute -top-3 -left-1 leading-none pointer-events-none group-hover:text-primary/[0.12] transition-colors duration-300"
                style={{ fontSize: "clamp(80px, 11vw, 130px)" }}
              >
                0{index + 1}
              </div>

              {/* Content */}
              <div className="relative pt-10">
                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 mb-4">
                  <span className="font-condensed tracking-[0.2em] uppercase text-xs text-primary/65">
                    {step.badge}
                  </span>
                </div>

                {/* Icon square */}
                <div className="w-11 h-11 border border-primary/35 group-hover:bg-primary group-hover:border-primary flex items-center justify-center mb-5 transition-all duration-300 bg-white">
                  <step.icon className="h-5 w-5 text-primary group-hover:text-white transition-colors duration-300" />
                </div>

                {/* Title */}
                <h3 className="font-display text-xl font-medium text-foreground mb-2.5">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-foreground/55 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Connector arrow (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:flex items-center absolute top-[5.75rem] left-[calc(50%+3.5rem)] w-[calc(100%-7rem)]">
                  <div className="flex-1 h-px bg-primary/20" />
                  <ArrowRight className="h-3 w-3 text-primary/35 -ml-1 shrink-0" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
