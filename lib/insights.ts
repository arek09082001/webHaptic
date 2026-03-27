export interface InsightTransaction {
  amount: number;
  categoryName: string;
  expenseName: string;
}

export type InsightData =
  | { type: "topCategory"; category: string; amount: number }
  | { type: "percentChange"; category: string; changePercent: number }
  | { type: "largestExpense"; amount: number; expenseName: string };

function groupByCategory(transactions: InsightTransaction[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const tx of transactions) {
    map.set(tx.categoryName, (map.get(tx.categoryName) ?? 0) + tx.amount);
  }
  return map;
}

export function generateInsights(
  current: InsightTransaction[],
  previous: InsightTransaction[]
): InsightData[] {
  const insights: InsightData[] = [];

  if (current.length === 0) return insights;

  const currentByCategory = groupByCategory(current);
  const previousByCategory = groupByCategory(previous);

  // Top category (highest total spend)
  let topCategory = "";
  let topAmount = 0;
  for (const [cat, amount] of currentByCategory) {
    if (amount > topAmount) {
      topAmount = amount;
      topCategory = cat;
    }
  }
  if (topCategory) {
    insights.push({ type: "topCategory", category: topCategory, amount: topAmount });
  }

  // Percentage change per category (only when previous data exists)
  if (previous.length > 0) {
    for (const [cat, currentAmount] of currentByCategory) {
      const prevAmount = previousByCategory.get(cat);
      if (prevAmount !== undefined && prevAmount > 0) {
        const changePercent = ((currentAmount - prevAmount) / prevAmount) * 100;
        insights.push({ type: "percentChange", category: cat, changePercent });
      }
    }
  }

  // Largest single transaction
  let largestAmount = 0;
  let largestExpenseName = "";
  for (const tx of current) {
    if (tx.amount > largestAmount) {
      largestAmount = tx.amount;
      largestExpenseName = tx.expenseName;
    }
  }
  if (largestExpenseName) {
    insights.push({
      type: "largestExpense",
      amount: largestAmount,
      expenseName: largestExpenseName,
    });
  }

  return insights;
}
