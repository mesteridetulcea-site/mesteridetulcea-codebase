import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <>
      {/* Breadcrumb skeleton */}
      <div className="bg-[#0f0b04] border-b border-[#584528] py-4">
        <div className="container">
          <Skeleton className="h-4 w-32" />
        </div>
      </div>

      <div className="container py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero skeleton */}
            <div className="flex flex-col sm:flex-row gap-6">
              <Skeleton className="w-32 h-32 sm:w-40 sm:h-40 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
                <div className="flex flex-wrap gap-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </div>
            </div>

            {/* Description skeleton */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-24" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>

            {/* Tabs skeleton */}
            <div className="space-y-4">
              <div className="flex gap-4 border-b">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-28" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-square rounded-lg" />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar skeleton */}
          <div>
            <Card>
              <CardContent className="pt-6 space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <div className="py-4">
                  <Skeleton className="h-px w-full" />
                </div>
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
