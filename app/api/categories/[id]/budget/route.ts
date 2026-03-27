import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getActiveBudgetForUser, getAuthorizedUser, getMonthKey } from "@/lib/budget";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthorizedUser();

  if (!user || !("id" in user) || typeof user.id !== "string") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = user.id;
  const { id: categoryId } = await params;
  const month = getMonthKey();

  // Verify category belongs to user
  const category = await prisma.category.findFirst({
    where: { id: categoryId, userId },
    select: { id: true },
  });

  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  const body = await req.json();
  const limitAmount = Number(body.limitAmount);

  if (!Number.isFinite(limitAmount) || limitAmount <= 0) {
    return NextResponse.json({ error: "Invalid limitAmount" }, { status: 400 });
  }

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
