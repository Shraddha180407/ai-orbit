-- CreateEnum
CREATE TYPE "CompanyType" AS ENUM ('AI_NATIVE', 'MODEL_COMPANIES', 'TOOL_COMPANIES', 'PROFITABLE', 'UNICORNS');

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "employeeCount" INTEGER,
ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "foundedYear" INTEGER,
ADD COLUMN     "fundingRaised" BIGINT,
ADD COLUMN     "impressions" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "latestFundingRound" TEXT,
ADD COLUMN     "linkedinUrl" TEXT,
ADD COLUMN     "sector" TEXT,
ADD COLUMN     "twitterUrl" TEXT,
ADD COLUMN     "type" "CompanyType"[] DEFAULT ARRAY[]::"CompanyType"[],
ADD COLUMN     "upvotes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "valuation" BIGINT,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "website" TEXT,
ALTER COLUMN "updatedAt" DROP DEFAULT;
