import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DASHBOARD_KEY } from "@/features/dashboard/hooks/use-dashboard";

export const CATEGORIES_KEY = ["categories"] as const;

export interface Category {
  id: string;
  name: string;
  budget: { id: string; limitAmount: number } | null;
  spent: number;
}

async function fetchCategories(): Promise<Category[]> {
  const res = await fetch("/api/categories");
  if (!res.ok) throw new Error("Failed to load categories");
  return res.json();
}

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: CATEGORIES_KEY,
    queryFn: fetchCategories,
  });
}

async function createCategory(name: string) {
  const res = await fetch("/api/categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error("Failed to create category");
  return res.json();
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEY });
    },
  });
}

async function deleteCategory(categoryId: string) {
  const res = await fetch(`/api/categories/${categoryId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete category");
  return res.json();
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEY });
    },
  });
}

async function setCategoryBudget({
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
  if (!res.ok) throw new Error("Failed to set budget");
  return res.json();
}

export function useSetCategoryBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setCategoryBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEY });
    },
  });
}
