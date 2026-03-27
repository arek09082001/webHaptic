"use client";

import { useTranslations } from "next-intl";
import { ProgressRing } from "@/components/progress-ring";
import type { CategoryData } from "@/features/dashboard/types";

interface CategorySlideProps {
  category: CategoryData;
  month: string;
}

export function CategorySlide({ category, month }: CategorySlideProps) {
  const t = useTranslations();
  const limit = category.budget?.limitAmount ?? 0;
  const spent = category.spent;
  const remaining = limit - spent;
  const progress = limit > 0 ? (spent / limit) * 100 : 0;

  return (
    <section className="rounded-2xl border border-border bg-surface p-5">
      <h1 className="mb-1 text-center text-lg font-semibold">{category.name}</h1>
      <p className="mb-4 text-center text-xs text-text-muted">{month}</p>

      {limit > 0 ? (
        <ProgressRing spent={spent} limit={limit} remaining={remaining} progress={progress} />
      ) : (
        <div className="mx-auto flex h-55 w-55 items-center justify-center rounded-full border-2 border-dashed border-border">
          <p className="px-4 text-center text-sm text-text-secondary">
            {t("dashboard.setLimitHint")}
          </p>
        </div>
      )}
    </section>
  );
}
