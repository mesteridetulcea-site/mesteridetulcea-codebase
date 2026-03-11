import Link from "next/link"
import Image from "next/image"
import { Heart, Users, ArrowLeft } from "lucide-react"
import { getFavorites } from "@/actions/favorites"
import { MesterCard } from "@/components/mester/mester-card"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav"
import { createClient } from "@/lib/supabase/server"
import type { MesterWithCategory } from "@/types/database"

async function getFavoritesWithPhotos() {
  const favorites = await getFavorites()
  if (favorites.length === 0) return { favorites: [], photoMap: new Map() }

  const supabase = await createClient()
  const mesterIds = favorites.map((f) => f.mester?.id).filter(Boolean)

  const { data: photos } = (await supabase
    .from("mester_photos")
    .select("mester_id, public_url")
    .in("mester_id", mesterIds)
    .eq("photo_type", "profile")
    .eq("approval_status", "approved")) as { data: { mester_id: string; public_url: string }[] | null }

  const photoMap = new Map(photos?.map((p) => [p.mester_id, p.public_url]))
  return { favorites, photoMap }
}

export default async function FavoritesPage() {
  const { favorites, photoMap } = await getFavoritesWithPhotos()
  const validFavorites = favorites.filter((f) => f.mester)

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1 pb-24 md:pb-0">

        {/* ── Hero — identic cu /mesteri ── */}
        <section className="relative bg-[#0d0905] overflow-hidden -mt-[62px]" style={{ minHeight: 340 }}>

          {/* Background photo */}
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=1470&auto=format&fit=crop"
              alt=""
              fill
              priority
              className="object-cover object-center opacity-[0.14]"
            />
          </div>

          {/* Dark gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d0905]/85 via-[#0d0905]/50 to-[#0d0905]/92" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d0905]/75 via-transparent to-[#0d0905]/75" />

          {/* Corner vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 30%, rgba(13,9,5,0.78) 100%)" }}
          />

          {/* Gold grid lines */}
          <div
            className="absolute inset-0 opacity-[0.042]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(196,146,30,1) 1px, transparent 1px), linear-gradient(90deg, rgba(196,146,30,1) 1px, transparent 1px)",
              backgroundSize: "52px 52px",
              maskImage: "radial-gradient(ellipse 78% 80% at 50% 50%, black 20%, transparent 100%)",
              WebkitMaskImage: "radial-gradient(ellipse 78% 80% at 50% 50%, black 20%, transparent 100%)",
            }}
          />

          {/* Center gold glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 70% 60% at 50% 60%, rgba(196,146,30,0.07) 0%, transparent 70%)" }}
          />

          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

          {/* Content */}
          <div className="container relative z-10 flex flex-col items-center text-center pt-[96px] pb-14">

            {/* Ornament — identic cu /mesteri */}
            <div className="flex items-center gap-5 mb-8">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/40" />
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-primary/60 rotate-45" />
                <div className="w-1 h-1 bg-primary/30 rotate-45" />
                <div className="w-1.5 h-1.5 bg-primary/60 rotate-45" />
              </div>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/40" />
            </div>

            {/* Overline */}
            <p className="font-condensed text-primary text-[10px] tracking-[0.32em] uppercase mb-4">
              Colecția mea
            </p>

            {/* Heading */}
            <h1
              className="font-display text-white/92 leading-[1.06] tracking-tight"
              style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.2rem)", fontWeight: 600 }}
            >
              Meșterii mei{" "}
              <em className="text-primary" style={{ fontStyle: "italic" }}>
                favoriți
              </em>
            </h1>

            {/* Count */}
            {validFavorites.length > 0 && (
              <p className="mt-5 text-white/35 font-condensed tracking-[0.22em] text-xs uppercase">
                {validFavorites.length} {validFavorites.length === 1 ? "meșter salvat" : "meșteri salvați"}
              </p>
            )}
          </div>
        </section>

        {/* ── Back link ── */}
        <div className="container px-6 md:px-16 lg:px-20 pt-6">
          <Link
            href="/mesteri"
            className="inline-flex items-center gap-1.5 text-[#8a6848] hover:text-primary transition-colors duration-200"
          >
            <ArrowLeft style={{ width: "12px", height: "12px" }} />
            <span className="font-condensed tracking-[0.2em] uppercase" style={{ fontSize: "10px" }}>
              Înapoi la meșteri
            </span>
          </Link>
        </div>

        {/* ── Content ── */}
        {validFavorites.length === 0 ? (

          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 text-center px-6">
            <div className="flex items-center gap-5 mb-8">
              <div className="h-px w-12 bg-[#584528]/20" />
              <Heart style={{ width: "18px", height: "18px", color: "hsl(38 68% 44% / 0.4)" }} />
              <div className="h-px w-12 bg-[#584528]/20" />
            </div>

            <p className="font-condensed tracking-[0.28em] uppercase mb-3" style={{ fontSize: "9px", color: "hsl(38 68% 44% / 0.6)" }}>
              Colecție goală
            </p>

            <h2
              className="font-display leading-[1.1] tracking-tight mb-3"
              style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 600, color: "#1a0f05" }}
            >
              Niciun meșter{" "}
              <em className="text-primary" style={{ fontStyle: "italic" }}>
                salvat
              </em>
            </h2>

            <p className="font-condensed tracking-wide mb-10" style={{ fontSize: "12px", color: "#8a6848", maxWidth: "280px", lineHeight: 1.8 }}>
              Apasă iconița ♡ pe cardul oricărui meșter pentru a-l adăuga în colecția ta
            </p>

            <div className="flex items-center gap-4 mb-10" style={{ width: "160px", opacity: 0.35 }}>
              <div style={{ flex: 1, height: "1px", background: "#c4921e" }} />
              <div className="w-1.5 h-1.5 bg-primary/60 rotate-45" />
              <div style={{ flex: 1, height: "1px", background: "#c4921e" }} />
            </div>

            <Link
              href="/mesteri"
              className="inline-flex items-center gap-2.5 font-condensed tracking-[0.2em] uppercase font-semibold transition-all duration-200"
              style={{
                fontSize: "11px",
                color: "white",
                background: "hsl(38 68% 44%)",
                padding: "11px 24px",
                textDecoration: "none",
              }}
            >
              <Users style={{ width: "13px", height: "13px" }} />
              Explorează meșteri
            </Link>
          </div>

        ) : (

          <div className="bg-white">
            <div className="container px-6 md:px-16 lg:px-20 py-10">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-[#584528]/12">
                {validFavorites.map((favorite, i) => (
                  <div
                    key={favorite.mester_id}
                    className="bg-white animate-fade-in-up"
                    style={{ animationDelay: `${i * 60}ms`, animationFillMode: "both" }}
                  >
                    <MesterCard
                      mester={favorite.mester as MesterWithCategory}
                      coverPhoto={photoMap.get(favorite.mester!.id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

        )}
      </main>

      <div className="hidden md:block">
        <Footer />
      </div>
      <MobileBottomNav />
    </div>
  )
}
