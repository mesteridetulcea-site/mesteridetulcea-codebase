"use client"

import { useState } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUser } from "@/lib/hooks/use-user"
import { useRouter } from "next/navigation"
import { toast } from "@/lib/hooks/use-toast"
import { toggleFavorite } from "@/actions/favorites"
import { cn } from "@/lib/utils/cn"

interface FavoriteButtonProps {
  mesterId: string
  initialFavorited?: boolean
  variant?: "default" | "icon"
}

export function FavoriteButton({
  mesterId,
  initialFavorited = false,
  variant = "default",
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited)
  const [isLoading, setIsLoading] = useState(false)
  const { user, loading } = useUser()
  const router = useRouter()

  async function handleClick() {
    if (loading) return

    if (!user) {
      toast({
        title: "Autentificare necesară",
        description: "Trebuie să fii autentificat pentru a salva favorite.",
      })
      router.push("/login?redirectTo=" + encodeURIComponent(window.location.pathname))
      return
    }

    setIsLoading(true)
    try {
      const result = await toggleFavorite(mesterId)
      if (result.error) {
        toast({
          title: "Eroare",
          description: result.error,
          variant: "destructive",
        })
      } else {
        setIsFavorited(result.isFavorited ?? false)
        toast({
          title: result.isFavorited ? "Adăugat la favorite" : "Eliminat din favorite",
        })
      }
    } catch {
      toast({
        title: "Eroare",
        description: "A apărut o eroare. Încearcă din nou.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (variant === "icon") {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleClick}
        disabled={isLoading}
        className={cn(
          "rounded-full",
          isFavorited && "text-red-500 hover:text-red-600"
        )}
      >
        <Heart className={cn("h-5 w-5", isFavorited && "fill-current")} />
        <span className="sr-only">
          {isFavorited ? "Elimină din favorite" : "Adaugă la favorite"}
        </span>
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        "w-full gap-2",
        isFavorited && "text-red-500 border-red-500 hover:text-red-600"
      )}
    >
      <Heart className={cn("h-5 w-5", isFavorited && "fill-current")} />
      {isFavorited ? "Salvat în favorite" : "Adaugă la favorite"}
    </Button>
  )
}
