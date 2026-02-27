import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Caută Meșteri",
  description:
    "Caută și găsește meșterul perfect pentru nevoile tale în Tulcea. Descrie ce ai nevoie și găsim meșterii potriviți pentru tine.",
}

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
