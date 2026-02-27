import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="space-y-16 py-8">
      {/* Hero skeleton */}
      <section className="container text-center py-12">
        <Skeleton className="h-12 w-96 mx-auto mb-4" />
        <Skeleton className="h-6 w-[500px] mx-auto mb-8" />
        <Skeleton className="h-12 w-full max-w-xl mx-auto rounded-full" />
      </section>

      {/* Categories skeleton */}
      <section className="container">
        <Skeleton className="h-8 w-48 mx-auto mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6 text-center">
                <Skeleton className="w-12 h-12 rounded-full mx-auto mb-3" />
                <Skeleton className="h-5 w-24 mx-auto" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured mesters skeleton */}
      <section className="container">
        <Skeleton className="h-8 w-48 mx-auto mb-8" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <div className="aspect-[16/10] relative">
                <Skeleton className="absolute inset-0" />
              </div>
              <CardContent className="pt-6">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-24 mb-3" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works skeleton */}
      <section className="container">
        <Skeleton className="h-8 w-48 mx-auto mb-8" />
        <div className="grid md:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="text-center">
              <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
              <Skeleton className="h-6 w-32 mx-auto mb-2" />
              <Skeleton className="h-4 w-48 mx-auto" />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
