export interface ForecastResult {
  predictedTotal: number;
  averageDaily: number;
  /** Amount over budget (when predicted spend exceeds the monthly budget). */
  overBy?: number;
  /** Day of month when the budget is estimated to run out (if applicable). */
  estimatedRunOutDay?: number;
}

export function generateForecast(
  totalSpent: number,
  monthlyBudget: number,
  currentDate: Date = new Date()
): ForecastResult {
  const daysPassed = currentDate.getDate();
  const totalDays = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  if (daysPassed === 0 || totalSpent === 0) {
    return { predictedTotal: 0, averageDaily: 0 };
  }

  const averageDaily = totalSpent / daysPassed;
  const predictedTotal = averageDaily * totalDays;

  const result: ForecastResult = { predictedTotal, averageDaily };

  if (monthlyBudget > 0 && predictedTotal > monthlyBudget) {
    result.overBy = predictedTotal - monthlyBudget;

    const estimatedRunOutDay = Math.round(monthlyBudget / averageDaily);
    if (estimatedRunOutDay <= totalDays) {
      result.estimatedRunOutDay = estimatedRunOutDay;
    }
  }

  return result;
}
