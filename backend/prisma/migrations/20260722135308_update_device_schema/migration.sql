/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Device` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `imageUrl` to the `Device` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mainTask` to the `Device` table without a default value. This is not possible if the table is not empty.
  - Added the required column `manufacturerLogoUrl` to the `Device` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Device` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Availability" AS ENUM ('Available', 'Pre-order', 'Announced', 'Discontinued');

-- AlterTable
ALTER TABLE "Device" ADD COLUMN     "additionalInfo" TEXT,
ADD COLUMN     "aiFeatures" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "availability" "Availability" NOT NULL DEFAULT 'Announced',
ADD COLUMN     "buyUrl" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "formFactor" TEXT,
ADD COLUMN     "imageUrl" TEXT NOT NULL,
ADD COLUMN     "mainTask" TEXT NOT NULL,
ADD COLUMN     "manufacturerLogoUrl" TEXT NOT NULL,
ADD COLUMN     "month" TEXT,
ADD COLUMN     "price" TEXT,
ADD COLUMN     "primaryUseCases" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "ram" TEXT,
ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Repository" ALTER COLUMN "topics" DROP DEFAULT,
ALTER COLUMN "forks" DROP DEFAULT,
ALTER COLUMN "openIssues" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "Device_slug_key" ON "Device"("slug");
