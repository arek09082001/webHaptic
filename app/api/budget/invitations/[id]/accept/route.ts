import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthorizedUser } from "@/lib/budget";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthorizedUser();

  if (!user || !("id" in user) || typeof user.id !== "string") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = user.email?.toLowerCase();
  if (!email) {
    return NextResponse.json({ error: "User email is required" }, { status: 400 });
  }

  const { id } = await params;

  const invitation = await prisma.budgetInvitation.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      status: true,
      budgetId: true,
      budget: {
        select: {
          month: true,
        },
      },
    },
  });

  if (!invitation || invitation.status !== "PENDING") {
    return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
  }

  if (invitation.email.toLowerCase() !== email) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const hasAnotherBudgetForMonth = await prisma.budgetMember.findFirst({
    where: {
      userId: user.id,
      budget: {
        month: invitation.budget.month,
        id: { not: invitation.budgetId },
      },
    },
    select: { id: true },
  });

  if (hasAnotherBudgetForMonth) {
    return NextResponse.json(
      { error: "You already belong to another budget this month" },
      { status: 409 }
    );
  }

  await prisma.$transaction([
    prisma.budgetMember.upsert({
      where: {
        budgetId_userId: {
          budgetId: invitation.budgetId,
          userId: user.id,
        },
      },
      create: {
        budgetId: invitation.budgetId,
        userId: user.id,
      },
      update: {},
    }),
    prisma.budgetInvitation.update({
      where: { id },
      data: {
        status: "ACCEPTED",
        invitedUserId: user.id,
        acceptedAt: new Date(),
      },
    }),
  ]);

  return NextResponse.json({ success: true });
}
