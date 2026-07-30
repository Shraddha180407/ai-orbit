-- AlterTable
ALTER TABLE "Device" ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "videoUrl" TEXT;
