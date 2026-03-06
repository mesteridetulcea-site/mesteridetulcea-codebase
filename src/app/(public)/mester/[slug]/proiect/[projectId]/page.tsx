import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, MapPin, Star, Camera } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
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

  const [{ data: rawProject }, { data: mester }, { data: rawOtherProjects }] = await Promise.all([
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
  ])

  if (!rawProject || !mester) return null

  // Filter to approved photos only for public view
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
  }
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug: mesterId, projectId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const data = await getProjectData(mesterId, projectId)

  if (!data) notFound()

  const { project, mester, otherProjects, allProjectPhotos } = data
  const photos = project.project_photos ?? []
  const primaryCategory = mester.mester_categories?.[0]?.category

  // Check ownership
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

  return (
    <>
      <div className="bg-[#0f0b04] border-b border-[#584528] py-4">
        <div className="container">
          <Link
            href={`/mester/${mesterId}`}
            className="inline-flex items-center text-white/55 hover:text-primary transition-colors text-sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Înapoi la profil
          </Link>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl sm:text-3xl font-bold">{project.title}</h1>
              {isOwner && (
                <ProjectEditDialog
                  projectId={project.id}
                  initialTitle={project.title}
                  initialDescription={project.description}
                  initialPhotos={allProjectPhotos}
                />
              )}
            </div>

            {/* Photo carousel */}
            {photos.length > 0 ? (
              <ProjectPhotoCarousel photos={photos} title={project.title} />
            ) : (
              <div className="relative aspect-[4/3] bg-[#f5eed8] flex items-center justify-center">
                <Camera className="h-16 w-16 text-primary/20" />
              </div>
            )}

            {/* Description */}
            {project.description && (
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-lg font-semibold mb-3">Despre proiect</h2>
                  <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                    {project.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Other projects */}
            {otherProjects.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4">
                  Alte proiecte realizate de {mester.display_name}
                </h2>
                <ProjectsGrid projects={otherProjects} mesterId={mesterId} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <Card className="sticky top-24">
              <CardContent className="pt-6 space-y-4">
                <Link href={`/mester/${mesterId}`} className="flex items-center gap-3 group">
                  <div className="w-10 h-10 bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="font-bold text-primary">
                      {mester.display_name[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold group-hover:text-primary transition-colors">
                      {mester.display_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {primaryCategory?.name || "Meșter"}
                    </p>
                  </div>
                </Link>

                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-medium text-foreground">{mester.avg_rating.toFixed(1)}</span>
                    <span>({mester.reviews_count})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {mester.city}
                  </div>
                </div>

                <WhatsAppButton
                  whatsappNumber={mester.whatsapp_number}
                  mesterName={mester.display_name}
                />

                <Link
                  href={`/mester/${mesterId}`}
                  className="block w-full text-center text-sm text-primary hover:underline"
                >
                  Vezi toate proiectele →
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
