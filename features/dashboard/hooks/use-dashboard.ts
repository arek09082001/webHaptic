import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DASHBOARD_KEY, MONTHLY_EXPENSES_KEY } from "@/lib/query-keys";
import type { DashboardData } from "../types";

export { DASHBOARD_KEY };

export const CATEGORIES_KEY = ["categories"] as const;

// ── Fetch ──────────────────────────────────────────────────────────────────

async function fetchDashboard(): Promise<DashboardData> {
  const res = await fetch("/api/dashboard");
  if (!res.ok) throw new Error("Failed to load dashboard");
  return res.json();
}

export function useDashboard() {
  return useQuery<DashboardData>({
    queryKey: DASHBOARD_KEY,
    queryFn: fetchDashboard,
  });
}

// ── Set category limit ─────────────────────────────────────────────────────

async function setCategoryLimit({
  categoryId,
  limitAmount,
}: {
  categoryId: string;
  limitAmount: number;
}) {
  const res = await fetch(`/api/categories/${categoryId}/budget`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ limitAmount }),
  });
  if (!res.ok) throw new Error("Failed to set limit");
  return res.json();
}

export function useSetCategoryLimit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setCategoryLimit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEY });
    },
  });
}

// ── Add expense ────────────────────────────────────────────────────────────

async function addExpense(data: {
  amount: number;
  description: string;
  categoryId: string;
}) {
  const res = await fetch("/api/expenses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to add expense");
  return res.json();
}

export function useAddExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEY });
      queryClient.invalidateQueries({ queryKey: MONTHLY_EXPENSES_KEY });
    },
  });
}

// ── Accept invitation ─────────────────────────────────────────────────────

async function acceptInvitation(invitationId: string) {
  const res = await fetch(`/api/budget/invitations/${invitationId}/accept`, {
    method: "POST",
  });

  if (!res.ok) {
    throw new Error("Failed to accept invitation");
  }

  return res.json();
}

export function useAcceptInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: acceptInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEY });
    },
  });
}
