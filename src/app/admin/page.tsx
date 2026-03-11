import Link from "next/link"
import { createAdminClient } from "@/lib/supabase/server"
import { Users, Image, Star, ArrowRight, Clock, CheckCircle } from "lucide-react"

async function getStats() {
  const supabase = await createAdminClient()

  const [
    { count: totalMesters },
    { count: pendingMesters },
    { count: pendingMesterPhotos },
    { count: pendingCererePhotos },
    { count: pendingProjectPhotos },
    { count: totalReviews },
  ] = await Promise.all([
    supabase.from("mester_profiles").select("*", { count: "exact", head: true }).eq("approval_status", "approved"),
    supabase.from("mester_profiles").select("*", { count: "exact", head: true }).eq("approval_status", "pending"),
    supabase.from("mester_photos").select("*", { count: "exact", head: true }).eq("approval_status", "pending"),
    supabase.from("cerere_photos").select("*", { count: "exact", head: true }).eq("approval_status", "pending"),
    supabase.from("project_photos").select("*", { count: "exact", head: true }).eq("approval_status", "pending"),
    supabase.from("reviews").select("*", { count: "exact", head: true }),
  ])

  return {
    totalMesters:  totalMesters  || 0,
    pendingMesters: pendingMesters || 0,
    pendingPhotos: (pendingMesterPhotos || 0) + (pendingCererePhotos || 0) + (pendingProjectPhotos || 0),
    totalReviews:  totalReviews  || 0,
  }
}

const panel = {
  background: "white",
  border: "1px solid #e0c99a",
  borderRadius: "6px",
} as const

export default async function AdminDashboardPage() {
  const stats = await getStats()

  const statCards = [
    { label: "Meșteri activi",        value: stats.totalMesters,   icon: CheckCircle, sub: "Aprobați" },
    { label: "Meșteri în așteptare",  value: stats.pendingMesters,  icon: Clock,       sub: "Necesită aprobare", alert: stats.pendingMesters > 0 },
    { label: "Fotografii în așteptare",value: stats.pendingPhotos,  icon: Image,       sub: "Necesită aprobare", alert: stats.pendingPhotos > 0 },
    { label: "Total recenzii",         value: stats.totalReviews,   icon: Star,        sub: "Lăsate de clienți" },
  ]

  const quickLinks = [
    {
      href:        "/admin/mesteri",
      icon:        Users,
      title:       "Gestionare meșteri",
      description: stats.pendingMesters > 0
        ? `${stats.pendingMesters} meșteri așteaptă aprobare`
        : "Aprobă sau respinge cereri de înregistrare",
      alert: stats.pendingMesters > 0,
    },
    {
      href:        "/admin/fotografii",
      icon:        Image,
      title:       "Aprobare fotografii",
      description: stats.pendingPhotos > 0
        ? `${stats.pendingPhotos} fotografii așteaptă aprobare`
        : "Moderează fotografiile încărcate",
      alert: stats.pendingPhotos > 0,
    },
  ]

  return (
    <div>
      {/* Page header */}
      <div
        className="px-6 pt-8 pb-8 md:px-10 md:pt-10"
        style={{ borderBottom: "1px solid #e0c99a" }}
      >
        <p className="font-condensed tracking-[0.26em] uppercase text-xs text-primary/70 mb-2">
          Panou de control
        </p>
        <h1
          className="font-condensed text-[#1a0f05] leading-[1.1]"
          style={{ fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 600 }}
        >
          Dashboard Admin
        </h1>
        <p className="text-sm text-[#8a6848] mt-2">
          Bun venit în panoul de administrare
        </p>
      </div>

      <div className="px-6 py-8 md:px-10 space-y-8">

        {/* Stats grid */}
        <div>
          <p className="font-condensed tracking-[0.24em] uppercase text-xs text-[#8a6848] mb-3">
            Statistici generale
          </p>
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-px"
            style={{ background: "#e0c99a", borderRadius: "6px", overflow: "hidden" }}
          >
            {statCards.map((card) => (
              <div
                key={card.label}
                className="px-5 py-5 md:py-6 flex flex-col"
                style={{ background: card.alert ? "hsl(38 68% 44% / 0.06)" : "#faf6ed" }}
              >
                <card.icon
                  className="h-4 w-4 mb-3 shrink-0"
                  style={{ color: card.alert ? "hsl(38 68% 44%)" : "hsl(38 68% 44% / 0.6)" }}
                />
                <div
                  className="font-display font-semibold mb-1"
                  style={{
                    fontSize: "clamp(26px, 3.5vw, 40px)",
                    lineHeight: 1,
                    color: card.alert ? "hsl(38 68% 44%)" : "#1a0f05",
                  }}
                >
                  {card.value}
                </div>
                <p className="font-condensed tracking-[0.12em] uppercase text-xs text-[#8a6848] mb-1">
                  {card.label}
                </p>
                <p className="text-xs text-[#b8956a] mt-auto">{card.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <p className="font-condensed tracking-[0.24em] uppercase text-xs text-[#8a6848] mb-3">
            Acțiuni rapide
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {quickLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex flex-col px-6 py-6 transition-all duration-200"
                style={{
                  background: "white",
                  border: item.alert ? "1px solid hsl(38 68% 44% / 0.45)" : "1px solid #e0c99a",
                  borderRadius: "6px",
                }}
              >
                <div
                  className="w-10 h-10 flex items-center justify-center mb-4 shrink-0"
                  style={{
                    border: item.alert ? "1px solid hsl(38 68% 44% / 0.4)" : "1px solid #e0c99a",
                    borderRadius: "6px",
                    background: item.alert ? "hsl(38 68% 44% / 0.08)" : "#faf6ed",
                  }}
                >
                  <item.icon
                    className="h-4 w-4"
                    style={{ color: item.alert ? "hsl(38 68% 44%)" : "hsl(38 68% 44% / 0.6)" }}
                  />
                </div>
                <p className="font-condensed tracking-[0.1em] uppercase text-sm font-semibold text-[#3d2810] group-hover:text-[#1a0f05] transition-colors mb-2">
                  {item.title}
                </p>
                <p
                  className="text-sm leading-relaxed flex-1"
                  style={{ color: item.alert ? "hsl(38 68% 44%)" : "#8a6848" }}
                >
                  {item.description}
                </p>
                <div className="mt-4 flex items-center gap-2 text-primary/60 group-hover:text-primary transition-colors">
                  <span className="font-condensed tracking-[0.16em] uppercase text-xs">Deschide</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Status overview */}
        {(stats.pendingMesters === 0 && stats.pendingPhotos === 0) && (
          <div
            className="px-6 py-5 flex items-center gap-3"
            style={panel}
          >
            <CheckCircle className="h-5 w-5 text-primary/60 shrink-0" />
            <p className="text-sm text-[#8a6848]">
              Nu există elemente care necesită atenție. Totul este în ordine.
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
