import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DASHBOARD_KEY, MONTHLY_EXPENSES_KEY } from "@/lib/query-keys";
import type { MonthlyExpensesData } from "../types";

export { MONTHLY_EXPENSES_KEY };

async function fetchMonthlyExpenses(month: string, categoryId?: string): Promise<MonthlyExpensesData> {
  const params = new URLSearchParams({ month });
  if (categoryId) params.set("categoryId", categoryId);
  const res = await fetch(`/api/expenses?${params.toString()}`);

  if (!res.ok) {
    throw new Error("Failed to load monthly expenses");
  }

  return res.json();
}

export function useMonthlyExpenses(month: string, categoryId?: string) {
  return useQuery<MonthlyExpensesData>({
    queryKey: [...MONTHLY_EXPENSES_KEY, month, categoryId ?? "all"],
    queryFn: () => fetchMonthlyExpenses(month, categoryId),
  });
}

async function updateExpense(payload: {
  id: string;
  amount: number;
  description: string;
}) {
  const res = await fetch(`/api/expenses/${payload.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      amount: payload.amount,
      description: payload.description,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to update expense");
  }

  return res.json();
}

async function deleteExpense(id: string) {
  const res = await fetch(`/api/expenses/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete expense");
  }

  return res.json();
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MONTHLY_EXPENSES_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEY });
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MONTHLY_EXPENSES_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEY });
    },
  });
}
