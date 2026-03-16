"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DonationForm } from "@/components/donation/donation-form"

interface DonationAddButtonProps {
  isLoggedIn: boolean
  hasPhone: boolean
}

export function DonationAddButton({ isLoggedIn, hasPhone }: DonationAddButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-primary hover:bg-primary/90 text-white rounded-none font-condensed tracking-wider gap-2"
      >
        <Plus className="h-4 w-4" />
        Adaugă donație
      </Button>

      <DonationForm
        open={open}
        onClose={() => setOpen(false)}
        isLoggedIn={isLoggedIn}
        hasPhone={hasPhone}
      />
    </>
  )
}
