"use client";

import { useTranslations } from "next-intl";
import { Lightbulb } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { InsightData } from "@/lib/insights";

interface InsightsPanelProps {
  insights: InsightData[];
}

export function InsightsPanel({ insights }: InsightsPanelProps) {
  const t = useTranslations();

  if (insights.length === 0) return null;

  function formatInsight(insight: InsightData): string {
    switch (insight.type) {
      case "topCategory":
        return t("insights.topCategory", {
          category: insight.category,
          amount: formatCurrency(insight.amount),
        });
      case "percentChange":
        if (insight.changePercent >= 0) {
          return t("insights.percentMore", {
            percent: Math.abs(Math.round(insight.changePercent)),
            category: insight.category,
          });
        }
        return t("insights.percentLess", {
          percent: Math.abs(Math.round(insight.changePercent)),
          category: insight.category,
        });
      case "largestExpense":
        return t("insights.largestExpense", {
          amount: formatCurrency(insight.amount),
          expenseName: insight.expenseName,
        });
    }
  }

  return (
    <section className="rounded-2xl border border-border bg-surface p-4">
      <h2 className="mb-3 flex items-center gap-2 text-sm font-medium text-text-secondary">
        <Lightbulb className="h-4 w-4 text-yellow-500" />
        {t("insights.title")}
      </h2>
      <ul className="space-y-2">
        {insights.map((insight, i) => (
          <li
            key={i}
            className="rounded-lg bg-background px-3 py-2 text-sm text-text-primary"
          >
            {formatInsight(insight)}
          </li>
        ))}
      </ul>
    </section>
  );
}
