import Link from "next/link"
import { Eye, Star, Heart, Image, AlertCircle, CheckCircle } from "lucide-react"
import { getMesterProfile } from "@/actions/mester"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SubscriptionBadge } from "@/components/mester/subscription-badge"
import type { SubscriptionTier, ApprovalStatus } from "@/types/database"
import { APPROVAL_STATUS_LABELS } from "@/lib/constants"

export default async function MesterDashboardPage() {
  const mester = await getMesterProfile()

  if (!mester) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Nu am putut încărca profilul.</p>
      </div>
    )
  }

  const isPending = mester.approval_status === "pending"
  const isRejected = mester.approval_status === "rejected"
  const isApproved = mester.approval_status === "approved"

  const stats = [
    {
      title: "Vizualizări",
      value: mester.views_count,
      icon: Eye,
    },
    {
      title: "Rating mediu",
      value: mester.avg_rating.toFixed(1),
      icon: Star,
    },
    {
      title: "Recenzii",
      value: mester.reviews_count,
      icon: Heart,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bun venit, {mester.display_name}!</h1>
          <p className="text-muted-foreground">
            Gestionează profilul tău de meșter
          </p>
        </div>
        <SubscriptionBadge tier={mester.subscription_tier as SubscriptionTier} />
      </div>

      {/* Approval status alert */}
      {isPending && (
        <Card className="border-amber-500 bg-amber-50">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <div>
                <p className="font-medium text-amber-800">
                  Profilul tău este în așteptare
                </p>
                <p className="text-sm text-amber-700">
                  Un administrator va verifica profilul tău în curând.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {isRejected && (
        <Card className="border-red-500 bg-red-50">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-red-800">
                  Profilul tău a fost respins
                </p>
                {mester.rejection_reason ? (
                  <p className="text-sm text-red-700 mt-1">
                    <span className="font-medium">Motiv:</span>{" "}
                    {mester.rejection_reason}
                  </p>
                ) : (
                  <p className="text-sm text-red-700">
                    Contactează suportul pentru mai multe detalii.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {isApproved && (
        <Card className="border-green-500 bg-green-50">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">
                  Profilul tău este activ
                </p>
                <p className="text-sm text-green-700">
                  Apari în listele de meșteri și poți primi cereri de la clienți.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              Fotografii
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Adaugă fotografii cu lucrările tale pentru a atrage mai mulți clienți.
            </p>
            <Link href="/mester-cont/fotografii">
              <Button>Gestionează fotografii</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Vizualizare profil
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Vezi cum arată profilul tău pentru clienți.
            </p>
            <Link href={`/mester/${mester.id}`} target="_blank">
              <Button variant="outline">Vezi profilul public</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
