"use client";

import { useTranslations } from "next-intl";
import { ProgressRing } from "@/components/progress-ring";

interface DashboardSummaryCardProps {
  month: string;
  spent: number;
  monthlyLimit: number;
  remaining: number;
  progress: number;
}

export function DashboardSummaryCard({
  month,
  spent,
  monthlyLimit,
  remaining,
  progress,
}: DashboardSummaryCardProps) {
  const t = useTranslations();

  return (
    <section className="rounded-2xl border border-border bg-surface p-5">
      <h1 className="mb-4 text-center text-lg font-semibold">{t("dashboard.title")}</h1>
      <ProgressRing
        spent={spent}
        limit={monthlyLimit}
        remaining={remaining}
        progress={progress}
      />
      <p className="mt-4 text-center text-sm text-text-secondary">{month}</p>
    </section>
  );
}
