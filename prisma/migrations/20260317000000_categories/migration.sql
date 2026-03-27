-- CreateTable
CREATE TABLE "categories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "categories_user_id_idx" ON "categories"("user_id");

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create default "Freizeit" category for every user that has budgets or expenses
INSERT INTO "categories" ("user_id", "name")
SELECT DISTINCT u."id", 'Freizeit'
FROM "users" u
WHERE EXISTS (
    SELECT 1 FROM "budgets" b WHERE b."user_id" = u."id"
    UNION ALL
    SELECT 1 FROM "expenses" e WHERE e."user_id" = u."id"
);

-- AddColumn category_id to budgets (nullable first, filled below, then made NOT NULL)
ALTER TABLE "budgets" ADD COLUMN "category_id" UUID;

-- Assign all existing budgets to the user's Freizeit category
UPDATE "budgets" b
SET "category_id" = c."id"
FROM "categories" c
WHERE c."user_id" = b."user_id" AND c."name" = 'Freizeit';

-- Make category_id NOT NULL after backfill
ALTER TABLE "budgets" ALTER COLUMN "category_id" SET NOT NULL;

-- Drop old unique index
DROP INDEX "budgets_user_id_month_key";

-- Add new unique constraint (user + month + category)
CREATE UNIQUE INDEX "budgets_user_id_month_category_id_key" ON "budgets"("user_id", "month", "category_id");

-- Add index and FK for category_id on budgets
CREATE INDEX "budgets_category_id_idx" ON "budgets"("category_id");

ALTER TABLE "budgets" ADD CONSTRAINT "budgets_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddColumn category_id to expenses (nullable first, filled below, then made NOT NULL)
ALTER TABLE "expenses" ADD COLUMN "category_id" UUID;

-- Assign all existing expenses to the category via their budget
UPDATE "expenses" e
SET "category_id" = b."category_id"
FROM "budgets" b
WHERE e."budget_id" = b."id";

-- Make category_id NOT NULL after backfill
ALTER TABLE "expenses" ALTER COLUMN "category_id" SET NOT NULL;

-- Add index and FK for category_id on expenses
CREATE INDEX "expenses_category_id_idx" ON "expenses"("category_id");

ALTER TABLE "expenses" ADD CONSTRAINT "expenses_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
