import Link from "next/link"
import { Camera, FolderOpen, Plus } from "lucide-react"
import type { ProjectWithPhotos } from "@/types/database"

interface ProjectsGridProps {
  projects: ProjectWithPhotos[]
  mesterId: string
  isOwner?: boolean
}

export function ProjectsGrid({ projects, mesterId, isOwner = false }: ProjectsGridProps) {
  if (projects.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        <FolderOpen className="h-10 w-10 mx-auto mb-3 opacity-30" />
        <p>Nu există proiecte adăugate încă.</p>
        {isOwner && (
          <Link
            href="/mester-cont/proiecte"
            className="inline-flex items-center gap-2 mt-4 font-condensed tracking-[0.16em] uppercase text-xs text-primary hover:text-primary/80 border border-primary/45 hover:border-primary hover:bg-primary/5 px-4 py-2 transition-colors duration-200"
          >
            <Plus className="h-3.5 w-3.5" />
            Adaugă primul proiect
          </Link>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {isOwner && (
        <div className="flex justify-end">
          <Link
            href="/mester-cont/proiecte"
            className="inline-flex items-center gap-2 font-condensed tracking-[0.16em] uppercase text-xs text-primary hover:text-primary/80 border border-primary/45 hover:border-primary hover:bg-primary/5 px-4 py-2 transition-colors duration-200"
          >
            <Plus className="h-3.5 w-3.5" />
            Adaugă proiect
          </Link>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-6">
        {projects.map((project) => {
          const coverPhoto = project.project_photos?.[0]
          const photoCount = project.project_photos?.length ?? 0

          return (
            <Link
              key={project.id}
              href={`/mester/${mesterId}/proiect/${project.id}`}
              className="group block overflow-hidden border border-[#584528]/12 hover:border-primary/40 hover:shadow-xl transition-all duration-300 bg-white"
            >
              {/* Photo */}
              <div className="relative aspect-[4/3] bg-[#f5eed8] overflow-hidden">
                {coverPhoto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={coverPhoto.url}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Camera className="h-12 w-12 text-primary/20" />
                  </div>
                )}

                {/* Photo count badge */}
                {photoCount > 0 && (
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/60 text-white text-xs px-2 py-1 font-condensed">
                    <Camera className="h-3 w-3" />
                    {photoCount}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-display text-base font-medium group-hover:text-primary transition-colors duration-200 line-clamp-1">
                  {project.title}
                </h3>
                {project.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
