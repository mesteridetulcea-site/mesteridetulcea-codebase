export default function Loading() {
  return (
    <>
      {/* Hero skeleton */}
      <div className="relative bg-[#0d0905] -mt-[62px] flex items-end" style={{ minHeight: 420 }}>
        <div className="container relative z-10 pb-14 pt-[96px] flex flex-col items-center">
          <div className="flex items-center gap-5 mb-8">
            <div className="h-px w-16 bg-primary/15" />
            <div className="w-1.5 h-1.5 bg-primary/20 rotate-45" />
            <div className="h-px w-16 bg-primary/15" />
          </div>
          <div className="w-28 h-2.5 bg-white/[0.05] animate-pulse mb-4" />
          <div className="w-80 h-12 bg-white/[0.04] animate-pulse mb-4" />
          <div className="w-48 h-2 bg-white/[0.03] animate-pulse" />
        </div>
      </div>

      {/* Filter bar skeleton */}
      <div className="bg-[#0d0905]/96 border-b border-[#3d2e14] py-3">
        <div className="container flex flex-col gap-3">
          <div className="flex gap-2">
            <div className="flex-1 h-9 bg-white/[0.05] animate-pulse" />
            <div className="w-52 h-9 bg-white/[0.04] animate-pulse hidden sm:block" />
          </div>
          <div className="flex gap-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-7 w-20 bg-white/[0.04] animate-pulse" />
            ))}
          </div>
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="bg-white py-10">
        <div className="container">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-6 h-px bg-[#584528]/20" />
            <div className="w-28 h-2.5 bg-[#584528]/10 animate-pulse" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#584528]/12">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white">
                <div className="aspect-[4/3] bg-[#f5f0e8] animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-[#ede8de] animate-pulse w-3/4" />
                  <div className="h-3 bg-[#f5f0e8] animate-pulse w-1/3" />
                  <div className="flex gap-3 pt-1">
                    <div className="h-3 bg-[#f5f0e8] animate-pulse w-16" />
                    <div className="h-3 bg-[#f5f0e8] animate-pulse w-12" />
                  </div>
                </div>
                <div className="px-5 pb-5">
                  <div className="h-9 bg-[#f5f0e8]/60 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
