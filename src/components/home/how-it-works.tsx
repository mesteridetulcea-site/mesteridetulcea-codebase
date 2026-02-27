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
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Cum funcționează</h2>
          <p className="mt-2 text-muted-foreground">
            Găsești meșterul potrivit în 4 pași simpli
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative flex flex-col items-center text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground mb-4">
                <step.icon className="h-8 w-8" />
              </div>
              <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 bg-background text-primary font-bold text-lg">
                {index + 1}
              </span>
              <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[calc(50%+3rem)] w-[calc(100%-6rem)] h-[2px] bg-border" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
