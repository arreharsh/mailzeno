import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LogsLoading() {
  return (
    <div className="px-4 sm:px-6 py-6 sm:py-10 max-w-6xl mx-auto w-full space-y-6 sm:space-y-8">
      {/* Back button skeleton */}
      <Skeleton className="h-8 w-20 rounded-lg" />

      {/* Header skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-4 w-52" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-16 rounded-full" />
          <Skeleton className="h-9 w-16 rounded-full" />
          <Skeleton className="h-9 w-20 rounded-full" />
        </div>
      </div>

      {/* Desktop table skeleton */}
      <Card className="rounded-2xl border border-border/60 overflow-hidden hidden md:block">
        <div className="border-b bg-muted/30 px-6 py-3.5 flex gap-8">
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="h-3.5 w-40 flex-1" />
          <Skeleton className="h-3.5 w-16" />
          <Skeleton className="h-3.5 w-28" />
        </div>
        <CardContent className="p-0">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-8 px-6 py-4 border-b last:border-0"
            >
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-48 flex-1" />
              <Skeleton className="h-6 w-14 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Mobile list skeleton */}
      <div className="md:hidden space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="rounded-xl border border-border/60">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-6 w-14 rounded-full" />
              </div>
              <Skeleton className="h-3.5 w-56" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="flex items-center justify-center gap-3 pt-2">
        <Skeleton className="h-9 w-24 rounded-lg" />
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-9 w-16 rounded-lg" />
      </div>
    </div>
  );
}
