"use client"

import { useTransition, useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { closeTransportRequest } from "@/actions/transport"
import { toast } from "@/lib/hooks/use-toast"

export function FinalizeTransportButton({ requestId }: { requestId: string }) {
  const [done, setDone] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleFinalize() {
    startTransition(async () => {
      const result = await closeTransportRequest(requestId)
      if (result?.error) {
        toast({ title: "Eroare", description: result.error, variant: "destructive" })
      } else {
        setDone(true)
        toast({ title: "Cerere finalizată", description: "Cererea de transport a fost marcată ca finalizată." })
        router.push("/cont/cereri")
      }
    })
  }

  if (done) return null

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-1.5 rounded-none border-primary/40 text-primary hover:bg-primary/5"
      disabled={isPending}
      onClick={handleFinalize}
    >
      <CheckCircle className="h-4 w-4" />
      {isPending ? "Se finalizează..." : "Finalizează cererea"}
    </Button>
  )
}
