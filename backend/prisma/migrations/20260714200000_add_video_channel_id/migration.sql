-- CreateTable
CREATE TABLE "Video" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "toolName" TEXT NOT NULL,
    "toolCategory" TEXT NOT NULL,
    "youtubeId" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "durationSeconds" INTEGER NOT NULL,
    "views" INTEGER NOT NULL,
    "likes" INTEGER NOT NULL,
    "publishedAt" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "authorAvatar" TEXT NOT NULL,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "accent" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Video_slug_key" ON "Video"("slug");
CREATE UNIQUE INDEX "Video_youtubeId_key" ON "Video"("youtubeId");
CREATE INDEX "Video_toolCategory_idx" ON "Video"("toolCategory");
CREATE INDEX "Video_publishedAt_idx" ON "Video"("publishedAt");
CREATE INDEX "Video_views_idx" ON "Video"("views");

-- AlterTable
ALTER TABLE "Video" ADD COLUMN "channelId" TEXT;