BEGIN;

-- Clear existing test data (4 placeholder repos) so new required columns
-- can be added without default-value conflicts. These will be re-populated
-- by the Phase 2 sync script.
DELETE FROM "Repository";

-- Make existing nullable columns actually nullable (they were NOT NULL before)
ALTER TABLE "Repository"
  ALTER COLUMN "language" DROP NOT NULL,
  ALTER COLUMN "description" DROP NOT NULL;

-- Add all new columns
ALTER TABLE "Repository"
  ADD COLUMN "githubId" INTEGER NOT NULL,
  ADD COLUMN "slug" TEXT NOT NULL,
  ADD COLUMN "ownerAvatarUrl" TEXT,
  ADD COLUMN "homepage" TEXT,
  ADD COLUMN "license" TEXT,
  ADD COLUMN "topics" TEXT[] DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "forks" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "openIssues" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "defaultBranch" TEXT NOT NULL DEFAULT 'main',
  ADD COLUMN "logoUrl" TEXT,
  ADD COLUMN "brandColor" TEXT,
  ADD COLUMN "readmeHtml" TEXT,
  ADD COLUMN "readmeFetchedAt" TIMESTAMP(3),
  ADD COLUMN "githubCreatedAt" TIMESTAMP(3) NOT NULL,
  ADD COLUMN "syncedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex: unique constraints
CREATE UNIQUE INDEX "Repository_githubId_key" ON "Repository"("githubId");
CREATE UNIQUE INDEX "Repository_slug_key" ON "Repository"("slug");

-- CreateIndex: performance indexes
CREATE INDEX "Repository_stars_idx" ON "Repository"("stars");
CREATE INDEX "Repository_language_idx" ON "Repository"("language");
CREATE INDEX "Repository_topics_idx" ON "Repository" USING GIN ("topics");
CREATE INDEX "Repository_syncedAt_idx" ON "Repository"("syncedAt");

COMMIT;
