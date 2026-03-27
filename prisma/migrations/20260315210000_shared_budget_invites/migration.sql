-- CreateTable
CREATE TABLE "budget_members" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "budget_id" UUID NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "budget_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "budget_invitations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "budget_id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "invited_by_user_id" TEXT NOT NULL,
    "invited_user_id" TEXT,
    "status" VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accepted_at" TIMESTAMP(3),

    CONSTRAINT "budget_invitations_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "expenses" ADD COLUMN "budget_id" UUID;

-- Backfill owner as budget member
INSERT INTO "budget_members" ("budget_id", "user_id")
SELECT "id", "user_id" FROM "budgets"
ON CONFLICT DO NOTHING;

-- Backfill expense -> budget relation by previous owner/month model
UPDATE "expenses" e
SET "budget_id" = b."id"
FROM "budgets" b
WHERE e."budget_id" IS NULL
  AND e."user_id" = b."user_id"
  AND e."month" = b."month";

-- Enforce NOT NULL after backfill
ALTER TABLE "expenses" ALTER COLUMN "budget_id" SET NOT NULL;

-- CreateIndex
CREATE INDEX "budget_members_user_id_idx" ON "budget_members"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "budget_members_budget_id_user_id_key" ON "budget_members"("budget_id", "user_id");

-- CreateIndex
CREATE INDEX "budget_invitations_budget_id_idx" ON "budget_invitations"("budget_id");

-- CreateIndex
CREATE INDEX "budget_invitations_email_idx" ON "budget_invitations"("email");

-- CreateIndex
CREATE INDEX "budget_invitations_status_idx" ON "budget_invitations"("status");

-- CreateIndex
CREATE INDEX "budget_invitations_invited_user_id_idx" ON "budget_invitations"("invited_user_id");

-- CreateIndex
CREATE INDEX "expenses_budget_id_idx" ON "expenses"("budget_id");

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_budget_id_fkey" FOREIGN KEY ("budget_id") REFERENCES "budgets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget_members" ADD CONSTRAINT "budget_members_budget_id_fkey" FOREIGN KEY ("budget_id") REFERENCES "budgets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget_members" ADD CONSTRAINT "budget_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget_invitations" ADD CONSTRAINT "budget_invitations_budget_id_fkey" FOREIGN KEY ("budget_id") REFERENCES "budgets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget_invitations" ADD CONSTRAINT "budget_invitations_invited_by_user_id_fkey" FOREIGN KEY ("invited_by_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget_invitations" ADD CONSTRAINT "budget_invitations_invited_user_id_fkey" FOREIGN KEY ("invited_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
