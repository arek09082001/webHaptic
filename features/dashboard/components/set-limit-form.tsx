"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SetLimitFormProps {
  isPending: boolean;
  categoryId: string;
  onSubmit: (payload: { categoryId: string; limitAmount: number }) => void;
}

export function SetLimitForm({ isPending, categoryId, onSubmit }: SetLimitFormProps) {
  const t = useTranslations();
  const [limit, setLimit] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = Number(limit);
    if (!value || value <= 0) return;

    onSubmit({ categoryId, limitAmount: value });
    setLimit("");
  }

  return (
    <section className="rounded-2xl border border-border bg-surface p-4">
      <h2 className="mb-3 text-sm font-medium text-text-secondary">{t("dashboard.setMonthlyLimit")}</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          name="limit"
          type="number"
          value={limit}
          onChange={(event) => setLimit(event.target.value)}
          inputMode="decimal"
          enterKeyHint="done"
          min="0.01"
          step="0.01"
          placeholder={t("dashboard.limitPlaceholder")}
          required
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? t("dashboard.saving") : t("dashboard.saveLimit")}
        </Button>
      </form>
    </section>
  );
}
