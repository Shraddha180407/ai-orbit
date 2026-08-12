-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('WEB', 'WINDOWS', 'MACOS', 'LINUX', 'IOS', 'ANDROID', 'CHROME_EXTENSION');

-- CreateEnum
CREATE TYPE "UserPersona" AS ENUM ('DEVELOPERS', 'DESIGNERS', 'STUDENTS', 'MARKETERS', 'WRITERS', 'RESEARCHERS', 'EDUCATORS', 'SALES', 'ENTERPRISE', 'CONTENT_CREATORS');

-- AlterTable
ALTER TABLE "Tool" ADD COLUMN     "apiDocsUrl" TEXT,
ADD COLUMN     "compatibility" "Platform"[],
ADD COLUMN     "cons" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "hasApi" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "performanceScore" DOUBLE PRECISION,
ADD COLUMN     "pros" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "releaseDate" TIMESTAMP(3),
ADD COLUMN     "targetUsers" "UserPersona"[],
ADD COLUMN     "upvoteCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Integration" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT,

    CONSTRAINT "Integration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ToolIntegration" (
    "toolId" TEXT NOT NULL,
    "integrationId" TEXT NOT NULL,

    CONSTRAINT "ToolIntegration_pkey" PRIMARY KEY ("toolId","integrationId")
);

-- CreateTable
CREATE TABLE "ToolVote" (
    "userId" TEXT NOT NULL,
    "toolId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ToolVote_pkey" PRIMARY KEY ("userId","toolId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Integration_slug_key" ON "Integration"("slug");

-- CreateIndex
CREATE INDEX "ToolIntegration_integrationId_idx" ON "ToolIntegration"("integrationId");

-- CreateIndex
CREATE INDEX "ToolVote_toolId_idx" ON "ToolVote"("toolId");

-- CreateIndex
CREATE INDEX "Tool_releaseDate_idx" ON "Tool"("releaseDate");

-- CreateIndex
CREATE INDEX "Tool_isTrending_idx" ON "Tool"("isTrending");

-- CreateIndex
CREATE INDEX "Tool_verified_idx" ON "Tool"("verified");

-- AddForeignKey
ALTER TABLE "ToolIntegration" ADD CONSTRAINT "ToolIntegration_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToolIntegration" ADD CONSTRAINT "ToolIntegration_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "Integration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToolVote" ADD CONSTRAINT "ToolVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToolVote" ADD CONSTRAINT "ToolVote_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE CASCADE ON UPDATE CASCADE;
