import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export function getMonthKey() {
  return new Date().toISOString().slice(0, 7);
}

export async function getAuthorizedUser() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user || !("id" in user) || typeof user.id !== "string") {
    return null;
  }

  return user;
}

export async function getActiveBudgetForUser(userId: string, month: string, categoryId?: string) {
  const membership = await prisma.budgetMember.findFirst({
    where: {
      userId,
      budget: {
        month,
        ...(categoryId ? { categoryId } : {}),
      },
    },
    orderBy: { createdAt: "asc" },
    select: {
      budget: {
        select: {
          id: true,
          month: true,
          limitAmount: true,
          userId: true,
          categoryId: true,
        },
      },
    },
  });

  return membership?.budget ?? null;
}

export async function getOrCreateDefaultCategory(userId: string) {
  const existing = await prisma.category.findFirst({
    where: { userId },
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true },
  });

  if (existing) return existing;

  return prisma.category.create({
    data: { userId, name: "Freizeit" },
    select: { id: true, name: true },
  });
}

export async function getCarryoverBalanceBeforeMonth(userId: string, month: string) {
  const previousMemberships = await prisma.budgetMember.findMany({
    where: {
      userId,
      budget: {
        month: { lt: month },
      },
    },
    select: {
      budget: {
        select: {
          id: true,
          limitAmount: true,
        },
      },
    },
  });

  if (previousMemberships.length === 0) {
    return 0;
  }

  const budgetIds = previousMemberships.map((membership) => membership.budget.id);

  const spentPerBudget = await prisma.expense.groupBy({
    by: ["budgetId"],
    where: {
      budgetId: { in: budgetIds },
    },
    _sum: {
      amount: true,
    },
  });

  const spentMap = new Map<string, number>(
    spentPerBudget.map((row) => [row.budgetId, Number(row._sum.amount ?? 0)])
  );

  return previousMemberships.reduce((total, membership) => {
    const baseLimit = Number(membership.budget.limitAmount);
    const spent = spentMap.get(membership.budget.id) ?? 0;
    return total + (baseLimit - spent);
  }, 0);
}
