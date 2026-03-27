import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDashboard } from "@/features/dashboard/hooks/use-dashboard";
import { generateInsights, type InsightData, type InsightTransaction } from "@/lib/insights";
import { generateForecast, type ForecastResult } from "@/lib/forecast";
import { getCurrentMonthKey, shiftMonth } from "@/lib/utils";

interface InsightsApiData {
  month: string;
  expenses: InsightTransaction[];
}

interface RawInsightsApiExpense {
  amount: number;
  categoryName: string;
  expenseName?: string;
  description?: string;
}

interface RawInsightsApiData {
  month: string;
  expenses: RawInsightsApiExpense[];
}

async function fetchInsightsData(month: string): Promise<InsightsApiData> {
  const res = await fetch(`/api/insights?month=${month}`);
  if (!res.ok) throw new Error("Failed to load insights data");
  const raw = (await res.json()) as RawInsightsApiData;

  return {
    month: raw.month,
    expenses: (raw.expenses ?? []).map((expense) => ({
      amount: Number(expense.amount),
      categoryName: expense.categoryName ?? "",
      expenseName: expense.expenseName ?? expense.description ?? "",
    })),
  };
}

export function useInsightsForecast(): {
  insights: InsightData[];
  forecast: ForecastResult | null;
} {
  const currentMonth = getCurrentMonthKey();
  const prevMonth = shiftMonth(currentMonth, -1);

  const { data: dashboard } = useDashboard();

  const { data: currentInsightsData } = useQuery<InsightsApiData>({
    queryKey: ["insights", currentMonth],
    queryFn: () => fetchInsightsData(currentMonth),
  });

  const { data: prevInsightsData } = useQuery<InsightsApiData>({
    queryKey: ["insights", prevMonth],
    queryFn: () => fetchInsightsData(prevMonth),
  });

  const totalBudget = useMemo(
    () =>
      dashboard?.categories.reduce(
        (sum, cat) => sum + (cat.budget?.limitAmount ?? 0),
        0
      ) ?? 0,
    [dashboard]
  );

  // Use dashboard's category spent totals — already budget-scoped (all members)
  const totalSpent = useMemo(
    () => dashboard?.categories.reduce((sum, cat) => sum + cat.spent, 0) ?? 0,
    [dashboard]
  );

  const insights = useMemo(() => {
    const current = currentInsightsData?.expenses ?? [];
    const previous = prevInsightsData?.expenses ?? [];
    return generateInsights(current, previous);
  }, [currentInsightsData, prevInsightsData]);

  const forecast = useMemo(() => {
    if (totalSpent === 0 && totalBudget === 0) return null;
    return generateForecast(totalSpent, totalBudget);
  }, [totalSpent, totalBudget]);

  return { insights, forecast };
}

