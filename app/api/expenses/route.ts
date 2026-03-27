import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getActiveBudgetForUser, getAuthorizedUser, getMonthKey } from "@/lib/budget";

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
  const month = requestedMonth ?? getMonthKey();
  const categoryId = req.nextUrl.searchParams.get("categoryId") ?? undefined;

  if (!isValidMonthKey(month)) {
    return NextResponse.json({ error: "Invalid month format. Expected YYYY-MM" }, { status: 400 });
  }

  // Find all budgets the user is a member of for this month.
  const memberBudgets = await prisma.budget.findMany({
    where: {
      month,
      members: { some: { userId } },
    },
    select: {
      id: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (memberBudgets.length === 0) {
    return NextResponse.json({ month, spent: 0, expenses: [], categories: [] });
  }

  const budgetIds = memberBudgets.map((b) => b.id);
  const categories = Array.from(
    new Map(memberBudgets.map((budget) => [budget.category.id, budget.category])).values()
  );

  const whereClause = {
    month,
    budgetId: { in: budgetIds },
    ...(categoryId ? { categoryId } : {}),
  };

  const [expenseAggregate, expenses] = await Promise.all([
    prisma.expense.aggregate({
      where: whereClause,
      _sum: { amount: true },
    }),
    prisma.expense.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        amount: true,
        description: true,
        createdAt: true,
        category: {
          select: { name: true },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    }),
  ]);

  return NextResponse.json({
    month,
    spent: Number(expenseAggregate._sum.amount ?? 0),
    categories,
    expenses: expenses.map((expense) => ({
      id: expense.id,
      amount: Number(expense.amount),
      description: expense.description,
      createdAt: expense.createdAt,
      categoryName: expense.category?.name ?? "",
      createdBy: {
        name: expense.user.name,
        email: expense.user.email,
      },
    })),
  });
}

export async function POST(req: NextRequest) {
  const user = await getAuthorizedUser();

  if (!user || !("id" in user) || typeof user.id !== "string") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = user.id;
  const month = getMonthKey();

  const body = await req.json();
  const amount = Number(body.amount);
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const categoryId = typeof body.categoryId === "string" ? body.categoryId : null;

  if (!Number.isFinite(amount) || amount <= 0 || description.length === 0) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  if (!categoryId) {
    return NextResponse.json({ error: "categoryId is required" }, { status: 400 });
  }

  // Verify category belongs to user
  const category = await prisma.category.findFirst({
    where: { id: categoryId, userId },
    select: { id: true },
  });

  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  const budget = await getActiveBudgetForUser(userId, month, categoryId);

  if (!budget) {
    return NextResponse.json({ error: "No budget set for this month and category" }, { status: 422 });
  }

  const expense = await prisma.expense.create({
    data: { userId, budgetId: budget.id, categoryId, month, amount, description },
    select: {
      id: true,
      amount: true,
      description: true,
      createdAt: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return NextResponse.json(
    {
      id: expense.id,
      amount: Number(expense.amount),
      description: expense.description,
      createdAt: expense.createdAt,
      createdBy: {
        name: expense.user.name,
        email: expense.user.email,
      },
    },
    { status: 201 }
  );
}
