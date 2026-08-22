-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "available" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "Video_available_idx" ON "Video"("available");
