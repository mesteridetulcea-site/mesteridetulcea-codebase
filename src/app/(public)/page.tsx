import { HeroSearch } from "@/components/home/hero-search"
import { CategoriesGrid } from "@/components/home/categories-grid"
import { FeaturedMesters } from "@/components/home/featured-mesters"
import { HowItWorks } from "@/components/home/how-it-works"

export default function HomePage() {
  return (
    <>
      <HeroSearch />
      <CategoriesGrid />
      <FeaturedMesters />
      <HowItWorks />
    </>
  )
}
