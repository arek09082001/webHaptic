"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DeleteConfirmDialog from "@/components/custom-ui/delete-confirm-dialog";
import { formatCurrency } from "@/lib/utils";
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useSetCategoryBudget,
} from "@/features/profile/hooks/use-categories";

export function CategoriesCard() {
  const t = useTranslations();
  const { data: categories, isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();
  const setBudget = useSetCategoryBudget();

  const [newName, setNewName] = useState("");
  const [limits, setLimits] = useState<Record<string, string>>({});
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    createCategory.mutate(name, { onSuccess: () => setNewName("") });
  }

  function handleSetLimit(categoryId: string) {
    const value = Number(limits[categoryId]);
    if (!value || value <= 0) return;
    setBudget.mutate(
      { categoryId, limitAmount: value },
      { onSuccess: () => setLimits((prev) => ({ ...prev, [categoryId]: "" })) }
    );
  }

  return (
    <section className="rounded-2xl border border-border bg-surface p-5">
      <h2 className="mb-1 text-lg font-semibold">{t("profile.categories")}</h2>
      <p className="mb-4 text-sm text-text-secondary">{t("profile.categoriesSubtitle")}</p>

      {/* Create category form */}
      <form onSubmit={handleCreate} className="mb-5 flex gap-2">
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder={t("profile.categoryNamePlaceholder")}
          maxLength={50}
          className="flex-1"
        />
        <Button type="submit" disabled={createCategory.isPending || !newName.trim()}>
          {t("profile.createCategory")}
        </Button>
      </form>

      {/* Category list */}
      {isLoading ? (
        <p className="text-sm text-text-secondary">{t("common.loading")}</p>
      ) : !categories?.length ? (
        <p className="text-sm text-text-secondary">{t("profile.noCategories")}</p>
      ) : (
        <ul className="space-y-4">
          {categories.map((cat) => (
            <li key={cat.id} className="rounded-xl border border-border bg-background p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <div>
                  <p className="font-medium text-text-primary">{cat.name}</p>
                  <p className="text-xs text-text-secondary">
                    {cat.budget
                      ? `${t("profile.currentLimit")}: ${formatCurrency(cat.budget.limitAmount)}`
                      : t("profile.noLimit")}
                  </p>
                </div>
                <button
                  onClick={() => setDeleteTarget({ id: cat.id, name: cat.name })}
                  className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-surface-hover hover:text-red-400"
                  aria-label={t("common.delete")}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Set limit inline */}
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={limits[cat.id] ?? ""}
                  onChange={(e) =>
                    setLimits((prev) => ({ ...prev, [cat.id]: e.target.value }))
                  }
                  min="0.01"
                  step="0.01"
                  inputMode="decimal"
                  placeholder={t("dashboard.limitPlaceholder")}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSetLimit(cat.id)}
                  disabled={setBudget.isPending || !limits[cat.id]}
                >
                  {t("dashboard.saveLimit")}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Delete confirmation */}
      <DeleteConfirmDialog
        title={t("expenses.deleteTitle")}
        description={t("profile.deleteCategoryWarning")}
        itemName={deleteTarget?.name}
        isOpen={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        isLoading={deleteCategory.isPending}
        onConfirm={() =>
          deleteTarget
            ? deleteCategory.mutateAsync(deleteTarget.id).then(() => setDeleteTarget(null))
            : Promise.resolve()
        }
      />
    </section>
  );
}
