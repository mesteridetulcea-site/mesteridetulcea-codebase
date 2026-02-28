import Link from "next/link"
import { ArrowLeft, FileText, Clock, CheckCircle, Send } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { formatDistanceToNow } from "date-fns"
import { ro } from "date-fns/locale"

interface ServiceRequest {
  id: string
  query: string
  status: string
  created_at: string
  notified_mesters: string[] | null
  category: { name: string } | null
}

async function getServiceRequests(): Promise<ServiceRequest[]> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data } = await supabase
    .from("service_requests")
    .select(
      `
      *,
      category:categories(name)
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (data || []) as ServiceRequest[]
}

const statusConfig = {
  pending: {
    label: "În așteptare",
    icon: Clock,
    variant: "secondary" as const,
  },
  sent: {
    label: "Trimis",
    icon: Send,
    variant: "default" as const,
  },
  completed: {
    label: "Finalizat",
    icon: CheckCircle,
    variant: "outline" as const,
  },
}

export default async function RequestsPage() {
  const requests = await getServiceRequests()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/cont">
            <Button variant="ghost" className="mb-6 -ml-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Înapoi la cont
            </Button>
          </Link>

          <div className="flex items-center gap-3 mb-8">
            <FileText className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Cererile mele</h1>
              <p className="text-muted-foreground">
                {requests.length} cereri trimise
              </p>
            </div>
          </div>

          {requests.length === 0 ? (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Nu ai cereri trimise
              </h3>
              <p className="text-muted-foreground mb-4">
                Când cauți un serviciu și trimiți o cerere, va apărea aici
              </p>
              <Link href="/cauta">
                <Button>Caută servicii</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => {
                const status = statusConfig[request.status as keyof typeof statusConfig]
                const StatusIcon = status.icon

                return (
                  <Card key={request.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            {request.query}
                          </CardTitle>
                          {request.category && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Categoria: {request.category.name}
                            </p>
                          )}
                        </div>
                        <Badge variant={status.variant}>
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {status.label}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Trimis{" "}
                          {formatDistanceToNow(new Date(request.created_at), {
                            addSuffix: true,
                            locale: ro,
                          })}
                        </span>
                        {request.notified_mesters && (
                          <span className="text-muted-foreground">
                            {request.notified_mesters.length} meșteri notificați
                          </span>
                        )}
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
