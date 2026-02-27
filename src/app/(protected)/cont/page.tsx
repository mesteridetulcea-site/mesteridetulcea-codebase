import Link from "next/link"
import { redirect } from "next/navigation"
import { Heart, FileText, Settings, User } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

async function getUserData() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const [{ data: profile }, { count: favoritesCount }, { count: requestsCount }] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase
        .from("favorites")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id),
      supabase
        .from("service_requests")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id),
    ])

  return {
    user,
    profile,
    stats: {
      favorites: favoritesCount || 0,
      requests: requestsCount || 0,
    },
  }
}

export default async function AccountPage() {
  const { profile, stats } = await getUserData()

  const getInitials = (name: string | null) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const menuItems = [
    {
      title: "Favorite",
      description: `${stats.favorites} meșteri salvați`,
      href: "/cont/favorite",
      icon: Heart,
    },
    {
      title: "Cererile mele",
      description: `${stats.requests} cereri trimise`,
      href: "/cont/cereri",
      icon: FileText,
    },
    {
      title: "Setări cont",
      description: "Modifică datele personale",
      href: "/cont/setari",
      icon: Settings,
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Profile header */}
          <Card>
            <CardContent className="py-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="text-xl">
                    {getInitials(profile?.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold">
                    {profile?.full_name || "Utilizator"}
                  </h1>
                  <p className="text-muted-foreground">{profile?.email}</p>
                  {profile?.phone && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {profile.phone}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick stats */}
          <div className="grid sm:grid-cols-2 gap-4">
            {menuItems.slice(0, 2).map((item) => (
              <Link key={item.href} href={item.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {item.title}
                    </CardTitle>
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {item.title === "Favorite"
                        ? stats.favorites
                        : stats.requests}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Menu */}
          <Card>
            <CardHeader>
              <CardTitle>Meniu cont</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {menuItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-auto py-4"
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    <div className="text-left">
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </Button>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Become a mester CTA */}
          {profile?.role === "client" && (
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="py-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-lg">Ești meșter?</h3>
                    <p className="text-sm text-muted-foreground">
                      Înregistrează-te ca meșter și primește cereri de la clienți
                    </p>
                  </div>
                  <Link href="/devino-mester">
                    <Button>Devino meșter</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
