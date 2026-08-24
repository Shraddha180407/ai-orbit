-- AlterTable
ALTER TABLE "Tool" ADD COLUMN     "alternativeIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "country" TEXT,
ADD COLUMN     "githubUrl" TEXT,
ADD COLUMN     "launchDate" TEXT,
ADD COLUMN     "linkedInUrl" TEXT,
ADD COLUMN     "longDescription" TEXT,
ADD COLUMN     "pricingTiers" JSONB,
ADD COLUMN     "releasedBy" TEXT,
ADD COLUMN     "twitterUrl" TEXT,
ADD COLUMN     "useCases" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "verdict" TEXT,
ADD COLUMN     "videoUrl" TEXT,
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;
