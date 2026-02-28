import Link from "next/link"
import Image from "next/image"
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

/* Unsplash photos — free for commercial use under Unsplash License */
const categoryImages: Record<string, string> = {
  electrician:
    "https://images.unsplash.com/photo-1758101755915-462eddc23f57?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  instalator:
    "https://images.unsplash.com/photo-1620653713380-7a34b773fef8?q=80&w=945&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  zidar:
    "https://images.unsplash.com/photo-1701850009190-2859ba2aeea6?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  zugrav:
    "https://images.unsplash.com/photo-1652829069834-2c05031199c5?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  tamplar:
    "https://images.unsplash.com/photo-1626081063434-79a2169791b1?q=80&w=1476&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  transport:
    "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  mecanica:
    "https://images.unsplash.com/photo-1645445522156-9ac06bc7a767?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  constructii:
    "https://images.unsplash.com/photo-1755168648692-ef8937b7e63e?q=80&w=954&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
}

async function getCategories() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order")

  return data || []
}

export async function CategoriesGrid() {
  const categories = await getCategories()

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
    <section className="py-20 bg-white">
      <div className="container">
        {/* Section header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="font-condensed tracking-[0.28em] uppercase text-primary text-xs mb-2">
              Categorii
            </p>
            <h2
              className="font-display text-foreground"
              style={{ fontSize: "clamp(30px, 4vw, 48px)" }}
            >
              Servicii disponibile
            </h2>
          </div>
          <Link
            href="/mesteri"
            className="hidden md:inline-flex items-center gap-2 font-condensed tracking-[0.14em] uppercase text-xs text-primary/60 hover:text-primary transition-colors mb-2"
          >
            Explorează toți meșterii →
          </Link>
        </div>

        {/* Photo card grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {displayCategories.map((category) => {
            const Icon = iconMap[category.icon || category.slug] || Hammer
            const photoUrl =
              categoryImages[category.icon || category.slug] || categoryImages["constructii"]

            return (
              <Link
                key={category.id}
                href={`/mesteri?categorie=${category.slug}`}
                className="group"
              >
                {/* Photo card */}
                <div className="relative overflow-hidden aspect-[3/4] md:aspect-[3/4]">
                  {/* Background photo */}
                  <Image
                    src={photoUrl}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Default overlay — strong bottom gradient + slight overall tint */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0905]/88 via-[#0d0905]/30 to-transparent transition-all duration-400" />

                  {/* Hover overlay — gold tint from bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

                  {/* Content — centered at bottom */}
                  <div className="absolute inset-0 flex flex-col items-center justify-end pb-5 px-4 text-center">
                    {/* Icon square */}
                    <div className="w-11 h-11 border border-white/30 group-hover:border-white/70 bg-black/20 group-hover:bg-white/10 backdrop-blur-sm flex items-center justify-center mb-3 transition-all duration-300">
                      <Icon className="h-5 w-5 text-white/80 group-hover:text-white transition-colors duration-300" />
                    </div>

                    {/* Category name */}
                    <span className="font-condensed font-bold tracking-[0.18em] uppercase text-sm text-white/90 group-hover:text-white transition-colors duration-300">
                      {category.name}
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Mobile CTA */}
        <div className="mt-7 text-center md:hidden">
          <Link
            href="/mesteri"
            className="inline-flex items-center gap-2 font-condensed tracking-[0.14em] uppercase text-xs text-primary/60 hover:text-primary transition-colors"
          >
            Explorează toți meșterii →
          </Link>
        </div>
      </div>
    </section>
  )
}
