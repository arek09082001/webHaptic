"use client";

import { useTranslations } from "next-intl";
import { TrendingUp, AlertTriangle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { ForecastResult } from "@/lib/forecast";

interface ForecastPanelProps {
  forecast: ForecastResult;
}

export function ForecastPanel({ forecast }: ForecastPanelProps) {
  const t = useTranslations();
  const { predictedTotal, averageDaily, overBy, estimatedRunOutDay } = forecast;

  return (
    <section className="rounded-2xl border border-border bg-surface p-4">
      <h2 className="mb-3 flex items-center gap-2 text-sm font-medium text-text-secondary">
        <TrendingUp className="h-4 w-4 text-blue-500" />
        {t("forecast.title")}
      </h2>

      <div className="space-y-2">
        <div className="flex items-center justify-between rounded-lg bg-background px-3 py-2 text-sm">
          <span className="text-text-secondary">{t("forecast.predictedTotal")}</span>
          <span className="font-semibold text-text-primary">
            {formatCurrency(predictedTotal)}
          </span>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-background px-3 py-2 text-sm">
          <span className="text-text-secondary">{t("forecast.dailyAverage")}</span>
          <span className="font-semibold text-text-primary">
            {formatCurrency(averageDaily)}
          </span>
        </div>

        {overBy !== undefined && (
          <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-500">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{t("forecast.warning", { amount: formatCurrency(overBy) })}</span>
          </div>
        )}

        {estimatedRunOutDay && (
          <div className="flex items-center justify-between rounded-lg bg-background px-3 py-2 text-sm">
            <span className="text-text-secondary">{t("forecast.runOutDay")}</span>
            <span className="font-semibold text-red-500">
              {t("forecast.runOutDayValue", { day: estimatedRunOutDay })}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
