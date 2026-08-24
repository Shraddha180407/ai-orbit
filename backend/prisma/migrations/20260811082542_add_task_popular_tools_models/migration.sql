-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "deviceCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "modelCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "robotCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "saveCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "shareUrl" TEXT,
ADD COLUMN     "toolCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "TaskPopularTool" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT,
    "tagline" TEXT NOT NULL,
    "pricingModel" TEXT NOT NULL,
    "rating" DOUBLE PRECISION,
    "bookmarkCount" INTEGER NOT NULL DEFAULT 0,
    "visitUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskPopularTool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskPopularModel" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "logoUrl" TEXT,
    "modelType" TEXT NOT NULL,
    "pricingModel" TEXT NOT NULL,
    "benchmarkScore" DOUBLE PRECISION,
    "websiteUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskPopularModel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TaskPopularTool_taskId_idx" ON "TaskPopularTool"("taskId");

-- CreateIndex
CREATE UNIQUE INDEX "TaskPopularTool_taskId_slug_key" ON "TaskPopularTool"("taskId", "slug");

-- CreateIndex
CREATE INDEX "TaskPopularModel_taskId_idx" ON "TaskPopularModel"("taskId");

-- CreateIndex
CREATE UNIQUE INDEX "TaskPopularModel_taskId_slug_key" ON "TaskPopularModel"("taskId", "slug");

-- AddForeignKey
ALTER TABLE "TaskPopularTool" ADD CONSTRAINT "TaskPopularTool_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskPopularModel" ADD CONSTRAINT "TaskPopularModel_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
