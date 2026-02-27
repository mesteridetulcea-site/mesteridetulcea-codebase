"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Loader2, Check, X, Star, ExternalLink } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { approveMester, rejectMester, toggleMesterFeatured } from "@/actions/admin"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/lib/hooks/use-toast"
import type { ApprovalStatus, SubscriptionTier } from "@/types/database"
import { APPROVAL_STATUS_LABELS, SUBSCRIPTION_TIERS } from "@/lib/constants"

interface MesterWithDetails {
  id: string
  business_name: string
  slug: string
  approval_status: ApprovalStatus
  subscription_tier: SubscriptionTier
  is_featured: boolean
  created_at: string
  category: { name: string } | null
  profile: { email: string; full_name: string | null } | null
}

export default function AdminMestersPage() {
  const [mesters, setMesters] = useState<MesterWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    loadMesters()
  }, [])

  async function loadMesters() {
    const supabase = createClient()
    const { data } = await supabase
      .from("mesters")
      .select(`
        id, business_name, slug, approval_status, subscription_tier, is_featured, created_at,
        category:categories(name),
        profile:profiles(email, full_name)
      `)
      .order("created_at", { ascending: false })

    setMesters((data as MesterWithDetails[]) || [])
    setLoading(false)
  }

  async function handleApprove(mesterId: string) {
    setActionLoading(mesterId)
    const result = await approveMester(mesterId)
    if (result.error) {
      toast({ title: "Eroare", description: result.error, variant: "destructive" })
    } else {
      toast({ title: "Meșter aprobat!" })
      loadMesters()
    }
    setActionLoading(null)
  }

  async function handleReject(mesterId: string) {
    setActionLoading(mesterId)
    const result = await rejectMester(mesterId)
    if (result.error) {
      toast({ title: "Eroare", description: result.error, variant: "destructive" })
    } else {
      toast({ title: "Meșter respins" })
      loadMesters()
    }
    setActionLoading(null)
  }

  async function handleToggleFeatured(mesterId: string) {
    setActionLoading(mesterId)
    const result = await toggleMesterFeatured(mesterId)
    if (result.error) {
      toast({ title: "Eroare", description: result.error, variant: "destructive" })
    } else {
      toast({ title: result.isFeatured ? "Meșter promovat!" : "Promovare eliminată" })
      loadMesters()
    }
    setActionLoading(null)
  }

  const pendingMesters = mesters.filter((m) => m.approval_status === "pending")
  const approvedMesters = mesters.filter((m) => m.approval_status === "approved")
  const rejectedMesters = mesters.filter((m) => m.approval_status === "rejected")

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  function MesterCard({ mester }: { mester: MesterWithDetails }) {
    const isLoading = actionLoading === mester.id
    const isPending = mester.approval_status === "pending"

    return (
      <Card key={mester.id}>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold">{mester.business_name}</h3>
                <Badge variant={mester.subscription_tier}>
                  {SUBSCRIPTION_TIERS[mester.subscription_tier].label}
                </Badge>
                {mester.is_featured && (
                  <Badge className="bg-amber-500">Promovat</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {mester.category?.name || "Fără categorie"} •{" "}
                {mester.profile?.email}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Înregistrat la{" "}
                {new Date(mester.created_at).toLocaleDateString("ro-RO")}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/mester/${mester.slug}`} target="_blank">
                <Button variant="ghost" size="icon">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
              {isPending ? (
                <>
                  <Button
                    size="sm"
                    onClick={() => handleApprove(mester.id)}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4 mr-1" />
                    )}
                    Aprobă
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleReject(mester.id)}
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Respinge
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  variant={mester.is_featured ? "secondary" : "outline"}
                  onClick={() => handleToggleFeatured(mester.id)}
                  disabled={isLoading}
                >
                  <Star
                    className={`h-4 w-4 mr-1 ${mester.is_featured ? "fill-current" : ""}`}
                  />
                  {mester.is_featured ? "Nepromovat" : "Promovează"}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestionare Meșteri</h1>
        <p className="text-muted-foreground">
          Aprobă sau respinge cererile de înregistrare
        </p>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">
            În așteptare ({pendingMesters.length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Aprobați ({approvedMesters.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Respinși ({rejectedMesters.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4 mt-4">
          {pendingMesters.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Nu există meșteri în așteptare
              </CardContent>
            </Card>
          ) : (
            pendingMesters.map((mester) => (
              <MesterCard key={mester.id} mester={mester} />
            ))
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4 mt-4">
          {approvedMesters.map((mester) => (
            <MesterCard key={mester.id} mester={mester} />
          ))}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4 mt-4">
          {rejectedMesters.map((mester) => (
            <MesterCard key={mester.id} mester={mester} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
