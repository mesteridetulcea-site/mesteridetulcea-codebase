import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Donații | Meșteri de Tulcea",
  description: "Obiecte donate gratuit în Tulcea. Găsești frigidere, mobilă, electronice și alte bunuri pe care locuitorii din Tulcea le donează.",
}

export default function DonatiiLayout({ children }: { children: React.ReactNode }) {
  return children
}
