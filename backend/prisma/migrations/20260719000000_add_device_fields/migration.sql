-- CreateDeviceFields

-- Add new columns to Device table
ALTER TABLE "Device" ADD COLUMN "slug" TEXT NOT NULL;
ALTER TABLE "Device" ADD COLUMN "availability" TEXT NOT NULL;
ALTER TABLE "Device" ADD COLUMN "price" TEXT;
ALTER TABLE "Device" ADD COLUMN "month" TEXT;
ALTER TABLE "Device" ADD COLUMN "imageUrl" TEXT;
ALTER TABLE "Device" ADD COLUMN "manufacturerLogoUrl" TEXT;
ALTER TABLE "Device" ADD COLUMN "mainTask" TEXT;
ALTER TABLE "Device" ADD COLUMN "formFactor" TEXT;
ALTER TABLE "Device" ADD COLUMN "country" TEXT;
ALTER TABLE "Device" ADD COLUMN "ram" TEXT;
ALTER TABLE "Device" ADD COLUMN "aiFeatures" TEXT[] DEFAULT '{}';
ALTER TABLE "Device" ADD COLUMN "primaryUseCases" TEXT[] DEFAULT '{}';
ALTER TABLE "Device" ADD COLUMN "additionalInfo" TEXT;
ALTER TABLE "Device" ADD COLUMN "buyUrl" TEXT;

-- Add unique constraint to slug
CREATE UNIQUE INDEX "Device_slug_key" ON "Device"("slug");

-- Add default values for new columns
UPDATE "Device" SET "slug" = "device-" || "id" WHERE "slug" IS NULL;
UPDATE "Device" SET "availability" = 'Available' WHERE "availability" IS NULL;
UPDATE "Device" SET "price" = NULL WHERE "price" IS NULL;
UPDATE "Device" SET "month" = NULL WHERE "month" IS NULL;
UPDATE "Device" SET "imageUrl" = NULL WHERE "imageUrl" IS NULL;
UPDATE "Device" SET "manufacturerLogoUrl" = NULL WHERE "manufacturerLogoUrl" IS NULL;
UPDATE "Device" SET "mainTask" = NULL WHERE "mainTask" IS NULL;
UPDATE "Device" SET "formFactor" = NULL WHERE "formFactor" IS NULL;
UPDATE "Device" SET "country" = NULL WHERE "country" IS NULL;
UPDATE "Device" SET "ram" = NULL WHERE "ram" IS NULL;
UPDATE "Device" SET "aiFeatures" = NULL WHERE "aiFeatures" IS NULL;
UPDATE "Device" SET "primaryUseCases" = NULL WHERE "primaryUseCases" IS NULL;
UPDATE "Device" SET "additionalInfo" = NULL WHERE "additionalInfo" IS NULL;
UPDATE "Device" SET "buyUrl" = NULL WHERE "buyUrl" IS NULL;

-- Create index for better query performance
CREATE INDEX "Device_slug_idx" ON "Device"("slug");
