import { Search, UserCheck, MessageSquare, Star } from "lucide-react"

const steps = [
  {
    icon: Search,
    title: "Caută",
    description: "Spune-ne ce lucrare ai de făcut sau alege o categorie",
  },
  {
    icon: UserCheck,
    title: "Alege",
    description: "Compară meșterii după recenzii, experiență și preț",
  },
  {
    icon: MessageSquare,
    title: "Contactează",
    description: "Trimite mesaj direct pe WhatsApp meșterului ales",
  },
  {
    icon: Star,
    title: "Evaluează",
    description: "După finalizarea lucrării, lasă o recenzie sinceră",
  },
]

export function HowItWorks() {
  return (
    <section className="py-16 bg-[#0f0b04]">
      <div className="container">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="h-px w-16 bg-primary/35" />
            <span className="text-primary text-2xl">★</span>
            <div className="h-px w-16 bg-primary/35" />
          </div>
          <h2 className="text-3xl font-bold text-white tracking-wide">Cum funcționează</h2>
          <p className="mt-2 text-white/45 italic">
            Găsești meșterul potrivit în 4 pași simpli
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative flex flex-col items-center text-center"
            >
              <div className="relative flex h-16 w-16 items-center justify-center bg-primary/15 border border-primary/35 mb-4">
                <step.icon className="h-7 w-7 text-primary" />
                <span className="absolute -top-3 -right-3 flex h-6 w-6 items-center justify-center bg-primary text-white text-xs font-bold">
                  {index + 1}
                </span>
              </div>
              <h3 className="font-semibold text-lg mb-2 text-white tracking-wide">{step.title}</h3>
              <p className="text-sm text-white/45 italic leading-relaxed">{step.description}</p>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[calc(50%+3rem)] w-[calc(100%-6rem)] h-px bg-primary/20" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
