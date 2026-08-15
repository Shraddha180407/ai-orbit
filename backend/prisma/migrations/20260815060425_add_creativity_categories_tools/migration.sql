-- CreateEnum
CREATE TYPE "CreativityCategory" AS ENUM ('IMAGE_GENERATION', 'WRITING', 'SOFTWARE_DEVELOPMENT', 'VIDEO_CREATION', 'MUSIC', 'GRAPHIC_DESIGN', 'DIGITAL_ART', 'BRAINSTORMING', 'THREE_D_CREATION', 'PRESENTATION_DESIGN', 'STORYTELLING', 'CONTENT_CREATION', 'BRANDING', 'MOTION_GRAPHICS', 'GAME_CREATION');

-- AlterTable
ALTER TABLE "Tool" ADD COLUMN     "creativityCategories" "CreativityCategory"[] DEFAULT ARRAY[]::"CreativityCategory"[];

-- CreateIndex
CREATE INDEX "Tool_creativityCategories_idx" ON "Tool"("creativityCategories");
