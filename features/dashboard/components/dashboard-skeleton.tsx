import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-background px-4 py-6 text-text-primary md:min-h-screen">
      <div className="mx-auto w-full max-w-105 space-y-5">
        {/* Summary card skeleton */}
        <section className="rounded-2xl border border-border bg-surface p-5">
          {/* Title */}
          <Skeleton className="mx-auto mb-4 h-6 w-40 rounded-lg" />

          {/* Progress ring */}
          <div className="relative mx-auto flex h-55 w-55 items-center justify-center">
            {/* Outer ring track */}
            <Skeleton className="h-55 w-55 rounded-full" />
            {/* Inner hole */}
            <div className="absolute inset-0 m-auto flex h-44 w-44 flex-col items-center justify-center gap-1 rounded-full bg-surface text-center">
              <Skeleton className="h-3 w-10 rounded" />
              <Skeleton className="h-5 w-20 rounded" />
              <Skeleton className="mt-1 h-3 w-10 rounded" />
              <Skeleton className="h-4 w-16 rounded" />
              <Skeleton className="mt-1 h-3 w-16 rounded" />
              <Skeleton className="h-4 w-16 rounded" />
            </div>
          </div>

          {/* Month label */}
          <Skeleton className="mx-auto mt-4 h-4 w-24 rounded" />
        </section>

        {/* Form card skeleton */}
        <section className="rounded-2xl border border-border bg-surface p-4">
          <Skeleton className="mb-3 h-4 w-32 rounded" />
          <div className="space-y-3">
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </section>
      </div>
    </main>
  );
}
