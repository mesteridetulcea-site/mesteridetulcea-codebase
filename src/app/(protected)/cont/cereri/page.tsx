"use client"

import { useState, useEffect, useTransition } from "react"
import Link from "next/link"
import { ArrowLeft, FileText, Plus, Trash2, CheckCircle, Clock, Truck, MapPin, Navigation } from "lucide-react"
import { closeCerere, deleteCerere } from "@/actions/cereri"
import { cancelTransportRequest, closeTransportRequest } from "@/actions/transport"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { toast } from "@/lib/hooks/use-toast"
import { formatDistanceToNow } from "date-fns"
import { ro } from "date-fns/locale"
import { haversineKm, formatDistance, formatTravelTime } from "@/lib/utils/distance"

interface CererePhoto {
  id: string
  url: string
  approval_status: string
}

interface Cerere {
  kind: "cerere"
  id: string
  title: string | null
  original_message: string
  status: string | null
  client_phone: string | null
  created_at: string
  category: { name: string } | null
  cerere_photos: CererePhoto[]
}

interface TransportItem {
  kind: "transport"
  id: string
  pickup_address: string
  pickup_lat: number
  pickup_lng: number
  dropoff_address: string
  dropoff_lat: number
  dropoff_lng: number
  description: string | null
  status: string
  created_at: string
}

type Item = Cerere | TransportItem

export default function CereriPage() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single() as { data: { role: string } | null }
      setRole(profile?.role ?? null)

      const [cereriRes, transportRes] = await Promise.all([
        supabase
          .from("service_requests")
          .select("id, title, original_message, status, client_phone, created_at, category:categories(name), cerere_photos(id, url, approval_status)")
          .eq("client_id", user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("transport_requests")
          .select("id, pickup_address, pickup_lat, pickup_lng, dropoff_address, dropoff_lat, dropoff_lng, description, status, created_at")
          .eq("client_id", user.id)
          .order("created_at", { ascending: false }),
      ])

      const cereri: Cerere[] = ((cereriRes.data || []) as Omit<Cerere, "kind">[]).map(c => ({ ...c, kind: "cerere" }))
      const transport: TransportItem[] = ((transportRes.data || []) as Omit<TransportItem, "kind">[]).map(t => ({ ...t, kind: "transport" }))

      const merged = [...cereri, ...transport].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      setItems(merged)
      setLoading(false)
    }
    load()
  }, [])

  async function handleClose(id: string) {
    startTransition(async () => {
      const result = await closeCerere(id)
      if (result.error) {
        toast({ title: "Eroare", description: result.error, variant: "destructive" })
      } else {
        setItems((prev) => prev.map((c) => (c.id === id ? { ...c, status: "incheiata" } : c)))
        toast({ title: "Cerere încheiată", description: "Cererea a fost marcată ca finalizată." })
      }
    })
  }

  async function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteCerere(id)
      if (result.error) {
        toast({ title: "Eroare", description: result.error, variant: "destructive" })
      } else {
        setItems((prev) => prev.filter((c) => c.id !== id))
        toast({ title: "Șters", description: "Cererea a fost ștearsă." })
      }
    })
  }

  async function handleCloseTransport(id: string) {
    startTransition(async () => {
      const result = await closeTransportRequest(id)
      if (result?.error) {
        toast({ title: "Eroare", description: result.error, variant: "destructive" })
      } else {
        setItems((prev) => prev.map((c) => (c.id === id ? { ...c, status: "closed" } : c)))
        toast({ title: "Cerere finalizată", description: "Cererea de transport a fost marcată ca finalizată." })
      }
    })
  }

  async function handleCancelTransport(id: string) {
    startTransition(async () => {
      const result = await cancelTransportRequest(id)
      if (result?.error) {
        toast({ title: "Eroare", description: result.error, variant: "destructive" })
      } else {
        setItems((prev) => prev.filter((c) => c.id !== id))
        toast({ title: "Anulat", description: "Cererea de transport a fost anulată." })
      }
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="max-w-3xl mx-auto">
          <Link href="/">
            <Button variant="ghost" className="mb-6 -ml-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Acasă
            </Button>
          </Link>

          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <FileText className="h-7 w-7 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Cererile mele</h1>
                {!loading && (
                  <p className="text-muted-foreground text-sm">
                    {items.length} {items.length === 1 ? "cerere" : "cereri"}
                  </p>
                )}
              </div>
            </div>
            <Link href={role === "mester" || role === "admin" ? "/transport" : "/cereri/nou"}>
              <Button size="sm" className="gap-1.5">
                <Plus className="h-4 w-4" />
                Cerere nouă
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-32 bg-muted/30 animate-pulse" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-14 bg-muted/20 border border-border">
              <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <h3 className="font-semibold mb-1">Nu ai cereri</h3>
              <p className="text-muted-foreground text-sm mb-5">
                Postează o cerere și meșterii din categoria potrivită te vor contacta
              </p>
              <Link href="/cereri/nou">
                <Button>Creează prima cerere</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                if (item.kind === "transport") {
                  return (
                    <Card key={`t-${item.id}`} className="rounded-none border-border">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <Truck className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground font-medium">Transport marfă</span>
                            </div>
                            <Link href={`/cereri/transport/${item.id}`} className="hover:text-primary transition-colors">
                              <CardTitle className="text-base leading-snug flex items-center gap-2">
                                <MapPin className="h-3.5 w-3.5 text-green-600/70 shrink-0" />
                                {item.pickup_address.split(",")[0]}
                                <span className="text-muted-foreground font-normal">→</span>
                                <Navigation className="h-3.5 w-3.5 text-red-500/70 shrink-0" />
                                {item.dropoff_address.split(",")[0]}
                              </CardTitle>
                            </Link>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {item.pickup_lat && item.pickup_lng && item.dropoff_lat && item.dropoff_lng && (() => {
                              const distKm = haversineKm(item.pickup_lat, item.pickup_lng, item.dropoff_lat, item.dropoff_lng)
                              return (
                                <span className="text-xs text-primary border border-primary/30 px-2 py-0.5 font-medium">
                                  {formatDistance(distKm)} · {formatTravelTime(distKm)}
                                </span>
                              )
                            })()}
                            <Badge
                              variant={item.status === "open" ? "default" : "secondary"}
                              className="shrink-0"
                            >
                              {item.status === "open" ? (
                                <><Clock className="mr-1 h-3 w-3" />Activă</>
                              ) : (
                                <><CheckCircle className="mr-1 h-3 w-3" />Încheiată</>
                              )}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {item.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{item.description}</p>
                        )}
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: ro })}
                          </span>
                          {item.status === "open" && (
                            <div className="flex items-center gap-1">
                              <Button variant="outline" size="sm" className="h-7 text-xs gap-1 rounded-none" disabled={isPending} onClick={() => handleCloseTransport(item.id)}>
                                <CheckCircle className="h-3 w-3" />
                                Finalizată
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive rounded-none" disabled={isPending}>
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Anulezi cererea de transport?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Cererea va fi anulată și nu va mai fi vizibilă transportatorilor.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Înapoi</AlertDialogCancel>
                                    <AlertDialogAction
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      onClick={() => handleCancelTransport(item.id)}
                                    >
                                      Anulează cererea
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                }

                // Regular cerere
                return (
                  <Card key={`c-${item.id}`} className="rounded-none border-border">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <Link href={`/cereri/${item.id}`} className="hover:text-primary transition-colors">
                            <CardTitle className="text-base leading-snug">
                              {item.title || item.original_message.slice(0, 60)}
                            </CardTitle>
                          </Link>
                          {item.category && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {item.category.name}
                            </p>
                          )}
                        </div>
                        <Badge
                          variant={item.status === "open" ? "default" : "secondary"}
                          className="shrink-0"
                        >
                          {item.status === "open" ? (
                            <><Clock className="mr-1 h-3 w-3" />Activă</>
                          ) : (
                            <><CheckCircle className="mr-1 h-3 w-3" />Încheiată</>
                          )}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {item.title && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {item.original_message}
                        </p>
                      )}

                      {item.cerere_photos && item.cerere_photos.length > 0 && (
                        <div className="flex gap-1.5 flex-wrap">
                          {item.cerere_photos.slice(0, 4).map((photo) => (
                            <div key={photo.id} className="relative">
                              <a href={photo.url} target="_blank" rel="noopener noreferrer" className="block w-14 h-14 border border-border overflow-hidden">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={photo.url} alt="Poză cerere" className="w-full h-full object-cover" />
                              </a>
                              {photo.approval_status === "pending" && (
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border border-white" title="În așteptare aprobare" />
                              )}
                              {photo.approval_status === "rejected" && (
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white" title="Respinsă" />
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: ro })}
                          {item.client_phone && (
                            <span className="ml-2 text-muted-foreground/60">· tel. {item.client_phone}</span>
                          )}
                        </span>

                        <div className="flex items-center gap-1">
                          {item.status === "open" && (
                            <Button variant="outline" size="sm" className="h-7 text-xs gap-1 rounded-none" disabled={isPending} onClick={() => handleClose(item.id)}>
                              <CheckCircle className="h-3 w-3" />
                              Finalizată
                            </Button>
                          )}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive rounded-none" disabled={isPending}>
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Șterge cererea?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Cererea va fi ștearsă definitiv și nu va mai fi vizibilă meșterilor.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Anulează</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  onClick={() => handleDelete(item.id)}
                                >
                                  Șterge
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
