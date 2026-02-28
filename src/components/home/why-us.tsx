import { ShieldCheck, MessageSquare, Star, MapPin } from "lucide-react"

const benefits = [
  {
    icon: ShieldCheck,
    title: "Meșteri verificați",
    description:
      "Fiecare meșter este evaluat și aprobat manual înainte de listare. Fără surprize neplăcute.",
    accent: "Verificare manuală",
  },
  {
    icon: MessageSquare,
    title: "Contact direct",
    description:
      "Vorbești direct cu meșterul pe WhatsApp. Fără intermediari, fără comisioane, fără birocrație.",
    accent: "WhatsApp direct",
  },
  {
    icon: Star,
    title: "Recenzii autentice",
    description:
      "Toate recenziile sunt lăsate de clienți reali, verificați. Transparență totală.",
    accent: "Clienți reali",
  },
  {
    icon: MapPin,
    title: "Meșteri locali",
    description:
      "Conectăm exclusiv meșteri din Tulcea și zona limitrofă. Răspuns rapid, prezență locală.",
    accent: "Tulcea & zonă",
  },
]

export function WhyUs() {
  return (
    <section className="py-20 bg-white">
      <div className="container">
        {/* Section header */}
        <div className="text-center mb-14">
          <p className="font-condensed tracking-[0.28em] uppercase text-primary text-xs mb-2">
            De ce noi
          </p>
          <h2
            className="font-display text-foreground"
            style={{ fontSize: "clamp(30px, 4vw, 48px)" }}
          >
            De ce Meșteri de Tulcea?
          </h2>
          <p className="mt-3 text-muted-foreground text-sm max-w-lg mx-auto leading-relaxed">
            Platforma care pune calitatea și încrederea pe primul loc, de fiecare dată.
          </p>
        </div>

        {/* Benefits grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, i) => (
            <div
              key={benefit.title}
              className="group relative bg-[#faf8f4] border border-[#584528]/10 hover:border-primary/30 hover:shadow-md transition-all duration-300 p-7"
            >
              {/* Number watermark */}
              <span
                aria-hidden="true"
                className="absolute top-4 right-5 font-display font-bold text-foreground/[0.04] select-none pointer-events-none text-6xl leading-none"
              >
                0{i + 1}
              </span>

              {/* Icon */}
              <div className="w-12 h-12 border border-primary/25 group-hover:bg-primary group-hover:border-primary flex items-center justify-center mb-5 transition-all duration-300">
                <benefit.icon className="h-5 w-5 text-primary group-hover:text-white transition-colors duration-300" />
              </div>

              {/* Accent label */}
              <p className="font-condensed tracking-[0.2em] uppercase text-xs text-primary mb-2">
                {benefit.accent}
              </p>

              {/* Title */}
              <h3 className="font-display text-xl font-medium text-foreground mb-2">
                {benefit.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
