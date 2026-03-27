"use client";

import { useTranslations } from "next-intl";
import { formatCurrency } from "@/lib/utils";

interface ProgressRingProps {
  spent: number;
  limit: number;
  remaining: number;
  progress: number;
}

export function ProgressRing({ spent, limit, remaining, progress }: ProgressRingProps) {
  const t = useTranslations();
  const size = 220;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(progress, 100) / 100) * circumference;

  return (
    <div className="relative mx-auto flex h-55 w-55 items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-border"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: offset }}
          className="text-magenta transition-[stroke-dashoffset] duration-500 ease-in-out"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-center">
        <p className="text-xs text-text-secondary">{t('dashboard.progress.spent')}</p>
        <p className="text-base font-semibold text-text-primary">{formatCurrency(spent)}</p>

        <p className="mt-1 text-xs text-text-secondary">{t('dashboard.progress.limit')}</p>
        <p className="text-sm text-text-primary">{formatCurrency(limit)}</p>

        <p className="mt-1 text-xs text-text-secondary">{t('dashboard.progress.remaining')}</p>
        <p className="text-sm text-text-primary">{formatCurrency(remaining)}</p>
      </div>
    </div>
  );
}