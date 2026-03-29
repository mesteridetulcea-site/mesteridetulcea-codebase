import { HeroSearch } from "@/components/home/hero-search"
import { StatsBand } from "@/components/home/stats-band"
import { CategoriesGrid } from "@/components/home/categories-grid"
import { WhyUs } from "@/components/home/why-us"
import { FeaturedMesters } from "@/components/home/featured-mesters"
import { HowItWorks } from "@/components/home/how-it-works"
import { CtaSection } from "@/components/home/cta-section"

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Meșteri de Tulcea",
  description:
    "Platformă care conectează locuitorii din Tulcea cu meșteri de încredere — electricieni, instalatori, zidari, zugravi și mulți alții.",
  url: "https://mesteridetulcea.ro",
  areaServed: {
    "@type": "City",
    name: "Tulcea",
    addressCountry: "RO",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Tulcea",
    addressCountry: "RO",
  },
  "@id": "https://mesteridetulcea.ro",
  sameAs: [],
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
