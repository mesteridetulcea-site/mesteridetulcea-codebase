import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ArrowLeft, Phone, Tag, Clock } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { ro } from "date-fns/locale"

interface CererePhoto {
  id: string
  url: string
  approval_status: string
}

interface CerereDetail {
  id: string
  title: string | null
  original_message: string
  client_phone: string | null
  status: string | null
  created_at: string
  client_id: string | null
  category: { name: string } | null
  cerere_photos: CererePhoto[]
}

export default async function CerereDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: cerere } = await supabase
    .from("service_requests")
    .select(
      "id, title, original_message, client_phone, status, created_at, client_id, category:categories(name), cerere_photos(id, url, approval_status)"
    )
    .eq("id", id)
    .single()

  if (!cerere) notFound()

  const isOwner = user?.id === (cerere as CerereDetail).client_id

  // Only show approved photos to non-owners; owners see all their photos
  const photos = ((cerere as CerereDetail).cerere_photos ?? []).filter(
    (p) => isOwner || p.approval_status === "approved"
  )

  const c = cerere as CerereDetail

  return (
    <div className="flex min-h-screen flex-col bg-[#0f0b04]">
      <Header />

      {/* Dark header band */}
      <div className="bg-[#0f0b04] border-b border-[#584528]/40 py-10">
        <div className="container max-w-4xl">
          <Link
            href={isOwner ? "/cont/cereri" : "/cereri"}
            className="inline-flex items-center gap-2 font-condensed tracking-[0.16em] uppercase text-xs text-white/35 hover:text-white/60 transition-colors mb-6"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Înapoi
          </Link>

          {c.category && (
            <div className="flex items-center gap-1.5 mb-3">
              <Tag className="h-3 w-3 text-primary/60" />
              <span className="font-condensed tracking-[0.18em] uppercase text-[11px] text-primary/70">
                {c.category.name}
              </span>
            </div>
          )}

          <h1
            className="font-condensed font-bold text-white/90 leading-tight mb-3"
            style={{ fontSize: "clamp(22px, 4vw, 36px)" }}
          >
            {c.title || "Cerere"}
          </h1>

          <div className="flex items-center gap-1.5 text-white/30 font-condensed tracking-wider text-xs">
            <Clock className="h-3 w-3" />
            {formatDistanceToNow(new Date(c.created_at), {
              addSuffix: true,
              locale: ro,
            })}
            {c.status === "closed" && (
              <span className="ml-3 px-2 py-0.5 border border-white/10 text-white/30 text-[10px] tracking-[0.14em] uppercase">
                Încheiată
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 bg-[#faf7f2] py-10">
        <div className="container max-w-4xl space-y-8">

          {/* Description */}
          <section className="bg-white border border-[#e8dcc8] p-8">
            <h2 className="font-condensed tracking-[0.16em] uppercase text-xs text-[#3d2e1a]/40 mb-4">
              Descriere
            </h2>
            <p className="text-[#3d2e1a]/75 leading-relaxed whitespace-pre-line text-[15px]">
              {c.original_message}
            </p>
          </section>

          {/* Photos */}
          {photos.length > 0 && (
            <section>
              <h2 className="font-condensed tracking-[0.16em] uppercase text-xs text-[#3d2e1a]/40 mb-4">
                Fotografii{" "}
                {isOwner && (
                  <span className="text-[#c4921e]/60 ml-1">
                    (
                    {photos.filter((p) => p.approval_status === "pending").length > 0
                      ? `${photos.filter((p) => p.approval_status === "pending").length} în așteptare aprobare`
                      : "toate aprobate"}
                    )
                  </span>
                )}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {photos.map((photo) => (
                  <div key={photo.id} className="relative group">
                    <a
                      href={photo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block aspect-[4/3] overflow-hidden border border-[#e8dcc8] hover:border-primary/40 transition-colors"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo.url}
                        alt="Fotografie cerere"
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      />
                    </a>
                    {isOwner && photo.approval_status === "pending" && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center pointer-events-none">
                        <span className="font-condensed tracking-[0.14em] uppercase text-[10px] text-white/80 bg-black/50 px-3 py-1">
                          În așteptare
                        </span>
                      </div>
                    )}
                    {isOwner && photo.approval_status === "rejected" && (
                      <div className="absolute inset-0 bg-red-900/40 flex items-center justify-center pointer-events-none">
                        <span className="font-condensed tracking-[0.14em] uppercase text-[10px] text-white/80 bg-red-900/60 px-3 py-1">
                          Respinsă
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Contact — shown only to non-owners (mesters) */}
          {!isOwner && c.client_phone && (
            <section className="bg-white border border-[#e8dcc8] p-8 flex items-center justify-between">
              <div>
                <h2 className="font-condensed tracking-[0.16em] uppercase text-xs text-[#3d2e1a]/40 mb-1">
                  Contact client
                </h2>
                <p className="text-[#3d2e1a]/50 text-sm font-condensed">
                  Sună pentru a discuta detaliile
                </p>
              </div>
              <a
                href={`tel:${c.client_phone}`}
                className="inline-flex items-center gap-2 font-condensed tracking-[0.18em] uppercase text-sm font-semibold text-white bg-primary hover:bg-primary/88 transition-colors duration-200 px-6 py-3"
              >
                <Phone className="h-4 w-4" />
                {c.client_phone}
              </a>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
