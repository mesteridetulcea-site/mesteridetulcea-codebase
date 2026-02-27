import Link from "next/link"
import { Hammer } from "lucide-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/50 px-4 py-12">
      <Link href="/" className="mb-8 flex items-center gap-2 text-2xl font-bold text-primary">
        <Hammer className="h-8 w-8" />
        <span>Meșteri de Tulcea</span>
      </Link>
      {children}
    </div>
  )
}
