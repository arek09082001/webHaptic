"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useCategories, useSetCategoryBudget } from "@/features/profile/hooks/use-categories";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function BudgetSettingsCard() {
  const t = useTranslations();
  const { data: categories } = useCategories();
  const setBudget = useSetCategoryBudget();
  const [limit, setLimitValue] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Use the first category as the default target for this legacy card
  const defaultCategory = categories?.[0] ?? null;
  const currentLimit = defaultCategory?.budget?.limitAmount ?? null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = Number(limit);
    if (isNaN(value) || value <= 0 || !defaultCategory) return;

    setBudget.mutate(
      { categoryId: defaultCategory.id, limitAmount: value },
      {
        onSuccess: () => {
          setLimitValue("");
          setShowForm(false);
        },
      }
    );
  }

  return (
    <section className="rounded-2xl border border-border bg-surface p-5">
      <h2 className="mb-1 text-lg font-semibold">{t("profile.budgetSettings")}</h2>
      <p className="mb-4 text-sm text-text-secondary">{t("profile.budgetSettingsSubtitle")}</p>

      <div className="mb-3 text-sm">
        <span className="text-text-secondary">{t("profile.currentLimit")}: </span>
        <span className="font-medium">
          {currentLimit != null ? `${currentLimit} €` : t("profile.noLimit")}
        </span>
      </div>

      {showForm ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            name="limit"
            type="number"
            value={limit}
            onChange={(e) => setLimitValue(e.target.value)}
            inputMode="decimal"
            enterKeyHint="done"
            min="0.01"
            step="0.01"
            placeholder={t("dashboard.limitPlaceholder")}
            required
          />
          <div className="flex gap-2">
            <Button type="submit" className="flex-1" disabled={setBudget.isPending}>
              {setBudget.isPending ? t("dashboard.saving") : t("dashboard.saveLimit")}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowForm(false);
                setLimitValue("");
              }}
            >
              {t("common.cancel")}
            </Button>
          </div>
        </form>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => setShowForm(true)}
        >
          {t("profile.changeLimit")}
        </Button>
      )}
    </section>
  );
}
