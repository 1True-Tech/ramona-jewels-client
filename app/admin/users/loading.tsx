import { AdminLayout } from "@/components/admin/admin-layout"

export default function Loading() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="h-8 w-32 bg-muted rounded animate-pulse" />
            <div className="h-4 w-64 bg-muted rounded animate-pulse mt-2" />
          </div>
          <div className="h-10 w-32 bg-muted rounded animate-pulse" />
        </div>

        {/* Stats cards skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-card rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                  <div className="h-6 w-12 bg-muted rounded animate-pulse" />
                </div>
                <div className="h-8 w-8 bg-muted rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        {/* Filters skeleton */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="h-10 flex-1 bg-muted rounded animate-pulse" />
          <div className="h-10 w-32 bg-muted rounded animate-pulse" />
          <div className="h-10 w-32 bg-muted rounded animate-pulse" />
        </div>

        {/* Table skeleton */}
        <div className="bg-card rounded-lg border overflow-hidden">
          <div className="p-4 border-b">
            <div className="h-6 w-full bg-muted rounded animate-pulse" />
          </div>
          <div className="space-y-4 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-10 w-10 bg-muted rounded-full animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                  <div className="h-3 w-48 bg-muted rounded animate-pulse" />
                </div>
                <div className="h-6 w-16 bg-muted rounded animate-pulse" />
                <div className="flex gap-2">
                  <div className="h-8 w-8 bg-muted rounded animate-pulse" />
                  <div className="h-8 w-8 bg-muted rounded animate-pulse" />
                  <div className="h-8 w-8 bg-muted rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}