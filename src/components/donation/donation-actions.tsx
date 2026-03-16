"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { closeDonation, deleteDonation } from "@/actions/donations"

interface DonationActionsProps {
  donationId: string
  status: string
  afterDelete?: () => void
  redirectAfterDelete?: string
}

export function DonationActions({ donationId, status, afterDelete, redirectAfterDelete }: DonationActionsProps) {
  const router = useRouter()
  const [isPendingClose, startClose] = useTransition()
  const [isPendingDelete, startDelete] = useTransition()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleClose() {
    startClose(async () => {
      const result = await closeDonation(donationId)
      if (result.error) {
        setError(result.error)
      } else {
        router.refresh()
      }
    })
  }

  function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    startDelete(async () => {
      const result = await deleteDonation(donationId)
      if (result.error) {
        setError(result.error)
      } else if (afterDelete) {
        afterDelete()
      } else if (redirectAfterDelete) {
        router.push(redirectAfterDelete)
      } else {
        router.refresh()
      }
    })
  }

  return (
    <div className="space-y-3">
      {error && (
        <p className="text-red-500/80 text-sm font-condensed">{error}</p>
      )}

      <div className="flex flex-wrap gap-3">
        {status === "active" && (
          <Button
            onClick={handleClose}
            disabled={isPendingClose}
            variant="outline"
            className="border-[#584528]/30 text-[#584528]/70 hover:bg-[#f5eed8] rounded-none font-condensed tracking-wider gap-2"
          >
            {isPendingClose ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            Marchează ca donat
          </Button>
        )}

        <Button
          onClick={handleDelete}
          disabled={isPendingDelete}
          variant="outline"
          className={
            confirmDelete
              ? "border-red-500/50 text-red-600 hover:bg-red-50 rounded-none font-condensed tracking-wider gap-2"
              : "border-red-500/20 text-red-400/60 hover:border-red-500/40 hover:text-red-500/80 rounded-none font-condensed tracking-wider gap-2"
          }
        >
          {isPendingDelete ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
          {confirmDelete ? "Confirmă ștergerea" : "Șterge donația"}
        </Button>
        {confirmDelete && (
          <button
            onClick={() => setConfirmDelete(false)}
            className="font-condensed text-xs tracking-wide text-[#584528]/40 hover:text-[#584528]/70 underline"
          >
            Anulează
          </button>
        )}
      </div>
    </div>
  )
}
