"use client"

import { useTransition, useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, Loader2 } from "lucide-react"
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
    <button
      onClick={handleFinalize}
      disabled={isPending}
      className="inline-flex items-center gap-2 h-9 px-4 font-condensed tracking-[0.16em] uppercase font-semibold transition-all duration-200"
      style={{
        fontSize: "11px",
        border: "1px solid hsl(38 68% 44% / 0.45)",
        color: "hsl(38 68% 44%)",
        background: "hsl(38 68% 44% / 0.08)",
        opacity: isPending ? 0.6 : 1,
        cursor: isPending ? "not-allowed" : "pointer",
      }}
    >
      {isPending
        ? <Loader2 style={{ width: "12px", height: "12px" }} className="animate-spin" />
        : <CheckCircle style={{ width: "12px", height: "12px" }} />
      }
      {isPending ? "Se finalizează..." : "Finalizează cererea"}
    </button>
  )
}
