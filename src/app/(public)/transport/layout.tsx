import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Transport Marfă Tulcea",
  description:
    "Solicită servicii de transport marfă în zona Tulcea. Mobilă, electronice, materiale de construcții - transportatorii locali te ajută.",
}

export default function TransportLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
