-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_categoryId_fkey";

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "bannerUrl" TEXT,
ADD COLUMN     "iconUrl" TEXT,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "TaskResource" ADD COLUMN     "homepage" TEXT,
ADD COLUMN     "postedAt" TIMESTAMP(3),
ADD COLUMN     "source" TEXT,
ADD COLUMN     "stars" INTEGER;

-- CreateTable
CREATE TABLE "TaskCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "TaskCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TaskCategory_slug_key" ON "TaskCategory"("slug");

-- Migrate existing categories
INSERT INTO "TaskCategory" ("id", "name", "slug")
SELECT "id", "name", "slug"
FROM "Category";

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "TaskCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
