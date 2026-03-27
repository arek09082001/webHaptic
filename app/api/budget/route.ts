import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getActiveBudgetForUser,
  getAuthorizedUser,
  getMonthKey,
  getOrCreateDefaultCategory,
} from "@/lib/budget";

export async function POST(req: NextRequest) {
  const user = await getAuthorizedUser();

  if (!user || !("id" in user) || typeof user.id !== "string") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = user.id;
  const month = getMonthKey();

  const body = await req.json();
  const limitAmount = Number(body.limitAmount);

  if (!Number.isFinite(limitAmount) || limitAmount <= 0) {
    return NextResponse.json({ error: "Invalid limitAmount" }, { status: 400 });
  }

  // Use the default category (or create it) when no categoryId is specified
  const category = await getOrCreateDefaultCategory(userId);
  const categoryId = body.categoryId ?? category.id;

  const existingBudget = await getActiveBudgetForUser(userId, month, categoryId);

  const budget = existingBudget
    ? await prisma.budget.update({
        where: { id: existingBudget.id },
        data: { limitAmount },
        select: { id: true, limitAmount: true },
      })
    : await prisma.budget.create({
        data: {
          userId,
          month,
          limitAmount,
          categoryId,
          members: {
            create: { userId },
          },
        },
        select: { id: true, limitAmount: true },
      });

  return NextResponse.json({
    id: budget.id,
    limitAmount: Number(budget.limitAmount),
  });
}
