import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthorizedUser, getMonthKey } from "@/lib/budget";

function isValidMonthKey(value: string) {
  return /^\d{4}-(0[1-9]|1[0-2])$/.test(value);
}

export async function GET(req: NextRequest) {
  const user = await getAuthorizedUser();

  if (!user || !("id" in user) || typeof user.id !== "string") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = user.id;
  const requestedMonth = req.nextUrl.searchParams.get("month");
  const month =
    requestedMonth && isValidMonthKey(requestedMonth) ? requestedMonth : getMonthKey();

  // Find all budgets the user is a member of for this month
  const memberBudgets = await prisma.budget.findMany({
    where: {
      month,
      members: { some: { userId } },
    },
    select: { id: true },
  });

  if (memberBudgets.length === 0) {
    return NextResponse.json({ month, expenses: [] });
  }

  const budgetIds = memberBudgets.map((b) => b.id);

  // Fetch all expenses for those budgets — includes every budget member's spend
  const expenses = await prisma.expense.findMany({
    where: { month, budgetId: { in: budgetIds } },
    select: {
      amount: true,
      description: true,
      category: { select: { name: true } },
    },
  });

  return NextResponse.json({
    month,
    expenses: expenses.map((e) => ({
      amount: Number(e.amount),
      expenseName: e.description,
      categoryName: e.category?.name ?? "",
    })),
  });
}
