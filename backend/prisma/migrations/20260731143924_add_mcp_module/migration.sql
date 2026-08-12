-- CreateEnum
CREATE TYPE "MCPItemType" AS ENUM ('SERVER', 'CLIENT');

-- CreateEnum
CREATE TYPE "MCPPricingType" AS ENUM ('FREE', 'FREEMIUM', 'PAID');

-- CreateEnum
CREATE TYPE "BillingCycle" AS ENUM ('MONTHLY', 'YEARLY', 'ONE_TIME');

-- CreateEnum
CREATE TYPE "EditorialGrade" AS ENUM ('AA', 'A_PLUS', 'A', 'B_PLUS', 'B', 'C');

-- CreateTable
CREATE TABLE "MCPDirectoryReport" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reporterId" TEXT NOT NULL,
    "reportedMCPItemId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "MCPDirectoryReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MCPItem" (
    "id" TEXT NOT NULL,
    "itemType" "MCPItemType" NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logoUrl" TEXT,
    "coverImageUrl" TEXT,
    "shortDescription" TEXT NOT NULL,
    "fullDescription" TEXT NOT NULL,
    "providerName" TEXT NOT NULL,
    "providerUrl" TEXT,
    "license" TEXT,
    "pricingType" "MCPPricingType" NOT NULL DEFAULT 'FREE',
    "startingPrice" DECIMAL(10,2),
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "launchDate" TIMESTAMP(3),
    "lastUpdatedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "websiteUrl" TEXT,
    "documentationUrl" TEXT,
    "repositoryUrl" TEXT,
    "qualityScore" DOUBLE PRECISION DEFAULT 0,
    "easeOfUseScore" DOUBLE PRECISION DEFAULT 0,
    "globalRank" INTEGER,
    "leaderboardRank" INTEGER,
    "editorialVerdict" TEXT,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "monthlyVisits" INTEGER NOT NULL DEFAULT 0,
    "upvoteCount" INTEGER NOT NULL DEFAULT 0,
    "saveCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MCPItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MCPDirectoryCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "color" TEXT,

    CONSTRAINT "MCPDirectoryCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MCPDirectorySubCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "MCPDirectorySubCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MCPDirectoryTag" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "MCPDirectoryTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MCPItemCategory" (
    "id" TEXT NOT NULL,
    "mcpItemId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "MCPItemCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MCPItemSubCategory" (
    "id" TEXT NOT NULL,
    "mcpItemId" TEXT NOT NULL,
    "subCategoryId" TEXT NOT NULL,

    CONSTRAINT "MCPItemSubCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MCPItemTag" (
    "id" TEXT NOT NULL,
    "mcpItemId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "MCPItemTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TechnicalSpec" (
    "id" TEXT NOT NULL,
    "mcpItemId" TEXT NOT NULL,
    "supportedPlatforms" TEXT[],
    "compatibility" TEXT NOT NULL,
    "integrations" TEXT[],
    "localBindingControls" TEXT NOT NULL,

    CONSTRAINT "TechnicalSpec_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstallationGuide" (
    "id" TEXT NOT NULL,
    "mcpItemId" TEXT NOT NULL,
    "stepNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "codeSnippet" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,

    CONSTRAINT "InstallationGuide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MCPFeature" (
    "id" TEXT NOT NULL,
    "mcpItemId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "icon" TEXT,
    "description" TEXT NOT NULL,
    "badge" TEXT,

    CONSTRAINT "MCPFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MCPUseCase" (
    "id" TEXT NOT NULL,
    "mcpItemId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "applications" TEXT[],

    CONSTRAINT "MCPUseCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PricingPlan" (
    "id" TEXT NOT NULL,
    "mcpItemId" TEXT NOT NULL,
    "planName" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "billingCycle" "BillingCycle" NOT NULL DEFAULT 'MONTHLY',
    "featuresList" TEXT[],

    CONSTRAINT "PricingPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MCPDirectoryReview" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "mcpItemId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "MCPDirectoryReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MCPDirectoryEditorialReview" (
    "id" TEXT NOT NULL,
    "grade" "EditorialGrade" NOT NULL,
    "verdict" TEXT NOT NULL,
    "reviewDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "badge" TEXT,
    "notes" TEXT,
    "mcpItemId" TEXT NOT NULL,

    CONSTRAINT "MCPDirectoryEditorialReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MCPDirectoryDiscussion" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "mcpItemId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "MCPDirectoryDiscussion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MCPDirectoryDiscussionReply" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "discussionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "MCPDirectoryDiscussionReply_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MCPDirectoryFAQ" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "mcpItemId" TEXT NOT NULL,

    CONSTRAINT "MCPDirectoryFAQ_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MCPDirectoryUpvote" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mcpItemId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "MCPDirectoryUpvote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MCPDirectorySavedMCP" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mcpItemId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "MCPDirectorySavedMCP_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MCPDirectoryClaim" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "mcpItemId" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "MCPDirectoryClaim_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MCPDirectoryReport_reportedMCPItemId_idx" ON "MCPDirectoryReport"("reportedMCPItemId");

-- CreateIndex
CREATE INDEX "MCPDirectoryReport_reporterId_idx" ON "MCPDirectoryReport"("reporterId");

-- CreateIndex
CREATE UNIQUE INDEX "MCPItem_slug_key" ON "MCPItem"("slug");

-- CreateIndex
CREATE INDEX "MCPItem_itemType_idx" ON "MCPItem"("itemType");

-- CreateIndex
CREATE INDEX "MCPItem_slug_idx" ON "MCPItem"("slug");

-- CreateIndex
CREATE INDEX "MCPItem_pricingType_idx" ON "MCPItem"("pricingType");

-- CreateIndex
CREATE INDEX "MCPItem_isFeatured_idx" ON "MCPItem"("isFeatured");

-- CreateIndex
CREATE INDEX "MCPItem_createdAt_idx" ON "MCPItem"("createdAt");

-- CreateIndex
CREATE INDEX "MCPItem_viewCount_idx" ON "MCPItem"("viewCount");

-- CreateIndex
CREATE INDEX "MCPItem_lastUpdatedDate_idx" ON "MCPItem"("lastUpdatedDate");

-- CreateIndex
CREATE INDEX "MCPItem_qualityScore_idx" ON "MCPItem"("qualityScore");

-- CreateIndex
CREATE INDEX "MCPItem_monthlyVisits_idx" ON "MCPItem"("monthlyVisits");

-- CreateIndex
CREATE INDEX "MCPItem_upvoteCount_idx" ON "MCPItem"("upvoteCount");

-- CreateIndex
CREATE UNIQUE INDEX "MCPDirectoryCategory_slug_key" ON "MCPDirectoryCategory"("slug");

-- CreateIndex
CREATE INDEX "MCPDirectoryCategory_slug_idx" ON "MCPDirectoryCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "MCPDirectorySubCategory_slug_key" ON "MCPDirectorySubCategory"("slug");

-- CreateIndex
CREATE INDEX "MCPDirectorySubCategory_categoryId_idx" ON "MCPDirectorySubCategory"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "MCPDirectorySubCategory_slug_categoryId_key" ON "MCPDirectorySubCategory"("slug", "categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "MCPDirectoryTag_slug_key" ON "MCPDirectoryTag"("slug");

-- CreateIndex
CREATE INDEX "MCPDirectoryTag_slug_idx" ON "MCPDirectoryTag"("slug");

-- CreateIndex
CREATE INDEX "MCPItemCategory_categoryId_idx" ON "MCPItemCategory"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "MCPItemCategory_mcpItemId_categoryId_key" ON "MCPItemCategory"("mcpItemId", "categoryId");

-- CreateIndex
CREATE INDEX "MCPItemSubCategory_subCategoryId_idx" ON "MCPItemSubCategory"("subCategoryId");

-- CreateIndex
CREATE UNIQUE INDEX "MCPItemSubCategory_mcpItemId_subCategoryId_key" ON "MCPItemSubCategory"("mcpItemId", "subCategoryId");

-- CreateIndex
CREATE INDEX "MCPItemTag_tagId_idx" ON "MCPItemTag"("tagId");

-- CreateIndex
CREATE UNIQUE INDEX "MCPItemTag_mcpItemId_tagId_key" ON "MCPItemTag"("mcpItemId", "tagId");

-- CreateIndex
CREATE INDEX "TechnicalSpec_mcpItemId_idx" ON "TechnicalSpec"("mcpItemId");

-- CreateIndex
CREATE INDEX "InstallationGuide_mcpItemId_idx" ON "InstallationGuide"("mcpItemId");

-- CreateIndex
CREATE UNIQUE INDEX "InstallationGuide_mcpItemId_stepNumber_key" ON "InstallationGuide"("mcpItemId", "stepNumber");

-- CreateIndex
CREATE INDEX "MCPFeature_mcpItemId_idx" ON "MCPFeature"("mcpItemId");

-- CreateIndex
CREATE INDEX "MCPUseCase_mcpItemId_idx" ON "MCPUseCase"("mcpItemId");

-- CreateIndex
CREATE INDEX "PricingPlan_mcpItemId_idx" ON "PricingPlan"("mcpItemId");

-- CreateIndex
CREATE INDEX "MCPDirectoryReview_mcpItemId_idx" ON "MCPDirectoryReview"("mcpItemId");

-- CreateIndex
CREATE INDEX "MCPDirectoryReview_userId_idx" ON "MCPDirectoryReview"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MCPDirectoryReview_mcpItemId_userId_key" ON "MCPDirectoryReview"("mcpItemId", "userId");

-- CreateIndex
CREATE INDEX "MCPDirectoryEditorialReview_mcpItemId_idx" ON "MCPDirectoryEditorialReview"("mcpItemId");

-- CreateIndex
CREATE INDEX "MCPDirectoryDiscussion_mcpItemId_idx" ON "MCPDirectoryDiscussion"("mcpItemId");

-- CreateIndex
CREATE INDEX "MCPDirectoryDiscussion_userId_idx" ON "MCPDirectoryDiscussion"("userId");

-- CreateIndex
CREATE INDEX "MCPDirectoryDiscussionReply_discussionId_idx" ON "MCPDirectoryDiscussionReply"("discussionId");

-- CreateIndex
CREATE INDEX "MCPDirectoryDiscussionReply_userId_idx" ON "MCPDirectoryDiscussionReply"("userId");

-- CreateIndex
CREATE INDEX "MCPDirectoryFAQ_mcpItemId_idx" ON "MCPDirectoryFAQ"("mcpItemId");

-- CreateIndex
CREATE INDEX "MCPDirectoryUpvote_mcpItemId_idx" ON "MCPDirectoryUpvote"("mcpItemId");

-- CreateIndex
CREATE INDEX "MCPDirectoryUpvote_userId_idx" ON "MCPDirectoryUpvote"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MCPDirectoryUpvote_mcpItemId_userId_key" ON "MCPDirectoryUpvote"("mcpItemId", "userId");

-- CreateIndex
CREATE INDEX "MCPDirectorySavedMCP_mcpItemId_idx" ON "MCPDirectorySavedMCP"("mcpItemId");

-- CreateIndex
CREATE INDEX "MCPDirectorySavedMCP_userId_idx" ON "MCPDirectorySavedMCP"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MCPDirectorySavedMCP_mcpItemId_userId_key" ON "MCPDirectorySavedMCP"("mcpItemId", "userId");

-- CreateIndex
CREATE INDEX "MCPDirectoryClaim_mcpItemId_idx" ON "MCPDirectoryClaim"("mcpItemId");

-- CreateIndex
CREATE INDEX "MCPDirectoryClaim_userId_idx" ON "MCPDirectoryClaim"("userId");

-- AddForeignKey
ALTER TABLE "MCPDirectoryReport" ADD CONSTRAINT "MCPDirectoryReport_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MCPDirectoryReport" ADD CONSTRAINT "MCPDirectoryReport_reportedMCPItemId_fkey" FOREIGN KEY ("reportedMCPItemId") REFERENCES "MCPItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MCPDirectorySubCategory" ADD CONSTRAINT "MCPDirectorySubCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "MCPDirectoryCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MCPItemCategory" ADD CONSTRAINT "MCPItemCategory_mcpItemId_fkey" FOREIGN KEY ("mcpItemId") REFERENCES "MCPItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MCPItemCategory" ADD CONSTRAINT "MCPItemCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "MCPDirectoryCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MCPItemSubCategory" ADD CONSTRAINT "MCPItemSubCategory_mcpItemId_fkey" FOREIGN KEY ("mcpItemId") REFERENCES "MCPItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MCPItemSubCategory" ADD CONSTRAINT "MCPItemSubCategory_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "MCPDirectorySubCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MCPItemTag" ADD CONSTRAINT "MCPItemTag_mcpItemId_fkey" FOREIGN KEY ("mcpItemId") REFERENCES "MCPItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MCPItemTag" ADD CONSTRAINT "MCPItemTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "MCPDirectoryTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechnicalSpec" ADD CONSTRAINT "TechnicalSpec_mcpItemId_fkey" FOREIGN KEY ("mcpItemId") REFERENCES "MCPItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstallationGuide" ADD CONSTRAINT "InstallationGuide_mcpItemId_fkey" FOREIGN KEY ("mcpItemId") REFERENCES "MCPItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MCPFeature" ADD CONSTRAINT "MCPFeature_mcpItemId_fkey" FOREIGN KEY ("mcpItemId") REFERENCES "MCPItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MCPUseCase" ADD CONSTRAINT "MCPUseCase_mcpItemId_fkey" FOREIGN KEY ("mcpItemId") REFERENCES "MCPItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PricingPlan" ADD CONSTRAINT "PricingPlan_mcpItemId_fkey" FOREIGN KEY ("mcpItemId") REFERENCES "MCPItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MCPDirectoryReview" ADD CONSTRAINT "MCPDirectoryReview_mcpItemId_fkey" FOREIGN KEY ("mcpItemId") REFERENCES "MCPItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MCPDirectoryReview" ADD CONSTRAINT "MCPDirectoryReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MCPDirectoryEditorialReview" ADD CONSTRAINT "MCPDirectoryEditorialReview_mcpItemId_fkey" FOREIGN KEY ("mcpItemId") REFERENCES "MCPItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MCPDirectoryDiscussion" ADD CONSTRAINT "MCPDirectoryDiscussion_mcpItemId_fkey" FOREIGN KEY ("mcpItemId") REFERENCES "MCPItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MCPDirectoryDiscussion" ADD CONSTRAINT "MCPDirectoryDiscussion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MCPDirectoryDiscussionReply" ADD CONSTRAINT "MCPDirectoryDiscussionReply_discussionId_fkey" FOREIGN KEY ("discussionId") REFERENCES "MCPDirectoryDiscussion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MCPDirectoryDiscussionReply" ADD CONSTRAINT "MCPDirectoryDiscussionReply_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MCPDirectoryFAQ" ADD CONSTRAINT "MCPDirectoryFAQ_mcpItemId_fkey" FOREIGN KEY ("mcpItemId") REFERENCES "MCPItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MCPDirectoryUpvote" ADD CONSTRAINT "MCPDirectoryUpvote_mcpItemId_fkey" FOREIGN KEY ("mcpItemId") REFERENCES "MCPItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MCPDirectoryUpvote" ADD CONSTRAINT "MCPDirectoryUpvote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MCPDirectorySavedMCP" ADD CONSTRAINT "MCPDirectorySavedMCP_mcpItemId_fkey" FOREIGN KEY ("mcpItemId") REFERENCES "MCPItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MCPDirectorySavedMCP" ADD CONSTRAINT "MCPDirectorySavedMCP_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MCPDirectoryClaim" ADD CONSTRAINT "MCPDirectoryClaim_mcpItemId_fkey" FOREIGN KEY ("mcpItemId") REFERENCES "MCPItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MCPDirectoryClaim" ADD CONSTRAINT "MCPDirectoryClaim_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
