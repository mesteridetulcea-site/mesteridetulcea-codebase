import { HeroSearch } from "@/components/home/hero-search"
import { StatsBand } from "@/components/home/stats-band"
import { CategoriesGrid } from "@/components/home/categories-grid"
import { WhyUs } from "@/components/home/why-us"
import { FeaturedMesters } from "@/components/home/featured-mesters"
import { HowItWorks } from "@/components/home/how-it-works"
import { CtaSection } from "@/components/home/cta-section"

export default function HomePage() {
  return (
    <>
      <HeroSearch />
      <StatsBand />
      <CategoriesGrid />
      <WhyUs />
      <FeaturedMesters />
      <HowItWorks />
      <CtaSection />
    </>
  )
}
