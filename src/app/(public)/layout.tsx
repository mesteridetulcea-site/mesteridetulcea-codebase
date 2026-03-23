import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav"
import { CookieBanner } from "@/components/layout/cookie-banner"
import { AccessibilityWidget } from "@/components/layout/accessibility-widget"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <div className="hidden md:block">
        <Footer />
      </div>
      <MobileBottomNav />
      <CookieBanner />
      <AccessibilityWidget />
    </div>
  )
}
