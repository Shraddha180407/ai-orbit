/*
  Warnings:

  - You are about to drop the column `description` on the `Robot` table. All the data in the column will be lost.
  - You are about to drop the column `manufacturer` on the `Robot` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `Robot` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Robot` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `availability` to the `Robot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company` to the `Robot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Robot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Robot` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `category` on the `Robot` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "RobotCategory" AS ENUM ('HUMANOID', 'MOBILE', 'MANIPULATOR', 'DRONE', 'INDUSTRIAL', 'WAREHOUSE', 'HEALTHCARE', 'HOME', 'AGRICULTURAL', 'DEFENSE', 'SERVICE', 'COMPANION', 'OTHER');

-- CreateEnum
CREATE TYPE "RobotAvailability" AS ENUM ('ANNOUNCED', 'COMMERCIALLY_AVAILABLE', 'DISCONTINUED', 'IN_DEVELOPMENT', 'IN_PRODUCTION', 'PAUSED', 'PILOT', 'PRE_ORDER', 'PROTOTYPE');

-- CreateEnum
CREATE TYPE "AutonomyLevel" AS ENUM ('TELEOPERATED', 'ASSISTED', 'SEMI_AUTONOMOUS', 'HIGHLY_AUTONOMOUS', 'FULLY_AUTONOMOUS');

-- AlterTable
ALTER TABLE "Robot" DROP COLUMN "description",
DROP COLUMN "manufacturer",
DROP COLUMN "year",
ADD COLUMN     "about" TEXT,
ADD COLUMN     "autonomyLevel" "AutonomyLevel",
ADD COLUMN     "availability" "RobotAvailability" NOT NULL,
ADD COLUMN     "company" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "mainTask" TEXT,
ADD COLUMN     "mediaUrls" TEXT[],
ADD COLUMN     "price" TEXT,
ADD COLUMN     "primaryUseCases" TEXT[],
ADD COLUMN     "releaseDate" TEXT,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "specs" TEXT,
ADD COLUMN     "thumbnailUrl" TEXT,
ADD COLUMN     "websiteUrl" TEXT,
DROP COLUMN "category",
ADD COLUMN     "category" "RobotCategory" NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "Robot_slug_key" ON "Robot"("slug");
