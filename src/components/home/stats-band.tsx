import { Layers, Users } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

function fmt(n: number): string {
  if (n >= 100) return `${Math.floor(n / 100) * 100}+`
  if (n >= 10)  return `${Math.floor(n / 10) * 10}+`
  return `${n}`
}

async function getStats() {
  const supabase = await createClient()

  const [mestersRes, categoriesRes] = await Promise.all([
    supabase
      .from("mester_profiles")
      .select("*", { count: "exact", head: true })
      .eq("approval_status", "approved"),
    supabase
      .from("categories")
      .select("*", { count: "exact", head: true }),
  ])

  return {
    mesters:    mestersRes.count    ?? 0,
    categories: categoriesRes.count ?? 0,
  }
}

export async function StatsBand() {
  const { mesters, categories } = await getStats()

  const stats = [
    { value: fmt(mesters),    label: "Meșteri verificați",    icon: Users  },
    { value: `${categories}`, label: "Categorii de servicii", icon: Layers },
  ]

  return (
    <section className="bg-[#faf6ef] border-y border-[#584528]/14">
      <div className="container">
        <div className="grid grid-cols-2 divide-x divide-[#584528]/12">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col md:flex-row items-center md:items-start gap-3 px-6 py-10 md:py-12 text-center md:text-left"
            >
              <div className="w-10 h-10 border border-primary/30 flex items-center justify-center shrink-0">
                <stat.icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div
                  className="font-display text-primary leading-none"
                  style={{ fontSize: "clamp(34px, 4vw, 52px)", fontWeight: 600 }}
                >
                  {stat.value}
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
