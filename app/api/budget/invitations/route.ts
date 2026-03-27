import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getActiveBudgetForUser, getAuthorizedUser, getMonthKey } from "@/lib/budget";

export async function GET() {
  const user = await getAuthorizedUser();

  if (!user || !("id" in user) || typeof user.id !== "string") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = user.id;
  const month = getMonthKey();
  const budget = await getActiveBudgetForUser(userId, month);

  const [sentInvitations, receivedInvitations] = await Promise.all([
    budget
      ? prisma.budgetInvitation.findMany({
          where: { budgetId: budget.id },
          select: {
            id: true,
            email: true,
            status: true,
            createdAt: true,
            acceptedAt: true,
          },
          orderBy: { createdAt: "desc" },
        })
      : Promise.resolve([]),
    prisma.budgetInvitation.findMany({
      where: {
        email: user.email?.toLowerCase(),
      },
      select: {
        id: true,
        email: true,
        status: true,
        createdAt: true,
        acceptedAt: true,
        budget: {
          select: {
            month: true,
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return NextResponse.json({
    month,
    sentInvitations,
    receivedInvitations,
  });
}

export async function POST(req: NextRequest) {
  const user = await getAuthorizedUser();

  if (!user || !("id" in user) || typeof user.id !== "string") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = user.id;
  const month = getMonthKey();
  const budget = await getActiveBudgetForUser(userId, month);

  if (!budget) {
    return NextResponse.json({ error: "No budget set for this month" }, { status: 422 });
  }

  const body = await req.json();
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const ownEmail = user.email?.toLowerCase();
  if (ownEmail && ownEmail === email) {
    return NextResponse.json({ error: "You are already in this budget" }, { status: 400 });
  }

  const invitedUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (invitedUser) {
    const [isAlreadyMember, hasAnotherBudgetForMonth] = await Promise.all([
      prisma.budgetMember.findFirst({
        where: { budgetId: budget.id, userId: invitedUser.id },
        select: { id: true },
      }),
      prisma.budgetMember.findFirst({
        where: {
          userId: invitedUser.id,
          budget: {
            month,
            id: { not: budget.id },
          },
        },
        select: { id: true },
      }),
    ]);

    if (isAlreadyMember) {
      return NextResponse.json({ error: "User is already a member" }, { status: 409 });
    }

    if (hasAnotherBudgetForMonth) {
      return NextResponse.json(
        { error: "User already belongs to another budget this month" },
        { status: 409 }
      );
    }
  }

  const existingPending = await prisma.budgetInvitation.findFirst({
    where: {
      budgetId: budget.id,
      email,
      status: "PENDING",
    },
    select: { id: true, email: true, createdAt: true },
  });

  if (existingPending) {
    return NextResponse.json(existingPending, { status: 200 });
  }

  const invitation = await prisma.budgetInvitation.create({
    data: {
      budgetId: budget.id,
      email,
      invitedByUserId: userId,
      invitedUserId: invitedUser?.id,
      status: "PENDING",
    },
    select: { id: true, email: true, createdAt: true },
  });

  return NextResponse.json(invitation, { status: 201 });
}
