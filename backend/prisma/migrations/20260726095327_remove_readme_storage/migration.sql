/*
  Warnings:

  - You are about to drop the column `readmeFetchedAt` on the `Repository` table. All the data in the column will be lost.
  - You are about to drop the column `readmeHtml` on the `Repository` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Repository" DROP COLUMN "readmeFetchedAt",
DROP COLUMN "readmeHtml";
