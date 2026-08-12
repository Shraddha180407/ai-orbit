-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "PricingModel" AS ENUM ('FREE', 'FREEMIUM', 'PAID', 'FREE_TRIAL');

-- CreateEnum
CREATE TYPE "BillingFrequency" AS ENUM ('MONTHLY', 'YEARLY', 'ONE_TIME', 'NA');

-- CreateEnum
CREATE TYPE "Availability" AS ENUM ('Available', 'Pre-order', 'Announced', 'Discontinued');

-- CreateEnum
CREATE TYPE "CreatorType" AS ENUM ('EDITORIAL', 'COMMUNITY');

-- CreateEnum
CREATE TYPE "TaskDifficulty" AS ENUM ('EASY', 'MEDIUM', 'ADVANCED');

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT,
    "image" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "emailVerified" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tool" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT,
    "description" TEXT NOT NULL,
    "websiteUrl" TEXT NOT NULL,
    "screenshots" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "features" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "pricingModel" "PricingModel" NOT NULL,
    "pricingAmount" DECIMAL(10,2),
    "billingFrequency" "BillingFrequency" NOT NULL DEFAULT 'NA',
    "isOpenSource" BOOLEAN NOT NULL DEFAULT false,
    "isTrending" BOOLEAN NOT NULL DEFAULT false,
    "companyId" TEXT,
    "avgRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ToolCategory" (
    "toolId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "ToolCategory_pkey" PRIMARY KEY ("toolId","categoryId")
);

-- CreateTable
CREATE TABLE "ToolTag" (
    "toolId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "ToolTag_pkey" PRIMARY KEY ("toolId","tagId")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "toolId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bookmark" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "toolId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIModel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "creator" TEXT NOT NULL,
    "contextWindow" TEXT NOT NULL,
    "parameterSize" TEXT NOT NULL,
    "modality" TEXT NOT NULL,
    "releaseDate" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "providerId" TEXT,

    CONSTRAINT "AIModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Publisher" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "logoUrl" TEXT,
    "faviconUrl" TEXT,
    "colorHex" TEXT,
    "followersLabel" TEXT,
    "credibilityScore" DOUBLE PRECISION NOT NULL DEFAULT 0.8,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Publisher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Topic" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "News" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "dek" TEXT NOT NULL,
    "aiSummary" TEXT NOT NULL,
    "articleUrl" TEXT NOT NULL,
    "publisherId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "filterTags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "downvotes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsBookmark" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NewsBookmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsVote" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NewsVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsComment" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "authorName" TEXT NOT NULL DEFAULT 'Anonymous',
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NewsComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Repository" (
    "id" TEXT NOT NULL,
    "githubId" INTEGER NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "ownerAvatarUrl" TEXT,
    "description" TEXT,
    "url" TEXT NOT NULL,
    "homepage" TEXT,
    "language" TEXT,
    "license" TEXT,
    "topics" TEXT[],
    "stars" INTEGER NOT NULL,
    "forks" INTEGER NOT NULL,
    "openIssues" INTEGER NOT NULL,
    "defaultBranch" TEXT NOT NULL DEFAULT 'main',
    "logoUrl" TEXT,
    "brandColor" TEXT,
    "readmeHtml" TEXT,
    "readmeFetchedAt" TIMESTAMP(3),
    "githubCreatedAt" TIMESTAMP(3) NOT NULL,
    "syncedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Repository_pkey" PRIMARY KEY ("id")
);

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
    "channelId" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "accent" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
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

-- CreateTable
CREATE TABLE "Device" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "availability" "Availability" NOT NULL DEFAULT 'Announced',
    "price" TEXT,
    "year" TEXT NOT NULL,
    "month" TEXT,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "manufacturerLogoUrl" TEXT NOT NULL,
    "mainTask" TEXT NOT NULL,
    "formFactor" TEXT,
    "country" TEXT,
    "ram" TEXT,
    "aiFeatures" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "primaryUseCases" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "additionalInfo" TEXT,
    "buyUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "LeaderboardCompany" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "growth" DOUBLE PRECISION NOT NULL,
    "funding" TEXT NOT NULL,
    "headquarters" TEXT NOT NULL,
    "productsCount" INTEGER NOT NULL,
    "modelsCount" INTEGER NOT NULL,
    "votes" INTEGER NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "saves" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "visits" TEXT NOT NULL,

    CONSTRAINT "LeaderboardCompany_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeaderboardModel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "growth" DOUBLE PRECISION NOT NULL,
    "contextWindow" TEXT NOT NULL,
    "pricing" TEXT NOT NULL,
    "eloRating" INTEGER NOT NULL,
    "benchmarkScore" DOUBLE PRECISION NOT NULL,
    "openSource" BOOLEAN NOT NULL,
    "votes" INTEGER NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "saves" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "visits" TEXT NOT NULL,

    CONSTRAINT "LeaderboardModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeaderboardTool" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "growth" DOUBLE PRECISION NOT NULL,
    "votes" INTEGER NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "saves" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "pricing" TEXT NOT NULL,
    "visits" TEXT NOT NULL,
    "addedDate" TEXT NOT NULL,

    CONSTRAINT "LeaderboardTool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ToolHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "toolId" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ToolHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Collection" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isCurated" BOOLEAN NOT NULL DEFAULT false,
    "creatorType" "CreatorType" NOT NULL DEFAULT 'COMMUNITY',
    "toolCount" INTEGER NOT NULL DEFAULT 0,
    "creatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollectionCategory" (
    "id" TEXT NOT NULL,
    "categoryName" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,

    CONSTRAINT "CollectionCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollectionTool" (
    "id" TEXT NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "collectionId" TEXT NOT NULL,
    "toolId" TEXT NOT NULL,

    CONSTRAINT "CollectionTool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollectionModel" (
    "id" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,

    CONSTRAINT "CollectionModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollectionCompany" (
    "id" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "CollectionCompany_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollectionBookmark" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "collectionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "CollectionBookmark_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reporterId" TEXT NOT NULL,
    "reportedUserId" TEXT,
    "reportedToolId" TEXT,
    "reportedNewsId" TEXT,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LinkBookmark" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "LinkBookmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ToolAlternatives" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ToolAlternatives_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_NewsToTopic" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_NewsToTopic_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_slug_key" ON "Company"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Tool_slug_key" ON "Tool"("slug");

-- CreateIndex
CREATE INDEX "Tool_companyId_idx" ON "Tool"("companyId");

-- CreateIndex
CREATE INDEX "Tool_pricingModel_idx" ON "Tool"("pricingModel");

-- CreateIndex
CREATE INDEX "Tool_createdAt_idx" ON "Tool"("createdAt");

-- CreateIndex
CREATE INDEX "Tool_avgRating_idx" ON "Tool"("avgRating");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_slug_key" ON "Tag"("slug");

-- CreateIndex
CREATE INDEX "ToolCategory_categoryId_idx" ON "ToolCategory"("categoryId");

-- CreateIndex
CREATE INDEX "ToolTag_tagId_idx" ON "ToolTag"("tagId");

-- CreateIndex
CREATE INDEX "Review_toolId_idx" ON "Review"("toolId");

-- CreateIndex
CREATE INDEX "Review_userId_idx" ON "Review"("userId");

-- CreateIndex
CREATE INDEX "Review_rating_idx" ON "Review"("rating");

-- CreateIndex
CREATE UNIQUE INDEX "Review_toolId_userId_key" ON "Review"("toolId", "userId");

-- CreateIndex
CREATE INDEX "Bookmark_toolId_idx" ON "Bookmark"("toolId");

-- CreateIndex
CREATE INDEX "Bookmark_userId_idx" ON "Bookmark"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_toolId_userId_key" ON "Bookmark"("toolId", "userId");

-- CreateIndex
CREATE INDEX "AIModel_providerId_idx" ON "AIModel"("providerId");

-- CreateIndex
CREATE UNIQUE INDEX "Publisher_domain_key" ON "Publisher"("domain");

-- CreateIndex
CREATE INDEX "Publisher_name_idx" ON "Publisher"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Topic_name_key" ON "Topic"("name");

-- CreateIndex
CREATE UNIQUE INDEX "News_slug_key" ON "News"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "News_articleUrl_key" ON "News"("articleUrl");

-- CreateIndex
CREATE INDEX "News_publishedAt_idx" ON "News"("publishedAt");

-- CreateIndex
CREATE INDEX "News_publisherId_idx" ON "News"("publisherId");

-- CreateIndex
CREATE INDEX "News_category_idx" ON "News"("category");

-- CreateIndex
CREATE UNIQUE INDEX "NewsBookmark_articleId_clientId_key" ON "NewsBookmark"("articleId", "clientId");

-- CreateIndex
CREATE UNIQUE INDEX "NewsVote_articleId_clientId_key" ON "NewsVote"("articleId", "clientId");

-- CreateIndex
CREATE INDEX "NewsComment_articleId_idx" ON "NewsComment"("articleId");

-- CreateIndex
CREATE UNIQUE INDEX "Repository_githubId_key" ON "Repository"("githubId");

-- CreateIndex
CREATE UNIQUE INDEX "Repository_slug_key" ON "Repository"("slug");

-- CreateIndex
CREATE INDEX "Repository_stars_idx" ON "Repository"("stars");

-- CreateIndex
CREATE INDEX "Repository_language_idx" ON "Repository"("language");

-- CreateIndex
CREATE INDEX "Repository_topics_idx" ON "Repository" USING GIN ("topics");

-- CreateIndex
CREATE INDEX "Repository_syncedAt_idx" ON "Repository"("syncedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Video_slug_key" ON "Video"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Video_youtubeId_key" ON "Video"("youtubeId");

-- CreateIndex
CREATE INDEX "Video_toolCategory_idx" ON "Video"("toolCategory");

-- CreateIndex
CREATE INDEX "Video_publishedAt_idx" ON "Video"("publishedAt");

-- CreateIndex
CREATE INDEX "Video_views_idx" ON "Video"("views");

-- CreateIndex
CREATE UNIQUE INDEX "Device_slug_key" ON "Device"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE INDEX "ToolHistory_userId_idx" ON "ToolHistory"("userId");

-- CreateIndex
CREATE INDEX "ToolHistory_toolId_idx" ON "ToolHistory"("toolId");

-- CreateIndex
CREATE UNIQUE INDEX "ToolHistory_userId_toolId_key" ON "ToolHistory"("userId", "toolId");

-- CreateIndex
CREATE UNIQUE INDEX "Collection_slug_key" ON "Collection"("slug");

-- CreateIndex
CREATE INDEX "Collection_creatorId_idx" ON "Collection"("creatorId");

-- CreateIndex
CREATE INDEX "Collection_isFeatured_idx" ON "Collection"("isFeatured");

-- CreateIndex
CREATE INDEX "Collection_updatedAt_idx" ON "Collection"("updatedAt");

-- CreateIndex
CREATE INDEX "CollectionCategory_categoryName_idx" ON "CollectionCategory"("categoryName");

-- CreateIndex
CREATE UNIQUE INDEX "CollectionTool_collectionId_toolId_key" ON "CollectionTool"("collectionId", "toolId");

-- CreateIndex
CREATE UNIQUE INDEX "CollectionModel_collectionId_modelId_key" ON "CollectionModel"("collectionId", "modelId");

-- CreateIndex
CREATE UNIQUE INDEX "CollectionCompany_collectionId_companyId_key" ON "CollectionCompany"("collectionId", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "CollectionBookmark_userId_collectionId_key" ON "CollectionBookmark"("userId", "collectionId");

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

-- CreateIndex
CREATE INDEX "LinkBookmark_userId_idx" ON "LinkBookmark"("userId");

-- CreateIndex
CREATE INDEX "_ToolAlternatives_B_index" ON "_ToolAlternatives"("B");

-- CreateIndex
CREATE INDEX "_NewsToTopic_B_index" ON "_NewsToTopic"("B");

-- AddForeignKey
ALTER TABLE "Tool" ADD CONSTRAINT "Tool_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToolCategory" ADD CONSTRAINT "ToolCategory_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToolCategory" ADD CONSTRAINT "ToolCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToolTag" ADD CONSTRAINT "ToolTag_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToolTag" ADD CONSTRAINT "ToolTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIModel" ADD CONSTRAINT "AIModel_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_publisherId_fkey" FOREIGN KEY ("publisherId") REFERENCES "Publisher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsBookmark" ADD CONSTRAINT "NewsBookmark_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "News"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsVote" ADD CONSTRAINT "NewsVote_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "News"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsComment" ADD CONSTRAINT "NewsComment_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "News"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToolHistory" ADD CONSTRAINT "ToolHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToolHistory" ADD CONSTRAINT "ToolHistory_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionCategory" ADD CONSTRAINT "CollectionCategory_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionTool" ADD CONSTRAINT "CollectionTool_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionTool" ADD CONSTRAINT "CollectionTool_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionModel" ADD CONSTRAINT "CollectionModel_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionModel" ADD CONSTRAINT "CollectionModel_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "AIModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionCompany" ADD CONSTRAINT "CollectionCompany_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionCompany" ADD CONSTRAINT "CollectionCompany_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionBookmark" ADD CONSTRAINT "CollectionBookmark_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionBookmark" ADD CONSTRAINT "CollectionBookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reportedUserId_fkey" FOREIGN KEY ("reportedUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reportedToolId_fkey" FOREIGN KEY ("reportedToolId") REFERENCES "Tool"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reportedNewsId_fkey" FOREIGN KEY ("reportedNewsId") REFERENCES "News"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LinkBookmark" ADD CONSTRAINT "LinkBookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ToolAlternatives" ADD CONSTRAINT "_ToolAlternatives_A_fkey" FOREIGN KEY ("A") REFERENCES "Tool"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ToolAlternatives" ADD CONSTRAINT "_ToolAlternatives_B_fkey" FOREIGN KEY ("B") REFERENCES "Tool"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NewsToTopic" ADD CONSTRAINT "_NewsToTopic_A_fkey" FOREIGN KEY ("A") REFERENCES "News"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NewsToTopic" ADD CONSTRAINT "_NewsToTopic_B_fkey" FOREIGN KEY ("B") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

