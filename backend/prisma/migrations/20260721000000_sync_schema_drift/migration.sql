-- CreateEnum
CREATE TYPE "CreatorType" AS ENUM ('EDITORIAL', 'COMMUNITY');

-- AlterTable: Tool — add isOpenSource, isTrending
ALTER TABLE "Tool" ADD COLUMN "isOpenSource" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "isTrending" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable: Account
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

-- CreateTable: Session
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable: VerificationToken
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable: LeaderboardCompany
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

-- CreateTable: LeaderboardModel
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

-- CreateTable: LeaderboardTool
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

-- CreateTable: Collection
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

-- CreateTable: CollectionCategory
CREATE TABLE "CollectionCategory" (
    "id" TEXT NOT NULL,
    "categoryName" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,

    CONSTRAINT "CollectionCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable: CollectionTool
CREATE TABLE "CollectionTool" (
    "id" TEXT NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "collectionId" TEXT NOT NULL,
    "toolId" TEXT NOT NULL,

    CONSTRAINT "CollectionTool_pkey" PRIMARY KEY ("id")
);

-- CreateTable: CollectionModel
CREATE TABLE "CollectionModel" (
    "id" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,

    CONSTRAINT "CollectionModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable: CollectionCompany
CREATE TABLE "CollectionCompany" (
    "id" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "CollectionCompany_pkey" PRIMARY KEY ("id")
);

-- CreateTable: CollectionBookmark
CREATE TABLE "CollectionBookmark" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "collectionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "CollectionBookmark_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");
CREATE UNIQUE INDEX "Collection_slug_key" ON "Collection"("slug");
CREATE INDEX "Collection_creatorId_idx" ON "Collection"("creatorId");
CREATE INDEX "Collection_isFeatured_idx" ON "Collection"("isFeatured");
CREATE INDEX "Collection_updatedAt_idx" ON "Collection"("updatedAt");
CREATE INDEX "CollectionCategory_categoryName_idx" ON "CollectionCategory"("categoryName");
CREATE UNIQUE INDEX "CollectionTool_collectionId_toolId_key" ON "CollectionTool"("collectionId", "toolId");
CREATE UNIQUE INDEX "CollectionModel_collectionId_modelId_key" ON "CollectionModel"("collectionId", "modelId");
CREATE UNIQUE INDEX "CollectionCompany_collectionId_companyId_key" ON "CollectionCompany"("collectionId", "companyId");
CREATE UNIQUE INDEX "CollectionBookmark_userId_collectionId_key" ON "CollectionBookmark"("userId", "collectionId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CollectionCategory" ADD CONSTRAINT "CollectionCategory_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CollectionTool" ADD CONSTRAINT "CollectionTool_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CollectionTool" ADD CONSTRAINT "CollectionTool_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "Tool"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CollectionModel" ADD CONSTRAINT "CollectionModel_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CollectionModel" ADD CONSTRAINT "CollectionModel_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "AIModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CollectionCompany" ADD CONSTRAINT "CollectionCompany_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CollectionCompany" ADD CONSTRAINT "CollectionCompany_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CollectionBookmark" ADD CONSTRAINT "CollectionBookmark_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CollectionBookmark" ADD CONSTRAINT "CollectionBookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
