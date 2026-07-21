-- CreateTable: Robot
CREATE TABLE "Robot" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Robot_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Device
CREATE TABLE "Device" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateEnum
CREATE TYPE "TaskDifficulty" AS ENUM ('EASY', 'MEDIUM', 'ADVANCED');

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "difficulty" "TaskDifficulty" NOT NULL DEFAULT 'EASY',
    "pricingModel" "PricingModel" NOT NULL DEFAULT 'FREE',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "categoryId" TEXT NOT NULL,
    "creatorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskLike" (
    "taskId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskLike_pkey" PRIMARY KEY ("taskId","userId")
);

-- CreateTable
CREATE TABLE "TaskSubscriber" (
    "taskId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskSubscriber_pkey" PRIMARY KEY ("taskId","userId")
);

-- CreateTable
CREATE TABLE "TaskModel" (
    "taskId" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,

    CONSTRAINT "TaskModel_pkey" PRIMARY KEY ("taskId","modelId")
);

-- CreateTable
CREATE TABLE "TaskRobot" (
    "taskId" TEXT NOT NULL,
    "robotId" TEXT NOT NULL,

    CONSTRAINT "TaskRobot_pkey" PRIMARY KEY ("taskId","robotId")
);

-- CreateTable
CREATE TABLE "TaskDevice" (
    "taskId" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,

    CONSTRAINT "TaskDevice_pkey" PRIMARY KEY ("taskId","deviceId")
);

-- CreateTable
CREATE TABLE "TaskResource" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskResource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskTool" (
    "taskId" TEXT NOT NULL,
    "toolId" TEXT NOT NULL,

    CONSTRAINT "TaskTool_pkey" PRIMARY KEY ("taskId","toolId")
);

-- CreateTable
CREATE TABLE "TaskBookmark" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "taskId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "TaskBookmark_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Task_slug_key" ON "Task"("slug");

-- CreateIndex
CREATE INDEX "Task_categoryId_idx" ON "Task"("categoryId");

-- CreateIndex
CREATE INDEX "Task_difficulty_idx" ON "Task"("difficulty");

-- CreateIndex
CREATE INDEX "Task_pricingModel_idx" ON "Task"("pricingModel");

-- CreateIndex
CREATE INDEX "Task_isFeatured_idx" ON "Task"("isFeatured");

-- CreateIndex
CREATE INDEX "Task_creatorId_idx" ON "Task"("creatorId");

-- CreateIndex
CREATE INDEX "TaskLike_userId_idx" ON "TaskLike"("userId");

-- CreateIndex
CREATE INDEX "TaskSubscriber_userId_idx" ON "TaskSubscriber"("userId");

-- CreateIndex
CREATE INDEX "TaskModel_modelId_idx" ON "TaskModel"("modelId");

-- CreateIndex
CREATE INDEX "TaskRobot_robotId_idx" ON "TaskRobot"("robotId");

-- CreateIndex
CREATE INDEX "TaskDevice_deviceId_idx" ON "TaskDevice"("deviceId");

-- CreateIndex
CREATE INDEX "TaskResource_taskId_idx" ON "TaskResource"("taskId");

-- CreateIndex
CREATE INDEX "TaskTool_toolId_idx" ON "TaskTool"("toolId");

-- CreateIndex
CREATE INDEX "TaskBookmark_taskId_idx" ON "TaskBookmark"("taskId");

-- CreateIndex
CREATE INDEX "TaskBookmark_userId_idx" ON "TaskBookmark"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TaskBookmark_taskId_userId_key" ON "TaskBookmark"("taskId", "userId");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskLike" ADD CONSTRAINT "TaskLike_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskLike" ADD CONSTRAINT "TaskLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskSubscriber" ADD CONSTRAINT "TaskSubscriber_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskSubscriber" ADD CONSTRAINT "TaskSubscriber_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskModel" ADD CONSTRAINT "TaskModel_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskModel" ADD CONSTRAINT "TaskModel_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "AIModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskRobot" ADD CONSTRAINT "TaskRobot_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskRobot" ADD CONSTRAINT "TaskRobot_robotId_fkey" FOREIGN KEY ("robotId") REFERENCES "Robot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskDevice" ADD CONSTRAINT "TaskDevice_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskDevice" ADD CONSTRAINT "TaskDevice_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskResource" ADD CONSTRAINT "TaskResource_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskTool" ADD CONSTRAINT "TaskTool_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskTool" ADD CONSTRAINT "TaskTool_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskBookmark" ADD CONSTRAINT "TaskBookmark_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskBookmark" ADD CONSTRAINT "TaskBookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
