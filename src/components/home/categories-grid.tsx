import Link from "next/link"
import {
  Zap,
  Droplets,
  Hammer,
  PaintBucket,
  Wrench,
  Truck,
  Cog,
  Home,
} from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  electrician: Zap,
  instalator: Droplets,
  zidar: Hammer,
  zugrav: PaintBucket,
  tamplar: Wrench,
  transport: Truck,
  mecanica: Cog,
  constructii: Home,
}

async function getCategories() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("order_index")

  return data || []
}

export async function CategoriesGrid() {
  const categories = await getCategories()

  // Default categories if none exist in database
  const defaultCategories = [
    { id: "1", name: "Electricieni", slug: "electrician", icon: "electrician" },
    { id: "2", name: "Instalatori", slug: "instalator", icon: "instalator" },
    { id: "3", name: "Zidari", slug: "zidar", icon: "zidar" },
    { id: "4", name: "Zugravii", slug: "zugrav", icon: "zugrav" },
    { id: "5", name: "Tâmplari", slug: "tamplar", icon: "tamplar" },
    { id: "6", name: "Transport", slug: "transport", icon: "transport" },
    { id: "7", name: "Mecanică auto", slug: "mecanica", icon: "mecanica" },
    { id: "8", name: "Construcții", slug: "constructii", icon: "constructii" },
  ]

  const displayCategories = categories.length > 0 ? categories : defaultCategories

  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">Categorii de servicii</h2>
          <p className="mt-2 text-muted-foreground">
            Alege categoria de care ai nevoie
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayCategories.map((category) => {
            const Icon = iconMap[category.icon || category.slug] || Hammer
            return (
              <Link
                key={category.id}
                href={`/mesteri?categorie=${category.slug}`}
              >
                <Card className="group cursor-pointer transition-all hover:shadow-md hover:border-primary/50">
                  <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                    <div className="mb-3 rounded-full bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <span className="font-medium">{category.name}</span>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
