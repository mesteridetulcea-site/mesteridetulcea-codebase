import { Hammer, Layers, Users, Star } from "lucide-react"

const stats = [
  {
    value: "50+",
    label: "Meșteri verificați",
    icon: Users,
  },
  {
    value: "8",
    label: "Categorii de servicii",
    icon: Layers,
  },
  {
    value: "200+",
    label: "Clienți deserviți",
    icon: Hammer,
  },
  {
    value: "4.9",
    label: "Medie recenzii",
    icon: Star,
  },
]

export function StatsBand() {
  return (
    <section className="bg-[#faf6ef] border-y border-[#584528]/14">
      <div className="container">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-[#584528]/12">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="flex flex-col md:flex-row items-center md:items-start gap-3 px-6 py-10 md:py-12 text-center md:text-left"
            >
              {/* Icon */}
              <div className="w-10 h-10 border border-primary/30 flex items-center justify-center shrink-0">
                <stat.icon className="h-4 w-4 text-primary" />
              </div>

              {/* Text */}
              <div>
                <div
                  className="font-display text-primary leading-none"
                  style={{ fontSize: "clamp(34px, 4vw, 52px)", fontWeight: 600 }}
                >
                  {stat.value}
                  {i === 3 && (
                    <Star className="inline h-5 w-5 ml-1 fill-primary text-primary align-middle relative -top-1" />
                  )}
                </div>
                <div className="font-condensed tracking-[0.14em] uppercase text-xs text-foreground/45 mt-1">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
