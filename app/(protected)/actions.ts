"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  getActiveBudgetForUser,
  getAuthorizedUser,
  getMonthKey,
  getOrCreateDefaultCategory,
} from "@/lib/budget";

async function getUserId() {
  const user = await getAuthorizedUser();

  if (!user || !("id" in user) || typeof user.id !== "string") {
    throw new Error("Unauthorized");
  }

  return user.id;
}

export async function setMonthlyLimit(formData: FormData) {
  const userId = await getUserId();
  const month = getMonthKey();
  const limitRaw = formData.get("limit");
  const limit = Number(limitRaw);

  if (!Number.isFinite(limit) || limit <= 0) {
    return;
  }

  const category = await getOrCreateDefaultCategory(userId);
  const existingBudget = await getActiveBudgetForUser(userId, month, category.id);

  if (existingBudget) {
    await prisma.budget.update({
      where: { id: existingBudget.id },
      data: { limitAmount: limit },
    });
  } else {
    await prisma.budget.create({
      data: {
        userId,
        month,
        limitAmount: limit,
        categoryId: category.id,
        members: {
          create: { userId },
        },
      },
    });
  }

  revalidatePath("/");
}

export async function addExpense(formData: FormData) {
  const userId = await getUserId();
  const month = getMonthKey();

  const amountRaw = formData.get("amount");
  const descriptionRaw = formData.get("description");

  const amount = Number(amountRaw);
  const description = typeof descriptionRaw === "string" ? descriptionRaw.trim() : "";

  if (!Number.isFinite(amount) || amount <= 0 || description.length === 0) {
    return;
  }

  const category = await getOrCreateDefaultCategory(userId);
  const budget = await getActiveBudgetForUser(userId, month, category.id);

  if (!budget) {
    return;
  }

  await prisma.expense.create({
    data: {
      userId,
      budgetId: budget.id,
      categoryId: category.id,
      month,
      amount,
      description,
    },
  });

  revalidatePath("/");
}
