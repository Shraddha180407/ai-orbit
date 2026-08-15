-- CreateEnum
CREATE TYPE "ModelType" AS ENUM ('TEXT', 'IMAGE', 'VIDEO', 'MULTIMODAL', 'AUDIO', 'CODE', 'THREE_D', 'STRUCTURED_DATA');

-- AlterTable
ALTER TABLE "AIModel" ADD COLUMN     "apiAvailable" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "documentation" JSONB,
ADD COLUMN     "modelType" "ModelType",
ADD COLUMN     "openSource" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "primaryTask" TEXT,
ADD COLUMN     "promptExamples" TEXT[] DEFAULT ARRAY[]::TEXT[];
