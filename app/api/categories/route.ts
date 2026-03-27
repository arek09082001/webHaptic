import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthorizedUser, getMonthKey, getOrCreateDefaultCategory } from "@/lib/budget";

export async function GET() {
  const user = await getAuthorizedUser();

  if (!user || !("id" in user) || typeof user.id !== "string") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = user.id;
  const month = getMonthKey();

  // Auto-create default category if none exist
  await getOrCreateDefaultCategory(userId);

  const categories = await prisma.category.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      budgets: {
        where: { month },
        select: { id: true, limitAmount: true },
        take: 1,
      },
    },
  });

  const memberBudgets = await prisma.budget.findMany({
    where: {
      month,
      members: {
        some: { userId },
      },
    },
    select: {
      id: true,
      category: {
        select: {
          name: true,
        },
      },
    },
  });

  const memberBudgetIds = memberBudgets.map((budget) => budget.id);

  const spentPerBudget =
    memberBudgetIds.length > 0
      ? await prisma.expense.groupBy({
          by: ["budgetId"],
          where: {
            month,
            budgetId: { in: memberBudgetIds },
          },
          _sum: { amount: true },
        })
      : [];

  const budgetSpentMap = new Map<string, number>(
    spentPerBudget.map((row) => [row.budgetId, Number(row._sum.amount ?? 0)])
  );

  const spentByCategoryName = new Map<string, number>();

  for (const budget of memberBudgets) {
    const current = spentByCategoryName.get(budget.category.name) ?? 0;
    spentByCategoryName.set(
      budget.category.name,
      current + (budgetSpentMap.get(budget.id) ?? 0)
    );
  }

  return NextResponse.json(
    categories.map((cat) => {
      const budget = cat.budgets[0] ?? null;
      const spent = spentByCategoryName.get(cat.name) ?? 0;
      return {
        id: cat.id,
        name: cat.name,
        budget: budget
          ? { id: budget.id, limitAmount: Number(budget.limitAmount) }
          : null,
        spent,
      };
    })
  );
}

export async function POST(req: NextRequest) {
  const user = await getAuthorizedUser();

  if (!user || !("id" in user) || typeof user.id !== "string") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = user.id;
  const body = await req.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const category = await prisma.category.create({
    data: { userId, name },
    select: { id: true, name: true, createdAt: true },
  });

  return NextResponse.json(category, { status: 201 });
}
