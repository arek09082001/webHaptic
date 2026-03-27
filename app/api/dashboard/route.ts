import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getAuthorizedUser,
  getMonthKey,
  getOrCreateDefaultCategory,
} from "@/lib/budget";

export async function GET() {
  const user = await getAuthorizedUser();

  if (!user || !("id" in user) || typeof user.id !== "string") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = user.id;
  const month = getMonthKey();

  // Auto-create default category if none exist
  await getOrCreateDefaultCategory(userId);

  // Fetch all categories for this user with their current-month budget
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

  // Pending invitations received by this user
  const pendingInvitationsForMe = await prisma.budgetInvitation.findMany({
    where: {
      email: user.email?.toLowerCase(),
      status: "PENDING",
    },
    select: {
      id: true,
      email: true,
      createdAt: true,
      budget: {
        select: {
          month: true,
          user: {
            select: { email: true, name: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    month,
    categories: categories.map((cat) => {
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
    }),
    pendingInvitationsForMe,
  });
}

