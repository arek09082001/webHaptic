import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthorizedUser } from "@/lib/budget";

async function getAuthorizedUserId() {
  const user = await getAuthorizedUser();

  if (!user || !("id" in user) || typeof user.id !== "string") {
    return null;
  }

  return user.id;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getAuthorizedUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const amount = Number(body.amount);
  const description = typeof body.description === "string" ? body.description.trim() : "";

  if (!Number.isFinite(amount) || amount <= 0 || description.length === 0) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const existing = await prisma.expense.findFirst({
    where: {
      id,
      budget: {
        members: {
          some: { userId },
        },
      },
    },
    select: { id: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "Expense not found" }, { status: 404 });
  }

  const updatedExpense = await prisma.expense.update({
    where: { id },
    data: { amount, description },
    select: { id: true, amount: true, description: true, createdAt: true, month: true },
  });

  return NextResponse.json({
    ...updatedExpense,
    amount: Number(updatedExpense.amount),
  });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getAuthorizedUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.expense.findFirst({
    where: {
      id,
      budget: {
        members: {
          some: { userId },
        },
      },
    },
    select: { id: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "Expense not found" }, { status: 404 });
  }

  await prisma.expense.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
