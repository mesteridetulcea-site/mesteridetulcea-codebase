import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, MapPin, Star, Camera, ArrowUpRight } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { WhatsAppButton } from "@/components/mester/whatsapp-button"
import { ProjectsGrid } from "@/components/mester/projects-grid"
import { ProjectPhotoCarousel } from "@/components/mester/project-photo-carousel"
import { ProjectEditDialog } from "@/components/mester/project-edit-dialog"
import type { ProjectWithPhotos } from "@/types/database"

interface PageProps {
  params: Promise<{ slug: string; projectId: string }>
}

async function getProjectData(mesterId: string, projectId: string) {
  const supabase = await createClient()

  const [{ data: rawProject }, { data: mester }, { data: rawOtherProjects }, { data: profilePhotos }] = await Promise.all([
    supabase
      .from("mester_projects")
      .select(`*, project_photos(id, url, storage_path, sort_order, created_at, approval_status)`)
      .eq("id", projectId)
      .eq("mester_id", mesterId)
      .single(),
    supabase
      .from("mester_profiles")
      .select(`
        id, display_name, avg_rating, reviews_count, city, whatsapp_number,
        mester_categories(category_id, category:categories(name))
      `)
      .eq("id", mesterId)
      .eq("approval_status", "approved")
      .single(),
    supabase
      .from("mester_projects")
      .select(`*, project_photos(id, url, storage_path, sort_order, created_at, approval_status)`)
      .eq("mester_id", mesterId)
      .neq("id", projectId)
      .order("sort_order")
      .limit(3),
    supabase
      .from("mester_photos")
      .select("public_url")
      .eq("mester_id", mesterId)
      .eq("photo_type", "profile")
      .eq("approval_status", "approved")
      .limit(1) as unknown as Promise<{ data: { public_url: string }[] | null }>,
  ])

  if (!rawProject || !mester) return null

  const filterApproved = (p: ProjectWithPhotos) => ({
    ...p,
    project_photos: p.project_photos.filter((ph) => ph.approval_status === "approved"),
  })

  return {
    project: filterApproved(rawProject as ProjectWithPhotos),
    allProjectPhotos: (rawProject as ProjectWithPhotos).project_photos ?? [],
    mester: mester as {
      id: string
      display_name: string
      avg_rating: number
      reviews_count: number
      city: string
      whatsapp_number: string | null
      mester_categories: { category_id: string; category: { name: string } | null }[]
    },
    otherProjects: ((rawOtherProjects as ProjectWithPhotos[]) || []).map(filterApproved),
    mesterProfilePhoto: profilePhotos?.[0]?.public_url ?? null,
  }
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug: mesterId, projectId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const data = await getProjectData(mesterId, projectId)
  if (!data) notFound()

  const { project, mester, otherProjects, allProjectPhotos, mesterProfilePhoto } = data
  const photos = project.project_photos ?? []
  const primaryCategory = mester.mester_categories?.[0]?.category

  let isOwner = false
  if (user) {
    const { data: mesterProfile } = await supabase
      .from("mester_profiles")
      .select("id")
      .eq("user_id", user.id)
      .eq("id", mesterId)
      .single()
    isOwner = !!mesterProfile
  }

  // Use first project photo as hero bg if available
  const heroBgUrl = photos[0]?.url ?? null

  const nameParts = mester.display_name.trim().split(/\s+/)
  const firstName = nameParts[0]
  const restName = nameParts.slice(1).join(" ")

  return (
    <>
      {/* ═══════════════════════════════════════════════
          HERO — dark, behind navbar
          Shows: breadcrumb, mester overline, project title
      ═══════════════════════════════════════════════ */}
      <section className="relative bg-[#0d0905] -mt-[62px] overflow-hidden">

        {/* Background: first project photo, very low opacity */}
        {heroBgUrl && (
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroBgUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-[0.12]"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0905]/95 via-[#0d0905]/75 to-[#0d0905]" />

        {/* Gold grid */}
        <div
          className="absolute inset-0 opacity-[0.032]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(196,146,30,1) 1px, transparent 1px), linear-gradient(90deg, rgba(196,146,30,1) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Bottom accent */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />

        <div className="container relative z-10 pt-[82px] pb-10">

          {/* Breadcrumb nav */}
          <div className="flex items-center gap-2 mb-8">
            <Link
              href="/mesteri"
              className="font-condensed text-[10px] tracking-[0.2em] uppercase text-white/22 hover:text-primary transition-colors duration-200"
            >
              Meșteri
            </Link>
            <span className="text-white/15 text-xs">/</span>
            <Link
              href={`/mester/${mesterId}`}
              className="font-condensed text-[10px] tracking-[0.2em] uppercase text-white/22 hover:text-primary transition-colors duration-200"
            >
              {mester.display_name}
            </Link>
            <span className="text-white/15 text-xs">/</span>
            <span className="font-condensed text-[10px] tracking-[0.2em] uppercase text-primary/60">
              Proiect
            </span>
          </div>

          {/* Mester overline */}
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8 bg-primary/30" />
            <Link
              href={`/mester/${mesterId}`}
              className="font-condensed text-[10px] tracking-[0.28em] uppercase text-primary hover:text-primary/70 transition-colors duration-200"
            >
              {primaryCategory?.name || "Meșter"} &nbsp;·&nbsp; {mester.display_name}
            </Link>
          </div>

          {/* Project title */}
          <div className="flex items-start justify-between gap-4">
            <h1
              className="font-display text-white leading-[1.06] tracking-tight"
              style={{ fontSize: "clamp(1.9rem, 4.5vw, 3.6rem)", fontWeight: 600 }}
            >
              {project.title}
            </h1>
            {isOwner && (
              <div className="mt-1 shrink-0">
                <ProjectEditDialog
                  projectId={project.id}
                  initialTitle={project.title}
                  initialDescription={project.description}
                  initialPhotos={allProjectPhotos}
                />
              </div>
            )}
          </div>

          {/* Photo count badge */}
          {photos.length > 0 && (
            <div className="flex items-center gap-1.5 mt-4">
              <Camera className="h-3 w-3 text-primary/40" />
              <span className="font-condensed text-[10px] tracking-[0.22em] uppercase text-white/30">
                {photos.length} {photos.length === 1 ? "fotografie" : "fotografii"}
              </span>
            </div>
          )}

        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          MAIN CONTENT — white bg
      ═══════════════════════════════════════════════ */}
      <div className="bg-white">
        <div className="container py-10">
          <div className="grid lg:grid-cols-3 gap-10">

            {/* ── Left: Carousel + description + other projects ── */}
            <div className="lg:col-span-2 space-y-10">

              {/* Photo carousel or empty state */}
              {photos.length > 0 ? (
                <ProjectPhotoCarousel photos={photos} title={project.title} />
              ) : (
                <div className="relative aspect-[4/3] bg-[#f5eed8] flex flex-col items-center justify-center gap-3 border border-[#584528]/12">
                  <Camera className="h-12 w-12 text-primary/18" />
                  <span className="font-condensed text-[10px] tracking-[0.22em] uppercase text-[#584528]/30">
                    Fără fotografii
                  </span>
                </div>
              )}

              {/* Project description */}
              {project.description && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-px w-6 bg-primary/30" />
                    <p className="font-condensed text-[10px] tracking-[0.28em] uppercase text-primary">
                      Despre proiect
                    </p>
                  </div>
                  <p className="text-[#3d2e14]/70 leading-relaxed text-base whitespace-pre-line">
                    {project.description}
                  </p>
                </div>
              )}

              {/* Divider before other projects */}
              {otherProjects.length > 0 && (
                <div className="w-full h-px bg-[#584528]/12" />
              )}

              {/* Other projects by same mester */}
              {otherProjects.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="font-condensed text-[10px] tracking-[0.28em] uppercase text-primary mb-1">
                        Același meșter
                      </p>
                      <h2
                        className="font-display text-[#3d2e14] leading-tight"
                        style={{ fontSize: "clamp(1.1rem, 2vw, 1.5rem)", fontWeight: 500 }}
                      >
                        Alte proiecte realizate
                      </h2>
                    </div>
                    <Link
                      href={`/mester/${mesterId}`}
                      className="hidden sm:flex items-center gap-1.5 font-condensed text-[10px] tracking-[0.18em] uppercase text-[#584528]/45 hover:text-primary transition-colors duration-200"
                    >
                      Vezi toate <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </div>
                  <ProjectsGrid projects={otherProjects} mesterId={mesterId} />
                  <Link
                    href={`/mester/${mesterId}`}
                    className="sm:hidden flex items-center gap-1.5 font-condensed text-[10px] tracking-[0.18em] uppercase text-[#584528]/45 hover:text-primary transition-colors duration-200 mt-4"
                  >
                    Vezi toate proiectele <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              )}
            </div>

            {/* ── Right: Mester contact sidebar ── */}
            <div>
              <div className="sticky top-24 space-y-4">

                {/* Mester card — parchment */}
                <div className="bg-[#f5eed8] border border-[#584528]/14 p-5 space-y-5">
                  <p className="font-condensed text-[9px] tracking-[0.28em] uppercase text-primary/55">
                    Meșterul proiectului
                  </p>

                  {/* Mester identity */}
                  <Link
                    href={`/mester/${mesterId}`}
                    className="flex items-center gap-3 group"
                  >
                    {/* Avatar square */}
                    <div className="w-12 h-12 border border-[#584528]/18 group-hover:border-primary/40 transition-colors duration-200 shrink-0 overflow-hidden relative bg-[#e8dfc8]">
                      {mesterProfilePhoto ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={mesterProfilePhoto}
                          alt={mester.display_name}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="font-display text-xl font-light text-primary/50">
                            {firstName[0]}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-display text-[#3d2e14] text-base font-medium group-hover:text-primary transition-colors duration-200 leading-tight">
                        {firstName}
                        {restName && (
                          <em className="text-primary/80 not-italic"> {restName}</em>
                        )}
                      </p>
                      <p className="font-condensed text-[10px] tracking-[0.14em] uppercase text-[#584528]/50 mt-0.5">
                        {primaryCategory?.name || "Meșter"}
                      </p>
                    </div>
                  </Link>

                  {/* Rating + city */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <Star className="h-3.5 w-3.5 fill-primary text-primary shrink-0" />
                      <span className="font-condensed text-sm text-[#3d2e14] font-medium">
                        {mester.avg_rating.toFixed(1)}
                      </span>
                      <span className="font-condensed text-[11px] text-[#584528]/45">
                        ({mester.reviews_count})
                      </span>
                    </div>
                    <div className="flex items-center gap-1 font-condensed text-[11px] tracking-[0.08em] text-[#584528]/50">
                      <MapPin className="h-3 w-3 shrink-0" />
                      {mester.city}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-[#584528]/12" />

                  {/* WhatsApp CTA */}
                  <WhatsAppButton
                    whatsappNumber={mester.whatsapp_number}
                    mesterName={mester.display_name}
                  />

                  {/* View full profile link */}
                  <Link
                    href={`/mester/${mesterId}`}
                    className="flex items-center justify-center gap-1.5 w-full py-2.5 border border-[#584528]/18 hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
                  >
                    <span className="font-condensed text-[11px] tracking-[0.16em] uppercase text-[#584528]/55 hover:text-primary transition-colors duration-200">
                      Vezi profilul complet
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-[#584528]/35" />
                  </Link>
                </div>

                {/* Back link */}
                <Link
                  href={`/mester/${mesterId}`}
                  className="flex items-center gap-2 text-[#584528]/40 hover:text-primary transition-colors duration-200"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span className="font-condensed text-[10px] tracking-[0.2em] uppercase">
                    Înapoi la profil
                  </span>
                </Link>

              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}
