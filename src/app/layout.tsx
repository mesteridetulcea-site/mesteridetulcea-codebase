import type { Metadata } from "next"
import { Cormorant_Garamond, Barlow, Barlow_Condensed, Geist_Mono } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { TooltipProvider } from "@/components/ui/tooltip"
import "./globals.css"

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
})

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const APP_URL = "https://mesteridetulcea.ro"

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Meșteri de Tulcea | Găsește meșteri de încredere în Tulcea",
    template: "%s | Meșteri de Tulcea",
  },
  description:
    "Găsește meșteri de încredere în Tulcea — electricieni, instalatori, zidari, zugravi, tâmplari și mulți alții. Recenzii reale, contact direct, fără intermediari.",
  keywords: [
    "mesteri Tulcea",
    "meșteri de Tulcea",
    "electrician Tulcea",
    "instalator Tulcea",
    "zidar Tulcea",
    "zugrav Tulcea",
    "tamplar Tulcea",
    "reparatii Tulcea",
    "constructii Tulcea",
    "lucrari Tulcea",
    "mesteri verificati Tulcea",
    "servicii meseriasi Tulcea",
  ],
  authors: [{ name: "Meșteri de Tulcea" }],
  creator: "Meșteri de Tulcea",
  publisher: "Meșteri de Tulcea",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: {
    type: "website",
    locale: "ro_RO",
    url: APP_URL,
    siteName: "Meșteri de Tulcea",
    title: "Meșteri de Tulcea | Găsește meșteri de încredere",
    description:
      "Găsește meșteri de încredere în Tulcea — electricieni, instalatori, zidari, zugravi și mulți alții. Recenzii reale, contact direct.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Meșteri de Tulcea" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Meșteri de Tulcea | Găsește meșteri de încredere",
    description:
      "Găsește meșteri de încredere în Tulcea — electricieni, instalatori, zidari, zugravi și mulți alții.",
    images: ["/og-image.jpg"],
  },
  alternates: { canonical: APP_URL },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ro">
      <body
        className={`${cormorantGaramond.variable} ${barlow.variable} ${barlowCondensed.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <TooltipProvider>
          {children}
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  )
}
