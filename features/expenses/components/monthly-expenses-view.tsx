"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import DeleteConfirmDialog from "@/components/custom-ui/delete-confirm-dialog";
import {
  formatCurrency,
  formatMonthLabel,
  getCurrentMonthKey,
  shiftMonth,
} from "@/lib/utils";
import {
  useDeleteExpense,
  useMonthlyExpenses,
  useUpdateExpense,
} from "../hooks/use-monthly-expenses";
import { ExpenseListItem } from "./expense-list-item";
import { ExpensesSkeleton } from "./expenses-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export function MonthlyExpensesView() {
  const t = useTranslations();
  const [month, setMonth] = useState(getCurrentMonthKey);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<string | undefined>(undefined);

  const { data, isLoading, isError, isFetching } = useMonthlyExpenses(month, activeCategoryId);
  const updateExpense = useUpdateExpense();
  const deleteExpense = useDeleteExpense();
  const categories = data?.categories ?? [];

  useEffect(() => {
    if (activeCategoryId && !categories.some((category) => category.id === activeCategoryId)) {
      setActiveCategoryId(undefined);
    }
  }, [activeCategoryId, categories]);

  const monthLabel = useMemo(() => formatMonthLabel(month), [month]);

  const deleteTargetExpense = deleteTargetId
    ? data?.expenses.find((e) => e.id === deleteTargetId)
    : null;

  return (
    <main className="min-h-screen bg-background px-4 py-6 text-text-primary">
      <div className="mx-auto w-full max-w-105 space-y-5">
        {isLoading ? (
          <ExpensesSkeleton monthLabel={monthLabel} />
        ) : (
          <section className="rounded-2xl border border-border bg-surface p-5">
            <h1 className="mb-4 text-center text-lg font-semibold">{t("expenses.title")}</h1>

            {/* Category tab strip */}
            {categories.length > 0 && (
              <div
                className="mb-4 flex gap-2 overflow-x-auto pb-1"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                <button
                  type="button"
                  onClick={() => setActiveCategoryId(undefined)}
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    activeCategoryId === undefined
                      ? "bg-magenta text-white"
                      : "border border-border bg-background text-text-secondary hover:border-magenta hover:text-text-primary"
                  }`}
                >
                  {t("expenses.allCategories")}
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategoryId(cat.id)}
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      activeCategoryId === cat.id
                        ? "bg-magenta text-white"
                        : "border border-border bg-background text-text-secondary hover:border-magenta hover:text-text-primary"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            )}

            <div className="mb-4 flex items-center justify-between gap-2">
              <Button type="button" variant="outline" onClick={() => setMonth((current) => shiftMonth(current, -1))}>
                {t("expenses.previousMonth")}
              </Button>
              <p className="text-sm font-medium capitalize">{monthLabel}</p>
              <Button type="button" variant="outline" onClick={() => setMonth((current) => shiftMonth(current, 1))}>
                {t("expenses.nextMonth")}
              </Button>
            </div>

            {isError ? (
              <p className="text-sm text-red-500">{t("expenses.failedToLoad")}</p>
            ) : (
              <>
                <div className="mb-4 flex items-center justify-between text-sm">
                  <span className="text-text-secondary">{t("expenses.totalForMonth")}</span>
                  {isFetching ? (
                    <Skeleton className="h-4 w-16 rounded" />
                  ) : (
                    <span className="font-medium tabular-nums">{formatCurrency(data?.spent ?? 0)}</span>
                  )}
                </div>

                {isFetching ? (
                  <div className="max-h-96 overflow-y-auto rounded-xl border border-border p-3">
                    <ul className="space-y-2">
                      {Array.from({ length: data?.expenses.length ?? 4 }).map((_, i) => (
                        <li key={i} className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2">
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
                      ))}
                    </ul>
                  </div>
                ) : data && data.expenses.length > 0 ? (
                  <div className="max-h-96 overflow-y-auto rounded-xl border border-border p-3">
                    <ul className="space-y-2">
                      {data.expenses.map((expense) => (
                        <ExpenseListItem
                          key={expense.id}
                          expense={expense}
                          showCategory={activeCategoryId === undefined}
                          isUpdating={
                            updateExpense.isPending && updateExpense.variables?.id === expense.id
                          }
                          isDeleting={
                            deleteExpense.isPending && deleteExpense.variables === expense.id
                          }
                          onUpdate={(payload) => updateExpense.mutate(payload)}
                          onDelete={(id) => setDeleteTargetId(id)}
                        />
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-sm text-text-secondary">{t("expenses.emptyMonth")}</p>
                )}
              </>
            )}
          </section>
        )}
      </div>

      <DeleteConfirmDialog
        title={t("expenses.deleteTitle")}
        description={t("expenses.confirmDelete")}
        itemName={deleteTargetExpense?.description}
        isOpen={deleteTargetId !== null}
        isLoading={deleteExpense.isPending}
        onOpenChange={(open) => {
          if (!open) setDeleteTargetId(null);
        }}
        onConfirm={async () => {
          if (deleteTargetId) {
            await deleteExpense.mutateAsync(deleteTargetId);
          }
        }}
      />
    </main>
  );
}
