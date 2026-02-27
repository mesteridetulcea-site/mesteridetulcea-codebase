"use client"

import { useEffect } from "react"
import { RefreshCw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
            <span className="text-4xl">⚠️</span>
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-4">Ceva nu a mers bine</h1>
        <p className="text-muted-foreground mb-8">
          A apărut o eroare neașteptată. Încercați să reîncărcați pagina sau
          reveniți la pagina principală.
        </p>
        {error.digest && (
          <p className="text-xs text-muted-foreground mb-4">
            Cod eroare: {error.digest}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reîncearcă
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Acasă
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
