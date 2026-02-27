import Link from "next/link"
import { Hammer } from "lucide-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f0b04] px-4 py-12">
      <div className="flex items-center gap-4 mb-3">
        <div className="h-px w-10 bg-primary/40" />
        <span className="text-primary">★</span>
        <div className="h-px w-10 bg-primary/40" />
      </div>
      <Link href="/" className="mb-8 flex items-center gap-2 text-2xl font-bold text-white tracking-wide">
        <Hammer className="h-8 w-8 text-primary" />
        <span>Meșteri de Tulcea</span>
      </Link>
      {children}
    </div>
  )
}
