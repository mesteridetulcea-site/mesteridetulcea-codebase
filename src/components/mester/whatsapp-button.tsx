"use client"

import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUser } from "@/lib/hooks/use-user"
import { useRouter } from "next/navigation"
import { toast } from "@/lib/hooks/use-toast"

interface WhatsAppButtonProps {
  whatsappNumber: string | null
  mesterName: string
}

export function WhatsAppButton({
  whatsappNumber,
  mesterName,
}: WhatsAppButtonProps) {
  const { user, loading } = useUser()
  const router = useRouter()

  function handleClick() {
    if (loading) return

    if (!user) {
      toast({
        title: "Autentificare necesară",
        description: "Trebuie să fii autentificat pentru a contacta meșterii.",
      })
      router.push("/login?redirectTo=" + encodeURIComponent(window.location.pathname))
      return
    }

    if (!whatsappNumber) {
      toast({
        title: "Număr indisponibil",
        description: "Acest meșter nu a adăugat un număr de WhatsApp.",
      })
      return
    }

    // Format phone number for WhatsApp
    const formattedNumber = whatsappNumber.replace(/\D/g, "")
    const message = encodeURIComponent(
      `Bună ziua! Am găsit profilul dumneavoastră pe Meșteri de Tulcea și aș dori să discut despre o lucrare.`
    )
    window.open(`https://wa.me/${formattedNumber}?text=${message}`, "_blank")
  }

  return (
    <Button onClick={handleClick} className="w-full gap-2" size="lg">
      <MessageCircle className="h-5 w-5" />
      Contactează pe WhatsApp
    </Button>
  )
}
