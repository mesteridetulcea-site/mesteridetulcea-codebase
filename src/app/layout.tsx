import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { TooltipProvider } from "@/components/ui/tooltip"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "Meșteri de Tulcea | Găsește meșteri de încredere",
    template: "%s | Meșteri de Tulcea",
  },
  description:
    "Platforma care conectează locuitorii din Tulcea cu meșteri de încredere pentru orice tip de lucrare. Electricieni, instalatori, zidari și mulți alții.",
  keywords: [
    "mesteri",
    "Tulcea",
    "electricieni",
    "instalatori",
    "zidari",
    "zugravii",
    "reparatii",
    "constructii",
  ],
  authors: [{ name: "Meșteri de Tulcea" }],
  openGraph: {
    type: "website",
    locale: "ro_RO",
    siteName: "Meșteri de Tulcea",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ro">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <TooltipProvider>
          {children}
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  )
}
