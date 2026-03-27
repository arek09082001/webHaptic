import { Skeleton } from "@/components/ui/skeleton";

function ExpenseItemSkeleton() {
  return (
    <li className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2">
      <div className="min-w-0 space-y-1.5">
        <Skeleton className="h-4 w-36 rounded" />
        <Skeleton className="h-3 w-20 rounded" />
        <Skeleton className="h-3 w-24 rounded" />
      </div>
      <div className="ml-3 flex shrink-0 items-center gap-2">
        <Skeleton className="h-4 w-14 rounded" />
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
    </li>
  );
}

interface ExpensesSkeletonProps {
  monthLabel: string;
}

export function ExpensesSkeleton({ monthLabel }: ExpensesSkeletonProps) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5">
      {/* Title */}
      <Skeleton className="mx-auto mb-4 h-6 w-32 rounded-lg" />

      {/* Category filter tabs */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        <Skeleton className="h-7 w-14 rounded-full" />
        <Skeleton className="h-7 w-20 rounded-full" />
        <Skeleton className="h-7 w-24 rounded-full" />
      </div>

      {/* Month navigation — keep real buttons so layout is stable */}
      <div className="mb-4 flex items-center justify-between gap-2">
        <Skeleton className="h-10 w-28 rounded-md" />
        <p className="text-sm font-medium capitalize">{monthLabel}</p>
        <Skeleton className="h-10 w-28 rounded-md" />
      </div>

      {/* Total row */}
      <div className="mb-4 flex items-center justify-between text-sm">
        <Skeleton className="h-4 w-28 rounded" />
        <Skeleton className="h-4 w-16 rounded" />
      </div>

      {/* Expense items list */}
      <div className="max-h-96 overflow-y-auto rounded-xl border border-border p-3">
        <ul className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <ExpenseItemSkeleton key={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
