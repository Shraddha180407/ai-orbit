-- AlterTable: expand Robot model with new fields
-- Drop old columns
ALTER TABLE "Robot" DROP COLUMN IF EXISTS "manufacturer";
ALTER TABLE "Robot" DROP COLUMN IF EXISTS "year";
ALTER TABLE "Robot" DROP COLUMN IF EXISTS "description";

-- Add new columns
ALTER TABLE "Robot" ADD COLUMN IF NOT EXISTS "slug" TEXT;
ALTER TABLE "Robot" ADD COLUMN IF NOT EXISTS "logoUrl" TEXT;
ALTER TABLE "Robot" ADD COLUMN IF NOT EXISTS "thumbnailUrl" TEXT;
ALTER TABLE "Robot" ADD COLUMN IF NOT EXISTS "company" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Robot" ADD COLUMN IF NOT EXISTS "country" TEXT;
ALTER TABLE "Robot" ADD COLUMN IF NOT EXISTS "availability" TEXT NOT NULL DEFAULT 'IN_DEVELOPMENT';
ALTER TABLE "Robot" ADD COLUMN IF NOT EXISTS "price" TEXT;
ALTER TABLE "Robot" ADD COLUMN IF NOT EXISTS "releaseDate" TEXT;
ALTER TABLE "Robot" ADD COLUMN IF NOT EXISTS "mainTask" TEXT;
ALTER TABLE "Robot" ADD COLUMN IF NOT EXISTS "autonomyLevel" TEXT;
ALTER TABLE "Robot" ADD COLUMN IF NOT EXISTS "primaryUseCases" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Robot" ADD COLUMN IF NOT EXISTS "websiteUrl" TEXT;
ALTER TABLE "Robot" ADD COLUMN IF NOT EXISTS "about" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Robot" ADD COLUMN IF NOT EXISTS "specs" TEXT;
ALTER TABLE "Robot" ADD COLUMN IF NOT EXISTS "mediaUrls" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Backfill slug from name for existing rows
UPDATE "Robot" SET "slug" = LOWER(REPLACE("name", ' ', '-')) WHERE "slug" IS NULL;

-- Make slug required and unique
ALTER TABLE "Robot" ALTER COLUMN "slug" SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "Robot_slug_key" ON "Robot"("slug");

-- Add indexes
CREATE INDEX IF NOT EXISTS "Robot_category_idx" ON "Robot"("category");
CREATE INDEX IF NOT EXISTS "Robot_availability_idx" ON "Robot"("availability");
CREATE INDEX IF NOT EXISTS "Robot_company_idx" ON "Robot"("company");
