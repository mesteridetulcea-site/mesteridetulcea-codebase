import Link from "next/link"
import { Clock, ImageIcon } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ro } from "date-fns/locale"
import type { DonationWithPhotos } from "@/types/database"

interface DonationCardProps {
  donation: DonationWithPhotos
  currentUserId?: string
}

export function DonationCard({ donation, currentUserId }: DonationCardProps) {
  const approvedPhotos = donation.donation_photos?.filter(
    (p) => p.approval_status === "approved"
  ) ?? []
  const coverPhoto = approvedPhotos[0]
  const isOwner = currentUserId === donation.user_id

  return (
    <article className="bg-white group border border-[#584528]/10 hover:border-[#584528]/25 transition-colors duration-200">
      <Link href={`/donatii/${donation.id}`} className="block">

        {/* Cover photo */}
        <div className="relative aspect-[4/3] overflow-hidden bg-[#f5eed8]">
          {coverPhoto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverPhoto.url}
              alt={donation.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <ImageIcon className="h-8 w-8 text-[#584528]/20" />
              <span className="font-condensed text-[10px] tracking-[0.18em] uppercase text-[#584528]/30">
                Fără poze
              </span>
            </div>
          )}

          {/* Status badge */}
          <div className="absolute top-2 left-2">
            {donation.status === "closed" ? (
              <span className="font-condensed text-[9px] tracking-[0.16em] uppercase px-2 py-0.5 bg-[#584528]/70 text-white/80">
                Donat
              </span>
            ) : (
              <span className="font-condensed text-[9px] tracking-[0.16em] uppercase px-2 py-0.5 bg-[#2d6a2d]/80 text-white/90">
                Disponibil
              </span>
            )}
          </div>

          {isOwner && (
            <div className="absolute top-2 right-2">
              <span className="font-condensed text-[9px] tracking-[0.14em] uppercase px-2 py-0.5 bg-primary/80 text-white/90">
                Al tău
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="px-3 pt-3 pb-4 sm:px-5 sm:pt-4 sm:pb-5">
          <h2
            className="font-display text-[#1a1208] group-hover:text-primary transition-colors duration-200 leading-snug mb-1.5 line-clamp-2"
            style={{ fontSize: "clamp(0.85rem, 2vw, 1.2rem)", fontWeight: 500 }}
          >
            {donation.title}
          </h2>

          <p className="hidden sm:block text-[#3d2e14]/60 text-sm leading-relaxed line-clamp-2 mb-3">
            {donation.description}
          </p>

          <div className="flex items-center justify-between mt-2">
            <time className="flex items-center gap-1 font-condensed text-[9px] sm:text-[10px] tracking-[0.12em] uppercase text-[#584528]/35">
              <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              {formatDistanceToNow(new Date(donation.created_at), { addSuffix: true, locale: ro })}
            </time>

            {approvedPhotos.length > 0 && (
              <div className="flex items-center gap-1">
                <ImageIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-[#584528]/35" />
                <span className="font-condensed text-[9px] sm:text-[10px] tracking-[0.12em] uppercase text-[#584528]/40">
                  {approvedPhotos.length}
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </article>
  )
}
