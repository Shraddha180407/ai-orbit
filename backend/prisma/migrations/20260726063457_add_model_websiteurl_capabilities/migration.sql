-- AlterTable
ALTER TABLE "AIModel" ADD COLUMN     "capabilities" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "websiteUrl" TEXT;
